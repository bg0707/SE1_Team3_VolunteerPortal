import Organization from "../models/organization.model.js";

// GET all non verified organizations
export const getPendingOrganizations = async (req, res) => {
  try {
    
    console.log("Fetching pending organizations...");
    const pending = await Organization.findAll({
      where: { isVerified: false }   // Sequelize uses `where` clause
      });
    res.status(200).json(pending);
  } catch (err) {
    console.error("Error fetching pending organizations:", err);
    res.status(500).json({ message: err.message });
  }
};

// PATCH verify an organization
export const verifyOrganization = async (req, res) => {
  try {
    const { id } = req.params;
    console.log("Verify organization ID:", id); 
    const org = await Organization.findByIdAndUpdate(
      id,
      { isVerified: true },
      { new: true }
    );

    if (!org) 
        return res.status(404).json({ message: "Organization not found" });

    res.status(200).json({
      message: "Organization verified successfully",
      org
    });
  } catch (err) {
    console.error("Error verifying organization:", err);
    res.status(500).json({ message: err.message });
  }
};
