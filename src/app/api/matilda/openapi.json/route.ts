import { site } from "@/lib/site";

/**
 * Verktygsbeskrivningen för Matilda (OpenAPI 3.1) – klistras in eller länkas i Grok-botens
 * inställningar. Publik: den innehåller inga nycklar, alla anrop kräver Bearer-nyckeln.
 */
export function GET() {
  const base = `${site.url}/api/matilda`;
  const err = { description: "Fel – läs error och följ hint om den finns.", content: { "application/json": { schema: { type: "object", properties: { error: { type: "string" }, hint: { type: "string" } } } } } };
  const spec = {
    openapi: "3.1.0",
    info: { title: "Metilde kundtjänst (Matilda)", version: "1.0.0", description: "Verktyg för Metildes kundtjänstbot. Alla anrop loggas och syns i admin." },
    servers: [{ url: base }],
    components: { securitySchemes: { bearer: { type: "http", scheme: "bearer" } } },
    security: [{ bearer: [] }],
    paths: {
      "/customer": {
        get: {
          operationId: "lookup_customer",
          summary: "Slå upp kund på e-postadress: ordrar, status, spårning och prenumerationer.",
          description: "Använd alltid avsändarens adress från mejlet. Slå aldrig upp en annan adress än den kunden skriver från eller uppger som sin egen.",
          parameters: [{ name: "email", in: "query", required: true, schema: { type: "string", format: "email" } }],
          responses: { "200": { description: "found=true med customer, eller found=false." }, "400": err, "401": err, "403": err },
        },
      },
      "/subscription": {
        post: {
          operationId: "change_subscription",
          summary: "Pausa, återuppta eller avsluta en prenumeration vid periodens slut.",
          description: "Bara när kunden själv har bett om det i mejlet. Prenumerationen måste tillhöra adressen. cancel_period_end = inga fler dragningar, redan betald leverans skickas.",
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  required: ["email", "subscription_id", "command", "reason"],
                  properties: {
                    email: { type: "string", format: "email", description: "Kundens adress (avsändaren)." },
                    subscription_id: { type: "string", description: "subscription_id från lookup_customer (sub_…)." },
                    command: { type: "string", enum: ["pause", "resume", "cancel_period_end"] },
                    reason: { type: "string", description: "Vad kunden bad om, gärna ett kort citat ur mejlet." },
                  },
                },
              },
            },
          },
          responses: { "200": { description: "ok=true och message som beskriver resultatet." }, "400": err, "403": err, "502": err },
        },
      },
      "/email": {
        post: {
          operationId: "send_email",
          summary: "Skicka svar till kunden från support@metilde.com.",
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  required: ["to", "subject", "text"],
                  properties: {
                    to: { type: "string", format: "email" },
                    subject: { type: "string", description: "Oftast \"Re: \" + kundens ämne." },
                    text: { type: "string", description: "Hela svaret i ren text, med hälsning och signatur." },
                    in_reply_to: { type: "string", description: "Message-ID från kundens mejl, så att svaret hamnar i samma tråd." },
                  },
                },
              },
            },
          },
          responses: { "200": { description: "ok=true" }, "400": err, "403": err, "429": err, "502": err },
        },
      },
      "/escalate": {
        post: {
          operationId: "escalate_to_human",
          summary: "Lämna över ärendet till en människa på Metilde.",
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  required: ["subject", "summary"],
                  properties: {
                    email: { type: "string", format: "email" },
                    subject: { type: "string" },
                    summary: { type: "string", description: "Vad ärendet gäller, vad du redan kollat och vad kunden behöver." },
                    customer_message: { type: "string", description: "Kundens mejl i sin helhet." },
                    urgency: { type: "string", enum: ["normal", "high"] },
                  },
                },
              },
            },
          },
          responses: { "200": { description: "ok=true" }, "400": err, "502": err },
        },
      },
    },
  };
  return Response.json(spec, { headers: { "Cache-Control": "public, max-age=300" } });
}
