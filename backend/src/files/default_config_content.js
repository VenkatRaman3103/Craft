export default cmsConfig({
    // Admin Panel / UI Settings
    adminPanel: {
        icon: "default",
        title: "My CMS",
        theme: "light",
        customStyles: "",
        accessControl: true,
    },

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

    // Content Collections
    collections: [
        {
            slug: "parent",
            name: "parent",
            elements: [
                {
                    slug: "page_1",
                    name: "Page 1",
                    kind: "pages",
                },
                {
                    slug: "collection_1",
                    name: "collection_1",
                    kind: "collections",
                    items: [
                        {
                            slug: "item_1",
                            name: "item 1",
                        },
                        {
                            slug: "item_2",
                            name: "item 2",
                        },
                    ],
                },
                {
                    slug: "block_1",
                    name: "block 1",
                    kind: "blocks",
                },
                {
                    slug: "field_1",
                    name: "field 1",
                    kind: "fields",
                },
                {
                    slug: "variable_1",
                    name: "variable 1",
                    kind: "variables",
                },
                {
                    slug: "media_1",
                    name: "media 1",
                    kind: "media",
                },
            ],
        },
        ///
        // collection,
    ],

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

    // Misc Settings
});
