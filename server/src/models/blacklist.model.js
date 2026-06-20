import mongoose from 'mongoose';

// Using MongoDB for token blacklisting (Redis preferred in production)
const blacklistTokenSchema = new mongoose.Schema(
  {
    token: {
      type: String,
      required: [true, 'Token is required'],
      index: true,
    },
  },
  { timestamps: true }
);

// Auto-expire blacklisted tokens after 24h (matches JWT expiry)
blacklistTokenSchema.index({ createdAt: 1 }, { expireAfterSeconds: 86400 });

const tokenBlacklistModel = mongoose.model('blacklistTokens', blacklistTokenSchema);
export default tokenBlacklistModel;
