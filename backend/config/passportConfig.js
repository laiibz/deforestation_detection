console.log("passportConfig loaded");
console.log("GOOGLE_CLIENT_ID in passportConfig:", process.env.GOOGLE_CLIENT_ID);

import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import User from '../models/User.js';

passport.use(new GoogleStrategy({
  clientID: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  callbackURL: "http://localhost:5000/api/auth/google/callback" // <-- absolute URL
},
async (accessToken, refreshToken, profile, done) => {
  try {
    console.log("Google OAuth callback received for profile:", profile.id);
    const email = profile.emails[0].value;
    console.log("Email from Google:", email);
    
    let user = await User.findOne({ email });

    if (!user) {
      console.log("Creating new user for Google OAuth:", email);
      user = await User.create({
        username: profile.displayName,
        email,
        password: "", // no password for OAuth
        provider: "google",
        googleId: profile.id
      });
      console.log("New Google user created:", user.email);
    } else {
      console.log("Existing user found for Google OAuth:", user.email);
      // Update the user's Google ID if it's not set
      if (!user.googleId) {
        user.googleId = profile.id;
        user.provider = "google";
        await user.save();
        console.log("Updated existing user with Google ID");
      }
    }

    return done(null, user);
  } catch (err) {
    console.error("Google OAuth strategy error:", err);
    return done(err, null);
  }
}));

passport.serializeUser((user, done) => {
  done(null, user._id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (err) {
    done(err, null);
  }
});
