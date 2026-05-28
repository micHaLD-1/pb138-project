import { Button } from "@/components/ui/button"
import { Dialog, DialogContent } from "@/components/ui/dialog"
import { Field, FieldLabel, FieldSet } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import type { FormEventHandler } from "react"
import type { FieldErrors, UseFormRegister } from "react-hook-form"

import type { SignInFormData } from "@/lib/schemas"

type LoginDialogProps = {
  isOpen: boolean
  onOpenChange: (open: boolean) => void
  register: UseFormRegister<SignInFormData>
  errors: FieldErrors<SignInFormData>
  isSubmitting: boolean
  onBack: () => void
  onSubmit: FormEventHandler<HTMLFormElement>
}

function LoginDialog({
  isOpen,
  onOpenChange,
  register,
  errors,
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
                type="email"
                autoComplete="email"
                aria-invalid={!!errors.email}
                {...register("email")}
              />
              {errors.email && (
                <p className="text-sm font-medium text-destructive">{errors.email.message}</p>
              )}
            </Field>

            <Field className="gap-2">
              <FieldLabel htmlFor="signin-password">Heslo</FieldLabel>
              <Input
                id="signin-password"
                type="password"
                autoComplete="current-password"
                aria-invalid={!!errors.password}
                {...register("password")}
              />
              {errors.password && (
                <p className="text-sm font-medium text-destructive">{errors.password.message}</p>
              )}
            </Field>
          </FieldSet>

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
