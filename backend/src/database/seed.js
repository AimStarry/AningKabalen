require('dotenv/config');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

// Import models
const User = require('../models/User');
const Category = require('../models/Category');
const Listing = require('../models/Listing');

const MONGO_URI = process.env.MONGO_URI ?? 'mongodb://localhost:27017/aningkabalen';

async function seed() {
  await mongoose.connect(MONGO_URI);
  console.log('✅ Connected to MongoDB');

  // // Clear existing data
  // await User.deleteMany({});
  // await Category.deleteMany({});
  // await Listing.deleteMany({});

  // Seed categories
  // const categories = await Category.insertMany([
  //   { name: 'Vegetables', slug: 'vegetables', description: 'Fresh farm vegetables', is_active: true },
  //   { name: 'Fruits', slug: 'fruits', description: 'Fresh farm fruits', is_active: true },
  //   { name: 'Grains', slug: 'grains', description: 'Rice, corn, and other grains', is_active: true },
  //   { name: 'Herbs', slug: 'herbs', description: 'Fresh herbs and spices', is_active: true },
  //   { name: 'Root Crops', slug: 'root-crops', description: 'Cassava, camote, and more', is_active: true },
  // ]);
  // console.log(`✅ Seeded ${categories.length} categories`);

  // Seed admin user
  const adminHash = await bcrypt.hash('admin123', 10);
  await User.create({
    name: 'AningKabalen Admin',
    email: 'superadmin@aningkabalen.ph',
    phone: '+639171234567',
    password_hash: 'admin123',
    role: 'admin',
    is_verified: true,
    is_active: true,
    verification_status: 'verified',
  });

  console.log('✅ Seeded admin user');
  console.log('\n🌾 Seed complete!');
  process.exit(0);
}

seed().catch(err => { console.error(err); process.exit(1); });
