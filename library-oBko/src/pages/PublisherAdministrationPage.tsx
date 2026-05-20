import { useEffect, useState } from "react"
import { Pencil, Plus, Search, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

// ── Types ─────────────────────────────────────────────────────────────────────

type PublisherDTO = {
  id: number
  name: string
}

type PublisherFormData = {
  name: string
}


// ── API helpers ───────────────────────────────────────────────────────────────

const BASE = "/api/publishers"

async function fetchPublishers(page: number, size: number): Promise<{ publishers: PublisherDTO[]; total: number }> {
  // Mock — replace with real fetch when backend is ready:
  const res = await fetch(`${BASE}?page=${page}&size=${size}`, { credentials: "include" })
  if (!res.ok) throw new Error("Failed to fetch publishers")
  const data = await res.json()
  return { publishers: data.publishers, total: data.total }

}

async function createPublisher(data: PublisherFormData): Promise<PublisherDTO> {
  const res = await fetch(BASE, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
    credentials: "include",
  })
  if (!res.ok) {
    const body = await res.json().catch(() => ({}))
    throw new Error(body.message ?? "Failed to create publisher")
  }
  const json = await res.json()
  return json.publisher
}

async function updatePublisher(id: number, data: PublisherFormData): Promise<void> {
  const res = await fetch(`${BASE}/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
    credentials: "include",
  })
  if (!res.ok) {
    const body = await res.json().catch(() => ({}))
    throw new Error(body.message ?? "Failed to update publisher")
  }
}

async function deletePublisher(id: number): Promise<void> {
  const res = await fetch(`${BASE}/${id}`, {
    method: "DELETE",
    credentials: "include",
  })
  if (!res.ok) {
    const body = await res.json().catch(() => ({}))
    throw new Error(body.message ?? "Failed to delete publisher")
  }
}

// ── Modal ─────────────────────────────────────────────────────────────────────

type ModalProps = {
  title: string
  initial: PublisherFormData
  onClose: () => void
  onSubmit: (data: PublisherFormData) => Promise<void>
}

function PublisherModal({ title, initial, onClose, onSubmit }: ModalProps) {
  const [form, setForm] = useState<PublisherFormData>(initial)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const handleSubmit = async () => {
    if (!form.name.trim()) {
      setError("Name is required.")
      return
    }
    setLoading(true)
    setError(null)
    try {
      await onSubmit(form)
      onClose()
    } catch (e: any) {
      setError(e.message ?? "Something went wrong.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-md rounded-xl border bg-card p-6 shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          onClick={onClose}
          className="absolute right-4 top-4 text-muted-foreground hover:text-foreground"
        >
          <X className="h-4 w-4" />
        </button>

        <h2 className="mb-5 text-xl font-bold">{title}</h2>

        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-1">
            <Label htmlFor="name">Name</Label>
            <Input
              id="name"
              value={form.name}
              onChange={(e) => setForm({ name: e.target.value })}
              placeholder="Penguin Books"
            />
          </div>

          {error && <p className="text-sm text-destructive">{error}</p>}

          <div className="mt-2 flex justify-end gap-2">
            <Button variant="outline" onClick={onClose} disabled={loading}>
              Cancel
            </Button>
            <Button onClick={handleSubmit} disabled={loading}>
              {loading ? "Saving…" : "Save"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}

// ── Main page ─────────────────────────────────────────────────────────────────

const PAGE_SIZE = 20

export default function PublisherAdministrationPage() {
  const [publishers, setPublishers] = useState<PublisherDTO[]>([])
  const [total, setTotal] = useState(0)
  const [page, setPage] = useState(1)
  const [search, setSearch] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const [addOpen, setAddOpen] = useState(false)
  const [editTarget, setEditTarget] = useState<PublisherDTO | null>(null)
  const [deleteTarget, setDeleteTarget] = useState<PublisherDTO | null>(null)
  const [deleteError, setDeleteError] = useState<string | null>(null)
  const [deleteLoading, setDeleteLoading] = useState(false)

  const load = async () => {
    setLoading(true)
    setError(null)
    try {
      const data = await fetchPublishers(page, PAGE_SIZE)
      setPublishers(data.publishers)
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

  const filtered = publishers.filter((p) =>
    p.name.toLowerCase().includes(search.toLowerCase())
  )

  const totalPages = Math.ceil(total / PAGE_SIZE)

  const handleDelete = async () => {
    if (!deleteTarget) return
    setDeleteLoading(true)
    setDeleteError(null)
    try {
      await deletePublisher(deleteTarget.id)
      setDeleteTarget(null)
      load()
    } catch (e: any) {
      setDeleteError(e.message)
    } finally {
      setDeleteLoading(false)
    }
  }

  return (
    <div className="mx-auto w-full max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
      <h1 className="mb-6 text-3xl font-extrabold">Publishers</h1>

      {/* toolbar */}
      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative w-full sm:max-w-xs">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            className="pl-9"
            placeholder="Search publishers…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <Button onClick={() => setAddOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Add publisher
        </Button>
      </div>

      {/* table */}
      <div className="rounded-xl border bg-card shadow-sm overflow-hidden">
        {loading && <p className="p-6 text-muted-foreground">Loading…</p>}
        {error && <p className="p-6 text-destructive">{error}</p>}
        {!loading && !error && filtered.length === 0 && (
          <p className="p-6 text-muted-foreground">No publishers found.</p>
        )}
        {!loading && !error && filtered.length > 0 && (
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b bg-muted/50 text-left text-xs uppercase tracking-wider text-muted-foreground">
                <th className="px-5 py-3">ID</th>
                <th className="px-5 py-3">Name</th>
                <th className="px-5 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((publisher, i) => (
                <tr
                  key={publisher.id}
                  className={`border-b last:border-0 transition-colors hover:bg-muted/30 ${
                    i % 2 === 0 ? "" : "bg-muted/10"
                  }`}
                >
                  <td className="px-5 py-3 text-muted-foreground">{publisher.id}</td>
                  <td className="px-5 py-3 font-medium">{publisher.name}</td>
                  <td className="px-5 py-3 text-right">
                    <div className="flex justify-end gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => setEditTarget(publisher)}
                      >
                        <Pencil className="h-3.5 w-3.5" />
                      </Button>
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => {
                          setDeleteError(null)
                          setDeleteTarget(publisher)
                        }}
                      >
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
          <Button
            variant="outline"
            size="sm"
            disabled={page <= 1}
            onClick={() => setPage((p) => p - 1)}
          >
            Previous
          </Button>
          <span className="text-muted-foreground">
            {page} / {totalPages}
          </span>
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

      {/* add modal */}
      {addOpen && (
        <PublisherModal
          title="Add publisher"
          initial={{ name: "" }}
          onClose={() => setAddOpen(false)}
          onSubmit={async (data) => {
            await createPublisher(data)
            load()
          }}
        />
      )}

      {/* edit modal */}
      {editTarget && (
        <PublisherModal
          title="Edit publisher"
          initial={{ name: editTarget.name }}
          onClose={() => setEditTarget(null)}
          onSubmit={async (data) => {
            await updatePublisher(editTarget.id, data)
            load()
          }}
        />
      )}

      {/* delete confirmation */}
      {deleteTarget && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
          onClick={() => setDeleteTarget(null)}
        >
          <div
            className="relative w-full max-w-sm rounded-xl border bg-card p-6 shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="mb-2 text-lg font-bold">Delete publisher</h2>
            <p className="text-sm text-muted-foreground">
              Are you sure you want to delete{" "}
              <span className="font-semibold text-foreground">{deleteTarget.name}</span>?
              This cannot be undone.
            </p>
            {deleteError && (
              <p className="mt-3 text-sm text-destructive">{deleteError}</p>
            )}
            <div className="mt-5 flex justify-end gap-2">
              <Button
                variant="outline"
                onClick={() => setDeleteTarget(null)}
                disabled={deleteLoading}
              >
                Cancel
              </Button>
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
