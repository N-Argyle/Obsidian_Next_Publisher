import { sql } from "drizzle-orm";
import { pgTable, serial, text, timestamp, uuid } from "drizzle-orm/pg-core";

export const docs = pgTable('docs', {
  id: serial('id').primaryKey(),
  content: text('content'),
  path: text('path'),
  title: text('title'),
  updated: timestamp('updated').default(sql`now()`),
  password: text('password'),
  uuid: text('uuid').unique(),
});

export const sessions = pgTable('sessions', {
  id: serial('id').primaryKey(),
  docID: text('doc_id'),
  sessionID: text('session_id'),
});