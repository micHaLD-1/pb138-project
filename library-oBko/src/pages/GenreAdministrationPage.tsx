import { useState } from "react"
import { Plus, Search, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useQueryClient } from "@tanstack/react-query"
import { useGetGenres, getGenresQueryKey } from "@/gen/hooks/useGetGenres"
import { usePostGenres } from "@/gen/hooks/usePostGenres"
import { useDeleteGenresId } from "@/gen/hooks/useDeleteGenresId"

type GenreDTO = {
  id: number
  name: string
}

type GenreFormData = {
  name: string
}

type ModalProps = {
  onClose: () => void
  onSubmit: (data: GenreFormData) => Promise<void>
}

function AddGenreModal({ onClose, onSubmit }: ModalProps) {
  const [name, setName] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const handleSubmit = async () => {
    if (!name.trim()) {
      setError("Name is required.")
      return
    }
    setLoading(true)
    setError(null)
    try {
      await onSubmit({ name })
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

        <h2 className="mb-5 text-xl font-bold">Add genre</h2>

        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-1">
            <Label htmlFor="name">Name</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Fantasy"
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

const PAGE_SIZE = 20

export default function GenreAdministrationPage() {
  const [page, setPage] = useState(1)
  const [search, setSearch] = useState("")

  const [addOpen, setAddOpen] = useState(false)
  const [deleteTarget, setDeleteTarget] = useState<GenreDTO | null>(null)
  const [deleteError, setDeleteError] = useState<string | null>(null)

  const queryClient = useQueryClient()

  const { data, isPending: loading, isError } = useGetGenres({ page, size: PAGE_SIZE })
  const genres: GenreDTO[] = (data?.genres ?? []).map((g) => ({
    id: g.id ?? 0,
    name: g.name ?? "",
  }))
  const total = data?.total ?? 0
  const error = isError ? "Failed to fetch genres" : null

  const { mutateAsync: createGenre } = usePostGenres({
    mutation: {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: getGenresQueryKey({ page, size: PAGE_SIZE }) })
      },
    },
  })

  const { mutate: deleteGenre, isPending: deleteLoading } = useDeleteGenresId({
    mutation: {
      onSuccess: () => {
        setDeleteTarget(null)
        queryClient.invalidateQueries({ queryKey: getGenresQueryKey({ page, size: PAGE_SIZE }) })
      },
      onError: (e: any) => {
        setDeleteError(e.message ?? "Failed to delete genre")
      },
    },
  })

  const filtered = genres.filter((g) =>
    g.name.toLowerCase().includes(search.toLowerCase())
  )

  const totalPages = Math.ceil(total / PAGE_SIZE)

  const handleDelete = () => {
    if (!deleteTarget) return
    setDeleteError(null)
    deleteGenre({ id: deleteTarget.id })
  }

  return (
    <div className="mx-auto w-full max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
      <h1 className="mb-6 text-3xl font-extrabold">Genres</h1>

      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative w-full sm:max-w-xs">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            className="pl-9"
            placeholder="Search genres…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <Button onClick={() => setAddOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Add genre
        </Button>
      </div>

      <div className="rounded-xl border bg-card shadow-sm overflow-hidden">
        {loading && <p className="p-6 text-muted-foreground">Loading…</p>}
        {error && <p className="p-6 text-destructive">{error}</p>}
        {!loading && !error && filtered.length === 0 && (
          <p className="p-6 text-muted-foreground">No genres found.</p>
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
              {filtered.map((genre, i) => (
                <tr
                  key={genre.id}
                  className={`border-b last:border-0 transition-colors hover:bg-muted/30 ${
                    i % 2 === 0 ? "" : "bg-muted/10"
                  }`}
                >
                  <td className="px-5 py-3 text-muted-foreground">{genre.id}</td>
                  <td className="px-5 py-3 font-medium">{genre.name}</td>
                  <td className="px-5 py-3 text-right">
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => {
                        setDeleteError(null)
                        setDeleteTarget(genre)
                      }}
                    >
                      <X className="h-3.5 w-3.5" />
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

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

      {addOpen && (
        <AddGenreModal
          onClose={() => setAddOpen(false)}
          onSubmit={async (form) => {
            await createGenre({ data: form })
          }}
        />
      )}

      {deleteTarget && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
          onClick={() => setDeleteTarget(null)}
        >
          <div
            className="relative w-full max-w-sm rounded-xl border bg-card p-6 shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="mb-2 text-lg font-bold">Delete genre</h2>
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
