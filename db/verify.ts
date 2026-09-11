import "dotenv/config";
import { Pool } from "pg";

const connectionString = process.env.DATABASE_URL;
if (!connectionString) throw new Error("DATABASE_URL is required.");

const pool = new Pool({ connectionString, max: 1, connectionTimeoutMillis: 10_000 });

async function main() {
  const client = await pool.connect();
  try {
    const connection = await client.query<{ healthy: number }>("select 1 as healthy");
    if (connection.rows[0]?.healthy !== 1) throw new Error("Database health query returned an unexpected result.");

    // A temporary table inside one transaction verifies insert, update, delete,
    // and transaction behavior without changing any application records.
    await client.query("begin");
    await client.query("create temporary table flyerhub_connection_check (id integer primary key, value text not null)");
    await client.query("insert into flyerhub_connection_check (id, value) values (1, 'created')");
    await client.query("update flyerhub_connection_check set value = 'updated' where id = 1");
    await client.query("delete from flyerhub_connection_check where id = 1");
    await client.query("rollback");
    console.log("Database connectivity, transaction, insert, update, and delete checks passed.");
  } finally {
    client.release();
    await pool.end();
  }
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : error);
  process.exitCode = 1;
});
