import api from "@/api"
import { DollarSign, Package, ShoppingBag, Users } from "lucide-react"
import { useEffect, useState } from "react"
import { Link } from "react-router-dom"

interface Stats {
  totalOrders: number
  user: {name: string, email: string},
  total: number
  status: string
  createdAt: string
}

interface Order {
  _id: string
  user: { name: string, email: string}
  total: number
  status: string
  createdAt: string
}
const Dashboard = () => {
  const [stats, setStats] = useState<Stats | null>(null)
  const [recentOrders, setRecentOrder] = useState<Order[]>()
  const [isLoading, setIsLoading] = useState(true)
  console.log(stats)

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const { data } = await api.get('/dashboard')
        setStats(data.stats)
        setRecentOrder(data.recentOrders)
      } catch (error) {
        console.log(error)
      }finally {
        setIsLoading(false)
      }
    }
    fetchStats()
  }, [])

   if (isLoading) {
    return (
      <div className='flex items-center justify-center h-screen'>
        <div className='animate-pulse text-gray-400'>Loading...</div>
      </div>
    )
  }
  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-8">Dashboard</h1>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-10">
        {[
          {
            title: 'Total Orders',
            value: stats?.totalOrders,
            icon: ShoppingBag,
            color: 'bg-blue-50 text-blue-500',
          },
          {
            title: 'Total Products',
            value: stats?.totalProducts,
            icon: Package,
            color: 'bg-green-50 text-green-500',
          },
          {
            title: 'Total Users',
            value: stats?.totalUsers,
            icon: Users,
            color: 'bg-purple-50 text-purple-500',
          },
          {
            title: 'Total Revenue',
            value: `$${stats?.totalRevenue.toFixed(2)}`,
            icon: DollarSign,
            color: 'bg-yellow-50 text-yellow-500',
          },
        ].map((card) => (
          <div key={card.title} className='bg-white p-6 rounded-lg border border-gray-100'>
            <div className={`w-10 h-10 rounded-lg ${card.color} flex items-center justify-center mb-4`}>
              <card.icon className='w-5 h-5' />
            </div>
            <p className='text-2xl font-bold mb-1'>{card.value}</p>
            <p className='text-sm text-gray-500'>{card.title}</p>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-lg border border-gray-100">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <h2 className='font-semibold'>Recent Orders</h2>
          <Link to='/admin/orders' className='text-sm text-gray-500 hover:text-black'>
            View all →
          </Link>
        </div>

        <table className="w-full">
          <thead>
             <tr className='border-b border-gray-100'>
              <th className='text-left px-6 py-3 text-xs text-gray-400 font-medium'>ORDER ID</th>
              <th className='text-left px-6 py-3 text-xs text-gray-400 font-medium'>CUSTOMER</th>
              <th className='text-left px-6 py-3 text-xs text-gray-400 font-medium'>TOTAL</th>
              <th className='text-left px-6 py-3 text-xs text-gray-400 font-medium'>STATUS</th>
              <th className='text-left px-6 py-3 text-xs text-gray-400 font-medium'>DATE</th>
            </tr>
          </thead>
          <tbody>
            {recentOrders?.map((order) => (
              <tr key={order._id} className="border-b border-gray-50 hover:bg-gray-50 transition">
                <td className='px-6 py-4 text-sm text-gray-500'>
                  #{order._id.slice(-6).toUpperCase()}
                </td>
                <td className="px-4 py-4">
                  <p className="text-sm font-medium">{order.user?.name}</p>
                  <p className="text-xs text-gray-400">{order.user?.email}</p>
                </td>
                <td className="px-6 py-4 text-sm font-medium">
                  ${order.total.toFixed(2)}
                </td>
                <td className="px-6 py-4">
                  <span className={`text-xs px-2 py-1 rounded-full ${
                    order.status === 'delivered'
                      ? 'bg-green-100 text-green-600'
                      : order.status === 'cancelled'
                      ? 'bg-red-100 text-red-600'
                      : order.status === 'shipped'
                      ? 'bg-blue-100 text-blue-600'
                      : 'bg-yellow-100 text-yellow-600'
                  }`}>
                    {order.status}
                  </span>
                </td>
                <td className='px-6 py-4 text-sm text-gray-400'>
                  {new Date(order.createdAt).toLocaleDateString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default Dashboard
