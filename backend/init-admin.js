import dotenv from "dotenv";
dotenv.config();

import bcrypt from "bcryptjs";
import User from "./models/User.js";

async function createAdminUser() {
  try {
    console.log("🔧 Initializing admin user...");
    
    const adminEmail = "admin@deforestation.com";
    const adminPassword = "Admin123!";
    const adminUsername = "admin";

    // Check if admin already exists
    const existingAdmin = await User.findOne({ email: adminEmail });
    if (existingAdmin) {
      console.log("✅ Admin user already exists:", adminEmail);
      return;
    }

    // Create admin user
    const hashedPassword = await bcrypt.hash(adminPassword, 12);
    const adminUser = await User.create({
      username: adminUsername,
      email: adminEmail,
      password: hashedPassword,
      provider: "local",
      role: "admin"
    });

    console.log("✅ Admin user created successfully!");
    console.log("📧 Email:", adminEmail);
    console.log("🔑 Password:", adminPassword);
    console.log("⚠️  Please change the default password after first login!");
    
  } catch (error) {
    console.error("❌ Error creating admin user:", error);
  }
}

// Run the initialization
createAdminUser();
