export enum UserRole {
    ADMIN = "ADMIN",
    STAFF = "STAFF",
    GUEST = "GUEST",
    MEMBER = "MEMBER"
}

export enum FineStatus {
    ACTIVE = "ACTIVE",
    PAID = "PAID"
}

export enum BookCopyStatus {
    RESERVED = "RESERVED",
    BORROWED = "BORROWED",
    AVAILABLE = "AVAILABLE"
}

export enum LoanStatus {
    ACTIVE = "ACTIVE",
    CANCELED = "CANCELED",
    RETURNED = "RETURNED",
    RETURNED_LATE = "RETURNED_LATE"
}

export enum ReservationStatus {
    ACTIVE = "ACTIVE",
    CANCELED = "CANCELED",
    FULFILLED = "FULFILLED"
}
