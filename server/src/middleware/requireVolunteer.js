export function requireVolunteer(req, res, next) {
  // Assumes authenticateUser already populated req.user.
  if (req.user.role !== "volunteer") {
    return res.status(403).json({ message: "Access denied. Volunteers only." });
  }
  next();
}
