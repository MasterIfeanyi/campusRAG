// src/components/Navbar/MobileNavMenu.jsx
"use client";

import { useSession, signOut } from "next-auth/react";
import { useTheme } from "next-themes";
import { useRouter } from "next/navigation";
import Icon from "@/icons/Icon";
import Button from "../Button";
import ActionMenu from "../ActionMenu/ActionMenu";

export default function MobileNavMenu() {
  const { status } = useSession();
  const router = useRouter();
  const { theme, setTheme } = useTheme();
  const isLoggedIn = status === "authenticated";

  const actions = [
    !isLoggedIn && {
      key: "login",
      icon: "login",
      label: "Log in / Sign up",
      onClick: () => router.push("/login"),
    },
    {
      key: "display-mode",
      icon: theme === "dark" ? "sun" : "moon",
      label: theme === "dark" ? "Light mode" : "Dark mode",
      onClick: () => setTheme(theme === "dark" ? "light" : "dark"),
    },
    isLoggedIn && {
      key: "logout",
      icon: "logout",
      label: "Log out",
      danger: true,
      onClick: () => signOut(),
    },
  ].filter(Boolean);

  return (
    <ActionMenu
      actions={actions}
      trigger={({ toggle }) => (
        <Button
          variant="other"
          size="small"
          icon={<Icon name="menu" size={20} />}
          onClick={toggle}
          className="border-0 px-1.5!"
        />
      )}
    />
  );
}