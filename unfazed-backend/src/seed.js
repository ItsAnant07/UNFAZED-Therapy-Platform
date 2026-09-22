require("dotenv").config();
const bcrypt = require("bcryptjs");
const connectDB = require("./config/db");
const Therapist = require("./models/Therapist");
const Client = require("./models/Client");
const Session = require("./models/Session");
const Payment = require("./models/Payment");
const SubscriptionTierConfig = require("./models/SubscriptionTierConfig");

function bookingCode() { return `UF-${Math.random().toString(36).slice(2, 8).toUpperCase()}${Date.now().toString(36).slice(-3).toUpperCase()}`; }

(async () => {
  await connectDB();

  await SubscriptionTierConfig.deleteMany({});
  await SubscriptionTierConfig.insertMany([
    { name: "Starter", monthlyPrice: 0, caps: { activeClients: 20 }, features: { sharedNotes: false, advancedAnalytics: false, chat: true, packages: false } },
    { name: "Professional", monthlyPrice: 999, caps: { activeClients: 100 }, features: { sharedNotes: true, advancedAnalytics: true, chat: true, packages: true } },
    { name: "Practice", monthlyPrice: 1999, caps: { activeClients: 500 }, features: { sharedNotes: true, advancedAnalytics: true, chat: true, packages: true } }
  ]);

  const password_hash = await bcrypt.hash("Demo@12345", 12);

  const demoTherapists = [
    { email: "demo@unfazed.in", name: "Dr. Sharma", slug: "dr-sharma", bio: "Licensed therapist helping people build calmer, healthier lives.", specializations: ["Anxiety", "Stress Management", "Counselling"], languages: ["English", "Hindi"], tier: "Professional", upiId: process.env.UPI_ID || "" },
    { email: "meera@unfazed.in", name: "Dr. Meera Kapoor", slug: "meera-kapoor", bio: "Clinical psychologist focused on anxiety, relationships and stress.", specializations: ["Anxiety", "Relationships", "Stress"], languages: ["English", "Hindi"], tier: "Professional", upiId: process.env.UPI_ID || "" },
    { email: "rhea@unfazed.in", name: "Rhea Malhotra", slug: "rhea-malhotra", bio: "Counselling psychologist supporting self-esteem, burnout and life transitions.", specializations: ["Self-esteem", "Burnout", "Life transitions"], languages: ["English", "Hindi"], tier: "Professional", upiId: process.env.UPI_ID || "" },
    { email: "arjun@unfazed.in", name: "Dr. Arjun Rao", slug: "arjun-rao", bio: "Clinical psychologist working with young adults, anxiety and trauma-informed care.", specializations: ["Trauma", "Anxiety", "Young adults"], languages: ["English", "Hindi", "Telugu"], tier: "Professional", upiId: process.env.UPI_ID || "" },
    { email: "ananya@unfazed.in", name: "Ananya Sen", slug: "ananya-sen", bio: "Counsellor and therapist specialising in couples and family communication.", specializations: ["Couples", "Family", "Communication"], languages: ["English", "Bengali", "Hindi"], tier: "Professional", upiId: process.env.UPI_ID || "" },
    { email: "kabir@unfazed.in", name: "Kabir Mehta", slug: "kabir-mehta", bio: "Psychotherapist helping clients navigate work stress, confidence and men's mental health.", specializations: ["Men’s mental health", "Work stress", "Confidence"], languages: ["English", "Hindi"], tier: "Professional", upiId: process.env.UPI_ID || "" },
    { email: "nisha@unfazed.in", name: "Dr. Nisha Verma", slug: "nisha-verma", bio: "Clinical psychologist supporting people through depression, anxiety and grief.", specializations: ["Depression", "Anxiety", "Grief"], languages: ["English", "Hindi"], tier: "Professional", upiId: process.env.UPI_ID || "" }
  ];

  await Therapist.deleteMany({ email: { $in: demoTherapists.map(t => t.email) } });
  const therapists = [];
  for (const data of demoTherapists) {
    therapists.push(await Therapist.create({ ...data, password_hash }));
  }
  const therapist = therapists[0];

  await Client.deleteMany({ therapist: therapist._id });
  const clients = await Client.insertMany([
    { therapist: therapist._id, name: "Aarav Mehta", email: "aarav@example.com", status: "Active", tags: ["Anxiety", "Regular"] },
    { therapist: therapist._id, name: "Riya Kapoor", email: "riya@example.com", status: "Active", tags: ["Stress"] },
    { therapist: therapist._id, name: "Kabir Singh", email: "kabir@example.com", status: "Active", tags: ["Counselling"] },
    { therapist: therapist._id, name: "Meera Jain", email: "meera@example.com", status: "Inactive", tags: ["Follow-up"] }
  ]);

  await Session.deleteMany({ therapist: therapist._id });
  await Session.create([
    { bookingCode: bookingCode(), therapist: therapist._id, client: clients[0]._id, start: new Date(Date.now()+86400000), end: new Date(Date.now()+86400000+3600000), amount: 1200 },
    { bookingCode: bookingCode(), therapist: therapist._id, client: clients[1]._id, start: new Date(Date.now()+2*86400000), end: new Date(Date.now()+2*86400000+3600000), amount: 1500 }
  ]);

  await Payment.deleteMany({ therapist: therapist._id });
  await Payment.create([
    { bookingCode: bookingCode(), therapist: therapist._id, client: clients[0]._id, amount: 1200, platform_fee: 24, net_amount: 1176, status: "paid", gateway_transaction_id: "DEMO_1001" },
    { bookingCode: bookingCode(), therapist: therapist._id, client: clients[1]._id, amount: 1500, platform_fee: 30, net_amount: 1470, status: "paid", gateway_transaction_id: "DEMO_1002" }
  ]);

  console.log("Seed complete.");
  console.log("Login: demo@unfazed.in / Demo@12345");
  process.exit(0);
})();
