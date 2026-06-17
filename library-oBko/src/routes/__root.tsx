import { createRootRouteWithContext, Outlet } from '@tanstack/react-router'
import Header from '@/components/home/header'
import Footer from '@/components/home/footer'
import type { AuthContextType } from '@/context/AuthContext'

interface RouterContext {
  auth: AuthContextType
}

export const Route = createRootRouteWithContext<RouterContext>()({
  component: () => (
    <div className="min-h-screen bg-background text-foreground">
      <Header />
      <main className="min-h-[60vh] mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8 py-6">
        <Outlet />
      </main>
      <Footer />
    </div>
  ),
  notFoundComponent: () => (
    <section className="mx-auto w-full max-w-6xl px-4 py-20 sm:px-6 lg:px-8">
      <div className="rounded-xl border bg-card p-8 text-center shadow-sm">
        <h1 className="text-3xl font-extrabold">Stránka nenalezena</h1>
        <p className="mt-3 text-muted-foreground">Požadovaná stránka neexistuje.</p>
      </div>
    </section>
  ),
})
