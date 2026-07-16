import type { MagazinePage } from './editor-types';

const rows = [
  ['cover', 'Val Advogado', 'Edição demonstrativa', 'Política se faz com presença, escuta e resultado.', 'Uma revista para prestar contas, aproximar pessoas e construir caminhos.'],
  ['biography', 'Uma história construída para servir.', 'Quem é Val?', 'Advogado por formação e servidor por vocação. Uma trajetória guiada pelo diálogo, pela defesa de direitos e pela convicção de que a política precisa estar onde as pessoas estão.', 'Ouvir com atenção é o primeiro passo para representar com responsabilidade.'],
  ['mosaic', 'Raízes, escolhas e compromisso.', 'Trajetória', 'Família, formação, trabalho e participação comunitária formam a base de uma atuação pública próxima, humana e preparada para transformar demandas em iniciativas.', 'Cada encontro ajuda a compreender melhor a cidade que queremos construir.'],
  ['editorial-dark', 'Um mandato que começa na rua.', 'Presença', 'Visitar bairros, ouvir moradores, acompanhar serviços e voltar com respostas: a presença constante transforma distância em confiança.', 'Quem conhece a realidade de perto propõe soluções mais justas.'],
  ['photo-story', 'Escuta que vira ação.', 'Mandato nas ruas', 'Demandas recebidas em visitas e reuniões são registradas, encaminhadas e acompanhadas. Transparência também significa mostrar cada etapa do trabalho.', 'Resultado começa quando a escuta continua depois da reunião.'],
  ['fight-intro', 'Esporte que abre caminhos.', 'Projeto de destaque', 'O apoio a escolas e iniciativas de luta pode ampliar oportunidades, fortalecer vínculos e oferecer novos horizontes para crianças e jovens.', 'No esporte, disciplina e acolhimento treinam juntos.'],
  ['fight-gallery', 'Disciplina, pertencimento e futuro.', 'Impacto do esporte', 'Mais do que aprender uma modalidade, cada participante encontra rotina, referências positivas, convivência e confiança para construir seu próprio caminho.', 'Uma rede forte transforma talento em oportunidade.'],
  ['autism-intro', 'Inclusão começa com compreensão.', 'Projeto de destaque', 'Acolher pessoas autistas e suas famílias exige informação acessível, serviços preparados, escuta sem julgamento e políticas construídas com quem vive essa realidade.', 'Nenhuma família deveria enfrentar sozinha o caminho até seus direitos.'],
  ['autism-actions', 'Uma cidade preparada para todas as formas de existir.', 'Cidade inclusiva', 'Acessibilidade, educação, saúde, convivência e apoio às famílias precisam funcionar como uma rede permanente, próxima e sem barreiras.', 'Incluir é garantir participação com autonomia, respeito e dignidade.'],
  ['projects', 'Cinco frentes, um compromisso.', 'Outras bandeiras', 'Saúde que acolhe, educação que abre portas, proteção animal, apoio às famílias e cidadania ativa: prioridades conectadas à vida real.', 'Projetos ganham sentido quando melhoram o cotidiano das pessoas.'],
  ['commitments', 'Compromissos em movimento.', 'Próximos passos', 'Escuta permanente, fiscalização responsável, transparência, projetos de impacto e participação popular orientam uma atuação que pode ser acompanhada.', 'Promessa pública precisa ter prazo, acompanhamento e prestação de contas.'],
  ['biography', 'O gabinete é um lugar de encontro.', 'Faça parte', 'Sugestões, denúncias, ideias e pedidos de orientação merecem atendimento claro. O gabinete aberto aproxima o cidadão das decisões públicas.', 'Participar é também acompanhar, perguntar e propor.'],
  ['fight-network', 'Uma rede que transforma pelo esporte.', 'Escolas de luta', 'Professores, academias, famílias e apoiadores podem formar uma rede capaz de oferecer estrutura, segurança e continuidade aos projetos esportivos.', 'Quando a comunidade entra no time, a oportunidade permanece.'],
  ['fight-stories', 'Histórias que começam no tatame.', 'Esporte social', 'Treino após treino, disciplina se transforma em confiança; convivência vira pertencimento; e uma nova perspectiva começa a tomar forma.', 'O primeiro aprendizado é acreditar que existe um próximo passo.'],
  ['autism-family', 'Cuidar também é acolher quem cuida.', 'Autismo e famílias', 'Orientação, informação e espaços de escuta ajudam famílias a encontrar serviços, compreender direitos e construir redes de apoio mais seguras.', 'Famílias acolhidas caminham com mais informação e menos solidão.'],
  ['autism-guide', 'Direitos e serviços em linguagem acessível.', 'Guia de apoio', 'Um ponto de partida para reunir canais de atendimento, agenda, materiais informativos e orientações úteis para famílias, escolas e profissionais.', 'Informação clara reduz barreiras e aproxima direitos.'],
  ['timeline', 'Da escuta ao resultado.', 'Como trabalhamos', 'Cada demanda percorre um caminho visível: recebimento, verificação, proposição, acompanhamento e devolutiva para a comunidade.', 'Transparência é permitir que cada pessoa saiba o que aconteceu depois.'],
  ['visual-diary', 'Pessoas no centro da agenda.', 'Diário visual', 'Reuniões, visitas, projetos e encontros mostram uma política feita com gente, presença e disposição para construir soluções coletivas.', 'A cidade aparece inteira quando diferentes vozes cabem na mesma conversa.'],
  ['participation', 'Sua voz também constrói o mandato.', 'Participação popular', 'Canais digitais e presenciais aproximam ideias, demandas e decisões. Participe de consultas, envie sugestões e acompanhe os encaminhamentos.', 'Uma cidade mais democrática começa com mais gente participando.'],
  ['final-back-cover', 'Transparência, presença e ação.', 'Val Advogado', 'Acompanhe, participe e cobre resultados. Este espaço também é seu.', 'Política de verdade é feita perto, com diálogo e responsabilidade.'],
];

export const fallbackPages: MagazinePage[] = rows.map((row, index) => ({
  id: `fallback-${index + 1}`,
  page_number: index + 1,
  template: row[0],
  title: row[1],
  subtitle: row[2],
  body: row[3],
  quote: row[4] || null,
  background: null,
  elements: {},
  is_published: true,
}));
