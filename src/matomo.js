const MatomoTracker = require('matomo-tracker');

let Matomo = new MatomoTracker(1,'https://hms-hub-8bfda.web.app/')

Matomo.on('error', err => {
    console.error(`Error tracking Request:${err}`);
});

Matomo.track('https://hms-hub-8bfda.web.app/');