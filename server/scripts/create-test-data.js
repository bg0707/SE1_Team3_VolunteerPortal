/**
 * Quick Test Data Creator for UC13
 * 
 * This script creates:
 * 1. A test opportunity (if organization exists)
 * 2. A test application (if volunteer exists)
 * 
 * Usage: node scripts/create-test-data.js
 * 
 * Note: Make sure you have at least one organization and one volunteer in the database first.
 * You can register them through the frontend authentication page.
 */

import sequelize from "../src/config/db.js";
import User from "../src/models/user.model.js";
import Organization from "../src/models/organization.model.js";
import Volunteer from "../src/models/volunteer.model.js";
import Opportunity from "../src/models/opportunity.model.js";
import Application from "../src/models/application.model.js";

async function createTestData() {
  try {
    // Connect to database
    await sequelize.authenticate();
    console.log("✅ Database connected");

    // Find an organization user
    const orgUser = await User.findOne({
      where: { role: "organization" },
    });

    if (!orgUser) {
      console.log("❌ No organization user found. Please register an organization account first through the frontend.");
      console.log("   Then run this script again.");
      process.exit(1);
    }

    const organization = await Organization.findOne({
      where: { userId: orgUser.userId },
    });

    if (!organization) {
      console.log("❌ No organization record found for the organization user.");
      console.log("   Please make sure the organization account is properly registered.");
      process.exit(1);
    }

    console.log(`✅ Found organization: ${organization.name} (ID: ${organization.organizationId})`);

    // Find a volunteer user
    const volunteerUser = await User.findOne({
      where: { role: "volunteer" },
    });

    if (!volunteerUser) {
      console.log("❌ No volunteer user found. Please register a volunteer account first through the frontend.");
      console.log("   Then run this script again.");
      process.exit(1);
    }

    const volunteer = await Volunteer.findOne({
      where: { userId: volunteerUser.userId },
    });

    if (!volunteer) {
      console.log("❌ No volunteer record found for the volunteer user.");
      console.log("   Please make sure the volunteer account is properly registered.");
      process.exit(1);
    }
    console.log(`✅ Found volunteer: ${volunteer.fullName} (ID: ${volunteer.volunteerId})`);

    // Create a test opportunity
    const [opportunity, created] = await Opportunity.findOrCreate({
      where: {
        title: "Test Opportunity for UC13",
        organizationId: organization.organizationId,
      },
      defaults: {
        organizationId: organization.organizationId,
        title: "Test Opportunity for UC13",
        description: "This is a test opportunity created for testing UC13 (Review Applicants). You can approve or reject applications for this opportunity.",
        location: "Test Location",
        date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days from now
        categoryId: null, // Optional
      },
    });

    if (created) {
      console.log(`✅ Created new opportunity: "${opportunity.title}" (ID: ${opportunity.opportunityId})`);
    } else {
      console.log(`ℹ️  Opportunity already exists: "${opportunity.title}" (ID: ${opportunity.opportunityId})`);
    }

    // Create a test application
    const [application, appCreated] = await Application.findOrCreate({
      where: {
        volunteerId: volunteer.volunteerId,
        opportunityId: opportunity.opportunityId,
      },
      defaults: {
        volunteerId: volunteer.volunteerId,
        opportunityId: opportunity.opportunityId,
        status: "pending",
      },
    });

    if (appCreated) {
      console.log(`✅ Created new application (ID: ${application.applicationId})`);
      console.log(`   Volunteer: ${volunteer.fullName}`);
      console.log(`   Opportunity: ${opportunity.title}`);
      console.log(`   Status: ${application.status}`);
    } else {
      console.log(`ℹ️  Application already exists (ID: ${application.applicationId})`);
      // Reset status to pending for testing
      if (application.status !== "pending") {
        application.status = "pending";
        await application.save();
        console.log(`   Reset status to: pending`);
      }
    }

    console.log("\n🎉 Test data ready!");
    console.log("\n📋 Summary:");
    console.log(`   Organization: ${organization.name} (User ID: ${orgUser.userId})`);
    console.log(`   Volunteer: ${volunteer.fullName} (User ID: ${volunteerUser.userId})`);
    console.log(`   Opportunity ID: ${opportunity.opportunityId}`);
    console.log(`   Application ID: ${application.applicationId}`);
    console.log("\n💡 Next steps:");
    console.log(`   1. Login as organization (email: ${orgUser.email})`);
    console.log(`   2. Go to opportunity details: http://localhost:5173/opportunities/${opportunity.opportunityId}`);
    console.log(`   3. You should see the applicant list and can approve/reject`);
    console.log(`   4. Login as volunteer (email: ${volunteerUser.email})`);
    console.log(`   5. Check "My Applications" to see status updates`);

    process.exit(0);
  } catch (error) {
    console.error("❌ Error creating test data:", error);
    process.exit(1);
  }
}

createTestData();

