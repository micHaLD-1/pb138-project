import { useEffect, useState } from "react"
import { Pencil, Plus, Search, X, Check } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

// ── Types ─────────────────────────────────────────────────────────────────────

type BookDTO = {
  id: number
  title: string
  language: string
  publisherId: number
  publisherName: string
  yearPublished: number
  description: string
  authors: string[]
  genres: string[]
  availableCopies: number
  totalCopies: number
}

type AuthorDTO = { id: number; name: string }
type GenreDTO = { id: number; name: string }
type PublisherDTO = { id: number; name: string }

type BookFormData = {
  title: string
  language: string
  publisherId: number | null
  yearPublished: string
  description: string
  authorIds: number[]
  genreIds: number[]
  copyCount: string
}


// ── API helpers ───────────────────────────────────────────────────────────────

const BASE = "/api"

async function fetchBooks(page: number, size: number): Promise<{ books: BookDTO[]; total: number }> {
  const res = await fetch(`${BASE}/books?page=${page}&size=${size}`, { credentials: "include" })
  if (!res.ok) throw new Error("Failed to fetch books")
  const data = await res.json()
  return { books: data.books, total: data.total }

}

async function fetchAuthors(): Promise<AuthorDTO[]> {
  const res = await fetch(`${BASE}/authors?page=1&size=100`, { credentials: "include" })
  const data = await res.json()
  return data.authors
  // return mockAuthors
}

async function fetchGenres(): Promise<GenreDTO[]> {
  const res = await fetch(`${BASE}/genres?page=1&size=100`, { credentials: "include" })
  const data = await res.json()
  return data.genres
  // return mockGenres
}

async function fetchPublishers(): Promise<PublisherDTO[]> {
  const res = await fetch(`${BASE}/publishers?page=1&size=100`, { credentials: "include" })
  const data = await res.json()
  return data.publishers
  // return mockPublishers
}

async function createBook(data: any): Promise<void> {
  const res = await fetch(`${BASE}/books`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
    credentials: "include",
  })
  if (!res.ok) {
    const body = await res.json().catch(() => ({}))
    throw new Error(body.message ?? "Failed to create book")
  }
}

async function updateBook(id: number, data: any): Promise<void> {
  const res = await fetch(`${BASE}/books/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
    credentials: "include",
  })
  if (!res.ok) {
    const body = await res.json().catch(() => ({}))
    throw new Error(body.message ?? "Failed to update book")
  }
}

async function deleteBook(id: number): Promise<void> {
  const res = await fetch(`${BASE}/books/${id}`, {
    method: "DELETE",
    credentials: "include",
  })
  if (!res.ok) {
    const body = await res.json().catch(() => ({}))
    throw new Error(body.message ?? "Failed to delete book")
  }
}

// ── Searchable multi-select picker popup ──────────────────────────────────────

type PickerItem = { id: number; name: string }

type MultiPickerProps = {
  title: string
  items: PickerItem[]
  selected: number[]
  onClose: () => void
  onConfirm: (ids: number[]) => void
}

function MultiPicker({ title, items, selected, onClose, onConfirm }: MultiPickerProps) {
  const [search, setSearch] = useState("")
  const [local, setLocal] = useState<number[]>(selected)

  const filtered = items.filter((i) =>
    i.name.toLowerCase().includes(search.toLowerCase())
  )

  const toggle = (id: number) =>
    setLocal((prev) => prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id])

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/50" onClick={onClose}>
      <div className="relative w-full max-w-sm rounded-xl border bg-card p-5 shadow-xl" onClick={(e) => e.stopPropagation()}>
        <button type="button" onClick={onClose} className="absolute right-4 top-4 text-muted-foreground hover:text-foreground">
          <X className="h-4 w-4" />
        </button>

        <h3 className="mb-3 text-lg font-bold">{title}</h3>

        <div className="relative mb-3">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            className="pl-9"
            placeholder="Search…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            autoFocus
          />
        </div>

        <div className="max-h-56 overflow-y-auto rounded-lg border">
          {filtered.length === 0 && (
            <p className="p-3 text-sm text-muted-foreground">No results.</p>
          )}
          {filtered.map((item) => {
            const isSelected = local.includes(item.id)
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => toggle(item.id)}
                className={`flex w-full items-center justify-between px-4 py-2.5 text-sm transition-colors hover:bg-muted/50 ${isSelected ? "bg-muted/30 font-medium" : ""}`}
              >
                {item.name}
                {isSelected && <Check className="h-4 w-4 text-primary" />}
              </button>
            )
          })}
        </div>

        <div className="mt-4 flex justify-end gap-2">
          <Button variant="outline" onClick={onClose}>Cancel</Button>
          <Button onClick={() => { onConfirm(local); onClose() }}>Confirm</Button>
        </div>
      </div>
    </div>
  )
}

// ── Single-select picker popup ────────────────────────────────────────────────

type SinglePickerProps = {
  title: string
  items: PickerItem[]
  selected: number | null
  onClose: () => void
  onConfirm: (id: number) => void
}

function SinglePicker({ title, items, selected, onClose, onConfirm }: SinglePickerProps) {
  const [search, setSearch] = useState("")

  const filtered = items.filter((i) =>
    i.name.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/50" onClick={onClose}>
      <div className="relative w-full max-w-sm rounded-xl border bg-card p-5 shadow-xl" onClick={(e) => e.stopPropagation()}>
        <button type="button" onClick={onClose} className="absolute right-4 top-4 text-muted-foreground hover:text-foreground">
          <X className="h-4 w-4" />
        </button>

        <h3 className="mb-3 text-lg font-bold">{title}</h3>

        <div className="relative mb-3">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            className="pl-9"
            placeholder="Search…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            autoFocus
          />
        </div>

        <div className="max-h-56 overflow-y-auto rounded-lg border">
          {filtered.length === 0 && (
            <p className="p-3 text-sm text-muted-foreground">No results.</p>
          )}
          {filtered.map((item) => {
            const isSelected = selected === item.id
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => { onConfirm(item.id); onClose() }}
                className={`flex w-full items-center justify-between px-4 py-2.5 text-sm transition-colors hover:bg-muted/50 ${isSelected ? "bg-muted/30 font-medium" : ""}`}
              >
                {item.name}
                {isSelected && <Check className="h-4 w-4 text-primary" />}
              </button>
            )
          })}
        </div>
      </div>
    </div>
  )
}

// ── Book form modal ───────────────────────────────────────────────────────────

type BookModalProps = {
  title: string
  initial: BookFormData
  authors: AuthorDTO[]
  genres: GenreDTO[]
  publishers: PublisherDTO[]
  isCreate: boolean
  onClose: () => void
  onSubmit: (data: any) => Promise<void>
}

function BookModal({ title, initial, authors, genres, publishers, isCreate, onClose, onSubmit }: BookModalProps) {
  const [form, setForm] = useState<BookFormData>(initial)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const [authorPickerOpen, setAuthorPickerOpen] = useState(false)
  const [genrePickerOpen, setGenrePickerOpen] = useState(false)
  const [publisherPickerOpen, setPublisherPickerOpen] = useState(false)

  const selectedAuthorNames = authors.filter((a) => form.authorIds.includes(a.id)).map((a) => a.name)
  const selectedGenreNames = genres.filter((g) => form.genreIds.includes(g.id)).map((g) => g.name)
  const selectedPublisherName = publishers.find((p) => p.id === form.publisherId)?.name

  const handleSubmit = async () => {
    if (!form.title.trim()) { setError("Title is required."); return }
    if (!form.language.trim()) { setError("Language is required."); return }
    if (!form.publisherId) { setError("Publisher is required."); return }
    if (!form.yearPublished || isNaN(Number(form.yearPublished))) { setError("Valid year is required."); return }
    if (form.authorIds.length === 0) { setError("At least one author is required."); return }
    if (form.genreIds.length === 0) { setError("At least one genre is required."); return }

    setLoading(true)
    setError(null)
    try {
      const payload: any = {
        title: form.title,
        language: form.language,
        publisherId: form.publisherId,
        yearPublished: Number(form.yearPublished),
        description: form.description,
        authorIds: form.authorIds,
        genreIds: form.genreIds,
      }
      if (isCreate) payload.copyCount = Number(form.copyCount) || 1
      await onSubmit(payload)
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
        <div
          className="relative w-full max-w-lg rounded-xl border bg-card p-6 shadow-xl max-h-[90vh] overflow-y-auto"
          onClick={(e) => e.stopPropagation()}
        >
          <button type="button" onClick={onClose} className="absolute right-4 top-4 text-muted-foreground hover:text-foreground">
            <X className="h-4 w-4" />
          </button>

          <h2 className="mb-5 text-xl font-bold">{title}</h2>

          <div className="flex flex-col gap-4">
            {/* Title */}
            <div className="flex flex-col gap-1">
              <Label htmlFor="title">Title</Label>
              <Input id="title" value={form.title} onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))} placeholder="The Hobbit" />
            </div>

            {/* Language */}
            <div className="flex flex-col gap-1">
              <Label htmlFor="language">Language</Label>
              <Input id="language" value={form.language} onChange={(e) => setForm((f) => ({ ...f, language: e.target.value }))} placeholder="English" />
            </div>

            {/* Year */}
            <div className="flex flex-col gap-1">
              <Label htmlFor="year">Year published</Label>
              <Input id="year" type="number" value={form.yearPublished} onChange={(e) => setForm((f) => ({ ...f, yearPublished: e.target.value }))} placeholder="1937" />
            </div>

            {/* Description */}
            <div className="flex flex-col gap-1">
              <Label htmlFor="description">Description</Label>
              <textarea
                id="description"
                value={form.description}
                onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
                placeholder="A short description…"
                maxLength={1000}
                rows={3}
                className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring resize-none"
              />
            </div>

            {/* Publisher picker */}
            <div className="flex flex-col gap-1">
              <Label>Publisher</Label>
              <button
                type="button"
                onClick={() => setPublisherPickerOpen(true)}
                className="flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm hover:bg-muted/30 transition-colors"
              >
                <span className={selectedPublisherName ? "text-foreground" : "text-muted-foreground"}>
                  {selectedPublisherName ?? "Select publisher…"}
                </span>
                <Search className="h-4 w-4 text-muted-foreground" />
              </button>
            </div>

            {/* Authors picker */}
            <div className="flex flex-col gap-1">
              <Label>Authors</Label>
              <button
                type="button"
                onClick={() => setAuthorPickerOpen(true)}
                className="flex min-h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm hover:bg-muted/30 transition-colors"
              >
                <span className={selectedAuthorNames.length > 0 ? "text-foreground" : "text-muted-foreground"}>
                  {selectedAuthorNames.length > 0 ? selectedAuthorNames.join(", ") : "Select authors…"}
                </span>
                <Search className="h-4 w-4 text-muted-foreground flex-shrink-0" />
              </button>
            </div>

            {/* Genres picker */}
            <div className="flex flex-col gap-1">
              <Label>Genres</Label>
              <button
                type="button"
                onClick={() => setGenrePickerOpen(true)}
                className="flex min-h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm hover:bg-muted/30 transition-colors"
              >
                <span className={selectedGenreNames.length > 0 ? "text-foreground" : "text-muted-foreground"}>
                  {selectedGenreNames.length > 0 ? selectedGenreNames.join(", ") : "Select genres…"}
                </span>
                <Search className="h-4 w-4 text-muted-foreground flex-shrink-0" />
              </button>
            </div>

            {/* Copy count (create only) */}
            {isCreate && (
              <div className="flex flex-col gap-1">
                <Label htmlFor="copyCount">Number of copies</Label>
                <Input
                  id="copyCount"
                  type="number"
                  min={1}
                  value={form.copyCount}
                  onChange={(e) => setForm((f) => ({ ...f, copyCount: e.target.value }))}
                  placeholder="1"
                />
              </div>
            )}

            {error && <p className="text-sm text-destructive">{error}</p>}

            <div className="mt-2 flex justify-end gap-2">
              <Button variant="outline" onClick={onClose} disabled={loading}>Cancel</Button>
              <Button onClick={handleSubmit} disabled={loading}>
                {loading ? "Saving…" : "Save"}
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Pickers rendered outside the modal so they stack on top */}
      {publisherPickerOpen && (
        <SinglePicker
          title="Select publisher"
          items={publishers}
          selected={form.publisherId}
          onClose={() => setPublisherPickerOpen(false)}
          onConfirm={(id) => setForm((f) => ({ ...f, publisherId: id }))}
        />
      )}
      {authorPickerOpen && (
        <MultiPicker
          title="Select authors"
          items={authors}
          selected={form.authorIds}
          onClose={() => setAuthorPickerOpen(false)}
          onConfirm={(ids) => setForm((f) => ({ ...f, authorIds: ids }))}
        />
      )}
      {genrePickerOpen && (
        <MultiPicker
          title="Select genres"
          items={genres}
          selected={form.genreIds}
          onClose={() => setGenrePickerOpen(false)}
          onConfirm={(ids) => setForm((f) => ({ ...f, genreIds: ids }))}
        />
      )}
    </>
  )
}

// ── Main page ─────────────────────────────────────────────────────────────────

const PAGE_SIZE = 20
const EMPTY_FORM: BookFormData = {
  title: "", language: "", publisherId: null,
  yearPublished: "", description: "",
  authorIds: [], genreIds: [], copyCount: "1",
}

export default function BookAdministrationPage() {
  const [books, setBooks] = useState<BookDTO[]>([])
  const [total, setTotal] = useState(0)
  const [page, setPage] = useState(1)
  const [search, setSearch] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const [authors, setAuthors] = useState<AuthorDTO[]>([])
  const [genres, setGenres] = useState<GenreDTO[]>([])
  const [publishers, setPublishers] = useState<PublisherDTO[]>([])

  const [addOpen, setAddOpen] = useState(false)
  const [editTarget, setEditTarget] = useState<BookDTO | null>(null)
  const [deleteTarget, setDeleteTarget] = useState<BookDTO | null>(null)
  const [deleteError, setDeleteError] = useState<string | null>(null)
  const [deleteLoading, setDeleteLoading] = useState(false)

  const load = async () => {
    setLoading(true)
    setError(null)
    try {
      const data = await fetchBooks(page, PAGE_SIZE)
      setBooks(data.books)
      setTotal(data.total)
    } catch (e: any) {
      setError(e.message)
    } finally {
      setLoading(false)
    }
  }

  // Load books + reference data on mount
  useEffect(() => {
    load()
    fetchAuthors().then(setAuthors)
    fetchGenres().then(setGenres)
    fetchPublishers().then(setPublishers)
  }, [page])

  const filtered = books.filter((b) =>
    b.title.toLowerCase().includes(search.toLowerCase()) ||
    b.authors.some((a) => a.toLowerCase().includes(search.toLowerCase()))
  )

  const totalPages = Math.ceil(total / PAGE_SIZE)

  const handleDelete = async () => {
    if (!deleteTarget) return
    setDeleteLoading(true)
    setDeleteError(null)
    try {
      await deleteBook(deleteTarget.id)
      setDeleteTarget(null)
      load()
    } catch (e: any) {
      setDeleteError(e.message)
    } finally {
      setDeleteLoading(false)
    }
  }

  const editInitial = editTarget ? {
    title: editTarget.title,
    language: editTarget.language,
    publisherId: editTarget.publisherId,
    yearPublished: String(editTarget.yearPublished),
    description: editTarget.description,
    authorIds: authors.filter((a) => editTarget.authors.includes(a.name)).map((a) => a.id),
    genreIds: genres.filter((g) => editTarget.genres.includes(g.name)).map((g) => g.id),
    copyCount: "1",
  } : EMPTY_FORM

  return (
    <div className="mx-auto w-full max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
      <h1 className="mb-6 text-3xl font-extrabold">Books</h1>

      {/* toolbar */}
      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative w-full sm:max-w-xs">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            className="pl-9"
            placeholder="Search books or authors…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <Button onClick={() => setAddOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Add book
        </Button>
      </div>

      {/* table */}
      <div className="rounded-xl border bg-card shadow-sm overflow-hidden">
        {loading && <p className="p-6 text-muted-foreground">Loading…</p>}
        {error && <p className="p-6 text-destructive">{error}</p>}
        {!loading && !error && filtered.length === 0 && (
          <p className="p-6 text-muted-foreground">No books found.</p>
        )}
        {!loading && !error && filtered.length > 0 && (
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b bg-muted/50 text-left text-xs uppercase tracking-wider text-muted-foreground">
                <th className="px-5 py-3">ID</th>
                <th className="px-5 py-3">Title</th>
                <th className="px-5 py-3">Authors</th>
                <th className="px-5 py-3">Genres</th>
                <th className="px-5 py-3">Publisher</th>
                <th className="px-5 py-3">Year</th>
                <th className="px-5 py-3">Copies</th>
                <th className="px-5 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((book, i) => (
                <tr
                  key={book.id}
                  className={`border-b last:border-0 transition-colors hover:bg-muted/30 ${i % 2 === 0 ? "" : "bg-muted/10"}`}
                >
                  <td className="px-5 py-3 text-muted-foreground">{book.id}</td>
                  <td className="px-5 py-3 font-medium">{book.title}</td>
                  <td className="px-5 py-3 text-muted-foreground">{book.authors.join(", ")}</td>
                  <td className="px-5 py-3 text-muted-foreground">{book.genres.join(", ")}</td>
                  <td className="px-5 py-3 text-muted-foreground">{book.publisherName}</td>
                  <td className="px-5 py-3 text-muted-foreground">{book.yearPublished}</td>
                  <td className="px-5 py-3 text-muted-foreground">{book.availableCopies}/{book.totalCopies}</td>
                  <td className="px-5 py-3 text-right">
                    <div className="flex justify-end gap-2">
                      <Button size="sm" variant="outline" onClick={() => setEditTarget(book)}>
                        <Pencil className="h-3.5 w-3.5" />
                      </Button>
                      <Button size="sm" variant="destructive" onClick={() => { setDeleteError(null); setDeleteTarget(book) }}>
                        <X className="h-3.5 w-3.5" />
                      </Button>
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

      {/* add modal */}
      {addOpen && (
        <BookModal
          title="Add book"
          initial={EMPTY_FORM}
          authors={authors}
          genres={genres}
          publishers={publishers}
          isCreate={true}
          onClose={() => setAddOpen(false)}
          onSubmit={async (data) => { await createBook(data); load() }}
        />
      )}

      {/* edit modal */}
      {editTarget && (
        <BookModal
          title="Edit book"
          initial={editInitial}
          authors={authors}
          genres={genres}
          publishers={publishers}
          isCreate={false}
          onClose={() => setEditTarget(null)}
          onSubmit={async (data) => { await updateBook(editTarget.id, data); load() }}
        />
      )}

      {/* delete confirmation */}
      {deleteTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50" onClick={() => setDeleteTarget(null)}>
          <div className="relative w-full max-w-sm rounded-xl border bg-card p-6 shadow-xl" onClick={(e) => e.stopPropagation()}>
            <h2 className="mb-2 text-lg font-bold">Delete book</h2>
            <p className="text-sm text-muted-foreground">
              Are you sure you want to delete{" "}
              <span className="font-semibold text-foreground">{deleteTarget.title}</span>?
              This cannot be undone.
            </p>
            {deleteError && <p className="mt-3 text-sm text-destructive">{deleteError}</p>}
            <div className="mt-5 flex justify-end gap-2">
              <Button variant="outline" onClick={() => setDeleteTarget(null)} disabled={deleteLoading}>Cancel</Button>
              <Button variant="destructive" onClick={handleDelete} disabled={deleteLoading}>
                {deleteLoading ? "Deleting…" : "Delete"}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
