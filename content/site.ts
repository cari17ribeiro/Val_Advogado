export const site = {
  name: 'Val Advogado',
  eyebrow: 'Mandato presente, transparente e humano',
  headline: 'Presença que cuida. Trabalho que transforma.',
  description:
    'Uma vida transformada pela educação. Um mandato dedicado a transformar outras vidas, com inclusão, esporte, saúde, segurança e presença nos bairros.',
  whatsapp: 'https://wa.me/5513996023101',
  instagram: 'https://instagram.com/',
  email: 'vereador_val_adv@camaraguaruja.sp.gov.br',
  address: 'Guarujá, São Paulo',
};

const storage = 'https://suwjmyetnifzeehirpxt.supabase.co/storage/v1/object/public/val-media/uploads';

export const photos = {
  hero: '/media/val/capa-sem-fundo.png',
  logo: '/media/val-logo.jpg',
  gabinete: `${storage}/1784679102977-39188e54-0037-4081-841d-9e8e78c836cc.png`,
  esporte: `${storage}/1784606053975-71207c59-220c-4080-8e3a-86f38ab7b4af.png`,
  esporteEquipe: `${storage}/1784606583095-criancas.png`,
  esporteInfantil: `${storage}/1784605334345-design-sem-nome-6-.png`,
  inclusao: `${storage}/1784633318326-2c2ac1cc-98ac-4346-9e5d-0bee8f7eec35.png`,
  inclusaoComunidade: `${storage}/1784690573609-saveclip.app-590415039-18304095424249977-9214076341299288469-n.webp`,
  familia: `${storage}/1784564705428-8241692b-e7f4-4fec-af34-9066646ea930.jpg`,
  comunidade: `${storage}/1784577998881-img-2207-original.jpg`,
  referenciaAzul: '/media/val/referencia-capa.png',
  mosaic: '/media/val/referencia-capa.png',
  luvas: `${storage}/1784605555731-luvas.png`,
  acao: `${storage}/1784736357253-a.png`,
};

export const priorityProjects = [
  {
    slug: 'inclusao-autismo',
    kicker: 'Inclusão e famílias atípicas',
    title: 'Cuidar também de quem cuida',
    text:
      'Mais de R$ 1 milhão destinados a entidades do terceiro setor para ampliar terapias, atendimento especializado, acolhimento às mães atípicas e inclusão de pessoas com TEA.',
    accent: 'autism',
  },
  {
    slug: 'esporte-transformacao',
    kicker: 'Esporte como oportunidade',
    title: 'Mais de R$ 710 mil para o esporte',
    text:
      'Apoio a projetos e atletas de muay thai, kickboxing, judô, natação, wrestling, jiu-jitsu, futebol e tênis de mesa, fortalecendo disciplina, convivência e futuro.',
    accent: 'fight',
  },
];

export const causes = [
  { title: 'Saúde pública', text: 'Telemedicina, mutirões especializados, medicamentos e acompanhamento do futuro Hospital Municipal.' },
  { title: 'Educação inclusiva', text: 'Capacitação continuada para professores e sinais escolares mais adequados para alunos com TEA.' },
  { title: 'Proteção animal', text: 'Lei da microchipagem gratuita, cadastro no Simpatinhas, castração e combate ao abandono.' },
  { title: 'Segurança', text: 'R$ 2 milhões conquistados em parceria com Renata Abreu para fortalecer o videomonitoramento.' },
  { title: 'Água e saneamento', text: "Cobrança de soluções para falta d'água, baixa pressão, vazamentos e desassoreamento." },
  { title: 'Desenvolvimento', text: 'Incentivo ao empreendedorismo, comércio eletrônico municipal e geração de renda.' },
];
