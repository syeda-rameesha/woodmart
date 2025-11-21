import jwt from "jsonwebtoken";

export const authAdmin = (req, res, next) => {
  const bearer = req.headers.authorization || "";
  const token = bearer.startsWith("Bearer ") ? bearer.slice(7) : null;
  if (!token) return res.status(401).json({ message: "No token provided" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || "secret");
    if (decoded.role !== "admin") throw new Error("Not admin");
    next();
  } catch {
    res.status(403).json({ message: "Invalid or expired token" });
  }
};