# -------------------------------------------------------------
# SHUBHANU AWS Cloud Infrastructure - Terraform IaC Configuration
# Provisions complete production EKS VPC, DBs, and storage
# -------------------------------------------------------------

terraform {
  required_version = ">= 1.5.0"
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
  }
}

provider "aws" {
  region = var.aws_region
}

# =============================================================
# 1. VPC NETWORKING (Isolated subnets, NAT Gateways for pods)
# =============================================================
module "vpc" {
  source  = "terraform-aws-modules/vpc/aws"
  version = "~> 5.0"

  name = "shubhanu-prod-vpc"
  cidr = "10.0.0.0/16"

  azs             = ["${var.aws_region}a", "${var.aws_region}b"]
  private_subnets = ["10.0.1.0/24", "10.0.2.0/24"]
  public_subnets  = ["10.0.101.0/24", "10.0.102.0/24"]

  enable_nat_gateway = true
  single_nat_gateway = true # Cost-efficiency optimization

  public_subnet_tags = {
    "kubernetes.io/role/elb" = "1"
  }
  private_subnet_tags = {
    "kubernetes.io/role/internal-elb" = "1"
  }
}

# =============================================================
# 2. AWS EKS KUBERNETES CLUSTER & NODE GROUPS
# =============================================================
resource "aws_eks_cluster" "eks" {
  name     = "shubhanu-eks-cluster"
  role_arn = aws_iam_role.eks_role.arn

  vpc_config {
    subnet_ids = module.vpc.private_subnet_ids
  }

  depends_on = [aws_iam_role_policy_attachment.eks_policy]
}

# General Purpose Worker Node Group (CPU services)
resource "aws_eks_node_group" "cpu_nodes" {
  cluster_name    = aws_eks_cluster.eks.name
  node_group_name = "shubhanu-cpu-workers"
  node_role_arn   = aws_iam_role.node_role.arn
  subnet_ids      = module.vpc.private_subnet_ids

  scaling_config {
    desired_size = 3
    max_size     = 6
    min_size     = 2
  }

  instance_types = ["t3.medium"]

  depends_on = [aws_iam_role_policy_attachment.node_policy]
}

# Specialized GPU Node Group (DreamBooth / SAM2 diffusers PyTorch)
resource "aws_eks_node_group" "gpu_nodes" {
  cluster_name    = aws_eks_cluster.eks.name
  node_group_name = "shubhanu-gpu-workers"
  node_role_arn   = aws_iam_role.node_role.arn
  subnet_ids      = module.vpc.private_subnet_ids

  scaling_config {
    desired_size = 1
    max_size     = 3
    min_size     = 0 # Scales down to 0 to save massive GPU costs when idle!
  }

  instance_types = ["g4dn.xlarge"] # Nvidia T4 GPU (16GB VRAM)

  labels = {
    accelerator = "nvidia"
  }

  taint {
    key    = "gpu"
    value  = "true"
    effect = "NO_SCHEDULE"
  }

  depends_on = [aws_iam_role_policy_attachment.node_policy]
}

# =============================================================
# 3. AWS RDS POSTGRESQL CLUSTER (Multi-Service databases)
# =============================================================
resource "aws_db_instance" "postgres" {
  identifier           = "shubhanu-postgres-prod"
  engine               = "postgres"
  engine_version       = "15.4"
  instance_class       = "db.t3.medium"
  allocated_storage    = 20
  db_name              = "shubhanu_root"
  username             = "shubhanu_admin"
  password             = "admin_password_secure_2026"
  db_subnet_group_name = aws_db_subnet_group.db_subnets.name
  skip_final_snapshot  = true
}

resource "aws_db_subnet_group" "db_subnets" {
  name       = "shubhanu-db-subnet-group"
  subnet_ids = module.vpc.private_subnet_ids
}

# =============================================================
# 4. AWS EL弾ASTICACHE REDIS CLUSTER (streaks & session cache)
# =============================================================
resource "aws_elasticache_cluster" "redis" {
  cluster_id           = "shubhanu-redis-prod"
  engine               = "redis"
  node_type            = "cache.t3.medium"
  num_cache_nodes      = 1
  parameter_group_name = "default.redis7"
  port                 = 6379
  subnet_group_name    = aws_elasticache_subnet_group.redis_subnets.name
}

resource "aws_elasticache_subnet_group" "redis_subnets" {
  name       = "shubhanu-redis-subnet-group"
  subnet_ids = module.vpc.private_subnet_ids
}

# =============================================================
# 5. AWS S3 BUCKET & CLOUDFRONT CDN (custom AI Avatars)
# =============================================================
resource "aws_s3_bucket" "avatars" {
  bucket        = "shubhanu-avatar-storage-bucket"
  force_destroy = true
}

resource "aws_cloudfront_distribution" "cdn" {
  origin {
    domain_name = aws_s3_bucket.avatars.bucket_regional_domain_name
    origin_id   = "S3-Shubhanu-Avatars"
  }

  enabled             = true
  is_ipv6_enabled     = true
  default_root_object = "index.html"

  default_cache_behavior {
    allowed_methods  = ["GET", "HEAD", "OPTIONS"]
    cached_methods   = ["GET", "HEAD"]
    target_origin_id = "S3-Shubhanu-Avatars"

    forwarded_values {
      query_string = false
      cookies {
        forward = "none"
      }
    }

    viewer_protocol_policy = "redirect-to-https"
    min_ttl                = 0
    default_ttl            = 3600
    max_ttl                = 86400
  }

  restrictions {
    geo_restriction {
      restriction_type = "none"
    }
  }

  viewer_certificate {
    cloudfront_default_certificate = true
  }
}

# =============================================================
# 6. IAM ROLE SKELETON DEFINITIONS (EKS & Nodes Permissions)
# =============================================================
resource "aws_iam_role" "eks_role" {
  name = "shubhanu-eks-cluster-role"

  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Action = "sts:AssumeRole"
        Effect = "Allow"
        Principal = {
          Service = "eks.amazonaws.com"
        }
      }
    ]
  })
}

resource "aws_iam_role_policy_attachment" "eks_policy" {
  policy_arn = "arn:aws:iam::aws:policy/AmazonEKSClusterPolicy"
  role       = aws_iam_role.eks_role.name
}

resource "aws_iam_role" "node_role" {
  name = "shubhanu-eks-node-role"

  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Action = "sts:AssumeRole"
        Effect = "Allow"
        Principal = {
          Service = "ec2.amazonaws.com"
        }
      }
    ]
  })
}

resource "aws_iam_role_policy_attachment" "node_policy" {
  for_each = toset([
    "arn:aws:iam::aws:policy/AmazonEKSWorkerNodePolicy",
    "arn:aws:iam::aws:policy/AmazonEKS_CNI_Policy",
    "arn:aws:iam::aws:policy/AmazonEC2ContainerRegistryReadOnly"
  ])

  policy_arn = each.value
  role       = aws_iam_role.node_role.name
}
