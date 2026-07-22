"""Golden-set case specifications.

Each spec states, up front, what the CV and job must contain and what the
analysis is therefore REQUIRED to conclude. The CV/job prose is generated from
these specs (see generate_cases.py), so the ground truth is true by
construction rather than by opinion — we assert things like "the CV never
mentions Kubernetes, so that requirement must come back `missing` with null
evidence", which is checkable regardless of how the model phrases itself.

Score bands are deliberately wide. We're testing that the model isn't wrong,
not that it agrees with a specific number.
"""

from __future__ import annotations

from dataclasses import dataclass, field
from typing import Literal

Status = Literal["met", "partially-met", "missing"]


@dataclass
class ReqAssertion:
    """A requirement that must appear in the analysis with a given status."""

    match: str  # case-insensitive substring to find the requirement by
    status: Status
    note: str = ""


@dataclass
class CaseSpec:
    id: str
    role: str
    level: str
    band: tuple[int, int]  # acceptable overall_fit_score range
    cv_brief: str
    job_brief: str
    requirements: list[ReqAssertion] = field(default_factory=list)
    # phrases that must NOT show up as claimed experience (fabrication canaries)
    forbidden_claims: list[str] = field(default_factory=list)


SPECS: list[CaseSpec] = [
    # ---------------- Design (weighted) ----------------
    CaseSpec(
        id="design-senior-strong",
        role="Senior Product Designer",
        level="senior",
        band=(75, 100),
        cv_brief="6 years product design in B2B SaaS. Owns end-to-end features: discovery, user flows, wireframes, hi-fi UI. Expert in Figma incl. components/variants and a maintained design system. Runs usability testing and interviews. Works daily with engineers. Mentions WCAG AA accessibility work explicitly.",
        job_brief="Senior Product Designer for B2B SaaS. Must-haves: 4+ years product design; end-to-end ownership; expert Figma incl. design systems; user research and usability testing; close collaboration with engineering. Nice-to-have: accessibility (WCAG).",
        requirements=[
            ReqAssertion("figma", "met"),
            ReqAssertion("research", "met"),
            ReqAssertion("accessib", "met", "CV explicitly names WCAG AA"),
        ],
    ),
    CaseSpec(
        id="design-mid-partial-research",
        role="Product Designer",
        level="mid",
        band=(50, 78),
        cv_brief="3 years UI design at an agency. Strong Figma and visual craft. Lists research TOOLS (Maze, Hotjar) but never describes running a study, a method, or a finding that changed a decision. No accessibility mention at all.",
        job_brief="Product Designer. Must-haves: 3+ years; Figma; hands-on user research and usability testing with described methodology. Nice-to-have: WCAG accessibility.",
        requirements=[
            ReqAssertion("figma", "met"),
            ReqAssertion("research", "partially-met", "tools listed, no methodology or outcome"),
            ReqAssertion("accessib", "missing", "never mentioned"),
        ],
        forbidden_claims=["conducted longitudinal", "WCAG"],
    ),
    CaseSpec(
        id="design-junior-weak",
        role="Junior Designer vs Senior role",
        level="junior",
        band=(0, 45),
        cv_brief="10 months as a junior graphic designer doing social media banners and print flyers. Photoshop and Illustrator only. No product/UX work, no Figma, no research, no engineering collaboration.",
        job_brief="Senior Product Designer. Must-haves: 5+ years product design; expert Figma and design systems; user research; end-to-end product ownership.",
        requirements=[
            ReqAssertion("figma", "missing"),
            ReqAssertion("research", "missing"),
        ],
        forbidden_claims=["Figma", "design system", "product designer"],
    ),
    CaseSpec(
        id="design-career-changer",
        role="Graphic → Product Designer",
        level="mid",
        band=(30, 62),
        cv_brief="5 years graphic design (brand, print, campaigns). In the last year self-taught product design: two personal app case studies in Figma, one usability test with five friends. No professional product design employment.",
        job_brief="Product Designer. Must-haves: 3+ years PROFESSIONAL product design experience; Figma; usability testing; shipping with engineers.",
        requirements=[
            ReqAssertion("figma", "met", "self-taught but genuinely used"),
            ReqAssertion("professional product design", "partially-met", "self-directed, not employed"),
        ],
        forbidden_claims=["3 years professional product design"],
    ),
    CaseSpec(
        id="design-systems-specialist",
        role="Design Systems Designer",
        level="senior",
        band=(70, 100),
        cv_brief="5 years design systems. Built and maintained a multi-brand token-based system used by 6 squads, documented in Storybook, governance process, contribution model. Figma variables and components. Pairs with front-end engineers on implementation.",
        job_brief="Design Systems Designer. Must-haves: proven design system ownership at scale; Figma components/variables; documentation; collaboration with front-end engineering. Nice-to-have: design tokens across brands.",
        requirements=[
            ReqAssertion("design system", "met"),
            ReqAssertion("token", "met"),
        ],
    ),
    CaseSpec(
        id="design-short-cv",
        role="Product Designer (sparse CV)",
        level="mid",
        band=(25, 65),
        cv_brief="A deliberately sparse CV — under 90 words. Job titles, company names and dates only, e.g. 'Product Designer, Acme, 2021-2024'. No bullets, no tools, no achievements, no detail whatsoever.",
        job_brief="Product Designer. Must-haves: 3+ years product design; Figma; user research; design systems.",
        requirements=[
            ReqAssertion("figma", "missing", "sparse CV names no tools"),
            ReqAssertion("research", "missing"),
        ],
        forbidden_claims=["Figma", "usability testing"],
    ),
    CaseSpec(
        id="design-keyword-stuffed",
        role="Keyword-stuffed designer CV",
        level="mid",
        band=(20, 62),
        cv_brief="A CV that lists a huge skills wall — 'Figma, Sketch, UX, UI, design systems, research, accessibility, prototyping, wireframing, user flows' — but every job entry is vague filler like 'worked on various design tasks' with no described outcome, project, or responsibility.",
        job_brief="Product Designer. Must-haves: demonstrated end-to-end product work with described outcomes; Figma; user research with methodology.",
        requirements=[
            ReqAssertion("end-to-end", "partially-met", "claimed via keywords, never evidenced"),
        ],
    ),
    CaseSpec(
        id="design-adjacent-motion",
        role="Motion Designer vs Product Designer",
        level="mid",
        band=(20, 55),
        cv_brief="4 years motion design and video: After Effects, Cinema 4D, brand animation for ad campaigns. Some Figma for storyboards. No product UX, no research, no design systems.",
        job_brief="Product Designer. Must-haves: product design experience; user research; design systems; end-to-end feature ownership. Nice-to-have: motion/interaction design.",
        requirements=[
            ReqAssertion("research", "missing"),
            ReqAssertion("motion", "met", "nice-to-have genuinely satisfied"),
        ],
    ),
    # ---------------- AI / software engineering ----------------
    CaseSpec(
        id="ai-eng-strong",
        role="AI Engineer",
        level="senior",
        band=(75, 100),
        cv_brief="5 years Python backend. Shipped a production RAG service: chunking, embeddings, pgvector, reranking. Built an offline eval harness with an LLM-as-judge. Instruments LLM calls with OpenTelemetry and tracks per-request cost. Docker and CI/CD.",
        job_brief="AI Engineer. Must-haves: 3+ years Python; production services; RAG/retrieval; evaluation of model quality; Docker/CI-CD. Nice-to-have: observability tooling; vector databases.",
        requirements=[
            ReqAssertion("rag", "met"),
            ReqAssertion("eval", "met"),
            ReqAssertion("observability", "met"),
        ],
    ),
    CaseSpec(
        id="ai-eng-sideproject-only",
        role="Backend → AI Engineer",
        level="mid",
        band=(45, 75),
        cv_brief="4 years production Python (FastAPI, PostgreSQL, Docker, CI/CD). LLM exposure is ONE weekend side project that summarises RSS feeds with an open-source model and a vector index. No production LLM work, no evaluation, no observability tooling named.",
        job_brief="AI Engineer. Must-haves: 3+ years Python; production APIs; PostgreSQL; Docker/CI-CD. Nice-to-have: LLM APIs/embeddings/vector DBs; RAG or model evaluation; observability (OpenTelemetry/Langfuse).",
        requirements=[
            ReqAssertion("python", "met"),
            ReqAssertion("llm", "partially-met", "side project only, not production"),
            ReqAssertion("observability", "missing"),
        ],
        forbidden_claims=["production LLM", "evaluation harness"],
    ),
    CaseSpec(
        id="swe-missing-musthave-db",
        role="Backend Engineer (missing a must-have)",
        level="mid",
        band=(35, 70),
        cv_brief="4 years Python and Django. Everything stored in MongoDB — the CV never mentions PostgreSQL, MySQL, or any relational/SQL database. Docker and GitHub Actions are used.",
        job_brief="Backend Engineer. Must-haves: 3+ years Python; production APIs; PostgreSQL or another relational database; Docker/CI-CD.",
        requirements=[
            ReqAssertion("python", "met"),
            ReqAssertion("postgres", "missing", "only MongoDB present — relational DB absent"),
            ReqAssertion("docker", "met"),
        ],
        forbidden_claims=["PostgreSQL", "SQL"],
    ),
    CaseSpec(
        id="swe-overqualified",
        role="Staff Engineer vs mid role",
        level="senior",
        band=(70, 100),
        cv_brief="11 years engineering, currently Staff Engineer. Led platform migrations, mentors teams, deep Python/Go, Kubernetes, distributed systems, on-call ownership.",
        job_brief="Mid-level Backend Engineer. Must-haves: 3+ years Python; REST APIs; SQL database; Docker. Nice-to-have: Kubernetes.",
        requirements=[
            ReqAssertion("python", "met"),
            ReqAssertion("kubernetes", "met"),
        ],
    ),
    CaseSpec(
        id="data-vs-ml",
        role="Data Analyst vs ML Engineer",
        level="mid",
        band=(25, 60),
        cv_brief="4 years data analysis: SQL, Excel, Tableau dashboards, some pandas. No model training, no deployment, no production engineering, no MLOps.",
        job_brief="ML Engineer. Must-haves: training and deploying ML models to production; Python engineering; MLOps/pipelines. Nice-to-have: SQL.",
        requirements=[
            ReqAssertion("sql", "met", "nice-to-have satisfied"),
            ReqAssertion("deploy", "missing"),
        ],
        forbidden_claims=["deployed models", "MLOps"],
    ),
    CaseSpec(
        id="devops-strong",
        role="DevOps Engineer",
        level="senior",
        band=(70, 100),
        cv_brief="6 years infrastructure. Terraform, Kubernetes, AWS, GitHub Actions pipelines, Prometheus/Grafana monitoring, incident response and on-call.",
        job_brief="DevOps Engineer. Must-haves: Kubernetes; infrastructure as code (Terraform); CI/CD; cloud (AWS/GCP); monitoring. Nice-to-have: incident response.",
        requirements=[
            ReqAssertion("kubernetes", "met"),
            ReqAssertion("terraform", "met"),
        ],
    ),
    CaseSpec(
        id="frontend-partial-testing",
        role="Frontend Engineer",
        level="mid",
        band=(45, 80),
        cv_brief="4 years React and TypeScript, Next.js, Tailwind. Testing is mentioned once as 'wrote some tests' with no framework named and no coverage or practice described. No accessibility work.",
        job_brief="Frontend Engineer. Must-haves: React/TypeScript; modern tooling; automated testing practice. Nice-to-have: accessibility (WCAG); Next.js.",
        requirements=[
            ReqAssertion("react", "met"),
            ReqAssertion("test", "partially-met", "vague single mention"),
            ReqAssertion("accessib", "missing"),
        ],
    ),
    # ---------------- Other roles / edge cases ----------------
    CaseSpec(
        id="pm-strong",
        role="Product Manager",
        level="senior",
        band=(70, 100),
        cv_brief="7 years B2B SaaS product management. Owns roadmap and discovery, runs customer interviews, defines success metrics, ships with engineering, has run A/B tests and pricing experiments.",
        job_brief="Senior Product Manager, B2B SaaS. Must-haves: 5+ years PM; discovery and customer research; roadmap ownership; metrics-driven decisions; working with engineering. Nice-to-have: experimentation/AB testing.",
        requirements=[
            ReqAssertion("research", "met"),
            ReqAssertion("metric", "met"),
        ],
    ),
    CaseSpec(
        id="marketing-vs-engineering",
        role="Marketing Manager vs Backend Engineer",
        level="mid",
        band=(0, 30),
        cv_brief="6 years digital marketing: SEO, paid campaigns, email automation, HubSpot, Google Analytics. No programming whatsoever.",
        job_brief="Backend Engineer. Must-haves: 3+ years Python; production APIs; relational databases; Docker.",
        requirements=[
            ReqAssertion("python", "missing"),
        ],
        forbidden_claims=["Python", "API development"],
    ),
    CaseSpec(
        id="employment-gap",
        role="Backend Engineer with a career gap",
        level="mid",
        band=(50, 85),
        cv_brief="4 years Python backend up to 2023, then an explicit 18-month career break for caregiving, now returning. Skills are otherwise a solid match: FastAPI, PostgreSQL, Docker, CI/CD.",
        job_brief="Backend Engineer. Must-haves: 3+ years Python; production APIs; PostgreSQL; Docker/CI-CD.",
        requirements=[
            ReqAssertion("python", "met", "a gap must not erase real experience"),
            ReqAssertion("postgres", "met"),
        ],
    ),
    CaseSpec(
        id="contractor-many-short-roles",
        role="Contract designer, many short engagements",
        level="mid",
        band=(45, 85),
        cv_brief="Freelance product designer, 5 years across nine short client engagements (2-6 months each) — fintech, health, e-commerce. Figma throughout, ran usability tests on three projects, shipped with client engineering teams.",
        job_brief="Product Designer. Must-haves: 3+ years product design; Figma; usability testing; shipping with engineers. Nice-to-have: varied domain experience.",
        requirements=[
            ReqAssertion("figma", "met"),
            ReqAssertion("usability", "met", "short tenures must not erase real work"),
        ],
    ),
    CaseSpec(
        id="non-native-phrasing",
        role="Backend Engineer, non-native English CV",
        level="mid",
        band=(55, 90),
        cv_brief="4 years Python backend, written in slightly non-idiomatic English with minor grammar slips ('I was responsible for develop the API services'). Substance is strong: FastAPI, PostgreSQL, Docker, CI/CD, real metrics.",
        job_brief="Backend Engineer. Must-haves: 3+ years Python; production APIs; PostgreSQL; Docker/CI-CD.",
        requirements=[
            ReqAssertion("python", "met", "phrasing must not be penalised as capability"),
            ReqAssertion("postgres", "met"),
        ],
    ),
]
