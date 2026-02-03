import { BotAccount } from "@/src/bot-identity/domain/BotAccount";
import { BotId } from "@/src/bot-identity/domain/BotId";
import type { BotProfileDto, PublicBotProfileDto } from "./dto/BotProfileDto";
import {
  DisplayNameUpdated,
  EmailVerified,
  AvatarUpdated,
  AvatarRemoved,
} from "@/src/bot-identity/domain/events";

export interface ProfileRepository {
  findById(botId: BotId): Promise<BotAccount | null>;
  save(bot: BotAccount): Promise<void>;
}

export interface EventPublisher {
  publish(event: unknown): Promise<void>;
}

export interface AvatarStorage {
  upload(file: Buffer, contentType: string, botId: string): Promise<string>;
  delete(url: string): Promise<void>;
}

export interface ProfileService {
  getProfile(botId: BotId): Promise<BotProfileDto | null>;
  getPublicProfile(botId: BotId): Promise<PublicBotProfileDto | null>;
  updateDisplayName(botId: BotId, newDisplayName: string): Promise<void>;
  verifyEmail(botId: BotId, token: string): Promise<void>;
  updateAvatar(botId: BotId, file: Buffer, contentType: string): Promise<string>;
  removeAvatar(botId: BotId): Promise<void>;
}

export class ProfileServiceImpl implements ProfileService {
  constructor(
    private readonly repository: ProfileRepository,
    private readonly eventPublisher: EventPublisher,
    private readonly avatarStorage: AvatarStorage,
  ) {}

  async getProfile(botId: BotId): Promise<BotProfileDto | null> {
    const bot = await this.repository.findById(botId);
    if (!bot) {
      return null;
    }

    const data = bot.toData();
    const badge = bot.getVerificationBadge();

    return {
      botId: data.botId.getValue(),
      displayName: data.displayName,
      email: data.email,
      emailVerified: data.emailVerified,
      verified: data.verificationStatus === "verified",
      badge,
      reputationScore: data.reputationScore.getValue(),
      avatarUrl: data.avatarUrl,
      createdAt: data.createdAt.toISOString(),
    };
  }

  async getPublicProfile(botId: BotId): Promise<PublicBotProfileDto | null> {
    const bot = await this.repository.findById(botId);
    if (!bot) {
      return null;
    }

    const data = bot.toData();
    const badge = bot.getVerificationBadge();

    return {
      botId: data.botId.getValue(),
      displayName: data.displayName,
      verified: data.verificationStatus === "verified",
      badge,
      reputationScore: data.reputationScore.getValue(),
      avatarUrl: data.avatarUrl,
    };
  }

  async updateDisplayName(botId: BotId, newDisplayName: string): Promise<void> {
    const bot = await this.repository.findById(botId);
    if (!bot) {
      throw new Error("Bot not found");
    }

    const oldDisplayName = bot.getDisplayName();
    bot.updateDisplayName(newDisplayName);
    await this.repository.save(bot);

    // Publish domain event
    await this.eventPublisher.publish(
      new DisplayNameUpdated(botId.getValue(), {
        botId: botId.getValue(),
        oldDisplayName,
        newDisplayName,
        updatedAt: new Date().toISOString(),
      }),
    );
  }

  async verifyEmail(botId: BotId, token: string): Promise<void> {
    // In a real implementation, verify the token against stored verification tokens
    // For now, we'll assume the token is valid if it matches our simple validation
    if (!token || token.length < 10) {
      throw new Error("Invalid or expired verification token");
    }

    const bot = await this.repository.findById(botId);
    if (!bot) {
      throw new Error("Bot not found");
    }

    const email = bot.getEmail();
    if (!email) {
      throw new Error("Bot has no email address");
    }

    bot.verifyEmail();
    await this.repository.save(bot);

    // Publish domain event
    await this.eventPublisher.publish(
      new EmailVerified(botId.getValue(), {
        botId: botId.getValue(),
        email,
        verifiedAt: new Date().toISOString(),
      }),
    );
  }

  async updateAvatar(botId: BotId, file: Buffer, contentType: string): Promise<string> {
    // Validate file type
    const allowedTypes = ["image/jpeg", "image/png", "image/gif"];
    if (!allowedTypes.includes(contentType)) {
      throw new Error("Avatar must be an image file (JPG, PNG, GIF)");
    }

    // Validate file size (5MB max)
    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.length > maxSize) {
      throw new Error("Avatar file size must not exceed 5MB");
    }

    const bot = await this.repository.findById(botId);
    if (!bot) {
      throw new Error("Bot not found");
    }

    // Upload to storage
    const avatarUrl = await this.avatarStorage.upload(file, contentType, botId.getValue());

    // Update bot
    bot.updateAvatar(avatarUrl);
    await this.repository.save(bot);

    // Publish domain event
    await this.eventPublisher.publish(
      new AvatarUpdated(botId.getValue(), {
        botId: botId.getValue(),
        avatarUrl,
        updatedAt: new Date().toISOString(),
      }),
    );

    return avatarUrl;
  }

  async removeAvatar(botId: BotId): Promise<void> {
    const bot = await this.repository.findById(botId);
    if (!bot) {
      throw new Error("Bot not found");
    }

    const avatarUrl = bot.getAvatarUrl();
    if (avatarUrl) {
      await this.avatarStorage.delete(avatarUrl);
    }

    bot.removeAvatar();
    await this.repository.save(bot);

    // Publish domain event
    await this.eventPublisher.publish(
      new AvatarRemoved(botId.getValue(), {
        botId: botId.getValue(),
        removedAt: new Date().toISOString(),
      }),
    );
  }
}
