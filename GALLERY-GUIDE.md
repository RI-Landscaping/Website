# Adding gallery photos (for Cursor AI or manual editing)

The website gallery is data-driven — you don't write HTML for each photo,
you just list which jobs exist in `script.js`, and the code builds the
gallery automatically.

## Where to edit
Open `script.js` and find the `JOBS` array near the top of the file.

## Filename convention (must match exactly)
Photos in the `/images` folder must be named:

```
job{N}-after-{n}.jpg
job{N}-before-{n}.jpg
```

Examples:
- `job1-after-1.jpg`, `job1-after-2.jpg`, `job1-before-1.jpg`
- `job2-after-1.jpg`, `job2-before-1.jpg`, `job2-before-2.jpg`

## How to add a job to the gallery
For each job, add one line to the `JOBS` array in `script.js`:

```js
{ id: "job1", order: 1, afterCount: 2, beforeCount: 1 },
```

- `id` — matches the filename prefix (`job1`, `job2`, etc.)
- `order` — controls display position (1 = shown first), independent of
  the job number, so a "job7" can display before "job2" if desired
- `afterCount` — how many after-*.jpg photos exist for this job
- `beforeCount` — how many before-*.jpg photos exist for this job

## Instructions for Cursor's AI specifically
If you're an AI assistant with access to this project folder:
1. List the files in `/images`
2. Group them by job number prefix (e.g. all `job1-*` files together)
3. Count how many `after` and `before` files exist per job
4. Fill in the `JOBS` array in `script.js` with one entry per job,
   following the format above
5. Leave `order` as the job's numeric order unless the user specifies
   a different display order
6. Do not rename or move any image files — just read the filenames
   that already exist

## The logo
The header expects the logo file at `images/logo.png`. If the file has
a different name, either rename it to `logo.png` or update the `src`
attribute in `index.html`'s `<header>` section.

## Action shots (equipment, process photos)
These are not part of the job gallery. If you want to display them
separately later, use a distinct filename prefix like
`action-chainsaw-1.jpg` — they are not currently wired into any section.
