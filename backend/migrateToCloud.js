const mongoose = require('mongoose');
const fs = require('fs');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

async function migrateToCloud() {
  try {
    console.log('🚀 Starting migration to MongoDB Atlas...');
    
    // Read exported data
    const exportData = JSON.parse(fs.readFileSync('./database_export.json', 'utf8'));
    console.log('📂 Loaded export data:');
    console.log('  - Products:', exportData.products.length);
    console.log('  - Users:', exportData.users.length);
    console.log('  - Orders:', exportData.orders.length);
    
    // Connect to MongoDB Atlas
    const cloudURI = process.env.MONGODB_CLOUD_URI;
    if (!cloudURI) {
      throw new Error('❌ MONGODB_CLOUD_URI not found in .env file!');
    }
    
    console.log('🔗 Connecting to MongoDB Atlas...');
    await mongoose.connect(cloudURI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('✅ Connected to MongoDB Atlas!');
    
    const db = mongoose.connection.db;
    
    // Clear existing collections (optional - remove if you want to keep existing data)
    console.log('🗑️ Clearing existing collections...');
    try {
      await db.collection('products').deleteMany({});
      await db.collection('users').deleteMany({});
      await db.collection('orders').deleteMany({});
      console.log('✅ Existing collections cleared');
    } catch (err) {
      console.log('⚠️ Collections might not exist yet, continuing...');
    }
    
    // Import products
    if (exportData.products.length > 0) {
      console.log('📦 Importing products...');
      await db.collection('products').insertMany(exportData.products);
      console.log(`✅ Imported ${exportData.products.length} products`);
    }
    
    // Import users
    if (exportData.users.length > 0) {
      console.log('👥 Importing users...');
      await db.collection('users').insertMany(exportData.users);
      console.log(`✅ Imported ${exportData.users.length} users`);
    }
    
    // Import orders (if any)
    if (exportData.orders.length > 0) {
      console.log('🛒 Importing orders...');
      await db.collection('orders').insertMany(exportData.orders);
      console.log(`✅ Imported ${exportData.orders.length} orders`);
    }
    
    // Verify migration
    console.log('🔍 Verifying migration...');
    const productCount = await db.collection('products').countDocuments();
    const userCount = await db.collection('users').countDocuments();
    const orderCount = await db.collection('orders').countDocuments();
    
    console.log('📊 Migration Summary:');
    console.log(`  - Products: ${productCount}`);
    console.log(`  - Users: ${userCount}`);
    console.log(`  - Orders: ${orderCount}`);
    
    console.log('🎉 Migration completed successfully!');
    console.log('🌟 Your ecommerce data is now on MongoDB Atlas!');
    
  } catch (error) {
    console.error('❌ Migration failed:', error.message);
    process.exit(1);
  } finally {
    await mongoose.disconnect();
  }
}

// Run migration
migrateToCloud();