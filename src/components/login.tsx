"use client";

// daisyui login page tailwind, password only, minimal
import { VercelPgDatabase } from "drizzle-orm/vercel-postgres";
import React from "react";

export default function Login({ id, db }: { id: string }) {
  const [password, setPassword] = React.useState("");
  const [error, setError] = React.useState("");
  const handleSubmit = async () => {
    if (!password || password === "") {
      setError("Password cannot be empty");
      return;
    }
    const response = await fetch("/api/auth", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ password, id }),
    });
    console.log(response.status)
    if (response.status === 200) {
      const data = await response.json();
      document.cookie = `doc_${id}_pass=${data.sessionID}`;
      window.location.reload();
      return;
    }
    setError("Incorrect password");
  };
  return (
    <div className="flex items-center justify-center h-screen">
      <div className="w-full max-w-xs">
        <div className="text-red-500">{error}</div>
        <form className=" shadow-md rounded px-8 pt-6 pb-8 mb-4" onSubmit={e => e.preventDefault()} >
          <div className="mb-4">
            <label
              className="block text-gray-700 text-sm font-bold mb-2"
              htmlFor="password"
            >
              Password
            </label>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="password"
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onKeyUp={(e) => {
                if (e.key === "Enter") {
                  handleSubmit();
                }
              }}
            />
          </div>
          <div className="flex items-center justify-between">
            <button
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
              type="button"
              onClick={handleSubmit}
            >
              Sign In
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
