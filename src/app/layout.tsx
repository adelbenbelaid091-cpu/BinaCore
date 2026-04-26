import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import { AppProvider } from "@/contexts/AppContext";
import { ProjectAuthProvider } from "@/contexts/ProjectAuthContext";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "BinaCore - Construction Project Management",
  description: "Modern construction project management and site tracking application",
  keywords: ["BinaCore", "construction", "project management", "site tracking", "building"],
  authors: [{ name: "BinaCore Team" }],
  icons: {
    icon: "/logo.svg",
  },
  openGraph: {
    title: "BinaCore",
    description: "Construction project management made easy",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="antialiased bg-background text-foreground" suppressHydrationWarning>
        <ProjectAuthProvider>
          <AppProvider>
            {children}
            <Toaster />
          </AppProvider>
        </ProjectAuthProvider>
      </body>
    </html>
  );
}
