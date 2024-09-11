import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/providers/theme-provider";
import { Toaster } from "@/components/ui/sonner";
import { Footer } from "@/components/Footer";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Connect App",
  description: "New Gen connect platform, for all of your connections.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <div className="flex min-h-screen dark:bg-slate-950">
            <main className="sm:flex-grow transition-all duration-300 ease-in-out">
              {children}
            </main>
            {/* <Footer /> */}
          </div>
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}
