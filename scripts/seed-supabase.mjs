import fs from "node:fs/promises";
import path from "node:path";
import process from "node:process";
import { fileURLToPath } from "node:url";

import { Client } from "pg";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(__dirname, "..");

const defaultFiles = [
  "supabase/schema.sql",
  "supabase/rls_user_profiles_admin_fix.sql",
  "supabase/seed.sql",
  "supabase/distance_mode_additions.sql",
  "supabase/regular_mode_additions.sql",
  "supabase/vocational_bvoc_full_additions.sql",
  "supabase/skill_certification_pdf_full_insert.sql",
  "supabase/skill_certification_map_all.sql",
  "supabase/blogs_seed.sql",
  "supabase/career_pathways.sql",
];

const rawArgs = process.argv.slice(2);

const getArgValue = (flag) => {
  const index = rawArgs.indexOf(flag);
  if (index === -1) return "";
  return rawArgs[index + 1] || "";
};

const hasFlag = (flag) => rawArgs.includes(flag);

const toAbsolute = (relativePath) => path.resolve(repoRoot, relativePath);

const normalizeDbUrl = (input) => {
  if (!input) return "";
  const trimmed = input.trim();
  const schemeIndex = trimmed.indexOf("://");
  if (schemeIndex === -1) return trimmed;

  const prefix = trimmed.slice(0, schemeIndex + 3);
  const rest = trimmed.slice(schemeIndex + 3);
  const lastAt = rest.lastIndexOf("@");
  if (lastAt === -1) return trimmed;

  const creds = rest.slice(0, lastAt);
  const hostPart = rest.slice(lastAt + 1);
  const colonIndex = creds.indexOf(":");
  if (colonIndex === -1) return trimmed;

  const user = creds.slice(0, colonIndex);
  const pass = creds.slice(colonIndex + 1);
  const encodedPass = encodeURIComponent(pass);
  if (encodedPass === pass) {
    return trimmed;
  }
  return `${prefix}${user}:${encodedPass}@${hostPart}`;
};

const stripLeadingComments = (statement) => {
  const lines = statement.split(/\r?\n/);
  let index = 0;
  while (index < lines.length) {
    const line = lines[index].trim();
    if (!line || line.startsWith("--")) {
      index += 1;
      continue;
    }
    break;
  }
  return lines.slice(index).join("\n").trim();
};

const wrapCreatePolicy = (statement) => {
  const normalized = statement.replace(
    /create\s+policy\s+if\s+not\s+exists/i,
    "create policy"
  );
  const body = normalized.trim().endsWith(";")
    ? normalized.trim()
    : `${normalized.trim()};`;
  return `do $$\nbegin\n  ${body}\nexception when duplicate_object then null;\nend $$`;
};

const splitSqlStatements = (sql) => {
  const statements = [];
  let buffer = "";
  let inSingle = false;
  let inDouble = false;
  let inLineComment = false;
  let inBlockComment = false;

  for (let i = 0; i < sql.length; i += 1) {
    const char = sql[i];
    const next = sql[i + 1];

    if (inLineComment) {
      buffer += char;
      if (char === "\n") {
        inLineComment = false;
      }
      continue;
    }

    if (inBlockComment) {
      buffer += char;
      if (char === "*" && next === "/") {
        buffer += next;
        i += 1;
        inBlockComment = false;
      }
      continue;
    }

    if (!inSingle && !inDouble) {
      if (char === "-" && next === "-") {
        buffer += char + next;
        i += 1;
        inLineComment = true;
        continue;
      }
      if (char === "/" && next === "*") {
        buffer += char + next;
        i += 1;
        inBlockComment = true;
        continue;
      }
    }

    if (char === "'" && !inDouble) {
      if (inSingle && next === "'") {
        buffer += "''";
        i += 1;
        continue;
      }
      inSingle = !inSingle;
      buffer += char;
      continue;
    }

    if (char === '"' && !inSingle) {
      inDouble = !inDouble;
      buffer += char;
      continue;
    }

    if (char === ";" && !inSingle && !inDouble && !inLineComment && !inBlockComment) {
      const trimmed = buffer.trim();
      if (trimmed) statements.push(trimmed);
      buffer = "";
      continue;
    }

    buffer += char;
  }

  const tail = buffer.trim();
  if (tail) statements.push(tail);
  return statements;
};

const run = async () => {
  let dbUrl =
    getArgValue("--db") ||
    process.env.SUPABASE_DB_URL ||
    process.env.DATABASE_URL ||
    "";

  const allowDeletes = hasFlag("--allow-deletes");
  const dryRun = hasFlag("--dry-run");

  if (!dbUrl) {
    console.error(
      "Missing database URL. Provide via SUPABASE_DB_URL or --db."
    );
    process.exit(1);
  }

  const normalized = normalizeDbUrl(dbUrl);
  if (normalized !== dbUrl) {
    console.log("Normalized DB URL by URL-encoding the password.");
    dbUrl = normalized;
  }

  const sqlFiles = defaultFiles.map(toAbsolute);

  for (const sqlFile of sqlFiles) {
    try {
      await fs.access(sqlFile);
    } catch {
      console.error(`Missing SQL file: ${sqlFile}`);
      process.exit(1);
    }
  }

  if (dryRun) {
    console.log("Dry run enabled. No SQL will be executed.");
  }

  const client = new Client({
    connectionString: dbUrl,
    ssl: { rejectUnauthorized: false },
  });

  await client.connect();

  try {
    for (const sqlFile of sqlFiles) {
      const sql = await fs.readFile(sqlFile, "utf-8");
      const statements = splitSqlStatements(sql);

      let executed = 0;
      let skipped = 0;

      await client.query("begin");

      try {
        for (const statement of statements) {
          const cleaned = stripLeadingComments(statement);
          if (!cleaned) continue;

          const keyword = cleaned.split(/\s+/)[0]?.toLowerCase();
          if (!allowDeletes && (keyword === "delete" || keyword === "truncate")) {
            skipped += 1;
            continue;
          }

          const normalizedStatement =
            cleaned.toLowerCase().startsWith("create policy if not exists")
              ? wrapCreatePolicy(cleaned)
              : cleaned;

          if (!dryRun) {
            await client.query(normalizedStatement);
          }
          executed += 1;
        }

        await client.query("commit");
      } catch (error) {
        await client.query("rollback");
        throw error;
      }

      console.log(
        `Applied ${path.relative(repoRoot, sqlFile)}: ${executed} statements` +
          (skipped ? ` (${skipped} skipped)` : "")
      );
    }
  } finally {
    await client.end();
  }
};

run().catch((error) => {
  console.error("Seed failed.");
  console.error(error);
  process.exit(1);
});
