# Site da Nayane Queiroz Marrocos, Psicóloga

Site estático (HTML, CSS e JavaScript simples), sem etapa de build. Uma única
página com duas versões:

- **Telas a partir de 900 px (computador):** portfólio completo.
- **Telas até 899 px (celular):** versão voltada a atendimento e contato, com
  botão fixo de WhatsApp.

## Estrutura

```
index.html            conteúdo das duas versões (.desk e .mob)
assets/css/styles.css estilos e cores (variáveis no topo do arquivo)
assets/js/main.js     formulário do celular (abre o WhatsApp) e ano do rodapé
assets/img/           fotos, logo (flor) e ícones
robots.txt, vercel.json
```

## Como editar

- **Textos:** abra `index.html` e procure o trecho. Os blocos `class="desk"`
  são do computador e `class="mob"` do celular. Se mudar um texto, mude nos dois.
- **Cores:** variáveis em `:root`, no começo de `assets/css/styles.css`.
- **Link do WhatsApp:** procure por `wa.me/5585999586711` (o texto depois de
  `?text=` é a mensagem que já vem escrita).
- **Fotos:** troque os arquivos de `assets/img/` mantendo os mesmos nomes
  (ou ajuste os caminhos no `index.html`). Use WebP ou JPG, com até uns
  200 KB cada.

## Antes de publicar

1. Se o site ganhar um domínio próprio, troque `nayane-portifolio.vercel.app` pelo novo endereço em `index.html`
   (tag `og:image` e bloco `application/ld+json`; use "buscar e substituir").
   Sem isso, a imagem de prévia ao compartilhar o link não aparece.
2. Confirme com o CRP-11 as regras de publicidade para psicólogos. O site
   evita depoimentos, valores e promessas de resultado de propósito.
3. Confira o público atendido, a lista de temas e as formas de pagamento.
4. Confirme o @ do Instagram. O site usa `psi.nayanemarrocos`.

## Como publicar na Vercel

1. Crie uma conta em vercel.com e clique em **Add New > Project**.
2. Envie esta pasta (pelo GitHub ou arrastando a pasta no painel).
3. Em *Framework Preset* escolha **Other**. Deixe build e output em branco.
4. Depois, em **Settings > Domains**, ligue o domínio próprio.

## Fontes

As fontes Libre Baskerville (títulos) e Lato (texto) carregam do Google Fonts.
Para evitar o envio do endereço IP dos visitantes ao Google (LGPD), baixe os
arquivos, coloque em `assets/fonts/` e troque o `<link>` do `index.html` por
regras `@font-face` no CSS.
