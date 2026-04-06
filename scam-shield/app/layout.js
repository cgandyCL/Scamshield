import "./globals.css";

export const metadata = {
  title: "Scam Shield — AI Scam Detector",
  description:
    "Paste a suspicious text, email, or voicemail transcript and get an instant AI-powered scam analysis.",
  manifest: "/manifest.json",
  themeColor: "#0a0e1a",
  viewport: "width=device-width, initial-scale=1, maximum-scale=1",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700;800&display=swap"
          rel="stylesheet"
        />
        <link rel="icon" href="/icon-192.png" />
        <link rel="apple-touch-icon" href="/icon-512.png" />
      </head>
      <body>{children}</body>
    </html>
  );
}
