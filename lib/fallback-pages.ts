import type { MagazinePage } from './editor-types';

const rows = [
  ['cover','Val Advogado','Edição 01','O que eu faço é da sua conta.'],
  ['biography','Uma vida dedicada a servir.','Quem é Val?','Advogado por formação e servidor por vocação.'],
  ['mosaic','História feita de presença.','Trajetória','Família, atuação pública e projetos sociais.'],
  ['editorial-dark','O mandato acontece perto das pessoas.','Presença','Visitas, escuta ativa e fiscalização.'],
  ['photo-story','Trabalho de campo','Mandato nas ruas','Fiscalização contínua, ouvidoria móvel e apoio comunitário.'],
  ['fight-intro','Esporte que abre caminhos.','Projeto de destaque','O apadrinhamento de escolas de luta fortalece oportunidades.'],
  ['fight-gallery','Disciplina, pertencimento e oportunidade.','Impacto do esporte','Projetos que acolhem crianças e jovens.'],
  ['autism-intro','Inclusão começa com compreensão.','Projeto de destaque','Apoio às pessoas autistas e suas famílias.'],
  ['autism-actions','Uma cidade preparada para todas as formas de existir.','Cidade inclusiva','Acolhimento, acessibilidade, informação e respeito.'],
  ['projects','Projetos que mudam realidades.','Outras bandeiras','Saúde, educação, proteção animal e apoio às famílias.'],
  ['commitments','Compromissos em movimento.','Próximos passos','Ações permanentes, fiscalização e participação popular.'],
  ['biography','O gabinete está sempre de portas abertas.','Faça parte','Envie sugestões e acompanhe o trabalho.'],
  ['fight-network','Uma rede que transforma pelo esporte.','Escolas de luta','Modalidades, professores e iniciativas apoiadas.'],
  ['fight-stories','Histórias que começam no tatame.','Esporte social','Disciplina e pertencimento abrindo novos caminhos.'],
  ['autism-family','Acolher também é cuidar de quem cuida.','Autismo e famílias','Informação e orientação para fortalecer as famílias.'],
  ['autism-guide','Direitos, serviços e informação acessível.','Guia de apoio','Conteúdos úteis para famílias e profissionais.'],
  ['timeline','Presença que pode ser acompanhada.','Linha do tempo','Ações, visitas, fiscalizações e resultados.'],
  ['visual-diary','Fotos que contam o trabalho.','Diário visual','Um mosaico de encontros, projetos e ações.'],
  ['participation','Sua voz também constrói o mandato.','Participação popular','Contato, enquetes, sugestões e redes sociais.'],
  ['final-back-cover','Transparência, presença e ação.','Val Advogado','Acompanhe, participe e cobre resultados.'],
];

export const fallbackPages: MagazinePage[] = rows.map((row, index) => ({
  id: `fallback-${index + 1}`,
  page_number: index + 1,
  template: row[0],
  title: row[1],
  subtitle: row[2],
  body: row[3],
  quote: null,
  background: null,
  elements: {},
  is_published: true,
}));
