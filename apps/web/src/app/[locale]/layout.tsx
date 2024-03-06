import type { Metadata } from "next";
import "nes.css/css/nes.min.css";
import localFont from 'next/font/local';
import { NextIntlClientProvider, useMessages } from "next-intl";

const PressStart2P = localFont({src: '../../asset/PressStart2P/PressStart2P-Regular.ttf'})

export const metadata: Metadata = {
  title: "World of Studies",
  description: "Learning made fun!",
};

export default function RootLayout({
  children,
  params : {locale}
}: Readonly<{
  children: React.ReactNode;
  params : {locale: string}
}>) {
  const messages = useMessages();

  return (
    <html lang={locale}>
      <body style={PressStart2P.style}>
        <NextIntlClientProvider messages={messages}>
          {children}
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
