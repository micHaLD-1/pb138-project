import './App.css'
import Header from '@/components/ui/header'
import Footer from '@/components/ui/footer'
import HomePage from './pages/Homepage'
import { Navigate, Route, Routes } from 'react-router-dom'
import BookDetail from '@/pages/BookDetail'
import UserProfile from '@/pages/UserProfile'
import AboutUs from '@/pages/AboutUs'
import Wishlist from '@/pages/Wishlist'
// import Reservation from '@/pages/Reservation'
import ProtectedRoute from '@/components/ui/ProtectedRoutes'
import AuthorAdministrationPage from './pages/AuthorAdministrationPage'
import GenreAdministrationPage from './pages/GenreAdministrationPage'
import PublisherAdministrationPage from './pages/PublisherAdministrationPage'
import BookAdministrationPage from './pages/BookAdministrationPage'
import ReservationAdministrationPage from './pages/ReservationAdministrationPage'
import UserAdministrationPage from './pages/UserAdministrationPage'
import { useAuth } from './context/AuthContext'

function NotFound() {
  return (
    <section className="mx-auto w-full max-w-6xl px-4 py-20 sm:px-6 lg:px-8">
      <div className="rounded-xl border bg-card p-8 text-center shadow-sm">
        <h1 className="text-3xl font-extrabold">Stránka nenalezena</h1>
        <p className="mt-3 text-muted-foreground">
          Požadovaná stránka neexistuje.
        </p>
      </div>
    </section>
  )
}


function StaffRoute({ children }: { children: React.ReactNode }) {
  const { isLoggedIn, user } = useAuth()
  const isStaff = user?.role === 'ADMIN' || user?.role === 'STAFF'
  if (!isLoggedIn) return <Navigate to="/" replace />
  if (!isStaff) return <Navigate to="/" replace />
  return <>{children}</>
}

function App() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header />

      <main className="min-h-[60vh] mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8 py-6">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/o_nas" element={<AboutUs />} />
          <Route path="/authors" element={<StaffRoute><AuthorAdministrationPage /></StaffRoute>} />
          <Route path="/genres" element={<StaffRoute><GenreAdministrationPage /></StaffRoute>} />
          <Route path="/publishers" element={<StaffRoute><PublisherAdministrationPage /></StaffRoute>} />
          <Route path="/books_adm" element={<StaffRoute><BookAdministrationPage /></StaffRoute>} />
          <Route path="/reservations" element={<StaffRoute><ReservationAdministrationPage /></StaffRoute>} />
          <Route path="/users" element={
            <StaffRoute>
              {/* extra check: only ADMIN can reach this */}
              <UserAdministrationPage />
            </StaffRoute>
          } />

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
