import logo from "@/assets/Logo.png"
import AuthDialog from "@/components/auth/AuthDialog"
import UserMenu from "@/components/menus/UserMenu"
import StaffMenu from "@/components/menus/StaffMenu"
import { Link, useNavigate, useRouterState } from '@tanstack/react-router'
import { useAuth } from '@/context/AuthContext'
import { Input } from "@/components/ui/input"
import { ToggleMode } from "@/components/ui/ToggleMode"

function Header() {
	const { isLoggedIn, user } = useAuth()
	const navigate = useNavigate()
	const currentSearch = useRouterState({ select: s => new URLSearchParams(s.location.searchStr).get('search') ?? '' })

	function handleSearch(e: React.FormEvent<HTMLFormElement>) {
		e.preventDefault()
		const value = (new FormData(e.currentTarget).get("search") as string).trim()
		void navigate({ to: '/', search: value ? { search: value } : {} })
	}

	return (
		<header className="w-full border-b border-border bg-background text-foreground">
			<ToggleMode />
			<div className="mx-auto w-full max-w-7xl px-4 py-3 md:px-6 md:py-4">
				<div className="grid grid-cols-[auto,minmax(0,1fr)] items-center gap-x-3 gap-y-3 md:grid-cols-[auto,minmax(0,1fr),auto] md:gap-x-5 md:gap-y-0">
					<Link to="/" aria-label="Profil" className="justify-self-start">
						<img src={logo} alt="OBKO logo" className="h-10 w-auto md:h-24" />
					</Link>


					<div className="col-span-2 row-start-2 w-full md:col-span-1 md:col-start-2 md:row-start-1">
						<form role="search" className="w-full" onSubmit={handleSearch}>
							<div className="relative w-full">
								<Input
									type="search"
									name="search"
									placeholder="Vyhledej"
									aria-label="Vyhledávání"
									defaultValue={currentSearch}
									key={currentSearch}
									className="h-10 border-border bg-muted-foreground/15 px-4 pr-10 text-center text-foreground placeholder:text-center placeholder:text-muted-foreground/80 focus-visible:ring-2 md:h-11"
								/>
								<button
									type="submit"
									aria-label="Vyhledat"
									className="absolute right-2 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
								>
									🔍
								</button>
							</div>
						</form>
					</div>

					<div className="col-start-2 row-start-1 w-full justify-self-end md:col-start-3 md:row-start-1 md:w-auto md:justify-self-end">
						{isLoggedIn && user ? (
							user.role === "ADMIN" || user.role === "STAFF" ? (
								<StaffMenu user={user} />
							) : (
								<UserMenu user={user} />
							)
						) : (
							<AuthDialog />
						)}
					</div>
				</div>
			</div>

			<div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-2 px-4 pb-3 md:justify-around">

				<Link to="/" className="text-sm font-bold hover:text-primary">Domů</Link>
				<Link to="/o_nas" className="text-sm font-bold hover:text-primary">O nás</Link>
			
      		</div>
		</header>
		
	)
}

export default Header
