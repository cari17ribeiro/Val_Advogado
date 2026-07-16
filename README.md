# Val Advogado - Site, Revista Editorial e Editor Visual

Projeto Next.js com site institucional, revista digital de 20 páginas, versão A5 para impressão e painel administrativo conectado ao Supabase.

## V7 - Editorial e impressão

A V7 reorganiza a revista como uma publicação editorial pronta para revisão gráfica, preservando as informações do Val e utilizando azul-marinho, azul institucional, ciano e fundos claros.

Principais recursos:

- 20 páginas A5 com famílias de layout diferentes;
- capa editorial, sumário, biografia, páginas de abertura, mosaicos, cards, linha do tempo, participação popular e contracapa;
- maior quantidade de fotografias, com molduras polaroid, círculo, arco, recorte e cantos arredondados;
- modelos específicos para escolas de luta e apoio ao autismo;
- editor visual com elementos arrastáveis, redimensionáveis e organizados em camadas;
- verificação pré-impressão dentro do editor;
- linhas de corte, margem segura e suporte a sangria de 3 mm;
- PDF de prova no formato final A5, 148 x 210 mm;
- PDF para gráfica com sangria, 154 x 216 mm;
- revista digital separada da composição de impressão;
- layouts salvos em `magazine_pages.elements.canvas`.

## Rotas

- `/` - site institucional
- `/revista` - revista digital responsiva
- `/impressao` - prévia de impressão
- `/impressao?mode=bleed` - prévia com sangria
- `/api/pdf?mode=proof` - PDF de prova A5
- `/api/pdf?mode=bleed` - PDF para gráfica com sangria de 3 mm
- `/admin/login` - acesso administrativo
- `/admin` - editor visual

## Editor e pré-impressão

O painel mostra avisos para:

- elementos fora da margem segura;
- textos vazios ou muito densos;
- fontes pequenas para impressão;
- imagens ausentes;
- fotografias com zoom elevado e risco de corte;
- elementos que precisam alcançar a sangria.

Cada fotografia pode receber:

- modo preencher ou imagem inteira;
- posição horizontal e vertical;
- zoom;
- moldura editorial;
- sombra;
- opacidade e rotação.

## Fotografias finais

As imagens em `public/media` são cópias locais de segurança para a demonstração não depender de servidores externos. Antes da impressão definitiva, substitua-as pelos arquivos originais em alta resolução dentro da biblioteca do painel.

Para uma fotografia que ocupe uma página A5 inteira, use preferencialmente uma imagem próxima de 1748 x 2480 pixels ou superior para impressão a 300 dpi. Fotografias menores podem usar resolução proporcional ao espaço ocupado.

## Canva

O projeto não depende do Canva para produzir o PDF. Isso mantém o conteúdo, as permissões, o banco Supabase e a geração de impressão dentro do próprio sistema.

O Canva pode ser usado posteriormente como uma etapa opcional para acabamento manual. Uma integração bidirecional completa exigiria uma aplicação Canva Connect separada e criaria dois locais diferentes para editar a mesma página. Por isso, a arquitetura recomendada é:

1. editar conteúdo, fotografias e enquadramentos no painel do projeto;
2. validar margem segura e sangria;
3. gerar o PDF A5 ou o PDF com sangria;
4. usar o Canva apenas para ajustes gráficos excepcionais, quando realmente necessário.

## Supabase

Configure na Vercel:

```env
NEXT_PUBLIC_SUPABASE_URL=https://suwjmyetnifzeehirpxt.supabase.co
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=sua_chave_publicavel
```

Cadastre no Supabase Authentication um e-mail real que você controle e adicione o mesmo endereço à tabela `admin_allowlist`.

## Executar localmente

```bash
npm install
npm run dev
```

## Validação

Antes da tiragem definitiva:

- revise todos os textos, números, contatos e QR Codes;
- substitua as imagens de demonstração por originais em alta resolução;
- gere primeiro o PDF de prova;
- faça uma prova física;
- confirme com a gráfica se ela exige conversão CMYK e um perfil ICC específico.
