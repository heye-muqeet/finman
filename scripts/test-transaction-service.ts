/**
 * Test Transaction Service
 * Script to test transaction service CRUD operations
 */

import { connectDB, disconnectDB } from '@/lib/database/connection';
import {
  createTransaction,
  getTransactions,
  getTransactionById,
  updateTransaction,
  deleteTransaction,
} from '@/lib/services/transactions.service';
import { User } from '@/models/User';
import { Category } from '@/models/Category';

async function testTransactionService() {
  try {
    console.log('🔌 Connecting to database...');
    await connectDB();

    // Get or create a test user
    let testUser = await User.findOne({ email: 'test@example.com' });
    if (!testUser) {
      console.log('👤 Creating test user...');
      testUser = new User({
        email: 'test@example.com',
        password: 'hashedpassword',
        firstName: 'Test',
        lastName: 'User',
      });
      await testUser.save();
    }
    const userId = testUser._id.toString();
    console.log(`✅ Using test user: ${userId}`);

    // Get or create a test category
    let testCategory = await Category.findOne({
      userId: testUser._id,
      name: 'Test Category',
    });
    if (!testCategory) {
      console.log('📁 Creating test category...');
      testCategory = new Category({
        userId: testUser._id,
        name: 'Test Category',
        type: 'expense',
      });
      await testCategory.save();
    }
    const categoryId = testCategory._id.toString();
    console.log(`✅ Using test category: ${categoryId}`);

    // Test 1: Create Transaction
    console.log('\n📝 Test 1: Creating transaction...');
    const createInput = {
      type: 'expense' as const,
      amount: 100.50,
      currency: 'USD',
      categoryId,
      description: 'Test transaction',
      date: new Date(),
      paymentMethod: 'card' as const,
      tags: ['test', 'food'],
    };
    const created = await createTransaction(userId, createInput);
    console.log('✅ Transaction created:', created.transaction._id);
    const transactionId = created.transaction._id;

    // Test 2: Get Transaction by ID
    console.log('\n🔍 Test 2: Getting transaction by ID...');
    const retrieved = await getTransactionById(userId, transactionId);
    console.log('✅ Transaction retrieved:', {
      id: retrieved.transaction._id,
      amount: retrieved.transaction.amount,
      type: retrieved.transaction.type,
    });

    // Test 3: Get Transactions with filters
    console.log('\n📋 Test 3: Getting transactions with filters...');
    const filtered = await getTransactions(userId, {
      filters: {
        type: 'expense',
        minAmount: 50,
      },
      page: 1,
      limit: 10,
      sortBy: 'date',
      sortOrder: 'desc',
    });
    console.log(`✅ Found ${filtered.total} transactions (${filtered.transactions.length} on page)`);

    // Test 4: Update Transaction
    console.log('\n✏️ Test 4: Updating transaction...');
    const updated = await updateTransaction(userId, transactionId, {
      amount: 150.75,
      description: 'Updated test transaction',
    });
    console.log('✅ Transaction updated:', {
      id: updated.transaction._id,
      newAmount: updated.transaction.amount,
      newDescription: updated.transaction.description,
    });

    // Test 5: Delete Transaction
    console.log('\n🗑️ Test 5: Deleting transaction...');
    await deleteTransaction(userId, transactionId);
    console.log('✅ Transaction deleted');

    // Verify deletion
    try {
      await getTransactionById(userId, transactionId);
      console.log('❌ ERROR: Transaction still exists after deletion!');
    } catch (error: any) {
      if (error.message.includes('not found')) {
        console.log('✅ Transaction successfully deleted (verified)');
      } else {
        throw error;
      }
    }

    console.log('\n🎉 All tests passed!');
  } catch (error) {
    console.error('❌ Test failed:', error);
    throw error;
  } finally {
    await disconnectDB();
    console.log('\n🔌 Disconnected from database');
  }
}

// Run tests
testTransactionService().catch(console.error);

