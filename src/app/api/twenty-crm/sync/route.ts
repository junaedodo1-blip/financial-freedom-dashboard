export const dynamic = "force-dynamic";

export async function POST() {
  return Response.json({
    status: "success",
    message: "CRM Data Synced",
    synced_count: 0,
  });
}
