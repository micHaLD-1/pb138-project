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

type DialogStage = "chooser" | "signin" | "register" | null

function AuthDialog() {
  const [stage, setStage] = useState<DialogStage>(null)

  async function handleSignInSubmit(
    event: React.FormEvent<HTMLFormElement>
  ) {
    event.preventDefault()
  }

  async function handleRegisterSubmit(
    event: React.FormEvent<HTMLFormElement>
  ) {
    event.preventDefault()
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
            <Button type="button" variant="outline" className="w-full" onClick={() => setStage("signin")}>
              Prihlásiť sa
            </Button>
            <Button type="button" variant="outline" className="w-full" onClick={() => setStage("register")}>
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
                <Input id="signin-email" name="email" type="email" autoComplete="email" required />
              </Field>

              <Field className="gap-2">
                <FieldLabel htmlFor="signin-password">Heslo</FieldLabel>
                <Input
                  id="signin-password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  required
                />
              </Field>
            </FieldSet>

            <div className="flex items-center justify-between gap-3">
              <Button type="button" variant="ghost" onClick={() => setStage("chooser")}>
                Späť
              </Button>
              <Button type="submit">Prihlásiť sa</Button>
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
                <Input id="register-first-name" name="firstName" autoComplete="given-name" required />
              </Field>

              <Field className="gap-2">
                <FieldLabel htmlFor="register-last-name">Priezvisko</FieldLabel>
                <Input id="register-last-name" name="lastName" autoComplete="family-name" required />
              </Field>

              <Field className="gap-2">
                <FieldLabel htmlFor="register-email">Email</FieldLabel>
                <Input id="register-email" name="email" type="email" autoComplete="email" required />
              </Field>

              <Field className="gap-2">
                <FieldLabel htmlFor="register-password">Heslo</FieldLabel>
                <Input id="register-password" name="password" type="password" autoComplete="new-password" required />
              </Field>

              <Field className="gap-2">
                <FieldLabel htmlFor="register-confirm-password">Potvrď heslo</FieldLabel>
                <Input
                  id="register-confirm-password"
                  name="confirmPassword"
                  type="password"
                  autoComplete="new-password"
                  required
                />
              </Field>
            </FieldSet>

            <div className="flex items-center justify-between gap-3">
              <Button type="button" variant="ghost" onClick={() => setStage("chooser")}>
                Späť
              </Button>
              <Button type="submit">Registrovať</Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}

export default AuthDialog