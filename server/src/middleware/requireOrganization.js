export function requireOrganization(req, res, next) {
  // Assumes authenticateUser already populated req.user.
  if (req.user.role !== "organization") {
    return res.status(403).json({ message: "Access denied. Organizations only." });
  }
  next();
}
