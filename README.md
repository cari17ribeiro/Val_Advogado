# Val Advogado — Site, Revista e Editor Visual

Projeto Next.js com site institucional, revista digital de 20 páginas, versão A5 para impressão e painel administrativo conectado ao Supabase.

## V6 — Editor visual A5

A V6 substitui o formulário simples da revista por um editor visual inspirado em ferramentas como Canva:

- canvas A5 com proporção fixa de impressão;
- elementos de texto, fotografia, forma e ícone;
- arrastar e redimensionar diretamente na página;
- posição e tamanho armazenados em porcentagem, mantendo o layout responsivo;
- escolha de fonte, tamanho, peso, alinhamento, cor e opacidade;
- controle de camadas, bloqueio, duplicação e exclusão;
- ajuste individual de fotografia: preencher, imagem inteira, foco horizontal, foco vertical e zoom;
- cor, degradê ou imagem no fundo da página;
- margem segura para impressão;
- desfazer e refazer;
- movimentação fina pelo teclado;
- biblioteca com as fotografias enviadas;
- 20 modelos editoriais iniciais;
- texto com redução automática para não ser cortado;
- a mesma composição é usada na revista digital e no PDF.

## Rotas

- `/` — site institucional
- `/revista` — revista digital responsiva
- `/impressao` — prévia A5 para impressão
- `/api/pdf` — geração do PDF
- `/admin/login` — acesso administrativo
- `/admin` — editor visual

## Atalhos do editor

- `Ctrl/Cmd + S` — salvar página
- `Ctrl/Cmd + Z` — desfazer
- `Ctrl/Cmd + Shift + Z` — refazer
- `Ctrl/Cmd + D` — duplicar elemento
- `Delete` — excluir elemento
- setas — mover elemento
- `Shift + setas` — mover com passo maior

## Supabase

O editor usa as tabelas `magazine_pages` e `media_library` e o bucket `val-media`. O documento visual fica em `magazine_pages.elements.canvas`, sem exigir uma nova tabela.

Configure na Vercel:

```env
NEXT_PUBLIC_SUPABASE_URL=https://suwjmyetnifzeehirpxt.supabase.co
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=sua_chave_publicavel
```

A chave publicável pode ficar no navegador porque as operações administrativas continuam protegidas pelo login e pelas políticas RLS.

## Usuário administrativo

Cadastre no Supabase Authentication um e-mail real que você controle ou crie um usuário com **Auto Confirm User**. Depois adicione o mesmo endereço à tabela `admin_allowlist`.

## Executar localmente

```bash
npm install
npm run dev
```

## Conteúdo

Revise textos, contatos, números e fotografias antes da publicação definitiva. Os modelos iniciais usam imagens existentes no projeto como demonstração e podem ser substituídos dentro do editor.
