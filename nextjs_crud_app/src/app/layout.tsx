import { AntdRegistry } from "@ant-design/nextjs-registry";
import "./globals.css";

export const metadata = {
  title: "Project Dashboard",
  description: "Basic Dashboard Layout",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-gray-100 min-h-screen">
        <AntdRegistry>{children}</AntdRegistry>
      </body>
    </html>
  );
}
