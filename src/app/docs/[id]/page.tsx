import { sql } from "@vercel/postgres";
import { drizzle } from "drizzle-orm/vercel-postgres";
import * as schema from "@/../db/schema";
import { eq } from "drizzle-orm";
import Markdown from "react-markdown";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { materialDark } from "react-syntax-highlighter/dist/esm/styles/prism";
import rehypeKatex from "rehype-katex";
import remarkMath from "remark-math";
import "katex/dist/katex.min.css";
import ThemeSwitcher from "@/components/themeSwitcher";
import { cookies } from "next/headers";
import Login from "@/components/login";
import Head from "next/head";
import { Metadata } from 'next'
import remarkGfm from 'remark-gfm'


export default async function Page({ params }: { params: { id: string } }) {
  const db = drizzle(sql);
  const post = await db
    .select()
    .from(schema.docs)
    .where(eq(schema.docs.uuid, params.id));
  if (!post || !post[0]) {
    return <div>Post not found</div>;
  }

  const thisCookie = cookies().get(`doc_${params.id}_pass`)?.value ?? "";
  if (!thisCookie) {
    return <Login id={params.id} />;
  }

  const authorized = await db
    .select()
    .from(schema.sessions)
    .where(
      eq(schema.sessions.sessionID, thisCookie) &&
        eq(schema.sessions.docID, params.id),
    );

  if (post[0].password && authorized.length === 0) {
    return <Login id={params.id} />;
  }

  // regex to extract tags from the content
  const tags = post[0].content?.match(/(?<=\s|^)#\w+/g) ?? [];
  // remove the tags from the content
  post[0].content = post[0].content?.replace(/(?<=\s|^)#\w+/g, "") ?? "";

  // Replace brackets with ** [[Divide & Conquer]]
  post[0].content = post[0].content?.replace(/\[\[(.*?)\]\]/g, "**$1**") ?? "";

  // Delete everything within the first instance of
  // ---
  // here
  // ---
  post[0].content = post[0].content?.replace(/---[\s\S]*?---/, "") ?? "";

  return (
    <>
      <Head>
        <title>{replaceMdExtension(post[0]?.title ?? "")}</title>
      </Head>
      <ThemeSwitcher />
      <main className="flex justify-center pb-36">
        <article className="w-full max-w-screen-lg prose">
          <h1 className="text-4xl font-bold">
            {replaceMdExtension(post[0]?.title ?? "")}
          </h1>
          <div className="flex flex-wrap gap-2">
            {tags.map((tag) => (
              <span key={tag} className="badge badge-primary">
                {tag}
              </span>
            ))}
          </div>
          <Markdown
            remarkPlugins={[remarkMath, remarkGfm]}
            rehypePlugins={[rehypeKatex]}
            components={{
              code(props) {
                const { children, className, node, ...rest } = props;
                const match = /language-(\w+)/.exec(className || "");
                return match ? (
                  <SyntaxHighlighter
                    PreTag="div"
                    language={match[1]}
                    style={materialDark}
                  >
                    {String(children).replace(/\n$/, "")}
                  </SyntaxHighlighter>
                ) : (
                  <code {...rest} className={className}>
                    {children}
                  </code>
                );
              },
            }}
          >
            {post[0].content}
          </Markdown>
        </article>
      </main>
    </>
  );
}

function replaceMdExtension(str: string, replacement: string = ""): string {
  if (str.endsWith(".md")) {
    return str.slice(0, -3) + replacement;
  }
  return str;
}
export const metadata: Metadata = {
  title: 'Obsidian Next Publisher | View document',
}
 