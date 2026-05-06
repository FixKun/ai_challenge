# Leaderboard

An interactive employee leaderboard page — static HTML/CSS/JS, no dependencies.

## Features

- Podium display for top 3 performers
- Filter by Year, Quarter, and Category
- Real-time employee name search
- Expandable activity rows per employee
- All points and rankings update dynamically based on active filters

## Deploy to GitHub Pages

### 1. Create a GitHub repository

1. Go to [github.com/new](https://github.com/new)
2. Create a **public** repository (e.g. `leaderboard`)
3. Do **not** initialise with a README (we'll push our own files)

### 2. Push the files

```bash
cd /path/to/parent/folder   # the folder containing task-1/
git init
git add task-1/
git commit -m "Initial leaderboard"
git branch -M main
git remote add origin https://github.com/<your-username>/<your-repo>.git
git push -u origin main
```

### 3. Enable GitHub Pages

1. Open your repository on GitHub
2. Go to **Settings → Pages**
3. Under **Source**, select **Deploy from a branch**
4. Set **Branch** to `main` and folder to `/ (root)` — GitHub Pages does not support subdirectory sources directly, so either move files to root or use a custom workflow (see note below)
5. Click **Save**

Your site will be live at:

```
https://<your-username>.github.io/<your-repo>/task-1/
```

> **Note:** GitHub Pages (branch deploy) serves from the repo root or `/docs`, not from a subfolder.
> The simplest fix is to push the contents of `task-1/` into the repo root instead of inside a subfolder.
> Alternatively, use a GitHub Actions workflow to copy `task-1/` to a `gh-pages` branch.

It typically takes 1–2 minutes for the first deployment to become available.

## Local preview

Open `index.html` directly in any modern browser — no server required.

## File structure

```
├── index.html   # Page markup
├── style.css    # All styles
├── script.js    # Data, filter logic, and DOM rendering
└── README.md    # This file
```
