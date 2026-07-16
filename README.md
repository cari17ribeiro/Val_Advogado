# Val Advogado

Projeto institucional com três experiências integradas:

- `/` — site responsivo;
- `/revista` — revista digital em páginas duplas;
- `/livreto` — prévia de impressão A5;
- `/api/pdf` — gera e baixa o PDF atual pela Vercel;
- `/downloads/val-advogado-livreto-a5.pdf` — PDF de segurança pronto para gráfica.

## Rodar localmente

```bash
npm install
npm run dev
```

## Publicar na Vercel

1. Crie um repositório vazio no GitHub chamado `Val_Advogado`.
2. Envie estes arquivos para a branch `main`.
3. Na Vercel, importe o repositório; o framework Next.js será detectado automaticamente.

## Conteúdo

Os textos principais ficam em `content/site.ts`. Substitua fotos externas por arquivos em `public/images` antes da impressão final.

## PDF

O botão “Gerar e baixar PDF” chama `/api/pdf`. A função abre `/livreto` em Chromium e imprime em A5. Se a função não puder iniciar o navegador, o sistema baixa automaticamente o PDF de segurança em `public/downloads`.
