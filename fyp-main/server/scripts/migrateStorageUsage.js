/**
 * Migration Script: Calculate and Update Storage Usage for Existing Users
 * 
 * This script:
 * 1. Finds all users in the database
 * 2. Calculates their actual storage usage from uploaded files
 * 3. Updates their storageUsed field
 * 4. Ensures storageQuota is set to 5GB if not already set
 * 
 * Run this script once after implementing the storage quota system
 * to sync existing data.
 * 
 * Usage: node server/scripts/migrateStorageUsage.js
 */

const mongoose = require('mongoose');
const User = require('../models/User.model');
const File = require('../models/File.model');
require('dotenv').config();

// Storage constants
const DEFAULT_QUOTA = 5 * 1024 * 1024 * 1024; // 5GB in bytes

// Helper function to format bytes
function formatBytes(bytes) {
  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

async function migrateStorageUsage() {
  try {
    console.log('🚀 Starting storage usage migration...\n');

    // Connect to MongoDB
    const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/fyp';
    await mongoose.connect(MONGO_URI);
    console.log('✅ Connected to MongoDB\n');

    // Get all users
    const users = await User.find({});
    console.log(`📊 Found ${users.length} users to process\n`);

    let updatedCount = 0;
    let errorCount = 0;
    const results = [];

    // Process each user
    for (const user of users) {
      try {
        // Find all files uploaded by this user
        const files = await File.find({ uploadedBy: user._id });
        
        // Calculate total storage used
        const totalSize = files.reduce((sum, file) => sum + (file.size || 0), 0);
        
        // Update user's storage fields
        const oldStorageUsed = user.storageUsed || 0;
        user.storageUsed = totalSize;
        
        // Ensure storage quota is set
        if (!user.storageQuota || user.storageQuota === 0) {
          user.storageQuota = DEFAULT_QUOTA;
        }
        
        await user.save();
        updatedCount++;

        const result = {
          userId: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          filesCount: files.length,
          oldStorage: formatBytes(oldStorageUsed),
          newStorage: formatBytes(totalSize),
          quota: formatBytes(user.storageQuota),
          percentageUsed: ((totalSize / user.storageQuota) * 100).toFixed(2) + '%'
        };
        
        results.push(result);
        
        console.log(`✅ ${user.name} (${user.email})`);
        console.log(`   Files: ${files.length}`);
        console.log(`   Old Storage: ${formatBytes(oldStorageUsed)}`);
        console.log(`   New Storage: ${formatBytes(totalSize)}`);
        console.log(`   Quota: ${formatBytes(user.storageQuota)}`);
        console.log(`   Usage: ${result.percentageUsed}\n`);
        
      } catch (error) {
        errorCount++;
        console.error(`❌ Error processing user ${user.email}:`, error.message);
      }
    }

    // Summary
    console.log('\n' + '='.repeat(60));
    console.log('📋 MIGRATION SUMMARY');
    console.log('='.repeat(60));
    console.log(`Total Users: ${users.length}`);
    console.log(`Successfully Updated: ${updatedCount}`);
    console.log(`Errors: ${errorCount}`);
    console.log('='.repeat(60) + '\n');

    // Detailed statistics
    const totalStorageUsed = results.reduce((sum, r) => sum + (r.newStorage ? parseFloat(r.newStorage) : 0), 0);
    const usersNearLimit = results.filter(r => parseFloat(r.percentageUsed) >= 80).length;
    const usersOverLimit = results.filter(r => parseFloat(r.percentageUsed) >= 100).length;

    console.log('📊 STORAGE STATISTICS');
    console.log('='.repeat(60));
    console.log(`Users near limit (≥80%): ${usersNearLimit}`);
    console.log(`Users over limit (≥100%): ${usersOverLimit}`);
    console.log('='.repeat(60) + '\n');

    // Show users over limit
    if (usersOverLimit > 0) {
      console.log('⚠️  USERS OVER STORAGE LIMIT:');
      console.log('='.repeat(60));
      results
        .filter(r => parseFloat(r.percentageUsed) >= 100)
        .forEach(r => {
          console.log(`${r.name} (${r.email})`);
          console.log(`   Storage: ${r.newStorage} / ${r.quota} (${r.percentageUsed})`);
          console.log(`   Files: ${r.filesCount}\n`);
        });
    }

    // Show users near limit
    if (usersNearLimit > 0 && usersNearLimit > usersOverLimit) {
      console.log('⚠️  USERS NEAR STORAGE LIMIT (80-99%):');
      console.log('='.repeat(60));
      results
        .filter(r => parseFloat(r.percentageUsed) >= 80 && parseFloat(r.percentageUsed) < 100)
        .forEach(r => {
          console.log(`${r.name} (${r.email})`);
          console.log(`   Storage: ${r.newStorage} / ${r.quota} (${r.percentageUsed})`);
          console.log(`   Files: ${r.filesCount}\n`);
        });
    }

    console.log('✅ Migration completed successfully!\n');

    // Close database connection
    await mongoose.connection.close();
    console.log('🔌 Database connection closed\n');

    process.exit(0);

  } catch (error) {
    console.error('❌ Migration failed:', error);
    await mongoose.connection.close();
    process.exit(1);
  }
}

// Run migration
migrateStorageUsage();
