import { Navigate, Outlet } from 'react-router-dom'
export function CustomerRoute() { return localStorage.getItem('token') ? <Outlet/> : <Navigate to="/login" replace/> }
export function AdminRoute() { return localStorage.getItem('admin_token') ? <Outlet/> : <Navigate to="/admin/login" replace/> }
