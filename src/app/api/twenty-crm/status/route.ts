export const dynamic = "force-dynamic";

export async function GET() {
  return Response.json({
    status: "active",
    crm_name: "CRM",
    local_source_path: "data_store.py",
    synced_contacts: 0,
    synced_opportunities: 0,
    active_branches: 5,
    last_sync: "Just now",
  });
}
