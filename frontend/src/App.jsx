import { BrowserRouter, Routes, Route, Outlet, Navigate } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import { AuthProvider } from './auth'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import AdminLayout from './components/AdminLayout'
import { CustomerRoute, AdminRoute } from './components/ProtectedRoute'
import Home from './pages/Home'
import Products from './pages/Products'
import ProductDetail from './pages/ProductDetail'
import About from './pages/About'
import Contact from './pages/Contact'
import Login from './pages/Login'
import Register from './pages/Register'
import Dashboard from './pages/Dashboard'
import AdminLogin from './pages/AdminLogin'
import AdminDashboard from './pages/AdminDashboard'
import AdminProducts from './pages/AdminProducts'
import AdminStaff from './pages/AdminStaff'
import AdminMessages from './pages/AdminMessages'
import NotFound from './pages/NotFound'

function PublicLayout() { return <><Navbar/><Outlet/><Footer/></> }
export default function App() {
  return <AuthProvider><BrowserRouter><Toaster position="top-right" toastOptions={{ duration: 3500, style: { borderRadius: '14px', fontFamily: 'DM Sans, sans-serif' } }}/><Routes>
    <Route element={<PublicLayout/>}>
      <Route path="/" element={<Navigate to="/products" replace />}/>
      <Route path="/home" element={<Home/>}/>
      <Route path="/products" element={<Products/>}/>
      <Route path="/products/:id" element={<ProductDetail/>}/>
      <Route path="/about" element={<About/>}/>
      <Route path="/contact" element={<Contact/>}/>
      <Route path="/login" element={<Login/>}/>
      <Route path="/register" element={<Register/>}/>
      <Route element={<CustomerRoute/>}><Route path="/dashboard" element={<Dashboard/>}/></Route>
    </Route>
    <Route path="/admin/login" element={<AdminLogin/>}/>
    <Route path="/admin" element={<AdminRoute/>}><Route element={<AdminLayout/>}>
      <Route index element={<AdminDashboard/>}/>
      <Route path="products" element={<AdminProducts/>}/>
      <Route path="staff" element={<AdminStaff/>}/>
      <Route path="messages" element={<AdminMessages/>}/>
    </Route></Route>
    <Route path="*" element={<NotFound/>}/>
  </Routes></BrowserRouter></AuthProvider>
}
