import wixData from 'wix-data';

const ROUTES_COLLECTION = 'SiteRoutes';

function mapRoute(item) {
    if (!item) {
        return null;
    }

    return {
        key: item.key,
        label: item.label || '',
        url: item.url || '',
        destinationType: item.destinationType || 'internal',
        intent: item.intent || '',
        openExternal: Boolean(item.openExternal),
        description: item.description || '',
        priority: Number(item.priority || 0)
    };
}

export async function resolveSiteRoute(routeKey) {
    if (!routeKey) {
        return null;
    }

    const result = await wixData.query(ROUTES_COLLECTION)
        .eq('key', routeKey)
        .eq('active', true)
        .limit(1)
        .find();

    return result.items.length > 0 ? mapRoute(result.items[0]) : null;
}
