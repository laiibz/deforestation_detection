// Create test users for admin panel demonstration
import bcrypt from "bcryptjs";
import User from "./models/User.js";

console.log("🔧 Creating test users for admin panel...");

const createTestUsers = async () => {
  try {
    // Test user data
    const testUsers = [
      {
        username: "John Doe",
        email: "john@example.com",
        password: "User123!",
        role: "user",
        provider: "local"
      },
      {
        username: "Jane Smith", 
        email: "jane@example.com",
        password: "User123!",
        role: "user",
        provider: "local"
      },
      {
        username: "Bob Wilson",
        email: "bob@example.com", 
        password: "User123!",
        role: "user",
        provider: "local"
      },
      {
        username: "Alice Johnson",
        email: "alice@example.com",
        password: "User123!",
        role: "user", 
        provider: "google"
      }
    ];

    console.log("Creating test users...");
    
    for (const userData of testUsers) {
      // Check if user already exists
      const existingUser = await User.findOne({ email: userData.email });
      
      if (!existingUser) {
        // Hash password for local users
        if (userData.provider === "local") {
          userData.password = await bcrypt.hash(userData.password, 12);
        }
        
        const user = await User.create(userData);
        console.log(`✅ Created user: ${user.email} (${user.provider})`);
      } else {
        console.log(`⚠️  User already exists: ${userData.email}`);
      }
    }
    
    // Show summary
    const totalUsers = await User.countDocuments({});
    const adminUsers = await User.countDocuments({ role: 'admin' });
    const regularUsers = await User.countDocuments({ role: 'user' });
    const googleUsers = await User.countDocuments({ provider: 'google' });
    const localUsers = await User.countDocuments({ provider: 'local' });
    
    console.log("\n📊 User Statistics:");
    console.log(`Total Users: ${totalUsers}`);
    console.log(`Admin Users: ${adminUsers}`);
    console.log(`Regular Users: ${regularUsers}`);
    console.log(`Google Users: ${googleUsers}`);
    console.log(`Local Users: ${localUsers}`);
    
  } catch (error) {
    console.error("❌ Error creating test users:", error);
  }
};

// Run the test user creation
createTestUsers().then(() => {
  console.log("🏁 Test user creation complete");
  process.exit(0);
}).catch(err => {
  console.error("❌ Test user creation failed:", err);
  process.exit(1);
});
