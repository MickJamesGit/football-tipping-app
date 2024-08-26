# FootyTips

A web application for NRL and AFL tipping.

## Uncompleted

Users:

- Setting user alias on first login
- OAuth login via:
  - Facebook
  - Google
  - Reddit
  - X
- Username and password sign up
  - Reset password

Tips:

- Lock tips out once gametime has started
- Script/process to grade tips

General:

- Integrate Prisma

## Ideas

- Streak tipping
- Margin tipping
- Arrows to show ranking improvements from prior week
- Show user ranking in leaderboard
- Add competitions

## Entity diagram

https://lucid.app/lucidchart/75183805-251c-4880-965a-36e51793359d/edit?viewport_loc=-1826%2C-82%2C2709%2C1272%2C0_0&invitationId=inv_b483ffb9-4ed6-4e4b-87b9-fd2d0199a48c

## Prisma

Making db schema changes:

1. Update schema.prisma
2. Set url = env("DIRECT_URL") in schema.prisma
3. Npx prisma migrate dev --name <migration_name>
4. Check SQL statements are correct
5. Set = env("DATABASE_URL") in schema.prisma
6. Run npx prisma generate --no-engine
