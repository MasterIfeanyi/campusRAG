"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

const FEATURES = [
  "Ask questions in plain language",
  "Searchable knowledge base",
  "Admin moderation",
  "Real people, verified experiences",
];

export default function JoinPromoCard() {
  const { status } = useSession();
  const router = useRouter();

  // Logged-in users don't need the sign-up pitch
  if (status === "authenticated") return null;

  return (
    <div className="hidden:md rounded-2xl overflow-hidden bg-zinc-900 text-white p-6 flex flex-col justify-between min-h-[340px] bg-[url('/people-laughing.jpg')] bg-cover bg-center">
      <div className="bg-black/50 -m-6 p-6 rounded-2xl flex flex-col justify-between h-full">
        <div>
          <h2 className="text-xl text-white font-semibold leading-snug mb-4">
            Join the most <span className="text-green-400">real place</span> on the internet
          </h2>
          <ul className="space-y-2 text-sm text-zinc-200">
            {FEATURES.map((feature) => (
              <li key={feature} className="flex items-center gap-2">
                <span className="text-green-400">—</span>
                {feature}
              </li>
            ))}
          </ul>
        </div>

        <button
          onClick={() => router.push("/signup")}
          className="mt-6 w-full py-2.5 rounded-full bg-green-500 hover:bg-green-600 text-white font-medium text-sm transition-colors"
        >
          Sign up
        </button>
      </div>
    </div>
  );
}