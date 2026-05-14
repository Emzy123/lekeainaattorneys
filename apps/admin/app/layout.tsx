import type { Metadata } from 'next';
import { Playfair_Display, Lato, Fira_Code } from 'next/font/google';
import './globals.css';

const playfair = Playfair_Display({ 
  subsets: ['latin'], 
  variable: '--font-playfair',
  weight: ['400', '600', '700', '900'],
  display: 'swap',
});

const lato = Lato({ 
  subsets: ['latin'], 
  variable: '--font-lato',
  weight: ['400', '700'],
  display: 'swap',
});

const firaCode = Fira_Code({ 
  subsets: ['latin'], 
  variable: '--font-fira-code',
  weight: ['400'],
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'LEX Platform Admin',
  description: 'Management dashboard for LEX Platform',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${playfair.variable} ${lato.variable} ${firaCode.variable}`}>
      <body className="font-body font-normal text-[14px] antialiased bg-lex-admin-dark text-lex-smoke">
        {children}
      </body>
    </html>
  );
}
