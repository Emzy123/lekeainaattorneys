import './globals.css'
import { Playfair_Display, Lato, Fira_Code } from 'next/font/google'
import { Metadata } from 'next'
import { Header } from '../components/Header'
import { Footer } from '../components/Footer'

const playfair = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-playfair',
  weight: ['400', '600', '700', '900'],
  display: 'swap',
})

const lato = Lato({
  subsets: ['latin'],
  variable: '--font-lato',
  weight: ['400', '700'],
  display: 'swap',
})

const firaCode = Fira_Code({
  subsets: ['latin'],
  variable: '--font-fira-code',
  weight: ['400'],
  display: 'swap',
})

export const metadata: Metadata = {
  title: {
    default: 'LEX Platform — Global-Standard Law Firm Digital Infrastructure',
    template: '%s | LEX Platform',
  },
  description: 'Enterprise-grade digital infrastructure and unparalleled legal expertise. When the stakes are highest, LEX is the firm you want in your corner.',
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'),
  openGraph: {
    title: 'LEX Platform',
    description: 'Global-Standard Law Firm Digital Infrastructure',
    type: 'website',
    siteName: 'LEX Platform',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'LEX Platform',
    description: 'Global-Standard Law Firm Digital Infrastructure',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={`${playfair.variable} ${lato.variable} ${firaCode.variable}`}>
      <body className="font-body font-normal text-base antialiased bg-lex-smoke text-lex-navy">
        <Header />
        <main>{children}</main>
        <Footer />
      </body>
    </html>
  )
}
