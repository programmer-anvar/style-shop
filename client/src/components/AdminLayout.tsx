import { logout } from '@/features/authSlice'
import type { AppDispatch, RootState } from '@/features/store'
import { LayoutDashboard, LogOut, Package, ShoppingBag, Users } from 'lucide-react'
import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link,  Outlet,  useNavigate } from 'react-router-dom'

const AdminLayout = () => {
    const dispatch = useDispatch<AppDispatch>()
    const navigate = useNavigate()
    const { user } = useSelector((state: RootState) => state.auth)

    const handleLogout = () => {
        dispatch(logout())
        navigate('/login')
    }

    const navItems = [
    { name: 'Dashboard', path: '/admin', icon: LayoutDashboard },
    { name: 'Products', path: '/admin/products', icon: Package },
    { name: 'Orders', path: '/admin/orders', icon: ShoppingBag },
    { name: 'Users', path: '/admin/users', icon: Users },
    ]
  return (
    <div className='flex min-h-screen bg-gray-50'>
      <aside className='w-64 bg-white border-r border-gray-100 flex flex-col'>
        <div className='px-8 py-6 border-b border-gray-100 flex flex-col'>
            <div className='px-8 py-6 border-b border-gray-100'>
                <Link to='/' className='font-bold text-lg tracking-widest'>
                     STYLESHOP
                </Link>
                <p className='text-xs text-gray-400 mt-1'>Admin Panel</p>
            </div>

            <nav className='flex-1 px-4 py-6'>
                {navItems.map((item) => (
                    <Link
                    key={item.path}
                    to={item.path}
                    className='flex items-center gap-3 px-4 py-3 text-sm text-gray-600 hover:bg-gray-50 hover:text-black rounded transition mb-1'
                    >
                        <item.icon className='w-4 h-4' />
                        {item.name}
                    </Link>
                ))}
            </nav>

             <div className='px-4 py-6 border-t border-gray-100'>
          <p className='text-sm font-medium px-4 mb-3'>{user?.name}</p>
          <button
            onClick={handleLogout}
            className='flex items-center gap-3 px-4 py-3 text-sm text-gray-600 hover:text-red-500 transition w-full'
          >
            <LogOut className='w-4 h-4' />
            Logout
          </button>
        </div>
        </div>
      </aside>

      <main className='flex-1 overflow-auto'>
        <Outlet />
      </main>
    </div>
  )
}

export default AdminLayout
