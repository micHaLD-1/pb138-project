import { useState } from "react"

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
import { useAuth } from '@/context/AuthContext'
import { signInSchema, registerSchema, type SignInFormData, type RegisterFormData } from "@/lib/schemas"

type DialogStage = "chooser" | "signin" | "register" | null

type SignInErrors = Partial<Record<keyof SignInFormData, string>>
type RegisterErrors = Partial<Record<keyof RegisterFormData, string>>

function AuthDialog() {
  const [stage, setStage] = useState<DialogStage>(null)
  const [signInErrors, setSignInErrors] = useState<SignInErrors>({})
  const [signInError, setSignInError] = useState<string | null>(null)
  const [registerErrors, setRegisterErrors] = useState<RegisterErrors>({})
  const [registerError, setRegisterError] = useState<string | null>(null)
  const [isSigningIn, setIsSigningIn] = useState(false)
  const [isRegistering, setIsRegistering] = useState(false)
  const [registerStep, setRegisterStep] = useState<"form" | "verify">("form")
  const [verificationCode, setVerificationCode] = useState("")
  const { login, register } = useAuth()

  async function handleSignInSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setSignInErrors({})
    setSignInError(null)
    
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
    
    try {

      await login(data.email, data.password);
      setStage(null);
    } catch (err) {
      setSignInErrors({ email: (err as Error).message });
    }
  }

  async function handleRegisterSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setRegisterErrors({})
    setRegisterError(null)
    
    const formData = new FormData(event.currentTarget)
    const data = {
      firstName: formData.get("firstName") as string,
      lastName: formData.get("lastName") as string,
      email: formData.get("email") as string,
      phone: formData.get("phone") as string,
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
    
    try {
      await register(data);
      setStage('signin'); // redirect to sign in after register
    } catch (err) {
      setRegisterErrors({ email: (err as Error).message });
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
        onOpenChange={(open) => !open && setStage(null)}
        signInErrors={signInErrors}
        signInError={signInError}
        isSubmitting={isSigningIn}
        onBack={() => setStage("chooser")}
        onSubmit={handleSignInSubmit}
      />

      <RegisterDialog
        isOpen={stage === "register"}
        onOpenChange={(open) => !open && setStage(null)}
        registerStep={registerStep}
        registerErrors={registerErrors}
        registerError={registerError}
        verificationCode={verificationCode}
        isSubmitting={isRegistering}
        onBackToChooser={() => setStage("chooser")}
        onBackToForm={() => setRegisterStep("form")}
        onVerificationCodeChange={setVerificationCode}
        onSubmitRegister={handleRegisterSubmit}
      />
    </div>
  )
}

export default AuthDialog