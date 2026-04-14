import wixLocation from 'wix-location';

export function startWixLogin() {
    wixLocation.to('/_functions/wix-oauth');
}
