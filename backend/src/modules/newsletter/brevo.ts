const BREVO_API_BASE = "https://api.brevo.com/v3";

function getApiKey(): string {
  return process.env.BREVO_API_KEY || "";
}

function getListId(): number {
  return Number(process.env.BREVO_LIST_ID) || 5;
}

function getSender(): { name: string; email: string } {
  return {
    name: process.env.BREVO_SENDER_NAME || "Library Administration",
    email: process.env.BREVO_SENDER_EMAIL || "noreply@library.com",
  };
}

async function brevoFetch(path: string, options: RequestInit = {}): Promise<any> {
  const apiKey = getApiKey();
  if (!apiKey) {
    throw new Error("BREVO_API_KEY is not configured");
  }

  const response = await fetch(`${BREVO_API_BASE}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      "api-key": apiKey,
      ...(options.headers || {}),
    },
  });

  if (!response.ok) {
    const errorBody = await response.text();
    throw new Error(`Brevo API error (${response.status}): ${errorBody}`);
  }

  if (response.status === 204) {
    return null;
  }

  return response.json();
}

export const brevoService = {
  /**
   * Add or update a contact in a Brevo list
   */
  addContact: async (email: string, attributes: Record<string, string> = {}): Promise<void> => {
    const listId = getListId();
    await brevoFetch("/contacts", {
      method: "POST",
      body: JSON.stringify({
        email,
        attributes,
        listIds: [listId],
        updateEnabled: true,
      }),
    });
  },

  /**
   * Create an email campaign
   */
  createCampaign: async (
    name: string,
    subject: string,
    htmlContent: string
  ): Promise<{ id: number }> => {
    const listId = getListId();
    const sender = getSender();
    return brevoFetch("/emailCampaigns", {
      method: "POST",
      body: JSON.stringify({
        name,
        subject,
        sender,
        recipients: { listIds: [listId] },
        htmlContent,
      }),
    });
  },

  /**
   * Send a campaign immediately
   */
  sendCampaign: async (campaignId: number): Promise<void> => {
    await brevoFetch(`/emailCampaigns/${campaignId}/sendNow`, {
      method: "POST",
    });
  },
};