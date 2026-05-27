import { Button } from "@/components/ui/button"
import { Dialog, DialogContent } from "@/components/ui/dialog"
import { Field, FieldLabel, FieldSet } from "@/components/ui/field"
import { Input } from "@/components/ui/input"

type RegisterErrors = {
  firstName?: string
  lastName?: string
  email?: string
  phone?: string
  password?: string
  confirmPassword?: string
}

type RegisterDialogProps = {
  isOpen: boolean
  onOpenChange: (open: boolean) => void
  registerStep: "form" | "verify"
  registerErrors: RegisterErrors
  registerError: string | null
  verificationCode: string
  isSubmitting: boolean
  onBackToChooser: () => void
  onBackToForm: () => void
  onVerificationCodeChange: (value: string) => void
  onSubmitRegister: (event: React.FormEvent<HTMLFormElement>) => void
  onSubmitVerification: (event: React.FormEvent<HTMLFormElement>) => void
}

function RegisterDialog({
  isOpen,
  onOpenChange,
  registerStep,
  registerErrors,
  registerError,
  verificationCode,
  isSubmitting,
  onBackToChooser,
  onBackToForm,
  onVerificationCodeChange,
  onSubmitRegister,
  onSubmitVerification,
}: RegisterDialogProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        {registerStep === "form" ? (
          <form className="grid gap-4" onSubmit={onSubmitRegister}>
            <FieldSet className="gap-4">
              <Field className="gap-2">
                <FieldLabel htmlFor="register-first-name">Jmeno</FieldLabel>
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
                <FieldLabel htmlFor="register-last-name">Prijmeni</FieldLabel>
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
                <FieldLabel htmlFor="register-phone">Telefon</FieldLabel>
                <Input
                  id="register-phone"
                  name="phone"
                  type="tel"
                  autoComplete="tel"
                  required
                  aria-invalid={!!registerErrors.phone}
                />
                {registerErrors.phone && (
                  <p className="text-sm font-medium text-destructive">{registerErrors.phone}</p>
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
                <FieldLabel htmlFor="register-confirm-password">Potvrd heslo</FieldLabel>
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

            {registerError && (
              <p className="text-sm font-medium text-destructive">{registerError}</p>
            )}

            <div className="flex items-center justify-between gap-3">
              <Button type="button" variant="ghost" onClick={onBackToChooser}>
                Zpet
              </Button>

              <Button
                type="submit"
                className="bg-primary text-primary-foreground hover:bg-primary/90"
                disabled={isSubmitting}
              >
                Registrovat
              </Button>
            </div>
          </form>
        ) : (
          <form className="grid gap-4" onSubmit={onSubmitVerification}>
            <FieldSet className="gap-4">
              <Field className="gap-2">
                <FieldLabel htmlFor="register-code">Overovaci kod</FieldLabel>
                <Input
                  id="register-code"
                  name="verificationCode"
                  value={verificationCode}
                  onChange={(event) => onVerificationCodeChange(event.target.value)}
                  autoComplete="one-time-code"
                  required
                />
              </Field>
            </FieldSet>

            {registerError && (
              <p className="text-sm font-medium text-destructive">{registerError}</p>
            )}

            <div className="flex items-center justify-between gap-3">
              <Button type="button" variant="ghost" onClick={onBackToForm}>
                Zpet
              </Button>

              <Button
                type="submit"
                className="bg-primary text-primary-foreground hover:bg-primary/90"
                disabled={isSubmitting}
              >
                Potvrdit
              </Button>
            </div>
          </form>
        )}
      </DialogContent>
    </Dialog>
  )
}

export default RegisterDialog
