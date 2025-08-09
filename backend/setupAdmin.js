// backend/setupAdmin.js
import bcrypt from "bcryptjs";
import User from "./models/User.js";

const createAdmin = async () => {
  try {
    // Check if admin already exists
    const existingAdmin = await User.findOne({ email: "admin@deforestation.com" });
    
    if (existingAdmin) {
      console.log("Admin user already exists!");
      return;
    }

    // Create admin user
    const hashedPassword = await bcrypt.hash("Admin123!", 12);
    
    const adminUser = await User.create({
      username: "Admin",
      email: "admin@deforestation.com",
      password: hashedPassword,
      provider: "local",
      role: "admin"
    });

    console.log("Admin user created successfully!");
    console.log("Email: admin@deforestation.com");
    console.log("Password: Admin123!");
    console.log("Please change the password after first login!");
    
  } catch (error) {
    console.error("Error creating admin user:", error);
  }
};

// Run the setup
createAdmin(); 