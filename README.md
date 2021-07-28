# mirai

A modern client for MyAnimeList, focused on performance and modern usability.

## Usage

Head to the [stable version](https://mal-mirai.web.app) that (usually) only updates after a release, or you can use the [bleeding-edge variant](https://mirai-lovat.vercel.app) that's auto-published from the master branch. Or you can build and host your own version by following the instructions below.

## Building

### Clone the repo
```bash
git clone https://github.com/Jabster28/mirai
cd mirai
```

### Install dependencies
```bash
yarn
```

### Start the app in development mode (hot-code reloading, error reporting, etc.)
```bash
quasar dev
```

### Lint the files
```bash
yarn run lint
```

### Build the app for production
```bash
quasar build
# for a PWA build, use: quasar build -m pwa
```

### Customize the configuration
See [Configuring quasar.conf.js](https://quasar.dev/quasar-cli/quasar-conf-js).
