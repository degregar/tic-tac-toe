import { Client } from "pg";

export const postgresClient = new Client({
  connectionString: process.env.POSTGRES_URL || "",
});
