import dotenv from 'dotenv';

import Admin from '../src/models/adminModel.js';
import connectDB from "../src/config/db.js";

dotenv.config();

const { MONGO_URI, SUPER_ADMIN_EMAIL, SUPER_ADMIN_PASSWORD } = process.env;

if (!MONGO_URI || !SUPER_ADMIN_EMAIL || !SUPER_ADMIN_PASSWORD) {
  console.error(
    '\nError: MONGO_URL, SUPER_ADMIN_EMAIL, and SUPER_ADMIN_PASSWORD'
  );
  process.exit(1);
}

const createSuperAdmin = async () => {
  try {
    await connectDB(); 

    const adminExists = await Admin.findOne({ email: SUPER_ADMIN_EMAIL });

    if (adminExists) {
      console.warn('⚠️  Warning: Ee email-il oru admin account und.');
      process.exit();
    }

    await Admin.create({
      fullName: 'Super Admin',
      email: SUPER_ADMIN_EMAIL,
      password: SUPER_ADMIN_PASSWORD,
      isActive: true,
    });

    console.log('✅ Success! Puthiya Super Admin-e create cheythu.');
    process.exit();
  } catch (error) {
    console.error(`Error creating super admin: ${error.message}`);
    process.exit(1);
  }
};

createSuperAdmin();