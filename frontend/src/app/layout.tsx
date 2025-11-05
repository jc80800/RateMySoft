import "./globals.css";
import Navbar from "@/components/navbar/Navbar";
import Providers from "@/app/providers"
import { getServerSession } from "next-auth";
import { authOptions } from "@/libs/auth";
import Footer from "@/components/footer/footer";


export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // server-side: get session and pass to client Providers
  const session = await getServerSession(authOptions)

  return (
    <html lang="en">
      <body>
        <Providers session={session}>
          <Navbar session={session} />
            <div className="background">
              {children}
            </div>
          <Footer/>
        </Providers>
      </body>
    </html>
  );
}
