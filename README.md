# BEST Leuven website

Static site built with [Eleventy](https://www.11ty.dev/). Source is in `src/`, the generated site is in `docs/`.

## Setup

Requires Node.js 18 or newer.

```sh
npm install
```

## Develop

```sh
npm start
```

Serves the site locally with live reload.

## Build and publish

```sh
npm run build
git add -A
git commit
git push
```

`npm run build` regenerates `docs/` from `src/`. Do not edit `docs/` by hand.

## Hosting

Hosted on GitHub Pages, served from the `/docs` folder of the `main` branch. GitHub does not run the build, so `docs/` must be rebuilt and committed after every change to `src/`.
