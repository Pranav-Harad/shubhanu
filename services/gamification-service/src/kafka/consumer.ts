import { Kafka } from 'kafkajs';
import { Redis } from 'ioredis';
import { PrismaClient } from '@prisma/client';
import dotenv from 'dotenv';

dotenv.config();

const prisma = new PrismaClient();
const redis = new Redis(process.env.REDIS_URL || 'redis://:redis_password_secure_2026@localhost:6379');

const kafka = new Kafka({
  clientId: 'shubhanu-gamification-worker',
  brokers: [process.env.KAFKA_BROKER || 'localhost:29092'],
});

const consumer = kafka.consumer({ groupId: 'gamification-group' });

interface ChapterCompletedPayload {
  child_id: string;
  final_score: number;
  world_id: number;
  chapter_id: number;
  badge_unlocked?: string;
}

// Streak Calculator using Redis
const updateStreak = async (childId: string): Promise<number> => {
  const streakKey = `child_streak:${childId}`;
  const lastActiveKey = `child_last_active:${childId}`;

  const todayStr = new Date().toISOString().split('T')[0]; // "YYYY-MM-DD"
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  const yesterdayStr = yesterday.toISOString().split('T')[0];

  const lastActive = await redis.get(lastActiveKey);
  const currentStreakRaw = await redis.get(streakKey);
  let streak = currentStreakRaw ? parseInt(currentStreakRaw) : 0;

  if (lastActive === todayStr) {
    // Already played today, streak remains unchanged
    return streak;
  } else if (lastActive === yesterdayStr) {
    // Played yesterday, streak increments!
    streak += 1;
  } else {
    // Broke streak (no activity yesterday). Check for simulated streak shields, or reset.
    const hasShield = await redis.get(`child_streak_shield:${childId}`);
    if (hasShield === 'true') {
      console.log(`🛡️ Streak shield active for child: ${childId}! Streak preserved.`);
      await redis.del(`child_streak_shield:${childId}`); // Consume shield
    } else {
      streak = 1; // Reset to day 1
    }
  }

  // Update Redis keys
  await redis.set(streakKey, streak.toString());
  await redis.set(lastActiveKey, todayStr);

  return streak;
};

export const startKafkaConsumer = async () => {
  try {
    await consumer.connect();
    console.log('🔌 Successfully connected to Apache Kafka Broker!');

    await consumer.subscribe({ topic: 'chapter.completed', fromBeginning: false });
    console.log("📥 Subscribed to Kafka topic: 'chapter.completed'");

    await consumer.run({
      eachMessage: async ({ topic, partition, message }) => {
        if (!message.value) return;
        
        try {
          const payload: ChapterCompletedPayload = JSON.parse(message.value.toString());
          console.log(`📦 Received Event [chapter.completed] from partition: ${partition}`);
          console.log(payload);

          const { child_id, final_score, badge_unlocked } = payload;

          // 1. Calculate XP Award values
          const baseXp = 300;
          const scoreBonus = Math.round(final_score * 200); // Up to +200 bonus
          const xpAwarded = baseXp + scoreBonus;
          const gemsAwarded = 20 + Math.round(final_score * 10);

          // 2. Calculate daily streak via Redis
          const streakDays = await updateStreak(child_id);

          // 3. Update ChildProgress in PostgreSQL using Prisma
          const progress = await prisma.childProgress.upsert({
            where: { childId: child_id },
            update: {
              totalXp: { increment: xpAwarded },
              streakDays,
              storyGems: { increment: gemsAwarded },
              lastActiveDate: new Date(),
            },
            create: {
              childId: child_id,
              totalXp: xpAwarded,
              streakDays,
              storyGems: gemsAwarded,
            },
          });

          console.log(`✨ Progress updated in PG. Total XP: ${progress.totalXp}, Streaks: ${progress.streakDays}`);

          // 4. Award milestone badge if score matches or specified
          if (badge_unlocked || final_score >= 0.8) {
            const badgeName = badge_unlocked || 'Math Wizard';
            
            // Check if badge already exists
            const existingBadge = await prisma.badge.findFirst({
              where: { childId: child_id, badgeName },
            });

            if (!existingBadge) {
              const newBadge = await prisma.badge.create({
                data: {
                  childId: child_id,
                  badgeName,
                  description: `Mastered Chapter 1 locks with a score of ${Math.round(final_score * 100)}%!`,
                  icon: '🧙‍♂️',
                },
              });
              console.log(`🏅 Badge unlocked: '${newBadge.badgeName}' for child: ${child_id}`);
            }
          }

        } catch (parseErr) {
          console.error('❌ Failed to parse or execute Kafka transaction payload:', parseErr);
        }
      },
    });

  } catch (err) {
    console.error('❌ Failed to start Apache Kafka consumer loops:', err);
  }
};

export const stopKafkaConsumer = async () => {
  await consumer.disconnect();
  await redis.disconnect();
};
