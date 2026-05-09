export const MOCK_TOKEN_BALANCE = 500;

// Cost per video generation (and per edit-prompt regeneration)
export const TOKEN_COST_PER_VIDEO = 10;

// Maximum products a user can select per generation run (product.md decision)
export const PRODUCT_SELECTION_LIMIT = 10;

// Estimated minutes per video (shown in UI as "~X min")
export const ESTIMATED_MINUTES_PER_VIDEO = 2;

// Demo simulation delay per video in ms (not the real 2 min — compressed for prototype)
export const DEMO_VIDEO_GENERATION_DELAY_MS = 3000;

// Sample video URL used as mock output for all generated videos
export const SAMPLE_VIDEO =
  "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4";
