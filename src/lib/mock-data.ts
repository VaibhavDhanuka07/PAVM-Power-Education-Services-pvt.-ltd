import { Blog, Course, CourseListing, CourseSector, EducationMode, Rating, University, UniversityCourse, UniversityListing } from "@/lib/types";
import { slugify } from "@/lib/utils";
import { skillBaseCoursesFromPdf } from "@/lib/data/skill-base-courses";

const modes: EducationMode[] = [
  { id: "m-online", name: "Online" },
  { id: "m-distance", name: "Distance" },
  { id: "m-vocational", name: "Vocational" },
  { id: "m-skill", name: "Skill Certification" },
  { id: "m-regular", name: "Regular" },
];

const sectorNames = [
  "Agriculture",
  "Automobile",
  "Child Education",
  "Civil Construction",
  "Soft Skills",
  "Dairy Education",
  "Electrical & Electronics",
  "Fisheries",
  "Home Maintenance",
  "Cottage Industry",
  "Interior Designing",
  "Office Management",
  "Poultry",
  "Acupuncture",
  "Ayurveda",
  "Beauty & Wellness",
  "Computing & Information Technology",
  "Fire & Safety",
  "Forest & Environmental",
  "Gems & Jewellery",
  "Geo Information",
  "Hotel Management",
  "Language Studies",
  "Creative Industry",
  "Siddha",
  "Sports",
  "Technical Training",
  "Textile Technology",
  "Unani Medicine",
  "Yoga & Naturopathy",
  "Management",
  "Aviation",
  "Banking & Finance",
  "Fashion",
  "Media",
  "Logistics & Transportation",
  "Marine Technology",
  "Solar Technology",
  "Mental Health",
  "Marketing",
];

const sectors: CourseSector[] = sectorNames.map((name, i) => ({
  id: `s-${i + 1}`,
  name,
  slug: slugify(name),
}));

const universities: University[] = [
  {
    id: "u-1",
    name: "Shoolini University",
    slug: "shoolini-university",
    location: "Himachal Pradesh, India",
    mode_supported: ["Online"],
    logo: "/logos/universities/shoolini-university.jpeg",
    description: "Premium online university with industry-focused outcomes.",
  },
  {
    id: "u-2",
    name: "Uttaranchal University",
    slug: "uttaranchal-university",
    location: "Dehradun, India",
    mode_supported: ["Online"],
    logo: "/logos/universities/uttaranchal-university.jpeg",
    description: "Career-oriented online degree and postgraduate pathways.",
  },
  {
    id: "u-3",
    name: "Marwadi University",
    slug: "marwadi-university",
    location: "Rajkot, India",
    mode_supported: ["Online", "Regular"],
    logo: "/logos/universities/marwadi-university.jpeg",
    description: "Technology and business programs across online and regular modes.",
  },
  {
    id: "u-4",
    name: "Mangalayatan University",
    slug: "mangalayatan-university",
    location: "Aligarh, India",
    mode_supported: ["Online", "Distance"],
    logo: "/logos/universities/mangalayatan-university.jpeg",
    description: "Flexible and affordable online and distance learning pathways.",
  },
  {
    id: "u-5",
    name: "Maharishi Markandeshwar University",
    slug: "maharishi-markandeshwar-university",
    location: "Ambala, India",
    mode_supported: ["Online"],
    logo: "/logos/universities/maharishi-markandeshwar-university.jpeg",
    description: "Online-first academic offerings with practical curriculum.",
  },
  {
    id: "u-6",
    name: "Noida International University",
    slug: "noida-international-university",
    location: "Greater Noida, India",
    mode_supported: ["Online", "Regular"],
    logo: "/logos/universities/noida-international-university.jpeg",
    description: "Global curriculum and broad multidisciplinary course catalog.",
  },
  {
    id: "u-7",
    name: "Suresh Gyan Vihar University",
    slug: "suresh-gyan-vihar-university",
    location: "Jaipur, India",
    mode_supported: ["Online"],
    logo: "/logos/universities/suresh-gyan-vihar-university.jpeg",
    description: "Flexible digital programs with strong student support.",
  },
  {
    id: "u-8",
    name: "Bharati Vidyapeeth University",
    slug: "bharati-vidyapeeth-university",
    location: "Pune, India",
    mode_supported: ["Online", "Distance"],
    logo: "/logos/universities/bharati-vidyapeeth-university.jpeg",
    description: "Established institution across online and distance education.",
  },
  {
    id: "u-9",
    name: "Glocal University",
    slug: "glocal-university",
    location: "Saharanpur, India",
    mode_supported: ["Vocational", "Skill Certification"],
    logo: "/logos/universities/glocal-university.jpeg",
    description: "Hands-on vocational and skill certification programs.",
  },
  {
    id: "u-10",
    name: "Rayat Bahra University",
    slug: "rayat-bahra-university",
    location: "Mohali, India",
    mode_supported: ["Regular"],
    logo: "/logos/universities/rayat-bahra-university.jpeg",
    description: "Industry-focused regular degree programs.",
  },
  {
    id: "u-11",
    name: "Dr Preeti Global University",
    slug: "dr-preeti-global-university",
    location: "India",
    mode_supported: ["Regular"],
    logo: "/logos/universities/dr-preeti-global-university.jpeg",
    description: "Emerging university with modern regular curriculum.",
  },
  {
    id: "u-12",
    name: "COER University",
    slug: "coer-university",
    location: "Roorkee, India",
    mode_supported: ["Regular"],
    logo: "/logos/universities/coer-university.jpeg",
    description: "Professional and engineering regular programs.",
  },
  {
    id: "u-13",
    name: "Guru Nanak University Hyderabad",
    slug: "guru-nanak-university-hyderabad",
    location: "Hyderabad, India",
    mode_supported: ["Regular"],
    logo: "/logos/universities/guru-nanak-university-hyderabad.jpeg",
    description: "Regular degree pathways with practical exposure.",
  },
  {
    id: "u-14",
    name: "NIAT",
    slug: "niat",
    location: "India",
    mode_supported: ["Regular"],
    logo: "/logos/universities/niat.jpeg",
    description: "Technology and business focused regular programs.",
  },
  {
    id: "u-15",
    name: "Suryadatta Group of Institutions",
    slug: "suryadatta-group-of-institutions",
    location: "Pune, India",
    mode_supported: ["Regular"],
    logo: "/logos/universities/suryadatta-group-of-institutions.jpeg",
    description: "Industry connected regular degree offerings.",
  },
  {
    id: "u-16",
    name: "North East Christian University",
    slug: "north-east-christian-university",
    location: "North East India",
    mode_supported: ["Regular"],
    logo: "/logos/universities/north-east-christian-university.jpeg",
    description: "Regional access to quality higher education.",
  },
];

function hashCode(input: string) {
  let hash = 0;
  for (let i = 0; i < input.length; i += 1) {
    hash = (hash << 5) - hash + input.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash);
}

const onlineMode = modes.find((mode) => mode.name === "Online")!;
const distanceMode = modes.find((mode) => mode.name === "Distance")!;
const vocationalMode = modes.find((mode) => mode.name === "Vocational")!;
const skillMode = modes.find((mode) => mode.name === "Skill Certification")!;
const regularMode = modes.find((mode) => mode.name === "Regular")!;

const onlineCourseDefs = [
  { name: "BBA", slug: "bba", duration: "3 years", sectorSlug: "management", description: "Undergraduate business program with fundamentals in management, marketing, and operations." },
  { name: "BCom Hons", slug: "bcom-hons", duration: "3 years", sectorSlug: "banking-and-finance", description: "Advanced commerce curriculum in accounting, taxation, and finance." },
  { name: "BA Journalism and Mass Communication", slug: "ba-journalism-and-mass-communication", duration: "3 years", sectorSlug: "media", description: "UG media program focused on reporting, editing, and digital communication." },
  { name: "BCA", slug: "bca", duration: "3 years", sectorSlug: "computing-and-information-technology", description: "Undergraduate computing program in programming, databases, and software development." },
  { name: "MBA", slug: "mba", duration: "2 years", sectorSlug: "management", description: "Postgraduate management degree with career specializations." },
  { name: "MA English", slug: "ma-english", duration: "2 years", sectorSlug: "language-studies", description: "Postgraduate English studies program for language, literature, and communication." },
  { name: "MCA", slug: "mca", duration: "2 years", sectorSlug: "computing-and-information-technology", description: "Advanced postgraduate computing and application development program." },
  { name: "BCom", slug: "bcom", duration: "3 years", sectorSlug: "banking-and-finance", description: "Commerce degree covering accounting, business law, and financial systems." },
  { name: "MSc Mathematics", slug: "msc-mathematics", duration: "2 years", sectorSlug: "management", description: "Postgraduate mathematics program with applied and theoretical focus." },
  { name: "MA Journalism and Mass Communication", slug: "ma-journalism-and-mass-communication", duration: "2 years", sectorSlug: "media", description: "PG media and journalism program with communication strategy and content production." },
  { name: "MCom", slug: "mcom", duration: "2 years", sectorSlug: "banking-and-finance", description: "Postgraduate commerce program in accounting, taxation, and financial analysis." },
  { name: "MA", slug: "ma", duration: "2 years", sectorSlug: "language-studies", description: "Postgraduate arts program focused on advanced humanities and social sciences." },
  { name: "MA International Relations", slug: "ma-international-relations", duration: "2 years", sectorSlug: "management", description: "Postgraduate program on global politics, diplomacy, and policy." },
  { name: "BA", slug: "ba", duration: "3 years", sectorSlug: "language-studies", description: "General arts degree with broad humanities foundation." },
  { name: "MA Economics", slug: "ma-economics", duration: "2 years", sectorSlug: "management", description: "Postgraduate economics program in policy, macroeconomics, and analytics." },
  { name: "BA Journalism", slug: "ba-journalism", duration: "3 years", sectorSlug: "media", description: "Undergraduate journalism program for content, media practice, and communication." },
  { name: "BA 2.0", slug: "ba-2-0", duration: "3 years", sectorSlug: "language-studies", description: "Modern arts curriculum with updated interdisciplinary approach." },
  { name: "BLib", slug: "blib", duration: "1 year", sectorSlug: "management", description: "Library and information science foundation program." },
  { name: "Diploma in Computer Application (DCA)", slug: "diploma-in-computer-application-dca", duration: "1 year", sectorSlug: "computing-and-information-technology", description: "Foundational diploma in computer applications, office tools, and digital workflows." },
  { name: "MA Political Science", slug: "ma-political-science", duration: "2 years", sectorSlug: "management", description: "Postgraduate political science program covering governance, institutions, and policy." },
  { name: "MA Education", slug: "ma-education", duration: "2 years", sectorSlug: "child-education", description: "Postgraduate program in education theory, pedagogy, and learning systems." },
  { name: "MA Public Administration", slug: "ma-public-administration", duration: "2 years", sectorSlug: "management", description: "Postgraduate program in governance, public systems, and administrative processes." },
  { name: "MBA (Human Resource Management)", slug: "mba-human-resource-management", duration: "2 years", sectorSlug: "management", description: "MBA specialization focused on people strategy, talent, and organizational behavior." },
  { name: "MBA (Marketing Management)", slug: "mba-marketing-management", duration: "2 years", sectorSlug: "marketing", description: "MBA specialization in brand strategy, customer acquisition, and growth marketing." },
  { name: "MBA (Operations Management)", slug: "mba-operations-management", duration: "2 years", sectorSlug: "management", description: "MBA specialization focused on process optimization, logistics, and operations excellence." },
  { name: "MBA (Finance Management)", slug: "mba-finance-management", duration: "2 years", sectorSlug: "banking-and-finance", description: "MBA specialization in corporate finance, valuation, and strategic financial planning." },
  { name: "PG Diploma in Computer Application (PGDCA)", slug: "pg-diploma-in-computer-application-pgdca", duration: "1 year", sectorSlug: "computing-and-information-technology", description: "Postgraduate diploma in computer applications and software tools." },
  { name: "PG Diploma in Journalism and Mass Communication (PGJMC)", slug: "pg-diploma-in-journalism-and-mass-communication-pgjmc", duration: "1 year", sectorSlug: "media", description: "Postgraduate diploma in journalism, media writing, and communication practice." },
  { name: "PG Diploma in Business Management (PGDBM)", slug: "pg-diploma-in-business-management-pgdbm", duration: "1 year", sectorSlug: "management", description: "Postgraduate diploma in business management principles and applied execution." },
  { name: "PG Diploma in Business Management", slug: "pg-diploma-in-business-management", duration: "1 year", sectorSlug: "management", description: "Postgraduate diploma in business management with practical managerial training." },
  { name: "Diploma in Accounts and Business Law", slug: "diploma-in-accounts-and-business-law", duration: "1 year", sectorSlug: "banking-and-finance", description: "Diploma focused on accounting practices and business law basics." },
  { name: "Diploma in Accounts and Finance", slug: "diploma-in-accounts-and-finance", duration: "1 year", sectorSlug: "banking-and-finance", description: "Diploma in core accounting systems and finance fundamentals." },
  { name: "Diploma in Business Management", slug: "diploma-in-business-management", duration: "1 year", sectorSlug: "management", description: "Diploma in management foundations and business operations." },
  { name: "Diploma in Human Resource Management", slug: "diploma-in-human-resource-management", duration: "1 year", sectorSlug: "management", description: "Diploma focused on HR operations, policies, and people management." },
  { name: "Diploma in Marketing Management", slug: "diploma-in-marketing-management", duration: "1 year", sectorSlug: "marketing", description: "Diploma in branding, market research, and customer acquisition." },
  { name: "Diploma in Business Administration", slug: "diploma-in-business-administration", duration: "1 year", sectorSlug: "management", description: "Diploma in business administration and organizational workflow." },
  { name: "Diploma in Artificial Intelligence and Machine Learning", slug: "diploma-in-artificial-intelligence-and-machine-learning", duration: "1 year", sectorSlug: "computing-and-information-technology", description: "Diploma in practical AI and machine learning applications." },
  { name: "Diploma in Big Data and Cloud Computing", slug: "diploma-in-big-data-and-cloud-computing", duration: "1 year", sectorSlug: "computing-and-information-technology", description: "Diploma in big-data tools and cloud computing foundations." },
  { name: "Diploma in Cyber Security and Information Security", slug: "diploma-in-cyber-security-and-information-security", duration: "1 year", sectorSlug: "computing-and-information-technology", description: "Diploma in cyber defense, security controls, and information assurance." },
  { name: "Diploma in IoT (Internet of Things) Engineering", slug: "diploma-in-iot-internet-of-things-engineering", duration: "1 year", sectorSlug: "computing-and-information-technology", description: "Diploma in connected systems, sensors, and IoT engineering basics." },
  { name: "Diploma in Machine Learning with Python and R", slug: "diploma-in-machine-learning-with-python-and-r", duration: "1 year", sectorSlug: "computing-and-information-technology", description: "Diploma in ML pipelines with Python and R programming." },
  { name: "Diploma in Software Development", slug: "diploma-in-software-development", duration: "1 year", sectorSlug: "computing-and-information-technology", description: "Diploma in software engineering fundamentals and development lifecycle." },
  { name: "Diploma in Sociological Studies", slug: "diploma-in-sociological-studies", duration: "1 year", sectorSlug: "language-studies", description: "Diploma in social structures, institutions, and sociological thought." },
  { name: "Diploma in Culture and Social Structure", slug: "diploma-in-culture-and-social-structure", duration: "1 year", sectorSlug: "language-studies", description: "Diploma exploring culture, communities, and social frameworks." },
  { name: "Diploma in Political and Administrative Studies", slug: "diploma-in-political-and-administrative-studies", duration: "1 year", sectorSlug: "management", description: "Diploma in public administration, governance, and policy basics." },
  { name: "Diploma in Political and Historical Foundations", slug: "diploma-in-political-and-historical-foundations", duration: "1 year", sectorSlug: "language-studies", description: "Diploma in political systems and historical context." },
  { name: "Diploma in English Language and Literature", slug: "diploma-in-english-language-and-literature", duration: "1 year", sectorSlug: "language-studies", description: "Diploma in English language proficiency and literary studies." },
  { name: "Diploma in Arts and Humanities", slug: "diploma-in-arts-and-humanities", duration: "1 year", sectorSlug: "language-studies", description: "Diploma in humanities, arts, and critical thinking." },
  { name: "Diploma in Journalism and Mass Communication", slug: "diploma-in-journalism-and-mass-communication", duration: "1 year", sectorSlug: "media", description: "Diploma in journalism, newsroom practices, and media communication." },
  { name: "Diploma in Commerce and Business Studies", slug: "diploma-in-commerce-and-business-studies", duration: "1 year", sectorSlug: "banking-and-finance", description: "Diploma in commerce systems, trade fundamentals, and business studies." },
  { name: "Diploma in Microbiology and Archegoniate", slug: "diploma-in-microbiology-and-archegoniate", duration: "1 year", sectorSlug: "technical-training", description: "Diploma in microbiology fundamentals and laboratory concepts." },
  { name: "Diploma in Basic Science (PCB/PCM/ZBC)", slug: "diploma-in-basic-science-pcb-pcm-zbc", duration: "1 year", sectorSlug: "technical-training", description: "Diploma in foundational science streams for multidisciplinary pathways." },
  { name: "PG Diploma in Leadership and Local Governance", slug: "pg-diploma-in-leadership-and-local-governance", duration: "1 year", sectorSlug: "management", description: "PG diploma in leadership principles and local governance systems." },
  { name: "PG Diploma in Administration and Public Policy", slug: "pg-diploma-in-administration-and-public-policy", duration: "1 year", sectorSlug: "management", description: "PG diploma in administration, public policy, and implementation." },
  { name: "PG Diploma in English Literature and Linguistic Studies", slug: "pg-diploma-in-english-literature-and-linguistic-studies", duration: "1 year", sectorSlug: "language-studies", description: "PG diploma in advanced literature and linguistics." },
  { name: "PG Diploma in Historical Studies and Cultural Perspectives", slug: "pg-diploma-in-historical-studies-and-cultural-perspectives", duration: "1 year", sectorSlug: "language-studies", description: "PG diploma in historical inquiry and cultural interpretation." },
  { name: "PG Diploma in Political Studies", slug: "pg-diploma-in-political-studies", duration: "1 year", sectorSlug: "management", description: "PG diploma in contemporary political thought and systems." },
  { name: "PG Diploma in Sociological Studies", slug: "pg-diploma-in-sociological-studies", duration: "1 year", sectorSlug: "language-studies", description: "PG diploma in applied sociological analysis." },
  { name: "PG Diploma in Accounts and Finance", slug: "pg-diploma-in-accounts-and-finance", duration: "1 year", sectorSlug: "banking-and-finance", description: "PG diploma in accounting controls and financial management." },
  { name: "PG Diploma in Financial Management", slug: "pg-diploma-in-financial-management", duration: "1 year", sectorSlug: "banking-and-finance", description: "PG diploma in corporate financial planning and analysis." },
  { name: "PG Diploma in Human Resource Management", slug: "pg-diploma-in-human-resource-management", duration: "1 year", sectorSlug: "management", description: "PG diploma in strategic HR and workforce planning." },
  { name: "PG Diploma in Marketing Management", slug: "pg-diploma-in-marketing-management", duration: "1 year", sectorSlug: "marketing", description: "PG diploma in marketing strategy, branding, and growth." },
  { name: "PG Diploma in Operations Management", slug: "pg-diploma-in-operations-management", duration: "1 year", sectorSlug: "management", description: "PG diploma in operations, supply systems, and process optimization." },
  { name: "PG Diploma in Mathematics", slug: "pg-diploma-in-mathematics", duration: "1 year", sectorSlug: "management", description: "PG diploma in advanced mathematics for analytical applications." },
  { name: "PG Diploma in Cyber Security", slug: "pg-diploma-in-cyber-security", duration: "1 year", sectorSlug: "computing-and-information-technology", description: "PG diploma in cybersecurity risk, controls, and governance." },
  { name: "PG Diploma in Cloud Computing", slug: "pg-diploma-in-cloud-computing", duration: "1 year", sectorSlug: "computing-and-information-technology", description: "PG diploma in cloud platforms, services, and architecture basics." },
  { name: "PG Diploma in Big Data Analytics", slug: "pg-diploma-in-big-data-analytics", duration: "1 year", sectorSlug: "computing-and-information-technology", description: "PG diploma in big data processing and analytics pipelines." },
  { name: "PG Diploma in Education", slug: "pg-diploma-in-education", duration: "1 year", sectorSlug: "child-education", description: "PG diploma in education systems, pedagogy, and learning design." },
] as const;

const distanceCourseDefs = [
  { name: "BA", slug: "ba-distance", duration: "3 years", sectorSlug: "language-studies", description: "Distance BA program with foundational humanities and social sciences curriculum." },
  { name: "BCom", slug: "bcom-distance", duration: "3 years", sectorSlug: "banking-and-finance", description: "Distance BCom program focused on accounting, commerce, and business fundamentals." },
  { name: "BBA", slug: "bba-distance", duration: "3 years", sectorSlug: "management", description: "Distance BBA program for business, management, and entrepreneurship pathways." },
  { name: "BCA", slug: "bca-distance", duration: "3 years", sectorSlug: "computing-and-information-technology", description: "Distance BCA program covering programming, databases, and IT systems." },
  { name: "BSc", slug: "bsc-distance", duration: "3 years", sectorSlug: "technical-training", description: "Distance BSc program with applied science and analytical foundations." },
  { name: "BLib", slug: "blib-distance", duration: "1 year", sectorSlug: "management", description: "Distance BLib program in library and information science basics." },
  { name: "MLib", slug: "mlib-distance", duration: "1 year", sectorSlug: "management", description: "Distance MLib program in advanced library and information systems." },
  { name: "BA Journalism", slug: "ba-journalism-distance", duration: "3 years", sectorSlug: "media", description: "Distance BA Journalism program for reporting, writing, and media communication." },
  { name: "MA English", slug: "ma-english-distance", duration: "2 years", sectorSlug: "language-studies", description: "Distance MA English program with literature and language specialization." },
  { name: "MA Sociology", slug: "ma-sociology-distance", duration: "2 years", sectorSlug: "language-studies", description: "Distance MA Sociology program focused on social systems and research methods." },
  { name: "MA Political Science", slug: "ma-political-science-distance", duration: "2 years", sectorSlug: "management", description: "Distance MA Political Science program in governance and political thought." },
  { name: "MA History", slug: "ma-history-distance", duration: "2 years", sectorSlug: "language-studies", description: "Distance MA History program with historical methods and interpretation." },
  { name: "MA Economics", slug: "ma-economics-distance", duration: "2 years", sectorSlug: "banking-and-finance", description: "Distance MA Economics program in policy, macroeconomics, and analytics." },
  { name: "MCom", slug: "mcom-distance", duration: "2 years", sectorSlug: "banking-and-finance", description: "Distance MCom program in accounting, finance, and commerce strategy." },
  { name: "MSc Mathematics", slug: "msc-mathematics-distance", duration: "2 years", sectorSlug: "management", description: "Distance MSc Mathematics program with pure and applied mathematics." },
  { name: "MBA", slug: "mba-distance", duration: "2 years", sectorSlug: "management", description: "Distance MBA program for management leadership and business strategy." },
  { name: "MCA", slug: "mca-distance", duration: "2 years", sectorSlug: "computing-and-information-technology", description: "Distance MCA program in software engineering and application development." },
  { name: "MSW", slug: "msw-distance", duration: "2 years", sectorSlug: "management", description: "Distance MSW program focused on social work practice and community development." },
] as const;

const regularCourseDefs = [
  { name: "Polytechnic Diploma", slug: "polytechnic-diploma-regular", duration: "3/2 years", sectorSlug: "technical-training", description: "Regular polytechnic diploma pathway in core engineering streams." },
  { name: "B.Tech", slug: "b-tech-regular", duration: "4 years", sectorSlug: "technical-training", description: "Regular engineering degree with branch specialization and practical labs." },
  { name: "M.Tech", slug: "m-tech-regular", duration: "2 years", sectorSlug: "technical-training", description: "Postgraduate engineering program for advanced technical specialization." },
  { name: "BBA", slug: "bba-regular", duration: "3 years", sectorSlug: "management", description: "Regular undergraduate business administration program." },
  { name: "MBA", slug: "mba-regular", duration: "2 years", sectorSlug: "management", description: "Regular postgraduate management program with specialization options." },
  { name: "BHMCT", slug: "bhmct-regular", duration: "4 years", sectorSlug: "hotel-management", description: "Regular hotel management and catering technology degree." },
  { name: "DHMCT", slug: "dhmct-regular", duration: "2 years", sectorSlug: "hotel-management", description: "Regular diploma in hotel management and catering technology." },
  { name: "B.Com (Honours)", slug: "b-com-honours-regular", duration: "4/3 years", sectorSlug: "banking-and-finance", description: "Regular commerce honors program with accounting and finance foundation." },
  { name: "B.Com (Computer Application)", slug: "b-com-computer-application-regular", duration: "4/3 years", sectorSlug: "banking-and-finance", description: "Regular commerce program with computer application focus." },
  { name: "M.Com", slug: "m-com-regular", duration: "2 years", sectorSlug: "banking-and-finance", description: "Regular postgraduate commerce degree." },
  { name: "Certificate (Health Inspector, OT, X-Ray)", slug: "certificate-health-inspector-ot-x-ray-regular", duration: "1 year", sectorSlug: "mental-health", description: "Regular certificate pathway in healthcare support roles." },
  { name: "DMLT", slug: "dmlt-regular", duration: "2 years", sectorSlug: "mental-health", description: "Regular diploma in medical laboratory technology." },
  { name: "BMLT", slug: "bmlt-regular", duration: "3 years", sectorSlug: "mental-health", description: "Regular bachelor program in medical laboratory technology." },
  { name: "BPT", slug: "bpt-regular", duration: "4 years", sectorSlug: "sports", description: "Regular bachelor of physiotherapy program." },
  { name: "B.Sc", slug: "b-sc-regular", duration: "4/3 years", sectorSlug: "technical-training", description: "Regular bachelor of science pathway across multiple science branches." },
  { name: "M.Sc", slug: "m-sc-regular", duration: "2 years", sectorSlug: "technical-training", description: "Regular master of science program across major disciplines." },
  { name: "DCA", slug: "dca-regular", duration: "1 year", sectorSlug: "computing-and-information-technology", description: "Regular diploma in computer applications." },
  { name: "BCA", slug: "bca-regular", duration: "4 years", sectorSlug: "computing-and-information-technology", description: "Regular bachelor of computer applications program." },
  { name: "PGDCA", slug: "pgdca-regular", duration: "1 year", sectorSlug: "computing-and-information-technology", description: "Regular postgraduate diploma in computer applications." },
  { name: "MCA", slug: "mca-regular", duration: "2 years", sectorSlug: "computing-and-information-technology", description: "Regular master of computer applications program." },
  { name: "B.A", slug: "b-a-regular", duration: "4/3 years", sectorSlug: "language-studies", description: "Regular bachelor of arts program." },
  { name: "M.A", slug: "m-a-regular", duration: "2 years", sectorSlug: "language-studies", description: "Regular master of arts program." },
  { name: "BSW", slug: "bsw-regular", duration: "4 years", sectorSlug: "management", description: "Regular bachelor of social work program." },
  { name: "MSW", slug: "msw-regular", duration: "2 years", sectorSlug: "management", description: "Regular master of social work program." },
  { name: "M.A (Education)", slug: "m-a-education-regular", duration: "2 years", sectorSlug: "child-education", description: "Regular master program in education." },
  { name: "B.PEd", slug: "b-ped-regular", duration: "2 years", sectorSlug: "sports", description: "Regular bachelor in physical education." },
  { name: "B.Lib. & I.Sc.", slug: "b-lib-i-sc-regular", duration: "1 year", sectorSlug: "office-management", description: "Regular library and information science program." },
  { name: "M.Lib. & I.Sc.", slug: "m-lib-i-sc-regular", duration: "1 year", sectorSlug: "office-management", description: "Regular postgraduate library and information science program." },
  { name: "B.Sc (Agriculture)", slug: "b-sc-agriculture-regular", duration: "4 years", sectorSlug: "agriculture", description: "Regular bachelor of science in agriculture." },
  { name: "M.Sc (Agriculture)", slug: "m-sc-agriculture-regular", duration: "2 years", sectorSlug: "agriculture", description: "Regular postgraduate agriculture program." },
  { name: "B.Sc (Home Science)", slug: "b-sc-home-science-regular", duration: "3 years", sectorSlug: "home-maintenance", description: "Regular home science undergraduate program." },
  { name: "M.Sc (Home Science)", slug: "m-sc-home-science-regular", duration: "2 years", sectorSlug: "home-maintenance", description: "Regular postgraduate home science program." },
  { name: "BJMC", slug: "bjmc-regular", duration: "3 years", sectorSlug: "media", description: "Regular bachelor in journalism and mass communication." },
  { name: "MJMC", slug: "mjmc-regular", duration: "2 years", sectorSlug: "media", description: "Regular master in journalism and mass communication." },
  { name: "LLB", slug: "llb-regular", duration: "3 years", sectorSlug: "management", description: "Regular bachelor of laws program." },
  { name: "BA-LLB", slug: "ba-llb-regular", duration: "5 years", sectorSlug: "management", description: "Integrated regular BA-LLB law program." },
  { name: "LLM", slug: "llm-regular", duration: "2 years", sectorSlug: "management", description: "Regular master of laws program." },
  { name: "PhD (Technical)", slug: "phd-technical-regular", duration: "3 years", sectorSlug: "technical-training", description: "Doctoral research program in technical disciplines." },
  { name: "PhD (Non-Technical)", slug: "phd-non-technical-regular", duration: "3 years", sectorSlug: "management", description: "Doctoral research program in non-technical disciplines." },
] as const;

const vocationalCourseDefs = [
  { name: "Diploma in Horticulture", slug: "diploma-in-horticulture-voc", duration: "1 year", sectorSlug: "agriculture", description: "Vocational horticulture program with practical cultivation and nursery skills.", fees: 30000 },
  { name: "Advanced Diploma in Mushroom Cultivation", slug: "advanced-diploma-in-mushroom-cultivation-voc", duration: "2 years", sectorSlug: "agriculture", description: "Advanced vocational program in mushroom cultivation and protected farming.", fees: 60000 },
  { name: "Bachelor Vocational in Agriculture Technology", slug: "bachelor-vocational-in-agriculture-technology-voc", duration: "3 years", sectorSlug: "agriculture", description: "BVoc pathway in modern agriculture systems and applied agri-practices.", fees: 90000 },
  { name: "Diploma in Automobile Technology", slug: "diploma-in-automobile-technology-voc", duration: "1 year", sectorSlug: "automobile", description: "Vocational automobile program in diagnostics, maintenance, and repair.", fees: 30000 },
  { name: "Advanced Diploma in Diesel Engine Technology", slug: "advanced-diploma-in-diesel-engine-technology-voc", duration: "2 years", sectorSlug: "automobile", description: "Advanced diesel systems and heavy-vehicle service vocational track.", fees: 60000 },
  { name: "Bachelor Vocational in Automobile Engineering", slug: "bachelor-vocational-in-automobile-engineering-voc", duration: "3 years", sectorSlug: "automobile", description: "BVoc degree in automotive systems, electronics, and workshop operations.", fees: 90000 },
  { name: "Diploma in Nursery Teacher Training", slug: "diploma-in-nursery-teacher-training-voc", duration: "1 year", sectorSlug: "child-education", description: "Vocational teacher training for early-years learning environments.", fees: 30000 },
  { name: "Advanced Diploma in Montessori Child Education", slug: "advanced-diploma-in-montessori-child-education-voc", duration: "2 years", sectorSlug: "child-education", description: "Advanced pedagogical training in Montessori and child development methods.", fees: 60000 },
  { name: "Bachelor Vocational in Early Childhood Education", slug: "bachelor-vocational-in-early-childhood-education-voc", duration: "3 years", sectorSlug: "child-education", description: "BVoc program in early childhood care, curriculum, and school readiness.", fees: 90000 },
  { name: "Diploma in Civil Construction Supervisor", slug: "diploma-in-civil-construction-supervisor-voc", duration: "1 year", sectorSlug: "civil-construction", description: "Vocational civil site supervision and basic construction management.", fees: 30000 },
  { name: "Advanced Diploma in Architectural Technology", slug: "advanced-diploma-in-architectural-technology-voc", duration: "2 years", sectorSlug: "civil-construction", description: "Advanced drafting, design tools, and construction documentation skills.", fees: 60000 },
  { name: "Bachelor Vocational in Construction Management", slug: "bachelor-vocational-in-construction-management-voc", duration: "3 years", sectorSlug: "civil-construction", description: "BVoc degree focused on project planning, execution, and quality control.", fees: 90000 },
  { name: "Diploma in Electrical Technology", slug: "diploma-in-electrical-technology-voc", duration: "1 year", sectorSlug: "electrical-and-electronics", description: "Vocational electrical installation and maintenance fundamentals.", fees: 30000 },
  { name: "Advanced Diploma in Air Conditioning and Refrigeration", slug: "advanced-diploma-in-air-conditioning-and-refrigeration-voc", duration: "2 years", sectorSlug: "electrical-and-electronics", description: "Advanced HVAC and refrigeration servicing vocational track.", fees: 60000 },
  { name: "Bachelor Vocational in Electrical and Electronics", slug: "bachelor-vocational-in-electrical-and-electronics-voc", duration: "3 years", sectorSlug: "electrical-and-electronics", description: "BVoc program in electrical systems, electronics, and applied troubleshooting.", fees: 90000 },
  { name: "Diploma in Office Practice Management", slug: "diploma-in-office-practice-management-voc", duration: "1 year", sectorSlug: "office-management", description: "Vocational office operations, clerical systems, and digital workflows.", fees: 30000 },
  { name: "Advanced Diploma in Secretarial Practice", slug: "advanced-diploma-in-secretarial-practice-voc", duration: "2 years", sectorSlug: "office-management", description: "Advanced secretarial and administrative support vocational program.", fees: 60000 },
  { name: "Bachelor Vocational in Office Management", slug: "bachelor-vocational-in-office-management-voc", duration: "3 years", sectorSlug: "office-management", description: "BVoc pathway in office administration and business support services.", fees: 90000 },
  { name: "Diploma in Interior Designing", slug: "diploma-in-interior-designing-voc", duration: "1 year", sectorSlug: "interior-designing", description: "Vocational interior design program with practical planning and styling.", fees: 30000 },
  { name: "Advanced Diploma in Interior and Exterior Design", slug: "advanced-diploma-in-interior-and-exterior-design-voc", duration: "2 years", sectorSlug: "interior-designing", description: "Advanced design program for interior-exterior spaces and visualization.", fees: 60000 },
  { name: "Bachelor Vocational in Interior Design and Visualization", slug: "bachelor-vocational-in-interior-design-and-visualization-voc", duration: "3 years", sectorSlug: "interior-designing", description: "BVoc degree in interior planning, rendering, and design communication.", fees: 90000 },
  { name: "Diploma in Dairy Technology", slug: "diploma-in-dairy-technology-voc", duration: "1 year", sectorSlug: "dairy-education", description: "Vocational dairy processing and quality operations program.", fees: 30000 },
  { name: "Advanced Diploma in Dairy Products Processing", slug: "advanced-diploma-in-dairy-products-processing-voc", duration: "2 years", sectorSlug: "dairy-education", description: "Advanced dairy products and cold-chain processing vocational track.", fees: 60000 },
  { name: "Bachelor Vocational in Dairy Operations", slug: "bachelor-vocational-in-dairy-operations-voc", duration: "3 years", sectorSlug: "dairy-education", description: "BVoc degree in dairy plant operations and product systems.", fees: 90000 },
  { name: "Diploma in Fisheries Technology", slug: "diploma-in-fisheries-technology-voc", duration: "1 year", sectorSlug: "fisheries", description: "Vocational fisheries training in aquaculture and hatchery basics.", fees: 30000 },
  { name: "Advanced Diploma in Hatchery Operations", slug: "advanced-diploma-in-hatchery-operations-voc", duration: "2 years", sectorSlug: "fisheries", description: "Advanced hatchery operations, feed, and fisheries production systems.", fees: 60000 },
  { name: "Bachelor Vocational in Aquaculture Management", slug: "bachelor-vocational-in-aquaculture-management-voc", duration: "3 years", sectorSlug: "fisheries", description: "BVoc program in aquaculture business and fisheries field management.", fees: 90000 },
  { name: "Diploma in Poultry Technology", slug: "diploma-in-poultry-technology-voc", duration: "1 year", sectorSlug: "poultry", description: "Vocational poultry farm operations and health management program.", fees: 30000 },
  { name: "Advanced Diploma in Poultry Feed Technician", slug: "advanced-diploma-in-poultry-feed-technician-voc", duration: "2 years", sectorSlug: "poultry", description: "Advanced poultry feed and nutrition operations vocational track.", fees: 60000 },
  { name: "Bachelor Vocational in Poultry Management", slug: "bachelor-vocational-in-poultry-management-voc", duration: "3 years", sectorSlug: "poultry", description: "BVoc degree in end-to-end poultry production and business systems.", fees: 90000 },
  { name: "Diploma in Cottage Industry Crafts", slug: "diploma-in-cottage-industry-crafts-voc", duration: "1 year", sectorSlug: "cottage-industry", description: "Vocational craft program for small-scale cottage industry production.", fees: 30000 },
  { name: "Advanced Diploma in Jute and Craft Manufacturing", slug: "advanced-diploma-in-jute-and-craft-manufacturing-voc", duration: "2 years", sectorSlug: "cottage-industry", description: "Advanced vocational training in jute, crafts, and handmade products.", fees: 60000 },
  { name: "Bachelor Vocational in Cottage Enterprise", slug: "bachelor-vocational-in-cottage-enterprise-voc", duration: "3 years", sectorSlug: "cottage-industry", description: "BVoc degree in cottage enterprise, production, and market linkage.", fees: 90000 },
  { name: "Diploma in Spoken English and Employability", slug: "diploma-in-spoken-english-and-employability-voc", duration: "1 year", sectorSlug: "soft-skills", description: "Vocational program in communication and employability skills.", fees: 30000 },
  { name: "Advanced Diploma in Personality Development", slug: "advanced-diploma-in-personality-development-voc", duration: "2 years", sectorSlug: "soft-skills", description: "Advanced interpersonal, communication, and workplace skill development.", fees: 60000 },
  { name: "Bachelor Vocational in Soft Skills and Training", slug: "bachelor-vocational-in-soft-skills-and-training-voc", duration: "3 years", sectorSlug: "soft-skills", description: "BVoc degree for corporate communication and trainer career pathways.", fees: 90000 },
] as const;

function toSkillSlug(prefix: string, topic: string) {
  return slugify(`${prefix} ${topic} skill`)
    .replace(/-c-$/i, "-c")
    .replace(/-net-/gi, "-dotnet-");
}

const skillCourseDefs = skillBaseCoursesFromPdf.flatMap((item) => [
  {
    name: `Certificate in ${item.topic}`,
    slug: toSkillSlug("certificate in", item.topic),
    duration: "6 months",
    sectorSlug: item.sectorSlug,
    description: `Skill certification program in ${item.topic}.`,
    fees: 6000,
  },
  {
    name: `Diploma in ${item.topic}`,
    slug: toSkillSlug("diploma in", item.topic),
    duration: "11 months",
    sectorSlug: item.sectorSlug,
    description: `Skill diploma program in ${item.topic}.`,
    fees: 10000,
  },
]);

const bvocPdfBasePrograms = [
  "Management and Entrepreneurship (Retail)",
  "Banking, Financial Services and Insurance Skills",
  "E Commerce and Digital Marketing Skill",
  "Entrepreneurship Skill",
  "Fire Technology and Industrial Safety Management",
  "Graphic Designing",
  "Internet of Things Programming and Big Data",
  "Manufacturing Skill",
  "Accounting and Business",
  "Visual Communication",
  "Hotel Management and Catering Science",
  "Airport and Airline Management",
  "Robotics and Artificial Intelligence",
  "Childhood Care and Education",
  "Computer Science",
  "Fashion Designing",
  "Gaming",
  "IT ITes Software Development",
  "Jewellery Design and Management",
  "Logistics Management",
  "Machine Learning and Artificial Intelligence",
  "Media and Entertainment",
  "Refrigeration and Air Conditioning",
  "Power Renewable Energy Technology",
  "Yoga and Naturopathy",
  "Information Technology",
  "Information Technology and Android Technology",
  "IT Networking",
  "Tourism and Hospitality",
  "Beauty and Wellness",
  "Software Development",
  "Animation",
  "Hospitality and Hotel Management",
  "Applied Computer Technology",
  "Electrical Skills",
  "Health Care",
  "3D Animation and VFX",
  "Automotive Skills",
  "Food Processing and Quality Management",
  "Multimedia",
  "Web Technologies",
  "Hospital Administration",
  "Tea Husbandry and Technology",
  "Agriculture and Rural Development",
  "Software Development and System Administration",
  "Business and Data Analytics",
  "Cyber Crime",
  "Textile Design",
  "Food Processing",
  "Automobiles",
  "Fire Safety",
  "Journalism and Mass Communication",
  "Interior Designing",
  "Paramedical and Health Administration",
  "Physiotherapy",
  "Pharmaceutical Chemistry",
  "CMSED",
  "Dental Hygiene",
  "Operation Theater",
  "Medical Laboratory Technology",
  "Critical Care Technology",
  "Patient Care Technology",
  "Optometry",
  "Medical Image Technology",
  "Cardiac Care Technology",
  "Dialysis Technology",
] as const;

function inferVocationalSectorSlug(programName: string): string {
  const name = programName.toLowerCase();
  if (/(hotel|hospitality|culinary|tourism|catering)/.test(name)) return "hotel-management";
  if (/(airport|airline|aviation)/.test(name)) return "aviation";
  if (/(fashion|textile|beauty|wellness)/.test(name)) return "fashion";
  if (/(media|journalism|animation|graphic|visual|multimedia|vfx)/.test(name)) return "media";
  if (/(banking|finance|insurance|accounting)/.test(name)) return "banking-and-finance";
  if (/(agriculture|tea|rural|food processing)/.test(name)) return "agriculture";
  if (/(automobile|automotive)/.test(name)) return "automobile";
  if (/(fire|safety)/.test(name)) return "fire-and-safety";
  if (/(electrical|refrigeration|air conditioning|renewable energy|power)/.test(name)) return "electrical-and-electronics";
  if (/(yoga|naturopathy)/.test(name)) return "yoga-and-naturopathy";
  if (/(medical|health|physio|pharma|dental|dialysis|optometry|cardiac|operation theater|hospital administration|paramedical)/.test(name)) return "mental-health";
  if (/(computer|software|it|iot|android|machine learning|robotics|cyber|web|data|gaming|cmsed)/.test(name)) return "computing-and-information-technology";
  if (/(interior)/.test(name)) return "interior-designing";
  if (/(management|entrepreneurship|logistics|business)/.test(name)) return "management";
  return "technical-training";
}

const vocationalBvocPdfCourseDefs = bvocPdfBasePrograms.flatMap((program) => {
  const base = slugify(program);
  const sectorSlug = inferVocationalSectorSlug(program);
  return [
    {
      name: `Diploma in ${program}`,
      slug: `${base}-voc-diploma`,
      duration: "1 year",
      sectorSlug,
      description: `Vocational diploma track in ${program}.`,
      fees: 30000,
    },
    {
      name: `Advanced Diploma in ${program}`,
      slug: `${base}-voc-advanced-diploma`,
      duration: "2 years",
      sectorSlug,
      description: `Advanced vocational diploma track in ${program}.`,
      fees: 60000,
    },
    {
      name: `Bachelor Vocational in ${program}`,
      slug: `${base}-voc-bachelor`,
      duration: "3 years",
      sectorSlug,
      description: `Bachelor vocational degree track in ${program}.`,
      fees: 90000,
    },
  ];
});

const allVocationalCourseDefs = [...vocationalCourseDefs, ...vocationalBvocPdfCourseDefs];

const onlineUniversityProgramCatalog: Record<string, Record<string, { fees: number; duration: string }>> = {
  "shoolini-university": {
    bba: { fees: 120000, duration: "3 years" },
    "bcom-hons": { fees: 120000, duration: "3 years" },
    "ba-journalism-and-mass-communication": { fees: 120000, duration: "3 years" },
    bca: { fees: 120000, duration: "3 years" },
    mba: { fees: 150000, duration: "2 years" },
    "ma-english": { fees: 80000, duration: "2 years" },
    mca: { fees: 150000, duration: "2 years" },
  },
  "maharishi-markandeshwar-university": {
    bca: { fees: 90000, duration: "3 years" },
    bba: { fees: 105000, duration: "3 years" },
    bcom: { fees: 105000, duration: "3 years" },
    "msc-mathematics": { fees: 70000, duration: "2 years" },
    mba: { fees: 110000, duration: "2 years" },
    mca: { fees: 84000, duration: "2 years" },
  },
  "noida-international-university": {
    bba: { fees: 108000, duration: "3 years" },
    ba: { fees: 70000, duration: "3 years" },
    "ba-journalism-and-mass-communication": { fees: 90000, duration: "3 years" },
    mba: { fees: 118000, duration: "2 years" },
    "ma-journalism-and-mass-communication": { fees: 108000, duration: "2 years" },
    "ma-english": { fees: 68000, duration: "2 years" },
    "msc-mathematics": { fees: 108000, duration: "2 years" },
    bca: { fees: 108000, duration: "3 years" },
    bcom: { fees: 75000, duration: "3 years" },
    mca: { fees: 118000, duration: "2 years" },
    mcom: { fees: 80000, duration: "2 years" },
    "ma-international-relations": { fees: 68000, duration: "2 years" },
  },
  "suresh-gyan-vihar-university": {
    bcom: { fees: 54000, duration: "3 years" },
    mcom: { fees: 36000, duration: "2 years" },
    ba: { fees: 48000, duration: "3 years" },
    "ma-economics": { fees: 32000, duration: "2 years" },
    bba: { fees: 75000, duration: "3 years" },
    "ba-journalism": { fees: 69000, duration: "3 years" },
    mba: { fees: 70000, duration: "2 years" },
    mca: { fees: 70000, duration: "2 years" },
    "msc-mathematics": { fees: 50000, duration: "2 years" },
    "ba-2-0": { fees: 69000, duration: "3 years" },
    bca: { fees: 75000, duration: "3 years" },
    blib: { fees: 25000, duration: "1 year" },
  },
  "bharati-vidyapeeth-university": {
    mba: { fees: 160000, duration: "2 years" },
    bba: { fees: 140000, duration: "3 years" },
    bca: { fees: 140000, duration: "3 years" },
    mca: { fees: 160000, duration: "2 years" },
  },
  "marwadi-university": {
    mba: { fees: 120000, duration: "2 years" },
    bba: { fees: 105000, duration: "3 years" },
    bca: { fees: 105000, duration: "3 years" },
    mca: { fees: 120000, duration: "2 years" },
    ma: { fees: 42000, duration: "2 years" },
    ba: { fees: 60000, duration: "3 years" },
    bcom: { fees: 75000, duration: "3 years" },
  },
  "uttaranchal-university": {
    bba: { fees: 105000, duration: "3 years" },
    bca: { fees: 105000, duration: "3 years" },
    mba: { fees: 120000, duration: "2 years" },
    mca: { fees: 120000, duration: "2 years" },
    ma: { fees: 60000, duration: "2 years" },
    "msc-mathematics": { fees: 60000, duration: "2 years" },
  },
  "mangalayatan-university": {
    ba: { fees: 31000, duration: "3 years" },
    bba: { fees: 64000, duration: "3 years" },
    bca: { fees: 70000, duration: "3 years" },
    "diploma-in-computer-application-dca": { fees: 24000, duration: "1 year" },
    "ma-english": { fees: 37000, duration: "2 years" },
    "ma-political-science": { fees: 37000, duration: "2 years" },
    "ma-journalism-and-mass-communication": { fees: 37000, duration: "2 years" },
    "ma-education": { fees: 37000, duration: "2 years" },
    "ma-public-administration": { fees: 37000, duration: "2 years" },
    "msc-mathematics": { fees: 55000, duration: "2 years" },
    mcom: { fees: 41000, duration: "2 years" },
    "mba-human-resource-management": { fees: 67000, duration: "2 years" },
    "mba-marketing-management": { fees: 67000, duration: "2 years" },
    "mba-operations-management": { fees: 67000, duration: "2 years" },
    "mba-finance-management": { fees: 67000, duration: "2 years" },
    mca: { fees: 67000, duration: "2 years" },
    "pg-diploma-in-computer-application-pgdca": { fees: 34000, duration: "1 year" },
    "pg-diploma-in-journalism-and-mass-communication-pgjmc": { fees: 19000, duration: "1 year" },
    "pg-diploma-in-business-management-pgdbm": { fees: 34000, duration: "1 year" },
    "pg-diploma-in-business-management": { fees: 34000, duration: "1 year" },
    "diploma-in-accounts-and-business-law": { fees: 24000, duration: "1 year" },
    "diploma-in-accounts-and-finance": { fees: 24000, duration: "1 year" },
    "diploma-in-business-management": { fees: 24000, duration: "1 year" },
    "diploma-in-human-resource-management": { fees: 24000, duration: "1 year" },
    "diploma-in-marketing-management": { fees: 24000, duration: "1 year" },
    "diploma-in-business-administration": { fees: 24000, duration: "1 year" },
    "diploma-in-artificial-intelligence-and-machine-learning": { fees: 24000, duration: "1 year" },
    "diploma-in-big-data-and-cloud-computing": { fees: 24000, duration: "1 year" },
    "diploma-in-cyber-security-and-information-security": { fees: 24000, duration: "1 year" },
    "diploma-in-iot-internet-of-things-engineering": { fees: 24000, duration: "1 year" },
    "diploma-in-machine-learning-with-python-and-r": { fees: 24000, duration: "1 year" },
    "diploma-in-software-development": { fees: 24000, duration: "1 year" },
    "diploma-in-sociological-studies": { fees: 24000, duration: "1 year" },
    "diploma-in-culture-and-social-structure": { fees: 24000, duration: "1 year" },
    "diploma-in-political-and-administrative-studies": { fees: 24000, duration: "1 year" },
    "diploma-in-political-and-historical-foundations": { fees: 24000, duration: "1 year" },
    "diploma-in-english-language-and-literature": { fees: 24000, duration: "1 year" },
    "diploma-in-arts-and-humanities": { fees: 24000, duration: "1 year" },
    "diploma-in-journalism-and-mass-communication": { fees: 24000, duration: "1 year" },
    "diploma-in-commerce-and-business-studies": { fees: 24000, duration: "1 year" },
    "diploma-in-microbiology-and-archegoniate": { fees: 24000, duration: "1 year" },
    "diploma-in-basic-science-pcb-pcm-zbc": { fees: 24000, duration: "1 year" },
    "pg-diploma-in-leadership-and-local-governance": { fees: 34000, duration: "1 year" },
    "pg-diploma-in-administration-and-public-policy": { fees: 34000, duration: "1 year" },
    "pg-diploma-in-english-literature-and-linguistic-studies": { fees: 34000, duration: "1 year" },
    "pg-diploma-in-historical-studies-and-cultural-perspectives": { fees: 34000, duration: "1 year" },
    "pg-diploma-in-political-studies": { fees: 34000, duration: "1 year" },
    "pg-diploma-in-sociological-studies": { fees: 34000, duration: "1 year" },
    "pg-diploma-in-accounts-and-finance": { fees: 34000, duration: "1 year" },
    "pg-diploma-in-financial-management": { fees: 34000, duration: "1 year" },
    "pg-diploma-in-human-resource-management": { fees: 34000, duration: "1 year" },
    "pg-diploma-in-marketing-management": { fees: 34000, duration: "1 year" },
    "pg-diploma-in-operations-management": { fees: 34000, duration: "1 year" },
    "pg-diploma-in-mathematics": { fees: 34000, duration: "1 year" },
    "pg-diploma-in-cyber-security": { fees: 34000, duration: "1 year" },
    "pg-diploma-in-cloud-computing": { fees: 34000, duration: "1 year" },
    "pg-diploma-in-big-data-analytics": { fees: 34000, duration: "1 year" },
    "pg-diploma-in-education": { fees: 34000, duration: "1 year" },
  },
};

const distanceUniversityProgramCatalog: Record<string, Record<string, { fees: number; duration: string }>> = {
  "mangalayatan-university": {
    "ba-distance": { fees: 8800, duration: "3 years" }, // first year
    "bcom-distance": { fees: 11000, duration: "3 years" }, // first year
    "ma-sociology-distance": { fees: 14000, duration: "2 years" }, // per year
    "ma-political-science-distance": { fees: 14000, duration: "2 years" }, // per year
    "ma-english-distance": { fees: 14000, duration: "2 years" }, // per year
    "ma-history-distance": { fees: 14000, duration: "2 years" }, // per year
    "mcom-distance": { fees: 14000, duration: "2 years" }, // per year
    "msc-mathematics-distance": { fees: 28000, duration: "2 years" }, // per year
    "mba-distance": { fees: 30000, duration: "2 years" }, // per year
    "ba-journalism-distance": { fees: 56000, duration: "3 years" },
    "bsc-distance": { fees: 80000, duration: "3 years" },
    "blib-distance": { fees: 22000, duration: "1 year" },
    "mlib-distance": { fees: 24000, duration: "1 year" },
  },
  "bharati-vidyapeeth-university": {
    "ba-distance": { fees: 20000, duration: "3 years" },
    "bcom-distance": { fees: 20000, duration: "3 years" },
    "bba-distance": { fees: 71000, duration: "3 years" },
    "bca-distance": { fees: 71000, duration: "3 years" },
    "ma-english-distance": { fees: 18000, duration: "2 years" },
    "ma-economics-distance": { fees: 18000, duration: "2 years" },
    "mcom-distance": { fees: 18000, duration: "2 years" },
    "mba-distance": { fees: 86000, duration: "2 years" },
    "mca-distance": { fees: 86000, duration: "2 years" },
    "msc-mathematics-distance": { fees: 28000, duration: "2 years" },
    "msw-distance": { fees: 72000, duration: "2 years" },
  },
};

const distanceManagedCourseSlugs = new Set(
  Object.values(distanceUniversityProgramCatalog).flatMap((catalog) => Object.keys(catalog)),
);

function makeCourseName(mode: string, variant: number, sector: string) {
  const regular = ["BBA", "BCA", "BCom", "BA", "BSc", "MBA"];
  const distance = ["Distance BA", "Distance BCom", "Distance MA", "Distance MCom", "Distance Diploma", "Distance PG Diploma"];
  const vocational = ["Diploma", "Advanced Diploma", "B.Voc", "Vocational Training", "Applied Diploma", "Industry Diploma"];
  const skill = ["Certificate", "Skill Certification", "Advanced Certificate", "Professional Certification", "Micro Certificate", "Job Ready Certification"];

  const picks: Record<string, string[]> = {
    Regular: regular,
    Distance: distance,
    Vocational: vocational,
    "Skill Certification": skill,
  };

  const base = picks[mode][variant % picks[mode].length];
  if (["Certificate", "Diploma", "Advanced Diploma", "Skill Certification", "Advanced Certificate", "Professional Certification", "Micro Certificate", "Job Ready Certification", "Industry Diploma", "Applied Diploma", "Vocational Training", "Executive Program"].includes(base)) {
    return `${base} in ${sector}`;
  }
  return `${base} in ${sector}`;
}

function makeDuration(mode: string, variant: number) {
  if (mode === "Regular") return variant % 2 === 0 ? "3 years" : "2 years";
  if (mode === "Distance") return variant % 2 === 0 ? "2 years" : "3 years";
  if (mode === "Vocational") return ["1 year", "2 years", "3 years"][variant % 3];
  return ["3 months", "6 months", "9 months", "12 months"][variant % 4];
}

const courses: Course[] = [];
for (const sector of sectors) {
  for (const mode of modes) {
    if (
      mode.name === "Online" ||
      mode.name === "Distance" ||
      mode.name === "Vocational" ||
      mode.name === "Skill Certification" ||
      mode.name === "Regular"
    ) continue;
    for (let v = 0; v < 6; v += 1) {
      const name = makeCourseName(mode.name, v, sector.name);
      const slug = slugify(`${sector.slug}-${mode.name}-${v + 1}-${name}`);
      courses.push({
        id: `c-${courses.length + 1}`,
        name,
        slug,
        description: `${name} with practical curriculum, expert mentoring, and career-focused outcomes for ${sector.name.toLowerCase()} roles.`,
        duration: makeDuration(mode.name, v),
        sector_id: sector.id,
        mode_id: mode.id,
        sector,
        mode,
      });
    }
  }
}

for (const item of regularCourseDefs) {
  const sector = sectors.find((s) => s.slug === item.sectorSlug);
  if (!sector) continue;
  courses.push({
    id: `c-${courses.length + 1}`,
    name: item.name,
    slug: item.slug,
    description: item.description,
    duration: item.duration,
    sector_id: sector.id,
    mode_id: regularMode.id,
    sector,
    mode: regularMode,
  });
}

for (const item of onlineCourseDefs) {
  const sector = sectors.find((s) => s.slug === item.sectorSlug);
  if (!sector) continue;
  courses.push({
    id: `c-${courses.length + 1}`,
    name: item.name,
    slug: item.slug,
    description: item.description,
    duration: item.duration,
    sector_id: sector.id,
    mode_id: onlineMode.id,
    sector,
    mode: onlineMode,
  });
}

for (const item of distanceCourseDefs) {
  const sector = sectors.find((s) => s.slug === item.sectorSlug);
  if (!sector) continue;
  courses.push({
    id: `c-${courses.length + 1}`,
    name: item.name,
    slug: item.slug,
    description: item.description,
    duration: item.duration,
    sector_id: sector.id,
    mode_id: distanceMode.id,
    sector,
    mode: distanceMode,
  });
}

for (const item of allVocationalCourseDefs) {
  const sector = sectors.find((s) => s.slug === item.sectorSlug);
  if (!sector) continue;
  courses.push({
    id: `c-${courses.length + 1}`,
    name: item.name,
    slug: item.slug,
    description: item.description,
    duration: item.duration,
    sector_id: sector.id,
    mode_id: vocationalMode.id,
    sector,
    mode: vocationalMode,
  });
}

for (const item of skillCourseDefs) {
  const sector = sectors.find((s) => s.slug === item.sectorSlug);
  if (!sector) continue;
  courses.push({
    id: `c-${courses.length + 1}`,
    name: item.name,
    slug: item.slug,
    description: item.description,
    duration: item.duration,
    sector_id: sector.id,
    mode_id: skillMode.id,
    sector,
    mode: skillMode,
  });
}

const vocationalCatalogByUniversity: Record<string, Record<string, { fees: number; duration: string }>> = {
  "glocal-university": Object.fromEntries(allVocationalCourseDefs.map((c) => [c.slug, { fees: c.fees, duration: c.duration }])),
};

const skillCatalogByUniversity: Record<string, Record<string, { fees: number; duration: string }>> = {
  "glocal-university": Object.fromEntries(skillCourseDefs.map((c) => [c.slug, { fees: c.fees, duration: c.duration }])),
};

const universityCourses: UniversityCourse[] = [];
for (const university of universities) {
  for (const course of courses) {
    const modeName = course.mode?.name ?? "";
    if (!university.mode_supported.includes(modeName)) continue;

    const hash = hashCode(`${university.slug}-${course.slug}`);
    let fee = 0;
    if (modeName === "Online") {
      const onlinePrograms = onlineUniversityProgramCatalog[university.slug];
      const program = onlinePrograms?.[course.slug];
      if (!program) continue;
      fee = program.fees;
    }
    if (modeName === "Distance") {
      const distancePrograms = distanceUniversityProgramCatalog[university.slug];
      const distanceProgram = distancePrograms?.[course.slug];
      if (distanceManagedCourseSlugs.has(course.slug) && !distanceProgram) continue;
      fee = distanceProgram ? distanceProgram.fees : 18000 + (hash % 72001);
    }
    if (modeName === "Regular") fee = 0;
    if (modeName === "Skill Certification") fee = 5000 + (hash % 20001);
    if (modeName === "Skill Certification") {
      const skillPrograms = skillCatalogByUniversity[university.slug];
      const skillProgram = skillPrograms?.[course.slug];
      if (skillProgram) fee = skillProgram.fees;
    }
    if (modeName === "Vocational") {
      const vocationalPrograms = vocationalCatalogByUniversity[university.slug];
      const vocationalProgram = vocationalPrograms?.[course.slug];
      if (vocationalProgram) fee = vocationalProgram.fees;
      else if (course.name.startsWith("Advanced Diploma")) fee = 60000;
      else if (course.name.startsWith("B.Voc") || course.name.startsWith("Bachelor Vocational")) fee = 90000;
      else fee = 30000;
    }

    universityCourses.push({
      id: `uc-${universityCourses.length + 1}`,
      university_id: university.id,
      course_id: course.id,
      fees: fee,
      duration:
        modeName === "Online"
          ? onlineUniversityProgramCatalog[university.slug][course.slug].duration
          : modeName === "Distance" && distanceUniversityProgramCatalog[university.slug]?.[course.slug]
            ? distanceUniversityProgramCatalog[university.slug][course.slug].duration
            : modeName === "Vocational" && vocationalCatalogByUniversity[university.slug]?.[course.slug]
              ? vocationalCatalogByUniversity[university.slug][course.slug].duration
              : modeName === "Skill Certification" && skillCatalogByUniversity[university.slug]?.[course.slug]
                ? skillCatalogByUniversity[university.slug][course.slug].duration
            : course.duration,
      university,
      course,
    });
  }
}

const ratings: Rating[] = courses.map((course, idx) => {
  const h = hashCode(course.slug);
  const rating = 3.8 + (h % 11) / 10;
  return {
    id: `r-${idx + 1}`,
    course_id: course.id,
    rating: Number(rating.toFixed(1)),
    review_count: 10 + (h % 491),
  };
});

const blogs: Blog[] = [
  {
    id: "b1",
    title: "How to Choose the Right University in India: Complete Student Checklist",
    slug: "how-to-choose-the-right-university-in-india",
    excerpt: "A practical framework to compare UGC approvals, NAAC grades, fees, placements, and student support before admission.",
    content:
      "Choosing the right university is one of the most important career decisions for any student. Before applying, shortlist institutions with clear UGC recognition, NAAC accreditation, transparent fee structure, and strong academic support.\n\nStart with mode fit: online, distance, vocational, skill certification, or regular degree. Your preferred learning mode should match your schedule, budget, and career goal. Students who work full time usually prefer online and distance programs, while campus-focused learners may choose regular mode.\n\nNext, compare outcomes. Look at program curriculum, specialization options, internship support, and placement guidance. Also review learning support such as LMS quality, mentorship access, doubt-solving process, and exam flexibility.\n\nFinally, compare total cost of ownership. Check one-year fees, per-semester fees, exam fee, registration fee, and any hidden charges. A low fee is useful only if the academic quality and career outcomes are strong.",
    image: "https://images.pexels.com/photos/1454360/pexels-photo-1454360.jpeg?auto=compress&cs=tinysrgb&w=1600",
  },
  {
    id: "b2",
    title: "Online vs Distance Education: Key Differences, Fees, and Career Value",
    slug: "online-vs-distance-education-key-differences",
    excerpt: "Understand how online education and distance education differ in class delivery, flexibility, fee model, and placement support.",
    content:
      "Online education and distance education are often treated as the same, but they work differently. Online programs are technology-led with live classes, recorded lectures, online assessments, and frequent interaction with faculty.\n\nDistance programs are more self-paced and document-driven. They are ideal for students who need maximum flexibility and can study independently. In many cases, distance mode is more budget-friendly, while online mode may offer better digital engagement and industry sessions.\n\nWhen comparing online vs distance education, evaluate learning style first. If you need mentorship and structured schedules, online mode is usually better. If your priority is affordability and flexibility, distance mode can be a strong option.\n\nFor career growth, choose approved institutions and programs with practical curriculum, internship guidance, and project-based evaluation. Accreditation and university reputation are more important than marketing claims.",
    image: "https://images.pexels.com/photos/159740/library-la-trobe-study-students-159740.jpeg?auto=compress&cs=tinysrgb&w=1600",
  },
  {
    id: "b3",
    title: "Top Career Courses in 2026: High-Demand Programs for Jobs and Growth",
    slug: "top-career-courses-in-2026-high-demand-programs",
    excerpt: "Explore high-demand courses in management, data science, AI, logistics, healthcare, media, and finance for better employability.",
    content:
      "Course demand in 2026 is strongly influenced by digital transformation, automation, and sector specialization. Programs in management, data science, cybersecurity, logistics, healthcare administration, and financial analytics continue to show consistent demand.\n\nFor graduates, BBA, BCA, and BCom with domain specialization remain practical choices. For postgraduates, MBA, MCA, and MCom are still relevant when aligned to clear job roles like business analytics, marketing, HR, product operations, and digital finance.\n\nShort-duration skill certification programs are also rising in value. Courses in digital marketing, UI/UX, data tools, and communication skills help improve interview readiness and role-specific capability.\n\nThe best strategy is to select a course based on your current profile, target industry, and salary progression path. Always compare curriculum depth, project exposure, and university support before admission.",
    image: "https://images.pexels.com/photos/5212685/pexels-photo-5212685.jpeg?auto=compress&cs=tinysrgb&w=1600",
  },
  {
    id: "b4",
    title: "Best MBA Specializations in India: Marketing, Finance, HR, and Operations",
    slug: "best-mba-specializations-in-india",
    excerpt: "Compare top MBA specializations by career path, salary scope, and industry demand to pick the right postgraduate management program.",
    content:
      "MBA is one of the most flexible postgraduate degrees, but specialization choice decides career direction. Marketing is ideal for brand, sales, growth, and digital roles. Finance suits valuation, banking, risk, and corporate finance careers.\n\nHR specialization is strong for people management, talent strategy, and organizational development roles. Operations is best for supply chain, process excellence, manufacturing systems, and logistics functions.\n\nStudents should evaluate specialization through three factors: role fit, industry demand, and long-term growth. Avoid choosing only on trend; choose based on your strengths and work preference.\n\nBefore finalizing any MBA program, compare fee structure, faculty profile, curriculum relevance, and placement guidance. A specialization works best when the university provides practical projects and industry-linked training.",
    image: "https://images.pexels.com/photos/3184465/pexels-photo-3184465.jpeg?auto=compress&cs=tinysrgb&w=1600",
  },
  {
    id: "b5",
    title: "Future of Data Science Careers in India: Skills, Roles, and Salary Trends",
    slug: "future-of-data-science-careers-in-india",
    excerpt: "A complete guide to data science career growth, required skills, entry-level roles, and salary trends in India.",
    content:
      "Data science careers in India are expanding beyond IT companies into finance, healthcare, retail, logistics, and edtech. Employers now prioritize practical analytics skills, business understanding, and communication clarity.\n\nCore skills include Python, SQL, statistics, visualization, machine learning basics, and dashboard storytelling. Entry-level opportunities include data analyst, BI analyst, reporting specialist, and junior ML support roles.\n\nStudents from BCA, BSc, BTech, MBA analytics, and even non-technical backgrounds can transition through structured certification and project-based learning.\n\nFor better outcomes, choose courses that include case studies, portfolio projects, and interview preparation. Recruiters value demonstrated problem-solving ability more than just certificates.",
    image: "https://images.pexels.com/photos/669615/pexels-photo-669615.jpeg?auto=compress&cs=tinysrgb&w=1600",
  },
  {
    id: "b6",
    title: "Top Aviation Courses in India: Airport, Cabin Crew, and Ticketing Careers",
    slug: "top-aviation-courses-in-india-career-guide",
    excerpt: "Compare aviation programs like airport management, cabin crew, and ticketing with eligibility, duration, and career scope.",
    content:
      "Aviation courses are becoming popular among students looking for service, operations, and travel industry careers. Common options include airport management, cabin crew training, air fare and ticketing, and airline travel support.\n\nAirport ground operations roles require discipline, communication, and customer handling ability. Cabin crew-focused programs emphasize hospitality, grooming, safety protocols, and in-flight service training.\n\nBefore enrollment, compare course duration, practical exposure, language training, and placement support. Skill-focused aviation courses can offer faster entry into operational roles.\n\nStudents should also review total fees, certification credibility, and interview support to improve employability in airlines and airport service companies.",
    image: "https://images.pexels.com/photos/358319/pexels-photo-358319.jpeg?auto=compress&cs=tinysrgb&w=1600",
  },
  {
    id: "b7",
    title: "Best Universities for Online Degrees: What to Check Before Admission",
    slug: "best-universities-for-online-degrees-india",
    excerpt: "Learn how to evaluate online universities by approvals, LMS quality, exam process, and student support systems.",
    content:
      "Not all online degree programs offer the same quality. Students should check university approval status, NAAC grade, course structure, and exam process before applying.\n\nA strong online university provides a stable LMS, live and recorded classes, faculty interaction, mentorship, and clear assignment timelines. Student support quality is a major differentiator in online education success.\n\nReview university performance on transparency: fee breakup, refund policy, evaluation rules, and counseling support. Also check whether the program includes skill modules and industry interaction.\n\nThe right online degree is the one that fits your goal, budget, and schedule while maintaining strong academic credibility.",
    image: "https://images.pexels.com/photos/267507/pexels-photo-267507.jpeg?auto=compress&cs=tinysrgb&w=1600",
  },
  {
    id: "b8",
    title: "Vocational Programs with High Employability: Diploma to BVoc Pathways",
    slug: "vocational-programs-with-high-employability",
    excerpt: "Understand vocational education pathways from Diploma to Advanced Diploma to BVoc with practical career outcomes.",
    content:
      "Vocational education is a practical pathway for students who want job-ready skills. Many universities offer three progression levels: 1-year Diploma, 2-year Advanced Diploma, and 3-year Bachelor Vocational (BVoc).\n\nThis model helps students exit and re-enter learning with recognized qualification stages. It is especially useful for sectors like automobile, agriculture, hospitality, electrical, and healthcare support.\n\nWhen comparing vocational programs, focus on workshop exposure, trainer quality, industry tools, and internship opportunities. Program design should align with real job roles, not only theory.\n\nFor students seeking early employability and skill-first careers, vocational mode offers one of the fastest and most practical routes.",
    image: "https://images.pexels.com/photos/8199609/pexels-photo-8199609.jpeg?auto=compress&cs=tinysrgb&w=1600",
  },
  {
    id: "b9",
    title: "How to Compare Course Fees Smartly: Semester Cost, Yearly Cost, and ROI",
    slug: "how-to-compare-course-fees-smartly-and-roi",
    excerpt: "A clear method to compare total fees, per-year cost, and return on investment across universities and education modes.",
    content:
      "Students often compare only headline tuition, but smart fee analysis requires full cost mapping. Always review one-year fees, per-semester fees, exam fee, registration fee, and any additional charges.\n\nCompare cost against expected outcomes: curriculum quality, skill modules, internship support, and placement readiness. A lower fee is useful only if the course builds real employable capability.\n\nFor online and distance programs, check whether the fee includes LMS access, recorded lectures, and assessment support. For regular programs, include living and travel expenses in your budgeting model.\n\nUse fee comparison along with course value and career pathway, not in isolation. This helps avoid low-value admissions and improves long-term ROI.",
    image: "https://images.pexels.com/photos/4386370/pexels-photo-4386370.jpeg?auto=compress&cs=tinysrgb&w=1600",
  },
  {
    id: "b10",
    title: "Top Skill Certifications for Working Professionals in 2026",
    slug: "top-skill-certifications-for-working-professionals-2026",
    excerpt: "Best short-duration certification courses for professionals in digital marketing, analytics, management, and communication.",
    content:
      "Working professionals increasingly choose short-duration skill certifications to upskill without pausing their career. High-value options include digital marketing, data tools, project coordination, financial analytics, and communication training.\n\nThe best certification is role-specific. If your target is growth marketing, choose performance and analytics-focused tracks. If your target is operations, prioritize process, reporting, and project tools.\n\nA strong program should include practical assignments, live mentorship, and portfolio-ready outputs. Certifications with only theory have lower hiring impact.\n\nBefore enrolling, verify mode flexibility, assessment quality, and final project support. With the right course, professionals can improve promotion readiness and role mobility quickly.",
    image: "https://images.pexels.com/photos/3183197/pexels-photo-3183197.jpeg?auto=compress&cs=tinysrgb&w=1600",
  },
];

export const mockData = {
  modes,
  sectors,
  universities,
  courses,
  universityCourses,
  ratings,
  blogs,
};

export function getMockCourseListings(): CourseListing[] {
  return courses.map((course) => {
    const linked = universityCourses.filter((uc) => uc.course_id === course.id);
    const rating = ratings.find((r) => r.course_id === course.id);

    const student_count = linked.reduce((acc, row) => acc + (100 + (hashCode(row.id) % 4901)), 0);

    return {
      course,
      min_fees: linked.length ? Math.min(...linked.map((item) => item.fees)) : 0,
      university_count: linked.length,
      student_count,
      average_rating: rating?.rating ?? 0,
      review_count: rating?.review_count ?? 0,
    };
  });
}

export function getMockUniversityListings(): UniversityListing[] {
  return universities.map((university) => {
    const linked = universityCourses.filter((uc) => uc.university_id === university.id);
    const linkedCourseIds = linked.map((item) => item.course_id);
    const linkedRatings = ratings.filter((r) => linkedCourseIds.includes(r.course_id));

    const student_count = linked.reduce((acc, row) => acc + (100 + (hashCode(row.id) % 4901)), 0);

    return {
      university,
      course_count: linked.length,
      student_count,
      average_rating: linkedRatings.length
        ? Number((linkedRatings.reduce((acc, item) => acc + item.rating, 0) / linkedRatings.length).toFixed(1))
        : 0,
    };
  });
}

