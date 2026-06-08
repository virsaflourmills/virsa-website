"use client";

import { useState } from "react";
import { supabase } from "../../lib/supabase/client";

export default function AdminLoginPage() {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");

  async function login(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    if (email.toLowerCase() !== "virsaflourmills@gmail.com") {
      setError("Access denied. Only Virsa admin can login.");
      return;
    }

    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: `${window.location.origin}/admin/stores`,
      },
    });

    if (error) {
      setError(error.message);
      return;
    }

    setSent(true);
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#fff8ea] px-6 text-[#241104]">
      <form
        onSubmit={login}
        className="w-full max-w-md rounded-[2rem] border border-black/5 bg-white p-8 shadow-2xl"
      >
        <p className="text-sm font-black uppercase tracking-[0.3em] text-[#b17422]">
          Virsa Admin
        </p>

        <h1 className="mt-4 text-4xl font-black">
          Admin Login
        </h1>

        <p className="mt-4 leading-7 text-[#5c4634]">
          Login is restricted to Virsa Flour Mills admin email only.
        </p>

        <input
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="virsaflourmills@gmail.com"
          className="mt-8 w-full rounded-2xl border border-black/10 px-5 py-4 outline-none"
        />

        {error && (
          <p className="mt-4 rounded-xl bg-red-50 p-3 text-sm font-bold text-red-600">
            {error}
          </p>
        )}

        {sent && (
          <p className="mt-4 rounded-xl bg-green-50 p-3 text-sm font-bold text-green-700">
            Login link sent. Check your email.
          </p>
        )}

        <button
          type="submit"
          className="mt-6 w-full rounded-full bg-[#241104] px-6 py-4 text-sm font-black text-white"
        >
          Send Login Link
        </button>
      </form>
    </main>
  );
}

