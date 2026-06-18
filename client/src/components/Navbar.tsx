import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useSelector } from 'react-redux'
import type { RootState } from '@/features/store'
import { Search, User, Heart, ShoppingBag, Menu, X } from 'lucide-react'

const navLinks = [
  { name: 'Men', path: '/men' },
  { name: 'Women', path: '/women' },
  { name: 'Kids', path: '/kids' },
  { name: 'Shoes', path: '/shoes' },
  { name: 'Accessories', path: '/accessories' },
  { name: 'Sale', path: '/sale', isRed: true },
]

const Navbar = () => {
  const { user } = useSelector((state: RootState) => state.auth)
  const [menuOpen, setMenuOpen] = useState(false)
  const { items } = useSelector((state: RootState) => state.cart)

  return (
    <nav className='sticky top-0 z-50 bg-white border-b border-gray-100'>
      {/* Main nav */}
      <div className='px-20 py-4 flex items-center justify-between'>
        {/* Logo */}
        <Link to='/' className='font-bold text-lg tracking-widest'>
          STYLESHOP
        </Link>

        {/* Desktop Links */}
        <ul className='hidden md:flex items-center gap-7'>
          {navLinks.map((link) => (
            <li key={link.path}>
              <Link
                to={link.path}
                className={`text-sm transition hover:text-gray-400 ${
                  link.isRed ? 'text-red-500 font-semibold' : 'text-gray-800'
                }`}
              >
                {link.name}
              </Link>
            </li>
          ))}
        </ul>

        {/* Desktop Right icons */}
        <div className='hidden md:flex items-center gap-5'>
          <button className='text-gray-600 hover:text-black transition'>
            <Search className='w-5 h-5' />
          </button>

          {user ? (
            <Link
              to='/profile'
              className='text-sm font-medium hover:text-gray-500 transition'
            >
              {user.name}
            </Link>
          ) : (
            <Link
              to='/login'
              className='text-gray-600 hover:text-black transition'
            >
              <User className='w-5 h-5' />
            </Link>
          )}

          <button className='text-gray-600 hover:text-black transition'>
            <Heart className='w-5 h-5' />
          </button>

          <Link
            to='/cart'
            className='relative text-gray-600 hover:text-black transition'
          >
            <ShoppingBag className='w-5 h-5' />
                    {items.length > 0 && (
            <span className='absolute -top-2 -right-2 bg-black text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center'>
              {items.length}
            </span>
          )}
          </Link>
        </div>

        {/* Mobile burger */}
        <button
          className='md:hidden text-gray-600 hover:text-black transition'
          onClick={() => setMenuOpen(!menuOpen)}
        >
          {menuOpen ? (
            <svg
              xmlns='http://www.w3.org/2000/svg'
              className='w-6 h-6'
              fill='none'
              viewBox='0 0 24 24'
              stroke='currentColor'
            >
              <path
                strokeLinecap='round'
                strokeLinejoin='round'
                strokeWidth={1.5}
                d='M6 18L18 6M6 6l12 12'
              />
            </svg>
          ) : (
            <svg
              xmlns='http://www.w3.org/2000/svg'
              className='w-6 h-6'
              fill='none'
              viewBox='0 0 24 24'
              stroke='currentColor'
            >
              <path
                strokeLinecap='round'
                strokeLinejoin='round'
                strokeWidth={1.5}
                d='M4 6h16M4 12h16M4 18h16'
              />
            </svg>
          )}
        </button>
      </div>

      {/* Topbar — menu yopiq bo'lganda ko'rinadi */}
      {!menuOpen && (
        <div className='bg-gray-50 text-center text-xs py-2 text-gray-500 border-t border-gray-100'>
          <span>Free delivery on orders over $100</span>
          <span className='mx-3'>•</span>
          <span>Easy returns</span>
        </div>
      )}

      {/* Mobile menu */}
      {menuOpen && (
        <div className='md:hidden fixed top-[57px] left-0 right-0 bottom-0 bg-white px-6 py-4 flex flex-col z-50 overflow-y-auto'>
          {navLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              onClick={() => setMenuOpen(false)}
              className={`py-3 text-sm border-b border-gray-50 transition hover:text-gray-400 ${
                link.isRed ? 'text-red-500 font-semibold' : 'text-gray-800'
              }`}
            >
              {link.name}
            </Link>
          ))}

          {/* Bottom row */}
          <div className='flex items-center gap-6 pt-4'>
            {user ? (
              <Link
                to='/profile'
                onClick={() => setMenuOpen(false)}
                className='text-sm font-medium hover:text-gray-500'
              >
                {user.name}
              </Link>
            ) : (
              <Link
                to='/login'
                onClick={() => setMenuOpen(false)}
                className='text-sm text-gray-600 hover:text-black'
              >
                Login
              </Link>
            )}
            <Link
              to='/cart'
              onClick={() => setMenuOpen(false)}
              className='text-sm text-gray-600 hover:text-black'
            >
              Cart
            </Link>
            <button className='text-sm text-gray-600 hover:text-black'>
              Wishlist
            </button>
          </div>
        </div>
      )}
    </nav>
  )
}

export default Navbar
