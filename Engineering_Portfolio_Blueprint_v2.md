# Automated Engineering Portfolio: Technical Blueprint

This document outlines the strategic and technical plan for building a dual-mode, automated portfolio that showcases projects, pipelines, and open-source contributions directly from GitHub.

## 1. The Core Concept: "Engineering Command Center"
Instead of a static portfolio, the goal is a live dashboard that reflects real-time engineering velocity and architectural thinking.

### The "Perspective Toggle" (Dual-Mode UI)
* **Executive View:** Focused on high-level impact, business value, and system architecture. It uses clean typography and simplified diagrams for leadership audiences.
* **Engineer View (Technical Dashboard):** A "builder-first" aesthetic using a Bento Grid or Terminal/IDE layout. It features monospaced fonts, live system status, and detailed technical metrics.

---

## 2. Automation Strategy: "Zero-Maintenance"
To keep the site updated without manual intervention, the system relies on a "System Design" approach to data:

* **GitHub GraphQL API:** Automatically fetches repository names, languages, commit frequency, and last-push dates.
* **GitHub Topics (Tags):** Triggers UI changes based on repository labels.
    * `status-discovery` -> Displayed in the "Idea/Backlog" section.
    * `status-active` -> Displayed in "In-Flight Pipeline."
    * `status-production` -> Displayed as a "Live Product" with health checks.
* **Incremental Static Regeneration (ISR):** Uses Next.js to update specific project pages in the background whenever a GitHub webhook is triggered by a push.

---

## 3. Advanced Features & Metrics
* **Architecture Visualization:** Utilizing `Mermaid.js` or `React Flow` to render system designs directly from `README.md` files or JSON configs.
* **Clone & Traffic Tracking:** Since GitHub only stores clone data for 14 days, a GitHub Action will be used to "harvest" and store lifetime clone counts for templates (like the Claude Code template) in a central Gist or JSON file.
* **Agentic Integration:** A potential RAG-based chat interface allowing visitors to "query" the codebase (e.g., "How is transaction management handled in this project?").

---

## 4. Conversation Log & Architectural Thinking
This section captures the evolution of ideas during our collaboration:

* **The Portfolio as a "Staff-Level Flex":** We discussed how the portfolio shouldn't just be a list, but a demonstration of seniority. The dual-mode toggle was born from the need to speak to both CTOs (Architecture/Value) and Engineers (Implementation/Logs).
* **Minimizing Friction:** We explored how to avoid manual updates for every repo. The solution was treating GitHub as a CMS, using "Topics" and "Custom Properties" to drive the website's UI automatically.
* **The "Idea Phase" Validation:** We established that pushing "empty" or "discovery" repositories is a valid strategy to showcase a visionary backlog, turning a standard profile into a live roadmap.
* **Data Persistence Challenges:** We tackled the technical limitation of GitHub's 14-day clone data retention. The "Thinking" here shifted from simple API calls to a "Harvesting Action" to ensure long-term metrics for your templates.
* **Aesthetic Identity:** We compared "Executive Clean" vs. "Technical Terminal" looks, ultimately deciding that a modern "Bento Grid" or "IDE" dashboard best represents your work in LLM orchestration and automation.

---

## 5. Implementation Roadmap
1.  **Scaffolding:** Build the Next.js frontend with a global state toggle for "Executive/Engineer" modes.
2.  **The "Gold Standard" Template:** Create a repository template (e.g., `ClaudeTemplate`) that includes a `project-meta.json` for custom metadata that APIs cannot infer.
3.  **Pipeline Setup:** Integrate GitHub Webhooks and Actions to automate the "harvesting" of metrics and the re-validation of site data.
4.  **Ideation Phase:** Immediately push new ideas as repositories with the `status-discovery` tag to showcase a visionary backlog.

---

## 6. Recommended Tech Stack
* **Frontend:** Next.js (App Router), Tailwind CSS, Framer Motion (for view transitions).
* **Visualization:** Mermaid.js, Recharts.
* **Backend/Data:** GitHub GraphQL API, Vercel Edge Functions, GitHub Actions (for cron-based data harvesting).
