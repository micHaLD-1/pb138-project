import { useEffect, useState } from "react"
import { Plus, Search, X, Check, Pencil } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

// ── Types ─────────────────────────────────────────────────────────────────────

type ReservationDTO = {
  id: number
  userId: number
  bookId: number
  bookCopyId: number
  fromDate: string
  toDate: string
  price: number
  status?: string
}

type UserOption = { id: number; name: string }
type BookOption = { id: number; name: string }

type CreateFormData = {
  userId: number | null
  bookId: number | null
  fromDate: string
  toDate: string
  price: string
}

type UpdateFormData = {
  fromDate: string
  toDate: string
  price: string
}

// ── Mock data ─────────────────────────────────────────────────────────────────

const mockReservations: ReservationDTO[] = [
  { id: 1, userId: 1, bookId: 1, bookCopyId: 3, fromDate: "2026-05-01", toDate: "2026-05-15", price: 0, status: "ACTIVE" },
  { id: 2, userId: 2, bookId: 2, bookCopyId: 5, fromDate: "2026-05-03", toDate: "2026-05-17", price: 0, status: "ACTIVE" },
  { id: 3, userId: 3, bookId: 3, bookCopyId: 1, fromDate: "2026-04-10", toDate: "2026-04-24", price: 2.5, status: "CANCELED" },
]

const mockUsers: UserOption[] = [
  { id: 1, name: "Jan Novák" },
  { id: 2, name: "Marie Svobodová" },
  { id: 3, name: "Petr Dvořák" },
  { id: 4, name: "Lucie Marková" },
  { id: 5, name: "Tomáš Blaho" },
]

const mockBooks: BookOption[] = [
  { id: 1, name: "The Hobbit" },
  { id: 2, name: "1984" },
  { id: 3, name: "Dune" },
  { id: 4, name: "Harry Potter" },
  { id: 5, name: "Brave New World" },
]

// ── API helpers ───────────────────────────────────────────────────────────────

const BASE = "/api/reservations"

async function fetchReservations(page: number, pageSize: number): Promise<{ reservations: ReservationDTO[]; total: number }> {
  // const res = await fetch(`${BASE}?page=${page}&pageSize=${pageSize}`, { credentials: "include" })
  // if (!res.ok) throw new Error("Failed to fetch reservations")
  // const data = await res.json()
  // return { reservations: data.reservations, total: data.total }
  await new Promise((r) => setTimeout(r, 300))
  const start = (page - 1) * pageSize
  return { reservations: mockReservations.slice(start, start + pageSize), total: mockReservations.length }
}

async function fetchUsers(): Promise<UserOption[]> {
  // const res = await fetch("/api/users?page=1&size=100", { credentials: "include" })
  // const data = await res.json()
  // return data.users.map((u: any) => ({ id: u.id, name: `${u.firstName} ${u.lastName}` }))
  return mockUsers
}

async function fetchBooks(): Promise<BookOption[]> {
  // const res = await fetch("/api/books?page=1&size=100", { credentials: "include" })
  // const data = await res.json()
  // return data.books.map((b: any) => ({ id: b.id, name: b.title }))
  return mockBooks
}

async function createReservation(data: any): Promise<void> {
  const res = await fetch(BASE, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
    credentials: "include",
  })
  if (!res.ok) {
    const body = await res.json().catch(() => ({}))
    throw new Error(body.message ?? "Failed to create reservation")
  }
}

async function updateReservation(id: number, data: any): Promise<void> {
  const res = await fetch(`${BASE}/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
    credentials: "include",
  })
  if (!res.ok) {
    const body = await res.json().catch(() => ({}))
    throw new Error(body.message ?? "Failed to update reservation")
  }
}

async function cancelReservation(id: number): Promise<void> {
  const res = await fetch(`${BASE}/${id}/cancel`, {
    method: "PUT",
    credentials: "include",
  })
  if (!res.ok) {
    const body = await res.json().catch(() => ({}))
    throw new Error(body.message ?? "Failed to cancel reservation")
  }
}

// ── Single-select picker ──────────────────────────────────────────────────────

type PickerItem = { id: number; name: string }

type SinglePickerProps = {
  title: string
  items: PickerItem[]
  selected: number | null
  onClose: () => void
  onConfirm: (id: number) => void
}

function SinglePicker({ title, items, selected, onClose, onConfirm }: SinglePickerProps) {
  const [search, setSearch] = useState("")
  const filtered = items.filter((i) => i.name.toLowerCase().includes(search.toLowerCase()))

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/50" onClick={onClose}>
      <div className="relative w-full max-w-sm rounded-xl border bg-card p-5 shadow-xl" onClick={(e) => e.stopPropagation()}>
        <button type="button" onClick={onClose} className="absolute right-4 top-4 text-muted-foreground hover:text-foreground">
          <X className="h-4 w-4" />
        </button>
        <h3 className="mb-3 text-lg font-bold">{title}</h3>
        <div className="relative mb-3">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input className="pl-9" placeholder="Search…" value={search} onChange={(e) => setSearch(e.target.value)} autoFocus />
        </div>
        <div className="max-h-56 overflow-y-auto rounded-lg border">
          {filtered.length === 0 && <p className="p-3 text-sm text-muted-foreground">No results.</p>}
          {filtered.map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => { onConfirm(item.id); onClose() }}
              className={`flex w-full items-center justify-between px-4 py-2.5 text-sm transition-colors hover:bg-muted/50 ${selected === item.id ? "bg-muted/30 font-medium" : ""}`}
            >
              {item.name}
              {selected === item.id && <Check className="h-4 w-4 text-primary" />}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}

// ── Create modal ──────────────────────────────────────────────────────────────

type CreateModalProps = {
  users: UserOption[]
  books: BookOption[]
  onClose: () => void
  onSubmit: (data: any) => Promise<void>
}

function CreateReservationModal({ users, books, onClose, onSubmit }: CreateModalProps) {
  const [form, setForm] = useState<CreateFormData>({ userId: null, bookId: null, fromDate: "", toDate: "", price: "0" })
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [userPickerOpen, setUserPickerOpen] = useState(false)
  const [bookPickerOpen, setBookPickerOpen] = useState(false)

  const selectedUserName = users.find((u) => u.id === form.userId)?.name
  const selectedBookName = books.find((b) => b.id === form.bookId)?.name

  const handleSubmit = async () => {
    if (!form.userId) { setError("User is required."); return }
    if (!form.bookId) { setError("Book is required."); return }
    if (!form.fromDate) { setError("From date is required."); return }
    if (!form.toDate) { setError("To date is required."); return }
    if (form.fromDate >= form.toDate) { setError("To date must be after from date."); return }

    setLoading(true)
    setError(null)
    try {
      await onSubmit({
        userId: form.userId,
        bookId: form.bookId,
        fromDate: form.fromDate,
        toDate: form.toDate,
        price: Number(form.price) || 0,
      })
      onClose()
    } catch (e: any) {
      setError(e.message ?? "Something went wrong.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50" onClick={onClose}>
        <div className="relative w-full max-w-md rounded-xl border bg-card p-6 shadow-xl" onClick={(e) => e.stopPropagation()}>
          <button type="button" onClick={onClose} className="absolute right-4 top-4 text-muted-foreground hover:text-foreground">
            <X className="h-4 w-4" />
          </button>
          <h2 className="mb-5 text-xl font-bold">New reservation</h2>

          <div className="flex flex-col gap-4">
            {/* User picker */}
            <div className="flex flex-col gap-1">
              <Label>User</Label>
              <button
                type="button"
                onClick={() => setUserPickerOpen(true)}
                className="flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm hover:bg-muted/30 transition-colors"
              >
                <span className={selectedUserName ? "text-foreground" : "text-muted-foreground"}>
                  {selectedUserName ?? "Select user…"}
                </span>
                <Search className="h-4 w-4 text-muted-foreground" />
              </button>
            </div>

            {/* Book picker */}
            <div className="flex flex-col gap-1">
              <Label>Book</Label>
              <button
                type="button"
                onClick={() => setBookPickerOpen(true)}
                className="flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm hover:bg-muted/30 transition-colors"
              >
                <span className={selectedBookName ? "text-foreground" : "text-muted-foreground"}>
                  {selectedBookName ?? "Select book…"}
                </span>
                <Search className="h-4 w-4 text-muted-foreground" />
              </button>
            </div>

            {/* Dates */}
            <div className="grid grid-cols-2 gap-3">
              <div className="flex flex-col gap-1">
                <Label htmlFor="fromDate">From date</Label>
                <Input id="fromDate" type="date" value={form.fromDate} onChange={(e) => setForm((f) => ({ ...f, fromDate: e.target.value }))} />
              </div>
              <div className="flex flex-col gap-1">
                <Label htmlFor="toDate">To date</Label>
                <Input id="toDate" type="date" value={form.toDate} onChange={(e) => setForm((f) => ({ ...f, toDate: e.target.value }))} />
              </div>
            </div>

            {/* Price */}
            <div className="flex flex-col gap-1">
              <Label htmlFor="price">Price</Label>
              <Input id="price" type="number" min={0} step={0.01} value={form.price} onChange={(e) => setForm((f) => ({ ...f, price: e.target.value }))} placeholder="0" />
            </div>

            {error && <p className="text-sm text-destructive">{error}</p>}

            <div className="mt-2 flex justify-end gap-2">
              <Button variant="outline" onClick={onClose} disabled={loading}>Cancel</Button>
              <Button onClick={handleSubmit} disabled={loading}>{loading ? "Saving…" : "Save"}</Button>
            </div>
          </div>
        </div>
      </div>

      {userPickerOpen && (
        <SinglePicker title="Select user" items={users} selected={form.userId} onClose={() => setUserPickerOpen(false)} onConfirm={(id) => setForm((f) => ({ ...f, userId: id }))} />
      )}
      {bookPickerOpen && (
        <SinglePicker title="Select book" items={books} selected={form.bookId} onClose={() => setBookPickerOpen(false)} onConfirm={(id) => setForm((f) => ({ ...f, bookId: id }))} />
      )}
    </>
  )
}

// ── Edit modal ────────────────────────────────────────────────────────────────

type EditModalProps = {
  reservation: ReservationDTO
  onClose: () => void
  onSubmit: (data: any) => Promise<void>
}

function EditReservationModal({ reservation, onClose, onSubmit }: EditModalProps) {
  const [form, setForm] = useState<UpdateFormData>({
    fromDate: reservation.fromDate,
    toDate: reservation.toDate,
    price: String(reservation.price),
  })
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const handleSubmit = async () => {
    if (!form.fromDate) { setError("From date is required."); return }
    if (!form.toDate) { setError("To date is required."); return }
    if (form.fromDate >= form.toDate) { setError("To date must be after from date."); return }

    setLoading(true)
    setError(null)
    try {
      await onSubmit({ fromDate: form.fromDate, toDate: form.toDate, price: Number(form.price) || 0 })
      onClose()
    } catch (e: any) {
      setError(e.message ?? "Something went wrong.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50" onClick={onClose}>
      <div className="relative w-full max-w-md rounded-xl border bg-card p-6 shadow-xl" onClick={(e) => e.stopPropagation()}>
        <button type="button" onClick={onClose} className="absolute right-4 top-4 text-muted-foreground hover:text-foreground">
          <X className="h-4 w-4" />
        </button>
        <h2 className="mb-5 text-xl font-bold">Edit reservation #{reservation.id}</h2>

        <div className="flex flex-col gap-4">
          <div className="grid grid-cols-2 gap-3">
            <div className="flex flex-col gap-1">
              <Label htmlFor="editFromDate">From date</Label>
              <Input id="editFromDate" type="date" value={form.fromDate} onChange={(e) => setForm((f) => ({ ...f, fromDate: e.target.value }))} />
            </div>
            <div className="flex flex-col gap-1">
              <Label htmlFor="editToDate">To date</Label>
              <Input id="editToDate" type="date" value={form.toDate} onChange={(e) => setForm((f) => ({ ...f, toDate: e.target.value }))} />
            </div>
          </div>

          <div className="flex flex-col gap-1">
            <Label htmlFor="editPrice">Price</Label>
            <Input id="editPrice" type="number" min={0} step={0.01} value={form.price} onChange={(e) => setForm((f) => ({ ...f, price: e.target.value }))} />
          </div>

          {error && <p className="text-sm text-destructive">{error}</p>}

          <div className="mt-2 flex justify-end gap-2">
            <Button variant="outline" onClick={onClose} disabled={loading}>Cancel</Button>
            <Button onClick={handleSubmit} disabled={loading}>{loading ? "Saving…" : "Save"}</Button>
          </div>
        </div>
      </div>
    </div>
  )
}

// ── Status badge ──────────────────────────────────────────────────────────────

function StatusBadge({ status }: { status?: string }) {
  const color =
    status === "ACTIVE" ? "bg-green-100 text-green-700" :
    status === "CANCELED" ? "bg-red-100 text-red-600" :
    "bg-muted text-muted-foreground"

  return (
    <span className={`inline-block rounded-full px-2.5 py-0.5 text-xs font-medium ${color}`}>
      {status ?? "—"}
    </span>
  )
}

// ── Main page ─────────────────────────────────────────────────────────────────

const PAGE_SIZE = 20

export default function ReservationAdministrationPage() {
  const [reservations, setReservations] = useState<ReservationDTO[]>([])
  const [total, setTotal] = useState(0)
  const [page, setPage] = useState(1)
  const [search, setSearch] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const [users, setUsers] = useState<UserOption[]>([])
  const [books, setBooks] = useState<BookOption[]>([])

  const [addOpen, setAddOpen] = useState(false)
  const [editTarget, setEditTarget] = useState<ReservationDTO | null>(null)
  const [cancelTarget, setCancelTarget] = useState<ReservationDTO | null>(null)
  const [cancelError, setCancelError] = useState<string | null>(null)
  const [cancelLoading, setCancelLoading] = useState(false)

  const load = async () => {
    setLoading(true)
    setError(null)
    try {
      const data = await fetchReservations(page, PAGE_SIZE)
      setReservations(data.reservations)
      setTotal(data.total)
    } catch (e: any) {
      setError(e.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    load()
    fetchUsers().then(setUsers)
    fetchBooks().then(setBooks)
  }, [page])

  const filtered = reservations.filter((r) =>
    String(r.id).includes(search) ||
    String(r.userId).includes(search) ||
    String(r.bookId).includes(search)
  )

  const totalPages = Math.ceil(total / PAGE_SIZE)

  const handleCancel = async () => {
    if (!cancelTarget) return
    setCancelLoading(true)
    setCancelError(null)
    try {
      await cancelReservation(cancelTarget.id)
      setCancelTarget(null)
      load()
    } catch (e: any) {
      setCancelError(e.message)
    } finally {
      setCancelLoading(false)
    }
  }

  return (
    <div className="mx-auto w-full max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
      <h1 className="mb-6 text-3xl font-extrabold">Reservations</h1>

      {/* toolbar */}
      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative w-full sm:max-w-xs">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input className="pl-9" placeholder="Search by ID, user ID, book ID…" value={search} onChange={(e) => setSearch(e.target.value)} />
        </div>
        <Button onClick={() => setAddOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          New reservation
        </Button>
      </div>

      {/* table */}
      <div className="rounded-xl border bg-card shadow-sm overflow-hidden">
        {loading && <p className="p-6 text-muted-foreground">Loading…</p>}
        {error && <p className="p-6 text-destructive">{error}</p>}
        {!loading && !error && filtered.length === 0 && (
          <p className="p-6 text-muted-foreground">No reservations found.</p>
        )}
        {!loading && !error && filtered.length > 0 && (
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b bg-muted/50 text-left text-xs uppercase tracking-wider text-muted-foreground">
                <th className="px-5 py-3">ID</th>
                <th className="px-5 py-3">User ID</th>
                <th className="px-5 py-3">Book ID</th>
                <th className="px-5 py-3">Copy ID</th>
                <th className="px-5 py-3">From</th>
                <th className="px-5 py-3">To</th>
                <th className="px-5 py-3">Price</th>
                <th className="px-5 py-3">Status</th>
                <th className="px-5 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((r, i) => (
                <tr key={r.id} className={`border-b last:border-0 transition-colors hover:bg-muted/30 ${i % 2 === 0 ? "" : "bg-muted/10"}`}>
                  <td className="px-5 py-3 text-muted-foreground">{r.id}</td>
                  <td className="px-5 py-3">{r.userId}</td>
                  <td className="px-5 py-3">{r.bookId}</td>
                  <td className="px-5 py-3 text-muted-foreground">{r.bookCopyId}</td>
                  <td className="px-5 py-3">{r.fromDate}</td>
                  <td className="px-5 py-3">{r.toDate}</td>
                  <td className="px-5 py-3">{r.price.toFixed(2)}</td>
                  <td className="px-5 py-3"><StatusBadge status={r.status} /></td>
                  <td className="px-5 py-3 text-right">
                    <div className="flex justify-end gap-2">
                      {r.status === "ACTIVE" && (
                        <>
                          <Button size="sm" variant="outline" onClick={() => setEditTarget(r)}>
                            <Pencil className="h-3.5 w-3.5" />
                          </Button>
                          <Button size="sm" variant="destructive" onClick={() => { setCancelError(null); setCancelTarget(r) }}>
                            <X className="h-3.5 w-3.5" />
                          </Button>
                        </>
                      )}
                      {r.status !== "ACTIVE" && (
                        <span className="text-xs text-muted-foreground italic">—</span>
                      )}
                    </div>
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
          <Button variant="outline" size="sm" disabled={page <= 1} onClick={() => setPage((p) => p - 1)}>Previous</Button>
          <span className="text-muted-foreground">{page} / {totalPages}</span>
          <Button variant="outline" size="sm" disabled={page >= totalPages} onClick={() => setPage((p) => p + 1)}>Next</Button>
        </div>
      )}

      {/* create modal */}
      {addOpen && (
        <CreateReservationModal
          users={users}
          books={books}
          onClose={() => setAddOpen(false)}
          onSubmit={async (data) => { await createReservation(data); load() }}
        />
      )}

      {/* edit modal */}
      {editTarget && (
        <EditReservationModal
          reservation={editTarget}
          onClose={() => setEditTarget(null)}
          onSubmit={async (data) => { await updateReservation(editTarget.id, data); load() }}
        />
      )}

      {/* cancel confirmation */}
      {cancelTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50" onClick={() => setCancelTarget(null)}>
          <div className="relative w-full max-w-sm rounded-xl border bg-card p-6 shadow-xl" onClick={(e) => e.stopPropagation()}>
            <h2 className="mb-2 text-lg font-bold">Cancel reservation</h2>
            <p className="text-sm text-muted-foreground">
              Are you sure you want to cancel reservation{" "}
              <span className="font-semibold text-foreground">#{cancelTarget.id}</span>?
              The book copy will become available again.
            </p>
            {cancelError && <p className="mt-3 text-sm text-destructive">{cancelError}</p>}
            <div className="mt-5 flex justify-end gap-2">
              <Button variant="outline" onClick={() => setCancelTarget(null)} disabled={cancelLoading}>Keep</Button>
              <Button variant="destructive" onClick={handleCancel} disabled={cancelLoading}>
                {cancelLoading ? "Cancelling…" : "Cancel reservation"}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
