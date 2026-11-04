---
titulo: Segurança do repositório de temas
tipo: explicacao
dono: Tudo em Código (mantenedor do repositório)
status: vigente
verificado-em: 2026-11-04
---

[🏠 themes](https://github.com/tudoemcodigo/themes/blob/main/README.md) › [📚 Documentação](https://github.com/tudoemcodigo/themes/blob/main/docs/README.md) › 🛡️ Segurança

# 🛡️ Segurança do repositório de temas

> Para quem avalia o risco. Este repositório muda a **aparência** de todos os sistemas; por isso quem publica e o que um tema consegue fazer são limitados de propósito.

## 📑 Sumário

- [🔐 Quem publica](#-quem-publica)
- [🧪 O que um tema consegue fazer](#-o-que-um-tema-consegue-fazer)
- [⚠️ Limites conhecidos](#️-limites-conhecidos)

## 🔐 Quem publica

| Controle | Valor |
|---|---|
| Quem pode alterar a `main` | Só o dono; PR obrigatório com o check `ci-ok`, sem force-push nem exclusão |
| O que o CI valida | Esquema fechado, contraste WCAG AA, tipo (magic bytes), tamanho e referência dos assets |
| Segredos | Nenhum; o deploy usa o `GITHUB_TOKEN` efêmero da execução |
| Varredura | Secret scanning com proteção de push ligado |

## 🧪 O que um tema consegue fazer

- Trocar **cores** de uma lista fechada de tokens, dentro dos limites de contraste.
- Escolher uma **animação** de um conjunto fechado (`none`, `snow`).
- Indicar **imagens** (PNG, WebP, AVIF) deste repositório, servidas pela mesma origem do sistema.

E **não** consegue: injetar CSS, JavaScript ou HTML; carregar nada de outra origem; alterar cores de erro, aviso ou sucesso; desligar o alto contraste do usuário; nem forçar o tema a quem o desligou.

## ⚠️ Limites conhecidos

- O manifesto **não é assinado** na v1: quem comprometer este repositório altera a aparência dentro dos limites acima, e nada além (ADR 0009 da Doutrina). A assinatura será reavaliada.
- O validador roda no CI; o `TEC.Bff` e a SPA repetem a validação, então um tema inválido que chegasse à `main` seria recusado em tempo de execução e os sistemas ficariam no tema padrão.

---

⬅️ [Erros](https://github.com/tudoemcodigo/themes/blob/main/docs/erros.md) · [Índice](https://github.com/tudoemcodigo/themes/blob/main/docs/README.md)
