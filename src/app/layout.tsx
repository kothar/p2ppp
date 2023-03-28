import './globals.css'

export const metadata = {
  title: 'P2PPP',
  description: 'Peer to Peer Planning Poker',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
