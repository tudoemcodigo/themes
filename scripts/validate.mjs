// Valida o repositório de temas (FRT-TEM-08): esquema fechado, contraste WCAG AA, tipo, tamanho e existência dos
// assets, e assets órfãos. Roda no CI de todo PR e antes do deploy; o BFF e a SPA repetem a validação (defesa em
// profundidade), mas um tema ruim nem deve chegar à main.
import { existsSync, readdirSync, readFileSync, statSync } from 'node:fs';
import { extname, join } from 'node:path';
import { findContrastViolations, parseThemesDocument } from '@tudoemcodigo/theme/core';

export const MAX_DOCUMENT_BYTES = 256 * 1024;
export const MAX_ASSET_BYTES = 512 * 1024;

const MAGIC = {
  '.png': (bytes) => bytes.length >= 8 && bytes.subarray(0, 8).equals(Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a])),
  '.webp': (bytes) => bytes.length >= 12 && bytes.subarray(0, 4).toString('latin1') === 'RIFF' && bytes.subarray(8, 12).toString('latin1') === 'WEBP',
  '.avif': (bytes) => bytes.length >= 12 && bytes.subarray(4, 12).toString('latin1') === 'ftypavif',
};

function listAssets(assetsDir) {
  if (!existsSync(assetsDir)) return [];
  return readdirSync(assetsDir, { withFileTypes: true }).flatMap((themeDir) => {
    if (!themeDir.isDirectory()) return [`assets/${themeDir.name}`];
    return readdirSync(join(assetsDir, themeDir.name)).map((file) => `assets/${themeDir.name}/${file}`);
  });
}

/** @returns {string[]} problemas encontrados (vazio quando o repositório está conforme). */
export function validateRepository(root) {
  const problems = [];
  const documentPath = join(root, 'themes.json');

  if (!existsSync(documentPath)) return ['themes.json não existe'];
  if (statSync(documentPath).size > MAX_DOCUMENT_BYTES) {
    return [`themes.json passa de ${String(MAX_DOCUMENT_BYTES)} bytes`];
  }

  let raw;
  try {
    raw = JSON.parse(readFileSync(documentPath, 'utf8'));
  } catch {
    return ['themes.json não é JSON válido'];
  }

  const parsed = parseThemesDocument(raw);
  if (!parsed.ok) return [`themes.json: ${parsed.error}`];

  const referenced = new Set();
  for (const theme of parsed.value.themes) {
    for (const violation of findContrastViolations(theme.tokens)) {
      problems.push(
        `${theme.id}: contraste ${violation.mode} ${violation.foreground}/${violation.background} = ${violation.ratio.toFixed(2)} (mínimo ${String(violation.minimum)})`,
      );
    }
    for (const file of Object.values(theme.assets)) {
      const relative = `assets/${theme.id}/${file}`;
      referenced.add(relative);
      const path = join(root, relative);
      if (!existsSync(path)) {
        problems.push(`${theme.id}: asset ${relative} não existe`);
        continue;
      }
      if (statSync(path).size > MAX_ASSET_BYTES) {
        problems.push(`${theme.id}: asset ${relative} passa de ${String(MAX_ASSET_BYTES)} bytes`);
        continue;
      }
      const check = MAGIC[extname(file).toLowerCase()];
      if (check === undefined || !check(readFileSync(path))) {
        problems.push(`${theme.id}: asset ${relative} não é uma imagem ${extname(file).slice(1)} de verdade`);
      }
    }
  }

  for (const asset of listAssets(join(root, 'assets'))) {
    if (!referenced.has(asset)) problems.push(`asset órfão (não referenciado por nenhum tema): ${asset}`);
  }
  return problems;
}
