import './globals.css';

export const metadata = {
  title: 'LoanGuard AI — AI-Powered Loan Default Risk Assessment',
  description: 'Evaluate borrower risk using machine learning and make smarter lending decisions with LoanGuard AI.',
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black-translucent',
    title: 'LoanGuard AI',
  },
};

export const viewport = {
  themeColor: '#0f172a',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="scroll-smooth">
      <head>
        <link rel="icon" href="/favicon.ico" sizes="any" />
      </head>
      <body className="bg-slatebg text-slate-900 antialiased font-sans">
        {children}
      </body>
    </html>
  );
}

