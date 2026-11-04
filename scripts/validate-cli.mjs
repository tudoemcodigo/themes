// CLI: node scripts/validate-cli.mjs. Sai com 1 se o repositório de temas tiver problema.
import { validateRepository } from './validate.mjs';

const problems = validateRepository(process.cwd());
for (const problem of problems) console.error(`✗ ${problem}`);
if (problems.length > 0) process.exit(1);
console.log('themes: ok');
