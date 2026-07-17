// src/components/Navbar/Navbar.jsx
"use client";

import { useSession, signOut } from "next-auth/react";
import Link from "next/link";
import Image from "next/image";
import Button from "../ui/Button";
import MobileNavMenu from "./MobileNavMenu";
import Icon from "@/icons/Icon";

export default function Navbar() {
    const { data: session, status } = useSession();
    const isLoading = status === "loading";
    const isLoggedIn = status === "authenticated";

    return (
        <nav className="flex items-center justify-between px-4 md:px-8 py-4 border-b border-border bg-background">
            <Link href="/" className="flex gap-1 items-center shrink-0">
                <Image
                    src="/images/gist-logo.png"
                    alt="GIST Logo"
                    width={40}
                    height={40}
                />
            </Link>

            <div className="flex-1 max-w-md mx-4 md:mx-8">
                <div className="flex items-center gap-2 px-4 py-2 rounded-full border border-border bg-card">
                    <Icon name="search" size={16} className="text-muted-foreground shrink-0" />
                    <input
                        type="text"
                        placeholder="Find anything"
                        className="flex-1 min-w-0 bg-transparent outline-none text-sm text-foreground placeholder:text-muted-foreground"
                    />
                    <div className="flex items-center gap-1 pl-3 border-l border-border shrink-0">
                        <Icon name="sparkles" size={14} className="text-primary" />
                        <span className="hidden sm:inline text-sm text-primary">Ask</span>
                    </div>
                </div>
            </div>

            {/* Desktop buttons, hidden below md */}
            <div className="hidden md:flex items-center gap-3">
                {isLoading ? (
                    // skeleton loader for slower internet connections
                    <div className="flex items-center gap-3 animate-pulse">
                        <div className="h-4 w-24 rounded bg-muted" />
                        <div className="h-9 w-20 rounded-full bg-muted" />
                    </div>
                ) : isLoggedIn ? (
                    <div className="flex items-center gap-3">
                        <span className="text-sm text-foreground">
                            {session.user?.name || session.user?.email}
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