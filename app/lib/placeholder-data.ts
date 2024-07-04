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
    home_team_id: "27fb62e6-7aee-4e75-a5b9-a393a53bc418", // Paramatta Eels
    away_team_id: "b20217fc-ee8e-4dae-8e5c-2e3f11c50ac6", // South Sydney Rabbitohs
    venue: "Commbank Stadium Sydney",
    date: "2024-07-04",
    time: "2024-07-04 20:00:00", // Example time
  },
  {
    sport: "NRL",
    round: 18,
    home_team_id: "23e83378-a67a-4487-9c04-4dccbdc5fdd0", // Cronulla Sharks
    away_team_id: "bcee526a-2c97-441d-9778-c5e768ae9170", // Gold Coast Titans
    venue: "Coffs International Stadium, Coffs Harbour",
    date: "2024-07-05",
    time: "2024-07-05 18:00:00", // Example time
  },
  {
    sport: "NRL",
    round: 18,
    home_team_id: "31e42016-7263-4b89-a404-62ee6c22161a", // Brisbane Broncos
    away_team_id: "769c25e8-6a21-4eac-99d7-9e2df2319b37", // Penrith Panthers
    venue: "Suncorp Stadium, Brisbane",
    date: "2024-07-05",
    time: "2024-07-05 20:00:00", // Example time
  },
];

export { users, customers, invoices, revenue, teams, games };
