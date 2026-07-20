# Val Advogado - Site, Revista Editorial e Editor Visual

Projeto Next.js com site institucional, revista digital de 20 pÃ¡ginas, versÃ£o A5 para impressÃ£o e painel administrativo conectado ao Supabase.

## V7 - Editorial e impressÃ£o

A V7 reorganiza a revista como uma publicaÃ§Ã£o editorial pronta para revisÃ£o grÃ¡fica, preservando as informaÃ§Ãµes do Val e utilizando azul-marinho, azul institucional, ciano e fundos claros.

Principais recursos:

- 20 pÃ¡ginas A5 com famÃ­lias de layout diferentes;
- capa editorial, sumÃ¡rio, biografia, pÃ¡ginas de abertura, mosaicos, cards, linha do tempo, participaÃ§Ã£o popular e contracapa;
- maior quantidade de fotografias, com molduras polaroid, cÃ­rculo, arco, recorte e cantos arredondados;
- modelos especÃ­ficos para escolas de luta e apoio ao autismo;
- editor visual com elementos arrastÃ¡veis, redimensionÃ¡veis e organizados em camadas;
- verificaÃ§Ã£o prÃ©-impressÃ£o dentro do editor;
- linhas de corte, margem segura e suporte a sangria de 3 mm;
- PDF de prova no formato final A5, 148 x 210 mm;
- PDF para grÃ¡fica com sangria, 154 x 216 mm;
- revista digital separada da composiÃ§Ã£o de impressÃ£o;
- layouts salvos em `magazine_pages.elements.canvas`.

## Rotas

- `/` - site institucional
- `/revista` - revista digital responsiva
- `/impressao` - prÃ©via de impressÃ£o
- `/impressao?mode=bleed` - prÃ©via com sangria
- `/api/pdf?mode=proof` - PDF de prova A5
- `/api/pdf?mode=bleed` - PDF para grÃ¡fica com sangria de 3 mm
- `/admin/login` - acesso administrativo
- `/admin` - editor visual

## Editor e prÃ©-impressÃ£o

O painel mostra avisos para:

- elementos fora da margem segura;
- textos vazios ou muito densos;
- fontes pequenas para impressÃ£o;
- imagens ausentes;
- fotografias com zoom elevado e risco de corte;
- elementos que precisam alcanÃ§ar a sangria.

Cada fotografia pode receber:

- modo preencher ou imagem inteira;
- posiÃ§Ã£o horizontal e vertical;
- zoom;
- moldura editorial;
- sombra;
- opacidade e rotaÃ§Ã£o.

## Fotografias finais

As imagens em `public/media` sÃ£o cÃ³pias locais de seguranÃ§a para a demonstraÃ§Ã£o nÃ£o depender de servidores externos. Antes da impressÃ£o definitiva, substitua-as pelos arquivos originais em alta resoluÃ§Ã£o dentro da biblioteca do painel.

Para uma fotografia que ocupe uma pÃ¡gina A5 inteira, use preferencialmente uma imagem prÃ³xima de 1748 x 2480 pixels ou superior para impressÃ£o a 300 dpi. Fotografias menores podem usar resoluÃ§Ã£o proporcional ao espaÃ§o ocupado.

## Canva

O projeto nÃ£o depende do Canva para produzir o PDF. Isso mantÃ©m o conteÃºdo, as permissÃµes, o banco Supabase e a geraÃ§Ã£o de impressÃ£o dentro do prÃ³prio sistema.

O Canva pode ser usado posteriormente como uma etapa opcional para acabamento manual. Uma integraÃ§Ã£o bidirecional completa exigiria uma aplicaÃ§Ã£o Canva Connect separada e criaria dois locais diferentes para editar a mesma pÃ¡gina. Por isso, a arquitetura recomendada Ã©:

1. editar conteÃºdo, fotografias e enquadramentos no painel do projeto;
2. validar margem segura e sangria;
3. gerar o PDF A5 ou o PDF com sangria;
4. usar o Canva apenas para ajustes grÃ¡ficos excepcionais, quando realmente necessÃ¡rio.

## Supabase

Configure na Vercel:

```env
NEXT_PUBLIC_SUPABASE_URL=https://suwjmyetnifzeehirpxt.supabase.co
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=sua_chave_publicavel
```

Cadastre no Supabase Authentication um e-mail real que vocÃª controle e adicione o mesmo endereÃ§o Ã  tabela `admin_allowlist`.

## Executar localmente

```bash
npm install
npm run dev
```

## ValidaÃ§Ã£o

Antes da tiragem definitiva:

- revise todos os textos, nÃºmeros, contatos e QR Codes;
- substitua as imagens de demonstraÃ§Ã£o por originais em alta resoluÃ§Ã£o;
- gere primeiro o PDF de prova;
- faÃ§a uma prova fÃ­sica;
- confirme com a grÃ¡fica se ela exige conversÃ£o CMYK e um perfil ICC especÃ­fico.

# Correção de upload no Supabase

Se ao substituir imagens aparecer `new row violates row-level security policy`, aplique o arquivo
`SUPABASE_RLS_UPLOAD_FIX.sql` no SQL Editor do Supabase. Ele cria/ajusta as políticas do bucket
`val-media` e da tabela `media_library` para permitir upload, substituição e leitura das imagens
usadas pelo painel administrativo.
