// This file contains placeholder data that you'll be replacing with real data in the Data Fetching chapter:
// https://nextjs.org/learn/dashboard-app/fetching-data
const users = [
  {
    id: "410544b2-4001-4271-9855-fec4b6a6442a",
    name: "User",
    email: "user@nextmail.com",
    password: "123456",
  },
];

const customers = [
  {
    id: "d6e15727-9fe1-4961-8c5b-ea44a9bd81aa",
    name: "Evil Rabbit",
    email: "evil@rabbit.com",
    image_url: "/customers/evil-rabbit.png",
  },
  {
    id: "3958dc9e-712f-4377-85e9-fec4b6a6442a",
    name: "Delba de Oliveira",
    email: "delba@oliveira.com",
    image_url: "/customers/delba-de-oliveira.png",
  },
  {
    id: "3958dc9e-742f-4377-85e9-fec4b6a6442a",
    name: "Lee Robinson",
    email: "lee@robinson.com",
    image_url: "/customers/lee-robinson.png",
  },
  {
    id: "76d65c26-f784-44a2-ac19-586678f7c2f2",
    name: "Michael Novotny",
    email: "michael@novotny.com",
    image_url: "/customers/michael-novotny.png",
  },
  {
    id: "CC27C14A-0ACF-4F4A-A6C9-D45682C144B9",
    name: "Amy Burns",
    email: "amy@burns.com",
    image_url: "/customers/amy-burns.png",
  },
  {
    id: "13D07535-C59E-4157-A011-F8D2EF4E0CBB",
    name: "Balazs Orban",
    email: "balazs@orban.com",
    image_url: "/customers/balazs-orban.png",
  },
];

const invoices = [
  {
    customer_id: customers[0].id,
    amount: 15795,
    status: "pending",
    date: "2022-12-06",
  },
  {
    customer_id: customers[1].id,
    amount: 20348,
    status: "pending",
    date: "2022-11-14",
  },
  {
    customer_id: customers[4].id,
    amount: 3040,
    status: "paid",
    date: "2022-10-29",
  },
  {
    customer_id: customers[3].id,
    amount: 44800,
    status: "paid",
    date: "2023-09-10",
  },
  {
    customer_id: customers[5].id,
    amount: 34577,
    status: "pending",
    date: "2023-08-05",
  },
  {
    customer_id: customers[2].id,
    amount: 54246,
    status: "pending",
    date: "2023-07-16",
  },
  {
    customer_id: customers[0].id,
    amount: 666,
    status: "pending",
    date: "2023-06-27",
  },
  {
    customer_id: customers[3].id,
    amount: 32545,
    status: "paid",
    date: "2023-06-09",
  },
  {
    customer_id: customers[4].id,
    amount: 1250,
    status: "paid",
    date: "2023-06-17",
  },
  {
    customer_id: customers[5].id,
    amount: 8546,
    status: "paid",
    date: "2023-06-07",
  },
  {
    customer_id: customers[1].id,
    amount: 500,
    status: "paid",
    date: "2023-08-19",
  },
  {
    customer_id: customers[5].id,
    amount: 8945,
    status: "paid",
    date: "2023-06-03",
  },
  {
    customer_id: customers[2].id,
    amount: 1000,
    status: "paid",
    date: "2022-06-05",
  },
];

const revenue = [
  { month: "Jan", revenue: 2000 },
  { month: "Feb", revenue: 1800 },
  { month: "Mar", revenue: 2200 },
  { month: "Apr", revenue: 2500 },
  { month: "May", revenue: 2300 },
  { month: "Jun", revenue: 3200 },
  { month: "Jul", revenue: 3500 },
  { month: "Aug", revenue: 3700 },
  { month: "Sep", revenue: 2500 },
  { month: "Oct", revenue: 2800 },
  { month: "Nov", revenue: 3000 },
  { month: "Dec", revenue: 4800 },
];

const teams = [
  { name: "Canberra Raiders", sport: "NRL" },
  { name: "South Sydney Rabbitohs", sport: "NRL" },
  { name: "Gold Coast Titans", sport: "NRL" },
  { name: "Brisbane Broncos", sport: "NRL" },
  { name: "Cronulla Sharks", sport: "NRL" },
  { name: "Canterbury Bulldogs", sport: "NRL" },
  { name: "Penrith Panthers", sport: "NRL" },
  { name: "Melbourne Storm", sport: "NRL" },
  { name: "North Queensland Cowboys", sport: "NRL" },
  { name: "Redcliffe Dolphins", sport: "NRL" },
  { name: "Sydney Roosters", sport: "NRL" },
  { name: "Wests Tigers", sport: "NRL" },
  { name: "Paramatta Eels", sport: "NRL" },
  { name: "New Zealand Warriors", sport: "NRL" },
  { name: "St George Illawarra Dragons", sport: "NRL" },
  { name: "Manly Sea Eagles", sport: "NRL" },
  { name: "Newcastle Knights", sport: "NRL" },
];

const games = [
  {
    sport: "NRL",
    round: 18,
    home_team_id: "7e87963d-7e24-4674-bc42-3cc904dfb6f2", // Canterbury Bulldogs
    away_team_id: "83359d25-46e9-41b9-b7ae-a24497c16371", // New Zealand Warriors
    venue: "Accor Stadium, Sydney",
    date: "2024-07-06",
    time: "2024-07-06 15:00:00", // Example time
  },
  {
    sport: "NRL",
    round: 18,
    home_team_id: "a64861a2-e63f-4ff3-9e15-6a6828298cf2", // Wests Tigers
    away_team_id: "244f662a-56e0-4660-a01b-512732aab632", // Melbourne Storm
    venue: "Leichhardt Oval, Sydney",
    date: "2024-07-06",
    time: "2024-07-06 17:30:00", // Example time
  },
  {
    sport: "NRL",
    round: 18,
    home_team_id: "92036bab-ec4d-411c-8565-06a89cc1a5a9", // North Queensland Cowboys
    away_team_id: "8be87234-4a55-4985-8830-e0d393318f50", // Manly Sea Eagles
    venue: "Queensland Country Bank Stadium, Townsville",
    date: "2024-07-06",
    time: "2024-07-06 19:35:00", // Example time
  },
  {
    sport: "NRL",
    round: 18,
    home_team_id: "c03c2387-09ae-46c1-8686-6f10ec98cab3", // Sydney Roosters
    away_team_id: "32ee484d-9c61-4377-8ea3-dbf09a185f5e", // St George Illawarra Dragons
    venue: "Allianz Stadium, Sydney",
    date: "2024-07-07",
    time: "2024-07-07 14:00:00", // Example time
  },
  {
    sport: "NRL",
    round: 18,
    home_team_id: "d03a75ae-20a1-40a0-91b5-b5c2518bbee9", // Canberra Raiders
    away_team_id: "674fde86-304a-46ec-a923-10e5af79570c", // Newcastle Knights
    venue: "GIO Stadium, Canberra",
    date: "2024-07-07",
    time: "2024-07-07 16:05:00", // Example time
  },
];

export { users, customers, invoices, revenue, teams, games };
