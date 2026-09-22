# UNFAZED — Complete Therapy Booking Platform

A full-stack React + Express + MongoDB therapy discovery, booking, client booking management, direct UPI payment, therapist dashboard, cancellation/refund tracking and support platform.

> This project is designed as a B.Tech major-project/demo application. It is a working full-stack foundation, not a claim of production certification or medical-service compliance.

## 1. What is included

### Public/client experience
- Premium responsive landing page
- Therapist discovery, search and focus filters
- Therapist profile pages
- Booking form with date/time selection and live booked-slot protection
- Server-side booking persistence in MongoDB
- Unique booking reference (`UF-...`) on every new booking
- My Bookings lookup by email OR booking reference
- Client profile stored locally for convenience
- Upcoming/cancelled booking status
- UPI payment page with UPI deep link + QR
- UTR submission for therapist verification
- Payment status and refund status visible to client
- Help & Support page
- Resources / journal page
- About and How It Works pages

### Therapist experience
- Therapist login/register using JWT
- Therapist dashboard
- Therapist-side manual client booking
- Therapist booking confirmation email workflow
- Upcoming/session list
- Client name, email and phone
- Booking cancellation
- Automatic creation of refund-pending state when a verified paid session is cancelled by therapist
- Payment verification (paid/rejected)
- Refund tracking with refund UTR/reference
- Therapist UPI ID configuration
- Therapist public profile

### Backend
- Express REST API
- MongoDB/Mongoose models
- JWT authentication
- Therapist/client/session/payment data separation
- Booking conflict checking
- Public booking endpoint
- Client booking lookup endpoint
- Therapist cancellation endpoint
- Payment verification endpoint
- Refund tracking endpoint
- Seed data for demo therapists
- Booking-code migration script for databases created with an older build
- Email confirmation service using Nodemailer/SMTP

## 2. Important booking flow

1. Client chooses a therapist.
2. Client enters name, email and optional phone.
3. Client chooses date/time.
4. Backend checks for overlapping booked sessions.
5. MongoDB stores the client and session.
6. A unique booking reference is generated.
7. Client is shown the booking reference.
8. Client can open My Bookings using the email or reference.
9. Client can pay by direct UPI and submit the UTR.
10. Therapist verifies the payment from their UPI/bank statement.
11. If therapist cancels a verified paid session, the payment is marked refund-pending.
12. Therapist sends the actual refund through their UPI/bank app and records the refund UTR/reference in the dashboard.
13. Client sees the refund status in My Bookings.

## 3. Demo therapist accounts

All seeded demo therapist accounts use:

`Password: Demo@12345`

| Therapist | Email |
|---|---|
| Dr. Sharma | demo@unfazed.in |
| Dr. Meera Kapoor | meera@unfazed.in |
| Rhea Malhotra | rhea@unfazed.in |
| Dr. Arjun Rao | arjun@unfazed.in |
| Ananya Sen | ananya@unfazed.in |
| Kabir Mehta | kabir@unfazed.in |
| Dr. Nisha Verma | nisha@unfazed.in |

## 4. Windows setup

### Prerequisites
- Node.js 18+ recommended
- MongoDB Community Server running locally
- VS Code

### Backend

```powershell
cd unfazed-backend
Copy-Item .env.example .env
npm install
```

Open `.env` and set your values:

```env
PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017/unfazed
JWT_SECRET=change-this-in-your-local-project
CLIENT_URL=http://localhost:5173
UPI_ID=yourname@upi

# Optional: real booking confirmation email
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=yourgmail@gmail.com
SMTP_PASS=your_16_character_gmail_app_password
FROM_EMAIL=yourgmail@gmail.com
```

For Gmail, use a Google **App Password**, not your normal Gmail password. If SMTP is left blank, bookings still work, but the backend will log that the confirmation email could not be sent.

Seed the demo database:

```powershell
npm run seed
```

If you already have an older database and want booking references on old sessions:

```powershell
npm run migrate-booking-codes
```

Start the backend:

```powershell
npm run dev
```

Expected message:

`Unfazed API running on http://localhost:5000`

### Frontend

Open a second PowerShell window:

```powershell
cd unfazed-frontend
Copy-Item .env.example .env
npm install
npm run dev
```

Open the Vite URL shown in the terminal, normally:

`http://localhost:5173`

## 5. How to test a complete booking

### Client
1. Open `/therapists`.
2. Open Dr. Nisha Verma.
3. Click Book a session.
4. Enter a name and email you control.
5. Select a time.
6. Confirm the session.
7. Copy the `UF-...` booking reference.
8. Open **My bookings**.
9. Search using the booking reference or email.

### Therapist
1. Log out if necessary.
2. Log in as `nisha@unfazed.in` / `Demo@12345`.
3. Open Dashboard.
4. A public booking appears under Sessions.
5. To create a booking yourself, use **Create a booking → Book a client & send confirmation**.
6. The selected client receives the booking reference by email when SMTP is configured and can use the reference/email in My Bookings.
7. Click Cancel.
6. If the payment was already verified as paid, the payment becomes refund-pending.
7. Send the actual refund using your UPI/bank app.
8. Enter the refund UTR/reference.
9. Click Mark refunded.

## 6. Payment behaviour

This build uses direct UPI rather than pretending to be an automated payment gateway.

The client scans the therapist's UPI QR or opens the UPI intent. The client then enters the UTR. The backend records the payment as `pending`. The therapist verifies the transaction before marking it `paid`.

### Refund behaviour

A normal UPI QR/deep-link payment does not give this website permission to pull money back from the therapist's bank account. Therefore:

- The website records that a refund is required.
- The therapist makes the real refund in the UPI/bank app.
- The therapist records the refund UTR/reference.
- The client can then see `Refunded`.

For automatic payment confirmation and automatic refunds, integrate a suitable regulated payment gateway and use its server-side webhook/refund APIs.

## 7. Where data is stored

MongoDB database:

`unfazed`

Important collections/models:
- `therapists`
- `clients`
- `sessions`
- `payments`
- `availability`
- `sessionnotes`
- `leads`
- `packages`
- `subscriptiontierconfigs`

## 8. Troubleshooting

### Booking does not appear in My Bookings
Use the exact email used on the booking OR the booking reference shown on the confirmation page.

If an old booking was created before booking references were added, run:

```powershell
npm run migrate-booking-codes
```

### Port 5000 already in use
Find the process:

```powershell
Get-NetTCPConnection -LocalPort 5000 -State Listen
```

Stop the old Node process if it is an old copy of the project, then run `npm run dev` again.

### MongoDB connection error
Check:

```powershell
Get-Service MongoDB
```

The service should show `Running`.

### UPI QR is missing
Set a real UPI ID in backend `.env`:

```env
UPI_ID=yourname@upi
```

or set the UPI ID from the therapist dashboard and restart the backend if required.

### Client says payment was made but dashboard says pending
The client must submit the UTR and the therapist must verify the transaction against the UPI/bank statement.

## 9. Production checklist

Before deploying publicly, add:
- HTTPS
- Secure production secrets
- Real client authentication/session management
- Rate limiting
- Input sanitisation and stronger validation
- CSRF/security headers as appropriate
- Audit logs
- Email/SMS notifications
- Production payment gateway + webhooks
- Automated refund API where supported
- Database backups
- Monitoring/error tracking
- Privacy policy, terms, consent and applicable healthcare/data compliance review
- Real therapist credential verification workflow

## 10. Project structure

```text
UNFAZED/
├── unfazed-frontend/
│   ├── src/
│   │   ├── App.jsx
│   │   ├── api.js
│   │   ├── main.jsx
│   │   └── styles.css
│   ├── .env.example
│   ├── index.html
│   ├── package.json
│   └── vite.config.js
│
├── unfazed-backend/
│   ├── src/
│   │   ├── config/
│   │   ├── controllers/
│   │   ├── middleware/
│   │   ├── models/
│   │   ├── routes/
│   │   ├── services/
│   │   ├── sockets/
│   │   ├── seed.js
│   │   └── migrateBookingCodes.js
│   ├── .env.example
│   ├── app.js
│   ├── server.js
│   └── package.json
│
└── README.md
```
