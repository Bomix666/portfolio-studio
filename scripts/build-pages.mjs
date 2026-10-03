#!/usr/bin/env node
/**
 * Статическая сборка для GitHub Pages: `npm run build:pages` → папка `out/`.
 *
 * Серверные маршруты (src/app/api) в статической выгрузке не поддерживаются, поэтому на время
 * сборки они переносятся во временную папку и возвращаются на место — даже если сборка упала.
 *
 * Переменные (можно переопределить в окружении):
 *   NEXT_PUBLIC_BASE_PATH   подпуть сайта, по умолчанию /portfolio-studio (для project-страницы Pages);
 *                           для своего домена или user-страницы задайте пустую строку.
 *   NEXT_PUBLIC_SITE_URL    полный адрес сайта (canonical, sitemap, OG).
 */
import { spawnSync } from "node:child_process";
import { copyFileSync, existsSync, mkdirSync, readdirSync, readFileSync, renameSync, rmSync, statSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";

const API_DIR = "src/app/api";
const BACKUP = ".pages-backup/api";

const env = { ...process.env, NEXT_PUBLIC_STATIC_EXPORT: "true" };
env.NEXT_PUBLIC_BASE_PATH ??= "/portfolio-studio";
env.NEXT_PUBLIC_SITE_URL ??= `https://${process.env.GITHUB_REPOSITORY_OWNER ?? "bomix666"}.github.io${env.NEXT_PUBLIC_BASE_PATH}`;

// Если прошлый запуск оборвался — сначала вернуть API на место.
if (existsSync(BACKUP) && !existsSync(API_DIR)) renameSync(BACKUP, API_DIR);

let moved = false;
let code = 1;
try {
  if (existsSync(API_DIR)) {
    mkdirSync(dirname(BACKUP), { recursive: true });
    renameSync(API_DIR, BACKUP);
    moved = true;
  }
  rmSync("out", { recursive: true, force: true });
  rmSync(".next", { recursive: true, force: true });
  const run = spawnSync("npx", ["next", "build"], { stdio: "inherit", env, shell: true });
  code = run.status ?? 1;
  if (code === 0) {
    fixOpenGraphImage();
    flattenSegmentFiles();
  }
} finally {
  if (moved) renameSync(BACKUP, API_DIR);
  rmSync(".pages-backup", { recursive: true, force: true });
}
process.exit(code);

/**
 * GitHub Pages определяет Content-Type по расширению, а Next кладёт OG-картинку в файл
 * `opengraph-image` без расширения (отдавалась бы как octet-stream — превью в соцсетях ломаются).
 * Делаем копию `opengraph-image.png` и переписываем на неё ссылки во всех HTML.
 */
function fixOpenGraphImage() {
  const src = join("out", "opengraph-image");
  if (!existsSync(src) || !statSync(src).isFile()) return;
  copyFileSync(src, join("out", "opengraph-image.png"));
  const walk = (dir) =>
    readdirSync(dir, { withFileTypes: true }).flatMap((e) =>
      e.isDirectory() ? walk(join(dir, e.name)) : e.name.endsWith(".html") ? [join(dir, e.name)] : [],
    );
  for (const file of walk("out")) {
    const html = readFileSync(file, "utf8");
    const next = html.replace(/\/opengraph-image\?[A-Za-z0-9]+/g, "/opengraph-image.png");
    if (next !== html) writeFileSync(file, next);
  }
}

/**
 * Предзагрузка сегментов: Next выгружает `X/__next.a/b.txt`, а клиент запрашивает плоское имя
 * `X/__next.a.b.txt` (иначе — 404 и жёсткая перезагрузка вместо плавного перехода).
 * Кладём рядом плоские копии для каждого такого файла.
 */
function flattenSegmentFiles() {
  const walk = (dir) => {
    for (const e of readdirSync(dir, { withFileTypes: true })) {
      const full = join(dir, e.name);
      if (!e.isDirectory()) continue;
      if (e.name.startsWith("__next.")) {
        const files = (d, prefix) =>
          readdirSync(d, { withFileTypes: true }).flatMap((f) =>
            f.isDirectory() ? files(join(d, f.name), `${prefix}.${f.name}`) : [[join(d, f.name), `${prefix}.${f.name}`]],
          );
        for (const [from, flatName] of files(full, e.name)) copyFileSync(from, join(dir, flatName));
      } else {
        walk(full);
      }
    }
  };
  walk("out");
}
