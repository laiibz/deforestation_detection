// Debug admin user creation
import bcrypt from "bcryptjs";
import User from "./models/User.js";

console.log("🔍 Starting admin user debug...");

const debugAdmin = async () => {
  try {
    console.log("1. Checking if admin user exists...");
    
    // Check if admin already exists
    const existingAdmin = await User.findOne({ email: "admin@deforestation.com" });
    
    if (existingAdmin) {
      console.log("✅ Admin user already exists!");
      console.log("Admin details:", {
        email: existingAdmin.email,
        username: existingAdmin.username,
        role: existingAdmin.role,
        provider: existingAdmin.provider
      });
      return;
    }
    
    console.log("2. Admin user does not exist. Creating new admin...");
    
    // Create admin user
    const hashedPassword = await bcrypt.hash("Admin123!", 12);
    console.log("3. Password hashed successfully");
    
    const adminUser = await User.create({
      username: "Admin",
      email: "admin@deforestation.com",
      password: hashedPassword,
      provider: "local",
      role: "admin"
    });
    
    console.log("✅ Admin user created successfully!");
    console.log("📧 Email: admin@deforestation.com");
    console.log("🔑 Password: Admin123!");
    console.log("👤 Role: admin");
    console.log("Admin user details:", adminUser);
    
    // Verify the user was created
    const verifyAdmin = await User.findOne({ email: "admin@deforestation.com" });
    if (verifyAdmin) {
      console.log("✅ Verification: Admin user found in database");
    } else {
      console.log("❌ Verification failed: Admin user not found");
    }
    
  } catch (error) {
    console.error("❌ Error during admin creation:", error);
  }
};

// Run the debug
debugAdmin().then(() => {
  console.log("🏁 Debug complete");
  process.exit(0);
}).catch(err => {
  console.error("❌ Debug failed:", err);
  process.exit(1);
});
