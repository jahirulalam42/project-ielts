import Link from 'next/link'
import React from 'react'

const AdminNavbar = () => {
    return (
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

                <div className='flex flex-row gap-2'>
                    <div className="drawer">
                        <input id="my-drawer" type="checkbox" className="drawer-toggle" />
                        <div className="drawer-content">
                            {/* Page content here */}
                            <label htmlFor="my-drawer" className="btn btn-square btn-ghost drawer-button">
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    className="inline-block h-5 w-5 stroke-current">
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="2"
                                        d="M4 6h16M4 12h16M4 18h16"></path>
                                </svg>
                            </label>
                        </div>
                        <div className="drawer-side">
                            <label htmlFor="my-drawer" aria-label="close sidebar" className="drawer-overlay"></label>
                            <ul className="menu bg-base-200 text-base-content min-h-full w-80 p-4">
                                {/* Sidebar content here */}
                                <li><a>Sidebar Item 1</a></li>
                                <li><a>Sidebar Item 2</a></li>
                            </ul>
                        </div>
                    </div>

                    <a className="btn btn-ghost text-xl">daisyUI</a>
                </div>
            </div>
            <div className="navbar-center hidden lg:flex">
                <ul className="menu menu-horizontal px-1">
                    <li><a>Dashboard</a></li>
                    <li>
                        <details>
                            <summary>Reading</summary>
                            <ul className="p-2">
                                <li><a>Manage Passages</a></li>
                                <li><a>Manage Questions</a></li>
                            </ul>
                        </details>
                    </li>
                    <li>
                        <details>
                            <summary>Listening</summary>
                            <ul className="p-2">
                                <li><a>Upload Audio</a></li>
                                <li><a>Manage Questions</a></li>
                            </ul>
                        </details>
                    </li>
                    <li>
                        <details>
                            <summary>Writing</summary>
                            <ul className="p-2">
                                <li><a>Add Prompts</a></li>
                                <li><a>Manage Prompts</a></li>
                            </ul>
                        </details>
                    </li>
                    <li>
                        <details>
                            <summary>Speaking</summary>
                            <ul className="p-2">
                                <li><a>Add Topics</a></li>
                                <li><a>Manage Topics</a></li>
                            </ul>
                        </details>
                    </li>
                    <li>
                        <details>
                            <summary>User Management</summary>
                            <ul className="p-2">
                                <li><a>View Users</a></li>
                                <li><a>Add Admins</a></li>
                                <li><a>Manage Roles</a></li>
                            </ul>
                        </details>
                    </li>
                    <li>
                        <a>Settings</a>
                    </li>
                    
                </ul>
            </div>
            <div className="navbar-end flex gap-2">
                <Link href={'/'} className='btn'>Main</Link>
                <a className="btn">Button</a>
            </div>
        </div>
    )
}

export default AdminNavbar
