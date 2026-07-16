# Val Advogado — Site e Revista Digital

Versão 3 do projeto institucional do vereador Val Advogado, com site responsivo, revista digital interativa de 12 páginas e livreto A5 para impressão.

## Destaques da V3

- Identidade visual moderna em azul-marinho, azul elétrico e ciano.
- Cabeçalho flutuante com efeito glass.
- Hero responsivo com fotografia exibida por inteiro, sem corte de cabeça.
- Animações e transições com Framer Motion.
- Destaque especial para escolas de luta e apoio ao autismo.
- Revista reconstruída com áreas seguras e layouts independentes por página.
- Página dupla em computadores e página única em celulares e tablets menores.
- Navegação por botões, teclado, gesto de arrastar e índice por miniaturas.
- Livreto A5 com 12 páginas e geração de PDF.
- Respeito à configuração de movimento reduzido do dispositivo.

## Tecnologias

- Next.js
- React
- TypeScript
- Framer Motion
- Lucide React
- Puppeteer e Chromium para geração do PDF

## Como executar

```bash
npm install
npm run dev
```

Abra `http://localhost:3000`.

## Rotas

- `/` — site institucional
- `/revista` — revista digital interativa
- `/livreto` — prévia do livreto A5
- `/api/pdf` — geração e download do PDF

## Atualização pelo GitHub

Envie todas as pastas e arquivos deste pacote para a raiz do repositório e confirme a substituição dos arquivos existentes. A Vercel fará um novo deploy automaticamente após o commit.

Mensagem sugerida:

```text
feat: reconstruir identidade visual e revista na versão 3
```

## Observação sobre conteúdo

Textos, números, endereço, e-mail e links sociais devem ser revisados com o vereador antes da publicação definitiva. Os dados principais ficam em `content/site.ts`.
