import { test } from "node:test";
import assert from "node:assert/strict";
import { existsSync, readFileSync, readdirSync } from "node:fs";
import { join, extname, relative, resolve } from "node:path";
const root = resolve("dist");
const walk = (dir) =>
  readdirSync(dir, { withFileTypes: true }).flatMap((entry) =>
    entry.isDirectory() ? walk(join(dir, entry.name)) : [join(dir, entry.name)],
  );
const pages = walk(root).filter(
  (file) => file.endsWith(".html") && !file.endsWith("__forms.html"),
);
test("all 17 content pages and the recovery page have one main heading, metadata, and valid structured data", () => {
  assert.equal(pages.filter(file => !file.endsWith("404.html")).length, 17);
  assert.ok(pages.includes(join(root, "404.html")));
  for (const file of pages) {
    const html = readFileSync(file, "utf8"),
      label = relative(root, file);
    assert.equal(
      (html.match(/<h1[\s>]/g) || []).length,
      1,
      label + " needs exactly one H1",
    );
    assert.match(html, /<title>[^<]+<\/title>/, label);
    assert.match(html, /<meta name="description" content="[^"]+"/, label);
    for (const match of html.matchAll(
      /<script[^>]+type="application\/ld\+json"[^>]*>(.*?)<\/script>/gs,
    ))
      assert.doesNotThrow(() => JSON.parse(match[1]), label);
  }
});

test('the recovery page is kept out of search results and the sitemap', () => {
  const html = readFileSync(join(root, '404.html'), 'utf8');
  assert.match(html, /<meta name="robots" content="noindex,follow"/);
  assert.doesNotMatch(readFileSync(join(root, 'sitemap.xml'), 'utf8'), /\/404/);
});
test("every local navigation, asset, and section anchor resolves", () => {
  const failures = [];
  for (const file of pages) {
    const html = readFileSync(file, "utf8");
    for (const [, raw] of html.matchAll(/(?:href|src)="([^"]+)"/g)) {
      const href = raw.replaceAll("&amp;", "&");
      if (!href.startsWith("/") && !href.startsWith("#")) continue;
      const url = new URL(
        href,
        "https://local.test/" + relative(root, file).replaceAll("\\", "/"),
      );
      let target = href.startsWith("#")
        ? file
        : join(root, decodeURIComponent(url.pathname));
      if (!extname(target)) target = join(target, "index.html");
      if (!existsSync(target)) {
        failures.push(relative(root, file) + ": " + href);
        continue;
      }
      if (url.hash && target.endsWith(".html")) {
        const id = decodeURIComponent(url.hash.slice(1));
        if (!readFileSync(target, "utf8").includes('id="' + id + '"'))
          failures.push(relative(root, file) + ": missing " + href);
      }
    }
  }
  assert.deepEqual(failures, []);
});

test('all pages expose native mobile navigation and discoverable supporting routes', () => {
  for (const file of pages) {
    const html = readFileSync(file, 'utf8');
    assert.match(html, /<details[^>]*class="mobile-menu"/);
    assert.match(html, /<summary[^>]*aria-label="Main menu"/);
    const menu = html.match(/<nav[^>]*class="mobile-menu__links"[\s\S]*?<\/nav>/)?.[0];
    assert.ok(menu, file);
    for (const href of ['/services/', '/pricing/', '/how-it-works/', '/industries/', '/google-ads/', '/about/', '/resources/', '/faq/', '/contact/']) {
      assert.ok(menu.includes('href="' + href + '"'), file + ': ' + href);
    }
    assert.doesNotMatch(html, /data-menu-button/, 'the core disclosure must not depend on JavaScript');
  }
});
test("plan commitments and form registration remain consistent", () => {
  const pricing = readFileSync(join(root, "pricing/index.html"), "utf8");
  for (const amount of [
    "$99",
    "$179",
    "$329",
    "$549",
    "$2,376",
    "$2,148",
    "$3,948",
    "$6,588",
  ])
    assert.ok(pricing.includes(amount), amount);
  const contact = readFileSync(join(root, "contact/index.html"), "utf8"),
    registration = readFileSync(join(root, "__forms.html"), "utf8");
  const form = contact.match(/<form\b[\s\S]*?<\/form>/)[0];
  assert.equal((form.match(/\srequired[\s>]/g) || []).length, 4);
  for (const [, name] of form.matchAll(
    /<(?:input|select|textarea)\b[^>]*\bname="([^"]+)"/g,
  ))
    assert.ok(
      registration.includes('name="' + name + '"'),
      name + " must be registered",
    );
  assert.match(contact, /data-form-enabled="(?:true|false)"/);
});
test("one continuous launch scene loads separately from useful HTML content", () => {
  const home = readFileSync(join(root, "index.html"), "utf8");
  assert.equal((home.match(/data-launch-stage/g) || []).length, 1);
  assert.equal((home.match(/data-flight-stop=/g) || []).length, 7);
  assert.equal((home.match(/data-flight-cue=/g) || []).length, 3);
  assert.match(home, /data-launch-controls hidden/);
  assert.match(home, /Pause motion/);
  for (const amount of ["$99", "$179", "$329", "$549"])
    assert.ok(home.includes(amount));
  assert.doesNotMatch(
    readFileSync(join(root, "contact/index.html"), "utf8"),
    /data-town-scene|data-launch-stage/,
  );
  const sceneFiles = walk(join(root, "_astro")).filter((f) =>
    /launch-scene.*\.js$/.test(f),
  );
  assert.ok(sceneFiles.length > 0);
});
