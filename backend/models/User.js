import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  username: { type: String }, // not required for Google users
  email:    { type: String, required: true, unique: true },
  password: { type: String, default: "" },            // Optional for OAuth users
  googleId: { type: String, default: null },          // Store Google account ID
  provider: { type: String, default: "local" },       // 'local' or 'google'
  role:     { type: String, enum: ["user", "admin"], default: "user" }
}, {
  timestamps: true // Adds createdAt and updatedAt fields
});

// Create indexes for better performance
userSchema.index({ email: 1 });
userSchema.index({ googleId: 1 });

// In-memory storage for users (fallback when MongoDB is not available)
const users = new Map();

// Override the model methods to use in-memory storage
const User = mongoose.model("User", userSchema);

// Override findOne method
User.findOne = async function(query) {
  console.log("In-memory findOne called with:", query);
  for (const [id, user] of users) {
    if (query.email && user.email === query.email) {
      return user;
    }
    if (query._id && user._id === query._id) {
      return user;
    }
    if (query.googleId && user.googleId === query.googleId) {
      return user;
    }
  }
  return null;
};

// Override find method
User.find = async function(query = {}) {
  console.log("In-memory find called with:", query);
  const results = [];
  for (const [id, user] of users) {
    if (Object.keys(query).length === 0) {
      results.push(user);
    } else {
      let match = true;
      for (const [key, value] of Object.entries(query)) {
        if (user[key] !== value) {
          match = false;
          break;
        }
      }
      if (match) {
        results.push(user);
      }
    }
  }
  return results;
};

// Override create method
User.create = async function(userData) {
  console.log("In-memory create called with:", userData);
  const id = Date.now().toString();
  const user = {
    ...userData,
    _id: id,
    __v: 0,
    createdAt: new Date(),
    updatedAt: new Date()
  };
  users.set(id, user);
  console.log("User created in memory:", user);
  return user;
};

// Override findById method
User.findById = async function(id) {
  console.log("In-memory findById called with:", id);
  return users.get(id) || null;
};

// Override save method for existing users
User.prototype.save = async function() {
  console.log("In-memory save called for user:", this.email);
  if (this._id) {
    users.set(this._id, { ...this });
  }
  return this;
};

// Override deleteOne method
User.deleteOne = async function(query) {
  console.log("In-memory deleteOne called with:", query);
  for (const [id, user] of users) {
    if (query._id && user._id === query._id) {
      users.delete(id);
      return { deletedCount: 1 };
    }
    if (query.email && user.email === query.email) {
      users.delete(id);
      return { deletedCount: 1 };
    }
  }
  return { deletedCount: 0 };
};

// Override findByIdAndDelete method
User.findByIdAndDelete = async function(id) {
  console.log("In-memory findByIdAndDelete called with:", id);
  const user = users.get(id);
  if (user) {
    users.delete(id);
    return user;
  }
  return null;
};

export default User;
