import type React from "react"
import type { Metadata } from "next"
import "./globals.css"
import { ThemeProvider } from "@/src/components/common/theme-provider"
import { Toaster } from "@/src/components/ui/toaster"
import { FontLoader } from "@/src/components/common/font-loader"

export const metadata: Metadata = {
  title: "ЯКУТПРОЕКТ - Республиканский проектно-изыскательский институт",
  description: "Республиканский проектно-изыскательский институт ЯКУТПРОЕКТ",
  icons: {
    icon: "/favicon.ico",
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ru" suppressHydrationWarning>
      <head>
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <meta name="theme-color" content="#2563eb" />
        <meta name="wb:op" content="af50f667fcfa00105d178454abd58f10" />
        {/* Preload основного шрифта */}
        <link
          rel="preload"
          href="/fonts/akzidenzgroteskpro_regular.ttf"
          as="font"
          type="font/truetype"
          crossOrigin="anonymous"
        />
      </head>
      <body className="font-primary antialiased">
        <FontLoader />
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem disableTransitionOnChange>
          {children}
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  )
}
