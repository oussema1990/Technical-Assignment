"use client";

import "./globals.css";
import { UserProvider, useUser } from "./context/UserContext";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { useEffect } from "react";
import { MantineProvider } from "@mantine/core";
import { texts } from "@/locales";
import "./lib/fontawesome";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPowerOff,faSignInAlt,faUser } from '@fortawesome/free-solid-svg-icons';

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html lang="en">
            <meta name="viewport" content="width=device-width, initial-scale=1" />
            <body>
                    <UserProvider>
                        <ProtectedLayout>
                            <Navbar />
                            <main className="p-4">{children}</main>
                        </ProtectedLayout>
                    </UserProvider>
            </body>
        </html>
    );
}

function Navbar() {
    const { user, logout } = useUser();
    const router = useRouter();

    const handleLogout = () => {
        logout();
        router.replace("/login");
    };

    return (
<header className="bg-gray-800 text-white p-4">
  <nav className="flex flex-wrap items-center justify-between">
    {/* Navigation menu  */}
    <div className="w-full md:w-auto mb-4 md:mb-0 flex justify-center md:justify-start space-x-4">
      {user ? (
        <>
          <Link href="/dashboard" className="hover:underline">
            {texts.header.navBar.dashboard}
          </Link>
          <Link href="/users" className="hover:underline">
            {texts.header.navBar.users}
          </Link>
          {(!user || (user.role !== "viewer")) ? (
          <Link href="/uploads" className="hover:underline">
            {texts.header.navBar.uploads}
          </Link>
          ) : null }

        </>
      ) : null}
    </div>

    {/* right header */}
    <div className="w-full md:w-auto flex justify-center md:justify-end space-x-4">
      {user ? (
        <div className="flex flex-col md:flex-row items-center space-y-2 md:space-y-0 md:space-x-4">
          <span className="text-sm text-center md:text-left">
             <FontAwesomeIcon icon={faUser} style={{ marginRight: '10px' }} />
             {user.email} ({user.role})
          </span>
          <button
            onClick={handleLogout}
            className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
          >
          <FontAwesomeIcon icon={faPowerOff} style={{ marginRight: '10px' }} />
            {texts.header.btnLogout}
          </button>
        </div>
      ) : (
        <Link
          href="/login"
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 text-center"
        >
          <FontAwesomeIcon icon={faSignInAlt} style={{ marginRight: '10px' }} />
          {texts.header.btnLogin}
        </Link>
      )}
    </div>
  </nav>
</header>

    );
}

function ProtectedLayout({ children }: { children: React.ReactNode }) {
    const { user } = useUser();
    const router = useRouter();
    const pathname = usePathname();

    useEffect(() => {
      if (!user && pathname !== "/login") {
        router.replace("/login");
      }
    }, [user, pathname, router]);

    if (!user && pathname !== "/login") {
      return null;
    }

    return <>{children}</>;
}
