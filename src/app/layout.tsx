import type { Metadata } from "next"
import { Inter } from "next/font/google"
import { ThemeProvider } from "@/components/theme-provider"
import { Toaster } from "@/components/ui/sonner"
import { AppShell } from "@/components/app-shell"
import { APP_METADATA } from "@/lib/constants"
import "@/styles/globals.css"

const inter = Inter({ 
  subsets: ["latin"],
  variable: "--font-inter",
})


export const metadata: Metadata = {
  title: {
    default: APP_METADATA.name,
    template: `%s | ${APP_METADATA.name}`
  },
  description: APP_METADATA.description,
  authors: [{ name: APP_METADATA.author }],
  creator: APP_METADATA.author,
  keywords: [
    "phishing detection",
    "scam analysis", 
    "cybersecurity",
    "AI security",
    "India phishing",
    "UPI fraud detection",
    "message scanner"
  ],
  openGraph: {
    type: "website",
    locale: "en_IN",
    url: process.env.NEXT_PUBLIC_APP_URL,
    title: APP_METADATA.name,
    description: APP_METADATA.description,
    siteName: APP_METADATA.name,
  },
  twitter: {
    card: "summary_large_image",
    title: APP_METADATA.name,
    description: APP_METADATA.description,
    creator: `@${APP_METADATA.author}`,
  },
  robots: {
    index: true,
    follow: true,
  },
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon-16x16.png",
    apple: "/apple-touch-icon.png",
  },
  manifest: "/site.webmanifest",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.variable} font-sans antialiased`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          <AppShell>
            {children}
          </AppShell>
          <Toaster position="bottom-right" />
        </ThemeProvider>
      </body>
    </html>
  )
}