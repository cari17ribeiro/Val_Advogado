import type { MagazinePage } from './editor-types';

const rows = [
  ['cover', 'Val Advogado', 'Edição 01 - 2026', 'O que eu faço é da sua conta.', 'Uma vida transformada pela educação. Um mandato dedicado a transformar outras vidas.'],
  ['biography', 'Filho de um pedreiro e de uma bordadeira.', 'Quem é Val?', 'Val construiu sua trajetória a partir de uma história de origem humilde, trabalho e transformação pela educação. Formou-se advogado e levou para a vida pública a missão de criar oportunidades e defender quem mais precisa ser visto, ouvido e incluído.', 'Educação mudou a minha vida. Agora, o mandato trabalha para transformar outras vidas.'],
  ['mosaic', 'Origem, família e compromisso público.', 'Trajetória', 'A experiência de quem conhece de perto a realidade das famílias guia um mandato com presença nos bairros, escuta ativa, defesa de direitos e busca de soluções concretas para Guarujá.', 'A política precisa estar onde as pessoas estão.'],
  ['editorial-dark', 'Guarujá e Brasília conectados.', 'Parceria com Renata Abreu', 'A parceria entre Val Advogado e a deputada federal Renata Abreu fortalece a voz de Guarujá em Brasília, aproximando demandas locais de recursos, investimentos e políticas públicas.', 'Uma parceria construída em torno de causas em comum e resultados concretos.'],
  ['photo-story', 'R$ 2 milhões para segurança.', 'Resultado concreto', 'Com Renata Abreu, Val conquistou R$ 2 milhões para investimentos em segurança e também articulou recursos para o terceiro setor, incluindo o fortalecimento da APAAG.', 'Segurança se faz com investimento, tecnologia e presença do poder público.'],
  ['autism-intro', 'Mais de R$ 1 milhão para inclusão e TEA.', 'Inclusão', 'As emendas impositivas fortalecem instituições que atendem pessoas autistas, ampliam terapias, acompanhamento especializado, equipes multidisciplinares e acolhimento às famílias, especialmente às mães atípicas.', 'Cuidar também de quem cuida.'],
  ['autism-actions', 'APAAG - R$ 385 mil.', 'Atendimento especializado', 'Os recursos destinados à APAAG ajudam a ampliar o atendimento para jovens e adultos neurodivergentes, com profissionais como neuropediatra, psiquiatra e outros especialistas da área da saúde.', 'Diagnóstico, acompanhamento contínuo e tratamento humanizado.'],
  ['autism-family', 'Projeto Universo - R$ 503 mil.', 'Rede multidisciplinar', 'A emenda fortalece a estrutura física da instituição e viabiliza profissionais como neuropsicólogo, psicopedagoga, fisioterapeuta e equipe multidisciplinar, além de apoio psicológico e social às mães atípicas.', 'Quando a família é acolhida, o cuidado fica mais forte.'],
  ['autism-guide', 'Pequenos Herdeiros - R$ 200 mil.', 'Desenvolvimento infantil', 'O investimento melhora a estrutura, garante materiais e apoia a contratação de profissionais especializados para ampliar o atendimento a crianças atípicas.', 'Inclusão precisa de ambiente preparado, equipe e continuidade.'],
  ['projects', 'Educação especial e acessibilidade.', 'Cidade inclusiva', 'Capacitação continuada para professores sobre autismo, substituição de sirenes escolares por sinais mais adequados, reserva de assento para acompanhantes de pessoas com deficiência ou TEA e cardápios em braille.', 'Acessibilidade é autonomia na prática.'],
  ['fight-intro', 'Mais de R$ 710 mil para o esporte.', 'Esporte social', 'Val acredita no esporte como instrumento de disciplina, inclusão, oportunidade e transformação. Os recursos apoiam projetos que atendem crianças, adolescentes, jovens e adultos.', 'Cada treino pode abrir caminho para um futuro melhor.'],
  ['fight-gallery', 'Modalidades que formam cidadãos.', 'Atletas e projetos', 'Muay thai, boxe, jiu-jitsu, kickboxing, wrestling, natação, futebol e tênis de mesa fazem parte da rede apoiada pelo mandato, com materiais, equipamentos, estrutura e divulgação.', 'Disciplina, convivência e respeito também são políticas públicas.'],
  ['fight-network', 'Amigos da Elite, HM Clan e Vila Zilda.', 'Entidades esportivas', 'As emendas fortalecem modalidades de luta, funcional, futebol, NoGi e tênis de mesa, melhorando condições de treino e ampliando o acesso da comunidade ao esporte.', 'Uma rede forte transforma talento em oportunidade.'],
  ['timeline', 'Saúde com acesso e futuro.', 'Saúde pública', 'Defesa da telemedicina, mutirões de atendimento especializado, acompanhamento do futuro Hospital Municipal e propostas para ampliar tratamentos na rede pública municipal.', 'Saúde digna começa com acesso, escuta e acompanhamento.'],
  ['projects', 'Lei nº 5.303: microchipagem gratuita.', 'Proteção animal', 'A lei da microchipagem gratuita, o cadastro no Simpatinhas, a defesa das castrações e o apoio a ONGs fortalecem o combate ao abandono e aos maus-tratos.', 'Cuidar dos animais também é cuidar da cidade.'],
  ['commitments', 'Água, saneamento e fiscalização.', 'Serviços públicos', "Val atua na cobrança de soluções para falta d'água, baixa pressão, vazamentos, falhas sem justificativa e desassoreamento de rios e canais para reduzir alagamentos.", 'Problema recorrente precisa de cobrança constante.'],
  ['projects', 'Direitos das mulheres e rede de proteção.', 'Disque 180', 'A divulgação obrigatória do Disque 180 e ações de conscientização fortalecem a prevenção, a orientação e o enfrentamento à violência contra a mulher.', 'Informação salva vidas e aproxima ajuda.'],
  ['visual-diary', 'Empreendedorismo e geração de renda.', 'Desenvolvimento', 'Regulamentação do comércio eletrônico municipal, apoio aos pequenos empreendedores, desburocratização e incentivo à criação de oportunidades para comerciantes e trabalhadores locais.', 'Desenvolver é abrir caminho para quem trabalha.'],
  ['participation', 'Da escuta ao resultado.', 'Como trabalhamos', 'Demandas chegam pelas ruas, gabinete e canais digitais. O mandato registra, fiscaliza, propõe, acompanha e presta contas sobre os encaminhamentos.', 'Transparência é mostrar o que aconteceu depois da conversa.'],
  ['final-back-cover', 'O gabinete está de portas abertas.', 'Faça parte', 'Envie sugestões, acompanhe projetos, participe das decisões que impactam a cidade e cobre resultados. Este mandato também é seu.', 'O que eu faço é da sua conta.'],
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
