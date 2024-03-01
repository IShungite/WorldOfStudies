import type { Metadata } from "next";
import "nes.css/css/nes.min.css";
import localFont from 'next/font/local';

const PressStart2P = localFont({src: '../asset/PressStart2P/PressStart2P-Regular.ttf'})

export const metadata: Metadata = {
  title: "Create Next App",
  description: "Generated by create next app",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body style={PressStart2P.style}>{children}</body>
    </html>
  );
}
