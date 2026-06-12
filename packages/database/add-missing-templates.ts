import "dotenv/config";
import { drizzle } from "drizzle-orm/node-postgres";
import { eq } from "drizzle-orm";
import { usersTable, themesTable, formsTable } from "./schema";
import { env } from "./env";

const db = drizzle(env.DATABASE_URL);

async function addMissingTemplates() {
  console.log("🌱 Adding missing templates to NitroForms database...\n");

  // Get the demo user
  const [user] = await db.select().from(usersTable).where(eq(usersTable.id, "demo_user_nitroforms")).limit(1);
  if (!user) {
    console.error("❌ Demo user not found. Please run seed.ts first.");
    process.exit(1);
  }

  // Get themes
  const [movieTheme] = await db.select().from(themesTable).where(eq(themesTable.slug, "cinema-noir")).limit(1);
  const [startupTheme] = await db.select().from(themesTable).where(eq(themesTable.slug, "startup-launch")).limit(1);

  if (!movieTheme || !startupTheme) {
    console.error("❌ Required themes not found. Please run seed.ts first.");
    process.exit(1);
  }

  // Update product-feedback-sprint to be public
  await db.update(formsTable)
    .set({ visibility: "public" })
    .where(eq(formsTable.slug, "product-feedback-sprint"));
  console.log("✓ Updated 'product-feedback-sprint' to public visibility");

  // Movie Night RSVP fields
  const movieFields = [
    { id: "f1", type: "short_text", label: "What's your name?", required: true, order: 1 },
    { id: "f2", type: "email", label: "Email address", required: true, order: 2 },
    { id: "f3", type: "single_select", label: "Are you coming?", required: true, order: 3, options: ["Yes, can't wait!", "No, unfortunately not"] },
    { id: "f4", type: "multi_select", label: "What genre should we watch?", required: false, order: 4, options: ["Action", "Comedy", "Horror", "Sci-Fi", "Romance"] },
    { id: "f5", type: "long_text", label: "Any movie suggestions?", required: false, order: 5 },
  ];

  // Developer Hiring Form fields
  const hiringFields = [
    { id: "f1", type: "short_text", label: "Full Name", required: true, order: 1 },
    { id: "f2", type: "email", label: "Email", required: true, order: 2 },
    { id: "f3", type: "url", label: "Portfolio or GitHub URL", required: true, order: 3 },
    { id: "f4", type: "single_select", label: "Years of experience?", required: true, order: 4, options: ["0-1 years", "2-4 years", "5+ years"] },
    { id: "f5", type: "long_text", label: "Why do you want to join us?", required: false, order: 5 },
  ];

  // Check if they already exist
  const existingForms = await db.select({ slug: formsTable.slug }).from(formsTable);
  const slugs = existingForms.map(f => f.slug);

  const newForms = [];
  if (!slugs.includes("movie-night-rsvp")) {
    newForms.push({
      ownerId: user.id,
      title: "Movie Night RSVP",
      slug: "movie-night-rsvp",
      status: "published",
      visibility: "public",
      themeId: movieTheme.id,
      fieldsJson: movieFields,
      publishedAt: new Date("2024-10-15"),
    });
  }

  if (!slugs.includes("developer-hiring-form")) {
    newForms.push({
      ownerId: user.id,
      title: "Developer Hiring Form",
      slug: "developer-hiring-form",
      status: "published",
      visibility: "public",
      themeId: startupTheme.id,
      fieldsJson: hiringFields,
      publishedAt: new Date("2024-10-20"),
    });
  }

  if (newForms.length > 0) {
    await db.insert(formsTable).values(newForms);
    console.log(`✓ Inserted ${newForms.length} new templates`);
  } else {
    console.log("✓ Templates already exist in database.");
  }

  console.log("\n✅ Added missing templates successfully!");
  process.exit(0);
}

addMissingTemplates().catch((e) => {
  console.error("❌ Failed:", e);
  process.exit(1);
});
