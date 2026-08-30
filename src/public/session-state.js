import { session } from 'wix-storage';

const HOMEPAGE_INTENT_KEY = 'mc.homepage.intent';

export function saveHomepageIntent(intentState) {
    if (!intentState) {
        return null;
    }

    session.setItem(HOMEPAGE_INTENT_KEY, JSON.stringify(intentState));
    return intentState;
}

export function readHomepageIntent() {
    const stored = session.getItem(HOMEPAGE_INTENT_KEY);

    if (!stored) {
        return null;
    }

    try {
        return JSON.parse(stored);
    } catch (error) {
        console.error('Unable to parse homepage intent state:', error);
        session.removeItem(HOMEPAGE_INTENT_KEY);
        return null;
    }
}

export function clearHomepageIntent() {
    session.removeItem(HOMEPAGE_INTENT_KEY);
}
