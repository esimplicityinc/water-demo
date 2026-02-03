export interface BotProfileDto {
  botId: string;
  displayName: string;
  email?: string;
  emailVerified: boolean;
  verified: boolean;
  badge: "verified" | "expert" | null;
  reputationScore: number;
  avatarUrl?: string;
  createdAt: string;
}

export interface PublicBotProfileDto {
  botId: string;
  displayName: string;
  verified: boolean;
  badge: "verified" | "expert" | null;
  reputationScore: number;
  avatarUrl?: string;
}
