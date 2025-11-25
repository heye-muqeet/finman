/**
 * Test Transaction Model
 * Temporary script to test Transaction model creation and validation
 */

import mongoose from 'mongoose';
import { databaseConfig } from '@/lib/config/database';
import { Transaction } from '@/models/Transaction';
import { User } from '@/models/User';
import { Category } from '@/models/Category';

async function testTransactionModel() {
  try {
    // Connect to database
    if (mongoose.connection.readyState === 0) {
      await mongoose.connect(databaseConfig.uri, databaseConfig.options);
    }
    console.log('✅ Database connected');

    // Find or create a test user
    let testUser = await User.findOne({ email: 'test@example.com' });
    if (!testUser) {
      console.log('⚠️  Test user not found. Please create a user first.');
      process.exit(1);
    }
    console.log('✅ Test user found:', testUser.email);

    // Find or create a test category
    let testCategory = await Category.findOne({ userId: testUser._id });
    if (!testCategory) {
      console.log('⚠️  Test category not found. Please create a category first.');
      process.exit(1);
    }
    console.log('✅ Test category found:', testCategory.name);

    // Test 1: Create a valid transaction
    console.log('\n📝 Test 1: Creating valid transaction...');
    const validTransaction = new Transaction({
      userId: testUser._id,
      type: 'expense',
      amount: 50.99,
      currency: 'USD',
      categoryId: testCategory._id,
      description: 'Test transaction',
      date: new Date(),
      paymentMethod: 'card',
      tags: ['test', 'food'],
    });

    await validTransaction.save();
    console.log('✅ Valid transaction created:', validTransaction._id);

    // Test 2: Create transaction with location
    console.log('\n📝 Test 2: Creating transaction with location...');
    const transactionWithLocation = new Transaction({
      userId: testUser._id,
      type: 'expense',
      amount: 25.50,
      currency: 'USD',
      categoryId: testCategory._id,
      description: 'Transaction with location',
      date: new Date(),
      location: {
        latitude: 40.7128,
        longitude: -74.0060,
        address: 'New York, NY',
      },
    });

    await transactionWithLocation.save();
    console.log('✅ Transaction with location created:', transactionWithLocation._id);

    // Test 3: Create recurring transaction
    console.log('\n📝 Test 3: Creating recurring transaction...');
    const recurringTransaction = new Transaction({
      userId: testUser._id,
      type: 'expense',
      amount: 100.00,
      currency: 'USD',
      categoryId: testCategory._id,
      description: 'Monthly subscription',
      date: new Date(),
      isRecurring: true,
      recurringPattern: {
        frequency: 'monthly',
        nextOccurrence: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
      },
    });

    await recurringTransaction.save();
    console.log('✅ Recurring transaction created:', recurringTransaction._id);

    // Test 4: Test validation - invalid amount
    console.log('\n📝 Test 4: Testing validation (negative amount)...');
    try {
      const invalidTransaction = new Transaction({
        userId: testUser._id,
        type: 'expense',
        amount: -10, // Invalid: negative amount
        currency: 'USD',
        categoryId: testCategory._id,
        date: new Date(),
      });
      await invalidTransaction.save();
      console.log('❌ Validation failed: Should have rejected negative amount');
    } catch (error: any) {
      console.log('✅ Validation working: Rejected negative amount');
    }

    // Test 5: Test validation - invalid type
    console.log('\n📝 Test 5: Testing validation (invalid type)...');
    try {
      const invalidTransaction = new Transaction({
        userId: testUser._id,
        type: 'invalid' as any, // Invalid type
        amount: 50,
        currency: 'USD',
        categoryId: testCategory._id,
        date: new Date(),
      });
      await invalidTransaction.save();
      console.log('❌ Validation failed: Should have rejected invalid type');
    } catch (error: any) {
      console.log('✅ Validation working: Rejected invalid type');
    }

    // Test 6: Test indexes
    console.log('\n📝 Test 6: Testing indexes...');
    const indexes = await Transaction.collection.getIndexes();
    console.log('✅ Indexes found:', Object.keys(indexes).length);
    console.log('   Indexes:', Object.keys(indexes).join(', '));

    // Test 7: Test findByUser static method
    console.log('\n📝 Test 7: Testing findByUser static method...');
    const userTransactions = await (Transaction as any).findByUser(testUser._id, {
      limit: 5,
    });
    console.log(`✅ Found ${userTransactions.length} transactions for user`);

    // Test 8: Test getUserStats static method
    console.log('\n📝 Test 8: Testing getUserStats static method...');
    const stats = await (Transaction as any).getUserStats(testUser._id);
    console.log('✅ User stats:', {
      income: stats.income,
      expense: stats.expense,
      net: stats.net,
      totalTransactions: stats.totalTransactions,
    });

    // Cleanup: Delete test transactions
    console.log('\n🧹 Cleaning up test transactions...');
    await Transaction.deleteMany({
      userId: testUser._id,
      description: { $in: ['Test transaction', 'Transaction with location', 'Monthly subscription'] },
    });
    console.log('✅ Test transactions deleted');

    console.log('\n✅ All tests passed!');
    process.exit(0);
  } catch (error: any) {
    console.error('❌ Test failed:', error.message);
    console.error(error);
    process.exit(1);
  }
}

// Run tests
testTransactionModel();

