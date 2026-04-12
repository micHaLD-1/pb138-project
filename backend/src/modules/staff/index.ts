import { Elysia } from "elysia";

export const staffModule = new Elysia({ prefix: "/staff" })
  // Book management (in /books module, but staff access)
  // Book copies management
  .post("/copies", () => "Add new book copy")
  .patch("/copies/:id", ({ params: { id } }) => `Update copy ${id} status`)
  .delete("/copies/:id", ({ params: { id } }) => `Remove copy ${id}`)

  // Branch management
  .get("/branches", () => "List all branches")
  .post("/branches", () => "Add new branch")
  .patch("/branches/:id", ({ params: { id } }) => `Update branch ${id}`)

  // Author management
  .get("/authors", () => "List all authors")
  .post("/authors", () => "Add new author")
  .patch("/authors/:id", ({ params: { id } }) => `Update author ${id}`)

  // Genre management
  .get("/genres", () => "List all genres")
  .post("/genres", () => "Add new genre")

  // Publisher management
  .get("/publishers", () => "List all publishers")
  .post("/publishers", () => "Add new publisher")

  // Reservation management
  .delete("/reservations/:id", ({ params: { id } }) => `Cancel reservation ${id} for user`)

  // Fine management
  .patch("/fines/:id", ({ params: { id } }) => `Update fine ${id} (waive/adjust)`)

  // Notifications
  .post("/notifications", () => "Send notification to user")
  .post("/newsletter", () => "Send newsletter to all users")

  // Statistics
  .get("/stats", () => "All statistics")
  .get("/stats/books", () => "Book statistics")
  .get("/stats/loans", () => "Loan statistics");
