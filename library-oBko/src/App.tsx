import './App.css'
import Header from '@/components/ui/header'
import Footer from '@/components/ui/footer'

function App() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header />
      <main className="min-h-[60vh]" />
      <Footer />
    </div>
  )
}

export default App
