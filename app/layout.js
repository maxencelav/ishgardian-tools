import { Michroma, M_PLUS_2, Cinzel } from "next/font/google";
import "./globals.css";

// Large width font (Item level, numbers, etc.)
const michroma = Michroma({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-michroma",
});
// Header font (Dungeon names, etc.)
const cinzel = Cinzel({
  subsets: ["latin"],
  variable: "--font-cinzel",
});
// Body font (Everything else)
const mplus2 = M_PLUS_2({
  subsets: ["latin","latin-ext"],
  variable: "--font-mplus",
});

export const metadata = {
  title: "Ishgardian Tools",
  description: "Coming soon!",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${mplus2.variable} ${cinzel.variable} ${michroma.variable}`}>
        {children}
      </body>
    </html>
  );
}
