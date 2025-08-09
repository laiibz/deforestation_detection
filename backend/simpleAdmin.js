// Simple admin creation - no async/await complexity
const bcrypt = require('bcryptjs');

// Simulate creating admin user directly in memory
console.log("Creating admin user...");

bcrypt.hash("Admin123!", 12).then(hashedPassword => {
  console.log("Password hashed successfully");
  console.log("Admin user would be created with:");
  console.log("Email: admin@deforestation.com");
  console.log("Password: Admin123!");
  console.log("Role: admin");
  console.log("Hashed password:", hashedPassword);
  
  // For debugging - let's see if we can create a user object
  const adminUser = {
    username: "Admin",
    email: "admin@deforestation.com", 
    password: hashedPassword,
    provider: "local",
    role: "admin",
    _id: "admin123",
    createdAt: new Date(),
    updatedAt: new Date()
  };
  
  console.log("Admin user object created:", adminUser);
}).catch(err => {
  console.error("Error:", err);
});
