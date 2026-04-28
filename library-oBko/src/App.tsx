import './App.css'
import Header from '@/components/ui/header'
import Footer from '@/components/ui/footer'
import HomePage from './pages/homepage'
import { Route, Routes } from 'react-router-dom'
import BookDetail from '@/pages/BookDetail'
import UserProfile from '@/pages/UserProfile'
import AboutUs from '@/pages/AboutUs'
import Wishlist from '@/pages/Wishlist'
// import Reservation from '@/pages/Reservation'
import ProtectedRoute from '@/components/ui/ProtectedRoutes'

function NotFound() {
  return (
    <section className="mx-auto w-full max-w-6xl px-4 py-20 sm:px-6 lg:px-8">
      <div className="rounded-xl border bg-card p-8 text-center shadow-sm">
        <h1 className="text-3xl font-extrabold">Page Not Found</h1>
        <p className="mt-3 text-muted-foreground">
          The page you requested does not exist.
        </p>
      </div>
    </section>
  )
}

function App() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header />

      <main className="min-h-[60vh] mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8 py-6">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/o_nas" element={<AboutUs />} />

          <Route path="/wishlist" element={
            <ProtectedRoute>
              <Wishlist />
            </ProtectedRoute>
            }
          />

          <Route path="/reservation" element={
            <ProtectedRoute>
              <NotFound />
            </ProtectedRoute>
            }
          />


          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <UserProfile />
              </ProtectedRoute>
            }
          />
          <Route path="/books/:id" element={<BookDetail />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
      <Footer />
    </div>
  )
}

export default App
