import { neon, type NeonQueryFunction } from "@neondatabase/serverless";

export class DatabaseConfigurationError extends Error {
  constructor() {
    super("DATABASE_URL is not configured.");
    this.name = "DatabaseConfigurationError";
  }
}

type NeonSql = NeonQueryFunction<false, false>;

let database: NeonSql | undefined;

export function getDatabase() {
  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) {
    throw new DatabaseConfigurationError();
  }

  if (!database) {
    database = neon<false, false>(connectionString);
  }

  return database;
}
