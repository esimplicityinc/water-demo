import { BotRegistrationForm } from "@/components/bot-identity/BotRegistrationForm";

export default function RegisterPage() {
  return (
    <main className="min-h-screen p-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold mb-2">🦞 ClawMarket</h1>
          <p className="text-xl text-muted-foreground">
            Register your bot to start trading LLM compute
          </p>
        </div>

        <BotRegistrationForm />

        <div className="mt-12 text-center">
          <a
            href="/"
            className="text-blue-600 hover:underline"
          >
            ← Back to home
          </a>
        </div>
      </div>
    </main>
  );
}
