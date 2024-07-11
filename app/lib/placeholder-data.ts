// This file contains placeholder data that you'll be replacing with real data in the Data Fetching chapter:
// https://nextjs.org/learn/dashboard-app/fetching-data

interface User {
  name: string;
  email: string;
  password: string;
}

const users: User[] = [];

for (let i = 1; i <= 51; i++) {
  users.push({
    name: `User${i}`,
    email: `user${i}@nextmail.com`,
    password: "123456",
  });
}

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
    round: 19,
    home_team_id: "e972ab82-df78-46d4-92cb-4715c149f81e", // Canterbury Bulldogs
    away_team_id: "b20217fc-ee8e-4dae-8e5c-2e3f11c50ac6", // New Zealand Warriors
    venue: "Kayo Stadium, Redcliffe",
    date: "2024-07-11",
    time: "2024-07-11 19:50:00", // Example time
  },
  {
    sport: "NRL",
    round: 19,
    home_team_id: "23e83378-a67a-4487-9c04-4dccbdc5fdd0", // Wests Tigers
    away_team_id: "a64861a2-e63f-4ff3-9e15-6a6828298cf2", // Melbourne Storm
    venue: "PointsBet Stadium, Sydney",
    date: "2024-07-12",
    time: "2024-07-12 20:00:00", // Example time
  },
  {
    sport: "NRL",
    round: 19,
    home_team_id: "bcee526a-2c97-441d-9778-c5e768ae9170", // North Queensland Cowboys
    away_team_id: "27fb62e6-7aee-4e75-a5b9-a393a53bc418", // Manly Sea Eagles
    venue: "Cbus Super Stadium, Gold Coast",
    date: "2024-07-13",
    time: "2024-07-13 17:30:00", // Example time
  },
  {
    sport: "NRL",
    round: 19,
    home_team_id: "31e42016-7263-4b89-a404-62ee6c22161a", // Sydney Roosters
    away_team_id: "32ee484d-9c61-4377-8ea3-dbf09a185f5e", // St George Illawarra Dragons
    venue: "Suncorp Stadium, Brisbane",
    date: "2024-07-13",
    time: "2024-07-13 19:35:00", // Example time
  },
  {
    sport: "NRL",
    round: 19,
    home_team_id: "8be87234-4a55-4985-8830-e0d393318f50", // Sydney Roosters
    away_team_id: "674fde86-304a-46ec-a923-10e5af79570c", // St George Illawarra Dragons
    venue: "4 Pines Park, Sydney",
    date: "2024-07-14",
    time: "2024-07-14 16:05:00", // Example time
  },
];

const rankings = [
  {
    user_name: "topTipster43",
    round: "18",
    ranking: 1,
    total_points: 104,
  },
  {
    user_name: "2ndTipster34",
    round: "18",
    ranking: 2,
    total_points: 103,
  },
  {
    user_name: "3rdTipster23",
    round: "18",
    ranking: 3,
    total_points: 102,
  },
];

const rounds = [
  {
    sport: "NRL",
    round: "18",
    start_date: "2024-07-01",
    end_date: "2024-07-07",
  },
  {
    sport: "NRL",
    round: "17",
    start_date: "2024-06-24",
    end_date: "2024-06-30",
  },
  {
    sport: "NRL",
    round: "19",
    start_date: "2024-07-08",
    end_date: "2024-07-14",
  },
];

export { users, customers, invoices, revenue, teams, games, rankings, rounds };
