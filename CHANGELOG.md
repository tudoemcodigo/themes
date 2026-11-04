# 📝 Changelog

Todas as mudanças relevantes do **themes** são registradas aqui. O formato segue o [Keep a Changelog](https://keepachangelog.com/pt-BR/1.1.0/) e o projeto usa [Versionamento Semântico](https://semver.org/lang/pt-BR/).

## [0.0.1] - não lançado

Versão inaugural: repositório de temas sazonais do ecossistema TEC.

### ✨ Adicionado

- **`themes.json`** (contrato `1`) com o tema `christmas-2026` (2026-12-01 a 2026-12-26, acento vermelho, casca verde e neve), contraste WCAG AA verificado nos dois modos.
- **Validador** (`scripts/validate.mjs`): esquema fechado, contraste, tipo por magic bytes, tamanho e referência dos assets; 14 testes (`node:test`), 100% de cobertura do validador.
- **Workflows**: `ci.yml` (validação, zizmor e `ci-ok`) e `pages.yml` (deploy no GitHub Pages depois de validar de novo); actions fixadas por SHA.
- Documentação no padrão TEC: README e `docs/` (publicar um tema, erros, segurança).

### ⚠️ Limites e itens não verificados

- Sem assets (banner e logo) no tema de Natal: o desenho visual é do dono.
- O consumo pelo `TEC.Bff` (`GET /bff/theme`) ainda não foi exercitado contra este deploy.
