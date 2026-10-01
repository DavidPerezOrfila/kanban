import type { Board } from "./types";

export function createSampleBoard(): Board {
  const ids = {
    c1: "card-setup-cicd",
    c2: "card-define-api",
    c3: "card-auth-flow",
    c4: "card-db-migration",
    c5: "card-user-profile",
    c6: "card-search",
    c7: "card-notification",
    c8: "card-rate-limit",
    c9: "card-landing-page",
    c10: "card-error-logging",
  };

  return {
    columns: [
      { id: "backlog", title: "Backlog", cardIds: [ids.c1, ids.c2] },
      { id: "todo", title: "To Do", cardIds: [ids.c3, ids.c4] },
      { id: "in-progress", title: "In Progress", cardIds: [ids.c5, ids.c6] },
      { id: "review", title: "Review", cardIds: [ids.c7, ids.c8] },
      { id: "done", title: "Done", cardIds: [ids.c9, ids.c10] },
    ],
    cards: {
      [ids.c1]: {
        id: ids.c1,
        title: "Setup CI/CD pipeline",
        details: "Configure GitHub Actions for automated testing and deployment to staging.",
      },
      [ids.c2]: {
        id: ids.c2,
        title: "Define API schema",
        details: "Draft OpenAPI spec for user management endpoints.",
      },
      [ids.c3]: {
        id: ids.c3,
        title: "Auth flow design",
        details: "Document OAuth2 + PKCE flow for the mobile and web clients.",
      },
      [ids.c4]: {
        id: ids.c4,
        title: "Database migration plan",
        details: "Plan migration from SQLite to PostgreSQL for production.",
      },
      [ids.c5]: {
        id: ids.c5,
        title: "User profile page",
        details: "Build profile page with avatar upload and bio editing.",
      },
      [ids.c6]: {
        id: ids.c6,
        title: "Search functionality",
        details: "Implement full-text search with filtering by date and category.",
      },
      [ids.c7]: {
        id: ids.c7,
        title: "Notification service",
        details: "Review PR for email and push notification delivery service.",
      },
      [ids.c8]: {
        id: ids.c8,
        title: "Rate limiting middleware",
        details: "Review implementation of sliding-window rate limiter for API.",
      },
      [ids.c9]: {
        id: ids.c9,
        title: "Landing page",
        details: "Hero section, feature list, and CTA. Responsive and accessible.",
      },
      [ids.c10]: {
        id: ids.c10,
        title: "Error logging setup",
        details: "Integrated Sentry with source maps and release tracking.",
      },
    },
  };
}
