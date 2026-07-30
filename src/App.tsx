import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { Toaster } from 'react-hot-toast'
import { Layout, AdminLayout } from '@/components/layout/Layout'
import { ProtectedRoute, AdminRoute, PublicOnlyRoute } from '@/components/auth/AuthGuard'
import Welcome from '@/pages/Welcome'
import Home from '@/pages/Home'
import HowItWorks from '@/pages/HowItWorks'
import Gallery from '@/pages/Gallery'
import Pricing from '@/pages/Pricing'
import FAQ from '@/pages/FAQ'
import About from '@/pages/About'
import Contact from '@/pages/Contact'
import Login from '@/pages/Login'
import Register from '@/pages/Register'
import Profile from '@/pages/Profile'
import MyOrders from '@/pages/MyOrders'
import OrderDetail from '@/pages/OrderDetail'
import TrackOrder from '@/pages/TrackOrder'
import CreateOrder from '@/pages/CreateOrder'
import CreateBookManuscript from '@/pages/CreateBookManuscript'
import ManuscriptPayment from '@/pages/ManuscriptPayment'
import MyManuscripts from '@/pages/MyManuscripts'
import ManuscriptDetail from '@/pages/ManuscriptDetail'
import Payment from '@/pages/Payment'
import PaymentSuccess from '@/pages/PaymentSuccess'
import PrivacyPolicy from '@/pages/PrivacyPolicy'
import Terms from '@/pages/Terms'
import ShippingPolicy from '@/pages/ShippingPolicy'
import NotFound from '@/pages/NotFound'
import VerifyEmail from '@/pages/VerifyEmail'
import AuthCallback from '@/pages/AuthCallback'
import AdminDashboard from '@/pages/admin/Dashboard'
import AdminOrders from '@/pages/admin/Orders'
import AdminOrderDetail from '@/pages/admin/OrderDetail'
import AdminCustomers from '@/pages/admin/Customers'
import AdminReports from '@/pages/admin/Reports'
import AdminSettings from '@/pages/admin/Settings'
import AdminGallery from '@/pages/admin/Gallery'
import AdminManuscripts from '@/pages/admin/Manuscripts'
import AdminManuscriptDetail from '@/pages/admin/ManuscriptDetail'
import AdminPaymentNotifications from '@/pages/admin/PaymentNotifications'
import AdminInquiries from '@/pages/admin/Inquiries'
import AdminAcademicOrders from '@/pages/admin/AcademicOrders'
import AdminAcademicOrderDetail from '@/pages/admin/AcademicOrderDetail'
import AcademicServices from '@/pages/AcademicServices'
import CreateGraduationProject from '@/pages/CreateGraduationProject'
import CreatePresentation from '@/pages/CreatePresentation'
import CreateAcademicTask from '@/pages/CreateAcademicTask'
import CreateResearchCircle from '@/pages/CreateResearchCircle'
import MyAcademicOrders from '@/pages/MyAcademicOrders'
import AcademicOrderDetail from '@/pages/AcademicOrderDetail'
import AcademicPayment from '@/pages/AcademicPayment'

const queryClient = new QueryClient()

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Toaster
          position="top-center"
          toastOptions={{
            duration: 3000,
            style: {
              fontFamily: "'Readex Pro', sans-serif",
              direction: 'rtl',
            },
          }}
        />
        <Routes>
          {/* Public pages (no auth required) */}
          <Route path="/" element={<Welcome />} />

          {/* Auth pages (only when NOT logged in) */}
          <Route element={<PublicOnlyRoute />}>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/verify-email" element={<VerifyEmail />} />
          </Route>

          {/* Auth callback (always accessible) */}
          <Route path="/auth/callback" element={<AuthCallback />} />

          {/* Browseable pages (guests + authenticated) */}
          <Route element={<Layout />}>
            <Route path="/home" element={<Home />} />
            <Route path="/how-it-works" element={<HowItWorks />} />
            <Route path="/gallery" element={<Gallery />} />
            <Route path="/pricing" element={<Pricing />} />
            <Route path="/faq" element={<FAQ />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/privacy" element={<PrivacyPolicy />} />
            <Route path="/terms" element={<Terms />} />
            <Route path="/shipping" element={<ShippingPolicy />} />
            <Route path="/academic-services" element={<AcademicServices />} />
          </Route>

          {/* Action pages (require login) */}
          <Route element={<ProtectedRoute />}>
            <Route element={<Layout />}>
              <Route path="/profile" element={<Profile />} />
              <Route path="/my-orders" element={<MyOrders />} />
              <Route path="/order/:id" element={<OrderDetail />} />
              <Route path="/track-order" element={<TrackOrder />} />
              <Route path="/create-order" element={<CreateOrder />} />
              <Route path="/create-manuscript" element={<CreateBookManuscript />} />
              <Route path="/pay-manuscript/:id" element={<ManuscriptPayment />} />
              <Route path="/my-manuscripts" element={<MyManuscripts />} />
              <Route path="/manuscript/:id" element={<ManuscriptDetail />} />
              <Route path="/payment" element={<Payment />} />
              <Route path="/payment-success" element={<PaymentSuccess />} />
              <Route path="/create-graduation-project" element={<CreateGraduationProject />} />
              <Route path="/create-presentation" element={<CreatePresentation />} />
              <Route path="/create-academic-task" element={<CreateAcademicTask />} />
              <Route path="/create-research-circle" element={<CreateResearchCircle />} />
              <Route path="/my-academic-orders" element={<MyAcademicOrders />} />
              <Route path="/academic-order/:type/:id" element={<AcademicOrderDetail />} />
              <Route path="/academic-payment/:type/:id" element={<AcademicPayment />} />
            </Route>
          </Route>

          {/* Admin pages */}
          <Route element={<AdminRoute />}>
            <Route element={<AdminLayout />}>
              <Route path="/admin" element={<AdminDashboard />} />
              <Route path="/admin/orders" element={<AdminOrders />} />
              <Route path="/admin/orders/:id" element={<AdminOrderDetail />} />
              <Route path="/admin/customers" element={<AdminCustomers />} />
              <Route path="/admin/reports" element={<AdminReports />} />
              <Route path="/admin/settings" element={<AdminSettings />} />
              <Route path="/admin/inquiries" element={<AdminInquiries />} />
              <Route path="/admin/payment-notifications" element={<AdminPaymentNotifications />} />
              <Route path="/admin/gallery" element={<AdminGallery />} />
              <Route path="/admin/manuscripts" element={<AdminManuscripts />} />
              <Route path="/admin/manuscripts/:id" element={<AdminManuscriptDetail />} />
              <Route path="/admin/academic-orders" element={<AdminAcademicOrders />} />
              <Route path="/admin/academic-order/:type/:id" element={<AdminAcademicOrderDetail />} />
            </Route>
          </Route>

          {/* 404 */}
          <Route path="*" element={<Layout />}>
            <Route path="*" element={<NotFound />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </QueryClientProvider>
  )
}

export default App
