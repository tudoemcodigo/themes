# Instruções para agentes de IA: themes

Repositório de temas sazonais do ecossistema TEC: um `themes.json` validado, publicado no GitHub Pages e consumido pelo `TEC.Bff`. Antes de mudar qualquer coisa, leia o [README](README.md) e as regras FRT-TEM (padrão 08) da Doutrina.

> O bloco `doutrina-tec` (núcleo da Doutrina) ainda **não foi distribuído** a este repositório: ele é gerado por `Doutrina/tools/distribuicao.py` e não deve ser editado à mão.

## Comandos que provam o trabalho

| Para | Rode |
|---|---|
| Validar temas (esquema, contraste, assets) | `npm run validate` |
| Testes do validador, com cobertura mínima de 90% | `npm test` |
| Tudo de uma vez | `npm run verify` |

Requer `NODE_AUTH_TOKEN` (PAT com `read:packages`, **nunca versionado**) para instalar `@tudoemcodigo/theme` do GitHub Packages.

## Regras do projeto

- **Tema é dado, nunca código** (FRT-TEM-01): sem CSS, JavaScript, HTML ou URL no `themes.json`; imagens só como nome de arquivo em `assets/<id>/`.
- Só tokens da lista permitida; erro, aviso e sucesso são protegidos (FRT-TEM-03). SVG é proibido.
- Todo tema passa pelo contraste WCAG AA nos dois modos antes de ir à `main`; não relaxe o validador para fazer um tema passar.
- Todo comportamento novo do validador traz teste negativo (entrada hostil), não só o feliz (CMP-AUD-01).
- Só o dono publica temas. **Não faça merge, deploy nem altere a `main` sem pedido explícito do dono** (IA-OPS-01).
- Desvio de regra `MUST` da Doutrina exige ADR; relate a divergência em vez de contornar.
