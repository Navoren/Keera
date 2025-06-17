import { Inter } from "next/font/google";
import { ClerkProvider } from "@clerk/nextjs";
import { ThemeProvider } from "@/components/ui/theme-provider";
import Header from "@/components/common/Header";
import { Button } from "@/components/ui/button";
import { Github, Twitter, Linkedin } from "lucide-react";
import { Toaster } from "@/components/ui/sonner";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata = {
  title: "Keera – Orchestrate the Chaos",
  description: "Keera helps you bring clarity, structure, and flow to your team's projects and priorities.",
};

export default function RootLayout({ children }) {
  return (
    <ClerkProvider dynamic>
      <html lang="en" suppressHydrationWarning>
        <body className={inter.className}>
          <ThemeProvider
            attribute="class"
            defaultTheme="dark"
            enableSystem
            disableTransitionOnChange
          >
            <Header />
            <main className="min-h-screen">{children}</main>
            <Toaster richColors />
            <footer className="text-center p-4 md:p-6 flex flex-col border-t">
              <div>
                <a href="https://github.com/Navoren">
                  <Button variant="ghost" className="m-3">
                    <Github />
                  </Button>
                </a>
                <a href="https://twitter.com/nmntmr">
                  <Button variant="ghost" className="m-3">
                    <Twitter />
                  </Button>
                </a>
                <a href="https://www.linkedin.com/in/navoren/">
                  <Button variant="ghost" className="m-3">
                    <Linkedin />
                  </Button>
                </a>
              </div>
              Made with ❤️ by @navoren
            </footer>
          </ThemeProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}