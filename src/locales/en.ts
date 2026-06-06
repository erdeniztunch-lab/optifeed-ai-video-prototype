const en = {
  common: {
    back: "Back",
    continue: "Continue",
    cancel: "Cancel",
    save: "Save",
    optional: "optional",
    recommended: "Recommended",
    edit: "Edit",
    preview: "Preview",
    all: "All",
    loading: "Loading...",
    required: "*",
    continueArrow: "Continue →",
  },

  nav: {
    dashboard: "Dashboard",
    feedSources: "Feed Sources",
    exports: "Exports",
    aiStudio: "AI Studio",
    aiVideo: "AI Video",
    newVideo: "New Video",
    library: "Library",
    dynamicCreative: "Dynamic Creative",
    analytics: "GA4 Analytics",
    metaAds: "Meta Ads",
    badgeNew: "New",
    badgeSoon: "Coming Soon",
  },

  shell: {
    brand: "Optifeed",
    user: {
      name: "Optifeed User",
      email: "demo@optifeed.com",
    },
    tooNarrow: {
      title: "This feature is only available on desktop.",
      desc: "A minimum screen width of 1280px is required.",
      hint: "Please try again with a wider screen.",
    },
    lang: "EN",
  },

  library: {
    title: "Video Library",
    newCampaign: "New Video",
    search: { placeholder: "Search campaigns..." },
    sort: {
      updatedAt: "Last updated",
      createdAt: "Date created",
      name: "Name",
    },
    tabs: {
      all: "All",
      active: "Active",
      draft: "Draft",
      setup_in_progress: "Processing",
      archived: "Archived",
    },
    empty: {
      title: "No video campaigns yet",
      subtitle: "Create your first campaign to get started.",
      action: "Create First Campaign",
    },
    tabEmpty: {
      title: "No campaigns in this tab",
      desc: "No campaigns found for this filter.",
      action: "Create new campaign",
    },
    newCampaignCard: "New Campaign",
    zap: "Instant",
    stats: {
      videos: "{{count}} videos",
      products: "{{count}} products",
    },
    breadcrumb: { studio: "AI Studio", video: "Video" },
    folder: {
      videos: "{{count}} video",
      products: "{{count}} products",
      pendingCount: "{{count}} pending",
      continue: "Continue",
      setupIncomplete: "Setup incomplete",
      lastUpdated: "Last updated {{date}}",
      moreOptions: "More options",
      newCard: "New Campaign",
      comingSoon: "This feature is coming soon",
      statusLabel: { active: "Live", archived: "Archived", draft: "Draft" },
      statusAria: {
        active: "Live: click to deactivate",
        archived: "Archived",
        draft: "Draft: click to publish",
      },
      menu: {
        rename: "Rename",
        archive: "Archive",
        delete: "Delete",
        detail: "Details",
        export: "Export",
      },
      rename: {
        title: "Rename Campaign",
        placeholder: "Campaign name",
        cancel: "Cancel",
        save: "Save",
      },
      deleteConfirm: {
        title: "Delete campaign?",
        desc: "\"{{name}}\" will be permanently deleted. This action cannot be undone.",
        confirm: "Delete",
        cancel: "Cancel",
      },
    },
  },

  token: {
    unit: "tokens",
    balance: "{{balance}} tokens",
    viewBalance: "View token balance",
  },

  wallet: {
    title: "Token Balance",
    currentBalance: "Current Balance",
    spent: {
      week: "This Week",
      month: "This Month",
      lastAction: "Last Action",
    },
    topUp: "Top Up",
    comingSoon: "Coming Soon",
  },

  select: {
    title: "Select Products",
    subtitle: "Cost and time estimates update based on your selection.",
    libraryBtn: "Library",
    selectedCount: "{{count}} selected",
    selectAll: "Select all (max {{limit}})",
    deselectAll: "Clear selection",
    advancedFilter: "Advanced filters",
    view: { grid: "Grid", list: "List" },
    search: { placeholder: "Product name, ID or group" },
    showing: "{{count}} products shown",
    limitWarning: "You can select up to {{limit}} products. Remove a current selection to add a different product.",
    empty: {
      filtered: {
        title: "No results found",
        desc: "No products match these criteria.",
        action: "Clear filters",
      },
      catalog: {
        title: "Product catalog is empty",
        desc: "No products have been added yet. Update your catalog.",
      },
    },
    headers: { product: "Product", details: "Details" },
  },

  costBar: {
    videos: "{{count}} video",
    tokens: "~{{count}} tokens",
    time: "~{{minutes}} min",
    continueArrow: "Continue →",
    hint: "Select products to continue",
    selected: "{{count}} / {{limit}} products selected",
    atLimit: "Limit reached",
    insufficient: "insufficient balance",
    selectHint: "Select at least one product to continue.",
    trustNote: "Tokens are only deducted when video production begins.",
    cta: "Choose template",
  },

  filters: {
    category: { label: "Category", all: "All categories" },
    brand: { label: "Brand", all: "All brands" },
    imageReadiness: {
      label: "Image readiness",
      all: "All",
      hasExtra: "Has extra images",
      noExtra: "No extra images",
    },
    status: {
      label: "Video status",
      all: "All",
      noVideo: "No video",
      ready: "Ready",
    },
    history: {
      label: "Video history",
      toggle: "Previously generated",
    },
    sort: {
      label: "Sort",
      recent: "Most recent",
      suitable: "Best for video",
      noVideoYet: "No video yet",
      name: "Product name",
    },
    clear: "Clear advanced filters",
  },

  onboarding: {
    title: "Generate video ads from your products in seconds.",
    subtitle: "First select products, then choose a template.",
    howItWorks: "How does it work?",
    understood: "Got it, let's go",
    modal: { title: "How It Works" },
  },

  modal: {
    title: "Define your campaign",
    subtitle: "Enter campaign details before choosing a template.",
    name: {
      label: "Campaign name",
      placeholder: "e.g. Summer Collection 2025",
      error: "Enter at least 3 characters",
    },
    sector: { label: "Sector", placeholder: "Select..." },
    prototypeBadge: "Prototype",
    prototypeTooltip: "This prototype has a sector-specific template for this option.",
    theme: {
      label: "Campaign theme",
      placeholder: "Select...",
      customPlaceholder: "Enter your theme...",
    },
    productType: { label: "Product type", placeholder: "Select..." },
    cancel: "Cancel",
    confirm: "Go to templates →",
  },

  taxonomy: {
    sectors: {
      tekstil: "Fashion & Apparel",
      fashion: "Fashion & Apparel",
      electronics: "Electronics",
      home: "Home & Living",
      beauty: "Beauty & Personal Care",
      sports: "Sports & Outdoor",
      food: "Food & Beverage",
      jewelry: "Jewelry & Accessories",
      other: "Other",
    },
    themes: {
      lifestyle: "Lifestyle",
      minimalist: "Minimalist",
      vibrant: "Vibrant & Colorful",
      elegant: "Elegant & Luxury",
      outdoor: "Outdoor & Nature",
      urban: "Urban & Modern",
      seasonal: "Seasonal",
      other: "Other",
    },
    productTypes: {
      apparel: "Clothing",
      footwear: "Footwear",
      bags: "Bags & Accessories",
      "home-decor": "Home Decor",
      electronics: "Electronics",
      beauty: "Beauty",
      food: "Food",
      sports: "Sports Equipment",
      other: "Other",
    },
  },

  templateSelect: {
    title: "Choose a template",
    subtitle: "Choose the most suitable video scenario for your products.",
    noteLabel: "Additional details",
    notePlaceholder: "e.g. metallic product surface, night scene preferred, targeting women 25-35...",
    infoNote: "Videos are 8-10 seconds in 1:1 format. Price and brand information can be added later via Dynamic Creative.",
    hint: "Select a template to continue",
    empty: {
      title: "No templates found",
      desc: "No video templates available.",
      action: "Go back",
    },
  },

  textileSelect: {
    title: "Choose a scene",
    subtitle: "Each scene is 8-10 seconds and shows the garment from multiple angles.",
    banner: {
      title: "These templates are designed exclusively for the Fashion & Apparel sector.",
      desc: "For best results, make sure you have uploaded front, back, and side photos of your product.",
    },
    noteLabel: "Additional details",
    notePlaceholder: "e.g. metallic product surface, night scene preferred, targeting women 25-35...",
    infoNote: "Videos are 8-10 seconds in 1:1 format. Price and brand information can be added later via Dynamic Creative.",
    hint: "Select a scene to continue",
  },

  card: {
    recommended: "Recommended",
    infoAriaLabel: "More info about {{name}}",
    popover: {
      whenToUse: "When to use",
      strengths: "Strengths",
      avoid: "Note",
      scenarioFlow: "Scenario flow",
      suitableProducts: "Suitable product types",
      accessories: "Accessories",
    },
    preview: "Preview",
    duration: "8-10s",
  },

  templates: {
    "vitrine-bakan-kadin": {
      label: "Window Shopping Woman",
      description: "A realistic lifestyle scene of a model interacting with a product in a city storefront.",
      helperText: "For campaigns that create a store experience feel",
      details: {
        whenToUse: "When you want to show the product in a real-life context. Strong for city-focused, shopping-oriented campaigns.",
        strengths: [
          "Shows the product in a natural use scene",
          "Atmosphere close to shopping behavior",
          "High identification for female audiences",
        ],
        avoid: "Not suitable for campaigns that require technical product details to be prominent.",
      },
    },
    "paris-yuruyen-kadin": {
      label: "Walking Woman in Paris",
      description: "Elegant presentation with a model carrying the product in a premium city atmosphere.",
      helperText: "Ideal for luxury and lifestyle brands",
      details: {
        whenToUse: "For positioning luxury, premium, or lifestyle brands. Strong for travel and fashion campaigns.",
        strengths: [
          "Gives an aspirational and premium feel",
          "Perfect for fashion and accessory products",
          "High-quality visual atmosphere",
        ],
        avoid: "Message may feel inconsistent for affordable or everyday products.",
      },
    },
    "bahce-bulusmasi": {
      label: "Casual Fashion Scene",
      description: "A fashion scene that naturally showcases the product in an everyday living environment.",
      helperText: "For casual and everyday fashion campaigns",
      details: {
        whenToUse: "When you want to showcase casual and everyday fashion products in a natural environment. Suitable for outdoor-themed and summer collection campaigns.",
        strengths: [
          "Natural and warm atmosphere",
          "Product visibility in everyday life context",
          "Ideal for casual and lifestyle fashion campaigns",
        ],
        avoid: "Not suitable for campaigns that require a luxury or premium visual language.",
      },
    },
    "product-spotlight": {
      label: "Product Spotlight",
      description: "A clean and simple fashion presentation scene that puts the product front and center.",
      helperText: "For campaigns that put product detail front and center",
      details: {
        whenToUse: "When you want to showcase a textile or fashion product in a clean and eye-catching way. Strong for catalog and retargeting campaigns.",
        strengths: [
          "Shows product detail clearly and cleanly",
          "Strong for catalog and retargeting campaigns",
          "Clean composition with no distractions",
        ],
        avoid: "Falls short in price-focused or urgency-based campaigns.",
      },
    },
  },

  textileTemplates: {
    "sokakta-yuruyen-kiz": {
      label: "Walking Girl on the Street",
      sceneContext: "Walk along shopping street, window shopping pause",
      sceneType: "Street",
      details: {
        scenarioFlow: "The model starts walking from the end of the shopping street and moves toward the camera. She pauses for 1-2 seconds in front of a storefront, showing the garment from the front and back. She turns to the camera to complete the closing frame.",
        suitableProducts: ["Dress", "Top", "Outerwear", "Suit"],
        accessories: "Optional: brand bag, sunglasses",
      },
    },
    "magaza-onunde-kiz": {
      label: "Girl in Front of the Store",
      sceneContext: "In front of store facade, brand detail focus",
      sceneType: "Store",
      details: {
        scenarioFlow: "The model walks slowly past a store facade with brand lettering. Her small bag comes into frame and garment details stand out. She stops and looks at the camera.",
        suitableProducts: ["Dress", "Combo Set", "Top"],
        accessories: "Brand bag (required scenario element), sunglasses",
      },
    },
    "plajda-yuruyen-kiz": {
      label: "Walking Girl on the Beach",
      sceneContext: "Beach setting, fabric movement and natural light",
      sceneType: "Beach",
      details: {
        scenarioFlow: "The model walks along the shoreline; a light breeze moves the fabric. She stops and turns toward the sun, and the flow and color of the garment become vivid in natural light.",
        suitableProducts: ["Summer Dress", "Pareo", "Beach Wear", "Lightweight Fabrics"],
        accessories: "Optional: sunglasses, hat",
      },
    },
    ziplayanKiz: {
      label: "Jumping Girl",
      sceneContext: "Dynamic movement, fabric texture and energy",
      sceneType: "Dynamic",
      details: {
        scenarioFlow: "The model runs toward the camera and jumps; the movement and texture of the fabric become distinct in this frame. She lands, smiles, and looks at the camera.",
        suitableProducts: ["Casual", "Activewear", "Everyday Wear", "Sports"],
        accessories: "Minimal accessories recommended",
      },
    },
  },

  confirm: {
    title: "Confirm Production",
    subtitle: "Tokens will be deducted from your balance once production begins.",
    productCount: "Products",
    estimatedTime: "Estimated time",
    estimatedTokens: "Estimated tokens",
    timeValue: "~{{minutes}} min",
    tokenValue: "~{{count}}",
    template: {
      label: "Selected template",
      note: "{{count}} products will use this template.",
    },
    aiNote: "AI Video only produces the scene video. Price, brand, and campaign text are added later via Dynamic Creative.",
    balance: {
      current: "Current balance",
      thisRun: "This production",
      remaining: "Estimated remaining",
      tokenSuffix: " tokens",
      minus: "-{{count}} tokens",
      approx: "~{{count}} tokens",
    },
    insufficient: {
      title: "Your balance is insufficient for this production.",
      desc: "{{count}} more tokens needed.",
      tokenAl: "Get tokens",
      toast: "Token purchase is coming soon.",
    },
    notify: {
      label: "Notify me when production is complete",
      desc: "A browser notification will be sent.",
      denied: "Notification permission denied. You can enable it from your browser settings.",
      unsupported: "Your browser does not support notifications.",
    },
    start: "Start Production",
  },

  generate: {
    title: {
      generating: "Generating Videos",
      reviewing: "Review",
    },
    subtitle: "Videos are generated one by one. You can review each one as it completes.",
    confidence: "Generated videos remain here during this session for your review. No video is sent to any channel without your approval.",
    progress: "{{completed}} / {{total}} complete",
    tokensSpent: "{{count}} tokens spent",
    card: {
      generating: "Generating...",
      approve: "Approve",
      reject: "Reject",
      revert: "Undo approval",
      preview: "Preview",
      editPrompt: "Edit prompt",
      regenerate: "Regenerate",
      approved: "Approved",
      rejected: "Rejected",
    },
    footer: {
      approved: "{{count}} approved / {{total}} total",
      none: "Approve at least 1 video to export",
    },
    exportBtn: "Export →",
    previewModal: { close: "Close" },
  },

  editPrompt: {
    title: "Edit Prompt",
    regenerate: "Regenerate",
    cancel: "Cancel",
    fields: {
      sector: "Sector",
      theme: "Theme",
      background: "Background",
      productType: "Product Type",
      note: "Additional note",
    },
  },

  export: {
    title: "Send to Channels",
    subtitle: "Send approved videos to connected catalog channels. Use the ZIP option below to continue without selecting a channel.",
    approved: "{{count}} video approved",
    channel: {
      send: "Send",
      notConnected: "Not connected",
      connect: "Connect",
      comingSoon: "{{name}}: Coming soon",
      selectToSend: "Select channels to export",
    },
    zip: {
      label: "Bulk download (ZIP)",
      desc: "Simulates a demo download flow for {{count}} videos.",
      badge: "Demo",
      toast: "Download simulated in demo mode.",
    },
    skip: "Skip (save as draft)",
    send: "Send →",
    sending: "Sending...",
  },

  success: {
    title: "Videos exported successfully",
    subtitle: "{{count}} products now have video content",
    summary: {
      videosLabel: "Video",
      channelLabel: "Channel",
      spentLabel: "Spent",
      videoCount: "{{count}} videos",
      tokenCount: "{{count}} tokens",
      channelDraft: "Draft",
    },
    firstCampaign: "This is your first video campaign! You can always review it again from the Library.",
    newVideo: "Create New Video",
    campaigns: "Go to My Campaigns",
  },

  howItWorks: {
    tabs: { beforeAfter: "Before / After", steps: "3 Steps", faq: "FAQ" },
    beforeAfter: {
      static: "Static image",
      before: "Before",
      video: "Video ad",
      after: "After",
      desc: "Your static catalog transforms into performance-driven video ads.",
    },
    steps: [
      { title: "Select products", desc: "Choose the products you want to generate videos for from your catalog." },
      { title: "Choose a template", desc: "Pick a scenario and add extra details if needed." },
      { title: "Generate and review", desc: "Approve videos, then send to ad channels." },
    ],
    faq: [
      { q: "What are tokens?", a: "1 token ≈ 30 seconds of video production. Your balance is visible in the wallet." },
      { q: "What if I don't like them?", a: "Each video is approved individually. You can regenerate or reject ones you don't like." },
      { q: "Which channels can I send to?", a: "In the current version, Meta, Google Merchant, and TikTok Catalog are supported." },
      { q: "Is one image enough?", a: "It's possible, but multiple images improve video quality." },
    ],
    close: "Close",
  },

  product: {
    history: {
      badge: "Previously generated",
      compact: "{{count}}× history",
      tooltip: {
        date: "Last generated: {{date}}",
        campaign: "Campaign: {{name}}",
        note: "Selecting this product again will start a new video production.",
      },
    },
    status: {
      "no-video": "No Video",
      ready: "Ready",
      generating: "Generating",
      pending_review: "Pending Review",
      approved: "Approved",
      rejected: "Rejected",
      failed: "Failed",
      draft: "Draft",
      live: "Live",
    },
  },

  placeholder: {
    dashboard: "You will be able to track your campaign performance and key metrics here.",
    feedSources: "Manage your product feed sources and add new ones.",
    exports: "View your exported feeds and download history.",
    dynamicCreative: "Create and manage your dynamic creative templates.",
    analytics: "View your Google Analytics 4 data directly from this screen.",
    metaAds: "Manage your Meta ad campaigns and monitor performance.",
  },
} as const;

export type Translations = typeof en;
export default en;
