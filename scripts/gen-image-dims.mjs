// @ts-nocheck
/**
 * Generate a static image-dimensions map for BODY images referenced in content/.
 *
 * Node port of scripts/gen-image-dims.py — runs in the build chain so that
 * NEW posts get their body-image dims auto-generated (permanent CLS fix).
 *
 * Walks content/ recursively (category subfolders), reads markdown body image
 * refs ![alt](/images/...), looks them up under public/, reads real pixel
 * dimensions with the pure-JS `image-size` package (webp/png/jpg, no native
 * deps), and emits src/data/image-dims.json: { "/images/posts/x-body-1.webp": [w, h], ... }.
 *
 * Injecting real width/height into <img> lets the browser reserve aspect-ratio
 * space before the image loads -> zero body-image CLS. With CSS
 * `.optimizedImage { width:100%; height:auto }` the rendered size is unchanged.
 *
 * Only BODY ![](...) refs are scanned (frontmatter `image:` thumbnails are NOT
 * pulled from frontmatter — but a thumb that is *also* embedded in the body via
 * ![]() is legitimately included, matching the original python behavior).
 *
 * Missing files are reported but NOT included (component falls back gracefully).
 * NEVER fails the build on a missing/unreadable image — warns only.
 *
 * Output format matches python json.dump(indent=0, sort_keys=True) + trailing
 * "\n" so the committed JSON diff stays clean.
 */
import { readdirSync, statSync, readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { imageSize } from "image-size";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, "..");
const CONTENT = join(ROOT, "content");
const PUBLIC = join(ROOT, "public");
const OUT = join(ROOT, "src", "data", "image-dims.json");

// URL group anchored so nested [..] inside alt text can't swallow the path.
const IMG_RE = /!\[[\s\S]*?\]\((\/images\/[^)\s]+)\)/g;

/** Recursively collect .md/.mdx file paths under dir. */
function walkMarkdown(dir) {
  const out = [];
  let entries;
  try {
    entries = readdirSync(dir);
  } catch {
    return out;
  }
  for (const name of entries) {
    const full = join(dir, name);
    let st;
    try {
      st = statSync(full);
    } catch {
      continue;
    }
    if (st.isDirectory()) {
      out.push(...walkMarkdown(full));
    } else if (name.endsWith(".mdx") || name.endsWith(".md")) {
      out.push(full);
    }
  }
  return out;
}

const refs = new Set();
for (const file of walkMarkdown(CONTENT)) {
  let text;
  try {
    text = readFileSync(file, "utf8");
  } catch {
    continue;
  }
  for (const m of text.matchAll(IMG_RE)) {
    refs.add(m[1]);
  }
}

const dims = {};
const missing = [];
const errors = [];
for (const ref of [...refs].sort()) {
  // /images/posts/x.webp -> <public>/images/posts/x.webp
  const fsPath = join(PUBLIC, ...ref.replace(/^\//, "").split("/"));
  let st;
  try {
    st = statSync(fsPath);
  } catch {
    missing.push(ref);
    continue;
  }
  if (!st.isFile()) {
    missing.push(ref);
    continue;
  }
  try {
    const { width: w, height: h } = imageSize(readFileSync(fsPath));
    if (w > 0 && h > 0) {
      dims[ref] = [w, h];
    } else {
      errors.push(`${ref} (zero dim)`);
    }
  } catch (e) {
    errors.push(`${ref} (${e && e.message ? e.message : String(e)})`);
  }
}

// Match python json.dump(dims, ensure_ascii=False, indent=0, sort_keys=True):
// keys sorted, each token on its own line with no indent, then a trailing "\n".
function dumpIndent0(obj) {
  const keys = Object.keys(obj).sort();
  if (keys.length === 0) return "{}";
  const parts = keys.map((k) => {
    const v = obj[k];
    // value is always a [w, h] array here.
    const arr = `[\n${v.map((n) => String(n)).join(",\n")}\n]`;
    return `${JSON.stringify(k)}: ${arr}`;
  });
  return `{\n${parts.join(",\n")}\n}`;
}

mkdirSync(dirname(OUT), { recursive: true });
writeFileSync(OUT, dumpIndent0(dims) + "\n", "utf8");

console.log("referenced body images:", refs.size);
console.log("dims written:", Object.keys(dims).length);
console.log("missing (not on disk, will fallback):", missing.length);
for (const m of missing.slice(0, 50)) console.log("  MISSING:", m);
console.log("errors:", errors.length);
for (const e of errors.slice(0, 50)) console.log("  ERROR:", e);
console.log("output:", OUT);
