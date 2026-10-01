#!/usr/bin/env node
/**
 * Мини-типограф для русских текстов в исходниках.
 *
 *   npm run typograf
 *
 * Правила (применяются только к строкам с кириллицей, код не трогается):
 *  1. Короткие слова (1–2 буквы: «в», «и», «на», «по», «не»…) привязываются к следующему
 *     слову неразрывным пробелом — без висячих предлогов в конце строки.
 *  2. Перед тире « — » ставится неразрывный пробел — тире не переносится в начало строки.
 *  3. Число и единица («4 800 ₽», «390 px», «5 мин») не разрываются.
 *
 * Скрипт идемпотентен: повторный запуск ничего не меняет.
 */
import { readdirSync, readFileSync, statSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const NBSP = " ";
const ROOTS = ["src/config", "src/components", "src/app", "src/lib/validation", "src/lib/server/spam.ts"];
const CYRILLIC = /[А-Яа-яЁё]/;
// Частицы, которые относятся к предыдущему слову, а не к следующему.
const TRAILING = new Set(["же", "ли", "бы", "ль", "ж", "б"]);

function files(path) {
  if (statSync(path).isFile()) return [path];
  return readdirSync(path).flatMap((name) => files(join(path, name)));
}

function typografLine(line) {
  if (!CYRILLIC.test(line)) return line;
  let out = line.replace(/(?<=[^\s—])\s—\s/g, `${NBSP}— `);
  out = out.replace(
    /(?<![А-Яа-яЁёA-Za-z0-9-])([А-Яа-яЁё]{1,2}) (?=[А-Яа-яЁёA-Za-z0-9«(])/g,
    (match, word) => (TRAILING.has(word.toLowerCase()) ? match : `${word}${NBSP}`),
  );
  out = out.replace(/(\d) (?=\d{3}\b)/g, `$1${NBSP}`);
  out = out.replace(/(\d) (?=(₽|px|мин|FPS|символ))/g, `$1${NBSP}`);
  return out;
}

let changed = 0;
for (const file of ROOTS.flatMap(files).filter((f) => /\.(ts|tsx)$/.test(f))) {
  const src = readFileSync(file, "utf8");
  const next = src.split("\n").map(typografLine).join("\n");
  if (next !== src) {
    writeFileSync(file, next);
    changed++;
    console.log("typograf:", file);
  }
}
console.log(changed ? `Обновлено файлов: ${changed}` : "Всё уже в порядке.");
