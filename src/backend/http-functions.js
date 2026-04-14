import { badRequest, redirect, serverError } from 'wix-http-functions';
import { fetch } from 'wix-fetch';
import wixData from 'wix-data';

const WIX_CLIENT_ID = 'e4162926-bd41-4ba1-bbe4-b0eacefa18d6';
const WIX_CLIENT_SECRET = '5502bed8-1ba3-4bad-a3fe-d7a55c784d44';
const WIX_SCOPE = 'offline_access';
const TOKEN_COLLECTION = 'WixOAuthTokens';
const AFTER_LOGIN_PATH = '/my-account';
const AUTHORIZE_URL = 'https://www.wix.com/oauth/access';
const TOKEN_URL = 'https://www.wixapis.com/oauth2/token';

function toQueryString(params) {
    const search = new URLSearchParams();

    Object.keys(params).forEach((key) => {
        const value = params[key];
        if (value !== undefined && value !== null && value !== '') {
            search.append(key, value);
        }
    });

    return search.toString();
}

function getBaseUrl(request) {
    const host = request.headers && (request.headers.host || request.headers.Host);
    if (!host) {
        return '';
    }

    return `https://${host}`;
}

function getCallbackUrl(request) {
    const baseUrl = getBaseUrl(request);
    return `${baseUrl}/_functions/wix-oauth-callback`;
}

async function upsertTokenRecord(tokenPayload) {
    try {
        const existing = await wixData.query(TOKEN_COLLECTION)
            .eq('provider', 'wix')
            .limit(1)
            .find();

        const now = new Date().toISOString();
        const expiresIn = Number(tokenPayload.expires_in || 0);
        const expiresAt = expiresIn > 0
            ? new Date(Date.now() + expiresIn * 1000).toISOString()
            : null;

        const record = {
            provider: 'wix',
            updatedAt: now,
            accessToken: tokenPayload.access_token || null,
            refreshToken: tokenPayload.refresh_token || null,
            tokenType: tokenPayload.token_type || null,
            scope: tokenPayload.scope || WIX_SCOPE,
            expiresIn,
            expiresAt
        };

        if (existing.items.length > 0) {
            const current = existing.items[0];
            await wixData.update(TOKEN_COLLECTION, {
                ...current,
                ...record
            });
            return;
        }

        await wixData.insert(TOKEN_COLLECTION, {
            ...record,
            createdAt: now
        });
    } catch (error) {
        // Do not break the auth redirect if collection isn't ready yet.
        console.error('Failed to save Wix OAuth token:', error);
    }
}

export function get_wixOauth(request) {
    const callbackUrl = getCallbackUrl(request);

    if (!callbackUrl) {
        return serverError({
            headers: { 'Content-Type': 'application/json' },
            body: { message: 'Missing host header for callback URL.' }
        });
    }

    const authorizeQuery = toQueryString({
        client_id: WIX_CLIENT_ID,
        response_type: 'code',
        redirect_uri: callbackUrl,
        scope: WIX_SCOPE
    });

    return redirect(`${AUTHORIZE_URL}?${authorizeQuery}`);
}

export async function get_wixOauthCallback(request) {
    const code = request.query && request.query.code;
    const callbackUrl = getCallbackUrl(request);

    if (!code) {
        return badRequest({
            headers: { 'Content-Type': 'application/json' },
            body: { message: 'Missing OAuth code.' }
        });
    }

    if (!callbackUrl) {
        return serverError({
            headers: { 'Content-Type': 'application/json' },
            body: { message: 'Missing host header for callback URL.' }
        });
    }

    const payload = toQueryString({
        grant_type: 'authorization_code',
        client_id: WIX_CLIENT_ID,
        client_secret: WIX_CLIENT_SECRET,
        redirect_uri: callbackUrl,
        code
    });

    try {
        const tokenResponse = await fetch(TOKEN_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            body: payload
        });

        if (!tokenResponse.ok) {
            const errorText = await tokenResponse.text();
            console.error('Wix OAuth token exchange failed:', errorText);

            return serverError({
                headers: { 'Content-Type': 'application/json' },
                body: { message: 'Wix token exchange failed.' }
            });
        }

        const tokenPayload = await tokenResponse.json();
        await upsertTokenRecord(tokenPayload);

        return redirect(AFTER_LOGIN_PATH);
    } catch (error) {
        console.error('Wix OAuth callback error:', error);
        return serverError({
            headers: { 'Content-Type': 'application/json' },
            body: { message: 'Unhandled Wix OAuth callback error.' }
        });
    }
}
