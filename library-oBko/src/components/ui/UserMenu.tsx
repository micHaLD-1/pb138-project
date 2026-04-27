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
    // TODO: Replace with backend API calls for logout
    const { logout } = useAuth()
    const navigate = useNavigate()

    return (
        <DropdownMenu>
            <DropdownMenuTrigger className="flex items-center gap-2 rounded-full border border-border bg-background px-3 py-2 text-sm font-medium text-foreground transition hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50">
                <span className="whitespace-nowrap">
                    {user.firstName} {user.lastName}
                </span>
                <img src={userIcon} alt="" aria-hidden="true" className="h-8 w-8 shrink-0" />
            </DropdownMenuTrigger>

            <DropdownMenuContent align="end" className="min-w-44">
                <DropdownMenuItem className="cursor-pointer" onClick={() => navigate('/profile')}>
                    Profil
                </DropdownMenuItem>
                <DropdownMenuItem className="cursor-pointer" onClick={() => navigate('/wishlist')}>
                    Zoznam prianí
                </DropdownMenuItem>
                <DropdownMenuItem className="cursor-pointer" onClick={() => navigate('/o_nas')}>
                    Rezervácie
                </DropdownMenuItem>
                <DropdownMenuItem
                    className="cursor-pointer"
                    onClick={() => {
                        logout()
                    }}
                >
                    Odhlásiť sa
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}

export default UserMenu