const driveImage = (id: string, width = 1600) => `https://drive.google.com/thumbnail?id=${id}&sz=w${width}`;

export const site = {
  name: 'Val Advogado',
  eyebrow: 'Mandato presente, transparente e humano',
  headline: 'O que eu faço é da sua conta.',
  description:
    'Uma vida transformada pela educação. Um mandato dedicado a transformar outras vidas, com inclusão, esporte, saúde, segurança e presença nos bairros.',
  whatsapp: 'https://wa.me/5513996023101',
  instagram: 'https://instagram.com/',
  email: 'contato@valadvogado.com.br',
  address: 'Guarujá, São Paulo',
};

export const photos = {
  hero: driveImage('1sGUGialjaXCmqFSfPemKoSVwrNs8-4uz', 1800),
  logo: driveImage('1aDmEvDBwnIDjoj8DLebs02Bo1TtmuQ_e', 900),
  gabinete: driveImage('18CN1dCySJupMd3Lh52qtodqOs8Vjr_iV', 1400),
  esporte: driveImage('11xbMhMMR1URa1F7KThvwYz9isZl-vb7l', 1400),
  inclusao: driveImage('1qr3P1o4SA6nM3n5Aaz-b2ffzulfHFHvL', 1400),
  familia: driveImage('1UlXqmcoDLPGKImKiHErLi3MI9cuarkZH', 1400),
  renata: driveImage('1wniEqONORqqaievZICltIekekKHeHmDM', 1400),
  referenciaAzul: driveImage('1X1VayZJwrpsAXgJUUoiLhj3HSE1Iw7XK', 1600),
  mosaic: driveImage('1X1VayZJwrpsAXgJUUoiLhj3HSE1Iw7XK', 1600),
  luvas: driveImage('11xbMhMMR1URa1F7KThvwYz9isZl-vb7l', 1400),
  acao: driveImage('18CN1dCySJupMd3Lh52qtodqOs8Vjr_iV', 1400),
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
