import { name } from "drizzle-orm";

export const cmsConfig = () => ({
    // Admin Panel / UI Settings
    adminPanel: {
        icon: "default",
        title: "My CMS",
        theme: "light",
        customStyles: "",
        accessControl: true,
    },

    ///////
    /// groups
    groups: [
        {
<<<<<<< HEAD
            heading: "foo",
            name: "foo",
            description:
                "lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",
            collections: ["collection_1", "collection_2", "collection_3"],
        },
        {
            heading: "Hello world",
            name: "group_name",
||||||| c23d8ed
            heading: "Hello world",
            name: "group_name",
=======
            heading: "foo updated",
            name: "foo",
            description:
                "lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",
            collections: ["collection_1", "collection_2", "collection_3"],
        },
        {
            heading: "bar updated",
            name: "bar",
>>>>>>> groups
            description:
                "lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",
            collections: ["collection_1", "collection_2", "collection_3"],
        },
    ],

    ///////
    // Collections
    collections: [
        {
            slug: "bar",
            name: "collection new",
            description: "collection description",
            elements: [],
        },
        {
            slug: "collection_test",
            name: "collection new",
            description: "collection description",
            elements: [
                {
                    slug: "fields",
                    name: "fields",
                    kind: "fields",
                    items: [
                        {
                            name: "text_field",
                            slug: "text_field",
                            type: "text",
                        },
                    ],
                },
                {
                    slug: "another-pages",
                    name: "another-pages",
                    kind: "pages",
                    items: [
                        {
                            slug: "new_page",
                            name: "new_page",
                            description:
                                "lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",
                            elements: [],
                        },
                    ],
                },
                {
                    slug: "pages",
                    name: "pages",
                    kind: "pages",
                    items: [
                        {
                            slug: "test",
                            name: "test",
                            description:
                                "lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",
                            elements: [],
                        },
                        {
                            slug: "page_1",
                            name: "page 1",
                            description:
                                "lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",
                            elements: [],
                        },
                        {
                            slug: "page_2",
                            name: "page 2",
                            description:
                                "lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",
                            elements: [],
                        },
                        {
                            slug: "page_3",
                            name: "page 3",
                            description:
                                "lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",
                            elements: [],
                        },
                        {
                            slug: "page_4",
                            name: "foo",
                            description:
                                "lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",
                            elements: [],
                        },
                        {
                            slug: "page_5",
                            name: "bar",
                            description:
                                "lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",
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
                            name: "collection 1",
                            elements: [],
                        },
                        {
                            slug: "collection_2",
                            name: "collection 2",
                            elements: [],
                        },
                        {
                            slug: "collection_3",
                            name: "collection 3",
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
