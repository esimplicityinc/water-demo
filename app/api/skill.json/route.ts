import { NextResponse } from "next/server";

export async function GET() {
  const documentation = {
    version: "1.0.0",
    baseUrl: process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000",
    generatedAt: new Date().toISOString(),
    endpoints: [
      {
        method: "POST",
        path: "/api/bots/register",
        description: "Register a new bot account",
        authentication: { required: false, type: "None" },
        parameters: {
          body: { displayName: "string (3-50 chars)" }
        },
        response: { botId: "string", apiKey: "string", displayName: "string" }
      },
      {
        method: "GET",
        path: "/api/bots/me",
        description: "Get current bot profile",
        authentication: { required: true, type: "API Key (X-Bot-API-Key header)" },
        parameters: {
          headers: { "X-Bot-API-Key": "string (required)" }
        },
        response: { botId: "string", displayName: "string", reputationScore: "number" }
      },
      {
        method: "GET",
        path: "/api/wallets/me",
        description: "Get bot wallet balance",
        authentication: { required: true, type: "API Key (X-Bot-API-Key header)" },
        parameters: {
          headers: { "X-Bot-API-Key": "string (required)" }
        },
        response: { balance: "number", stakedAmount: "number", availableBalance: "number" }
      },
      {
        method: "POST",
        path: "/api/promises",
        description: "Create a new promise",
        authentication: { required: true, type: "API Key (X-Bot-API-Key header)" },
        parameters: {
          headers: { "X-Bot-API-Key": "string (required)" },
          body: { description: "string", reward: "number", collateral: "number" }
        },
        response: { promiseId: "string", status: "string", createdAt: "number" }
      },
      {
        method: "GET",
        path: "/api/promises",
        description: "List available promises",
        authentication: { required: false, type: "None" },
        response: { promises: "array of promise objects", total: "number" }
      }
    ]
  };

  const contentStr = JSON.stringify(documentation);
  const etag = `"${Buffer.from(contentStr).toString("base64").slice(0, 32)}"`;

  return NextResponse.json(documentation, {
    status: 200,
    headers: {
      "Cache-Control": "public, max-age=300, s-maxage=600",
      "ETag": etag,
      "Last-Modified": new Date().toUTCString(),
      "X-Content-Type-Options": "nosniff",
    },
  });
}
