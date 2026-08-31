export const PLANS = {
  FREE: {
    name: "Free",

    limits: {
      projects: 3,
      chaptersPerProject: 20,

      collaborators: 3,

      storageBytes: 1_000_000_000,
      maxUploadSizeBytes: 5_000_000,

      importsPerDay: 10,
      exportsPerMonth: 3,
    },

    features: {
      richEditor: true,

      comments: true,
      timeline: true,
      fullTextSearch: true,

      snapshots: {
        restore: true,
        export: false,
        retentionDays: 7,
      },

      collaboration: {
        advancedRoles: false,
        translations: false,
      },

      publishing: {
        advancedGuide: false,
        metadataManagement: false,
      },

      assistantAI: {
        enabled: true,
        level: "BASIC",
      },

      support: {
        community: true,
        email: false,
        priority: false,
      },
    },
  },


  PREMIUM: {
    name: "Premium",

    limits: {
      projects: Infinity,
      chaptersPerProject: Infinity,

      collaborators: Infinity,

      storageBytes: 10_000_000_000,
      maxUploadSizeBytes: 25_000_000,

      importsPerDay: 50,
      exportsPerMonth: Infinity,
    },

    features: {
      richEditor: true,

      comments: true,
      timeline: true,
      fullTextSearch: true,

      snapshots: {
        restore: true,
        export: true,
        retentionDays: 90,
      },

      collaboration: {
        advancedRoles: true,
        translations: true,
      },

      publishing: {
        advancedGuide: true,
        metadataManagement: false,
      },

      assistantAI: {
        enabled: true,
        level: "ADVANCED",
      },

      support: {
        community: true,
        email: true,
        priority: false,
      },
    },
  },


  PRO: {
    name: "Pro",

    limits: {
      projects: Infinity,
      chaptersPerProject: Infinity,

      collaborators: Infinity,

      storageBytes: 100_000_000_000,
      maxUploadSizeBytes: 250_000_000,

      importsPerDay: 150,
      exportsPerMonth: Infinity,
    },

    features: {
      richEditor: true,

      comments: true,
      timeline: true,
      fullTextSearch: true,

      snapshots: {
        restore: true,
        export: true,
        retentionDays: 365,
      },

      collaboration: {
        advancedRoles: true,
        customRoles: true,
        translations: true,
      },

      publishing: {
        advancedGuide: true,
        metadataManagement: true,
        prepareForPublishing: true,
      },

      assistantAI: {
        enabled: true,
        level: "ADVANCED",
        customModels: true,
      },

      support: {
        community: true,
        email: true,
        priority: true,
      },
    },
  },
} as const

export type PlanType = keyof typeof PLANS

export type PlanFeaturesName = keyof typeof PLANS[keyof typeof PLANS]["features"]

export type PlanLimits = typeof PLANS[keyof typeof PLANS]["limits"]
export type PlanFeatures = typeof PLANS[keyof typeof PLANS]["features"]
export type PlanCollaborationFeatures = typeof PLANS[keyof typeof PLANS]["features"]["collaboration"]
