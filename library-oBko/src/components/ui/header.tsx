import logo from "@/assets/Logo.png"
import AuthDialog from "@/components/ui/AuthDialog"
import UserMenu from "@/components/ui/UserMenu"
import { Link } from 'react-router-dom'
import { useAuth } from '@/context/AuthContext'
import { Input } from "@/components/ui/input"

function Header() {
	const { isLoggedIn, user } = useAuth()

	return (
		<header className="w-full border-b border-border bg-background text-foreground">
			<div className="mx-auto w-full max-w-7xl px-4 py-3 md:px-6 md:py-4">
				<div className="grid grid-cols-[auto,minmax(0,1fr)] items-center gap-x-3 gap-y-3 md:grid-cols-[auto,minmax(0,1fr),auto] md:gap-x-5 md:gap-y-0">
					<Link to="/" aria-label="Profil" className="justify-self-start">
						<img src={logo} alt="OBKO logo" className="h-10 w-auto md:h-24" />
					</Link>


					<div className="col-span-2 row-start-2 w-full md:col-span-1 md:col-start-2 md:row-start-1">
						<form role="search" className="w-full">
							<Input
								type="search"
								name="search"
								placeholder="Vyhľadaj🔍"
								aria-label="Vyhľadávanie"
								className="h-10 border-border bg-muted-foreground/15 px-4 text-center text-foreground placeholder:text-center placeholder:text-muted-foreground/80 focus-visible:ring-2 md:h-11"
							/>
						</form>
					</div>

					<div className="col-start-2 row-start-1 w-full justify-self-end md:col-start-3 md:row-start-1 md:w-auto md:justify-self-end">
						{isLoggedIn && user
						? <UserMenu user={user} />
						: <AuthDialog />
          }
					</div>
				</div>
			</div>

			<div className="flex justify-around gap-4">
				<Link to="/" className="text-sm font-bold hover:text-primary">Domov</Link>
				<Link to="/o_nas" className="text-sm font-bold hover:text-primary">O nás</Link>
			</div>
		</header>
		
	)
}

export default Header
