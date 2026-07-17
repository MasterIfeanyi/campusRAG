// src/components/Navbar/Navbar.jsx
"use client";

import { useState } from "react";
import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import Button from "../ui/Button";
import Input from "../ui/Input";
import MobileNavMenu from "./MobileNavMenu";
import Icon from "@/icons/Icon";
import { useFeedStore } from "@/store/useFeedStore";
import { useAskQuestion } from "@/hooks/useAskQuestion";

export default function Navbar() {
    const { data: session, status } = useSession();
    const isLoading = status === "loading";
    const isLoggedIn = status === "authenticated";

    const router = useRouter();
    const showAnswer = useFeedStore((state) => state.showAnswer);
    const { mutate: askQuestion, isPending } = useAskQuestion();

    const [question, setQuestion] = useState("");

    function handleAsk(q) {
        if (!q.trim()) return;
        router.push("/");
        askQuestion(q, {
            onSuccess: (data) => showAnswer(q, data.answer, data.sources),
        });
    }

    function handleKeyDown(e) {
        if (e.key === "Enter") {
            handleAsk(question);
        }
    }

    return (
        <nav className="flex items-center justify-between px-4 md:px-8 py-4 border-b border-border bg-background">
            <Link href="/" className="flex gap-1 items-center shrink-0">
                <Image
                    src="/images/gist-logo.png"
                    alt="GIST Logo"
                    width={80}
                    height={80}
                />
            </Link>

            <div className="flex-1 max-w-md mx-4 md:mx-8">
                <div className="flex items-center gap-2 px-4 py-2 rounded-full border border-border bg-card">
                    <Icon name="search" size={16} className="text-muted-foreground shrink-0" />
                    <Input
                        id="navbar-search"
                        variant="ghost"
                        type="text"
                        placeholder="Find anything"
                        value={question}
                        onChange={(e) => setQuestion(e.target.value)}
                        onKeyDown={handleKeyDown}
                        disabled={isPending}
                    />
                    <Button
                        type="button"
                        bare
                        onClick={() => handleAsk(question)}
                        disabled={isPending}
                        icon={<Icon name="sparkles" size={14} className="text-primary" />}
                        className="pl-3 border-l border-border shrink-0 rounded-none"
                    >
                        <span className="hidden sm:inline text-sm">
                            {isPending ? "Asking..." : "Ask"}
                        </span>
                    </Button>
                </div>
            </div>

            {/* Desktop buttons, hidden below md */}
            <div className="hidden md:flex items-center gap-3">
                {isLoading ? (
                    <div className="flex items-center gap-3 animate-pulse">
                        <div className="h-4 w-24 rounded bg-muted" />
                        <div className="h-9 w-20 rounded-full bg-muted" />
                    </div>
                ) : isLoggedIn ? (
                    <div className="flex items-center gap-3">
                        <span className="text-sm text-foreground">
                            {session.user?.displayName}
                        </span>
                        <Button variant="neutral" size="medium" className="rounded-full" onClick={() => signOut()}>
                            Log out
                        </Button>
                    </div>
                ) : (
                    <>
                        <Link href="/signup">
                            <Button variant="secondary" size="medium" className="rounded-full">
                                Sign up
                            </Button>
                        </Link>
                        <Link href="/login">
                            <Button variant="primary" size="medium" className="rounded-full">
                                Log in
                            </Button>
                        </Link>
                    </>
                )}
            </div>

            {/* Mobile hamburger, hidden md and up */}
            <div className="md:hidden">
                <MobileNavMenu />
            </div>
        </nav>
    );
}