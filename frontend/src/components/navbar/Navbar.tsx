import Link from 'next/link'
import Image from 'next/image'
import LoginLogout from './LoginLogout'
import HorizontalLayout from '../HorizontalLayout'


const Navbar = async ({ session }: { session?: import("next-auth").Session | null }) => {

  const navBaseClasses = [
    "group",
    "pb-1",
    "text-black",
    "transition-colors",
    "duration-150",
    "underline",
  ].join(" ")

  const navLinks = [
    { href: "/", label: "Home" },
    { href: "/software", label: "Software" },
    { href: "/companies", label: "Companies" },
    { href: "/add-solution", label: "Add Solution" },
  ]

  return (
    <header>
      <HorizontalLayout className="p-1 gap-4 justify-around border-b-2 px-20">
        <Link href="/">
          <HorizontalLayout>
            <Image src="/app-icon.png" alt="RateMySoft" width={60} height={60} />
            <span className=" text-3xl font-semibold">RateMySoft</span>
          </HorizontalLayout>
        </Link>

        <nav>
          <HorizontalLayout>
            {navLinks.map(({ href, label }) => (
              <Link key={href} href={href} className={navBaseClasses}>
                {label}
              </Link>
            ))}
          </HorizontalLayout>
        </nav>

        <LoginLogout initialSession={session ?? undefined} />
      </HorizontalLayout>
    </header>
  )
}

export default Navbar
