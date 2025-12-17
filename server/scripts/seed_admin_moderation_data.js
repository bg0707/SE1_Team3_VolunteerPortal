/**
 * Seed script for the Admin Moderation feature.
 *
 * This script assumes your MySQL schema (tables) already exists.
 * It will create:
 * - 1 admin user
 * - 1 pending organization (isVerified=false)
 * - 1 verified organization (isVerified=true)
 * - 1 volunteer
 * - 1 opportunity
 * - 1 report against that opportunity
 */

import dotenv from "dotenv";
dotenv.config();

import bcrypt from "bcrypt";

import sequelize from "../src/config/db.js";
import Category from "../src/models/category.model.js";
import Opportunity from "../src/models/opportunity.model.js";
import Organization from "../src/models/organization.model.js";
import Report from "../src/models/report.model.js";
import User from "../src/models/user.model.js";
import Volunteer from "../src/models/volunteer.model.js";

async function main() {
  await sequelize.authenticate();

  const adminEmail = "admin@example.com";
  const adminPassword = "admin123";

  const [adminUser] = await User.findOrCreate({
    where: { email: adminEmail },
    defaults: {
      email: adminEmail,
      password: await bcrypt.hash(adminPassword, 10),
      role: "admin",
    },
  });

  // Ensure role is admin even if the user already existed
  if (adminUser.role !== "admin") {
    adminUser.role = "admin";
    await adminUser.save();
  }

  const [defaultCategory] = await Category.findOrCreate({
    where: { name: "General" },
    defaults: { name: "General" },
  });

  const [pendingOrgUser] = await User.findOrCreate({
    where: { email: "pending-org@example.com" },
    defaults: {
      email: "pending-org@example.com",
      password: await bcrypt.hash("org123", 10),
      role: "organization",
    },
  });

  const [pendingOrg] = await Organization.findOrCreate({
    where: { userId: pendingOrgUser.userId },
    defaults: {
      userId: pendingOrgUser.userId,
      name: "Pending Org",
      description: "Organization awaiting verification",
      isVerified: false,
    },
  });

  // Keep it pending
  if (pendingOrg.isVerified !== false) {
    pendingOrg.isVerified = false;
    await pendingOrg.save();
  }

  const [verifiedOrgUser] = await User.findOrCreate({
    where: { email: "verified-org@example.com" },
    defaults: {
      email: "verified-org@example.com",
      password: await bcrypt.hash("org123", 10),
      role: "organization",
    },
  });

  const [verifiedOrg] = await Organization.findOrCreate({
    where: { userId: verifiedOrgUser.userId },
    defaults: {
      userId: verifiedOrgUser.userId,
      name: "Verified Org",
      description: "Organization already verified",
      isVerified: true,
    },
  });

  if (verifiedOrg.isVerified !== true) {
    verifiedOrg.isVerified = true;
    await verifiedOrg.save();
  }

  const [volUser] = await User.findOrCreate({
    where: { email: "volunteer@example.com" },
    defaults: {
      email: "volunteer@example.com",
      password: await bcrypt.hash("vol123", 10),
      role: "volunteer",
    },
  });

  const [volunteer] = await Volunteer.findOrCreate({
    where: { userId: volUser.userId },
    defaults: {
      userId: volUser.userId,
      fullName: "Test Volunteer",
      age: 22,
    },
  });

  const [opportunity] = await Opportunity.findOrCreate({
    where: { title: "Reported Opportunity" },
    defaults: {
      organizationId: verifiedOrg.organizationId,
      categoryId: defaultCategory.categoryId,
      title: "Reported Opportunity",
      description: "This listing is reported so admins can test moderation.",
      location: "Luxembourg",
      date: new Date(),
    },
  });

  await Report.findOrCreate({
    where: {
      volunteerId: volunteer.volunteerId,
      opportunityId: opportunity.opportunityId,
      content: "This listing looks suspicious.",
    },
    defaults: {
      volunteerId: volunteer.volunteerId,
      opportunityId: opportunity.opportunityId,
      content: "This listing looks suspicious.",
    },
  });

  console.log("Seed complete.");
  console.log(`Admin login: ${adminEmail} / ${adminPassword}`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exitCode = 1;
  })
  .finally(async () => {
    await sequelize.close();
  });
