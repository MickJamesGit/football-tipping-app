import { sql } from "@vercel/postgres";
import {
  CustomerField,
  CustomersTableType,
  InvoiceForm,
  InvoicesTable,
  LatestInvoiceRaw,
  Revenue,
  Teams,
  Games,
  Tips,
  NRLRankings,
  Rounds,
  Sport,
} from "./definitions";
import { formatCurrency } from "./utils";
import { Result } from "postcss";

export async function fetchRevenue() {
  try {
    console.log("Fetching revenue data...");
    await new Promise((resolve) => setTimeout(resolve, 3000));

    const data = await sql<Revenue>`SELECT * FROM revenue`;

    console.log("Data fetch completed after 3 seconds.");

    return data.rows;
  } catch (error) {
    console.error("Database Error:", error);
    throw new Error("Failed to fetch revenue data.");
  }
}

export async function fetchLatestInvoices() {
  try {
    const data = await sql<LatestInvoiceRaw>`
      SELECT invoices.amount, customers.name, customers.image_url, customers.email, invoices.id
      FROM invoices
      JOIN customers ON invoices.customer_id = customers.id
      ORDER BY invoices.date DESC
      LIMIT 5`;

    const latestInvoices = data.rows.map((invoice) => ({
      ...invoice,
      amount: formatCurrency(invoice.amount),
    }));
    return latestInvoices;
  } catch (error) {
    console.error("Database Error:", error);
    throw new Error("Failed to fetch the latest invoices.");
  }
}

export async function fetchCardData() {
  try {
    // You can probably combine these into a single SQL query
    // However, we are intentionally splitting them to demonstrate
    // how to initialize multiple queries in parallel with JS.
    const invoiceCountPromise = sql`SELECT COUNT(*) FROM invoices`;
    const customerCountPromise = sql`SELECT COUNT(*) FROM customers`;
    const invoiceStatusPromise = sql`SELECT
         SUM(CASE WHEN status = 'paid' THEN amount ELSE 0 END) AS "paid",
         SUM(CASE WHEN status = 'pending' THEN amount ELSE 0 END) AS "pending"
         FROM invoices`;

    const data = await Promise.all([
      invoiceCountPromise,
      customerCountPromise,
      invoiceStatusPromise,
    ]);

    const numberOfInvoices = Number(data[0].rows[0].count ?? "0");
    const numberOfCustomers = Number(data[1].rows[0].count ?? "0");
    const totalPaidInvoices = formatCurrency(data[2].rows[0].paid ?? "0");
    const totalPendingInvoices = formatCurrency(data[2].rows[0].pending ?? "0");

    return {
      numberOfCustomers,
      numberOfInvoices,
      totalPaidInvoices,
      totalPendingInvoices,
    };
  } catch (error) {
    console.error("Database Error:", error);
    throw new Error("Failed to fetch card data.");
  }
}

const ITEMS_PER_PAGE = 6;
export async function fetchFilteredInvoices(
  query: string,
  currentPage: number
) {
  const offset = (currentPage - 1) * ITEMS_PER_PAGE;

  try {
    const invoices = await sql<InvoicesTable>`
      SELECT
        invoices.id,
        invoices.amount,
        invoices.date,
        invoices.status,
        customers.name,
        customers.email,
        customers.image_url
      FROM invoices
      JOIN customers ON invoices.customer_id = customers.id
      WHERE
        customers.name ILIKE ${`%${query}%`} OR
        customers.email ILIKE ${`%${query}%`} OR
        invoices.amount::text ILIKE ${`%${query}%`} OR
        invoices.date::text ILIKE ${`%${query}%`} OR
        invoices.status ILIKE ${`%${query}%`}
      ORDER BY invoices.date DESC
      LIMIT ${ITEMS_PER_PAGE} OFFSET ${offset}
    `;

    return invoices.rows;
  } catch (error) {
    console.error("Database Error:", error);
    throw new Error("Failed to fetch invoices.");
  }
}

export async function fetchInvoicesPages(query: string) {
  try {
    const count = await sql`SELECT COUNT(*)
    FROM invoices
    JOIN customers ON invoices.customer_id = customers.id
    WHERE
      customers.name ILIKE ${`%${query}%`} OR
      customers.email ILIKE ${`%${query}%`} OR
      invoices.amount::text ILIKE ${`%${query}%`} OR
      invoices.date::text ILIKE ${`%${query}%`} OR
      invoices.status ILIKE ${`%${query}%`}
  `;

    const totalPages = Math.ceil(Number(count.rows[0].count) / ITEMS_PER_PAGE);
    return totalPages;
  } catch (error) {
    console.error("Database Error:", error);
    throw new Error("Failed to fetch total number of invoices.");
  }
}

export async function fetchInvoiceById(id: string) {
  try {
    const data = await sql<InvoiceForm>`
      SELECT
        invoices.id,
        invoices.customer_id,
        invoices.amount,
        invoices.status
      FROM invoices
      WHERE invoices.id = ${id};
    `;

    const invoice = data.rows.map((invoice) => ({
      ...invoice,
      // Convert amount from cents to dollars
      amount: invoice.amount / 100,
    }));

    return invoice[0];
  } catch (error) {
    console.error("Database Error:", error);
    throw new Error("Failed to fetch invoice.");
  }
}

export async function fetchCustomers() {
  try {
    const data = await sql<CustomerField>`
      SELECT
        id,
        name
      FROM customers
      ORDER BY name ASC
    `;

    const customers = data.rows;
    return customers;
  } catch (err) {
    console.error("Database Error:", err);
    throw new Error("Failed to fetch all customers.");
  }
}

export async function fetchFilteredCustomers(query: string) {
  try {
    const data = await sql<CustomersTableType>`
		SELECT
		  customers.id,
		  customers.name,
		  customers.email,
		  customers.image_url,
		  COUNT(invoices.id) AS total_invoices,
		  SUM(CASE WHEN invoices.status = 'pending' THEN invoices.amount ELSE 0 END) AS total_pending,
		  SUM(CASE WHEN invoices.status = 'paid' THEN invoices.amount ELSE 0 END) AS total_paid
		FROM customers
		LEFT JOIN invoices ON customers.id = invoices.customer_id
		WHERE
		  customers.name ILIKE ${`%${query}%`} OR
        customers.email ILIKE ${`%${query}%`}
		GROUP BY customers.id, customers.name, customers.email, customers.image_url
		ORDER BY customers.name ASC
	  `;

    const customers = data.rows.map((customer) => ({
      ...customer,
      total_pending: formatCurrency(customer.total_pending),
      total_paid: formatCurrency(customer.total_paid),
    }));

    return customers;
  } catch (err) {
    console.error("Database Error:", err);
    throw new Error("Failed to fetch customer table.");
  }
}

export async function fetchTeams() {
  try {
    const data = await sql<Teams>`
SELECT
  id,
  name,
  sport
FROM teams
WHERE sport = 'NRL' AND name LIKE 'C%'
ORDER BY name ASC
    `;

    const teams = data.rows;
    return teams;
  } catch (err) {
    console.error("Database Error:", err);
    throw new Error("Failed to fetch all teams.");
  }
}

export async function fetchGames(sport: string, round: string) {
  try {
    const data = await sql<Games>`
    SELECT
      g.id,
      g.sport,
      g.round,
      g.home_team_id,
      g.away_team_id,
      t1.name AS home_team_name,
      t2.name AS away_team_name,
      g.venue,
      g.date,
      g.time
    FROM
      games g
    JOIN
      teams t1 ON g.home_team_id = t1.id
    JOIN
      teams t2 ON g.away_team_id = t2.id
    WHERE
      g.sport = ${sport} AND g.round = ${round}
    ORDER BY
      g.date, g.time;
    `;

    const games = data.rows.map((game) => ({
      ...game,
    }));
    return games;
  } catch (err) {
    console.error("Database Error:", err);
    throw new Error("Failed to fetch all games.");
  }
}

export async function fetchTips(user_id: string, round: string, sport: string) {
  try {
    const data = await sql<Tips>`
      SELECT
        t.id,
        t.user_id,
        t.tip_team_id,
        t.game_id,
        t.created_at,
        t.updated_at
      FROM
        tips t
      JOIN
        games g ON t.game_id = g.id
      WHERE
        g.sport = ${sport} AND g.round = ${round} AND t.user_id = ${user_id}
      ORDER BY
        g.date, g.time;
    `;

    const tips = data.rows.map((tip) => ({
      id: tip.id,
      user_id: tip.user_id,
      tip_team_id: tip.tip_team_id,
      game_id: tip.game_id,
    }));
    return tips;
  } catch (err) {
    console.error("Database Error:", err);
    throw new Error("Failed to fetch tips.");
  }
}

export async function fetchLeaderboard(
  sport: string,
  round: string
): Promise<NRLRankings[]> {
  try {
    const data = await sql<NRLRankings>`
      SELECT
        r.id AS id,
        r.user_name AS user_name,
        r.round AS round,
        r.ranking AS ranking,
        r.total_points AS total_points
      FROM
        rankings r
      WHERE
        r.round = ${round}
      ORDER BY
        r.ranking;
    `;

    const rankings = data.rows.map((ranking) => ({
      id: ranking.id,
      round: ranking.round,
      user_name: ranking.user_name,
      ranking: ranking.ranking,
      total_points: ranking.total_points,
    }));
    return rankings;
  } catch (err) {
    console.error("Database Error:", err);
    console.error(
      `Failed to fetch leaderboard for sport: ${sport}, round: ${round}`
    );
    throw new Error("Failed to fetch leaderboard.");
  }
}

export async function fetchCurrentRound(
  todays_date: string,
  sport: Sport
): Promise<Rounds["round"]> {
  try {
    const data = await sql<Rounds>`
      SELECT
        r.id AS id,
        r.round_number AS round,
        r.start_date AS start_date,
        r.end_date AS end_date
      FROM
        rounds r
      WHERE
        r.sport = ${sport} AND ${todays_date} BETWEEN r.start_date AND r.end_date
    `;

    if (data.rows.length === 0) {
      return "1";
    }

    const currentRound = data.rows.map((round) => ({
      id: round.id,
      round: round.round,
      start_date: round.start_date,
      end_date: round.end_date,
    }));

    return currentRound[0].round;
  } catch (err) {
    console.error("Database Error:", err);
    console.error(
      `Failed to fetch rounds for sport: ${sport}, date: ${todays_date}`
    );
    throw new Error("Failed to fetch current round.");
  }
}
