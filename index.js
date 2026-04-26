export default {
  async fetch(request, env) {

    if (request.method === "OPTIONS") {
      return new Response(null, { headers: cors() });
    }

    try {
      const { message } = await request.json();

      const res = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${env.OPENAI_API_KEY}`
        },
        body: JSON.stringify({
          model: "gpt-4o-mini",
          messages: [
            {
              role: "system",
              content: "You are a cyber assistant in a hacker-style terminal UI. Be short and technical."
            },
            { role: "user", content: message }
          ]
        })
      });

      const data = await res.json();

      return new Response(JSON.stringify({
        result: data.choices?.[0]?.message?.content || "NO RESPONSE"
      }), {
        headers: {
          ...cors(),
          "Content-Type": "application/json"
        }
      });

    } catch (e) {
      return new Response(JSON.stringify({ error: "SERVER ERROR" }), {
        status: 500,
        headers: cors()
      });
    }
  }
};

function cors() {
  return {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type"
  };
}
