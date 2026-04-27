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
cd /path/to/this/folder
git init
git add .
git commit -m "Initial leaderboard"
git branch -M main
git remote add origin https://github.com/<your-username>/<your-repo>.git
git push -u origin main
```

### 3. Enable GitHub Pages

1. Open your repository on GitHub
2. Go to **Settings → Pages**
3. Under **Source**, select **Deploy from a branch**
4. Set **Branch** to `main` and folder to `/ (root)`
5. Click **Save**

Your site will be live at:

```
https://<your-username>.github.io/<your-repo>/
```

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
