export function requireAdmin(req, res, next) {
  // Assumes authenticateUser already populated req.user.
  if (req.user?.role !== "admin") {
    return res.status(403).json({ message: "Access denied. Admins only." });
  }

  next();
}
