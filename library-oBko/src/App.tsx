import './App.css'
import Header from '@/components/ui/header'
import Footer from '@/components/ui/footer'
import HomePage from './pages/homepage'

function App() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header />
      <main className="min-h-[60vh] mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8 py-6" >
        <HomePage />
      </main>
      <Footer />
    </div>
  )
}

export default App
