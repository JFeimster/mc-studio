import { readHomepageIntent } from 'public/session-state';
import { HOMEPAGE_EVENTS, trackHomepageEvent } from 'public/analytics';

$w.onReady(function () {
    const previousIntent = readHomepageIntent();

    trackHomepageEvent(HOMEPAGE_EVENTS.READY, {
        hasPreviousIntent: Boolean(previousIntent),
        previousIntent: previousIntent ? previousIntent.intent : null
    });
});
