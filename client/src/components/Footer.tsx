import { Link } from 'react-router-dom'

const Footer = () => {
  return (
    <footer className='bg-[#111111] text-white mt-12'>
      <div className='px-12 py-16 grid grid-cols-2 md:grid-cols-4 gap-10'>
        {/* Brand */}
        <div>
          <h3 className='font-bold text-lg tracking-widest mb-4'>STYLESHOP</h3>
          <p className='text-gray-400 text-sm leading-relaxed'>
            Modern clothing for modern people.
          </p>
          <div className='flex gap-4 mt-6'>
            {['IG', 'FB', 'TW', 'TK'].map((s) => (
              <button
                key={s}
                className='text-gray-400 text-xs hover:text-white transition'
              >
                {s}
              </button>
            ))}
          </div>
        </div>

        {/* Shop */}
        <div>
          <h4 className='font-semibold text-sm mb-4'>Shop</h4>
          {['Men', 'Women', 'Kids', 'Shoes', 'Accessories', 'Sale'].map(
            (item) => (
              <Link
                key={item}
                to={`/${item.toLowerCase()}`}
                className='block text-gray-400 text-sm mb-2 hover:text-white transition'
              >
                {item}
              </Link>
            )
          )}
        </div>

        {/* Customer Care */}
        <div>
          <h4 className='font-semibold text-sm mb-4'>Customer Care</h4>
          {['Contact Us', 'Returns', 'Shipping Info', 'Size Guide', 'FAQ'].map(
            (item) => (
              <p key={item} className='text-gray-400 text-sm mb-2'>
                {item}
              </p>
            )
          )}
        </div>

        {/* Newsletter */}
        <div>
          <h4 className='font-semibold text-sm mb-4'>Newsletter</h4>
          <p className='text-gray-400 text-sm mb-4 leading-relaxed'>
            Subscribe to get special offers, free giveaways, and
            once-in-a-lifetime deals.
          </p>
          <div className='flex'>
            <input
              type='email'
              placeholder='Enter your email'
              className='bg-[#222] text-sm text-white px-4 py-2 flex-1 outline-none placeholder-gray-500'
            />
            <button className='bg-white text-black text-sm px-4 py-2 hover:bg-gray-200 transition'>
              →
            </button>
          </div>
        </div>
      </div>

      {/* Bottom */}
      <div className='border-t border-gray-800 px-12 py-6 flex flex-col md:flex-row items-center justify-between gap-4'>
        <p className='text-gray-500 text-xs'>
          © 2026 STYLESHOP. All rights reserved.
        </p>
        <div className='flex gap-4'>
          {['VISA', 'MC', 'PayPal', 'Apple Pay', 'G Pay'].map((p) => (
            <span key={p} className='text-gray-500 text-xs'>
              {p}
            </span>
          ))}
        </div>
      </div>
    </footer>
  )
}

export default Footer
