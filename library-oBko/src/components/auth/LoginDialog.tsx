import { Button } from "@/components/ui/button"
import { Dialog, DialogContent } from "@/components/ui/dialog"
import { Field, FieldLabel, FieldSet } from "@/components/ui/field"
import { Input } from "@/components/ui/input"

type SignInErrors = {
  email?: string
  password?: string
}

type LoginDialogProps = {
  isOpen: boolean
  onOpenChange: (open: boolean) => void
  signInErrors: SignInErrors
  signInError: string | null
  isSubmitting: boolean
  onBack: () => void
  onSubmit: (event: React.FormEvent<HTMLFormElement>) => void
}

function LoginDialog({
  isOpen,
  onOpenChange,
  signInErrors,
  signInError,
  isSubmitting,
  onBack,
  onSubmit,
}: LoginDialogProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <form className="grid gap-4" onSubmit={onSubmit}>
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

          {signInError && (
            <p className="text-sm font-medium text-destructive">{signInError}</p>
          )}

          <div className="flex items-center justify-between gap-3">
            <Button type="button" variant="ghost" onClick={onBack}>
              Spat
            </Button>

            <Button
              type="submit"
              className="bg-primary text-primary-foreground hover:bg-primary/90"
              disabled={isSubmitting}
            >
              Prihlasit sa
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}

export default LoginDialog
