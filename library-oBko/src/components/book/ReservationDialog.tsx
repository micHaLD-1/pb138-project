import { useState, type FormEvent } from 'react'

import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog'
import { Field, FieldLabel, FieldSet } from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import { useAuth } from '@/context/AuthContext'
import { usePostReservations } from '@/gen/hooks/usePostReservations'

type ReservationDialogProps = {
    bookId: number
    bookTitle: string
    availableCopies: number
}

export default function ReservationDialog({ bookId, bookTitle, availableCopies }: ReservationDialogProps) {
    const { user } = useAuth()
    const [open, setOpen] = useState(false)
    const [fromDate, setFromDate] = useState('')
    const [toDate, setToDate] = useState('')
    const [reservationSuccess, setReservationSuccess] = useState(false)
    const [reservationError, setReservationError] = useState<string | null>(null)

    const { mutate: postReservation, isPending: reserving } = usePostReservations({
        mutation: {
            onSuccess: () => {
                setReservationSuccess(true)
            },
            onError: (error) => {
                setReservationError((error as Error).message ?? 'Rezervace selhala')
            },
        },
    })

    async function handleReserve(event: FormEvent<HTMLFormElement>) {
        event.preventDefault()
        if (!user) return

        setReservationError(null)
        postReservation({
            data: {
                userId: user.userId,
                bookId,
                fromDate,
                toDate,
                price: 0,
            },
        })
    }

    function handleOpenChange(nextOpen: boolean) {
        setOpen(nextOpen)

        if (!nextOpen) {
            setFromDate('')
            setToDate('')
            setReservationSuccess(false)
            setReservationError(null)
        }
    }

    return (
        <Dialog open={open} onOpenChange={handleOpenChange}>
            <DialogTrigger
                render={<Button disabled={availableCopies === 0} />}
                title={availableCopies === 0 ? 'Žádné dostupné výtisky' : 'Rezervovat knihu'}
            >
                {availableCopies === 0 ? 'Nedostupné' : 'Rezervovat'}
            </DialogTrigger>

            <DialogContent className="sm:max-w-md">
                {!user ? (
                    <div className="py-4 text-center">
                        <p className="font-medium">Pro rezervaci se musíš přihlásit.</p>
                    </div>
                ) : reservationSuccess ? (
                    <div className="py-4 text-center">
                        <p className="text-lg font-bold text-primary">Rezervace byla úspěšná</p>
                        <p className="mt-2 text-sm text-muted-foreground">
                            Kniha <span className="font-medium">{bookTitle}</span> je rezervovaná od {fromDate} do {toDate}.
                        </p>
                        <Button className="mt-4" onClick={() => setOpen(false)}>
                            Zavřít
                        </Button>
                    </div>
                ) : (
                    <form className="grid gap-4" onSubmit={handleReserve}>
                        <h2 className="text-lg font-bold">Rezervovat: {bookTitle}</h2>

                        <FieldSet className="gap-4">
                            <Field className="gap-2">
                                <FieldLabel htmlFor="res-from">Datum od</FieldLabel>
                                <Input
                                    id="res-from"
                                    type="date"
                                    value={fromDate}
                                    min={new Date().toISOString().split('T')[0]}
                                    onChange={(event) => setFromDate(event.target.value)}
                                    required
                                />
                            </Field>

                            <Field className="gap-2">
                                <FieldLabel htmlFor="res-to">Datum do</FieldLabel>
                                <Input
                                    id="res-to"
                                    type="date"
                                    value={toDate}
                                    min={fromDate || new Date().toISOString().split('T')[0]}
                                    onChange={(event) => setToDate(event.target.value)}
                                    required
                                />
                            </Field>
                        </FieldSet>

                        {reservationError && (
                            <p className="text-sm font-medium text-destructive">{reservationError}</p>
                        )}

                        <div className="flex justify-end gap-2">
                            <Button type="button" variant="ghost" onClick={() => setOpen(false)}>
                                Zrušit
                            </Button>
                            <Button type="submit" disabled={reserving}>
                                {reserving ? 'Rezervuji…' : 'Potvrdit'}
                            </Button>
                        </div>
                    </form>
                )}
            </DialogContent>
        </Dialog>
    )
}
