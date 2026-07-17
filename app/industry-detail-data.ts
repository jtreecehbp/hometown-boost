export type IndustrySceneType =
  | "equipment"
  | "contractor"
  | "homeServices"
  | "hvac"
  | "plumbing"
  | "septic"
  | "lawnCare"
  | "repairShop"
  | "automotive"
  | "retail"
  | "professionalServices";

type DetailItem = {
  title: string;
  description: string;
};

type LinkedDetailItem = DetailItem & {
  href: string;
};

type RelatedLink = {
  label: string;
  href: string;
  description: string;
};

type IndustryFaq = {
  question: string;
  answer: string;
};

export type IndustryDetail = {
  slug: string;
  path: `/industries/${string}`;
  name: string;
  shortName: string;
  metaTitle: string;
  metaDescription: string;
  eyebrow: string;
  h1: string;
  heroDescription: string;
  scene: {
    type: IndustrySceneType;
    imagePosition: string;
    accent: string;
    accentSoft: string;
    tilt: string;
    searchLabel: string;
    signalLabel: string;
    objectLabel: string;
  };
  challengeIntro: string;
  challenges: DetailItem[];
  searchIntro: string;
  searches: string[];
  searchMoment: string;
  services: LinkedDetailItem[];
  helpIntro: string;
  helpSteps: DetailItem[];
  measurements: DetailItem[];
  measurementNote: string;
  faqs: IndustryFaq[];
  related: RelatedLink[];
  ctaTitle: string;
  ctaBody: string;
  ctaLabel: string;
};

export const industryDetails = {
  "equipment-dealers": {
    slug: "equipment-dealers",
    path: "/industries/equipment-dealers",
    name: "Equipment Dealers",
    shortName: "Equipment dealers",
    metaTitle: "Marketing for Equipment Dealers",
    metaDescription:
      "Local marketing for equipment dealers that connects inventory discovery, dealer visibility, service demand, calls, directions, and qualified inquiries.",
    eyebrow: "Equipment dealer marketing",
    h1: "Turn equipment research into dealership conversations.",
    heroDescription:
      "Help buyers find the right brands, categories, location, parts, and service information before they visit the lot or contact your team.",
    scene: {
      type: "equipment",
      imagePosition: "69% center",
      accent: "#f45b20",
      accentSoft: "#ffd2b7",
      tilt: "-4deg",
      searchLabel: "equipment dealer near me",
      signalLabel: "Inventory interest • calls • directions",
      objectLabel: "Dealer lot",
    },
    challengeIntro:
      "Equipment buyers often research for weeks, compare across a wide radius, and move between manufacturer pages, marketplace listings, Maps, and dealer websites before making contact.",
    challenges: [
      {
        title: "Complex inventory journeys",
        description:
          "Shoppers may begin with a job, category, model, attachment, or brand. A generic inventory link rarely answers every path clearly.",
      },
      {
        title: "A wide, competitive market",
        description:
          "Dealer territories can span several towns or counties, while nearby and national sellers compete for the same high-intent searches.",
      },
      {
        title: "More than the initial sale",
        description:
          "Parts, service, financing information, trade-ins, rentals, and repeat relationships all shape the value of a dealership lead.",
      },
    ],
    searchIntro:
      "Buyers use a mix of product, brand, location, and ownership questions. The site and local presence should make each route easier to follow.",
    searches: [
      "Brand or equipment category plus a town, county, or ‘near me’",
      "Specific model, attachment, capability, or use case",
      "Dealer hours, directions, phone number, and current availability",
      "Parts, repair, maintenance, financing, rental, or trade-in information",
    ],
    searchMoment:
      "A strong path helps a buyer move from ‘what machine fits?’ to ‘which nearby dealer should I contact?’ without hunting through disconnected pages.",
    services: [
      {
        title: "Inventory-friendly website design",
        href: "/services#website-design",
        description:
          "Build clear brand, category, model, service, and location paths around the way equipment buyers research.",
      },
      {
        title: "Dealer-focused local SEO",
        href: "/services#local-seo",
        description:
          "Strengthen location and category relevance for the products and support your dealership wants to grow.",
      },
      {
        title: "Google Business Profile care",
        href: "/services#google-business-profile",
        description:
          "Keep hours, categories, photos, services, and dealership details accurate when buyers compare local options.",
      },
      {
        title: "Call and lead tracking",
        href: "/services#lead-tracking",
        description:
          "Separate useful product, parts, and service inquiries where the available tools and team process allow it.",
      },
    ],
    helpIntro:
      "Hometown Boost connects the dealer website, local visibility, trust signals, and inquiry paths so product interest has somewhere useful to go.",
    helpSteps: [
      {
        title: "Map the buying paths",
        description:
          "Organize brands, categories, applications, locations, and support needs around real buyer questions.",
      },
      {
        title: "Strengthen local relevance",
        description:
          "Clarify where the dealership operates and which product and service areas deserve focused visibility.",
      },
      {
        title: "Make trust easier to verify",
        description:
          "Present dealership capabilities, current information, photos, and approved customer proof consistently.",
      },
      {
        title: "Connect interest to follow-up",
        description:
          "Create clear calls, forms, directions, and handoff points that fit the way the sales and service teams work.",
      },
    ],
    measurements: [
      {
        title: "Product and category inquiries",
        description:
          "Track the pages and inquiry paths associated with brands, categories, models, or applications when source data is available.",
      },
      {
        title: "Calls and qualified conversations",
        description:
          "Review call sources and, when the dealership can classify outcomes, distinguish useful sales, parts, and service conversations.",
      },
      {
        title: "Directions and location actions",
        description:
          "Use available Maps and profile actions as intent signals without claiming they equal confirmed showroom visits.",
      },
      {
        title: "Local search visibility",
        description:
          "Monitor relevant product, dealer, parts, and service searches across agreed markets alongside customer actions.",
      },
    ],
    measurementNote:
      "Dealer reporting starts with a documented baseline and agreed definitions. Inventory feeds, manufacturer sites, privacy settings, call handling, and offline sales can limit attribution, so reports should state what each source can support.",
    faqs: [
      {
        question: "Can Hometown Boost work with an existing inventory provider?",
        answer:
          "Often, yes. The first step is to review how the current inventory tool publishes pages, handles links, supports search engines, and passes inquiries. Recommendations depend on the provider and dealership workflow.",
      },
      {
        question: "What if the dealership represents several manufacturers?",
        answer:
          "The website and search plan can create clear paths for each priority brand while keeping the dealership identity, locations, service, and ownership experience connected.",
      },
      {
        question: "Can marketing cover both equipment sales and service?",
        answer:
          "Yes. Sales, parts, repair, maintenance, rental, and other departments can have distinct customer paths and measurements instead of being blended into one generic lead total.",
      },
      {
        question: "Do you guarantee equipment leads or sales?",
        answer:
          "No. Hometown Boost can commit to the agreed work, clear measurement, and ongoing improvement, but demand, inventory, pricing, territory, seasonality, and the sales process affect outcomes.",
      },
    ],
    related: [
      {
        label: "Automotive marketing",
        href: "/industries/automotive",
        description: "See a related local journey built around vehicles, service, and high-trust decisions.",
      },
      {
        label: "Repair shop marketing",
        href: "/industries/repair-shops",
        description: "Explore visibility and lead paths for equipment and specialty repair businesses.",
      },
      {
        label: "Website design",
        href: "/services#website-design",
        description: "Build clearer product, service, location, and inquiry routes.",
      },
      {
        label: "Local SEO",
        href: "/services#local-seo",
        description: "Improve relevance for priority categories and dealer markets.",
      },
    ],
    ctaTitle: "Build a clearer path from equipment search to dealer conversation.",
    ctaBody:
      "Bring us your brands, market, inventory setup, departments, and growth priorities. We’ll map the most useful place to begin.",
    ctaLabel: "Get My Dealer Game Plan",
  },

  contractors: {
    slug: "contractors",
    path: "/industries/contractors",
    name: "Contractors",
    shortName: "Contractors",
    metaTitle: "Local Marketing for Contractors",
    metaDescription:
      "Practical contractor marketing for stronger local search visibility, project trust, quote requests, calls, and measurable customer demand.",
    eyebrow: "Contractor marketing",
    h1: "Help the right local projects find your crew.",
    heroDescription:
      "Connect specific services, project proof, service-area visibility, and clear quote paths so prospects can understand your fit before they call.",
    scene: {
      type: "contractor",
      imagePosition: "75% 58%",
      accent: "#e94d16",
      accentSoft: "#ffcaa7",
      tilt: "5deg",
      searchLabel: "contractor for my project",
      signalLabel: "Project fit • calls • quote requests",
      objectLabel: "Jobsite ready",
    },
    challengeIntro:
      "Contractor demand can be seasonal, project types vary widely, and prospects often compare several businesses before inviting anyone to bid or visit the property.",
    challenges: [
      {
        title: "Broad labels hide the real work",
        description:
          "A contractor may handle very different projects, materials, property types, and service areas that a single generic page cannot explain well.",
      },
      {
        title: "Trust is built before the estimate",
        description:
          "Prospects look for project relevance, recent reviews, clear communication, credentials, and signs the business serves their area.",
      },
      {
        title: "Not every inquiry is a fit",
        description:
          "Job size, location, timing, scope, and customer expectations all affect whether a lead belongs in the schedule.",
      },
    ],
    searchIntro:
      "Prospects usually describe the project or problem first, then narrow by location, experience, availability, and proof.",
    searches: [
      "Specific project or service plus a town, county, or ‘near me’",
      "Materials, property type, project examples, and cost considerations",
      "Reviews, licensing or credentials, insurance information, and years of experience",
      "Availability, service area, estimate process, and how to request a quote",
    ],
    searchMoment:
      "The website should help a prospect decide whether the contractor handles this kind of work, serves this location, and offers a sensible next step.",
    services: [
      {
        title: "Conversion-focused website design",
        href: "/services#website-design",
        description:
          "Create service, project, location, and quote-request paths that make contractor fit easier to understand.",
      },
      {
        title: "Service-area local SEO",
        href: "/services#local-seo",
        description:
          "Build useful relevance around priority work and the markets where the crew can serve customers well.",
      },
      {
        title: "Reputation management",
        href: "/services#reputation-management",
        description:
          "Support an honest review-request routine and place approved project proof where prospects need confidence.",
      },
      {
        title: "Lead tracking",
        href: "/services#lead-tracking",
        description:
          "Connect calls and quote requests to their sources and define what makes an inquiry useful to the business.",
      },
    ],
    helpIntro:
      "Hometown Boost turns the contractor’s real capabilities into a local customer path that is easier to find, trust, and measure.",
    helpSteps: [
      {
        title: "Define the right work",
        description:
          "Clarify project types, job size, service area, capacity, seasonality, and the inquiries the team wants more of.",
      },
      {
        title: "Build service-specific paths",
        description:
          "Match pages and local signals to the language prospects use for priority projects and problems.",
      },
      {
        title: "Show relevant proof",
        description:
          "Organize approved photos, process details, credentials, reviews, and expectations around the decision at hand.",
      },
      {
        title: "Improve the quote journey",
        description:
          "Make the next step clear and review which sources create calls and requests that fit the schedule.",
      },
    ],
    measurements: [
      {
        title: "Qualified quote requests",
        description:
          "Use agreed criteria such as service, location, project size, timing, and scope when the sales process captures them.",
      },
      {
        title: "Calls by source",
        description:
          "Review which website, profile, search, or campaign paths prompted calls without assuming every call became a project.",
      },
      {
        title: "Priority service visibility",
        description:
          "Track agreed project and location searches alongside traffic and inquiries, not as a standalone ranking promise.",
      },
      {
        title: "Review health",
        description:
          "Monitor review recency, request consistency, response habits, and customer themes without promising a perfect rating.",
      },
    ],
    measurementNote:
      "Contractor reporting should account for seasonality, backlog, weather, crew capacity, sales follow-up, and offline referrals. Those factors are documented so marketing activity is not credited for work the data cannot prove.",
    faqs: [
      {
        question: "Can the plan focus on only the projects we want more of?",
        answer:
          "Yes. Priority services, job size, property type, geography, season, and capacity should shape the site and visibility work instead of promoting every possible project equally.",
      },
      {
        question: "Do contractors need a separate page for every town?",
        answer:
          "Not automatically. Location content should exist when it gives customers genuinely useful local information. Thin, repetitive town pages can create clutter without improving the customer journey.",
      },
      {
        question: "How do project photos and reviews fit the plan?",
        answer:
          "Approved photos and honest reviews can support service pages, project explanations, profiles, and conversion paths when they are organized around the questions prospects actually ask.",
      },
      {
        question: "Can you guarantee a certain number of estimates?",
        answer:
          "No. Hometown Boost does not guarantee leads or projects. The work focuses on stronger discovery, clearer fit, better inquiry paths, reliable measurement, and ongoing improvement.",
      },
    ],
    related: [
      {
        label: "Home-service marketing",
        href: "/industries/home-services",
        description: "Explore the high-intent journey shared by many residential service businesses.",
      },
      {
        label: "Lawn-care marketing",
        href: "/industries/lawn-care",
        description: "See a seasonal, route-aware approach for recurring and project work.",
      },
      {
        label: "Reputation management",
        href: "/services#reputation-management",
        description: "Build a steady, customer-friendly review process.",
      },
      {
        label: "Call and lead tracking",
        href: "/services#lead-tracking",
        description: "Connect quote requests and calls to useful source signals.",
      },
    ],
    ctaTitle: "Make your best-fit projects easier to find and request.",
    ctaBody:
      "Tell us which work, markets, seasons, and project sizes matter most. We’ll turn that context into a practical contractor growth plan.",
    ctaLabel: "Get My Contractor Game Plan",
  },

  "home-services": {
    slug: "home-services",
    path: "/industries/home-services",
    name: "Home Services",
    shortName: "Home services",
    metaTitle: "Marketing for Home-Service Businesses",
    metaDescription:
      "Local marketing for home-service businesses built around urgent searches, mobile calls, service-area visibility, trust, and useful lead measurement.",
    eyebrow: "Home-service marketing",
    h1: "Be the clear local choice when homeowners need help.",
    heroDescription:
      "Help nearby homeowners understand the service, trust the business, and call or request help quickly—especially from a phone and under pressure.",
    scene: {
      type: "homeServices",
      imagePosition: "82% 52%",
      accent: "#f45b20",
      accentSoft: "#ffd6bc",
      tilt: "-3deg",
      searchLabel: "home service near me",
      signalLabel: "Mobile calls • service requests • coverage",
      objectLabel: "Local service route",
    },
    challengeIntro:
      "Home-service decisions often happen quickly. Homeowners search from a phone, compare a short list, and look for clear signs that a provider serves their area and can handle the problem.",
    challenges: [
      {
        title: "Short decision windows",
        description:
          "Urgent problems leave little patience for slow pages, vague services, hidden phone numbers, or unclear availability.",
      },
      {
        title: "Overlapping service areas",
        description:
          "Businesses must explain where they work without creating repetitive location content or attracting calls outside practical coverage.",
      },
      {
        title: "Trust at the front door",
        description:
          "Reviews, team identity, expectations, credentials, and straightforward communication matter before a homeowner invites anyone onsite.",
      },
    ],
    searchIntro:
      "Homeowners usually search by problem, service, and location, then look for confidence and a fast next step.",
    searches: [
      "Immediate problem or service plus ‘near me’ or a town name",
      "Availability, response area, hours, and how quickly to request help",
      "Recent reviews, credentials, photos, guarantees, and what to expect",
      "Maintenance, replacement, repair, pricing context, and prevention questions",
    ],
    searchMoment:
      "The strongest path answers ‘Can you solve this, do you serve my home, can I trust you, and how do I reach you?’ in that order.",
    services: [
      {
        title: "Mobile-first website design",
        href: "/services#website-design",
        description:
          "Make urgent services, coverage, trust details, calls, and request forms easy to use on a phone.",
      },
      {
        title: "Local SEO",
        href: "/services#local-seo",
        description:
          "Strengthen relevant service and area signals around the work the business is equipped to handle.",
      },
      {
        title: "Google Business Profile management",
        href: "/services#google-business-profile",
        description:
          "Keep categories, hours, service areas, photos, and customer-facing details accurate and active.",
      },
      {
        title: "Reputation and lead insight",
        href: "/services#reputation-management",
        description:
          "Support honest feedback, visible responses, and practical measurement around calls and service requests.",
      },
    ],
    helpIntro:
      "Hometown Boost connects the high-intent local search journey so homeowners can move from a problem to a confident request with less friction.",
    helpSteps: [
      {
        title: "Prioritize customer problems",
        description:
          "Organize urgent, planned, repair, maintenance, and replacement needs around the team’s real capacity.",
      },
      {
        title: "Clarify service coverage",
        description:
          "Make the practical service area visible across the website and local presence without overpromising response.",
      },
      {
        title: "Build pre-call confidence",
        description:
          "Explain the process, place approved proof thoughtfully, and make business details consistent wherever customers compare.",
      },
      {
        title: "Measure useful demand",
        description:
          "Review call, form, profile, and visibility signals in the context of service fit, season, and team follow-up.",
      },
    ],
    measurements: [
      {
        title: "Calls and service requests",
        description:
          "Track available source, timing, service, and location signals without assuming every contact was qualified or completed.",
      },
      {
        title: "Mobile conversion paths",
        description:
          "Review whether high-intent visitors can reach calls, forms, directions, or service information without unnecessary friction.",
      },
      {
        title: "Service-area visibility",
        description:
          "Monitor agreed local searches and profile actions alongside actual inquiry patterns.",
      },
      {
        title: "Review momentum",
        description:
          "Track recency, request consistency, response habits, and themes from genuine customer feedback.",
      },
    ],
    measurementNote:
      "Weather, emergencies, seasonality, staffing, dispatch, missed calls, and service capacity can influence home-service results. Reports should identify these limits and keep marketing claims tied to supported sources.",
    faqs: [
      {
        question: "Can the plan prioritize emergency and scheduled services differently?",
        answer:
          "Yes. Urgent calls, maintenance, repair, replacement, and project work often need different pages, calls to action, expectations, and measurements.",
      },
      {
        question: "How should a home-service business describe its service area?",
        answer:
          "Use the real operating area, travel limits, dispatch capacity, and priority markets. The goal is clarity for customers, not an exaggerated list of towns.",
      },
      {
        question: "Can missed calls be part of the measurement plan?",
        answer:
          "When the phone setup and consent requirements allow it, missed-call patterns can reveal follow-up gaps. They should be reviewed carefully rather than counted as completed leads.",
      },
      {
        question: "Do you guarantee first-page rankings or booked jobs?",
        answer:
          "No. Hometown Boost reports supported visibility and customer-action signals, explains their limits, and improves the agreed system without guaranteeing rankings or jobs.",
      },
    ],
    related: [
      {
        label: "HVAC marketing",
        href: "/industries/hvac",
        description: "Explore a season-aware plan for repair, maintenance, and replacement demand.",
      },
      {
        label: "Plumbing marketing",
        href: "/industries/plumbing",
        description: "See how urgent and planned plumbing searches can become clearer customer paths.",
      },
      {
        label: "Google Business Profile management",
        href: "/services#google-business-profile",
        description: "Keep local customer details accurate where decisions happen quickly.",
      },
      {
        label: "Website design",
        href: "/services#website-design",
        description: "Create a faster mobile path from problem to conversation.",
      },
    ],
    ctaTitle: "Make the next local service request easier to win.",
    ctaBody:
      "Tell us what you service, where the team works, which calls matter, and where the customer journey breaks down. We’ll map a practical next move.",
    ctaLabel: "Get My Home-Service Game Plan",
  },

  hvac: {
    slug: "hvac",
    path: "/industries/hvac",
    name: "HVAC Companies",
    shortName: "HVAC",
    metaTitle: "Local Marketing for HVAC Companies",
    metaDescription:
      "HVAC marketing for local repair, maintenance, and replacement demand with stronger search visibility, calls, trust, and proof-safe reporting.",
    eyebrow: "HVAC marketing",
    h1: "Stay visible through every season of HVAC demand.",
    heroDescription:
      "Connect urgent repair, planned maintenance, system replacement, indoor-air, and service-area searches to clear customer actions and useful reporting.",
    scene: {
      type: "hvac",
      imagePosition: "77% 45%",
      accent: "#24998f",
      accentSoft: "#bde6df",
      tilt: "4deg",
      searchLabel: "AC repair near me",
      signalLabel: "Repair calls • maintenance • estimates",
      objectLabel: "Comfort system",
    },
    challengeIntro:
      "HVAC demand shifts with weather, equipment age, maintenance cycles, and customer urgency. The marketing system must support both immediate calls and considered replacement decisions.",
    challenges: [
      {
        title: "Weather-driven demand",
        description:
          "Search volume and call urgency can change quickly, making capacity, hours, and customer expectations important parts of the plan.",
      },
      {
        title: "Different service economics",
        description:
          "A tune-up, diagnostic call, duct concern, indoor-air question, and full replacement are not the same customer journey or lead.",
      },
      {
        title: "Expensive local competition",
        description:
          "HVAC search and advertising markets can be crowded, so targeting, landing paths, follow-up, and lead quality must work together.",
      },
    ],
    searchIntro:
      "Customers search by symptom, equipment type, service, season, brand, and location—often while comfort is already disrupted.",
    searches: [
      "AC, furnace, heat pump, or system problem plus a local modifier",
      "Emergency availability, hours, service area, and response expectations",
      "Maintenance plans, tune-ups, indoor-air quality, and efficiency questions",
      "Replacement estimates, equipment options, financing information, and reviews",
    ],
    searchMoment:
      "Repair customers need a fast path; replacement customers need enough clarity to understand options and feel confident starting an estimate conversation.",
    services: [
      {
        title: "HVAC service-path website",
        href: "/services#website-design",
        description:
          "Separate repair, maintenance, replacement, and specialty needs while keeping calls and estimates easy to reach.",
      },
      {
        title: "Season-aware local SEO",
        href: "/services#local-seo",
        description:
          "Build durable service relevance and update priorities as customer demand changes through the year.",
      },
      {
        title: "Profile and review management",
        href: "/services#google-business-profile",
        description:
          "Keep high-intent local details current and support a steady, honest feedback process.",
      },
      {
        title: "Call tracking and advertising",
        href: "/services#lead-tracking",
        description:
          "Connect campaign and organic sources to call signals, with paid media considered only when the system is ready.",
      },
    ],
    helpIntro:
      "Hometown Boost organizes HVAC demand by customer need, season, market, and next action so the team can improve visibility without losing sight of capacity.",
    helpSteps: [
      {
        title: "Separate urgent and planned demand",
        description:
          "Give repair, maintenance, and replacement customers the information and action each decision requires.",
      },
      {
        title: "Strengthen local coverage signals",
        description:
          "Clarify the service area and priority system types without claiming availability the dispatch team cannot support.",
      },
      {
        title: "Build confidence before the call",
        description:
          "Use clear process details, approved credentials, genuine reviews, and helpful expectations to reduce uncertainty.",
      },
      {
        title: "Review demand in context",
        description:
          "Compare calls, estimates, visibility, and campaign activity with weather, season, capacity, and lead outcomes where available.",
      },
    ],
    measurements: [
      {
        title: "Repair and maintenance calls",
        description:
          "Track source and timing, then separate service types or useful outcomes when the phone process supports classification.",
      },
      {
        title: "Replacement estimate requests",
        description:
          "Review website and campaign paths associated with estimate interest without claiming an inquiry became a sold system.",
      },
      {
        title: "Seasonal search visibility",
        description:
          "Monitor agreed repair, maintenance, replacement, and local searches across meaningful time periods.",
      },
      {
        title: "Profile and review actions",
        description:
          "Use calls, website actions, review recency, and response habits as supported local-trust signals.",
      },
    ],
    measurementNote:
      "HVAC reporting should note weather, season, equipment availability, dispatch capacity, call handling, and sales follow-up. These variables can affect outcomes beyond the marketing source.",
    faqs: [
      {
        question: "Can HVAC repair and replacement be marketed separately?",
        answer:
          "Yes. They involve different urgency, information, economics, customer expectations, and follow-up. Separate paths often make both the experience and reporting clearer.",
      },
      {
        question: "How does seasonality affect the plan?",
        answer:
          "Durable website and local-search work continues year-round, while content, profile updates, campaign timing, and capacity messages can adjust around realistic seasonal priorities.",
      },
      {
        question: "Should an HVAC company run paid search?",
        answer:
          "It can be useful when targeting, landing pages, phone handling, budget, and lead measurement are ready. It is not automatically the right first step for every market.",
      },
      {
        question: "Are rankings, calls, or installations guaranteed?",
        answer:
          "No. Hometown Boost can improve the agreed system and report supported signals, but cannot guarantee search position, lead volume, booked work, or revenue.",
      },
    ],
    related: [
      {
        label: "Home-service marketing",
        href: "/industries/home-services",
        description: "See the broader customer journey shared across urgent residential services.",
      },
      {
        label: "Plumbing marketing",
        href: "/industries/plumbing",
        description: "Compare a related high-intent service market with emergency and planned demand.",
      },
      {
        label: "Paid advertising",
        href: "/services#paid-advertising",
        description: "Connect targeting, landing paths, calls, and lead-quality review.",
      },
      {
        label: "Call and lead tracking",
        href: "/services#lead-tracking",
        description: "Build clearer source and service signals around HVAC inquiries.",
      },
    ],
    ctaTitle: "Build an HVAC growth plan that respects demand and capacity.",
    ctaBody:
      "Share your service mix, territory, seasonal priorities, call process, and growth goals. We’ll identify the clearest place to improve.",
    ctaLabel: "Get My HVAC Game Plan",
  },

  plumbing: {
    slug: "plumbing",
    path: "/industries/plumbing",
    name: "Plumbing Companies",
    shortName: "Plumbing",
    metaTitle: "Local Marketing for Plumbing Companies",
    metaDescription:
      "Plumbing marketing built around emergency searches, planned projects, service-area visibility, calls, reviews, and useful lead measurement.",
    eyebrow: "Plumbing marketing",
    h1: "Turn urgent plumbing searches into clear next steps.",
    heroDescription:
      "Help homeowners and property managers find the right repair, installation, inspection, or maintenance path and reach your team without delay.",
    scene: {
      type: "plumbing",
      imagePosition: "80% 60%",
      accent: "#2b9db3",
      accentSoft: "#bee8ed",
      tilt: "-5deg",
      searchLabel: "plumber near me",
      signalLabel: "Emergency calls • estimates • service areas",
      objectLabel: "Clear flow",
    },
    challengeIntro:
      "Plumbing demand ranges from an immediate leak to a planned repipe or fixture project. The customer’s urgency, property, location, and service fit shape the right response.",
    challenges: [
      {
        title: "Urgency creates friction",
        description:
          "Customers under pressure need visible phone and request options, useful service details, and honest expectations about coverage and response.",
      },
      {
        title: "Many services, different intent",
        description:
          "Drain problems, water heaters, sewer work, leaks, fixtures, repiping, and commercial needs should not all compete on one vague page.",
      },
      {
        title: "Local trust matters quickly",
        description:
          "Recent reviews, accurate business details, clear service information, and a professional mobile experience influence a short comparison.",
      },
    ],
    searchIntro:
      "Customers search by symptom or service first, then verify location, availability, trust, and the simplest way to ask for help.",
    searches: [
      "Leak, clog, water heater, sewer, fixture, or other problem plus location",
      "Emergency, after-hours, same-day, or scheduling information",
      "Repair versus replacement questions, pricing context, and process expectations",
      "Reviews, service area, credentials, property type, and how to contact the team",
    ],
    searchMoment:
      "The customer path should quickly separate immediate help from estimate-based work while keeping business details consistent across search, Maps, and the website.",
    services: [
      {
        title: "Problem-led website design",
        href: "/services#website-design",
        description:
          "Organize priority plumbing services around customer symptoms, property needs, and clear calls or estimate requests.",
      },
      {
        title: "Plumbing local SEO",
        href: "/services#local-seo",
        description:
          "Improve relevance for the services and local markets the company is equipped to support.",
      },
      {
        title: "Google profile and reviews",
        href: "/services#google-business-profile",
        description:
          "Keep hours, coverage, categories, photos, and feedback activity useful for fast local decisions.",
      },
      {
        title: "Call and lead tracking",
        href: "/services#lead-tracking",
        description:
          "Review source, service, timing, and lead outcomes where the phone and dispatch process can capture them.",
      },
    ],
    helpIntro:
      "Hometown Boost clarifies plumbing services, local relevance, and customer actions so urgent and planned demand can be understood separately.",
    helpSteps: [
      {
        title: "Prioritize the service mix",
        description:
          "Identify the repairs, installations, property types, territories, and call types the company wants to grow.",
      },
      {
        title: "Build fast customer paths",
        description:
          "Make urgent calls, scheduled requests, and estimate-based work easy to distinguish on mobile devices.",
      },
      {
        title: "Keep local information dependable",
        description:
          "Align website and profile details so customers see consistent hours, services, coverage, and contact options.",
      },
      {
        title: "Improve from real inquiry signals",
        description:
          "Compare visibility and source data with the service and location information the team can reliably collect.",
      },
    ],
    measurements: [
      {
        title: "Emergency and scheduled calls",
        description:
          "Review source and timing, then classify service fit only when call or dispatch records support the distinction.",
      },
      {
        title: "Estimate requests",
        description:
          "Track forms and calls associated with planned projects without counting every request as booked revenue.",
      },
      {
        title: "Priority-service visibility",
        description:
          "Monitor agreed plumbing searches and locations over meaningful periods alongside actual customer actions.",
      },
      {
        title: "Profile and reputation health",
        description:
          "Review calls, website actions, review recency, response habits, and information accuracy.",
      },
    ],
    measurementNote:
      "Plumbing outcomes are influenced by urgency, dispatch, missed calls, service capacity, geography, season, property type, and follow-up. Reports should distinguish those operational factors from supported marketing signals.",
    faqs: [
      {
        question: "Can emergency and project plumbing use different calls to action?",
        answer:
          "Yes. Immediate problems generally need a prominent call path, while repipes, installations, and other planned work may benefit from a more detailed estimate request.",
      },
      {
        question: "Should every plumbing service have its own page?",
        answer:
          "Priority services should have enough useful information to answer customer questions. The final structure depends on the service mix, market, competition, and whether separate pages improve clarity.",
      },
      {
        question: "Can you track which plumbing services generate calls?",
        answer:
          "Source and page signals can often be connected to calls or forms. Accurate service classification may also require the office or dispatch team to record the reason and outcome consistently.",
      },
      {
        question: "Do you guarantee calls or booked plumbing jobs?",
        answer:
          "No. Hometown Boost improves and measures the agreed customer journey but does not guarantee rankings, call volume, jobs, or revenue.",
      },
    ],
    related: [
      {
        label: "Septic-service marketing",
        href: "/industries/septic-services",
        description: "Explore a related local market shaped by urgent service and planned maintenance.",
      },
      {
        label: "Home-service marketing",
        href: "/industries/home-services",
        description: "See the broader high-intent framework for local residential services.",
      },
      {
        label: "Local SEO",
        href: "/services#local-seo",
        description: "Strengthen priority plumbing and service-area relevance.",
      },
      {
        label: "Google Business Profile management",
        href: "/services#google-business-profile",
        description: "Keep high-intent local details accurate and active.",
      },
    ],
    ctaTitle: "Make plumbing demand easier to find, route, and understand.",
    ctaBody:
      "Tell us which services, locations, call types, and projects matter most. We’ll build a practical starting plan around your real operation.",
    ctaLabel: "Get My Plumbing Game Plan",
  },

  "septic-services": {
    slug: "septic-services",
    path: "/industries/septic-services",
    name: "Septic Service Companies",
    shortName: "Septic services",
    metaTitle: "Marketing for Septic Service Companies",
    metaDescription:
      "Local marketing for septic pumping, repair, inspection, installation, and maintenance businesses with clearer calls, visibility, and measurement.",
    eyebrow: "Septic-service marketing",
    h1: "Be easier to find before a septic problem gets worse.",
    heroDescription:
      "Connect pumping, inspection, repair, installation, maintenance, and urgent service searches to clear coverage information and a dependable next step.",
    scene: {
      type: "septic",
      imagePosition: "72% 68%",
      accent: "#4d9b75",
      accentSoft: "#c9e4d3",
      tilt: "3deg",
      searchLabel: "septic service near me",
      signalLabel: "Pumping calls • inspections • coverage",
      objectLabel: "Service below ground",
    },
    challengeIntro:
      "Septic customers may be facing an urgent failure, planning routine maintenance, buying a property, or researching a major repair. Education and service fit matter alongside visibility.",
    challenges: [
      {
        title: "Customers may not know the service they need",
        description:
          "Symptoms can point to pumping, inspection, repair, drain-field, installation, or another issue that requires professional evaluation.",
      },
      {
        title: "Coverage can be highly specific",
        description:
          "Travel time, terrain, disposal access, regulations, equipment, and county boundaries can shape where and how the business works.",
      },
      {
        title: "Urgent and planned work overlap",
        description:
          "Emergency calls, maintenance reminders, real-estate inspections, and system projects need different information and follow-up.",
      },
    ],
    searchIntro:
      "Customers often begin with a symptom, service, property event, or maintenance question and then look for a local provider with clear coverage.",
    searches: [
      "Septic pumping, backup, odor, alarm, repair, or inspection plus location",
      "How often to pump, warning signs, maintenance, and what to expect",
      "Real-estate inspections, permits, installation, replacement, or drain-field questions",
      "Service area, emergency availability, reviews, equipment access, and contact details",
    ],
    searchMoment:
      "A useful journey helps the customer understand the likely category, see whether the business serves the property, and contact the team without promising a diagnosis online.",
    services: [
      {
        title: "Educational service website",
        href: "/services#website-design",
        description:
          "Explain pumping, inspection, repair, installation, maintenance, and urgent paths in plain language.",
      },
      {
        title: "Septic local SEO",
        href: "/services#local-seo",
        description:
          "Build service and location relevance around the actual coverage area and priority customer needs.",
      },
      {
        title: "Google profile management",
        href: "/services#google-business-profile",
        description:
          "Keep categories, hours, service details, photos, and coverage information consistent where local comparisons happen.",
      },
      {
        title: "Call and lead insight",
        href: "/services#lead-tracking",
        description:
          "Review sources and service categories when the office process can reliably record them.",
      },
    ],
    helpIntro:
      "Hometown Boost turns septic expertise into clear local information while keeping diagnosis, regulations, and job outcomes appropriately proof-safe.",
    helpSteps: [
      {
        title: "Clarify service categories",
        description:
          "Organize maintenance, urgent symptoms, inspections, repairs, and system projects around real customer questions.",
      },
      {
        title: "Define practical coverage",
        description:
          "Align local signals with counties, towns, travel limits, regulations, and the team’s operating capacity.",
      },
      {
        title: "Teach without diagnosing",
        description:
          "Publish useful warning signs, preparation details, and next steps without claiming an unseen system problem is solved.",
      },
      {
        title: "Measure inquiry categories",
        description:
          "Connect calls and forms to supported sources, then use office outcomes where available to understand service fit.",
      },
    ],
    measurements: [
      {
        title: "Pumping and service calls",
        description:
          "Review available source, timing, location, and stated service need without equating every call with completed work.",
      },
      {
        title: "Inspection and project inquiries",
        description:
          "Track real-estate, repair, replacement, and installation interest where forms or call records support the category.",
      },
      {
        title: "Coverage-area visibility",
        description:
          "Monitor agreed septic services and local markets alongside calls and profile actions.",
      },
      {
        title: "Customer education paths",
        description:
          "Review whether useful maintenance and symptom content leads visitors toward appropriate service information or contact.",
      },
    ],
    measurementNote:
      "Septic results can depend on weather, soil, access, regulation, disposal capacity, emergency availability, office classification, and the condition of systems that marketing cannot predict. Those limits belong in the report.",
    faqs: [
      {
        question: "Can the website explain septic symptoms without diagnosing them?",
        answer:
          "Yes. It can describe common warning signs, preparation, safety considerations, and appropriate next steps while making clear that a qualified onsite evaluation may be needed.",
      },
      {
        question: "How should a septic company describe its service area?",
        answer:
          "Use the real coverage area and account for travel, equipment, disposal, permitting, county rules, and team capacity instead of publishing an unrealistic list of locations.",
      },
      {
        question: "Can maintenance and emergency services share one plan?",
        answer:
          "Yes, but they should have distinct customer paths and expectations. Maintenance can support repeat relationships while urgent service needs a faster route to accurate availability information.",
      },
      {
        question: "Do you guarantee septic calls or projects?",
        answer:
          "No. Hometown Boost improves visibility, clarity, inquiry paths, and reporting but does not guarantee rankings, call volume, completed work, or revenue.",
      },
    ],
    related: [
      {
        label: "Plumbing marketing",
        href: "/industries/plumbing",
        description: "Explore another urgent local-service journey built around calls and clear service fit.",
      },
      {
        label: "Home-service marketing",
        href: "/industries/home-services",
        description: "See the broader framework for service-area visibility and mobile conversion.",
      },
      {
        label: "Website design",
        href: "/services#website-design",
        description: "Turn technical service knowledge into clear customer paths.",
      },
      {
        label: "Local SEO",
        href: "/services#local-seo",
        description: "Strengthen priority septic service and coverage signals.",
      },
    ],
    ctaTitle: "Build a septic marketing plan around real services and coverage.",
    ctaBody:
      "Share your service mix, counties, maintenance priorities, equipment, and call process. We’ll map the clearest customer and measurement gaps.",
    ctaLabel: "Get My Septic-Service Game Plan",
  },

  "lawn-care": {
    slug: "lawn-care",
    path: "/industries/lawn-care",
    name: "Lawn Care & Landscaping Companies",
    shortName: "Lawn care",
    metaTitle: "Marketing for Lawn Care & Landscaping",
    metaDescription:
      "Local marketing for lawn care and landscaping businesses built around routes, seasons, project proof, estimates, reviews, and useful lead signals.",
    eyebrow: "Lawn-care marketing",
    h1: "Grow better routes and the right outdoor projects.",
    heroDescription:
      "Connect recurring lawn service, seasonal work, landscape projects, service areas, and visual proof to customer paths that fit the crew and calendar.",
    scene: {
      type: "lawnCare",
      imagePosition: "84% 64%",
      accent: "#66a85c",
      accentSoft: "#d2e9c4",
      tilt: "-4deg",
      searchLabel: "lawn care near me",
      signalLabel: "Route fit • estimates • seasonal demand",
      objectLabel: "Growing routes",
    },
    challengeIntro:
      "Lawn and landscape companies balance recurring routes, one-time cleanups, seasonal peaks, design-build projects, weather, labor, and geographic efficiency.",
    challenges: [
      {
        title: "Route density matters",
        description:
          "More leads are not automatically better when they fall outside efficient neighborhoods, crew schedules, or minimum service requirements.",
      },
      {
        title: "Recurring and project work differ",
        description:
          "Weekly maintenance, treatments, seasonal cleanup, hardscaping, design, and installation require different expectations and lead qualification.",
      },
      {
        title: "The work is highly visual and seasonal",
        description:
          "Current photos, timing, service details, and local conditions shape what prospects want to see before requesting an estimate.",
      },
    ],
    searchIntro:
      "Customers search by service, property need, season, location, and visual style, then compare coverage, proof, reviews, and estimate paths.",
    searches: [
      "Lawn mowing, treatment, cleanup, landscaping, hardscaping, or another service plus location",
      "Recurring service, project examples, seasonal timing, and property type",
      "Before-and-after photos, reviews, coverage, crew expectations, and process",
      "Estimate requests, scheduling, minimums, maintenance plans, and related services",
    ],
    searchMoment:
      "A useful path should help prospects identify the right service and help the business protect route fit, project fit, and seasonal capacity.",
    services: [
      {
        title: "Visual service website",
        href: "/services#website-design",
        description:
          "Pair clear recurring and project paths with approved local photos, service details, and estimate actions.",
      },
      {
        title: "Route-aware local SEO",
        href: "/services#local-seo",
        description:
          "Focus visibility on priority services and the neighborhoods or markets that make operational sense.",
      },
      {
        title: "Review and profile care",
        href: "/services#reputation-management",
        description:
          "Keep seasonal information, photos, service details, and honest customer feedback active and useful.",
      },
      {
        title: "Estimate and lead tracking",
        href: "/services#lead-tracking",
        description:
          "Review source, location, service type, and project fit where the estimate process captures them.",
      },
    ],
    helpIntro:
      "Hometown Boost aligns local discovery with route, service, season, and project priorities so growth supports the operation instead of scattering it.",
    helpSteps: [
      {
        title: "Map profitable service patterns",
        description:
          "Clarify recurring routes, priority neighborhoods, project types, minimums, seasons, and crew capacity.",
      },
      {
        title: "Separate customer journeys",
        description:
          "Give maintenance, treatment, cleanup, design, and installation prospects clear paths and expectations.",
      },
      {
        title: "Make visual proof useful",
        description:
          "Organize approved photos and genuine reviews around the services and project decisions they actually support.",
      },
      {
        title: "Review fit, not just volume",
        description:
          "Connect estimates and calls to sources, then compare service, location, season, and qualification when records allow.",
      },
    ],
    measurements: [
      {
        title: "Route-fit inquiries",
        description:
          "Use service and geography criteria to understand recurring leads where estimate or CRM records support the distinction.",
      },
      {
        title: "Project estimate requests",
        description:
          "Track landscaping and installation interest without assuming every request became a quoted or sold project.",
      },
      {
        title: "Seasonal service visibility",
        description:
          "Monitor agreed lawn, landscape, cleanup, and local searches across realistic seasonal periods.",
      },
      {
        title: "Photo and review engagement",
        description:
          "Review how visitors use project proof and customer feedback alongside calls, forms, and profile actions.",
      },
    ],
    measurementNote:
      "Weather, season, route capacity, labor, minimums, property access, sales follow-up, and customer budgets influence lawn and landscape outcomes. Reports should keep those operational factors visible.",
    faqs: [
      {
        question: "Can marketing focus on specific neighborhoods or route areas?",
        answer:
          "Yes. Priority markets can shape local content, profile work, campaigns, and qualification, provided the coverage claims remain accurate and useful to customers.",
      },
      {
        question: "Should recurring lawn care and landscaping projects have separate paths?",
        answer:
          "Usually. They involve different questions, proof, timing, budgets, forms, and follow-up. Clear paths help customers and improve lead classification.",
      },
      {
        question: "How should project photos be used?",
        answer:
          "Use approved, representative photos with clear service context. They can support service pages, project explanations, profiles, and estimate confidence without implying outcomes for every property.",
      },
      {
        question: "Can you guarantee a full route or project calendar?",
        answer:
          "No. Hometown Boost improves discovery, customer paths, lead insight, and ongoing marketing but does not guarantee lead volume, route density, booked projects, or revenue.",
      },
    ],
    related: [
      {
        label: "Contractor marketing",
        href: "/industries/contractors",
        description: "Explore a project-led local marketing journey with service and estimate fit.",
      },
      {
        label: "Home-service marketing",
        href: "/industries/home-services",
        description: "See the broader framework for local visibility, trust, and calls.",
      },
      {
        label: "Reputation management",
        href: "/services#reputation-management",
        description: "Build honest review momentum around real customer experiences.",
      },
      {
        label: "Call and lead tracking",
        href: "/services#lead-tracking",
        description: "Connect estimate sources with route and project qualification.",
      },
    ],
    ctaTitle: "Grow the routes and projects that fit your operation.",
    ctaBody:
      "Share your services, seasons, route priorities, project types, and crew capacity. We’ll identify the clearest marketing gaps to address first.",
    ctaLabel: "Get My Lawn-Care Game Plan",
  },

  "repair-shops": {
    slug: "repair-shops",
    path: "/industries/repair-shops",
    name: "Repair Shops",
    shortName: "Repair shops",
    metaTitle: "Local Marketing for Repair Shops",
    metaDescription:
      "Local marketing for equipment, small-engine, appliance, and specialty repair shops with clearer service visibility, calls, visits, and trust.",
    eyebrow: "Repair-shop marketing",
    h1: "Make specialized repair expertise easier to find locally.",
    heroDescription:
      "Help customers understand what you repair, which brands or equipment you support, where to bring it, and how to start a useful service conversation.",
    scene: {
      type: "repairShop",
      imagePosition: "73% 55%",
      accent: "#e85b22",
      accentSoft: "#ffd1b5",
      tilt: "5deg",
      searchLabel: "repair shop near me",
      signalLabel: "Service calls • directions • repair fit",
      objectLabel: "Bench-tested",
    },
    challengeIntro:
      "Repair shops often handle a precise mix of equipment, brands, problems, parts, and turnaround expectations that broad directory listings fail to explain.",
    challenges: [
      {
        title: "Service fit is specific",
        description:
          "Customers need to know whether the shop works on their equipment, brand, problem, age, or product category before making the trip.",
      },
      {
        title: "Phone time can disappear into screening",
        description:
          "Unclear online information can create repeated calls about unsupported work, unavailable parts, unrealistic timing, or out-of-area service.",
      },
      {
        title: "Trust depends on expertise and expectations",
        description:
          "Customers compare reviews, process, diagnostic approach, warranty information, location, drop-off details, and communication.",
      },
    ],
    searchIntro:
      "Customers search by item, brand, symptom, service, and location, then verify whether the shop is the right practical fit.",
    searches: [
      "Equipment, appliance, small engine, or specialty item plus repair and location",
      "Brand, model family, symptom, part, maintenance, or diagnostic question",
      "Drop-off process, service area, pickup options, hours, directions, and timing",
      "Reviews, supported work, estimate policy, warranty information, and contact details",
    ],
    searchMoment:
      "The website should help customers self-sort into a useful call, visit, drop-off, or alternative before the shop spends time screening the request.",
    services: [
      {
        title: "Repair-service website design",
        href: "/services#website-design",
        description:
          "Clarify supported categories, brands, common services, process, location, and customer actions.",
      },
      {
        title: "Specialty local SEO",
        href: "/services#local-seo",
        description:
          "Build relevance around the repair work and local markets the shop is equipped to serve.",
      },
      {
        title: "Profile and reputation management",
        href: "/services#google-business-profile",
        description:
          "Keep hours, categories, photos, location details, and genuine customer feedback useful and current.",
      },
      {
        title: "Call and visit insight",
        href: "/services#lead-tracking",
        description:
          "Review call, form, direction, and source signals without assuming they equal completed repair orders.",
      },
    ],
    helpIntro:
      "Hometown Boost makes the shop’s repair boundaries and expertise clearer so customers can reach the right next step with fewer mismatched expectations.",
    helpSteps: [
      {
        title: "Define supported repair work",
        description:
          "Document equipment, brands, common problems, exclusions, geography, and the information needed before intake.",
      },
      {
        title: "Build self-sorting service paths",
        description:
          "Help visitors identify the right repair category, process, location, and contact or drop-off option.",
      },
      {
        title: "Strengthen local confidence",
        description:
          "Keep business details, approved expertise signals, genuine reviews, and expectations consistent across channels.",
      },
      {
        title: "Measure fit where possible",
        description:
          "Use call and intake outcomes when available to understand which searches and pages create useful repair requests.",
      },
    ],
    measurements: [
      {
        title: "Repair-fit calls and forms",
        description:
          "Classify supported versus unsupported requests only when intake records capture the distinction reliably.",
      },
      {
        title: "Directions and location actions",
        description:
          "Use available profile signals as indicators of local intent without claiming exact shop visits.",
      },
      {
        title: "Specialty search visibility",
        description:
          "Monitor agreed equipment, brand, service, and local searches alongside actual inquiry behavior.",
      },
      {
        title: "Reputation health",
        description:
          "Review feedback recency, response habits, service themes, and information accuracy without promising ratings.",
      },
    ],
    measurementNote:
      "Parts availability, diagnostic outcomes, repair economics, staffing, turnaround, intake classification, and customer decisions affect shop results. Marketing reports should not claim control over those variables.",
    faqs: [
      {
        question: "Can the site clearly list repairs the shop does not handle?",
        answer:
          "Yes. Helpful boundaries can reduce mismatched calls and set expectations. The wording should still guide customers toward supported categories and a clear intake process.",
      },
      {
        question: "What if repair work covers several brands or equipment types?",
        answer:
          "The site can organize priority categories and brands around how customers search while keeping shared process, location, and contact information easy to maintain.",
      },
      {
        question: "Can marketing track completed repair orders?",
        answer:
          "Only when the shop’s intake or point-of-sale records can connect customer outcomes to the original source responsibly. Otherwise reporting should stop at supported calls, forms, and direction signals.",
      },
      {
        question: "Do you guarantee repair calls or revenue?",
        answer:
          "No. Hometown Boost improves the agreed local customer journey and measurement, but does not guarantee rankings, calls, completed repairs, or revenue.",
      },
    ],
    related: [
      {
        label: "Equipment dealer marketing",
        href: "/industries/equipment-dealers",
        description: "See how equipment discovery connects with parts, service, and dealer conversations.",
      },
      {
        label: "Automotive marketing",
        href: "/industries/automotive",
        description: "Explore a vehicle-specific local service and trust journey.",
      },
      {
        label: "Google Business Profile management",
        href: "/services#google-business-profile",
        description: "Keep shop hours, location, categories, and photos dependable.",
      },
      {
        label: "Local SEO",
        href: "/services#local-seo",
        description: "Improve relevance for priority repair categories and local markets.",
      },
    ],
    ctaTitle: "Help the right repair customers find the right shop.",
    ctaBody:
      "Tell us what you repair, what you do not, where customers come from, and how intake works. We’ll map the clearest visibility and customer-path improvements.",
    ctaLabel: "Get My Repair-Shop Game Plan",
  },

  automotive: {
    slug: "automotive",
    path: "/industries/automotive",
    name: "Automotive Service Businesses",
    shortName: "Automotive",
    metaTitle: "Local Marketing for Automotive Service",
    metaDescription:
      "Automotive marketing for local repair and service businesses built around high-intent searches, appointments, calls, reviews, and customer trust.",
    eyebrow: "Automotive marketing",
    h1: "Build trust before a driver hands over the keys.",
    heroDescription:
      "Connect specific vehicle services, local visibility, reviews, appointment paths, and clear expectations so drivers can choose your shop with confidence.",
    scene: {
      type: "automotive",
      imagePosition: "79% 57%",
      accent: "#e64f1b",
      accentSoft: "#ffd0b4",
      tilt: "-3deg",
      searchLabel: "auto repair near me",
      signalLabel: "Service calls • appointments • directions",
      objectLabel: "Road ready",
    },
    challengeIntro:
      "Drivers search under pressure, compare trust quickly, and may not know the exact repair they need. The marketing experience must balance useful service detail with honest diagnostic limits.",
    challenges: [
      {
        title: "High-trust decisions",
        description:
          "Drivers look for recent reviews, clear communication, technician or shop credibility, service expectations, and signs of honest work.",
      },
      {
        title: "Symptoms are not diagnoses",
        description:
          "Customers may search by a light, noise, smell, handling issue, or maintenance need that requires inspection before the right repair is known.",
      },
      {
        title: "Capacity and service mix vary",
        description:
          "Appointments, walk-ins, vehicle types, specialty work, parts, bays, and technician availability affect which inquiries the shop can serve.",
      },
    ],
    searchIntro:
      "Drivers search by symptom, service, vehicle, urgency, location, and trust, then look for a clear call, appointment, or directions path.",
    searches: [
      "Auto repair, maintenance, tire, brake, diagnostic, or other service plus location",
      "Vehicle make, symptom, warning light, noise, or common repair question",
      "Appointments, walk-ins, hours, towing information, directions, and availability",
      "Reviews, warranties, certifications, process, estimates, and what to expect",
    ],
    searchMoment:
      "A strong customer path helps the driver see whether the shop handles the likely category and how to begin without promising a diagnosis before inspection.",
    services: [
      {
        title: "Automotive service website",
        href: "/services#website-design",
        description:
          "Organize maintenance, repair, diagnostic, specialty, vehicle, appointment, and shop-information paths clearly.",
      },
      {
        title: "Automotive local SEO",
        href: "/services#local-seo",
        description:
          "Improve relevance for priority services, vehicle needs, and the local market the shop is equipped to serve.",
      },
      {
        title: "Review and profile management",
        href: "/services#reputation-management",
        description:
          "Support genuine feedback and keep hours, categories, photos, services, and shop details current.",
      },
      {
        title: "Call and appointment insight",
        href: "/services#lead-tracking",
        description:
          "Review sources and customer actions, then connect service outcomes only when shop records support the link.",
      },
    ],
    helpIntro:
      "Hometown Boost brings automotive services, local trust, and customer actions into one understandable path that respects diagnostic and attribution limits.",
    helpSteps: [
      {
        title: "Clarify service priorities",
        description:
          "Define maintenance, repair, diagnostic, specialty, vehicle, geography, and capacity priorities before building visibility.",
      },
      {
        title: "Create symptom-to-service paths",
        description:
          "Help drivers learn enough to choose the next step without turning web content into an unsupported diagnosis.",
      },
      {
        title: "Strengthen local trust",
        description:
          "Align shop details, approved credentials, real reviews, process expectations, and customer communication.",
      },
      {
        title: "Connect source to shop outcomes",
        description:
          "Use calls, appointments, and service records where responsibly available to improve the customer journey.",
      },
    ],
    measurements: [
      {
        title: "Calls and appointment requests",
        description:
          "Track source and service context without assuming each contact became an attended or completed appointment.",
      },
      {
        title: "Priority-service visibility",
        description:
          "Monitor agreed repair, maintenance, diagnostic, and local searches alongside customer actions.",
      },
      {
        title: "Directions and profile actions",
        description:
          "Use available local-intent signals without presenting direction requests as exact shop visits.",
      },
      {
        title: "Review and repeat-interest signals",
        description:
          "Review feedback recency, response habits, themes, and returning customer paths where consented records permit.",
      },
    ],
    measurementNote:
      "Vehicle condition, diagnostic findings, parts, technician capacity, appointment attendance, estimate approval, and customer decisions affect automotive outcomes. Reports should state those limits rather than crediting marketing for unsupported revenue.",
    faqs: [
      {
        question: "Can the website target specific automotive services?",
        answer:
          "Yes. Priority repair, maintenance, tire, diagnostic, fleet, or specialty services can have clearer paths based on the shop’s actual capabilities and customer demand.",
      },
      {
        question: "Can content answer symptom searches without diagnosing a vehicle?",
        answer:
          "Yes. It can explain common possibilities, safety considerations, and appropriate next steps while making clear that a proper inspection may be required.",
      },
      {
        question: "Can online appointments connect to marketing reports?",
        answer:
          "Often, request sources can be recorded. Confirmed attendance, repair category, and revenue require a responsible connection to the shop’s scheduling or service records.",
      },
      {
        question: "Do you guarantee appointments or repair revenue?",
        answer:
          "No. Hometown Boost improves visibility, trust, customer paths, and measurement but does not guarantee rankings, appointments, repair orders, or revenue.",
      },
    ],
    related: [
      {
        label: "Repair-shop marketing",
        href: "/industries/repair-shops",
        description: "See a broader specialty-repair approach built around clear service fit.",
      },
      {
        label: "Equipment dealer marketing",
        href: "/industries/equipment-dealers",
        description: "Explore a related product, parts, service, and local dealer journey.",
      },
      {
        label: "Reputation management",
        href: "/services#reputation-management",
        description: "Build an honest feedback process around real shop experiences.",
      },
      {
        label: "Call and lead tracking",
        href: "/services#lead-tracking",
        description: "Connect calls and appointment requests to supported source signals.",
      },
    ],
    ctaTitle: "Make your automotive expertise easier to find and trust.",
    ctaBody:
      "Share your service mix, market, shop capacity, appointment process, and growth goals. We’ll identify the clearest customer-path improvements.",
    ctaLabel: "Get My Automotive Game Plan",
  },

  "retail-businesses": {
    slug: "retail-businesses",
    path: "/industries/retail-businesses",
    name: "Retail Businesses",
    shortName: "Local retail",
    metaTitle: "Local Marketing for Retail Businesses",
    metaDescription:
      "Local retail marketing that connects nearby discovery, accurate store information, product interest, directions, calls, promotions, and measurable customer actions.",
    eyebrow: "Local retail marketing",
    h1: "Turn local discovery into more useful store visits.",
    heroDescription:
      "Make products, store details, local trust, and the next customer action easier to find before a shopper decides where to go.",
    scene: {
      type: "retail",
      imagePosition: "88% 58%",
      accent: "#ef5b24",
      accentSoft: "#ffd2b8",
      tilt: "3deg",
      searchLabel: "local shops near me",
      signalLabel: "Directions • calls • store actions",
      objectLabel: "Open locally",
    },
    challengeIntro:
      "Retail customers move between search results, Maps, social posts, product pages, and the storefront. Small gaps in hours, product context, or directions can interrupt that journey before a visit begins.",
    challenges: [
      {
        title: "Discovery does not equal a visit",
        description:
          "A shopper may notice the business online but still need a clear reason, current information, and an easy route before choosing to visit.",
      },
      {
        title: "Store details change quickly",
        description:
          "Hours, seasonal offers, events, product availability, pickup options, and holiday schedules can become inaccurate across several customer touchpoints.",
      },
      {
        title: "Offline outcomes are harder to connect",
        description:
          "Directions, calls, product-page views, and offer engagement show intent, but they do not automatically prove a completed store visit or purchase.",
      },
    ],
    searchIntro:
      "Local shoppers combine category, product, place, timing, and trust questions. The strongest path answers those questions without pretending every item is always in stock.",
    searches: [
      "Store category, product type, brand, or gift idea plus a town or ‘near me’",
      "Current hours, holiday hours, address, parking, accessibility, and directions",
      "Product availability, pickup, ordering, returns, events, and seasonal offers",
      "Recent photos, reviews, store atmosphere, and reasons to choose a local option",
    ],
    searchMoment:
      "A useful retail path moves a shopper from ‘is there a nearby option?’ to ‘I know what this store offers and how to take the next step.’",
    services: [
      {
        title: "Storefront website design",
        href: "/services#website-design",
        description:
          "Organize categories, store details, product context, events, pickup options, and customer actions around real shopping questions.",
      },
      {
        title: "Google Business Profile care",
        href: "/services#google-business-profile",
        description:
          "Keep hours, categories, photos, attributes, offers, and other local details useful when shoppers compare nearby options.",
      },
      {
        title: "Retail-focused local SEO",
        href: "/services#local-seo",
        description:
          "Strengthen relevance for priority products, categories, store experiences, and the geographic market the business serves.",
      },
      {
        title: "Focused local advertising",
        href: "/services#paid-advertising",
        description:
          "Support launches, events, seasonal demand, or high-priority categories when the offer, audience, budget, and measurement plan are ready.",
      },
    ],
    helpIntro:
      "Hometown Boost connects local discovery, accurate store information, product interest, and practical customer actions without treating every online signal as a confirmed sale.",
    helpSteps: [
      {
        title: "Map the shopping journey",
        description:
          "Identify the categories, questions, occasions, and store details that shape a nearby customer’s decision.",
      },
      {
        title: "Keep local information dependable",
        description:
          "Coordinate priority website and profile details so customers are less likely to find conflicting hours, offers, or directions.",
      },
      {
        title: "Give product interest a next step",
        description:
          "Connect category and promotional content to calls, directions, pickup information, visits, or another action the store can support.",
      },
      {
        title: "Review online and offline context",
        description:
          "Use supported digital signals alongside store feedback and business records before deciding what to improve.",
      },
    ],
    measurements: [
      {
        title: "Directions and profile actions",
        description:
          "Review available direction requests, calls, website actions, and profile engagement as local-intent signals rather than exact foot traffic.",
      },
      {
        title: "Priority category engagement",
        description:
          "Track useful visits and actions around the products, categories, events, or seasonal pages the store wants to grow.",
      },
      {
        title: "Calls and customer requests",
        description:
          "Measure supported phone, form, pickup, event, or availability inquiries without assuming each became a purchase.",
      },
      {
        title: "Campaign and offer signals",
        description:
          "Compare promotion sources, landing-page actions, and available store records when the offer and reporting window are clearly defined.",
      },
    ],
    measurementNote:
      "Direction requests are not confirmed visits, and visits are not confirmed purchases. Inventory, weather, events, staffing, merchandising, pricing, and point-of-sale records can affect results, so attribution should remain explicit and limited.",
    faqs: [
      {
        question: "Can Hometown Boost work with an existing ecommerce or inventory system?",
        answer:
          "Often, yes. The useful approach depends on how the current system publishes products, locations, availability, pickup details, and customer actions. The first step is reviewing those connections and their limits.",
      },
      {
        question: "Does a local retail website need every product listed?",
        answer:
          "Not always. Some stores benefit from complete ecommerce inventory, while others need clear categories, featured products, store context, and a dependable way to check availability. The structure should match the operation.",
      },
      {
        question: "Can seasonal promotions be measured?",
        answer:
          "Digital sources and customer actions can often be compared over a defined period. Confirmed visits and purchases require appropriate store or point-of-sale records, and the report should state any attribution limits.",
      },
      {
        question: "Do you guarantee store traffic or sales?",
        answer:
          "No. Hometown Boost can improve local visibility, customer information, campaign paths, and measurement, but it does not guarantee visits, transactions, revenue, or return on advertising.",
      },
    ],
    related: [
      {
        label: "Professional-services marketing",
        href: "/industries/professional-services",
        description: "Explore a trust-led customer journey for local expertise and consultation-based services.",
      },
      {
        label: "Automotive marketing",
        href: "/industries/automotive",
        description: "See another location-based journey built around calls, directions, trust, and appointments.",
      },
      {
        label: "Google Business Profile management",
        href: "/services#google-business-profile",
        description: "Keep local store details useful where nearby shoppers compare options.",
      },
      {
        label: "Local SEO",
        href: "/services#local-seo",
        description: "Improve relevance for priority categories, products, and the store’s local market.",
      },
    ],
    ctaTitle: "Make the next local shopping decision easier.",
    ctaBody:
      "Share your store model, categories, location, customer journey, seasonal priorities, and current tools. We’ll map the clearest place to begin.",
    ctaLabel: "Get My Retail Game Plan",
  },

  "professional-services": {
    slug: "professional-services",
    path: "/industries/professional-services",
    name: "Professional Service Businesses",
    shortName: "Professional services",
    metaTitle: "Local Marketing for Professional Services",
    metaDescription:
      "Local marketing for professional service businesses that clarifies expertise, builds appropriate trust, improves search visibility, and supports qualified inquiries.",
    eyebrow: "Professional-services marketing",
    h1: "Turn expertise into a clear local reason to reach out.",
    heroDescription:
      "Help prospective clients understand who you serve, which problems you address, what makes the practice credible, and how to begin a useful conversation.",
    scene: {
      type: "professionalServices",
      imagePosition: "67% 50%",
      accent: "#317f78",
      accentSoft: "#c7e8e2",
      tilt: "-3deg",
      searchLabel: "local professional near me",
      signalLabel: "Qualified inquiries • calls • consults",
      objectLabel: "Expertise, clarified",
    },
    challengeIntro:
      "Professional services are often trust-sensitive, difficult to summarize, and shaped by fit. Prospects may research quietly for a long time before deciding whether a first conversation feels worthwhile.",
    challenges: [
      {
        title: "Expertise can sound abstract",
        description:
          "Broad claims and industry language may not help a prospect recognize whether the service fits their actual situation.",
      },
      {
        title: "Trust requires appropriate context",
        description:
          "Credentials, experience, process, reviews, and educational content matter, but regulated fields may also require careful disclaimers and claim controls.",
      },
      {
        title: "Lead quality matters more than volume",
        description:
          "Geography, service fit, urgency, budget, conflicts, capacity, and other intake criteria can make two inquiries very different business opportunities.",
      },
    ],
    searchIntro:
      "Prospects combine a service, problem, location, credential, and trust question, then look for signs that the business understands their situation.",
    searches: [
      "Professional or service type plus a town, county, region, or ‘near me’",
      "A specific problem, goal, transaction, life event, or business need",
      "Credentials, experience, approach, consultation process, and appropriate fees information",
      "Reviews, educational resources, service fit, availability, and how to make contact",
    ],
    searchMoment:
      "A strong professional-services path helps the right prospect move from uncertainty to an informed first conversation without overstating outcomes or expertise.",
    services: [
      {
        title: "Trust-led website design",
        href: "/services#website-design",
        description:
          "Explain services, fit, process, credentials, locations, educational resources, and inquiry steps in clear client language.",
      },
      {
        title: "Professional-services local SEO",
        href: "/services#local-seo",
        description:
          "Strengthen relevance for priority services, client questions, and the markets the business is qualified and prepared to serve.",
      },
      {
        title: "Reputation management",
        href: "/services#reputation-management",
        description:
          "Support an ethical feedback process and place approved trust signals where they help prospects evaluate fit.",
      },
      {
        title: "Call and inquiry tracking",
        href: "/services#lead-tracking",
        description:
          "Connect supported sources to calls, forms, and consultations while respecting privacy, intake, and attribution limits.",
      },
    ],
    helpIntro:
      "Hometown Boost turns complex expertise into useful local customer paths, then connects visibility and inquiries to business context the available records can support.",
    helpSteps: [
      {
        title: "Define the right client fit",
        description:
          "Clarify services, geography, common needs, capacity, and intake criteria before building more attention.",
      },
      {
        title: "Translate expertise clearly",
        description:
          "Organize services and educational content around the questions prospects ask, with appropriate review for regulated claims.",
      },
      {
        title: "Build confidence before contact",
        description:
          "Use approved credentials, process explanations, real feedback, and practical next steps without promising a specific outcome.",
      },
      {
        title: "Connect inquiry context",
        description:
          "Review calls, forms, consultation starts, response handling, and supported disposition data to improve the path responsibly.",
      },
    ],
    measurements: [
      {
        title: "Qualified inquiry signals",
        description:
          "Track calls and forms, then use agreed service, geography, timing, and intake criteria when the business can classify them appropriately.",
      },
      {
        title: "Priority-service engagement",
        description:
          "Review how prospects use important service, location, process, credential, and educational pages before taking action.",
      },
      {
        title: "Local search visibility",
        description:
          "Monitor agreed service and market searches alongside inquiries rather than presenting ranking movement as the whole result.",
      },
      {
        title: "Consultation and follow-up context",
        description:
          "Connect scheduled or completed consultations only when privacy-conscious business records support that step.",
      },
    ],
    measurementNote:
      "Confidentiality, professional obligations, intake screening, conflicts, capacity, consultation attendance, sales follow-up, and offline decisions can limit attribution. Reports should use only appropriate records and avoid exposing sensitive client information.",
    faqs: [
      {
        question: "Can marketing content work for a regulated professional service?",
        answer:
          "Often, yes, but claims, testimonials, credentials, disclaimers, privacy, and advertising rules may require review by the business and qualified legal or compliance advisers before publication.",
      },
      {
        question: "Can one website explain several professional services?",
        answer:
          "Yes. Clear service pathways can help prospects recognize the right starting point while keeping the broader practice, team, locations, and consultation process connected.",
      },
      {
        question: "How should professional-service lead quality be measured?",
        answer:
          "The business should define appropriate, privacy-conscious criteria such as service fit, geography, urgency, capacity, or consultation status. Marketing reports should not expose confidential details or assume every inquiry is qualified.",
      },
      {
        question: "Do you guarantee clients, cases, appointments, or revenue?",
        answer:
          "No. Hometown Boost can improve clarity, visibility, customer paths, and supported measurement, but it does not guarantee professional engagements, appointments, matters, revenue, or any client outcome.",
      },
    ],
    related: [
      {
        label: "Retail-business marketing",
        href: "/industries/retail-businesses",
        description: "See a nearby-customer journey centered on storefront discovery and local action.",
      },
      {
        label: "Contractor marketing",
        href: "/industries/contractors",
        description: "Explore another trust-sensitive path where service fit and qualified inquiries matter.",
      },
      {
        label: "Website design",
        href: "/services#website-design",
        description: "Turn expertise, process, and service fit into a clearer prospect experience.",
      },
      {
        label: "Call and lead tracking",
        href: "/services#lead-tracking",
        description: "Connect inquiries to supported source and intake context responsibly.",
      },
    ],
    ctaTitle: "Make your expertise easier for the right local prospects to understand.",
    ctaBody:
      "Tell us about your services, market, intake process, capacity, and professional requirements. We’ll identify the clearest visibility and customer-path improvements.",
    ctaLabel: "Get My Professional-Services Game Plan",
  },
} satisfies Record<string, IndustryDetail>;

export type IndustrySlug = keyof typeof industryDetails;
