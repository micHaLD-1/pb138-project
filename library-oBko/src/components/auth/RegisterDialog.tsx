import { Button } from "@/components/ui/button"
import { Dialog, DialogContent } from "@/components/ui/dialog"
import { Field, FieldLabel, FieldSet } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import type { FormEventHandler } from "react"
import type { FieldErrors, UseFormRegister } from "react-hook-form"

import type { RegisterFormData } from "@/lib/schemas"

type RegisterDialogProps = {
  isOpen: boolean
  onOpenChange: (open: boolean) => void
  register: UseFormRegister<RegisterFormData>
  errors: FieldErrors<RegisterFormData>
  isSubmitting: boolean
  onBack: () => void
  onSubmit: FormEventHandler<HTMLFormElement>
}

function RegisterDialog({
  isOpen,
  onOpenChange,
  register,
  errors,
  isSubmitting,
  onBack,
  onSubmit,
}: RegisterDialogProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <form className="grid gap-4" onSubmit={onSubmit}>
          <FieldSet className="gap-4">
            <Field className="gap-2">
              <FieldLabel htmlFor="register-first-name">Jmeno</FieldLabel>
              <Input
                id="register-first-name"
                autoComplete="given-name"
                aria-invalid={!!errors.firstName}
                {...register("firstName")}
              />
              {errors.firstName && (
                <p className="text-sm font-medium text-destructive">{errors.firstName.message}</p>
              )}
            </Field>

            <Field className="gap-2">
              <FieldLabel htmlFor="register-last-name">Prijmeni</FieldLabel>
              <Input
                id="register-last-name"
                autoComplete="family-name"
                aria-invalid={!!errors.lastName}
                {...register("lastName")}
              />
              {errors.lastName && (
                <p className="text-sm font-medium text-destructive">{errors.lastName.message}</p>
              )}
            </Field>

            <Field className="gap-2">
              <FieldLabel htmlFor="register-email">Email</FieldLabel>
              <Input
                id="register-email"
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
              <FieldLabel htmlFor="register-phone">Telefon</FieldLabel>
              <Input
                id="register-phone"
                type="tel"
                autoComplete="tel"
                aria-invalid={!!errors.phone}
                {...register("phone")}
              />
              {errors.phone && (
                <p className="text-sm font-medium text-destructive">{errors.phone.message}</p>
              )}
            </Field>

            <Field className="gap-2">
              <FieldLabel htmlFor="register-password">Heslo</FieldLabel>
              <Input
                id="register-password"
                type="password"
                autoComplete="new-password"
                aria-invalid={!!errors.password}
                {...register("password")}
              />
              {errors.password && (
                <p className="text-sm font-medium text-destructive">{errors.password.message}</p>
              )}
            </Field>

            <Field className="gap-2">
              <FieldLabel htmlFor="register-confirm-password">Potvrd heslo</FieldLabel>
              <Input
                id="register-confirm-password"
                type="password"
                autoComplete="new-password"
                aria-invalid={!!errors.confirmPassword}
                {...register("confirmPassword")}
              />
              {errors.confirmPassword && (
                <p className="text-sm font-medium text-destructive">{errors.confirmPassword.message}</p>
              )}
            </Field>
          </FieldSet>

          {errors.root?.message && (
            <p className="text-sm font-medium text-destructive">{errors.root.message}</p>
          )}

          <div className="flex items-center justify-between gap-3">
            <Button type="button" variant="ghost" onClick={onBack}>
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
      </DialogContent>
    </Dialog>
  )
}

export default RegisterDialog
