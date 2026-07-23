import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { existsSync, readFileSync, statSync } from "node:fs";
import path from "node:path";

const root = process.cwd();
const read = (filePath: string): string =>
  readFileSync(path.join(root, filePath), "utf8");

describe("Studio OS public site", () => {
  it("ships a self-contained static landing page", () => {
    for (const filePath of [
      "website/index.html",
      "website/styles.css",
      "website/script.js",
      "website/assets/studio-workbench.jpg",
    ]) {
      assert.equal(existsSync(path.join(root, filePath)), true, filePath);
    }

    const html = read("website/index.html");

    assert.match(html, /<html lang="en">/);
    assert.match(html, /<title>Studio OS \|/);
    assert.match(html, /https:\/\/aleksei2507\.github\.io\/studio-os\//);
    assert.match(html, /codex plugin marketplace add Aleksei2507\/studio-os/);
    assert.match(html, /codex plugin add studio-os@studio-os/);
    assert.match(html, /\/plugin marketplace add Aleksei2507\/studio-os/);
    assert.match(html, /\/plugin install studio-os@studio-os/);
    assert.match(html, /\/reload-plugins/);
    assert.match(html, /\/studio-os:studio-os/);
    assert.match(html, /href="\.\/styles\.css"/);
    assert.match(html, /src="\.\/script\.js"/);
    assert.doesNotMatch(html, /<script[^>]+src="https?:\/\//);
    assert.doesNotMatch(html, /<link[^>]+href="https?:\/\/[^\"]+\.css/);

    for (const match of html.matchAll(/href="#([a-z0-9-]+)"/g)) {
      assert.match(html, new RegExp(`id="${match[1]}"`), match[1]);
    }
  });

  it("keeps public site references portable", () => {
    const publicSource = [
      read("website/index.html"),
      read("website/styles.css"),
      read("website/script.js"),
    ].join("\n");

    assert.doesNotMatch(publicSource, /\/Users\//);
    assert.doesNotMatch(publicSource, /\/Downloads\//);
    assert.doesNotMatch(publicSource, /\/tmp\//);
    assert.doesNotMatch(publicSource, /file:\/\//);
  });

  it("uses the project visual asset without shipping an oversized source", () => {
    const asset = statSync(
      path.join(root, "website/assets/studio-workbench.jpg"),
    );

    assert.ok(asset.size > 100_000, "hero image should contain real visual detail");
    assert.ok(asset.size < 1_500_000, "hero image should remain web-friendly");
  });

  it("publishes the static directory through GitHub Pages", () => {
    const workflow = read(".github/workflows/pages.yml");

    assert.match(workflow, /branches:\s*\[main\]/);
    assert.match(workflow, /pages: write/);
    assert.match(workflow, /id-token: write/);
    assert.match(workflow, /actions\/configure-pages@v5/);
    assert.match(workflow, /actions\/upload-pages-artifact@v4/);
    assert.match(workflow, /path: website/);
    assert.match(workflow, /actions\/deploy-pages@v4/);
  });
});
