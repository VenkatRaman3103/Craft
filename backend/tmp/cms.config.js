import { variable } from "./variable.js";

export const cmsConfig = () => ({
    // Admin Panel / UI Settings
    adminPanel: {
        icon: "default",
        title: "My CMS",
        theme: "light",
        customStyles: "",
        accessControl: true,
    },

    // Collections
    collections: [
        {
            slug: "a",
            name: "a",
            elements: [
                {
                    slug: "1",
                    name: "1",
                    kind: "collections",
                    items: [
                        {
                            slug: "1_1",
                            name: "1_1",
                            elements: [],
                        },

                        {
                            slug: "1_2",
                            name: "1_2",
                            elements: [],
                        },
                    ],
                },

                {
                    slug: "2",
                    name: "2",
                    kind: "collections",
                    items: [
                        {
                            slug: "2_1",
                            name: "2_1",
                            elements: [],
                        },
                    ],
                },
            ],
        },
        { ...variable },
        {
            slug: "b",
            name: "b",
            elements: [
                {
                    slug: "4",
                    name: "4",
                    kind: "collections",
                    items: [
                        {
                            slug: "4_1",
                            name: "4_1",
                            elements: [],
                            admin: function some(data) {
                                console.log(data);
                            },
                        },

                        {
                            slug: "4_2",
                            name: "4_2",
                            elements: [],
                        },
                    ],
                },
                {
                    slug: "5",
                    name: "5",
                    kind: "pages",
                    items: [
                        {
                            slug: "5_1",
                            name: "5_1",
                        },

                        {
                            slug: "5_1",
                            name: "5_1",
                        },
                    ],
                },
            ],
        },

        {
            slug: "d",
            name: "d",
            elements: [],
        },

        {
            slug: "e",
            name: "e",
            elements: [],
        },

        {
            slug: "f",
            name: "f",
            elements: [],
        },

        {
            slug: "g",
            name: "g",
            elements: [],
        },

        {
            slug: "h",
            name: "h",
            elements: [],
        },
        /////////
    ],

    // Database
    database: {
        type: "postgres",
        host: "localhost",
        port: 5432,
        username: "postgres",
        password: "password",
        database: "cms_db",
        synchronize: true,
        urlString: "postgresql://postgres:password@localhost:5432/cms_db",
    },

    // Security & CORS
    cors: ["*"], // allowed origins
    security: {
        jwtSecret: "your-secret-key",
        sessionExpiry: 3600, // seconds
        enableCSRF: true,
        rateLimit: {
            windowMs: 60000,
            max: 100,
        },
    },

    // Singletons / Unique Pages
    singletons: [
        {
            slug: "homepage",
            fields: [
                { name: "heroTitle", type: "string" },
                { name: "heroImage", type: "media" },
            ],
        },
    ],

    // Media & Storage
    media: {
        storage: "local", // "local" | "s3" | "gcs"
        basePath: "/uploads",
        maxFileSizeMB: 10,
        allowedTypes: ["image/png", "image/jpeg", "video/mp4"],
    },

    relations: {
        enableManyToMany: true,
    },

    // TypeScript
    typescript: {
        outputFile: "./types/cms.ts",
        strict: true,
    },

    // GraphQL
    graphQL: {
        schemaOutputFile: "./schema.graphql",
        playground: true,
    },

    // REST API
    rest: {
        baseUrl: "/api",
        enableSwagger: true,
    },

    // Plugins
    plugins: [
        { name: "seo", options: { defaultMetaTitle: "My CMS" } },
        { name: "analytics", options: { trackingId: "UA-12345" } },
    ],

    // Localization / i18n
    i18n: {
        defaultLocale: "en",
        supportedLocales: ["en", "fr", "es"],
        fallback: true,
    },

    // Workflows / Versioning
    workflows: {
        enableDrafts: true,
        enableVersioning: true,
        approvalRequiredRoles: ["editor", "admin"],
    },

    // Audit / Logging
    audit: {
        logChanges: true,
        logFilePath: "./logs/cms.log",
        retentionDays: 30,
    },

    // Global
    globals: {
        siteName: "My CMS",
        defaultTimezone: "UTC",
        enableDebug: false,
    },
});
