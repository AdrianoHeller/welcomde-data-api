const MatomoTracker = require('matomo-tracker');

let Matomo = new MatomoTracker(1,'https://wgcompany.systems');

Matomo.on('error', err => {
    console.error(`Error tracking Request:${err}`);
});

Matomo.track('https://wgcompany.systems');