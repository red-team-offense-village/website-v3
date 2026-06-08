# Red Team Village Website

This repository contains the official frontend for the [Red Team Village](https://redteamvillage.io) organization. The site is built using **Astro v6+**, **Tailwind CSS v4+**, and **TypeScript** which allows for extended functionality with [Islands](https://docs.astro.build/en/concepts/islands/). Astro also optimizes all images to ensure they use only the space needed.

---

## Local Development

To run and test changes locally, ensure you have **Node.js (>=22.12.0)** installed on your machine.

1. **Install Node dependencies:**

```sh
npm install
```

2. **Launch the local development server:**

```sh
npm run dev
```

The local development server will fire up at [http://localhost:4321/](http://localhost:4321/). It supports hot-module reloading (HMR), meaning the webpage will auto-update live on your screen whenever changes are detected on your local disk.

3. **Validate production builds:**

```sh
npm run build
```

> [!NOTE]
> Because the site uses strict type-safe schemas, if there are typos or missing fields inside any of the data files, the build step will throw an explicit compilation error instead of quietly pushing broken pages to production.

---

## Git Hooks & Formatting

We utilize Git hooks via **Husky** to keep our codebase clean, consistent, and secure. These automated validations run during your normal Git workflow to ensure that:

- Code formatting is checked and fixed automatically.
- No secrets or credentials are accidentally exposed (via **Gitleaks**).
- Direct commits or pushes to the protected `main` branch are blocked.

### Local Setup

Because Husky is integrated directly into our Node lifecycle, there are no extra frameworks to install manually.

1. **Install dependencies:** Simply run the standard installation command in the root directory:

```sh
   npm install
```

> [!NOTE]
> This automatically triggers Husky to wire up the local hooks via the `prepare` script.

### Manual Formatting Shortcuts

If you want to quickly check or fix your code formatting without running a full Git commit/push cycle, you can invoke Prettier directly:

- **Check files for formatting issues without making changes:**

```sh
  npx prettier --check .
```

- **Automatically fix code formatting across the project:**

```sh
  npx prettier --write .
```

---

## Project Directory Structure

```text
├── src/
│   ├── assets/           # HIGH PERFORMANCE ASSETS (Astro re-formats images to optimized WebP/AVIF)
│   │   └── images/       # Sub-folders: episodes/, events/, overflow/, sponsors/, updates/, team/
│   ├── components/       # Globally shared reusable UI layout nodes (Nav, Banner, Footer)
│   ├── data/             # Structured backend tracking JSON configuration modules
│   ├── layouts/          # Master HTML page wrapping architectures (BaseLayout)
│   ├── pages/            # File-based application router files (.astro pages translate directly to URLs)
│   └── content.config.ts # Core Zod Validation Schemas (The build guardrails engine)
├── public/               # Raw unchanged static data blocks (favicon.ico, favicon.svg only)
└── package.json          # Dependency configuration profiles
```

---

## Content Contributor Guidelines

Our pages pull data dynamically from the `src/data/` folder via Astro's Content Layer API. **If you break the data shapes defined in `src/content.config.ts`, the development server will throw a descriptive validation error.**

---

### 1. Homepage "Latest Updates"

- **Data Path:** `src/data/updates.json`
- **Media Assets Path:** `src/assets/images/updates/`

```json
[
  {
    "title": "RTV CRON Workshop Call for Workshops",
    "date": "March 10, 2025",
    "content": "We're looking for speakers for our series! Submissions are open on Sessionize.",
    "tag": ["RTV CRON", "Call for Workshops"],
    "image": {
      "src": "RTVcron-cfw.png",
      "alt": "Red Team Village Call for Workshops banner graphic"
    },
    "url": {
      "href": "https://sessionize.com/rtv-cron/",
      "text": "Answer the Call!",
      "target": "_blank"
    }
  }
]
```

- **`tag`**: Flexible parameter. Accepts a single string (`"tag": "News"`) or an array of strings (`["CTF", "Live"]`). The schema automatically normalizes everything into an array.
- **`image.src`**: Type only the filename. Drop the matching graphic file directly into `src/assets/images/updates/`.
- **`url.target`**: Use `"_blank"` for external tabs. The layout will automatically apply secure relational tags (`rel="noopener noreferrer"`).

---

### 2. Team Page

- **Data Path:** `src/data/team.json`
- **Media Assets Path:** `src/assets/images/team/`

```json
[
  {
    "name": "Mike Lisi",
    "handle": "@mikehacksthings",
    "role": "President",
    "image": "mike.png",
    "linkedin": "https://www.linkedin.com/in/mikelisi/",
    "twitter": "https://x.com/mikehacksthings"
  }
]
```

- **`image`**: File title string only. Drop the file inside `src/assets/images/team/`. If left blank or missing, the loader automatically assigns the `placeholder.png` asset from the same folder.
- **`linkedin`**, **`twitter`**, **`instagram`**, **`mastodon`** are all optional social media platforms that can be added to each individual

---

### 3. Village Sponsors

- **Data Path:** `src/data/sponsors.json`
- **Media Assets Path:** `src/assets/images/sponsors/` (logos) and `src/assets/images/events/` (banners)

Sponsors are mapped per event to support archival tracking across multiple layout iterations over time. **Note:** This file maintains an object root structure to accommodate complex relationships.

```json
{
  "events": [
    {
      "name": "DEF CON 34 (2026)",
      "dates": "August 6-9, 2026",
      "location": "Las Vegas, Nevada",
      "description": "Join us at the world's largest hacker convention...",
      "image": "dc34.png",
      "levels": [
        {
          "name": "Diamond",
          "sponsors": [
            {
              "name": "Security Corp Inc.",
              "logo": "security-corp.png",
              "website": "https://securitycorp.example.com",
              "description": "Industry leader in penetration testing.",
              "socials": [
                { "name": "Twitter", "url": "https://x.com/securitycorp" }
              ]
            }
          ]
        }
      ]
    }
  ]
}
```

- **`image`**: Event banner artwork filename. Drops inside `src/assets/images/events/`.
- **`levels.sponsors.logo`**: Sponsor logo filename. Drops inside `src/assets/images/sponsors/`.
- **`levels.sponsors.socials`**: Optional array containing objects with `"name"` and `"url"` keys for specific sponsor links.

---

### 4. RTV CRON Episodes

- **Data Path:** `src/data/rtv-cron.json`
- **Media Assets Path:** `src/assets/images/episodes/`

Tracks the dynamic archive of our recorded livestream workshops.

```json
[
  {
    "title": "Local Large Language Models",
    "date": "May 9, 2026",
    "presenter": "Bryce Zuccaro",
    "description": "Workshop Description: A medium depth overview of how to run an LLM...",
    "tags": ["AI", "SelfHosted", "Workshop"],
    "watchUrl": "https://www.youtube.com/watch?v=L8bYnzq4JWo",
    "image": "rtv-cron-0x5.png"
  }
]
```

- **`description`**: Supports plain text. The application engine converts this data into clean semantic HTML automatically via an integrated Markdown parser (`marked`).
- **`image`**: Graphic filename string. Drops inside `src/assets/images/episodes/`.

---

### 5. Events Schedule

- **Data Path:** `src/data/schedule.json`
- **Media Assets Path:** `src/assets/images/events/`

Populates our interactive calendar grids for upcoming live and virtual conferences.

```json
[
  {
    "title": "Cyber Wargames @ DEF CON 34",
    "dateRange": "August 7-9, 2025",
    "times": "9am - 5pm",
    "location": "Las Vegas Convention Center, Competition Floor",
    "description": "Join us for an exciting new collection of attack-defense games!",
    "tags": ["Conference", "DEF CON", "Competition"],
    "image": {
      "src": "dc34.avif",
      "alt": "DEF CON 34 Competition Room Banner"
    },
    "link": {
      "url": "/cyber-wargames",
      "text": "Cyber Wargames Details",
      "external": false
    }
  }
]
```

- **`image.src`**: Event feature graphic asset filename. Drops inside `src/assets/images/events/`.
- **`link.external`**: Boolean configuration flag. Set to `true` to flag an external outbound hyperlink, or `false` (default) for an internal file-router path.

---

### 6. RTV Overflow Streaming Slots

- **Data Path:** `src/data/rtv-overflow.json`
- **Media Assets Path:** `src/assets/images/overflow/`

Handles the chronological timeline tracking rosters for consecutive presentations, multi-speaker streams, and single-day marathons.

```json
[
  {
    "title": "Glytch C2",
    "datetime": "Feb. 21, 2026 12:00PM EST",
    "presenter": "Anıl Çelik & Emre Odaman",
    "description": "Discover the future of stealthy post-exploitation with GlytchC2...",
    "image": "anil.jpg",
    "image2": "emre.jpg"
  }
]
```

- **Dual Speaker Support**: Use **`image`** for the primary speaker asset. If a slot features co-presenters, define the secondary asset filename inside **`image2`**. Drop both profile pictures into `src/assets/images/overflow/`.

---

### 7. Site Navigation (Header & Footer)

- **Header Data Path:** `src/data/header.json`
- **Footer Data Path:** `src/data/footer.json`

Controls navigation configurations across layout masters.

#### Header Example

```json
[
  {
    "id": "rtv-team",
    "name": "<i class='fas fa-users'></i> TEAM",
    "url": "team/"
  }
]
```

#### Footer Example

```json
[
  {
    "id": "discord",
    "name": "<i class='fab fa-discord fa-lg'></i>",
    "url": "https://discord.gg/redteamvillage",
    "target": "_blank"
  }
]
```

- **`name`**: Allows inline HTML block strings. Use this to bind FontAwesome standard icons directly into links (e.g., `<i class='fab fa-discord'></i>`).
- **`target`**: Optional string property. Set to `"_blank"` to launch the navigation pathway in a new browsing window context.
- **Automated Engine Fields**: The build loader calculates and appends tracking indexes (`index`) and accessible descriptive properties (`ariaLabel` on footers) programmatically. **Do not define these fields manually inside your raw JSON edits.**
