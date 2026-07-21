"use client";

import { Suspense, useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import { useTranslate } from "@/hooks/useTranslate";
import { showMascotToast } from "@/components/ui/Mascot/MascotToast";

function LoginForm() {

    const dictionary = useTranslate();
    const t = dictionary.auth.signIn;
    const tagline = dictionary.auth.landing.tagline;

    const router = useRouter();
    const searchParams = useSearchParams();
    const next = searchParams.get("next") || "/";

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);

    async function handleSubmit(e) {
        e.preventDefault();
        if (!email.trim() || !password) return;

        setIsSubmitting(true);
        const result = await signIn("credentials", {
            email: email.trim(),
            password,
            redirect: false,
        });
        setIsSubmitting(false);

        if (result?.error) {
            showMascotToast("Incorrect email or password.", { variant: "error" });
            return;
        }

        showMascotToast(dictionary.toasts.welcomeBack);
        router.push(next);
    }

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 min-h-screen">
            {/* Left: full-bleed image */}
            <div className="relative hidden md:block">
                <Image
                    src="/images/hero.jpg"
                    alt=""
                    fill
                    className="object-cover"
                    priority
                />
            </div>

            {/* Right: centered form */}
            <div className="flex flex-col items-center justify-center px-8 py-16">
                <Image src="/images/gist-logo.png" alt="GIST" width={140} height={140} priority />

                <p className="text-lg text-foreground mt-6 mb-8">{tagline}</p>

                <form onSubmit={handleSubmit} className="w-full max-w-sm flex flex-col gap-4">
                    <Input
                        id="login-email"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder={t.emailPlaceholder}
                        required
                        className="gradient-border rounded-full px-5 py-3 h-auto"
                    />

                    <Input
                        id="login-password"
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder={t.passwordPlaceholder}
                        required
                        className="gradient-border rounded-full px-5 py-3 h-auto"
                    />

                    <Button
                        type="submit"
                        variant="primary"
                        size="large"
                        className="rounded-full mt-2"
                        disabled={isSubmitting}
                        loading={isSubmitting}
                    >
                        {t.loginButton}
                    </Button>

                    <Link
                        href="/signup"
                        className="text-sm text-center mt-1"
                        style={{ color: "var(--primary)" }}
                    >
                        {t.createAccount}
                    </Link>
                </form>
            </div>
        </div>
    );
}



export default function LoginPage() {
    return (
        <Suspense fallback={null}>
            <LoginForm />
        </Suspense>
    )
}