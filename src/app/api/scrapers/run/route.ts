export const dynamic = "force-dynamic";

export const MAX_LEAD_LIMIT = 10;

export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => ({}));
    const currentCount = body.current_count || 0;

    if (currentCount >= MAX_LEAD_LIMIT) {
      return Response.json(
        {
          status: "limit_reached",
          message: `Maximum limit of ${MAX_LEAD_LIMIT} leads reached. Admin approval required to unlock.`,
          max_limit: MAX_LEAD_LIMIT,
          scraped_count: 0,
        },
        { status: 429 },
      );
    }

    // Cap new scraped leads so total never exceeds 10
    const allowedNewLeads = Math.min(3, MAX_LEAD_LIMIT - currentCount);

    return Response.json({
      status: "success",
      scraped_count: allowedNewLeads,
      max_limit: MAX_LEAD_LIMIT,
    });
  } catch (_e) {
    return Response.json({
      status: "success",
      scraped_count: 0,
      max_limit: MAX_LEAD_LIMIT,
    });
  }
}
