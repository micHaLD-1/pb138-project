import { useState } from "react"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Field, FieldLabel, FieldSet } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"
import userIcon from "@/assets/user.svg"
import { useAuth } from '@/context/AuthContext'
import { signInSchema, registerSchema, type SignInFormData, type RegisterFormData } from "@/lib/schemas"

type DialogStage = "chooser" | "signin" | "register" | null

type SignInErrors = Partial<Record<keyof SignInFormData, string>>
type RegisterErrors = Partial<Record<keyof RegisterFormData, string>>

function AuthDialog() {
  const [stage, setStage] = useState<DialogStage>(null)
  const [signInErrors, setSignInErrors] = useState<SignInErrors>({})
  const [registerErrors, setRegisterErrors] = useState<RegisterErrors>({})
  // TODO: Replace with backend API calls for authentication
  const { login } = useAuth()

  async function handleSignInSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setSignInErrors({})
    
    const formData = new FormData(event.currentTarget)
    const data = {
      email: formData.get("email") as string,
      password: formData.get("password") as string,
    }
    
    const result = signInSchema.safeParse(data)
    
    if (!result.success) {
      const errors: SignInErrors = {}
      result.error.issues.forEach((error: any) => {
        const field = error.path[0] as keyof SignInFormData
        errors[field] = error.message
      })
      setSignInErrors(errors)
      return
    }
    
    // Mock backend call result for now.
    login()

    event.currentTarget.reset()
    setStage(null)
    return
  }

  async function handleRegisterSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setRegisterErrors({})
    
    const formData = new FormData(event.currentTarget)
    const data = {
      firstName: formData.get("firstName") as string,
      lastName: formData.get("lastName") as string,
      email: formData.get("email") as string,
      password: formData.get("password") as string,
      confirmPassword: formData.get("confirmPassword") as string,
    }
    
    const result = registerSchema.safeParse(data)
    
    if (!result.success) {
      const errors: RegisterErrors = {}
      result.error.issues.forEach((error: any) => {
        const field = error.path[0] as keyof RegisterFormData
        errors[field] = error.message
      })
      setRegisterErrors(errors)
      return
    }
    
    // Mock backend call result for now.
    const isRegisterSuccessful = true

    if (isRegisterSuccessful) {
      event.currentTarget.reset()
      setStage(null)
      return
    }
  }

  return (
    <div className="w-full">
      <Dialog open={stage === "chooser"} onOpenChange={(open) => !open && setStage(null)}>
        <DialogTrigger
          onClick={() => setStage("chooser")}
          className={cn(
            "flex w-full items-center justify-end gap-2 rounded-none border-0 bg-transparent px-0 py-0 text-right text-sm font-medium text-foreground transition-colors hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50",
            "md:justify-self-auto"
          )}
          aria-label="Prihlásiť sa alebo registrovať"
        >
          <span className="whitespace-nowrap">Prihlásiť/registrovať</span>
          <img src={userIcon} alt="" aria-hidden="true" className="h-8 w-8 shrink-0" />
        </DialogTrigger>

        <DialogContent className="sm:max-w-md">
          
          <div className="mt-5 grid gap-3 sm:grid-rows-2">
            <Button type="button" variant="outline" className="w-full bg-chart-3 text-primary-foreground hover:bg-primary hover:text-background" onClick={() => setStage("signin")}>
              Prihlásiť sa
            </Button>
            <Button type="button" variant="outline" className="w-full bg-chart-3 text-primary-foreground hover:bg-primary hover:text-background" onClick={() => setStage("register")}>
              Registrovať
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={stage === "signin"} onOpenChange={(open) => !open && setStage(null)}>
        <DialogContent className="sm:max-w-md">

          <form className="grid gap-4" onSubmit={handleSignInSubmit}>
            <FieldSet className="gap-4">
              <Field className="gap-2">
                <FieldLabel htmlFor="signin-email">Email</FieldLabel>
                <Input 
                  id="signin-email" 
                  name="email" 
                  type="email" 
                  autoComplete="email" 
                  required
                  aria-invalid={!!signInErrors.email}
                />
                {signInErrors.email && (
                  <p className="text-sm font-medium text-destructive">{signInErrors.email}</p>
                )}
              </Field>

              <Field className="gap-2">
                <FieldLabel htmlFor="signin-password">Heslo</FieldLabel>
                <Input
                  id="signin-password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  aria-invalid={!!signInErrors.password}
                />
                {signInErrors.password && (
                  <p className="text-sm font-medium text-destructive">{signInErrors.password}</p>
                )}
              </Field>
            </FieldSet>

            <div className="flex items-center justify-between gap-3">
              <Button type="button" variant="ghost" onClick={() => setStage("chooser")}>
                Späť
              </Button>

              { /* Send data to BE */}
              <Button 
                type="submit"
                className="bg-primary text-primary-foreground hover:bg-primary/90"
              >
                Prihlásiť sa
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>

      <Dialog open={stage === "register"} onOpenChange={(open) => !open && setStage(null)}>
        <DialogContent className="sm:max-w-lg">

          <form className="grid gap-4" onSubmit={handleRegisterSubmit}>
            <FieldSet className="gap-4">
              <Field className="gap-2">
                <FieldLabel htmlFor="register-first-name">Meno</FieldLabel>
                <Input 
                  id="register-first-name" 
                  name="firstName" 
                  autoComplete="given-name" 
                  required
                  aria-invalid={!!registerErrors.firstName}
                />
                {registerErrors.firstName && (
                  <p className="text-sm font-medium text-destructive">{registerErrors.firstName}</p>
                )}
              </Field>

              <Field className="gap-2">
                <FieldLabel htmlFor="register-last-name">Priezvisko</FieldLabel>
                <Input 
                  id="register-last-name" 
                  name="lastName" 
                  autoComplete="family-name" 
                  required
                  aria-invalid={!!registerErrors.lastName}
                />
                {registerErrors.lastName && (
                  <p className="text-sm font-medium text-destructive">{registerErrors.lastName}</p>
                )}
              </Field>

              <Field className="gap-2">
                <FieldLabel htmlFor="register-email">Email</FieldLabel>
                <Input 
                  id="register-email" 
                  name="email" 
                  type="email" 
                  autoComplete="email" 
                  required
                  aria-invalid={!!registerErrors.email}
                />
                {registerErrors.email && (
                  <p className="text-sm font-medium text-destructive">{registerErrors.email}</p>
                )}
              </Field>

              <Field className="gap-2">
                <FieldLabel htmlFor="register-password">Heslo</FieldLabel>
                <Input 
                  id="register-password" 
                  name="password" 
                  type="password" 
                  autoComplete="new-password" 
                  required
                  aria-invalid={!!registerErrors.password}
                />
                {registerErrors.password && (
                  <p className="text-sm font-medium text-destructive">{registerErrors.password}</p>
                )}
              </Field>

              <Field className="gap-2">
                <FieldLabel htmlFor="register-confirm-password">Potvrď heslo</FieldLabel>
                <Input
                  id="register-confirm-password"
                  name="confirmPassword"
                  type="password"
                  autoComplete="new-password"
                  aria-invalid={!!registerErrors.confirmPassword}
                  required
                />
                {registerErrors.confirmPassword && (
                  <p className="text-sm font-medium text-destructive">{registerErrors.confirmPassword}</p>
                )}
              </Field>
            </FieldSet>

            <div className="flex items-center justify-between gap-3">
              <Button type="button" variant="ghost" onClick={() => setStage("chooser")}>
                Späť
              </Button>
              
              { /* Send data to BE */}
              <Button 
                type="submit"
                className="bg-primary text-primary-foreground hover:bg-primary/90"
              >
                Registrovať
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}

export default AuthDialog