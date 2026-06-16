import { eq, and, sql, gte } from "drizzle-orm";

import { db, newsletter, newsletterRecipient, feedback, user } from "../../db";
import { NotFoundError } from "../../errors";
import { brevoService } from "./brevo";
import { mapToNewsletterDTO, mapToNewslettersDTO, mapToFeedbackDTO, mapToFeedbacksDTO } from "./mapper";
import type { NewsletterCreationDTO, NewsletterDTO, NewslettersDTO, FeedbackCreationDTO, FeedbackDTO, FeedbacksDTO } from "./model";

const FEEDBACK_DAILY_LIMIT: number = 5;

function escapeHtml(text: string): string {
  const map: Record<string, string> = {};
  map["&"] = "\x26amp;";
  map["<"] = "\x26lt;";
  map[">"] = "\x26gt;";
  map["\""] = "\x26quot;";
  map["'"] = "\x26#039;";
  return text.replace(/[&<>"']/g, (ch: string): string => map[ch]);
}

export const newsletterService = {
  create: async (employeeId: number, data: NewsletterCreationDTO): Promise<NewsletterDTO> => {
    const [created] = await db
      .insert(newsletter)
      .values({
        employeeId,
        subject: data.subject,
        text: data.text,
      })
      .returning();

    let userIds: number[];
    if (data.recipientUserIds && data.recipientUserIds.length > 0) {
      userIds = data.recipientUserIds;
    } else {
      const allUsers = await db
        .select({ id: user.id })
        .from(user);
      userIds = allUsers.map((u: { id: number }) => u.id);
    }

    if (userIds.length > 0) {
      await db.insert(newsletterRecipient).values(
        userIds.map((userId: number) => ({
          newsletterId: created.id,
          userId,
        }))
      );
    }

    const result = await db.query.newsletter.findFirst({
      where: eq(newsletter.id, created.id),
      with: {
        employee: true,
        recipients: true,
      },
    });

    if (!result) throw new NotFoundError("Newsletter not found after creation");
    return mapToNewsletterDTO(result);
  },

  findAll: async (page: number, pageSize: number): Promise<NewslettersDTO> => {
    const offset = (page - 1) * pageSize;

    const [totalRecords] = await db
      .select({ count: sql<number>`count(*)` })
      .from(newsletter);

    const result = await db
      .select({
        id: newsletter.id,
        employeeId: newsletter.employeeId,
        employeeFirstName: user.firstName,
        employeeLastName: user.lastName,
        createdAt: newsletter.createdAt,
        subject: newsletter.subject,
        text: newsletter.text,
        recipientCount: sql<number>`(SELECT count(*) FROM ${newsletterRecipient} WHERE ${newsletterRecipient.newsletterId} = ${newsletter.id})`,
      })
      .from(newsletter)
      .innerJoin(user, eq(newsletter.employeeId, user.id))
      .limit(pageSize)
      .offset(offset)
      .orderBy(sql`${newsletter.createdAt} DESC`);

    return mapToNewslettersDTO(result, Number(totalRecords.count), page, pageSize);
  },

  findById: async (id: number): Promise<NewsletterDTO> => {
    const result = await db.query.newsletter.findFirst({
      where: eq(newsletter.id, id),
      with: {
        employee: true,
        recipients: {
          with: {
            user: true,
          },
        },
      },
    });

    if (!result) throw new NotFoundError("Newsletter " + id + " not found");
    return mapToNewsletterDTO(result);
  },

  submitFeedback: async (data: FeedbackCreationDTO): Promise<FeedbackDTO> => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const [todayCount] = await db
      .select({ count: sql<number>`count(*)` })
      .from(feedback)
      .where(
        and(
          eq(feedback.userEmail, data.userEmail),
          gte(feedback.createdAt, today)
        )
      );

    if (Number(todayCount.count) >= FEEDBACK_DAILY_LIMIT) {
      throw new NotFoundError("Daily feedback limit reached (max 5 per day per email)");
    }

    const [created] = await db
      .insert(feedback)
      .values({
        userEmail: data.userEmail,
        text: data.text,
      })
      .returning();

    return mapToFeedbackDTO(created);
  },

  findAllFeedbacks: async (page: number, pageSize: number): Promise<FeedbacksDTO> => {
    const offset = (page - 1) * pageSize;

    const [totalRecords] = await db
      .select({ count: sql<number>`count(*)` })
      .from(feedback);

    const result = await db
      .select()
      .from(feedback)
      .limit(pageSize)
      .offset(offset)
      .orderBy(sql`${feedback.createdAt} DESC`);

    return mapToFeedbacksDTO(result, Number(totalRecords.count), page, pageSize);
  },

  syncContactsToBrevo: async (): Promise<{ syncedCount: number }> => {
    const allUsers = await db
      .select({
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
      })
      .from(user);

    let syncedCount: number = 0;
    for (const u of allUsers) {
      try {
        await brevoService.addContact(u.email, {
          FIRSTNAME: u.firstName,
          LASTNAME: u.lastName,
        });
        syncedCount++;
      } catch (err) {
        console.error("Failed to sync contact " + u.email + ":", err);
      }
    }

    return { syncedCount };
  },

  sendCampaign: async (newsletterId: number): Promise<{ campaignId: number }> => {
    const result = await db.query.newsletter.findFirst({
      where: eq(newsletter.id, newsletterId),
      with: {
        employee: true,
      },
    });

    if (!result) throw new NotFoundError("Newsletter " + newsletterId + " not found");

    const escapedSubject: string = escapeHtml(result.subject);
    const escapedText: string = escapeHtml(result.text);
    const htmlLines: string[] = [
      "<!DOCTYPE html>",
      "<html>",
      "<head><meta charset=\"utf-8\"></head>",
      "<body style=\"font-family: Arial, sans-serif; padding: 20px;\">",
      "<h1>" + escapedSubject + "</h1>",
      "<div>" + escapedText.replace(/\n/g, "<br>") + "</div>",
      "<hr>",
      "<p style=\"color: #666; font-size: 12px;\">This email was sent by Library Administration</p>",
      "</body>",
      "</html>",
    ];
    const htmlContent: string = htmlLines.join("\n");

    const campaign = await brevoService.createCampaign(
      "Newsletter #" + newsletterId + " - " + result.subject,
      result.subject,
      htmlContent
    );

    await brevoService.sendCampaign(campaign.id);

    return { campaignId: campaign.id };
  },
};