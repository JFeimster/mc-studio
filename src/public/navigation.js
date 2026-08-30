import wixLocation from 'wix-location';
import { resolveSiteRoute } from 'public/site-routes';

export function navigateToUrl(url) {
    if (typeof url !== 'string' || !url.trim()) {
        return false;
    }

    wixLocation.to(url.trim());
    return true;
}

export async function navigateToRouteKey(routeKey) {
    const route = await resolveSiteRoute(routeKey);

    if (!route || !route.url) {
        return {
            navigated: false,
            routeKey,
            route: route || null
        };
    }

    return {
        navigated: navigateToUrl(route.url),
        routeKey,
        route
    };
}
