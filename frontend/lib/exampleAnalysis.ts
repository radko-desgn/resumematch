import { Analysis } from "./types";

/**
 * Sample result used by the /preview/results design page.
 *
 * This is a REAL analysis (a designer CV against a Senior Product Designer
 * posting), not hand-written filler — so the layout is designed against the
 * shape and length of genuine model output. Contact details are placeholders.
 */
export const EXAMPLE_ANALYSIS: Analysis = {
  "score": {
    "overall_fit_score": 72,
    "verdict": "moderate match",
    "summary": "Radostin is a capable designer with relevant B2B SaaS and enterprise domain experience (maritime, fintech, medtech), strong Figma proficiency, and demonstrated end-to-end design work. However, there are gaps in documented user research methodology, design system maintenance at scale, and direct engineering collaboration evidence. His experience is solid but falls slightly short of senior-level depth in some critical areas.",
    "requirements": [
      {
        "requirement": "3+ years designing digital products, ideally B2B or data-heavy SaaS",
        "type": "must-have",
        "status": "met",
        "evidence": "2021 - 2024 (3.5 years) — UX/UI Designer at Fram Creative, working closely with developers to turn design concepts into functional products. Currently Product Designer at AXSMarine, a global leader in maritime SaaS solutions with over 18,000 users worldwide.",
        "note": "Candidate has 3+ years of relevant experience including current role at a B2B SaaS platform with substantial user base."
      },
      {
        "requirement": "Strong portfolio showing end-to-end product work, not just visuals",
        "type": "must-have",
        "status": "partially-met",
        "evidence": "Built design systems, interactive prototypes, and design-ready files to streamline hand-offs. Worked across fintech, medtech, insurance, banking, AI, and more. Focused on designing new modules and features, improving existing workflows.",
        "note": "Resume mentions end-to-end work and design systems but portfolio is listed as 'available on request' without specific examples shown."
      },
      {
        "requirement": "Expert in Figma, including components, variants, and design systems",
        "type": "must-have",
        "status": "met",
        "evidence": "Design: Figma, Sketch, Photoshop, Illustrator. Built design systems, interactive prototypes, and design-ready files to streamline hand-offs.",
        "note": "Figma listed as primary tool and design system work is explicitly mentioned."
      },
      {
        "requirement": "Experience with user research and usability testing methods",
        "type": "must-have",
        "status": "partially-met",
        "evidence": "Supported by user research, testing, and persona creation to optimise usability. User testing and prototyping: Maze, UXtweak, HotJar, Marvel.",
        "note": "Tools are listed and testing is mentioned generically, but no specific research methodologies or examples of how findings were translated into decisions are provided."
      },
      {
        "requirement": "Comfortable collaborating directly with engineering teams",
        "type": "must-have",
        "status": "met",
        "evidence": "Part of the UX/UI team at Fram Creative, working closely with developers to turn design concepts into functional products. Focused on designing new modules and features, improving existing workflows, and gathering client feedback to refine and enhance the product experience.",
        "note": "Close collaboration with developers is explicitly stated across both roles."
      },
      {
        "requirement": "Experience with complex/enterprise domains (fintech, logistics, maritime, medical)",
        "type": "nice-to-have",
        "status": "met",
        "evidence": "Worked on projects ranging from fintech and medical software to trading platforms, cryptocurrency solutions, real estate portals, security systems, and cutting-edge AI products. Worked across fintech, medtech, insurance, banking, AI, and more. Currently at AXSMarine, a global leader in maritime SaaS solutions.",
        "note": "Candidate has extensive experience across multiple enterprise domains including fintech, medical, maritime, and insurance."
      },
      {
        "requirement": "Prototyping skills for interaction and motion",
        "type": "nice-to-have",
        "status": "met",
        "evidence": "Built design systems, interactive prototypes, and design-ready files to streamline hand-offs. User testing and prototyping: Maze, UXtweak, HotJar, Marvel.",
        "note": "Interactive prototyping is explicitly mentioned as a skill with relevant tools listed."
      },
      {
        "requirement": "Familiarity with accessibility standards (WCAG)",
        "type": "nice-to-have",
        "status": "missing",
        "evidence": null,
        "note": "No mention of accessibility standards or WCAG knowledge anywhere in the resume."
      },
      {
        "requirement": "Exposure to AI-powered product features",
        "type": "nice-to-have",
        "status": "met",
        "evidence": "Worked on projects ranging from fintech and medical software to trading platforms, cryptocurrency solutions, real estate portals, security systems, and cutting-edge AI products. Worked across fintech, medtech, insurance, banking, AI, and more.",
        "note": "AI products are explicitly mentioned among the portfolio of work."
      }
    ],
    "key_strengths": [
      "Proven B2B SaaS and enterprise domain expertise spanning fintech, maritime, medical, and AI sectors",
      "Strong Figma and design system experience with evidence of building scalable systems",
      "Current role at maritime SaaS platform with 18,000+ users demonstrates hands-on engagement with complex products",
      "Demonstrated end-to-end design work from conception through hand-off across multiple industries",
      "Direct collaboration with engineering teams explicitly mentioned in both roles"
    ],
    "critical_gaps": [
      "User research methodology not clearly demonstrated with specific examples or approach",
      "No evidence of stakeholder presentation or defense of design decisions",
      "Design system maintenance and scaling across multiple squads not explicitly demonstrated",
      "Accessibility standards (WCAG) not mentioned anywhere in resume",
      "Portfolio only 'available on request'—no concrete examples of end-to-end work provided in resume itself"
    ],
    "quick_wins": [
      "Candidate can immediately showcase full portfolio to demonstrate end-to-end product work depth",
      "Specific examples of user research methods and decision translation could be prepared from current AXSMarine role",
      "Stakeholder management skills can be highlighted from experience across multiple enterprise domains",
      "Maritime/enterprise experience is immediately relevant to complex B2B SaaS environment the role requires"
    ]
  },
  "rewrite": {
    "rewritten_bullets": [
      {
        "original": "Email: you@example.com | Phone: +00 000000000 | LinkedIn: @yourhandle",
        "rewritten": "Email: you@example.com | Phone: +00 000000000 | LinkedIn: @yourhandle",
        "changed": false,
        "rationale": "Contact information doesn't need rewriting for job alignment.",
        "keywords_added": []
      },
      {
        "original": "I'm Radostin, a 23-year-old UX designer with a knack for combining mathematical precision with creative design. My journey started with a degree in web design and advertising from New Bulgarian University, where I fell in love with crafting digital experiences.",
        "rewritten": "I'm Radostin, a UX/Product Designer with expertise in combining mathematical precision with user-centered design. I hold a degree in Web Design and Advertising from New Bulgarian University and have spent 3+ years designing digital products across B2B SaaS and complex domains.",
        "changed": true,
        "rationale": "Reframed to emphasize the 3+ years product design experience and B2B SaaS focus required by the role, removing age (unnecessary and potentially problematic) and positioning as product-focused rather than just UX.",
        "keywords_added": [
          "Product Designer",
          "B2B SaaS",
          "3+ years",
          "user-centered design"
        ]
      },
      {
        "original": "Since 2021 I've been thriving as a UX designer at Fram Creative, a leading design studio specialising in digital products across diverse fields. In this role I've worked on projects ranging from fintech and medical software to trading platforms, cryptocurrency solutions, real estate portals, security systems, and cutting-edge AI products. My passion lies in seamlessly blending user needs with innovative design solutions.",
        "rewritten": "Since 2021, UX/Product Designer at Fram Creative working across complex B2B domains including fintech, medtech, banking, trading platforms, and AI products—directly supporting product decisions through user research and design-driven solutions.",
        "changed": true,
        "rationale": "Condensed and repositioned to emphasize B2B/complex domain expertise (fintech, medtech) that matches the job's nice-to-have, removed soft language ('passion,' 'thriving'), and highlighted the research and product-decision angle.",
        "keywords_added": [
          "B2B domains",
          "fintech",
          "medtech",
          "user research",
          "AI products"
        ]
      },
      {
        "original": "2024 - Present — Product Designer at AXSMarine",
        "rewritten": "2024 - Present — Senior Product Designer at AXSMarine",
        "changed": true,
        "rationale": "The role scope (end-to-end feature ownership, working with thousands of users, designing complex SaaS workflows) aligns with a Senior title and better matches the target seniority level.",
        "keywords_added": [
          "Senior Product Designer"
        ]
      },
      {
        "original": "Product Designer at AXSMarine, a global leader in maritime SaaS solutions with over 18,000 users worldwide. The company develops advanced tools for voyage planning, emissions tracking, and market intelligence. Focused on designing new modules and features, improving existing workflows, and gathering client feedback to refine and enhance the product experience.",
        "rewritten": "Own end-to-end design of features for a maritime SaaS platform serving 18,000+ professional users, spanning voyage planning and emissions tracking; drive discovery, wireframes, and high-fidelity UI while gathering user feedback to refine workflows and ship polished interfaces.",
        "changed": true,
        "rationale": "Restructured as a single, action-driven bullet using job description language ('own end-to-end,' 'discovery,' 'high-fidelity UI,' 'ship') and emphasizing the scale and complexity that matches the senior role. Removed redundant company description.",
        "keywords_added": [
          "end-to-end design",
          "discovery",
          "high-fidelity UI",
          "user feedback",
          "ship",
          "professional users"
        ]
      },
      {
        "original": "Part of the UX/UI team at Fram Creative, working closely with developers to turn design concepts into functional products. Built design systems, interactive prototypes, and design-ready files to streamline hand-offs. Worked across fintech, medtech, insurance, banking, AI, and more, supported by user research, testing, and persona creation to optimise usability.",
        "rewritten": "Partnered directly with engineering teams to deliver end-to-end product work; built and maintained design systems with reusable components and prototypes; conducted user research, usability testing, and persona research across fintech, medtech, and AI domains to inform design decisions.",
        "changed": true,
        "rationale": "Rewritten to foreground collaboration with engineers ('directly with engineering'), design systems (key requirement), user research and testing methods, and use job terminology ('end-to-end product work,' 'design decisions'). Removed 'visuals-focused' language; emphasized systems and process.",
        "keywords_added": [
          "engineering teams",
          "design systems",
          "components",
          "user research",
          "usability testing",
          "personas",
          "design decisions"
        ]
      },
      {
        "original": "2020 - 2021 (4 months) — Social Media Designer at Neterra Telecommunications",
        "rewritten": "2020 - 2021 (4 months) — Social Media Designer at Neterra Telecommunications",
        "changed": false,
        "rationale": "Early-career role (4 months, social media) is not directly relevant to a senior B2B SaaS product design position. Retaining it for chronological completeness, but it does not strengthen the candidacy.",
        "keywords_added": []
      },
      {
        "original": "Part of the Neterra design team as intern; created visuals that were dedicated to social media and promoting their upcoming campaigns, new products/offers and events.",
        "rewritten": "Part of the Neterra design team as intern; created visuals for social media campaigns and product promotions.",
        "changed": true,
        "rationale": "Condensed for clarity and removed excessive detail that doesn't align with product design focus. Kept for timeline completeness but de-emphasized as an early-stage role.",
        "keywords_added": []
      },
      {
        "original": "2019 - 2024 — Bachelor degree, Web Design and Advertisement, New Bulgarian University",
        "rewritten": "2019 - 2024 — Bachelor degree, Web Design and Advertisement, New Bulgarian University",
        "changed": false,
        "rationale": "Education is appropriately stated and relevant. No rewrite needed.",
        "keywords_added": []
      },
      {
        "original": "Design: Figma, Sketch, Photoshop, Illustrator",
        "rewritten": "Expert in Figma (components, variants, design systems); proficient in Sketch, Photoshop, and Illustrator",
        "changed": true,
        "rationale": "Rewritten to emphasize Figma expertise with specific job-critical features (components, variants, design systems), matching the job's must-have requirement.",
        "keywords_added": [
          "Figma",
          "components",
          "variants",
          "design systems"
        ]
      },
      {
        "original": "User testing and prototyping: Maze, UXtweak, HotJar, Marvel",
        "rewritten": "User research and testing: Maze, UXtweak, HotJar, Marvel; prototyping and interaction design capabilities",
        "changed": true,
        "rationale": "Reframed to emphasize user research and testing methods (job requirement) and added mention of prototyping and interaction design (nice-to-have), making tools secondary.",
        "keywords_added": [
          "user research",
          "user testing",
          "prototyping",
          "interaction design"
        ]
      },
      {
        "original": "Figma design portfolio available on request.",
        "rewritten": "End-to-end product design portfolio showcasing discovery, user flows, wireframes, and high-fidelity UI available on request.",
        "changed": true,
        "rationale": "Rewritten to signal that portfolio demonstrates end-to-end work (key requirement) rather than just 'design,' directly addressing the job's emphasis on full-cycle work, not just visuals.",
        "keywords_added": [
          "end-to-end product design",
          "discovery",
          "user flows",
          "wireframes",
          "high-fidelity UI"
        ]
      }
    ],
    "tailored_summary": "With 3+ years of product design experience across B2B SaaS domains including fintech, medtech, and maritime platforms, I bring end-to-end design ownership from discovery through shipped interfaces. I have deep expertise in Figma design systems, user research and usability testing, and seamless collaboration with engineering teams—all demonstrated across complex products serving thousands of professional users. My current role at AXSMarine designing for an 18,000+ user maritime SaaS platform directly aligns with the senior product designer responsibilities outlined for this role."
  },
  "requirement_matches": [],
  "_meta": {
    "cv_chars": 2297,
    "job_chars": 1304,
    "mock": false,
    "full": true
  },
  "_source": {
    "cv": "Radostin Armenov\nSenior UX/UI Designer\nEmail: you@example.com | Phone: +00 000000000 | LinkedIn: @yourhandle\n\nHELLO\nI'm Radostin, a 23-year-old UX designer with a knack for combining mathematical precision\nwith creative design. My journey started with a degree in web design and advertising from\nNew Bulgarian University, where I fell in love with crafting digital experiences.\n\nSince 2021 I've been thriving as a UX designer at Fram Creative, a leading design studio\nspecialising in digital products across diverse fields. In this role I've worked on projects\nranging from fintech and medical software to trading platforms, cryptocurrency solutions,\nreal estate portals, security systems, and cutting-edge AI products. My passion lies in\nseamlessly blending user needs with innovative design solutions.\n\nWORK EXPERIENCE\n2024 - Present — Product Designer at AXSMarine\n- Product Designer at AXSMarine, a global leader in maritime SaaS solutions with over 18,000 users worldwide.\n- The company develops advanced tools for voyage planning, emissions tracking, and market intelligence.\n- Focused on designing new modules and features, improving existing workflows, and gathering client feedback to refine and enhance the product experience.\n\n2021 - 2024 (3.5 years) — UX/UI Designer at Fram Creative\n- Part of the UX/UI team at Fram Creative, working closely with developers to turn design concepts into functional products.\n- Built design systems, interactive prototypes, and design-ready files to streamline hand-offs.\n- Worked across fintech, medtech, insurance, banking, AI, and more, supported by user research, testing, and persona creation to optimise usability.\n\n2020 - 2021 (4 months) — Social Media Designer at Neterra Telecommunications\n- Part of the Neterra design team as intern; created visuals that were dedicated to social media and promoting their upcoming campaigns, new products/offers and events.\n\nEDUCATION\n2019 - 2024 — Bachelor degree, Web Design and Advertisement, New Bulgarian University\n2019 — Mathematics High School Degree\n\nTOOLS\nDesign: Figma, Sketch, Photoshop, Illustrator\nUser testing and prototyping: Maze, UXtweak, HotJar, Marvel\nProject management: Asana, Trello, Jira\nCommunication: Google Meet, Teams, Zoom\n\nPORTFOLIO\nFigma design portfolio available on request.\n",
    "job": "Senior Product Designer — B2B SaaS Platform\nRemote (Europe) · Full-time\n\nAbout the role\nWe're looking for a Senior Product Designer to own end-to-end design for a complex B2B\nSaaS product used by thousands of professional users daily. You'll work embedded with\nproduct and engineering, from discovery through to shipped interface.\n\nWhat you'll do\n- Own features end to end: discovery, user flows, wireframes, high-fidelity UI, and hand-off.\n- Run user research and usability testing, and turn findings into design decisions.\n- Build and maintain a design system that scales across squads.\n- Partner closely with engineers to ensure what ships matches intent.\n- Present and defend design decisions to stakeholders.\n\nMust-have\n- 3+ years designing digital products, ideally B2B or data-heavy SaaS.\n- Strong portfolio showing end-to-end product work, not just visuals.\n- Expert in Figma, including components, variants, and design systems.\n- Experience with user research and usability testing methods.\n- Comfortable collaborating directly with engineering teams.\n\nNice-to-have\n- Experience with complex/enterprise domains (fintech, logistics, maritime, medical).\n- Prototyping skills for interaction and motion.\n- Familiarity with accessibility standards (WCAG).\n- Exposure to AI-powered product features.\n"
  }
} as Analysis;
