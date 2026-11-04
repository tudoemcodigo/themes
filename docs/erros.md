---
titulo: Erros do validador de temas
tipo: referencia
dono: Tudo em Código (mantenedor do repositório)
status: vigente
verificado-em: 2026-11-04
---

[🏠 themes](https://github.com/tudoemcodigo/themes/blob/main/README.md) › [📚 Documentação](https://github.com/tudoemcodigo/themes/blob/main/docs/README.md) › ❌ Erros

# ❌ Erros do validador de temas

> Para quem teve o PR reprovado. Cada mensagem aponta o tema e o campo; o valor recebido nunca é repetido.

| Mensagem começa com | Causa | Correção |
|---|---|---|
| `themes.json não existe` | Arquivo ausente na raiz | Restaurar o `themes.json` |
| `themes.json não é JSON válido` | Vírgula, aspa ou chave faltando | Validar o JSON no editor |
| `themes.json passa de 262144 bytes` | Documento acima de 256 KiB | Reduzir; um documento desse tamanho indica conteúdo indevido |
| `themes.json: ...: campo desconhecido` | Campo fora do contrato (por exemplo `css`) | Remover; o contrato é fechado |
| `themes.json: ...: token desconhecido ou protegido` | Token inexistente ou de erro, aviso ou sucesso | Usar só os [tokens trocáveis](https://github.com/tudoemcodigo/lib-tec-web/blob/main/docs/tema.md#-tokens) |
| `themes.json: ...: cor deve ser #rrggbb` | Cor com 3 dígitos, `url()`, alfa ou texto | Usar `#rrggbb` |
| `themes.json: ...: from e to devem ser datas AAAA-MM-DD reais` | Data inexistente (30 de fevereiro) ou formato errado | Corrigir a data |
| `themes.json: ...: id duplicado` | Dois temas com o mesmo `id` | Dar um `id` único |
| `<id>: contraste <modo> <fg>/<bg> = N (mínimo M)` | O par de cores reprova no WCAG AA | Ajustar a cor; o texto traz o par e a razão |
| `<id>: asset assets/... não existe` | Arquivo referenciado ausente | Adicionar em `assets/<id>/` |
| `<id>: asset ... passa de 524288 bytes` | Imagem acima de 512 KiB | Comprimir |
| `<id>: asset ... não é uma imagem ... de verdade` | O conteúdo não bate com a extensão (script renomeado, PNG com extensão `.webp`) | Exportar a imagem no formato certo |
| `asset órfão (não referenciado por nenhum tema)` | Arquivo em `assets/` que nenhum tema usa | Remover ou referenciar |

---

⬅️ [Publicar um tema](https://github.com/tudoemcodigo/themes/blob/main/docs/publicar-tema.md) · [Índice](https://github.com/tudoemcodigo/themes/blob/main/docs/README.md) · ➡️ [Segurança](https://github.com/tudoemcodigo/themes/blob/main/docs/seguranca.md)
