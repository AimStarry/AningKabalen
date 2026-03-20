/**
 * AningKabalen — Database Seed Script
 * Run: npm run seed
 *
 * IMPORTANT: Uses User.create() (not insertMany) so the pre-save
 * bcrypt hook fires and passwords are properly hashed.
 */
import 'dotenv/config';
import mongoose from 'mongoose';
import { connectDB } from './connection';
import User        from '../models/User';
import Address     from '../models/Address';
import Category    from '../models/Category';
import Listing     from '../models/Listing';
import Reservation from '../models/Reservation';
import Transaction from '../models/Transaction';
import Review      from '../models/Review';
import Notification from '../models/Notification';

const seed = async () => {
  await connectDB();
  console.log('🌱  Seeding database...\n');

  // Clear all
  await Promise.all([
    User.deleteMany({}), Address.deleteMany({}), Category.deleteMany({}),
    Listing.deleteMany({}), Reservation.deleteMany({}), Transaction.deleteMany({}),
    Review.deleteMany({}), Notification.deleteMany({}),
  ]);
  console.log('🗑   Cleared existing data');

  // ── CATEGORIES ────────────────────────────────────────────────
  const categories = await Category.insertMany([
    { name: 'Vegetables',          slug: 'vegetables',   description: 'Fresh vegetables from local farms',    image_url: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?w=300' },
    { name: 'Fruits',              slug: 'fruits',       description: 'Seasonal and tropical fruits',          image_url: 'https://images.unsplash.com/photo-1560806887-1e4cd0b6cbd6?w=300' },
    { name: 'Grains',              slug: 'grains',       description: 'Rice, corn, wheat and more',            image_url: 'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=300' },
    { name: 'Nuts & Grains',       slug: 'nuts-grains',  description: 'Nuts, beans and legumes',               image_url: 'https://images.unsplash.com/photo-1508747703725-719777637510?w=300' },
    { name: 'Cheese, Dairy, Milk', slug: 'dairy',        description: 'Farm-fresh dairy products',             image_url: 'https://images.unsplash.com/photo-1486297678162-eb2a19b0a32d?w=300' },
    { name: 'Farm Produce',        slug: 'farm-produce', description: 'Eggs, honey, mushrooms and more',       image_url: 'https://images.unsplash.com/photo-1582722872445-44dc5f7e3c8f?w=300' },
    { name: 'Root Crops',          slug: 'root-crops',   description: 'Camote, cassava, gabi and more',        image_url: 'https://images.unsplash.com/photo-1598170845058-32b9d6a5da37?w=300' },
    { name: 'Herbs & Spices',      slug: 'herbs-spices', description: 'Fresh herbs and local spices',          image_url: 'https://images.unsplash.com/photo-1466637574441-749b8f19452f?w=300' },
  ]);
  console.log(`✅  ${categories.length} categories seeded`);

  // ── USERS — use .create() so bcrypt pre-save hook fires ───────
  // Admin
  const admin = await User.create({
    name: 'Platform Admin', email: 'admin@aningkabalen.ph', phone: '+639991110000',
    password_hash: 'Admin123!', role: 'admin',
    is_verified: true, verification_status: 'verified',
    rating: { average: 0, count: 0 },
  });

  // Farmers
  const farmer1 = await User.create({
    name: 'Aimee Santos', email: 'aimee@farm.ph', phone: '+639171110001',
    password_hash: 'Password123!', role: 'farmer',
    is_verified: true, verification_status: 'verified',
    farm_details: { farm_name: "Aimee's Garden", farm_size_hectares: 2.5, years_farming: 8, primary_crops: ['tomato','carrot','lettuce'], certifications: ['Organic PH #2023-001'] },
    rating: { average: 4.8, count: 24 },
  });
  const farmer2 = await User.create({
    name: 'Pangan Cruz', email: 'pangan@farm.ph', phone: '+639281110002',
    password_hash: 'Password123!', role: 'farmer',
    is_verified: true, verification_status: 'verified',
    farm_details: { farm_name: 'Farmland Pangan', farm_size_hectares: 5.0, years_farming: 15, primary_crops: ['corn','rice','banana'], certifications: [] },
    rating: { average: 4.5, count: 18 },
  });
  const farmer3 = await User.create({
    name: 'Juan Reyes', email: 'juan@farm.ph', phone: '+639391110003',
    password_hash: 'Password123!', role: 'farmer',
    is_verified: true, verification_status: 'verified',
    farm_details: { farm_name: 'Masagana Farm', farm_size_hectares: 3.2, years_farming: 12, primary_crops: ['mango','pineapple','cashew'], certifications: ['GAP Certified'] },
    rating: { average: 4.9, count: 35 },
  });
  const farmer4 = await User.create({
    name: 'Rosa Gomez', email: 'rosa@farm.ph', phone: '+639451110004',
    password_hash: 'Password123!', role: 'farmer',
    is_verified: false, verification_status: 'pending',
    farm_details: { farm_name: 'Gomez Organics', farm_size_hectares: 1.8, years_farming: 3, primary_crops: ['herbs','kangkong','mustasa'], certifications: [] },
    rating: { average: 4.2, count: 8 },
  });

  // Buyers
  const buyer1 = await User.create({
    name: 'Carlos Lim', email: 'carlos@buyer.ph', phone: '+639171220001',
    password_hash: 'Password123!', role: 'buyer',
    is_verified: true, verification_status: 'verified',
    buyer_details: { business_name: 'Lim Grocery Store', business_type: 'retail' },
    rating: { average: 4.6, count: 15 },
  });
  const buyer2 = await User.create({
    name: 'Ana Reyes', email: 'ana@buyer.ph', phone: '+639281220002',
    password_hash: 'Password123!', role: 'buyer',
    is_verified: true, verification_status: 'verified',
    buyer_details: { business_type: 'individual' },
    rating: { average: 4.8, count: 6 },
  });
  const buyer3 = await User.create({
    name: 'Joemar Diaz', email: 'joemar@buyer.ph', phone: '+639391220003',
    password_hash: 'Password123!', role: 'buyer',
    is_verified: true, verification_status: 'verified',
    buyer_details: { business_name: 'Fresh Market', business_type: 'wholesale' },
    rating: { average: 4.3, count: 9 },
  });

  console.log(`✅  7 users seeded (passwords properly hashed)`);

  // ── LISTINGS ───────────────────────────────────────────────────
  const veg = categories[0]._id;
  const frt = categories[1]._id;
  const grn = categories[2]._id;
  const dry = categories[4]._id;
  const fp  = categories[5]._id;
  const rct = categories[6]._id;
  const hrb = categories[7]._id;

  const listings = await Listing.insertMany([
    { farmer_id: farmer1._id, category_id: veg, crop_name: 'Cabbage',    variety: 'Green',       description: 'Fresh farm-grown cabbage, ideal for salads and cooking.', quantity: 100, quantity_kg: 100, available_kg: 80,  price_per_kg: 45,  unit: 'kg',    images: ['https://images.unsplash.com/photo-1594282486552-05b4d80fbb9f?w=400'], tags: ['organic','leafy'],    status: 'available' },
    { farmer_id: farmer1._id, category_id: veg, crop_name: 'Carrot',     variety: 'Nantes',      description: 'Sweet, crunchy carrots grown organically in highland soil.',  quantity: 80,  quantity_kg: 80,  available_kg: 60,  price_per_kg: 55,  unit: 'kg',    images: ['https://images.unsplash.com/photo-1598170845058-32b9d6a5da37?w=400'], tags: ['organic','root'],     status: 'available' },
    { farmer_id: farmer2._id, category_id: frt, crop_name: 'Banana',     variety: 'Lakatan',     description: 'Sweet Lakatan bananas freshly harvested from our plantation.', quantity: 200, quantity_kg: 200, available_kg: 150, price_per_kg: 35,  unit: 'kg',    images: ['https://images.unsplash.com/photo-1571771894821-ce9b6c11b08e?w=400'], tags: ['tropical','sweet'],   status: 'available' },
    { farmer_id: farmer3._id, category_id: frt, crop_name: 'Mango',      variety: 'Carabao',     description: 'Premium Carabao mangoes — the sweetest in the Philippines.',   quantity: 150, quantity_kg: 150, available_kg: 100, price_per_kg: 85,  unit: 'kg',    images: ['https://images.unsplash.com/photo-1553279768-865429fa0078?w=400'], tags: ['premium','tropical'], status: 'available' },
    { farmer_id: farmer2._id, category_id: grn, crop_name: 'Rice',        variety: 'Sinandomeng', description: 'High-quality Sinandomeng rice, freshly milled from the farm.',  quantity: 500, quantity_kg: 500, available_kg: 400, price_per_kg: 55,  unit: 'kg',    images: ['https://images.unsplash.com/photo-1536304993881-ff86e0c9c1c8?w=400'], tags: ['staple','bulk'],      status: 'available' },
    { farmer_id: farmer3._id, category_id: frt, crop_name: 'Pineapple',  variety: 'Queen',       description: 'Juicy and sweet Queen pineapples harvested at peak ripeness.',  quantity: 120, quantity_kg: 120, available_kg: 90,  price_per_kg: 40,  unit: 'kg',    images: ['https://images.unsplash.com/photo-1550258987-190a2d41a8ba?w=400'], tags: ['tropical','juicy'],   status: 'available' },
    { farmer_id: farmer1._id, category_id: dry, crop_name: 'Carabao Cheese', variety: 'White',   description: 'Artisan white cheese made from fresh carabao milk.',            quantity: 30,  quantity_kg: 30,  available_kg: 20,  price_per_kg: 320, unit: 'kg',    images: ['https://images.unsplash.com/photo-1486297678162-eb2a19b0a32d?w=400'], tags: ['dairy','artisan'],    status: 'available' },
    { farmer_id: farmer4._id, category_id: fp,  crop_name: 'Free-Range Eggs', variety: 'Native', description: 'Farm-fresh free-range eggs from happy hens.',                   quantity: 500, quantity_kg: 25,  available_kg: 20,  price_per_kg: 12,  unit: 'dozen', images: ['https://images.unsplash.com/photo-1582722872445-44dc5f7e3c8f?w=400'], tags: ['protein','fresh'],    status: 'available' },
    { farmer_id: farmer2._id, category_id: veg, crop_name: 'Tomato',     variety: 'Roma',        description: 'Firm Roma tomatoes, great for cooking and sauces.',             quantity: 90,  quantity_kg: 90,  available_kg: 70,  price_per_kg: 60,  unit: 'kg',    images: ['https://images.unsplash.com/photo-1546094096-0df4bcaaa337?w=400'], tags: ['organic'],            status: 'available' },
    { farmer_id: farmer3._id, category_id: frt, crop_name: 'Papaya',     variety: 'Solo',        description: 'Sweet Solo papayas, rich in vitamins and minerals.',            quantity: 80,  quantity_kg: 80,  available_kg: 60,  price_per_kg: 30,  unit: 'kg',    images: ['https://images.unsplash.com/photo-1526318472351-c75fcf070305?w=400'], tags: ['tropical','sweet'],   status: 'available' },
    { farmer_id: farmer1._id, category_id: rct, crop_name: 'Camote',     variety: 'Orange',      description: 'Sweet orange camote (sweet potato) from highland farms.',       quantity: 100, quantity_kg: 100, available_kg: 80,  price_per_kg: 35,  unit: 'kg',    images: ['https://images.unsplash.com/photo-1601004890684-d8cbf643f5f2?w=400'], tags: ['root','sweet'],       status: 'available' },
    { farmer_id: farmer4._id, category_id: hrb, crop_name: 'Kangkong',   variety: 'Water',       description: 'Fresh water spinach, popular in Filipino dishes.',              quantity: 50,  quantity_kg: 50,  available_kg: 40,  price_per_kg: 25,  unit: 'kg',    images: ['https://images.unsplash.com/photo-1540420773420-3366772f4999?w=400'], tags: ['leafy','local'],      status: 'available' },
  ]);
  console.log(`✅  ${listings.length} listings seeded`);

  // ── RESERVATIONS ───────────────────────────────────────────────
  const reservation = await Reservation.create({
    buyer_id: buyer1._id, farmer_id: farmer1._id, listing_id: listings[0]._id,
    quantity_kg: 20, unit_price: 45, total_amount: 900,
    payment_method: 'gcash', payment_status: 'paid', status: 'confirmed',
    pickup_schedule: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
  });

  const pendingReservation = await Reservation.create({
    buyer_id: buyer2._id, farmer_id: farmer2._id, listing_id: listings[2]._id,
    quantity_kg: 15, unit_price: 35, total_amount: 525,
    payment_method: 'maya', payment_status: 'pending', status: 'pending',
    pickup_schedule: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000),
  });
  console.log('✅  2 reservations seeded');

  // ── TRANSACTIONS ───────────────────────────────────────────────
  await Transaction.insertMany([
    {
      reservation_id: reservation._id,
      buyer_id: buyer1._id, farmer_id: farmer1._id, listing_id: listings[0]._id,
      type: 'reservation', quantity_kg: 20, unit_price: 45,
      subtotal: 900, platform_fee: 18, total_amount: 918,
      payment_method: 'gcash', payment_status: 'paid', status: 'processed',
    },
    {
      buyer_id: buyer2._id, farmer_id: farmer3._id, listing_id: listings[3]._id,
      type: 'order', quantity_kg: 10, unit_price: 85,
      subtotal: 850, platform_fee: 17, total_amount: 867,
      payment_method: 'mastercard', payment_status: 'paid', status: 'completed',
    },
    {
      buyer_id: buyer3._id, farmer_id: farmer2._id, listing_id: listings[2]._id,
      type: 'order', quantity_kg: 30, unit_price: 35,
      subtotal: 1050, platform_fee: 21, total_amount: 1071,
      payment_method: 'visa', payment_status: 'pending', status: 'confirmed',
    },
    {
      buyer_id: buyer1._id, farmer_id: farmer3._id, listing_id: listings[3]._id,
      type: 'order', quantity_kg: 5, unit_price: 85,
      subtotal: 425, platform_fee: 8.5, total_amount: 433.5,
      payment_method: 'gcash', payment_status: 'paid', status: 'completed',
    },
  ]);
  console.log('✅  4 transactions seeded');

  // ── REVIEWS ────────────────────────────────────────────────────
  await Review.insertMany([
    { reviewer_id: buyer1._id, target_id: farmer1._id,    target_type: 'farmer',  rating: 5, comment: 'Great farmer! Fresh produce and very professional.' },
    { reviewer_id: buyer2._id, target_id: farmer3._id,    target_type: 'farmer',  rating: 5, comment: 'Amazing mangoes, best I have ever tasted!' },
    { reviewer_id: buyer1._id, target_id: listings[0]._id, target_type: 'listing', rating: 4, comment: 'Good quality cabbage, will order again.' },
    { reviewer_id: buyer3._id, target_id: farmer2._id,    target_type: 'farmer',  rating: 4, comment: 'Reliable and consistent. Bananas were fresh.' },
  ]);
  console.log('✅  4 reviews seeded');

  // ── NOTIFICATIONS ──────────────────────────────────────────────
  await Notification.insertMany([
    { user_id: farmer1._id, type: 'NEW_RESERVATION',        title: 'New Reservation',        message: `Carlos Lim reserved 20 kg of your Cabbage.`,              ref_id: reservation._id,        ref_type: 'Reservation' },
    { user_id: buyer1._id,  type: 'RESERVATION_CONFIRMED',  title: 'Reservation Confirmed',  message: 'Your reservation for Cabbage has been confirmed!',         ref_id: reservation._id,        ref_type: 'Reservation' },
    { user_id: farmer2._id, type: 'NEW_RESERVATION',        title: 'New Reservation',        message: `Ana Reyes reserved 15 kg of your Banana.`,                 ref_id: pendingReservation._id, ref_type: 'Reservation' },
    { user_id: buyer2._id,  type: 'NEW_ORDER',              title: 'Order Placed',           message: 'Your order for Mango has been confirmed. Expect delivery!', ref_id: listings[3]._id,        ref_type: 'Transaction' },
  ]);
  console.log('✅  4 notifications seeded');

  console.log('\n🎉  Seed complete!\n');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('  DEMO ACCOUNTS (all passwords hashed)');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('  ⚙  Admin:   admin@aningkabalen.ph  |  Admin123!');
  console.log('  🌾  Farmer:  aimee@farm.ph           |  Password123!');
  console.log('  🌾  Farmer:  pangan@farm.ph          |  Password123!');
  console.log('  🛒  Buyer:   carlos@buyer.ph          |  Password123!');
  console.log('  🛒  Buyer:   ana@buyer.ph             |  Password123!');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

  await mongoose.disconnect();
};

seed().catch(err => { console.error('❌ Seed failed:', err); process.exit(1); });
