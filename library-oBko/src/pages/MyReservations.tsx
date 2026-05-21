import { useEffect, useState } from 'react'
import { useAuth } from '@/context/AuthContext'

type Reservation = {
    id: number
    userId: number
    bookId: number
    bookCopyId: number
    fromDate: string
    toDate: string
    price: number
    status: string
}

const STATUS_COLORS: Record<string, string> = {
    ACTIVE:    "bg-green-100 text-green-700",
    CANCELED:  "bg-red-100 text-red-600",
    FULFILLED: "bg-blue-100 text-blue-700",
}

export default function MyReservations() {
    const { user } = useAuth()
    const [reservations, setReservations] = useState<Reservation[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        if (!user) return
        setLoading(true)
        fetch(`/api/reservations?page=1&pageSize=100`, { credentials: 'include' })
            .then(r => r.json())
            .then(data => {
                const mine = (data.reservations as Reservation[]).filter(r => r.userId === user.userId)
                setReservations(mine)
            })
            .catch(() => setError('Nepodařilo se načíst rezervace.'))
            .finally(() => setLoading(false))
    }, [user])

    if (loading) return <p className="p-8 text-muted-foreground">Načítám…</p>
    if (error)   return <p className="p-8 text-destructive">{error}</p>

    return (
        <section className="mx-auto w-full max-w-4xl px-4 py-10 sm:px-6 lg:px-8">
            <h1 className="mb-6 text-3xl font-extrabold">Moje rezervace</h1>

            {reservations.length === 0 ? (
                <div className="rounded-xl border bg-card p-8 text-center shadow-sm">
                    <p className="text-muted-foreground">Nemáte žádné rezervace.</p>
                </div>
            ) : (
                <div className="rounded-xl border bg-card shadow-sm overflow-hidden">
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="border-b bg-muted/50 text-left text-xs uppercase tracking-wider text-muted-foreground">
                                <th className="px-5 py-3">ID</th>
                                <th className="px-5 py-3">Kniha ID</th>
                                <th className="px-5 py-3">Od</th>
                                <th className="px-5 py-3">Do</th>
                                <th className="px-5 py-3">Cena</th>
                                <th className="px-5 py-3">Stav</th>
                            </tr>
                        </thead>
                        <tbody>
                            {reservations.map((r, i) => (
                                <tr key={r.id} className={`border-b last:border-0 hover:bg-muted/30 ${i % 2 === 0 ? '' : 'bg-muted/10'}`}>
                                    <td className="px-5 py-3 text-muted-foreground">{r.id}</td>
                                    <td className="px-5 py-3">{r.bookId}</td>
                                    <td className="px-5 py-3">{r.fromDate}</td>
                                    <td className="px-5 py-3">{r.toDate}</td>
                                    <td className="px-5 py-3">{r.price.toFixed(2)}</td>
                                    <td className="px-5 py-3">
                                        <span className={`inline-block rounded-full px-2.5 py-0.5 text-xs font-medium ${STATUS_COLORS[r.status] ?? 'bg-muted text-muted-foreground'}`}>
                                            {r.status}
                                        </span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </section>
    )
}
