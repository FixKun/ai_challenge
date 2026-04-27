# Leaderboard — Approach Report

## Overview

The task was to build an interactive replica of an employee leaderboard page suitable for deployment on GitHub Pages, using no real data from the description.

---

## Tooling and Technology Choices

**Pure vanilla stack (HTML + CSS + JavaScript)**  
No external libraries or frameworks were used. This was a deliberate choice driven by the GitHub Pages deployment target: a self-contained static site with zero build steps, no `npm install`, and no CDN dependencies. The page opens directly in any browser without a server.

**CSS custom properties**  
All colours and shared values are defined as CSS variables in `:root`. This made iterative visual adjustments (background colour, podium palette, hover states) a single-line change rather than a find-and-replace across the stylesheet.

**Vanilla DOM rendering**  
All HTML for the podium and ranked list is generated at runtime by JavaScript functions (`renderPodium`, `renderList`) that receive a pre-filtered, pre-sorted employee array. Re-rendering on any filter change is a full replacement of the relevant DOM sections — simple and correct for this data size.

---

## Data Replacement Strategy

**Employee roster**  
33 employees were invented with:

- Fictional first and last names drawn from a variety of cultural backgrounds.
- Generic but realistic job titles: Senior Software Engineer, QA Engineer, Product Manager, DevOps Engineer, Tech Lead, Scrum Master, Data Analyst, UX Designer, etc.
- Fictional department names: Platform Engineering, Quality Assurance, Infrastructure, Backend Systems, Data & Analytics, Design, etc.

**Activity data**  
Each employee was assigned 3–8 activities. Activity names are generic descriptions of realistic professional contributions (e.g. "Advanced Kubernetes Workshop", "System Design Masterclass"). Dates were spread across 2024–2025 covering all four quarters, ensuring the year and quarter filters are meaningfully exercisable. Points were assigned in the 8–80 range to produce a realistic spread of total scores.

---

## Filter and Sort Logic

All filtering happens client-side on each user interaction:

1. Each filter change or search keystroke calls `render()`.
2. `applyFilters()` iterates over all employees, narrows each employee's activity list to only those matching the active year / quarter / category / name-search combination, sums the remaining points, and discards employees whose filtered total is zero.
3. The result is sorted descending by total points.
4. `renderPodium()` and `renderList()` receive the sorted array and rebuild the DOM.

This means every visible number — podium scores, per-category icon counts, TOTAL in the list, and the activity rows in the expanded panel — always reflects only the currently active filters.

---

## Visual Decisions

- **Avatars**: deterministic colour derived from a character-code hash of the employee's name, paired with two-letter initials. No image files needed, no broken links on GitHub Pages.
- **Category icons**: inline SVG drawn from Feather-icon path data. Each category (Education = graduation cap, Public Speaking = microphone, University Partnership = building columns) has a distinct icon shown both as a count badge on each employee row and as a leading icon inside the category pill in the activity table.
- **Category pills**: gray-only (`#f3f4f6`) with no per-category colour. The icon carries enough visual differentiation.
- **Hover on activity rows**: CSS `transition: background` gives a smooth highlight without JavaScript.
- **Responsive layout**: `flex-wrap` on the filter bar and `@media (max-width: 600px)` overrides collapse the layout gracefully on small screens.

---

## Deployment

The project is four files at the repository root (`index.html`, `style.css`, `script.js`, `README.md`). GitHub Pages can serve it directly from the `main` branch without any build configuration. Deployment steps are documented in `README.md`.
