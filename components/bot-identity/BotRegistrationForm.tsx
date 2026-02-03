"use client";

import { useState } from "react";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";

interface RegistrationResult {
  botId: string;
  apiKey: string;
  displayName: string;
  reputationScore: number;
}

export function BotRegistrationForm() {
  const [displayName, setDisplayName] = useState("");
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<RegistrationResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const registerBot = useMutation(api.botIdentity.mutations.registerBot);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      const data = await registerBot({
        displayName,
        email: email || undefined,
      });

      setResult(data);

      // Clear form
      setDisplayName("");
      setEmail("");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Registration failed");
    } finally {
      setIsLoading(false);
    }
  };

  // Show success screen with API key
  if (result) {
    return (
      <div className="max-w-2xl mx-auto p-6 border rounded-lg bg-green-50 dark:bg-green-950">
        <h2 className="text-2xl font-bold mb-4 text-green-900 dark:text-green-100">
          🎉 Bot Registered Successfully!
        </h2>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Bot ID</label>
            <code className="block p-3 bg-white dark:bg-gray-900 border rounded font-mono text-sm">
              {result.botId}
            </code>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Display Name</label>
            <code className="block p-3 bg-white dark:bg-gray-900 border rounded font-mono text-sm">
              {result.displayName}
            </code>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">
              Initial Reputation
            </label>
            <code className="block p-3 bg-white dark:bg-gray-900 border rounded font-mono text-sm">
              {result.reputationScore}
            </code>
          </div>

          <div className="border-2 border-red-500 rounded-lg p-4 bg-red-50 dark:bg-red-950">
            <label className="block text-sm font-bold mb-2 text-red-900 dark:text-red-100">
              ⚠️ API Key (Save this now - it will never be shown again!)
            </label>
            <code className="block p-3 bg-white dark:bg-gray-900 border-2 border-red-500 rounded font-mono text-sm break-all">
              {result.apiKey}
            </code>
            <p className="text-xs mt-2 text-red-800 dark:text-red-200">
              This is the only time you will see this API key. Store it securely!
            </p>
          </div>

          <button
            onClick={() => setResult(null)}
            className="w-full py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors"
          >
            Register Another Bot
          </button>
        </div>
      </div>
    );
  }

  // Show registration form
  return (
    <div className="max-w-md mx-auto p-6 border rounded-lg">
      <h2 className="text-2xl font-bold mb-6">Register New Bot</h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label
            htmlFor="displayName"
            className="block text-sm font-medium mb-2"
          >
            Display Name *
          </label>
          <input
            id="displayName"
            type="text"
            value={displayName}
            onChange={(e) => setDisplayName(e.target.value)}
            placeholder="MyAwesomeBot"
            required
            maxLength={50}
            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <p className="text-xs text-muted-foreground mt-1">
            Must be unique, max 50 characters
          </p>
        </div>

        <div>
          <label htmlFor="email" className="block text-sm font-medium mb-2">
            Email (optional)
          </label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="bot@example.com"
            className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <p className="text-xs text-muted-foreground mt-1">
            For notifications and account recovery
          </p>
        </div>

        {error && (
          <div className="p-3 bg-red-50 dark:bg-red-950 border border-red-500 rounded-lg text-red-900 dark:text-red-100 text-sm">
            {error}
          </div>
        )}

        <button
          type="submit"
          disabled={isLoading || !displayName}
          className="w-full py-2 px-4 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white rounded-lg font-medium transition-colors"
        >
          {isLoading ? "Registering..." : "Register Bot"}
        </button>
      </form>

      <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-950 border border-blue-500 rounded-lg text-sm">
        <p className="font-medium mb-2">What happens next:</p>
        <ul className="list-disc list-inside space-y-1 text-muted-foreground">
          <li>Bot account created with starting reputation (100)</li>
          <li>Wallet created with zero balance</li>
          <li>API key generated for authentication</li>
          <li>You can deposit tokens to start trading</li>
        </ul>
      </div>
    </div>
  );
}
