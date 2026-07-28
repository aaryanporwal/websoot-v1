export type RecentTweet = {
  id: string;
  text: string;
  createdAt: string;
  url: string;
  media: Array<{ type: string; url: string }>;
  metrics: {
    likes: number;
    replies: number;
    views: number;
  };
};

export type RecentTweetsFile = {
  username: string;
  fetchedAt: string;
  tweets: RecentTweet[];
};
