import { useEffect, useState } from "react"
import { Search, X, Eye, Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useNavigate } from "react-router-dom"

// ── Types ─────────────────────────────────────────────────────────────────────

type NewsletterDTO = {
  id: number
  subject: string
  text: string
  createdAt: string
  employeeFirstName: string
  employeeLastName: string
  recipientCount: number
}

type NewslettersResponse = {
  newsletters: NewsletterDTO[]
  page: number
  pageSize: number
  total: number
}

// ── API helpers ───────────────────────────────────────────────────────────────

const BASE = "/api"

async function fetchNewsletters(page: number, size: number): Promise<NewslettersResponse> {
  const res = await fetch(`${BASE}/newsletter?page=${page}&size=${size}`, {
    credentials: "include",
  })
  if (!res.ok) throw new Error("Failed to fetch newsletters")
  return res.json()
}

// ── Detail modal ──────────────────────────────────────────────────────────────

function NewsletterDetailModal({
  newsletter,
  onClose,
}: {
  newsletter: NewsletterDTO
  onClose: () => void
}) {
  const formatDate = (iso: string) =>
    new Date(iso).toLocaleDateString(undefined, {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-lg rounded-xl border bg-card p-6 shadow-xl max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          onClick={onClose}
          className="absolute right-4 top-4 text-muted-foreground hover:text-foreground"
        >
          <X className="h-4 w-4" />
        </button>

        <h2 className="mb-1 text-xl font-bold pr-6">{newsletter.subject}</h2>
        <p className="mb-4 text-xs text-muted-foreground">
          Sent by {newsletter.employeeFirstName} {newsletter.employeeLastName} · {formatDate(newsletter.createdAt)} · {newsletter.recipientCount} recipients
        </p>

        <div className="rounded-lg border bg-muted/30 p-4 text-sm text-foreground whitespace-pre-wrap leading-relaxed">
          {newsletter.text}
        </div>

        <div className="mt-5 flex justify-end">
          <Button variant="outline" onClick={onClose}>Close</Button>
        </div>
      </div>
    </div>
  )
}

// ── Main page ─────────────────────────────────────────────────────────────────

const PAGE_SIZE = 20

export default function NewsletterAdministrationPage() {
  const [newsletters, setNewsletters] = useState<NewsletterDTO[]>([])
  const [total, setTotal] = useState(0)
  const [page, setPage] = useState(1)
  const [search, setSearch] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const navigate = useNavigate()

  const [detailTarget, setDetailTarget] = useState<NewsletterDTO | null>(null)

  const load = async () => {
    setLoading(true)
    setError(null)
    try {
      const data = await fetchNewsletters(page, PAGE_SIZE)
      setNewsletters(data.newsletters)
      setTotal(data.total)
    } catch (e: any) {
      setError(e.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    load()
  }, [page])

  const filtered = newsletters.filter((n) =>
    n.subject.toLowerCase().includes(search.toLowerCase()) ||
    `${n.employeeFirstName} ${n.employeeLastName}`.toLowerCase().includes(search.toLowerCase())
  )

  const totalPages = Math.ceil(total / PAGE_SIZE)

  const formatDate = (iso: string) =>
    new Date(iso).toLocaleDateString(undefined, {
      year: "numeric",
      month: "short",
      day: "numeric",
    })

  return (
    <div className="mx-auto w-full max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
      <h1 className="mb-6 text-3xl font-extrabold">Newsletters</h1>

      {/* toolbar */}
      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative w-full sm:max-w-xs">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            className="pl-9"
            placeholder="Search by subject or sender…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <Button onClick={() => navigate('/new_newsletter')} className="ml-2 flex items-center gap-1">
          <Plus className="mr-2 h-4 w-4" />
          Add newsletter
        </Button>
      </div>

      {/* table */}
      <div className="rounded-xl border bg-card shadow-sm overflow-hidden">
        {loading && <p className="p-6 text-muted-foreground">Loading…</p>}
        {error && <p className="p-6 text-destructive">{error}</p>}
        {!loading && !error && filtered.length === 0 && (
          <p className="p-6 text-muted-foreground">No newsletters found.</p>
        )}
        {!loading && !error && filtered.length > 0 && (
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b bg-muted/50 text-left text-xs uppercase tracking-wider text-muted-foreground">
                <th className="px-5 py-3">ID</th>
                <th className="px-5 py-3">Subject</th>
                <th className="px-5 py-3">Sent by</th>
                <th className="px-5 py-3">Date</th>
                <th className="px-5 py-3">Recipients</th>
                <th className="px-5 py-3">Content</th>
                <th className="px-5 py-3 text-right">Detail</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((n, i) => (
                <tr
                  key={n.id}
                  className={`border-b last:border-0 transition-colors hover:bg-muted/30 ${i % 2 === 0 ? "" : "bg-muted/10"}`}
                >
                  <td className="px-5 py-3 text-muted-foreground">{n.id}</td>
                  <td className="px-5 py-3 font-medium max-w-[180px]">
                    <span className="block truncate" title={n.subject}>
                      {n.subject}
                    </span>
                  </td>
                  <td className="px-5 py-3 text-muted-foreground whitespace-nowrap">
                    {n.employeeFirstName} {n.employeeLastName}
                  </td>
                  <td className="px-5 py-3 text-muted-foreground whitespace-nowrap">
                    {formatDate(n.createdAt)}
                  </td>
                  <td className="px-5 py-3 text-muted-foreground">
                    {n.recipientCount}
                  </td>
                  <td className="px-5 py-3 text-muted-foreground max-w-xs">
                    <span className="block truncate" title={n.text}>
                      {n.text}
                    </span>
                  </td>
                  <td className="px-5 py-3 text-right">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => setDetailTarget(n)}
                    >
                      <Eye className="h-3.5 w-3.5" />
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* pagination */}
      {totalPages > 1 && (
        <div className="mt-4 flex items-center justify-end gap-2 text-sm">
          <Button
            variant="outline"
            size="sm"
            disabled={page <= 1}
            onClick={() => setPage((p) => p - 1)}
          >
            Previous
          </Button>
          <span className="text-muted-foreground">{page} / {totalPages}</span>
          <Button
            variant="outline"
            size="sm"
            disabled={page >= totalPages}
            onClick={() => setPage((p) => p + 1)}
          >
            Next
          </Button>
        </div>
      )}

      {/* detail modal */}
      {detailTarget && (
        <NewsletterDetailModal
          newsletter={detailTarget}
          onClose={() => setDetailTarget(null)}
        />
      )}
    </div>
  )
}