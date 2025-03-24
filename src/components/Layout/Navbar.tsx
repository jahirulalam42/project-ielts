'use client'
import Link from 'next/link'
import React from 'react'
import LoginButton from '../Auth/LoginButton'
import { usePathname } from 'next/navigation'

const Navbar: React.FC = () => {

    const pathName = usePathname();

    return (
        <div>
            {!pathName.startsWith("/test/reading/") && (
                <div className="navbar bg-base-100">
                    <div className="navbar-start">
                        <div className="dropdown">
                            <div tabIndex={0} role="button" className="btn btn-ghost lg:hidden">
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    className="h-5 w-5"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor">
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="2"
                                        d="M4 6h16M4 12h8m-8 6h16" />
                                </svg>
                            </div>
                            <ul
                                tabIndex={0}
                                className="menu menu-sm dropdown-content bg-base-100 rounded-box z-[1] mt-3 w-52 p-2 shadow">
                                <li><a>Item 1</a></li>
                                <li>
                                    <a>Parent</a>
                                    <ul className="p-2">
                                        <li><a>Submenu 1</a></li>
                                        <li><a>Submenu 2</a></li>
                                    </ul>
                                </li>
                                <li><a>Item 3</a></li>
                            </ul>
                        </div>
                        <a className="btn btn-ghost text-xl">daisyUI</a>
                    </div>
                    <div className="navbar-center hidden lg:flex">
                        <ul className="menu menu-horizontal px-1">
                            <li><Link href={'/test/listening'}>Listening</Link></li>
                            <li><Link href={'/test/reading'}>Reading</Link></li>
                            <li><Link href={'/test/writing'}>Writing</Link></li>
                            <li><Link href={'/test/speaking'}>Speaking</Link></li>
                        </ul>
                    </div>
                    <div className="navbar-end">
                        <div className='btn'>
                            <LoginButton />
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}

export default Navbar
