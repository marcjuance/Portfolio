# Personal Portfolio Website

A dark-themed, read-only personal portfolio website with a looping GIF-like electric-blue digital data-stream background. All profile details and photos are controlled directly in code via `portfolio-data.js` and `assets/`.

## Files

- `index.html` — Main portfolio page, section buttons, lightbox viewer, and Quick Jump (`Ctrl+K`) palette
- `styles.css` — Locked dark frosted-glass theme, scanlines, and centered footer
- `portfolio-data.js` — **Edit this file** to update your photos, status (`Student`, `Instructor`, `Junior IT`, etc.), summary, education, skills, projects & research, trainings & certificates, contacts, and CV/Resume photo
- `app.js` — Section switching, GIF-like data-stream background animation, skill/project filters, lightbox preview, and Quick Jump palette
- `assets/` — Place your local photos here (e.g. `assets/profile.jpg`, `assets/cv-resume.jpg`)

## How to Update Your Info & Photos

1. Put your photos inside `portfolio/assets/` (for example `profile.jpg` and `cv-resume.jpg`).
2. Open `portfolio/portfolio-data.js` in VS Code and update your text and image paths (including `contacts.cvResume.photo`).
3. Open `portfolio/index.html` in your browser to view your portfolio.
