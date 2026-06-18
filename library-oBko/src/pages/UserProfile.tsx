import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Field, FieldLabel, FieldSet } from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import { useAuth } from '@/context/AuthContext'

function UserProfile() {
  const { user, updateUser } = useAuth()
  const [firstName, setFirstName] = useState(user?.firstName ?? '')
  const [lastName, setLastName] = useState(user?.lastName ?? '')
  const [saving, setSaving] = useState(false)
  const [successMessage, setSuccessMessage] = useState<string | null>(null)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  if (!user) {
    return null
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setSaving(true)
    setSuccessMessage(null)
    setErrorMessage(null)

    try {
      await updateUser({ firstName, lastName })
      setSuccessMessage('Profil bol aktualizovaný.')
    } catch (err) {
      setErrorMessage((err as Error).message)
    } finally {
      setSaving(false)
    }
  }

  return (
    <section className="mx-auto w-full max-w-3xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="rounded-xl border bg-card p-6 shadow-sm sm:p-8">
        <div className="mb-6">
          <h1 className="text-3xl font-extrabold">Profil používateľa</h1>
          <p className="mt-2 text-muted-foreground">Upravte svoje údaje a potvrďte zmenu.</p>
        </div>

        <form className="grid gap-5" onSubmit={handleSubmit}>
          <FieldSet className="gap-5">
            <Field className="gap-2">
              <FieldLabel htmlFor="profile-first-name">Krstné meno</FieldLabel>
              <Input
                id="profile-first-name"
                name="firstName"
                value={firstName}
                onChange={(event) => setFirstName(event.target.value)}
                className="h-11"
                required
              />
            </Field>

            <Field className="gap-2">
              <FieldLabel htmlFor="profile-last-name">Priezvisko</FieldLabel>
              <Input
                id="profile-last-name"
                name="lastName"
                value={lastName}
                onChange={(event) => setLastName(event.target.value)}
                className="h-11"
                required
              />
            </Field>

            <Field className="gap-2">
              <FieldLabel htmlFor="profile-email">Email</FieldLabel>
              <Input
                id="profile-email"
                name="email"
                value={user.email}
                readOnly
                className="h-11 bg-muted-foreground/10 text-muted-foreground"
              />
            </Field>
          </FieldSet>

          <div className="flex items-center justify-between gap-3">
            <div>
              {successMessage && (
                <p className="text-sm font-medium text-primary">{successMessage}</p>
              )}
              {errorMessage && (
                <p className="text-sm font-medium text-destructive">{errorMessage}</p>
              )}
            </div>
            <Button type="submit" className="px-6" disabled={saving}>
              {saving ? 'Ukladám…' : 'Potvrdiť'}
            </Button>
          </div>
        </form>
      </div>
    </section>
  )
}

export default UserProfile
