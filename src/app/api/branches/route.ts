export const dynamic = "force-dynamic";

export async function GET() {
  return Response.json([
    { city: "Toronto", daily_calls: 0 },
    { city: "Vancouver", daily_calls: 0 },
    { city: "Calgary", daily_calls: 0 },
    { city: "Montreal", daily_calls: 0 },
    { city: "Ottawa", daily_calls: 0 },
  ]);
}
