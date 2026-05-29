# -------------------------------------------------------------
# SHUBHANU Infrastructure - Terraform Variables
# -------------------------------------------------------------

variable "aws_region" {
  type        = string
  description = "The target AWS Region for EKS cluster deployment"
  default     = "ap-south-1" # Mumbai Region (localized for PCCOE, Pune!)
}
