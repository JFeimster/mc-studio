// API Reference: https://www.wix.com/velo/reference/api-overview/introduction
// “Hello, World!” Example: https://learn-code.wix.com/en/article/hello-world
import { startWixLogin } from 'public/wix-auth';

$w.onReady(function () {
    // Write your JavaScript here

    // To select an element by ID use: $w('#elementID')

    // Click 'Preview' to run your code
    // Optional convention: if a button with ID #loginButton exists, it becomes Wix OAuth login.
    try {
        const loginButton = $w('#loginButton');
        if (loginButton && typeof loginButton.onClick === 'function') {
            loginButton.onClick(() => {
                startWixLogin();
            });
        }
    } catch (error) {
        // No #loginButton on this page - safe to ignore.
    }
});
