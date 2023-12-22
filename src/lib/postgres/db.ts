import { Client } from "pg";

const client = new Client({
  connectionString: process.env.POSTGRES_URL || "",
});

let isConnected = false;

export const getPostgresClient = async () => {
  if (!isConnected) {
    await client.connect();
    isConnected = true;
  }

  return client;
};
