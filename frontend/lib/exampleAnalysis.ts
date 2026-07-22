import { Analysis } from "./types";

/**
 * Realistic sample result used by the /preview/results design page.
 * Deliberately richer than the demo mock — mixed statuses, a missing
 * requirement with no evidence, and several changed bullets — so the results
 * layout is exercised properly while we design it.
 */
export const EXAMPLE_ANALYSIS: Analysis = {
  score: {
    overall_fit_score: 78,
    verdict: "strong match",
    summary:
      "Four years of production Python and clear API ownership put this candidate above the bar for the must-haves. The gap is depth on production LLM work: retrieval, evaluation, and observability appear only through a side project.",
    requirements: [
      {
        requirement: "3+ years of professional Python software engineering",
        type: "must-have",
        status: "met",
        evidence: "Backend-leaning software engineer with 4 years building and operating Python web services at scale.",
        note: "Exceeds the years-of-Python bar.",
      },
      {
        requirement: "Build and operate web services / APIs in production",
        type: "must-have",
        status: "met",
        evidence: "Designed and shipped a FastAPI service handling 3M requests/day, cutting p95 latency from 850ms to 240ms.",
        note: "Direct production ownership with a measured performance result.",
      },
      {
        requirement: "Solid grasp of PostgreSQL or a comparable relational database",
        type: "must-have",
        status: "met",
        evidence: "Migrated a monolith's reporting module to a service backed by PostgreSQL, improving query times 4x.",
        note: "Hands-on schema and query work, not just usage.",
      },
      {
        requirement: "Comfortable with Docker and CI/CD pipelines",
        type: "must-have",
        status: "met",
        evidence: "Introduced automated deployment with GitHub Actions and Docker, taking releases from weekly to on-demand.",
        note: "Owned the pipeline rather than inheriting it.",
      },
      {
        requirement: "Hands-on with LLM APIs, embeddings, or vector databases",
        type: "nice-to-have",
        status: "partially-met",
        evidence: "Built a side project that summarizes RSS feeds using an open-source LLM and a vector search index.",
        note: "Real exposure, but side-project scale rather than production.",
      },
      {
        requirement: "Familiarity with RAG, prompt engineering, or model evaluation",
        type: "nice-to-have",
        status: "partially-met",
        evidence: "Built a side project that summarizes RSS feeds using an open-source LLM and a vector search index.",
        note: "Retrieval is implied; no evaluation work evidenced.",
      },
      {
        requirement: "Observability tooling (OpenTelemetry, Langfuse, Datadog)",
        type: "nice-to-have",
        status: "missing",
        evidence: null,
        note: "Latency numbers are quoted but no tooling is named.",
      },
      {
        requirement: "Kubernetes experience",
        type: "nice-to-have",
        status: "missing",
        evidence: null,
        note: "Docker is present; orchestration is not mentioned.",
      },
    ],
    key_strengths: [
      "Production Python at real scale — FastAPI service serving 3M requests/day",
      "Owned CI/CD end to end (GitHub Actions, Docker), moving releases weekly → on-demand",
      "Relational depth: PostgreSQL migration with a measured 4x query improvement",
      "Mentoring and code-review ownership — signals seniority beyond the years",
    ],
    critical_gaps: [
      "No production LLM/RAG experience — only a side project",
      "No evaluation harness or model-quality measurement anywhere in the CV",
    ],
    quick_wins: [
      "Reframe the RSS side project as a RAG pipeline and name the vector index",
      "Surface the p95 latency work as observability, and name the tooling used",
      "Add a line on how you validated correctness — it maps to their evaluation work",
    ],
  },
  rewrite: {
    tailored_summary:
      "Backend engineer with 4 years of production Python, API ownership at 3M requests/day, and end-to-end CI/CD — plus hands-on LLM and vector-search work through a self-built RAG project.",
    rewritten_bullets: [
      {
        original: "Developed REST APIs in Python (Flask) backing a B2B analytics dashboard used by 400+ companies.",
        rewritten: "Built production Python (Flask) REST APIs backing a B2B analytics dashboard serving 400+ companies.",
        changed: true,
        rationale: "Surfaces 'production', which the job asks for; no new facts.",
        keywords_added: ["production"],
      },
      {
        original: "Introduced automated deployment with GitHub Actions and Docker, taking releases from weekly to on-demand.",
        rewritten: "Built CI/CD with GitHub Actions and Docker, moving releases from weekly to on-demand.",
        changed: true,
        rationale: "Uses the job's exact term 'CI/CD'.",
        keywords_added: ["CI/CD"],
      },
      {
        original: "Built a small side project that summarizes RSS feeds using an open-source LLM and a vector search index.",
        rewritten: "Built a RAG side project summarizing RSS feeds with an open-source LLM over a vector search index.",
        changed: true,
        rationale: "Names the pattern (RAG) the posting screens for.",
        keywords_added: ["RAG"],
      },
      {
        original: "Mentored two junior engineers and ran the team's weekly code-review rotation.",
        rewritten: "Mentored two junior engineers and ran the team's weekly code-review rotation.",
        changed: false,
        rationale: "Already clear and relevant — left untouched.",
        keywords_added: [],
      },
    ],
  },
  requirement_matches: [],
  _meta: { cv_chars: 1530, job_chars: 1226, mock: true, full: true },
  _source: {
    cv: "Jordan Rivera — Software Engineer (Backend / Platform)\n\nSUMMARY\nBackend-leaning engineer with 4 years building and operating Python web services at scale.\n\nEXPERIENCE\n- Designed and shipped a FastAPI service handling 3M requests/day, cutting p95 latency from 850ms to 240ms.\n- Introduced automated deployment with GitHub Actions and Docker, taking releases from weekly to on-demand.\n- Developed REST APIs in Python (Flask) backing a B2B analytics dashboard used by 400+ companies.\n- Migrated a monolith's reporting module to a service backed by PostgreSQL, improving query times 4x.\n- Built a small side project that summarizes RSS feeds using an open-source LLM and a vector search index.\n- Mentored two junior engineers and ran the team's weekly code-review rotation.\n\nSKILLS\nPython, FastAPI, Flask, PostgreSQL, RabbitMQ, Docker, GitHub Actions, pytest",
    job: "AI Engineer — Applied LLM Platform (Remote, EU)\n\nMust-have\n- 3+ years of professional Python software engineering.\n- Experience building and operating web services / APIs in production.\n- Solid grasp of PostgreSQL or a comparable relational database.\n- Comfortable with Docker and CI/CD pipelines.\n\nNice-to-have\n- Hands-on with LLM APIs, embeddings, or vector databases.\n- Familiarity with RAG, prompt engineering, or model evaluation.\n- Observability tooling (OpenTelemetry, Langfuse). Kubernetes.",
  },
};
