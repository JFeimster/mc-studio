# Agent Instructions for MC-Studio (Wix Velo Project)

Welcome! You are assisting with a Wix Velo repository managed via the Wix CLI. This is **not** a standard Node.js, Next.js, or Express application. Please strictly adhere to the following architectural guidelines, scripts, and coding conventions when interacting with this codebase.

## 🏗️ Project Architecture & File Structure

This repository follows the strict file structure required by the Wix CLI for Velo projects. When asked to find or create files, refer to these directories:

* **`src/pages/`**: Contains the page code for the website frontend. These files dictate the behavior of UI elements on specific pages.
* **`src/backend/`**: Contains server-side code. This includes backend web modules, `http-functions.js` for custom APIs, `routers.js` for data routing, and `permissions.json`. 
* **`src/public/`**: Contains JavaScript files that are publicly accessible and can be shared between the frontend and backend.
* **`wix.config.json` / `wix.lock`**: Wix configuration files. **Do not modify these** unless explicitly instructed to do so.

## 🛠️ Commands and Scripts

When you need to execute terminal commands, use the scripts defined in `package.json`:

* **Install Dependencies:** `npm install`
* **Sync Types:** `npm run postinstall` (This runs `wix sync-types` to generate autocomplete definitions for the Velo APIs and site elements. Run this if type errors occur.)
* **Local Editor/Testing:** `npm run dev` (This runs `wix dev` to start the Local Editor to test changes in real-time before committing.)
* **Linting:** `npm run lint` (Runs ESLint using the `@wix/eslint-plugin-cli` configuration.)

*Note: The `@wix/cli` must be installed globally (`npm install -g @wix/cli`) to execute underlying `wix` commands.*

## 💻 Coding Conventions & Velo Syntax

When generating or refactoring code, you must use standard Wix Velo APIs and paradigms. Do not attempt to use standard web framework libraries (like standard React hooks for DOM manipulation) or standard Node.js libraries for backend functions that Wix already provides.

### 1. Frontend / Page Code (`src/pages/`)
* **The `$w` Namespace:** Use the `$w` selector to interact with page elements (e.g., `$w('#myButton').onClick(() => { ... })`).
* **Page Ready:** Always wrap initialization logic inside the `$w.onReady()` function.
* **Velo APIs:** Rely on Velo frontend modules like `wix-location`, `wix-window`, and `wix-users`.

### 2. Backend Code (`src/backend/`)
* **Data Operations:** Use `wix-data` for querying, inserting, and updating database collections instead of trying to install standard ORMs (like Prisma or Mongoose).
* **Authentication & Users:** Use `wix-users-backend` or `wix-members-backend`.
* **Web Modules:** Exported functions in backend files can be directly imported and called by the frontend. Ensure you are returning Promises properly from backend functions.

### 3. NPM Packages
* You may install standard NPM packages (e.g., `stripe`, `nodemailer` which are already in `dependencies`), but only use them in the `src/backend/` files unless they are specifically compatible with browser environments. 
* Do not install database drivers, file system routers, or HTTP servers (like Express). Wix handles the infrastructure natively.

## 🚨 Anti-Patterns (What NOT to do)

* **Do not** create an `index.js` or `server.js` at the root to serve the app. 
* **Do not** try to manipulate the DOM directly using `document.getElementById` or `window`. Always use Velo's `$w` API.
* **Do not** alter the `.yuprp.js`, `.wepce.js`, or similar extension hashes in the `src/pages/` directory unless instructed, as Wix uses these to map local files to editor pages.
