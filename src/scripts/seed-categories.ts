/**
 * Default Categories Seeding Script
 * Seeds default categories for a user
 * 
 * Usage: npm run seed:categories -- <userId>
 * Or: tsx src/scripts/seed-categories.ts <userId>
 */

import { connectDB } from '@/lib/database/connection';
import { seedDefaultCategories } from '@/lib/services/categories.service';
import { loggerService } from '@/lib/services/logger.service';
import { DEFAULT_CATEGORIES } from '@/lib/constants/default-categories';

/**
 * Main seeding function
 */
async function main() {
  try {
    // Get userId from command line arguments
    const userId = process.argv[2];

    if (!userId) {
      console.error('❌ Error: User ID is required');
      console.log('\nUsage:');
      console.log('  npm run seed:categories -- <userId>');
      console.log('  tsx src/scripts/seed-categories.ts <userId>');
      console.log('\nExample:');
      console.log('  npm run seed:categories -- 507f1f77bcf86cd799439011');
      process.exit(1);
    }

    // Validate userId format (MongoDB ObjectId)
    if (!/^[0-9a-fA-F]{24}$/.test(userId)) {
      console.error('❌ Error: Invalid user ID format. Must be a valid MongoDB ObjectId (24 hex characters)');
      process.exit(1);
    }

    console.log('🌱 Starting category seeding...');
    console.log(`📋 User ID: ${userId}`);
    console.log(`📊 Categories to seed: ${DEFAULT_CATEGORIES.length}\n`);

    // Connect to database
    await connectDB();
    console.log('✅ Database connected\n');

    // Seed default categories
    const result = await seedDefaultCategories(userId, DEFAULT_CATEGORIES);

    console.log('\n✅ Category seeding completed!');
    console.log(`📈 Created: ${result.created} categories`);
    console.log(`🔄 Skipped: ${result.skipped} categories (already exist)`);
    console.log(`📝 Total: ${result.total} categories\n`);

    if (result.created > 0) {
      console.log('✨ New categories created:');
      result.createdCategories.forEach((cat) => {
        console.log(`   - ${cat.icon || ''} ${cat.name} (${cat.type})`);
      });
      console.log('');
    }

    if (result.skipped > 0) {
      console.log('ℹ️  Existing categories skipped:');
      result.skippedCategories.forEach((cat) => {
        console.log(`   - ${cat.icon || ''} ${cat.name} (${cat.type})`);
      });
      console.log('');
    }

    loggerService.info('Category seeding completed', 'seed', {
      userId,
      created: result.created,
      skipped: result.skipped,
      total: result.total,
    });

    process.exit(0);
  } catch (error) {
    console.error('\n❌ Error seeding categories:');
    console.error(error);

    loggerService.error('Category seeding failed', error as Error, {
      userId: process.argv[2],
    });

    process.exit(1);
  }
}

// Run the script
main();

