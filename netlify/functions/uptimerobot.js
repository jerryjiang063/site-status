export default async (req) => {
    if (req.method !== "POST") {
      return new Response("Method Not Allowed", { status: 405 });
    }
  
    const apiKey = process.env.UPTIMEROBOT_API_KEY;
    if (!apiKey) {
      return new Response("Missing UPTIMEROBOT_API_KEY", { status: 500 });
    }
  
    let body;
    try {
      body = await req.text();
    } catch {
      body = "";
    }
  
    const params = new URLSearchParams(body);
    params.set("api_key", apiKey); // 强制覆盖，不管前端传啥
  
    const r = await fetch("https://api.uptimerobot.com/v2/getMonitors", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: params.toString(),
    });
  
    const text = await r.text();
    return new Response(text, {
      status: r.status,
      headers: {
        "Content-Type": r.headers.get("content-type") || "application/json",
        "Cache-Control": "no-store",
      },
    });
  };
  