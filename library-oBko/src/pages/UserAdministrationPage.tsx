import { useEffect, useState } from "react"
import { Search } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

const ROLES = ["ADMIN", "STAFF", "MEMBER", "GUEST"] as const
type Role = typeof ROLES[number]

type UserDTO = {
    id: number
    firstName: string
    lastName: string
    email: string
    role: Role
}

const ROLE_COLORS: Record<Role, string> = {
    ADMIN:  "bg-purple-100 text-purple-700",
    STAFF:  "bg-blue-100 text-blue-700",
    MEMBER: "bg-green-100 text-green-700",
    GUEST:  "bg-muted text-muted-foreground",
}

const PAGE_SIZE = 20

export default function UserAdministrationPage() {
    const [users, setUsers] = useState<UserDTO[]>([])
    const [total, setTotal] = useState(0)
    const [page, setPage] = useState(1)
    const [search, setSearch] = useState("")
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)

    // role change state
    const [roleTarget, setRoleTarget] = useState<UserDTO | null>(null)
    const [selectedRole, setSelectedRole] = useState<Role>("MEMBER")
    const [roleLoading, setRoleLoading] = useState(false)
    const [roleError, setRoleError] = useState<string | null>(null)

    const load = async () => {
        setLoading(true)
        setError(null)
        try {
            const res = await fetch(`/api/users?page=${page}&size=${PAGE_SIZE}`, { credentials: "include" })
            if (!res.ok) throw new Error("Failed to fetch users")
            const data = await res.json()
            setUsers(data.users)
            setTotal(data.total)
        } catch (e: any) {
            setError(e.message)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => { load() }, [page])

    const filtered = users.filter((u) =>
        `${u.firstName} ${u.lastName} ${u.email}`.toLowerCase().includes(search.toLowerCase())
    )

    const totalPages = Math.ceil(total / PAGE_SIZE)

    function openRoleModal(u: UserDTO) {
        setRoleTarget(u)
        setSelectedRole(u.role)
        setRoleError(null)
    }

    async function handleRoleChange() {
        if (!roleTarget) return
        setRoleLoading(true)
        setRoleError(null)
        try {
            const res = await fetch(`/api/users/${roleTarget.id}/role`, {
                method: "PUT",
                credentials: "include",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ role: selectedRole }),
            })
            if (!res.ok) {
                const body = await res.json().catch(() => ({}))
                throw new Error(body.message ?? "Failed to update role")
            }
            // Update the row in local state directly — no re-fetch needed
            setUsers(prev => prev.map(u =>
                u.id === roleTarget.id ? { ...u, role: selectedRole } : u
            ))
            setRoleTarget(null)
        } catch (e: any) {
            setRoleError(e.message)
        } finally {
            setRoleLoading(false)
        }
    }

    return (
        <div className="mx-auto w-full max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
            <h1 className="mb-6 text-3xl font-extrabold">Správa uživatelů</h1>

            {/* search */}
            <div className="mb-4 relative w-full sm:max-w-xs">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                    className="pl-9"
                    placeholder="Hledat podle jména nebo emailu…"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                />
            </div>

            {/* table */}
            <div className="rounded-xl border bg-card shadow-sm overflow-hidden">
                {loading && <p className="p-6 text-muted-foreground">Načítám…</p>}
                {error && <p className="p-6 text-destructive">{error}</p>}
                {!loading && !error && filtered.length === 0 && (
                    <p className="p-6 text-muted-foreground">Žádní uživatelé nenalezeni.</p>
                )}
                {!loading && !error && filtered.length > 0 && (
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="border-b bg-muted/50 text-left text-xs uppercase tracking-wider text-muted-foreground">
                                <th className="px-5 py-3">ID</th>
                                <th className="px-5 py-3">Jméno</th>
                                <th className="px-5 py-3">Email</th>
                                <th className="px-5 py-3">Role</th>
                                <th className="px-5 py-3 text-right">Akce</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filtered.map((u, i) => (
                                <tr key={u.id} className={`border-b last:border-0 transition-colors hover:bg-muted/30 ${i % 2 === 0 ? "" : "bg-muted/10"}`}>
                                    <td className="px-5 py-3 text-muted-foreground">{u.id}</td>
                                    <td className="px-5 py-3 font-medium">{u.firstName} {u.lastName}</td>
                                    <td className="px-5 py-3 text-muted-foreground">{u.email}</td>
                                    <td className="px-5 py-3">
                                        <span className={`inline-block rounded-full px-2.5 py-0.5 text-xs font-medium ${ROLE_COLORS[u.role]}`}>
                                            {u.role}
                                        </span>
                                    </td>
                                    <td className="px-5 py-3 text-right">
                                        <Button size="sm" variant="outline" onClick={() => openRoleModal(u)}>
                                            Změnit roli
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
                    <Button variant="outline" size="sm" disabled={page <= 1} onClick={() => setPage((p) => p - 1)}>Previous</Button>
                    <span className="text-muted-foreground">{page} / {totalPages}</span>
                    <Button variant="outline" size="sm" disabled={page >= totalPages} onClick={() => setPage((p) => p + 1)}>Next</Button>
                </div>
            )}

            {/* role change modal */}
            {roleTarget && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50" onClick={() => setRoleTarget(null)}>
                    <div className="relative w-full max-w-sm rounded-xl border bg-card p-6 shadow-xl" onClick={(e) => e.stopPropagation()}>
                        <h2 className="mb-1 text-lg font-bold">Změnit roli</h2>
                        <p className="mb-4 text-sm text-muted-foreground">
                            {roleTarget.firstName} {roleTarget.lastName} — <span className="font-medium text-foreground">{roleTarget.email}</span>
                        </p>

                        <div className="flex flex-col gap-2">
                            {ROLES.map((role) => (
                                <button
                                    key={role}
                                    type="button"
                                    onClick={() => setSelectedRole(role)}
                                    className={`flex items-center justify-between rounded-lg border px-4 py-2.5 text-sm transition-colors hover:bg-muted/50 ${selectedRole === role ? "border-primary bg-primary/5 font-semibold" : "border-border"}`}
                                >
                                    <span>{role}</span>
                                    <span className={`inline-block rounded-full px-2 py-0.5 text-xs font-medium ${ROLE_COLORS[role]}`}>
                                        {role}
                                    </span>
                                </button>
                            ))}
                        </div>

                        {roleError && <p className="mt-3 text-sm text-destructive">{roleError}</p>}

                        <div className="mt-5 flex justify-end gap-2">
                            <Button variant="outline" onClick={() => setRoleTarget(null)} disabled={roleLoading}>Zrušit</Button>
                            <Button onClick={handleRoleChange} disabled={roleLoading || selectedRole === roleTarget.role}>
                                {roleLoading ? "Ukládám…" : "Uložit"}
                            </Button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}
