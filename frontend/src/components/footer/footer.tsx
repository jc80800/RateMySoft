
import VerticalLayout from '../layouts/VerticalLayout';
import HorizontalLayout from '../layouts/HorizontalLayout';
import Image from 'next/image'
import Link from 'next/link';
import Subscribe from './Subscribe';
import FlexibleLayout from '../layouts/FlexibleLayout';

const Footer: React.FC = () => {

    return (
        <footer className='border-t-2 mt-10 pt-20 background h-screen'>
            <VerticalLayout className='items-center gap-20 px-8 md:px-10 lg:px-20 xl:px-30 2xl:px-60'>
                <FlexibleLayout className='gap-24'>
                    <VerticalLayout>
                        <HorizontalLayout>
                            <Image src="/app-icon.png" alt="RateMySoft" width={60} height={60} />
                            <h1 className=" text-3xl font-semibold">RateMySoft</h1>
                        </HorizontalLayout>
                        <p>
                            Finding the perfect software solutions with Fufu's help! 🐼✨
                        </p>
                        <HorizontalLayout className='justify-start'>
                            <a
                                href="#"
                                aria-label="Twitter"
                                className="w-12 h-12 flex items-center justify-center rounded-full border-2 border-black hover:bg-black hover:text-white transition-colors"
                            >
                                <span className="text-lg">🐦</span>
                            </a>
                            <a
                                href="#"
                                aria-label="GitHub"
                                className="w-12 h-12 flex items-center justify-center rounded-full border-2 border-black hover:bg-black hover:text-white transition-colors"
                            >
                                <span className="text-lg">🐙</span>
                            </a>
                            <a
                                href="#"
                                aria-label="Discord"
                                className="w-12 h-12 flex items-center justify-center rounded-full border-2 border-black hover:bg-black hover:text-white transition-colors"
                            >
                                <span className="text-lg">💬</span>
                            </a>
                            <a
                                href="#"
                                aria-label="Email"
                                className="w-12 h-12 flex items-center justify-center rounded-full border-2 border-black hover:bg-black hover:text-white transition-colors"
                            >
                                <span className="text-lg">📧</span>
                            </a>
                        </HorizontalLayout>
                    </VerticalLayout>
                    <HorizontalLayout className='gap-3 md:gap-10'>
                        <VerticalLayout>
                            <h3 >Explore</h3>
                            <ul>
                                <VerticalLayout>
                                    <li><p><Link className="underline" href="/software">All Software</Link></p></li>
                                    <li><p><Link className="underline" href="/categories">Categories</Link></p></li>
                                    <li><p><Link className="underline" href="/reviews">Latest Reviews</Link></p></li>
                                    <li><p><Link className="underline" href="/trending">Trending</Link></p></li>
                                </VerticalLayout>
                            </ul>
                        </VerticalLayout>
                        <VerticalLayout>
                            <h3 >Support</h3>
                            <ul>
                                <VerticalLayout>
                                    <li><p><Link className="underline" href="/help">Help Center</Link></p></li>
                                    <li><p><Link className="underline" href="/contact">Contact Us</Link></p></li>
                                    <li><p><Link className="underline" href="/faq">FAQ</Link></p></li>
                                    <li><p><Link className="underline" href="/bug-report">Report Bug</Link></p></li>
                                </VerticalLayout>
                            </ul>
                        </VerticalLayout>
                        <VerticalLayout>
                            <h3 >Company</h3>
                            <ul >
                                <VerticalLayout>
                                    <li><p><Link className="underline" href="/about">About Us</Link></p></li>
                                    <li><p><Link className="underline" href="/careers">Careers</Link></p></li>
                                    <li><p><Link className="underline" href="/press">Press</Link></p></li>
                                    <li><p><Link className="underline" href="/partners">Partners</Link></p></li>
                                </VerticalLayout>
                            </ul>
                        </VerticalLayout>
                        <VerticalLayout>
                            <h3 >Company</h3>
                            <ul >
                                <VerticalLayout className='gap-1.5'>
                                    <li><p><Link className="underline" href="/about">About Us</Link></p></li>
                                    <li><p><Link className="underline" href="/careers">Careers</Link></p></li>
                                    <li><p><Link className="underline" href="/press">Press</Link></p></li>
                                    <li><p><Link className="underline" href="/partners">Partners</Link></p></li>
                                </VerticalLayout>
                            </ul>
                        </VerticalLayout>
                    </HorizontalLayout>
                </FlexibleLayout>


                {/* Newsletter Signup */}
                <FlexibleLayout className=' rounded-2xl p-7  border-2 justify-between items-center'>
                    <VerticalLayout>
                        <h3 className="text-2xl">Stay Updated with Fufu! 🐼</h3>
                        <p className="text-light-gray wrap-break-word whitespace-normal">Get the latest software reviews and recommendations delivered href your inbox.</p>
                    </VerticalLayout>
                    <Subscribe />
                </FlexibleLayout>
                <div className='h-0.5 w-full bg-black'></div>
                <HorizontalLayout className='text-light-gray justify-between '>
                    <p>&copy; 2024 RateMySoft. Made with 💚 by the Fufu team.</p>
                    <HorizontalLayout>
                        <Link href="/privacy" className="footer-legal-link">Privacy Policy</Link>
                        <Link href="/terms" className="footer-legal-link">Terms of Service</Link>
                        <Link href="/cookies" className="footer-legal-link">Cookie Policy</Link>
                    </HorizontalLayout>

                </HorizontalLayout>

            </VerticalLayout>
        </footer>
    );
};


export default Footer;
