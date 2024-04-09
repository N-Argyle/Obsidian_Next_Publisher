import { sql } from "@vercel/postgres";
import * as crypto from "crypto";
import { drizzle } from "drizzle-orm/vercel-postgres";
import * as schema from "@/../db/schema";
import { eq } from "drizzle-orm";

import { NextResponse } from "next/server";
import { nanoid } from "nanoid";
export async function POST(req: Request) {
  const {password, id} = await req.json();
  console.log(password, id)
  const db = drizzle(sql);
  const post = await db
    .select()
    .from(schema.docs)
    .where(eq(schema.docs.uuid, id));
  if (!post || !post[0] || !post[0].password) {
    return NextResponse.json({ error: "Invalid document" }, { status: 401 });
  }
  const decrypted = decryptString(post[0].password, process.env.MASTER_PASSWORD || "");
  if (decrypted !== password) {
    return NextResponse.json({ error: "Incorrect password" }, { status: 401 });
  }
  const newHash = nanoid(10);
  const result = await db
    .insert(schema.sessions)
    .values({
      docID: id,
      sessionID: newHash,
    });
  if (!result) {
    return NextResponse.json({ error: "Error saving session" }, { status: 500 });
  }
  return NextResponse.json({ sessionID: newHash }, { status: 200 });
}

function decryptString(encryptedText: string, masterPassword: string) {
	const algorithm = "aes-256-cbc";
	const key = crypto.scryptSync(masterPassword, "salt", 32);
	const iv = Buffer.alloc(16, 0); // Initialization vector

	const decipher = crypto.createDecipheriv(algorithm, key, iv);
	let decrypted = decipher.update(encryptedText, "hex", "utf8");
	decrypted += decipher.final("utf8");

	return decrypted;
}
