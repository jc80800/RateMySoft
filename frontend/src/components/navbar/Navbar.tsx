import Link from 'next/link'
import Image from 'next/image'
import LoginLogout from './LoginLogout'
import HorizontalLayout from '../layouts/HorizontalLayout'


const Navbar = async () => {

  const navLinks = [
    { href: "/", label: "Home" },
    { href: "/software", label: "Software" },
    { href: "/companies", label: "Companies" },
    { href: "/add-solution", label: "Add Solution" },
  ]

  return (
    <header>
      <HorizontalLayout className="p-1 justify-around border-b-2 px-5 md:px-20">
        <Link href="/">
          <HorizontalLayout>
            <Image className="hidden md:block"src="/app-icon.png" alt="RateMySoft" width={60} height={60} />
            <span className=" text-3xl font-semibold">RateMySoft</span>
          </HorizontalLayout>
        </Link>

        <nav>
          <HorizontalLayout className='gap-12'>
            {navLinks.map(({ href, label }) => (
              <Link key={href} href={href} className="group pb-1 text-(--dark-gray) text-xl font-semibold transition-colors duration-150 underline">
                {label}
              </Link>
            ))}
          </HorizontalLayout>
        </nav>

        <LoginLogout/>
      </HorizontalLayout>
    </header>
  )
}

export default Navbar
