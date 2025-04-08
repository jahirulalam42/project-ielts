import AdminNavbar from '@/components/Layout/Admin/AdminNavbar'
import React from 'react'

const AdminLayout = ({ children }: any) => {
    return (
        <div>
            <AdminNavbar />
            {children}
        </div>
    )
}

export default AdminLayout
