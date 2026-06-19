import type { Metadata } from "next";
import { Inter, Space_Grotesk, Bodoni_Moda } from "next/font/google";
import "./globals.css";
import Cursor from "@/components/Cursor";
import MotionProvider from "@/components/MotionProvider";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const spaceGrotesk = Space_Grotesk({
  variable: "--font-space",
  subsets: ["latin"],
  display: "swap",
});

const bodoni = Bodoni_Moda({
  variable: "--font-editorial",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Ahmed Shahdan — AKOI Studio",
  description:
    "Interior architect based in Malé, Maldives. Specializing in spatial design, 3D modeling, and architectural visualization.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${inter.variable} ${spaceGrotesk.variable} ${bodoni.variable} antialiased`}
    >
      <body>
        <script
          dangerouslySetInnerHTML={{
            __html:
              "(function(){try{var t=localStorage.getItem('theme');if(!t){t=(window.matchMedia&&window.matchMedia('(prefers-color-scheme: dark)').matches)?'dark':'light';}if(t==='dark'){document.documentElement.setAttribute('data-theme','dark');}}catch(e){}})();",
          }}
        />
        <Cursor />
        <MotionProvider>{children}</MotionProvider>
      </body>
    </html>
  );
}
