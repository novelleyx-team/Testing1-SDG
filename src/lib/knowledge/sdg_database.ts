export interface SDGTarget {
  id: string;
  description: string;
}

export interface SDG {
  id: number;
  name: string;
  description: string;
  targets: SDGTarget[];
}

export const sdgDatabase: SDG[] = [
  {
    id: 1,
    name: "No Poverty",
    description: "End poverty in all its forms everywhere.",
    targets: [
      { id: "1.1", description: "By 2030, eradicate extreme poverty for all people everywhere." },
      { id: "1.2", description: "By 2030, reduce at least by half the proportion of men, women and children of all ages living in poverty in all its dimensions according to national definitions." },
      { id: "1.4", description: "By 2030, ensure that all men and women, in particular the poor and the vulnerable, have equal rights to economic resources, as well as access to basic services, ownership and control over land and other forms of property, inheritance, natural resources, appropriate new technology and financial services, including microfinance." },
      { id: "1.5", description: "By 2030, build the resilience of the poor and those in vulnerable situations and reduce their exposure and vulnerability to climate-related extreme events and other economic, social and environmental shocks and disasters." }
    ]
  },
  {
    id: 2,
    name: "Zero Hunger",
    description: "End hunger, achieve food security and improved nutrition and promote sustainable agriculture.",
    targets: [
      { id: "2.1", description: "By 2030, end hunger and ensure access by all people, in particular the poor and people in vulnerable situations, including infants, to safe, nutritious and sufficient food all year round." },
      { id: "2.2", description: "By 2030, end all forms of malnutrition." },
      { id: "2.3", description: "By 2030, double the agricultural productivity and incomes of small-scale food producers." },
      { id: "2.4", description: "By 2030, ensure sustainable food production systems and implement resilient agricultural practices." }
    ]
  },
  {
    id: 3,
    name: "Good Health and Well-being",
    description: "Ensure healthy lives and promote well-being for all at all ages.",
    targets: [
      { id: "3.4", description: "By 2030, reduce by one third premature mortality from non-communicable diseases through prevention and treatment and promote mental health and well-being." },
      { id: "3.8", description: "Achieve universal health coverage, including financial risk protection, access to quality essential health-care services and access to safe, effective, quality and affordable essential medicines and vaccines for all." },
      { id: "3.9", description: "By 2030, substantially reduce the number of deaths and illnesses from hazardous chemicals and air, water and soil pollution and contamination." }
    ]
  },
  {
    id: 4,
    name: "Quality Education",
    description: "Ensure inclusive and equitable quality education and promote lifelong learning opportunities for all.",
    targets: [
      { id: "4.1", description: "By 2030, ensure that all girls and boys complete free, equitable and quality primary and secondary education leading to relevant and effective learning outcomes." },
      { id: "4.3", description: "By 2030, ensure equal access for all women and men to affordable and quality technical, vocational and tertiary education, including university." },
      { id: "4.4", description: "By 2030, substantially increase the number of youth and adults who have relevant skills, including technical and vocational skills, for employment, decent jobs and entrepreneurship." },
      { id: "4.7", description: "By 2030, ensure that all learners acquire the knowledge and skills needed to promote sustainable development." }
    ]
  },
  {
    id: 5,
    name: "Gender Equality",
    description: "Achieve gender equality and empower all women and girls.",
    targets: [
      { id: "5.1", description: "End all forms of discrimination against all women and girls everywhere." },
      { id: "5.2", description: "Eliminate all forms of violence against all women and girls in the public and private spheres." },
      { id: "5.5", description: "Ensure women's full and effective participation and equal opportunities for leadership at all levels of decision-making in political, economic and public life." },
      { id: "5.b", description: "Enhance the use of enabling technology, in particular information and communications technology, to promote the empowerment of women." }
    ]
  },
  {
    id: 6,
    name: "Clean Water and Sanitation",
    description: "Ensure availability and sustainable management of water and sanitation for all.",
    targets: [
      { id: "6.1", description: "By 2030, achieve universal and equitable access to safe and affordable drinking water for all." },
      { id: "6.2", description: "By 2030, achieve access to adequate and equitable sanitation and hygiene for all." },
      { id: "6.3", description: "By 2030, improve water quality by reducing pollution, eliminating dumping and minimizing release of hazardous chemicals and materials." },
      { id: "6.4", description: "By 2030, substantially increase water-use efficiency across all sectors and ensure sustainable withdrawals and supply of freshwater." }
    ]
  },
  {
    id: 7,
    name: "Affordable and Clean Energy",
    description: "Ensure access to affordable, reliable, sustainable and modern energy for all.",
    targets: [
      { id: "7.1", description: "By 2030, ensure universal access to affordable, reliable and modern energy services." },
      { id: "7.2", description: "By 2030, increase substantially the share of renewable energy in the global energy mix." },
      { id: "7.3", description: "By 2030, double the global rate of improvement in energy efficiency." },
      { id: "7.a", description: "By 2030, enhance international cooperation to facilitate access to clean energy research and technology." }
    ]
  },
  {
    id: 8,
    name: "Decent Work and Economic Growth",
    description: "Promote sustained, inclusive and sustainable economic growth, full and productive employment and decent work for all.",
    targets: [
      { id: "8.2", description: "Achieve higher levels of economic productivity through diversification, technological upgrading and innovation." },
      { id: "8.3", description: "Promote development-oriented policies that support productive activities, decent job creation, entrepreneurship, creativity and innovation." },
      { id: "8.4", description: "Improve progressively, through 2030, global resource efficiency in consumption and production and endeavour to decouple economic growth from environmental degradation." },
      { id: "8.5", description: "By 2030, achieve full and productive employment and decent work for all women and men." }
    ]
  },
  {
    id: 9,
    name: "Industry, Innovation and Infrastructure",
    description: "Build resilient infrastructure, promote inclusive and sustainable industrialization and foster innovation.",
    targets: [
      { id: "9.1", description: "Develop quality, reliable, sustainable and resilient infrastructure to support economic development and human well-being." },
      { id: "9.2", description: "Promote inclusive and sustainable industrialization." },
      { id: "9.4", description: "By 2030, upgrade infrastructure and retrofit industries to make them sustainable, with increased resource-use efficiency and greater adoption of clean and environmentally sound technologies." },
      { id: "9.5", description: "Enhance scientific research, upgrade the technological capabilities of industrial sectors in all countries." }
    ]
  },
  {
    id: 10,
    name: "Reduced Inequalities",
    description: "Reduce inequality within and among countries.",
    targets: [
      { id: "10.1", description: "By 2030, progressively achieve and sustain income growth of the bottom 40 per cent of the population at a rate higher than the national average." },
      { id: "10.2", description: "By 2030, empower and promote the social, economic and political inclusion of all." },
      { id: "10.3", description: "Ensure equal opportunity and reduce inequalities of outcome, including by eliminating discriminatory laws, policies and practices." }
    ]
  },
  {
    id: 11,
    name: "Sustainable Cities and Communities",
    description: "Make cities and human settlements inclusive, safe, resilient and sustainable.",
    targets: [
      { id: "11.1", description: "By 2030, ensure access for all to adequate, safe and affordable housing and basic services." },
      { id: "11.2", description: "By 2030, provide access to safe, affordable, accessible and sustainable transport systems for all." },
      { id: "11.3", description: "By 2030, enhance inclusive and sustainable urbanization." },
      { id: "11.6", description: "By 2030, reduce the adverse per capita environmental impact of cities, including by paying special attention to air quality and municipal and other waste management." }
    ]
  },
  {
    id: 12,
    name: "Responsible Consumption and Production",
    description: "Ensure sustainable consumption and production patterns.",
    targets: [
      { id: "12.2", description: "By 2030, achieve the sustainable management and efficient use of natural resources." },
      { id: "12.3", description: "By 2030, halve per capita global food waste at the retail and consumer levels." },
      { id: "12.4", description: "By 2020, achieve the environmentally sound management of chemicals and all wastes throughout their life cycle." },
      { id: "12.5", description: "By 2030, substantially reduce waste generation through prevention, reduction, recycling and reuse." }
    ]
  },
  {
    id: 13,
    name: "Climate Action",
    description: "Take urgent action to combat climate change and its impacts.",
    targets: [
      { id: "13.1", description: "Strengthen resilience and adaptive capacity to climate-related hazards and natural disasters in all countries." },
      { id: "13.2", description: "Integrate climate change measures into national policies, strategies and planning." },
      { id: "13.3", description: "Improve education, awareness-raising and human and institutional capacity on climate change mitigation, adaptation, impact reduction and early warning." }
    ]
  },
  {
    id: 14,
    name: "Life Below Water",
    description: "Conserve and sustainably use the oceans, seas and marine resources for sustainable development.",
    targets: [
      { id: "14.1", description: "By 2025, prevent and significantly reduce marine pollution of all kinds, in particular from land-based activities, including marine debris and nutrient pollution." },
      { id: "14.2", description: "By 2020, sustainably manage and protect marine and coastal ecosystems." },
      { id: "14.4", description: "By 2020, effectively regulate harvesting and end overfishing, illegal, unreported and unregulated fishing." }
    ]
  },
  {
    id: 15,
    name: "Life on Land",
    description: "Protect, restore and promote sustainable use of terrestrial ecosystems, sustainably manage forests, combat desertification, and halt and reverse land degradation and halt biodiversity loss.",
    targets: [
      { id: "15.1", description: "By 2020, ensure the conservation, restoration and sustainable use of terrestrial and inland freshwater ecosystems." },
      { id: "15.2", description: "By 2020, promote the implementation of sustainable management of all types of forests, halt deforestation, restore degraded forests." },
      { id: "15.3", description: "By 2030, combat desertification, restore degraded land and soil." },
      { id: "15.5", description: "Take urgent and significant action to reduce the degradation of natural habitats, halt the loss of biodiversity." }
    ]
  },
  {
    id: 16,
    name: "Peace, Justice and Strong Institutions",
    description: "Promote peaceful and inclusive societies for sustainable development, provide access to justice for all and build effective, accountable and inclusive institutions at all levels.",
    targets: [
      { id: "16.1", description: "Significantly reduce all forms of violence and related death rates everywhere." },
      { id: "16.3", description: "Promote the rule of law at the national and international levels and ensure equal access to justice for all." },
      { id: "16.5", description: "Substantially reduce corruption and bribery in all their forms." },
      { id: "16.6", description: "Develop effective, accountable and transparent institutions at all levels." }
    ]
  },
  {
    id: 17,
    name: "Partnerships for the Goals",
    description: "Strengthen the means of implementation and revitalize the Global Partnership for Sustainable Development.",
    targets: [
      { id: "17.6", description: "Enhance North-South, South-South and triangular regional and international cooperation on and access to science, technology and innovation." },
      { id: "17.7", description: "Promote the development, transfer, dissemination and diffusion of environmentally sound technologies to developing countries." },
      { id: "17.16", description: "Enhance the Global Partnership for Sustainable Development, complemented by multi-stakeholder partnerships that mobilize and share knowledge, expertise, technology and financial resources." }
    ]
  }
];

export function getSdgById(id: number): SDG | undefined {
  return sdgDatabase.find(sdg => sdg.id === id);
}

export function getAllSdgsContext(): string {
  return sdgDatabase.map(sdg => {
    const targets = sdg.targets.map(t => `  - Target ${t.id}: ${t.description}`).join('\n');
    return `SDG ${sdg.id}: ${sdg.name}\n${sdg.description}\nTargets:\n${targets}`;
  }).join('\n\n');
}
