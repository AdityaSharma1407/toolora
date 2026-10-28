import { test, describe } from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";

describe("PWA & Offline Service Worker Verification", () => {
  const rootDir = process.cwd();

  test("1. site.webmanifest meets PWA installation specifications", () => {
    const manifestPath = path.join(rootDir, "public", "site.webmanifest");
    assert.ok(fs.existsSync(manifestPath), "site.webmanifest must exist in public directory");

    const content = fs.readFileSync(manifestPath, "utf-8");
    const manifest = JSON.parse(content);

    // Identity & Branding
    assert.ok(manifest.name.includes("Bits & Tools"), "Manifest name must be 'Bits & Tools'");
    assert.strictEqual(manifest.short_name, "Bits & Tools");
    assert.strictEqual(manifest.display, "standalone");
    assert.ok(manifest.start_url.startsWith("/"), "Start URL must be root-relative");

    // Icons
    assert.ok(Array.isArray(manifest.icons) && manifest.icons.length >= 2, "Must include at least 2 icon sizes");
    const has192 = manifest.icons.some((i) => i.sizes === "192x192");
    const has512 = manifest.icons.some((i) => i.sizes === "512x512");
    assert.ok(has192, "Must provide 192x192 icon");
    assert.ok(has512, "Must provide 512x512 icon");

    // Shortcuts for quick actions
    assert.ok(Array.isArray(manifest.shortcuts) && manifest.shortcuts.length >= 3, "Must provide app shortcuts");

    // Strict No Toolora rule
    assert.ok(!content.toLowerCase().includes("toolora"), "Manifest must never contain 'toolora'");
  });

  test("2. Service Worker (sw.js) precaches core assets and provides offline fallback", () => {
    const swPath = path.join(rootDir, "public", "sw.js");
    assert.ok(fs.existsSync(swPath), "public/sw.js must exist");

    const swCode = fs.readFileSync(swPath, "utf-8");

    // Event listeners
    assert.ok(swCode.includes("addEventListener('install'"), "SW must have install event listener");
    assert.ok(swCode.includes("addEventListener('activate'"), "SW must have activate event listener");
    assert.ok(swCode.includes("addEventListener('fetch'"), "SW must have fetch event listener");

    // Precaching offline shell
    assert.ok(swCode.includes("'/offline'"), "SW must precache /offline fallback route");
    assert.ok(swCode.includes("'/site.webmanifest'"), "SW must precache web manifest");

    // Strict No Toolora rule
    assert.ok(!swCode.toLowerCase().includes("toolora"), "sw.js must never contain 'toolora'");
  });

  test("3. Offline fallback page is present and fully client-side branded", () => {
    const offlinePagePath = path.join(rootDir, "src", "app", "offline", "page.jsx");
    const offlineClientPath = path.join(rootDir, "src", "app", "offline", "OfflineClient.jsx");

    assert.ok(fs.existsSync(offlinePagePath), "src/app/offline/page.jsx must exist");
    assert.ok(fs.existsSync(offlineClientPath), "src/app/offline/OfflineClient.jsx must exist");

    const pageCode = fs.readFileSync(offlinePagePath, "utf-8");
    const clientCode = fs.readFileSync(offlineClientPath, "utf-8");

    assert.ok(pageCode.includes("Bits & Tools"), "Offline page metadata must contain 'Bits & Tools'");
    assert.ok(clientCode.includes("Bits & Tools"), "Offline client component must reference 'Bits & Tools'");
    assert.ok(clientCode.includes("navigator.onLine"), "Offline client component must check navigator.onLine");

    // Strict No Toolora rule
    assert.ok(!pageCode.toLowerCase().includes("toolora"), "page.jsx must never contain 'toolora'");
    assert.ok(!clientCode.toLowerCase().includes("toolora"), "OfflineClient.jsx must never contain 'toolora'");
  });

  test("4. usePwaInstall hook and UI components exist and handle PWA lifecycle", () => {
    const hookPath = path.join(rootDir, "src", "hooks", "usePwaInstall.js");
    const bannerPath = path.join(rootDir, "src", "components", "pwa", "InstallPwaBanner.jsx");
    const registerPath = path.join(rootDir, "src", "components", "pwa", "PwaRegister.jsx");

    assert.ok(fs.existsSync(hookPath), "usePwaInstall.js hook must exist");
    assert.ok(fs.existsSync(bannerPath), "InstallPwaBanner.jsx component must exist");
    assert.ok(fs.existsSync(registerPath), "PwaRegister.jsx component must exist");

    const hookCode = fs.readFileSync(hookPath, "utf-8");
    const bannerCode = fs.readFileSync(bannerPath, "utf-8");
    const registerCode = fs.readFileSync(registerPath, "utf-8");

    assert.ok(hookCode.includes("beforeinstallprompt"), "Hook must listen for beforeinstallprompt");
    assert.ok(hookCode.includes("appinstalled"), "Hook must listen for appinstalled");
    assert.ok(bannerCode.includes("Bits & Tools"), "Banner must reference Bits & Tools");
    assert.ok(registerCode.includes("navigator.serviceWorker"), "Register component must invoke serviceWorker");

    // Strict No Toolora rule
    assert.ok(!hookCode.toLowerCase().includes("toolora"), "hook must never contain 'toolora'");
    assert.ok(!bannerCode.toLowerCase().includes("toolora"), "banner must never contain 'toolora'");
    assert.ok(!registerCode.toLowerCase().includes("toolora"), "register must never contain 'toolora'");
  });

  test("5. Root layout integrates PwaRegister, InstallPwaBanner and Apple web app meta", () => {
    const layoutPath = path.join(rootDir, "src", "app", "layout.jsx");
    const layoutCode = fs.readFileSync(layoutPath, "utf-8");

    assert.ok(layoutCode.includes("<PwaRegister"), "Layout must render <PwaRegister />");
    assert.ok(layoutCode.includes("<InstallPwaBanner"), "Layout must render <InstallPwaBanner />");
    assert.ok(layoutCode.includes("appleWebApp"), "Layout must export appleWebApp configuration");
    assert.ok(layoutCode.includes("site.webmanifest"), "Layout must reference site.webmanifest");
  });
});
