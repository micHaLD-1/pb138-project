import type { NewsletterDTO, NewslettersDTO, FeedbackDTO, FeedbacksDTO } from "./model";

interface NewsletterRow {
  id: number;
  employeeId: number;
  employeeFirstName: string;
  employeeLastName: string;
  createdAt: Date;
  subject: string;
  text: string;
  recipientCount: number;
}

interface NewsletterWithEmployee {
  id: number;
  employeeId: number;
  createdAt: Date;
  subject: string;
  text: string;
  employee: { firstName: string; lastName: string } | null;
  recipients: Array<{ userId: number }>;
}

interface FeedbackRow {
  id: number;
  userEmail: string;
  createdAt: Date;
  text: string;
}

export function mapToNewsletterDTO(row: NewsletterWithEmployee): NewsletterDTO {
  return {
    id: row.id,
    employeeId: row.employeeId,
    employeeName: row.employee ? `${row.employee.firstName} ${row.employee.lastName}` : "Unknown",
    createdAt: row.createdAt.toISOString(),
    subject: row.subject,
    text: row.text,
    recipientCount: row.recipients?.length ?? 0,
  };
}

export function mapToNewsletterDTOFromRaw(row: NewsletterRow): NewsletterDTO {
  return {
    id: row.id,
    employeeId: row.employeeId,
    employeeName: `${row.employeeFirstName} ${row.employeeLastName}`,
    createdAt: row.createdAt.toISOString(),
    subject: row.subject,
    text: row.text,
    recipientCount: Number(row.recipientCount),
  };
}

export function mapToNewslettersDTO(
  rows: NewsletterRow[],
  total: number,
  page: number,
  pageSize: number
): NewslettersDTO {
  return {
    newsletters: rows.map(mapToNewsletterDTOFromRaw),
    page,
    pageSize,
    total,
  };
}

export function mapToFeedbackDTO(row: FeedbackRow): FeedbackDTO {
  return {
    id: row.id,
    userEmail: row.userEmail,
    createdAt: row.createdAt.toISOString(),
    text: row.text,
  };
}

export function mapToFeedbacksDTO(
  rows: FeedbackRow[],
  total: number,
  page: number,
  pageSize: number
): FeedbacksDTO {
  return {
    feedbacks: rows.map(mapToFeedbackDTO),
    page,
    pageSize,
    total,
  };
}