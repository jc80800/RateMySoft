import "./globals.css";
import Navbar from "@/components/navbar/Navbar";
import Providers from "@/app/providers"
import { getServerSession } from "next-auth";
import Footer from "@/components/footer/footer";


export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

  return (
    <html lang="en">
      <body>
        <Providers>
          <Navbar />
            <div className="py-24 bg-[#f4f7f5]">
              {children}
            </div>
          <Footer/>
        </Providers>
      </body>
    </html>
  );
}
