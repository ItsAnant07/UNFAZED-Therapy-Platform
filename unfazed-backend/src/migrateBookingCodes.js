require("dotenv").config();
const connectDB = require("./config/db");
const Session = require("./models/Session");
function code(){ return `UF-${Date.now().toString(36).slice(-4).toUpperCase()}${Math.random().toString(36).slice(2,6).toUpperCase()}`; }
(async()=>{ try { await connectDB(); const rows=await Session.find({$or:[{bookingCode:{$exists:false}},{bookingCode:""}]}); for(const s of rows){s.bookingCode=code(); await s.save();} console.log(`Booking-code migration complete. Updated ${rows.length} sessions.`); process.exit(0);} catch(e){console.error(e);process.exit(1);} })();
