import type { RootState } from "@/features/store"
import { useSelector } from "react-redux"
import { Navigate, Outlet } from "react-router-dom"

const AdminRoute = () => {
    const { user } = useSelector((state: RootState) => state.auth)
    if(!user){
        return <Navigate to='/login' replace/>
    }
    if(user.role !== 'admin'){
        return <Navigate to='/' replace />
    }

    return <Outlet/>
}

export default AdminRoute
