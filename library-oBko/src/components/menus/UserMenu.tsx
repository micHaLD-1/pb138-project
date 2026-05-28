import userIcon from '@/assets/user.svg'
import { useAuth } from '@/context/AuthContext'
import { useNavigate } from 'react-router-dom'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

interface UserMenuProps {
    user: {
        firstName: string
        lastName: string
        email: string
    }
}

function UserMenu({ user }: UserMenuProps) {
    const { logout } = useAuth()
    const navigate = useNavigate()

    return (
        <DropdownMenu>
            <DropdownMenuTrigger className="flex items-center gap-2 rounded-full border border-border bg-background px-3 py-2 text-sm font-medium text-foreground transition hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50">
                <div className="flex flex-col items-end leading-tight">
                    <span className="whitespace-nowrap">
                        {user.firstName} {user.lastName}
                    </span>
                    <span className="text-xs text-muted-foreground whitespace-nowrap">
                        {user.email}
                    </span>
                </div>
                <img src={userIcon} alt="" aria-hidden="true" className="h-8 w-8 shrink-0" />
            </DropdownMenuTrigger>

            <DropdownMenuContent align="end" className="min-w-44">
                <DropdownMenuItem className="cursor-pointer" onClick={() => navigate('/profile')}>
                    Profil
                </DropdownMenuItem>
                <DropdownMenuItem className="cursor-pointer" onClick={() => navigate('/wishlist')}>
                    Seznam přání
                </DropdownMenuItem>
                <DropdownMenuItem className="cursor-pointer" onClick={() => navigate('/my-reservations')}>
                    Rezervace
                </DropdownMenuItem>
                <DropdownMenuItem
                    className="cursor-pointer"
                    onClick={() => {
                        logout()
                        navigate('/')
                    }}
                >
                    Odhlásit se
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}

export default UserMenu