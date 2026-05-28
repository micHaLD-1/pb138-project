import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"

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

function AuthDialog() {
  const [stage, setStage] = useState<DialogStage>(null)
  const { login, register } = useAuth()

  const signInForm = useForm<SignInFormData>({
    resolver: zodResolver(signInSchema),
  })

  const registerForm = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
  })

  const onSignIn = signInForm.handleSubmit(async (data) => {
    try {
      await login(data.email, data.password)
      setStage(null)
    } catch (err) {
      signInForm.setError("email", { message: (err as Error).message })
    }
  })

  const onRegister = registerForm.handleSubmit(async (data) => {
    try {
      await register(data)
      setStage("signin")
    } catch (err) {
      registerForm.setError("root", { message: (err as Error).message })
    }
  })

  return (
    <div className="w-full">
      <Dialog open={stage === "chooser"} onOpenChange={(open) => !open && setStage(null)}>
        <DialogTrigger
          onClick={() => setStage("chooser")}
          className={cn(
            "flex w-full items-center justify-end gap-2 rounded-none border-0 bg-transparent px-0 py-0 text-right text-sm font-medium text-foreground transition-colors hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50",
            "md:justify-self-auto"
          )}
          aria-label="Přihlásit se nebo registrovat"
        >
          <span className="whitespace-nowrap">Přihlásit/registrovat</span>
          <img src={userIcon} alt="" aria-hidden="true" className="h-8 w-8 shrink-0" />
        </DialogTrigger>

        <DialogContent className="sm:max-w-md">
          
          <div className="mt-5 grid gap-3 sm:grid-rows-2">
            <Button type="button" variant="outline" className="w-full bg-chart-3 text-primary-foreground hover:bg-primary hover:text-background" onClick={() => setStage("signin")}>
              Přihlásit se
            </Button>
            <Button type="button" variant="outline" className="w-full bg-chart-3 text-primary-foreground hover:bg-primary hover:text-background" onClick={() => setStage("register")}>
              Registrovat
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={stage === "signin"} onOpenChange={(open) => { if (!open) { setStage(null); signInForm.reset() } }}>
        <DialogContent className="sm:max-w-md">

          <form className="grid gap-4" onSubmit={onSignIn}>
            <FieldSet className="gap-4">
              <Field className="gap-2">
                <FieldLabel htmlFor="signin-email">Email</FieldLabel>
                <Input
                  id="signin-email"
                  type="email"
                  autoComplete="email"
                  aria-invalid={!!signInForm.formState.errors.email}
                  {...signInForm.register("email")}
                />
                {signInForm.formState.errors.email && (
                  <p className="text-sm font-medium text-destructive">{signInForm.formState.errors.email.message}</p>
                )}
              </Field>

              <Field className="gap-2">
                <FieldLabel htmlFor="signin-password">Heslo</FieldLabel>
                <Input
                  id="signin-password"
                  type="password"
                  autoComplete="current-password"
                  aria-invalid={!!signInForm.formState.errors.password}
                  {...signInForm.register("password")}
                />
                {signInForm.formState.errors.password && (
                  <p className="text-sm font-medium text-destructive">{signInForm.formState.errors.password.message}</p>
                )}
              </Field>
            </FieldSet>

            <div className="flex items-center justify-between gap-3">
              <Button type="button" variant="ghost" onClick={() => { setStage("chooser"); signInForm.reset() }}>
                Späť
              </Button>

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

      <Dialog open={stage === "register"} onOpenChange={(open) => { if (!open) { setStage(null); registerForm.reset() } }}>
        <DialogContent className="sm:max-w-lg">

          <form className="grid gap-4" onSubmit={onRegister}>
            <FieldSet className="gap-4">
              <Field className="gap-2">
                <FieldLabel htmlFor="register-first-name">Jméno</FieldLabel>
                <Input
                  id="register-first-name"
                  autoComplete="given-name"
                  aria-invalid={!!registerForm.formState.errors.firstName}
                  {...registerForm.register("firstName")}
                />
                {registerForm.formState.errors.firstName && (
                  <p className="text-sm font-medium text-destructive">{registerForm.formState.errors.firstName.message}</p>
                )}
              </Field>

              <Field className="gap-2">
                <FieldLabel htmlFor="register-last-name">Příjmení</FieldLabel>
                <Input
                  id="register-last-name"
                  autoComplete="family-name"
                  aria-invalid={!!registerForm.formState.errors.lastName}
                  {...registerForm.register("lastName")}
                />
                {registerForm.formState.errors.lastName && (
                  <p className="text-sm font-medium text-destructive">{registerForm.formState.errors.lastName.message}</p>
                )}
              </Field>

              <Field className="gap-2">
                <FieldLabel htmlFor="register-email">Email</FieldLabel>
                <Input
                  id="register-email"
                  type="email"
                  autoComplete="email"
                  aria-invalid={!!registerForm.formState.errors.email}
                  {...registerForm.register("email")}
                />
                {registerForm.formState.errors.email && (
                  <p className="text-sm font-medium text-destructive">{registerForm.formState.errors.email.message}</p>
                )}
              </Field>

              <Field className="gap-2">
                <FieldLabel htmlFor="register-phone">Tel</FieldLabel>
                <Input
                  id="register-phone"
                  type="tel"
                  autoComplete="tel"
                  aria-invalid={!!registerForm.formState.errors.phone}
                  {...registerForm.register("phone")}
                />
                {registerForm.formState.errors.phone && (
                  <p className="text-sm font-medium text-destructive">{registerForm.formState.errors.phone.message}</p>
                )}
              </Field>

              <Field className="gap-2">
                <FieldLabel htmlFor="register-password">Heslo</FieldLabel>
                <Input
                  id="register-password"
                  type="password"
                  autoComplete="new-password"
                  aria-invalid={!!registerForm.formState.errors.password}
                  {...registerForm.register("password")}
                />
                {registerForm.formState.errors.password && (
                  <p className="text-sm font-medium text-destructive">{registerForm.formState.errors.password.message}</p>
                )}
              </Field>

              <Field className="gap-2">
                <FieldLabel htmlFor="register-confirm-password">Potvrď heslo</FieldLabel>
                <Input
                  id="register-confirm-password"
                  type="password"
                  autoComplete="new-password"
                  aria-invalid={!!registerForm.formState.errors.confirmPassword}
                  {...registerForm.register("confirmPassword")}
                />
                {registerForm.formState.errors.confirmPassword && (
                  <p className="text-sm font-medium text-destructive">{registerForm.formState.errors.confirmPassword.message}</p>
                )}
              </Field>
            </FieldSet>
            {registerForm.formState.errors.root && (
              <p className="text-sm font-medium text-destructive">{registerForm.formState.errors.root.message}</p>
            )}

            <div className="flex items-center justify-between gap-3">
              <Button type="button" variant="ghost" onClick={() => { setStage("chooser"); registerForm.reset() }}>
                Zpět
              </Button>

              <Button
                type="submit"
                className="bg-primary text-primary-foreground hover:bg-primary/90"
              >
                Registrovat
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}

export default AuthDialog