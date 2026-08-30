export const HOMEPAGE_INTENTS = Object.freeze({
    FUND: 'fund',
    BUILD: 'build',
    BUY: 'buy',
    DISTRIBUTE: 'distribute'
});

const SUPPORTED_INTENTS = Object.values(HOMEPAGE_INTENTS);

export function normalizeHomepageIntent(value) {
    if (typeof value !== 'string') {
        return null;
    }

    const normalized = value.trim().toLowerCase();
    return SUPPORTED_INTENTS.includes(normalized) ? normalized : null;
}

export function routeKeyForHomepageIntent(value) {
    const intent = normalizeHomepageIntent(value);
    return intent ? `homepage.${intent}.primary` : null;
}

export function createHomepageIntent(value, source = 'homepage') {
    const intent = normalizeHomepageIntent(value);

    if (!intent) {
        return null;
    }

    return {
        intent,
        source,
        routeKey: routeKeyForHomepageIntent(intent),
        selectedAt: new Date().toISOString()
    };
}
