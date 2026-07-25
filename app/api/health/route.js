export function GET() {
  return Response.json({
    ok: true,
    service: "Mizan Decision Room",
    timestamp: new Date().toISOString(),
  });
}
