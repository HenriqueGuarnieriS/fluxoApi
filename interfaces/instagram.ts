export interface Media {
  id: string;
  time: number;
  type: string;
  post_url: string;
}

export interface Growth {
  "1": number;
  "3": number;
  "7": number;
  "14": number;
  "30": number;
  "60": number;
  "90": number;
  "180": number;
  "365": number;
}

export interface Daily {
  date: string;
  followers: number;
  following: number;
  media: number;
  avg_likes: number;
  avg_comments: number;
}

export interface Statistics {
  total: {
    media: number;
    followers: number;
    following: number;
    engagement_rate: number;
  };
  average: {
    likes: number;
    comments: number;
  };
  growth: {
    followers: Growth;
    media: Growth;
  };
}

export interface Ranks {
  sbrank: number;
  followers: number;
  following: number;
  media: number;
  engagement_rate: number;
}

export interface Misc {
  grade: {
    color: string;
    grade: string;
  };
  sb_verified: boolean;
}

export interface Branding {
  avatar: string;
  website: string;
}

export interface General {
  branding: Branding;
  media: {
    recent: Media[];
  };
}

export interface IdInfo {
  id: string;
  username: string;
  display_name: string;
}

// Interface para o documento do Instagram
export interface InstagramInterface {
  id: IdInfo;
  general: General;
  statistics: Statistics;
  misc: Misc;
  ranks: Ranks;
  daily: Daily[];
}
