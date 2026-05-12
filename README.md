## SportsTippers

**Description**

A fully functional sports tipping platform that allows users to join tipping competitions and select the teams they predict will win each game. Real-time leaderboards keep competition engaging and encourage friendly rivalry among participants.

**Features**

- Username-based sign up and authentication
- Facebook and Google OAuth login/sign up
- Password reset and email verification workflows
- Optional email notifications for tipping reminders and results
- Weekly tipping with automated result grading
- Game countdown timers with lockout once matches begin
- Live leaderboards for each competition
- Admin tools for managing and grading game results

**Technology**

- Next.js v16
- NextAuth.js authentication
- Vercel hosting and deployment
- PostgreSQL database (Neon)
- Tailwind CSS for styling
- Resend for transactional emails
- React Hook Form with Zod for form validation

**Entity diagram**

https://lucid.app/lucidchart/75183805-251c-4880-965a-36e51793359d/edit?viewport_loc=-1826%2C-82%2C2709%2C1272%2C0_0&invitationId=inv_b483ffb9-4ed6-4e4b-87b9-fd2d0199a48c

**Prisma**

Making db schema changes:

1. Update schema.prisma
2. Set directUrl = env("DIRECT_URL") in schema.prisma
3. `npm prisma migrate dev --name <migration_name>`
4. Check SQL statements are correct
5. Set url = env("DATABASE_URL") in schema.prisma
6. Run npm prisma generate --no-engine

**How to run**

`npm install`
`npm run dev` for dev | `npm run build` for prod

**Deployment**

Automatically deployed to Vercel on branch merging.

---

## Screenshots

Login:
![Login](/public/screenshots/login.png)

Dashboard - Mobile:
![Mobile](/public/screenshots/mobile.png)

Tipping - Desktop:
![Desktop](/public/screenshots/desktop.png)
