import "./globals.css";

export const metadata = {
  title: "Mizan - Decision Room",
  description: "Structured multi-agent decision support with thesis, antithesis, evidence, and judge roles.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
