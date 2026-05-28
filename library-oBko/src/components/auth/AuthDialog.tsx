import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogTrigger,
} from "@/components/ui/dialog"
import LoginDialog from "@/components/auth/LoginDialog"
import RegisterDialog from "@/components/auth/RegisterDialog"
import { cn } from "@/lib/utils"
import userIcon from "@/assets/user.svg"
import { useAuth } from "@/context/AuthContext"
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

      <LoginDialog
        isOpen={stage === "signin"}
        onOpenChange={(open) => { if (!open) { setStage(null); signInForm.reset() } }}
        register={signInForm.register}
        errors={signInForm.formState.errors}
        isSubmitting={signInForm.formState.isSubmitting}
        onBack={() => { setStage("chooser"); signInForm.reset() }}
        onSubmit={onSignIn}
      />

      <RegisterDialog
        isOpen={stage === "register"}
        onOpenChange={(open) => { if (!open) { setStage(null); registerForm.reset() } }}
        register={registerForm.register}
        errors={registerForm.formState.errors}
        isSubmitting={registerForm.formState.isSubmitting}
        onBack={() => { setStage("chooser"); registerForm.reset() }}
        onSubmit={onRegister}
      />
    </div>
  )
}

export default AuthDialog