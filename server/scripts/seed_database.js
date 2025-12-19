/**
 * DEV seed script
 *
 * ⚠️ WARNING:
 * - Deletes ALL data
 * - Resets AUTO_INCREMENT
 * - Keeps schema intact
 *
 * Run with:
 *   node scripts/seed_database.js
 */

import dotenv from "dotenv";
dotenv.config();

import bcrypt from "bcrypt";
import sequelize from "../src/config/db.js";

import User from "../src/models/user.model.js";
import Volunteer from "../src/models/volunteer.model.js";
import Organization from "../src/models/organization.model.js";
import Category from "../src/models/category.model.js";
import Opportunity from "../src/models/opportunity.model.js";
import Application from "../src/models/application.model.js";

/* ============================
   RESET DATABASE (DEV ONLY)
============================ */
async function resetDatabase() {
  console.log("🧨 Resetting database...");

  await sequelize.query("SET FOREIGN_KEY_CHECKS = 0");

  const tables = [
    "applications",
    "reports",
    "notifications",
    "opportunities",
    "volunteers",
    "organizations",
    "categories",
    "users",
  ];

  for (const table of tables) {
    await sequelize.query(`DELETE FROM ${table}`);
    await sequelize.query(`ALTER TABLE ${table} AUTO_INCREMENT = 1`);
  }

  await sequelize.query("SET FOREIGN_KEY_CHECKS = 1");

  console.log("✅ Database reset complete");
}

/* ============================
   MAIN SEED
============================ */
async function main() {
  await sequelize.authenticate();
  console.log("✅ Connected to database");

  // 🔴 DEV ONLY — HARD RESET
  await resetDatabase();

  /* ============================
     ADMIN
  ============================ */
  const adminEmail = "gabriel@admin.lu";
  const adminPassword = "admin123";

  await User.create({
    email: adminEmail,
    password: await bcrypt.hash(adminPassword, 10),
    role: "admin",
  });

  /* ============================
     CATEGORIES
  ============================ */
  const categories = {};
  for (const name of ["Environment", "Education", "Health", "Social"]) {
    categories[name] = await Category.create({ name });
  }

  /* ============================
     ORGANIZATIONS
  ============================ */
  async function createOrganization({
    email,
    password,
    name,
    description,
    isVerified,
  }) {
    const user = await User.create({
      email,
      password: await bcrypt.hash(password, 10),
      role: "organization",
    });

    return Organization.create({
      userId: user.userId,
      name,
      description,
      isVerified,
    });
  }

  const helpingHands = await createOrganization({
    email: "organization@gmail.com",
    password: "12345678",
    name: "Helping Hands",
    description:
      "Helping Hands is a non-profit organization supporting vulnerable communities through food distribution and social initiatives.",
    isVerified: true,
  });

  const greenEarth = await createOrganization({
    email: "green@earth.org",
    password: "12345678",
    name: "Green Earth",
    description:
      "Green Earth focuses on environmental protection, sustainability, and community-driven cleanup initiatives.",
    isVerified: true,
  });

  const futureMinds = await createOrganization({
    email: "future@minds.org",
    password: "12345678",
    name: "Future Minds",
    description:
      "Future Minds provides tutoring and mentoring programs and is currently awaiting verification.",
    isVerified: false,
  });

  /* ============================
     VOLUNTEERS
  ============================ */
  async function createVolunteer({ email, password, fullName, age }) {
    const user = await User.create({
      email,
      password: await bcrypt.hash(password, 10),
      role: "volunteer",
    });

    return Volunteer.create({
      userId: user.userId,
      fullName,
      age,
    });
  }

  const alice = await createVolunteer({
    email: "alice@volunteer.com",
    password: "volunteer123",
    fullName: "Alice Martin",
    age: 21,
  });

  const bob = await createVolunteer({
    email: "bob@volunteer.com",
    password: "volunteer123",
    fullName: "Bob Dupont",
    age: 25,
  });

  const claire = await createVolunteer({
    email: "claire@volunteer.com",
    password: "volunteer123",
    fullName: "Claire Rossi",
    age: 23,
  });

  /* ============================
     OPPORTUNITIES
  ============================ */
  const foodDist = await Opportunity.create({
    organizationId: helpingHands.organizationId,
    categoryId: categories["Social"].categoryId,
    title: "Food Distribution",
    description:
      "Assist in preparing and distributing food packages to families in need.",
    location: "Luxembourg",
    date: new Date(),
  });

  const forestCleanup = await Opportunity.create({
    organizationId: greenEarth.organizationId,
    categoryId: categories["Environment"].categoryId,
    title: "Forest Cleanup",
    description:
      "Help clean forest paths and protect local wildlife by collecting waste.",
    location: "Esch-sur-Alzette",
    date: new Date(),
  });

  const tutoring = await Opportunity.create({
    organizationId: futureMinds.organizationId,
    categoryId: categories["Education"].categoryId,
    title: "Math Tutoring",
    description:
      "Support high-school students by providing online math tutoring sessions.",
    location: "Online",
    date: new Date(),
  });

  /* ============================
     APPLICATIONS
  ============================ */
  await Application.create({
    volunteerId: alice.volunteerId,
    opportunityId: foodDist.opportunityId,
    status: "accepted",
  });

  await Application.create({
    volunteerId: bob.volunteerId,
    opportunityId: foodDist.opportunityId,
    status: "pending",
  });

  await Application.create({
    volunteerId: claire.volunteerId,
    opportunityId: forestCleanup.opportunityId,
    status: "accepted",
  });

  await Application.create({
    volunteerId: alice.volunteerId,
    opportunityId: tutoring.opportunityId,
    status: "pending",
  });

  console.log("✅ Seeding complete");
  console.log(`🔑 Admin login: ${adminEmail} / ${adminPassword}`);
}

/* ============================
   RUN
============================ */
main()
  .catch((err) => {
    console.error("❌ Seed failed:", err);
    process.exitCode = 1;
  })
  .finally(async () => {
    await sequelize.close();
  });
