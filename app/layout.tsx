import './globals.css'

export const metadata = {
  title: 'Drivetrain calculator',
  description: 'Visualize bicycle drivetrain gearing differences',
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
