export const HOMEPAGE_EVENTS = Object.freeze({
    READY: 'homepage_ready',
    INTENT_SELECTED: 'homepage_intent_selected',
    ROUTE_RESOLVED: 'homepage_route_resolved',
    CTA_CLICKED: 'homepage_cta_clicked'
});

export function createHomepageEvent(name, properties = {}) {
    return {
        name,
        properties,
        occurredAt: new Date().toISOString()
    };
}

export function trackHomepageEvent(name, properties = {}) {
    const event = createHomepageEvent(name, properties);

    // This is the stable event contract. A production analytics transport can
    // be attached here later without changing page-level controller code.
    console.log('[Moonshine Homepage Event]', event);

    return event;
}
