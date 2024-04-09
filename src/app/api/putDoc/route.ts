import { NextResponse } from "next/server";
import { nanoid } from "nanoid";
import { docs } from "@/../db/schema";
import { sql } from "@vercel/postgres";
import { drizzle } from "drizzle-orm/vercel-postgres";

const handleData = async (data: any) => {
  const db = drizzle(sql);
  console.log(data)
  const uuid = data.uuid && data.uuid !== '' ? data.uuid : nanoid(10);
  const result = await db
    .insert(docs)
    .values({
      content: data.content,
      title: data.file,
      updated: new Date(),
      path: data.path,
      password: data.password,
      uuid,
    })
    .onConflictDoUpdate({
      target: docs.uuid,
      set: {
        content: data.content,
        title: data.file,
        updated: new Date(),
        path: data.path,
        password: data.password,
      },
    });
  if (result) {
    return uuid;
  }
  return false;
};

const validateAPIKey = (apiKey: string) => {
  if (apiKey === process.env.API_KEY) {
    return true;
  }
  return false;
};

// To handle a POST request to /api
export async function POST(req: Request) {
  const authorization = req.headers.get("authorization");
  if (!authorization || !validateAPIKey(authorization)) {
    return NextResponse.error();
  }
  // Do whatever you want
  const data = await req.json();
  const uuid = await handleData(data);
  if (!uuid) {
    console.log("Error saving data");
    return NextResponse.error();
  }
  return NextResponse.json({ uuid }, { status: 200 });
}
