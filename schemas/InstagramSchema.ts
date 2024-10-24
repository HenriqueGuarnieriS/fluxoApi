import mongoose from "mongoose";

// Esquemas individuais
const mediaSchema = new mongoose.Schema(
  {
    id: String,
    time: Number,
    type: String,
    post_url: String,
  },
  { _id: false }
);

const growthSchema = new mongoose.Schema(
  {
    "1": Number,
    "3": Number,
    "7": Number,
    "14": Number,
    "30": Number,
    "60": Number,
    "90": Number,
    "180": Number,
    "365": Number,
  },
  { _id: false }
);

const dailySchema = new mongoose.Schema(
  {
    date: String,
    followers: Number,
    following: Number,
    media: Number,
    avg_likes: Number,
    avg_comments: Number,
  },
  { _id: false }
);

const statisticsSchema = new mongoose.Schema(
  {
    total: {
      media: Number,
      followers: Number,
      following: Number,
      engagement_rate: Number,
    },
    average: {
      likes: Number,
      comments: Number,
    },
    growth: {
      followers: growthSchema,
      media: growthSchema,
    },
  },
  { _id: false }
);

const ranksSchema = new mongoose.Schema(
  {
    sbrank: Number,
    followers: Number,
    following: Number,
    media: Number,
    engagement_rate: Number,
  },
  { _id: false }
);

const miscSchema = new mongoose.Schema(
  {
    grade: {
      color: String,
      grade: String,
    },
    sb_verified: Boolean,
  },
  { _id: false }
);

const brandingSchema = new mongoose.Schema(
  {
    avatar: String,
    website: String,
  },
  { _id: false }
);

const generalSchema = new mongoose.Schema(
  {
    branding: brandingSchema,
    media: {
      recent: [mediaSchema],
    },
  },
  { _id: false }
);

const idSchema = new mongoose.Schema(
  {
    id: String,
    username: { type: String, unique: true },
    display_name: String,
  },
  { _id: false }
);

// Schema principal
const instagramSchema = new mongoose.Schema({
  id: idSchema,
  general: generalSchema,
  statistics: statisticsSchema,
  misc: miscSchema,
  ranks: ranksSchema,
  daily: [dailySchema],
});

// Exportando o modelo corretamente
const InstagramDoc = mongoose.model("Instagram", instagramSchema);
export default InstagramDoc;
