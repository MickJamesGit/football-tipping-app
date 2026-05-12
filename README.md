## SportsTippers

**Description**
A fully functionining sports tipping application that allows users to sign up for tipping competitions and pick teams they think will win each win. Live leaderboards for each competition create competition.

**Features**

- Username login/sign up authentication
- Facebook and Google login/sign up authentication
- Lost password and email verification
- Opt-in emails for tipping results and reminders
- Weekly tipping and grading of picks
- Countdown to gametime and lockout once game has started
- Live leaderboard for each competition
- Admin functionality to grade game results

**Technology**

- NextJS v16 application
- Next-auth authentication
- Vercel hosting
- Postgres DB on Neon
- Tailwind CSS styling
- Resend email integration
- React hookform and zod libraries

## Entity diagram

https://lucid.app/lucidchart/75183805-251c-4880-965a-36e51793359d/edit?viewport_loc=-1826%2C-82%2C2709%2C1272%2C0_0&invitationId=inv_b483ffb9-4ed6-4e4b-87b9-fd2d0199a48c

## Prisma

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

**Screenshots**
