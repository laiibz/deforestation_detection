// Simple admin user creator
import bcrypt from "bcryptjs";
import User from "./models/User.js";

console.log("Creating admin user...");

try {
  // Create admin user directly in memory
  const hashedPassword = await bcrypt.hash("Admin123!", 12);
  
  const adminUser = await User.create({
    username: "Admin",
    email: "admin@deforestation.com",
    password: hashedPassword,
    provider: "local",
    role: "admin"
  });

  console.log("✅ Admin user created successfully!");
  console.log("Email: admin@deforestation.com");
  console.log("Password: Admin123!");
  console.log("You can now log in with these credentials.");
  
} catch (error) {
  console.error("❌ Error creating admin user:", error);
}

process.exit(0);
