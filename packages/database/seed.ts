import "dotenv/config";
import { drizzle } from "drizzle-orm/node-postgres";
import { hashSync } from "bcryptjs";
import { usersTable, themesTable, formsTable, responsesTable, formEventsTable, emailLogsTable } from "./schema";
import { env } from "./env";

const db = drizzle(env.DATABASE_URL);

async function seed() {
  console.log("🌱 Seeding NitroForms database...\n");

  // 1. Demo user
  const [user] = await db.insert(usersTable).values({
    fullName: "Nitro Explorer",
    email: "demo@nitroforms.dev",
    passwordHash: hashSync("password123", 10),
    avatarUrl: null,
  }).returning();
  console.log("✓ Created demo user:", user!.email);

  // 2. Themes
  const themes = await db.insert(themesTable).values([
    { name: "Neon Tokyo", slug: "neon-tokyo", category: "Anime", configJson: { primary: "#ff6b9d", bg: "#1a0a2e", font: "Inter" } },
    { name: "Cyber Arena", slug: "cyber-arena", category: "Gaming", configJson: { primary: "#00ff88", bg: "#0d1117", font: "Space Grotesk" } },
    { name: "Startup Launch", slug: "startup-launch", category: "Startup", configJson: { primary: "#5865f2", bg: "#121316", font: "Inter" } },
    { name: "Cinema Noir", slug: "cinema-noir", category: "Movie", configJson: { primary: "#ffd700", bg: "#1a1a1a", font: "DM Sans" } },
  ]).returning();
  console.log("✓ Created", themes.length, "themes");

  // 3. Forms
  const animeFields = [
    { id: "f1", type: "short_text", label: "What's your name?", required: true, order: 1 },
    { id: "f2", type: "email", label: "Email address", required: true, order: 2 },
    { id: "f3", type: "single_select", label: "Favorite anime genre?", required: true, order: 3, options: ["Shonen", "Seinen", "Isekai", "Slice of Life", "Mecha"] },
    { id: "f4", type: "rating", label: "Rate your anime obsession (1-5)", required: false, order: 4 },
    { id: "f5", type: "long_text", label: "Top 3 anime recommendations?", required: false, order: 5 },
  ];

  const gamingFields = [
    { id: "f1", type: "short_text", label: "Gamer tag", required: true, order: 1 },
    { id: "f2", type: "email", label: "Email", required: true, order: 2 },
    { id: "f3", type: "single_select", label: "Primary platform?", required: true, order: 3, options: ["PC", "PlayStation", "Xbox", "Nintendo", "Mobile"] },
    { id: "f4", type: "multi_select", label: "Genres you play", required: false, order: 4, options: ["FPS", "RPG", "MOBA", "Strategy", "Racing", "Sports"] },
    { id: "f5", type: "number", label: "Hours per week gaming?", required: false, order: 5, validation: { min: 0, max: 100 } },
  ];

  const feedbackFields = [
    { id: "f1", type: "email", label: "Your email", required: true, order: 1 },
    { id: "f2", type: "rating", label: "Overall satisfaction", required: true, order: 2 },
    { id: "f3", type: "single_select", label: "Which feature do you use most?", required: true, order: 3, options: ["Form Builder", "Analytics", "Templates", "API"] },
    { id: "f4", type: "long_text", label: "What could we improve?", required: false, order: 4 },
    { id: "f5", type: "checkbox", label: "Would you recommend us?", required: false, order: 5 },
  ];

  const eventFields = [
    { id: "f1", type: "short_text", label: "Full name", required: true, order: 1 },
    { id: "f2", type: "email", label: "Email", required: true, order: 2 },
    { id: "f3", type: "single_select", label: "Attending?", required: true, order: 3, options: ["Yes", "No", "Maybe"] },
    { id: "f4", type: "date", label: "Preferred date", required: false, order: 4 },
  ];

  const forms = await db.insert(formsTable).values([
    { ownerId: user!.id, title: "Anime Fan Survey", slug: "anime-fan-survey", status: "published", visibility: "public", themeId: themes[0]!.id, fieldsJson: animeFields, publishedAt: new Date("2024-10-01") },
    { ownerId: user!.id, title: "Gaming Community Signup", slug: "gaming-community-signup", status: "published", visibility: "public", themeId: themes[1]!.id, fieldsJson: gamingFields, publishedAt: new Date("2024-10-05") },
    { ownerId: user!.id, title: "Product Feedback Sprint", slug: "product-feedback-sprint", status: "published", visibility: "unlisted", themeId: themes[2]!.id, fieldsJson: feedbackFields, publishedAt: new Date("2024-10-10") },
    { ownerId: user!.id, title: "Community Event RSVP", slug: "community-event-rsvp", status: "draft", visibility: "public", themeId: themes[3]!.id, fieldsJson: eventFields },
  ]).returning();
  console.log("✓ Created", forms.length, "forms");

  // 4. Seed responses
  const names = ["Naruto Fan", "Sakura Dev", "Goku Coder", "Luffy Builder", "Eren Hacker", "Mikasa UX", "Tanjiro PM", "Deku Intern", "Todoroki Lead", "Levi Senior"];
  const genres = ["Shonen", "Seinen", "Isekai", "Slice of Life", "Mecha"];
  const platforms = ["PC", "PlayStation", "Xbox", "Nintendo", "Mobile"];
  const features = ["Form Builder", "Analytics", "Templates", "API"];

  const responseValues = [];

  // Anime form — 50 responses
  for (let i = 0; i < 50; i++) {
    responseValues.push({
      formId: forms[0]!.id,
      respondentEmail: `user${i}@anime.fan`,
      answersJson: { f1: names[i % names.length], f2: `user${i}@anime.fan`, f3: genres[i % genres.length], f4: Math.ceil(Math.random() * 5), f5: "Great anime!" },
      metadataJson: { device: i % 3 === 0 ? "mobile" : "desktop", duration: 60 + Math.floor(Math.random() * 180) },
      submittedAt: new Date(Date.now() - (50 - i) * 86400000 * 0.5),
    });
  }

  // Gaming form — 30 responses
  for (let i = 0; i < 30; i++) {
    responseValues.push({
      formId: forms[1]!.id,
      respondentEmail: `gamer${i}@play.gg`,
      answersJson: { f1: `Player_${i}`, f2: `gamer${i}@play.gg`, f3: platforms[i % platforms.length], f4: ["FPS", "RPG"].slice(0, 1 + (i % 3)), f5: 5 + Math.floor(Math.random() * 40) },
      metadataJson: { device: "desktop", duration: 45 + Math.floor(Math.random() * 120) },
      submittedAt: new Date(Date.now() - (30 - i) * 86400000 * 0.7),
    });
  }

  // Feedback form — 20 responses
  for (let i = 0; i < 20; i++) {
    responseValues.push({
      formId: forms[2]!.id,
      respondentEmail: `team${i}@company.io`,
      answersJson: { f1: `team${i}@company.io`, f2: 3 + Math.floor(Math.random() * 3), f3: features[i % features.length], f4: "Looks great overall", f5: i % 3 !== 0 },
      metadataJson: { device: i % 2 === 0 ? "desktop" : "mobile", duration: 90 + Math.floor(Math.random() * 60) },
      submittedAt: new Date(Date.now() - (20 - i) * 86400000),
    });
  }

  await db.insert(responsesTable).values(responseValues);
  console.log("✓ Created", responseValues.length, "responses");

  // 5. Form events
  const eventValues = [];
  for (const form of forms.slice(0, 3)) {
    const count = form.slug === "anime-fan-survey" ? 120 : form.slug === "gaming-community-signup" ? 80 : 40;
    for (let i = 0; i < count; i++) {
      eventValues.push({
        formId: form.id,
        eventType: i % 4 === 0 ? "view" : i % 4 === 1 ? "start" : i % 4 === 2 ? "submit" : "view",
        createdAt: new Date(Date.now() - (count - i) * 3600000),
      });
    }
  }
  await db.insert(formEventsTable).values(eventValues);
  console.log("✓ Created", eventValues.length, "form events");

  // 6. Email logs
  await db.insert(emailLogsTable).values([
    { formId: forms[0]!.id, recipient: "demo@nitroforms.dev", type: "creator_notification", status: "skipped", errorMessage: "Email provider not configured" },
    { formId: forms[1]!.id, recipient: "demo@nitroforms.dev", type: "creator_notification", status: "skipped", errorMessage: "Email provider not configured" },
    { formId: forms[2]!.id, recipient: "team0@company.io", type: "respondent_confirmation", status: "skipped", errorMessage: "Email provider not configured" },
  ]);
  console.log("✓ Created 3 email logs");

  console.log("\n✅ Seed complete!");
  console.log("   Demo login: demo@nitroforms.dev / password123");
  process.exit(0);
}

seed().catch((e) => {
  console.error("❌ Seed failed:", e);
  process.exit(1);
});
