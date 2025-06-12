import { Inter } from "next/font/google";
import { ClerkProvider } from "@clerk/nextjs";
import { ThemeProvider } from "@/components/ui/theme-provider";
import Header from "@/components/common/Header";
import { Button } from "@/components/ui/button";
import { Github, Twitter, Linkedin } from "lucide-react";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata = {
  title: "Keera",
  description: "A Jira Clone for managing your projects",
};

export default function RootLayout({ children }) {
  return (
    <ClerkProvider>
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
