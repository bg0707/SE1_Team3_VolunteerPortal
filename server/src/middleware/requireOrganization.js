export function requireOrganization(req, res, next) {
  if (req.user.role !== "organization") {
    return res.status(403).json({ message: "Access denied. Organizations only." });
  }
  next();
}
