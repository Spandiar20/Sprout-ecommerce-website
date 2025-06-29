import "./globals.css";
import Nav from "@/components/navigation/nav"

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="">
        <Nav />
      </body>
    </html>
  );
}
