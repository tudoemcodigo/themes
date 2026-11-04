import assert from 'node:assert/strict';
import { mkdirSync, mkdtempSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { afterEach, describe, it } from 'node:test';
import { MAX_ASSET_BYTES, MAX_DOCUMENT_BYTES, validateRepository } from '../scripts/validate.mjs';

const PNG = Buffer.concat([Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]), Buffer.alloc(16)]);
const WEBP = Buffer.concat([Buffer.from('RIFF'), Buffer.alloc(4), Buffer.from('WEBP'), Buffer.alloc(8)]);
const AVIF = Buffer.concat([Buffer.alloc(4), Buffer.from('ftypavif'), Buffer.alloc(8)]);

const theme = (extra = {}) => ({
  id: 'christmas-2026',
  from: '2026-12-01',
  to: '2026-12-26',
  tokens: {
    'color-accent': { light: '#b3001b', dark: '#ff9aa6' },
    'color-on-accent': { light: '#ffffff', dark: '#1a0004' },
  },
  ...extra,
});

const roots = [];
function repo(document, assets = {}) {
  const root = mkdtempSync(join(tmpdir(), 'themes-test-'));
  roots.push(root);
  if (document !== undefined) {
    writeFileSync(join(root, 'themes.json'), typeof document === 'string' ? document : JSON.stringify(document));
  }
  for (const [relative, content] of Object.entries(assets)) {
    const path = join(root, relative);
    mkdirSync(join(path, '..'), { recursive: true });
    writeFileSync(path, content);
  }
  return root;
}

afterEach(() => {
  while (roots.length > 0) rmSync(roots.pop(), { recursive: true, force: true });
});

const doc = (...themes) => ({ contract: 1, themes });
const hasProblem = (problems, text) => problems.some((problem) => problem.includes(text));

describe('repositório conforme', () => {
  it('tema com tokens e sem assets passa', () => {
    assert.deepEqual(validateRepository(repo(doc(theme()))), []);
  });

  it('tema com os três formatos de asset passa', () => {
    const root = repo(doc(theme({ assets: { banner: 'banner.webp', logo: 'logo.png' } })), {
      'assets/christmas-2026/banner.webp': WEBP,
      'assets/christmas-2026/logo.png': PNG,
    });
    assert.deepEqual(validateRepository(root), []);
    const avif = repo(doc(theme({ assets: { banner: 'banner.avif' } })), {
      'assets/christmas-2026/banner.avif': AVIF,
    });
    assert.deepEqual(validateRepository(avif), []);
  });

  it('documento sem temas passa', () => {
    assert.deepEqual(validateRepository(repo(doc())), []);
  });
});

describe('documento hostil', () => {
  it('sem themes.json', () => {
    assert.deepEqual(validateRepository(repo(undefined)), ['themes.json não existe']);
  });

  it('JSON malformado', () => {
    assert.deepEqual(validateRepository(repo('{nao-e-json')), ['themes.json não é JSON válido']);
  });

  it('documento gigante é recusado antes de ser lido', () => {
    const big = JSON.stringify({ contract: 1, themes: [], pad: 'x'.repeat(MAX_DOCUMENT_BYTES) });
    assert.ok(hasProblem(validateRepository(repo(big)), 'passa de'));
  });

  it('esquema fechado: token protegido, campo extra e injeção de CSS', () => {
    const protectedToken = theme({ tokens: { 'color-error': { light: '#000000', dark: '#ffffff' } } });
    assert.ok(hasProblem(validateRepository(repo(doc(protectedToken))), 'themes.json:'));
    assert.ok(hasProblem(validateRepository(repo(doc(theme({ css: 'body{display:none}' })))), 'themes.json:'));
    const injection = theme({ tokens: { 'color-accent': { light: '#fff;}body{x:y', dark: '#ffffff' } } });
    assert.ok(hasProblem(validateRepository(repo(doc(injection))), 'themes.json:'));
  });

  it('ids duplicados e datas impossíveis', () => {
    assert.ok(hasProblem(validateRepository(repo(doc(theme(), theme()))), 'duplicado'));
    assert.ok(hasProblem(validateRepository(repo(doc(theme({ from: '2026-02-30' })))), 'themes.json:'));
  });
});

describe('contraste (WCAG AA)', () => {
  it('tema que reprova é recusado com o par e a razão', () => {
    const bad = theme({ tokens: { 'color-accent': { light: '#f7f9f9', dark: '#222a3f' } } });
    const problems = validateRepository(repo(doc(bad)));
    assert.ok(hasProblem(problems, 'contraste light color-accent/color-bg'));
    assert.ok(hasProblem(problems, 'contraste dark color-accent/color-bg'));
  });
});

describe('assets', () => {
  it('asset referenciado que não existe', () => {
    assert.ok(hasProblem(validateRepository(repo(doc(theme({ assets: { logo: 'logo.png' } })))), 'não existe'));
  });

  it('extensão que não bate com o conteúdo (script renomeado para png)', () => {
    const root = repo(doc(theme({ assets: { logo: 'logo.png' } })), {
      'assets/christmas-2026/logo.png': Buffer.from('<script>alert(1)</script>'),
    });
    assert.ok(hasProblem(validateRepository(root), 'não é uma imagem png de verdade'));
  });

  it('um tipo de imagem no lugar de outro (png com extensão webp)', () => {
    const root = repo(doc(theme({ assets: { banner: 'banner.webp' } })), {
      'assets/christmas-2026/banner.webp': PNG,
    });
    assert.ok(hasProblem(validateRepository(root), 'não é uma imagem webp'));
  });

  it('asset acima do teto de bytes', () => {
    const root = repo(doc(theme({ assets: { logo: 'logo.png' } })), {
      'assets/christmas-2026/logo.png': Buffer.concat([PNG, Buffer.alloc(MAX_ASSET_BYTES)]),
    });
    assert.ok(hasProblem(validateRepository(root), 'passa de'));
  });

  it('asset órfão (arquivo que nenhum tema referencia) e arquivo solto em assets/', () => {
    const root = repo(doc(theme()), {
      'assets/christmas-2026/sobrando.png': PNG,
      'assets/solto.png': PNG,
    });
    const problems = validateRepository(root);
    assert.ok(hasProblem(problems, 'órfão (não referenciado por nenhum tema): assets/christmas-2026/sobrando.png'));
    assert.ok(hasProblem(problems, 'órfão (não referenciado por nenhum tema): assets/solto.png'));
  });
});
