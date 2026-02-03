import dotenv from "dotenv";
dotenv.config();

import bcrypt from "bcrypt";
import sequelize from "../src/config/db.js";
import Category from "../src/models/category.model.js";
import Organization from "../src/models/organization.model.js";
import User from "../src/models/user.model.js";
import Opportunity from "../src/models/opportunity.model.js";

const categoryNames = [
  "General",
  "Environment",
  "Education",
  "Health",
  "Community",
  "Food Security",
  "Elderly Care",
  "Children & Youth",
  "Animals",
  "Arts & Culture",
  "Sports",
  "Technology",
  "Mental Health",
  "Disaster Relief",
  "Housing",
  "Accessibility",
];

const opportunities = [
  {
    title: "Community Food Packing",
    description:
      "Help pack and label food boxes for families in need. Tasks include sorting donations and packing boxes.",
    location: "Luxembourg City",
    date: "2026-02-15",
    category: "Food Security",
  },
  {
    title: "Park Cleanup Day",
    description:
      "Join a team to clean trails and collect litter to keep public parks safe and beautiful.",
    location: "Esch-sur-Alzette",
    date: "2026-02-20",
    category: "Environment",
  },
  {
    title: "After-School Tutoring",
    description:
      "Support students with homework and reading practice in a friendly, supervised setting.",
    location: "Luxembourg City",
    date: "2026-02-18",
    category: "Education",
  },
  {
    title: "Senior Companionship Visits",
    description:
      "Spend time with seniors for conversation, board games, and light assistance.",
    location: "Differdange",
    date: "2026-02-22",
    category: "Elderly Care",
  },
  {
    title: "Community Garden Help",
    description:
      "Plant, water, and maintain raised beds in a local community garden.",
    location: "Luxembourg City",
    date: "2026-02-25",
    category: "Community",
  },
];

async function ensureCategories() {
  const rows = await Promise.all(
    categoryNames.map((name) =>
      Category.findOrCreate({ where: { name }, defaults: { name } })
    )
  );
  const byName = new Map(rows.map(([cat]) => [cat.name, cat]));
  return byName;
}

async function ensureOrganization() {
  const email = "helpinghands@example.org";
  const password = "HH-Volunteer-2026!";
  const [user] = await User.findOrCreate({
    where: { email },
    defaults: {
      email,
      password: await bcrypt.hash(password, 10),
      role: "organization",
      status: "active",
    },
  });

  const [org] = await Organization.findOrCreate({
    where: { userId: user.userId },
    defaults: {
      userId: user.userId,
      name: "Helping Hands Community",
      description:
        "We connect volunteers with local nonprofits through food drives, tutoring, and neighborhood cleanups.",
      isVerified: true,
    },
  });

  if (!org.isVerified) {
    org.isVerified = true;
    await org.save();
  }

  return org;
}

async function seedOpportunities() {
  await sequelize.authenticate();

  const categoryByName = await ensureCategories();
  const org = await ensureOrganization();

  for (const opp of opportunities) {
    const category = categoryByName.get(opp.category);
    await Opportunity.findOrCreate({
      where: { title: opp.title },
      defaults: {
        organizationId: org.organizationId,
        categoryId: category?.categoryId ?? null,
        title: opp.title,
        description: opp.description,
        location: opp.location,
        date: new Date(opp.date),
      },
    });
  }

  console.log(`Seeded ${opportunities.length} opportunities.`);
}

seedOpportunities()
  .catch((err) => {
    console.error("Seed failed:", err);
    process.exitCode = 1;
  })
  .finally(async () => {
    await sequelize.close();
  });
