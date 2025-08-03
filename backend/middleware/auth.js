// backend/middleware/auth.js
import jwt from 'jsonwebtoken';

const auth = (req, res, next) => {
  const token = req.cookies.accessToken;
if (!token) return res.status(401).json({ message: "No token provided" });

try {
  const decoded = jwt.verify(token, process.env.JWT_SECRET);
  req.user = decoded;
  next();
} catch {
  res.status(403).json({ message: "Invalid or expired token" });
}
};
export default auth;
