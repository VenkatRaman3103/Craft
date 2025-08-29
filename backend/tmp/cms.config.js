export const cmsConfig = () => ({
    // Admin Panel / UI Settings
    adminPanel: {
        icon: "default",
        title: "My CMS",
        theme: "light",
        customStyles: "",
        accessControl: true,
    },

    /////
    // Collections
    collections: [
        {
            slug: "collection_test",
            name: "collection new",
            description: "collection description",
            elements: [
                {
                    slug: "pages",
                    name: "pages",
                    kind: "pages",
                    items: [
                        {
                            slug: "test",
                            name: "test",
                            elements: [],
                        },
                        {
                            slug: "page_1",
                            name: "Page 1",
                            elements: [],
                        },
                        {
                            slug: "page_2",
                            name: "Page 2",
                            elements: [],
                        },
                        {
                            slug: "page_3",
                            name: "Page 3",
                            elements: [],
                        },
                        {
                            slug: "page_4",
                            name: "foo",
                            elements: [],
                        },
                        {
                            slug: "page_5",
                            name: "bar",
                            elements: [],
                        },
                    ],
                },
                {
                    slug: "collections",
                    name: "collections",
                    kind: "collections",
                    items: [
                        {
                            slug: "collection_1",
                            name: "Collection 1",
                            elements: [],
                        },
                        {
                            slug: "collection_2",
                            name: "Collection 2",
                            elements: [],
                        },
                        {
                            slug: "collection_3",
                            name: "Collection 3",
                            elements: [],
                        },
                    ],
                },
            ],
        },
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
