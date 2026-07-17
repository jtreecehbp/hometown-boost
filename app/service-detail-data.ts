export type ServiceSceneVariant =
  | "website"
  | "localSeo"
  | "googleProfile"
  | "reputation"
  | "paidAdvertising"
  | "callTracking";

export type ServiceDetail = {
  slug: string;
  name: string;
  shortName: string;
  eyebrow: string;
  metadataTitle: string;
  metadataDescription: string;
  heroTitle: string;
  heroDescription: string;
  problem: {
    title: string;
    body: string;
    signals: readonly string[];
  };
  solution: {
    title: string;
    body: string;
    principles: readonly string[];
  };
  inclusions: readonly {
    title: string;
    body: string;
  }[];
  benefit: {
    title: string;
    body: string;
    outcomes: readonly string[];
  };
  measurement: {
    title: string;
    body: string;
    signals: readonly string[];
    note: string;
  };
  faqs: readonly {
    question: string;
    answer: string;
  }[];
  related: readonly {
    label: string;
    href: `/services/${string}`;
    description: string;
  }[];
  finalCta: {
    title: string;
    body: string;
  };
  scene: ServiceSceneVariant;
};

export const serviceDetails = {
  websiteDesign: {
    slug: "website-design",
    name: "Website Design",
    shortName: "Website design",
    eyebrow: "Website design for local growth",
    metadataTitle: "Website Design for Local Businesses",
    metadataDescription:
      "Build a clear, mobile-friendly local business website that helps customers understand your offer, trust what they see, and take the next step.",
    heroTitle: "A local business website built to turn attention into action.",
    heroDescription:
      "We shape clear, mobile-friendly websites around the questions nearby customers ask before they call, visit, request a quote, or choose another business.",
    problem: {
      title: "A confusing website makes a good business harder to choose.",
      body:
        "Local customers often arrive with a specific problem and a short decision window. If the offer, service area, proof, or next step is buried, they may leave before understanding why your business is a fit.",
      signals: [
        "Important services are difficult to find on a phone",
        "Visitors cannot quickly tell where the business works",
        "Contact options are buried or inconsistent",
        "The site looks disconnected from the real customer experience",
      ],
    },
    solution: {
      title: "Build the customer path before decorating the page.",
      body:
        "We organize the website around real customer questions, clear service and location pathways, useful proof, and an obvious next action. Design choices support that path instead of competing with it.",
      principles: [
        "Plain language before marketing jargon",
        "Mobile decisions before desktop decoration",
        "Trust and clarity before extra effects",
      ],
    },
    inclusions: [
      {
        title: "Conversion-focused structure",
        body: "Plan pages and calls to action around the steps a local customer takes from first search to first conversation.",
      },
      {
        title: "Mobile-first experience",
        body: "Keep important services, proof, and contact options readable and easy to use on smaller screens.",
      },
      {
        title: "Service and location pathways",
        body: "Help visitors understand what the business does, who it helps, and where that help is available.",
      },
      {
        title: "Content and trust placement",
        body: "Use approved reviews, project context, credentials, and practical answers where they help a decision.",
      },
      {
        title: "Measurement-ready actions",
        body: "Prepare calls, forms, directions, and other useful actions for responsible tracking where the final tools allow it.",
      },
      {
        title: "Ongoing improvement",
        body: "Review the paths people use and make focused updates as services, markets, and priorities change.",
      },
    ],
    benefit: {
      title: "Make the first impression useful, not merely polished.",
      body:
        "A stronger website gives the right visitor a shorter path to understanding the business and starting a worthwhile conversation.",
      outcomes: [
        "Clearer service understanding",
        "Easier mobile contact",
        "Stronger alignment with local search",
        "A dependable home for approved proof",
      ],
    },
    measurement: {
      title: "Measure the actions the website is meant to support.",
      body:
        "The useful signals depend on the business model and available tools. We define them before drawing conclusions from the numbers.",
      signals: [
        "Calls and qualified form inquiries",
        "Visits to priority service and location pages",
        "Direction requests or appointment starts when relevant",
        "Conversion-path drop-off and follow-up gaps",
      ],
      note:
        "Traffic alone is not a business result. Any performance statement should use an agreed reporting period, a documented source, and enough context to explain what changed.",
    },
    faqs: [
      {
        question: "Does every website project require a complete rebuild?",
        answer:
          "No. The right scope depends on the current site, platform, content, technical condition, and business goals. A focused restructuring or improvement plan may be more useful than starting over.",
      },
      {
        question: "Can the website be updated after launch?",
        answer:
          "Yes. Services, locations, offers, proof, and customer questions change. The plan can include ongoing updates and focused improvements rather than treating launch as the finish line.",
      },
      {
        question: "Will a new website automatically create more leads?",
        answer:
          "No specific lead result can be guaranteed. A clearer website can remove friction and support visibility, trust, and action, but demand, competition, reputation, follow-up, and other factors also affect outcomes.",
      },
    ],
    related: [
      {
        label: "Local SEO",
        href: "/services/local-seo",
        description: "Connect the website to the services and places nearby customers search for.",
      },
      {
        label: "Call & Lead Tracking",
        href: "/services/call-tracking",
        description: "Understand which website actions become useful conversations.",
      },
      {
        label: "Reputation Management",
        href: "/services/reputation-management",
        description: "Place honest customer proof where it helps people choose.",
      },
    ],
    finalCta: {
      title: "Give local customers a clearer reason to take the next step.",
      body:
        "We’ll review the current website, customer path, service priorities, and practical gaps before recommending the right scope.",
    },
    scene: "website",
  },

  localSeo: {
    slug: "local-seo",
    name: "Local SEO",
    shortName: "Local SEO",
    eyebrow: "Local visibility with a purpose",
    metadataTitle: "Local SEO for Small Businesses",
    metadataDescription:
      "Strengthen the pages, local signals, and site structure that help nearby customers discover relevant services and locations.",
    heroTitle: "Show up for the local searches that can become real business.",
    heroDescription:
      "We connect useful service content, location relevance, technical upkeep, and clear measurement so visibility supports the customer journey instead of becoming a vanity score.",
    problem: {
      title: "Nearby demand does not help if search engines cannot understand the business.",
      body:
        "Thin service pages, vague location signals, inconsistent information, or technical friction can make it difficult for customers and search engines to connect a business with the right local need.",
      signals: [
        "Priority services have little useful page content",
        "Service areas are unclear or repeated without context",
        "Business information is inconsistent across key surfaces",
        "Rankings are reported without calls, leads, or customer actions",
      ],
    },
    solution: {
      title: "Build relevance around real services, places, and customer questions.",
      body:
        "We review how people search, strengthen the pages and local signals that deserve attention, and connect visibility work to the website and Google presence.",
      principles: [
        "Useful local context instead of location-page filler",
        "Sustainable improvements instead of shortcuts",
        "Business actions alongside ranking movement",
      ],
    },
    inclusions: [
      {
        title: "Search and competitor review",
        body: "Study the language, service patterns, local results, and customer questions that shape the market.",
      },
      {
        title: "Service-page improvements",
        body: "Clarify priority services with useful information that supports both discovery and customer decisions.",
      },
      {
        title: "Location relevance",
        body: "Strengthen legitimate service-area context without producing thin or repetitive pages.",
      },
      {
        title: "Technical upkeep",
        body: "Address indexing, internal linking, metadata, page experience, and other issues that can limit discovery.",
      },
      {
        title: "Google presence alignment",
        body: "Keep website content and Google Business Profile information consistent with the services and areas being emphasized.",
      },
      {
        title: "Ongoing prioritization",
        body: "Review changes in visibility, customer behavior, competition, and business capacity before selecting the next improvement.",
      },
    ],
    benefit: {
      title: "Create more useful chances to be discovered nearby.",
      body:
        "A stronger local search foundation helps the right customers find a relevant page, understand the offer, and move toward a call, visit, or inquiry.",
      outcomes: [
        "Clearer service relevance",
        "Stronger local content pathways",
        "More consistent business information",
        "Visibility reporting tied to customer actions",
      ],
    },
    measurement: {
      title: "Put rankings in business context.",
      body:
        "Visibility is one signal. We also review what people find, where they land, and whether the available data shows useful customer activity.",
      signals: [
        "Visibility for agreed services and locations",
        "Organic visits to priority pages",
        "Calls, forms, directions, or other useful actions",
        "Search themes that reveal content or offer gaps",
      ],
      note:
        "Search rankings vary by location, device, competition, personalization, and platform changes. Hometown Boost does not guarantee a particular position or amount of traffic.",
    },
    faqs: [
      {
        question: "Can Hometown Boost guarantee a first-place Google ranking?",
        answer:
          "No. Rankings depend on many factors and change over time. The work focuses on relevant, durable improvements and transparent reporting rather than guaranteed placement.",
      },
      {
        question: "Does local SEO only mean creating city pages?",
        answer:
          "No. Useful local SEO can include service content, technical upkeep, internal linking, business-information consistency, Google Business Profile alignment, reputation, and legitimate local context.",
      },
      {
        question: "How quickly will local visibility change?",
        answer:
          "There is no responsible universal timeline. Starting condition, competition, market size, website quality, platform changes, and the work required all affect when meaningful movement may appear.",
      },
    ],
    related: [
      {
        label: "Google Business Profile",
        href: "/services/google-business-profile",
        description: "Keep a key local discovery surface accurate, active, and useful.",
      },
      {
        label: "Website Design",
        href: "/services/website-design",
        description: "Give each important search a clear, credible destination.",
      },
      {
        label: "Reputation Management",
        href: "/services/reputation-management",
        description: "Support the local trust signals customers use when comparing options.",
      },
    ],
    finalCta: {
      title: "Find the local visibility gaps worth fixing first.",
      body:
        "We’ll review priority services, service areas, current pages, and available search signals before recommending a practical starting point.",
    },
    scene: "localSeo",
  },

  googleBusinessProfile: {
    slug: "google-business-profile",
    name: "Google Business Profile Management",
    shortName: "Google Business Profile",
    eyebrow: "A stronger local presence",
    metadataTitle: "Google Business Profile Management",
    metadataDescription:
      "Keep your Google Business Profile accurate, active, and aligned with the services, locations, and customer actions your local business values.",
    heroTitle: "Make your Google presence easier to find, trust, and use.",
    heroDescription:
      "We help keep the details customers rely on accurate, useful, and connected to the website, service areas, and next steps that matter to the business.",
    problem: {
      title: "A neglected profile can create doubt at the moment of comparison.",
      body:
        "Incorrect hours, unclear categories, stale photos, incomplete services, unanswered questions, or inconsistent business details can make a capable local business look less dependable.",
      signals: [
        "Hours, contact details, or service information are inconsistent",
        "Categories and services do not reflect current priorities",
        "Photos and updates no longer represent the business",
        "Profile activity is reviewed without customer-action context",
      ],
    },
    solution: {
      title: "Treat the profile like an active customer doorway.",
      body:
        "We organize accurate information, useful services, current visuals, appropriate updates, and a clear connection to the website so customers can make a better-informed next move.",
      principles: [
        "Accuracy before activity",
        "Customer usefulness before posting volume",
        "Profile signals connected to the wider growth plan",
      ],
    },
    inclusions: [
      {
        title: "Profile audit and cleanup",
        body: "Review core information, ownership, duplicates, categories, links, and obvious customer-facing gaps.",
      },
      {
        title: "Service and category refinement",
        body: "Align available profile fields with the business’s real services and priorities without misrepresentation.",
      },
      {
        title: "Hours and service-area upkeep",
        body: "Keep regular, special, and seasonal information current as the business changes.",
      },
      {
        title: "Photos and updates",
        body: "Organize approved visual and informational updates that help customers understand the business.",
      },
      {
        title: "Website alignment",
        body: "Connect profile links and service themes to useful, relevant website destinations.",
      },
      {
        title: "Performance review",
        body: "Review available calls, website actions, direction requests, and other profile signals with their limitations explained.",
      },
    ],
    benefit: {
      title: "Give customers a more dependable local snapshot.",
      body:
        "A well-maintained profile makes it easier for people to confirm the business, understand what it offers, and choose the next action with less friction.",
      outcomes: [
        "More accurate customer information",
        "Clearer service and location context",
        "A more current visual presence",
        "Better alignment between Google and the website",
      ],
    },
    measurement: {
      title: "Review the actions the platform can actually report.",
      body:
        "Available profile reporting can help show how customers discover and interact with the listing, but each metric needs context and platform definitions can change.",
      signals: [
        "Website actions from the profile",
        "Calls and direction requests where reported",
        "Profile completeness and information consistency",
        "Search and visibility themes available in the platform",
      ],
      note:
        "Profile optimization cannot guarantee Maps placement, calls, visits, or leads. Platform reporting also should not be treated as exact foot traffic or attributable revenue without supporting records.",
    },
    faqs: [
      {
        question: "Can profile changes guarantee higher Maps placement?",
        answer:
          "No. Local placement depends on relevance, distance, prominence, competition, search context, and platform systems outside any one provider’s control.",
      },
      {
        question: "Does the business keep ownership of its profile?",
        answer:
          "The business should retain appropriate ownership and access. Any management arrangement should use clearly assigned roles rather than transferring control unnecessarily.",
      },
      {
        question: "Are posts the most important part of profile management?",
        answer:
          "Not by themselves. Accurate information, appropriate categories, useful services, current photos, review care, website alignment, and customer experience can all matter to the profile’s usefulness.",
      },
    ],
    related: [
      {
        label: "Local SEO",
        href: "/services/local-seo",
        description: "Strengthen the wider website and local signals around the profile.",
      },
      {
        label: "Reputation Management",
        href: "/services/reputation-management",
        description: "Create a thoughtful process for earning and responding to feedback.",
      },
      {
        label: "Call & Lead Tracking",
        href: "/services/call-tracking",
        description: "Connect available profile actions to clearer lead-source context.",
      },
    ],
    finalCta: {
      title: "Turn your Google profile into a more useful customer doorway.",
      body:
        "We’ll review accuracy, services, categories, visuals, website alignment, and the customer actions that deserve attention.",
    },
    scene: "googleProfile",
  },

  reputationManagement: {
    slug: "reputation-management",
    name: "Reputation Management",
    shortName: "Reputation management",
    eyebrow: "Review growth built on real experiences",
    metadataTitle: "Reputation & Review Management",
    metadataDescription:
      "Build an honest, repeatable review request and response process that helps local customers see current, credible feedback.",
    heroTitle: "Make real customer trust easier to see and share.",
    heroDescription:
      "We help local businesses create a straightforward review request, monitoring, and response process without scripting praise, inventing feedback, or promising a perfect rating.",
    problem: {
      title: "Good customer experiences often stay invisible.",
      body:
        "Satisfied customers may never be asked for feedback, older reviews can dominate the first impression, and inconsistent responses can make the business appear less attentive than it really is.",
      signals: [
        "Review requests depend on individual memory",
        "Recent customer experiences are underrepresented",
        "Responses are delayed, inconsistent, or overly scripted",
        "The website does not use approved proof where it helps",
      ],
    },
    solution: {
      title: "Create a respectful process the team can actually follow.",
      body:
        "We identify appropriate request moments, simplify the customer path, establish a response approach, and use feedback themes to support trust and operational learning.",
      principles: [
        "Honest feedback instead of manufactured praise",
        "A repeatable process instead of a one-time push",
        "Thoughtful responses instead of canned reactions",
      ],
    },
    inclusions: [
      {
        title: "Review journey review",
        body: "Map when and how customers currently receive a request and where the process breaks down.",
      },
      {
        title: "Request workflow",
        body: "Create a simple, customer-friendly process for asking for honest feedback at an appropriate moment.",
      },
      {
        title: "Response guidance",
        body: "Develop practical principles for timely, respectful responses without pretending every situation is identical.",
      },
      {
        title: "Review monitoring",
        body: "Keep an eye on new feedback, recency, response consistency, and themes that deserve attention.",
      },
      {
        title: "Website trust placement",
        body: "Use approved reviews and context where they help customers understand the experience the business provides.",
      },
      {
        title: "Process improvement",
        body: "Use recurring feedback themes to identify communication, service, or follow-up opportunities.",
      },
    ],
    benefit: {
      title: "Help current customer experiences shape the next decision.",
      body:
        "A steady, honest review process makes recent trust more visible and gives the business useful feedback without turning customers into a marketing script.",
      outcomes: [
        "A more consistent request routine",
        "Timelier and more thoughtful responses",
        "Current proof available across the customer path",
        "Useful themes for business improvement",
      ],
    },
    measurement: {
      title: "Track the health of the process, not a promised star score.",
      body:
        "Review reporting should show what the business can influence while respecting platform rules and the fact that every customer controls their own feedback.",
      signals: [
        "Review volume and recency",
        "Response rate and response timing",
        "Rating distribution and customer themes",
        "Request-process consistency where the business records it",
      ],
      note:
        "Hometown Boost does not create reviews, require positive sentiment, or guarantee a rating, review count, or platform outcome. Published testimonials should be real and client-approved.",
    },
    faqs: [
      {
        question: "Will Hometown Boost write reviews for customers?",
        answer:
          "No. Reviews should reflect each customer’s real experience and words. The process can make honest feedback easier to share, but it should not manufacture or dictate sentiment.",
      },
      {
        question: "Can negative reviews be removed?",
        answer:
          "A platform may remove content that violates its policies, but disagreement alone does not guarantee removal. The practical response is to document concerns, use the platform’s process where appropriate, and reply thoughtfully.",
      },
      {
        question: "Can a perfect rating be guaranteed?",
        answer:
          "No. Customers control their feedback, and no responsible review program should promise a specific rating or only seek comments from people expected to be positive.",
      },
    ],
    related: [
      {
        label: "Google Business Profile",
        href: "/services/google-business-profile",
        description: "Keep the profile where many customers read reviews accurate and useful.",
      },
      {
        label: "Website Design",
        href: "/services/website-design",
        description: "Place approved customer proof within a clear decision path.",
      },
      {
        label: "Local SEO",
        href: "/services/local-seo",
        description: "Connect reputation with the broader local discovery experience.",
      },
    ],
    finalCta: {
      title: "Build a review process that earns trust the right way.",
      body:
        "We’ll look at the customer journey, request timing, response habits, and current proof before recommending a practical system.",
    },
    scene: "reputation",
  },

  paidAdvertising: {
    slug: "paid-advertising",
    name: "Paid Advertising",
    shortName: "Paid advertising",
    eyebrow: "Focused paid reach",
    metadataTitle: "Paid Advertising for Local Businesses",
    metadataDescription:
      "Plan focused local advertising around a clear offer, useful landing experience, responsible budget, and lead-quality measurement.",
    heroTitle: "Use paid reach when the offer and follow-up are ready for it.",
    heroDescription:
      "We connect audience targeting, campaign structure, landing-page clarity, budget visibility, and lead-quality review so paid traffic supports a real growth plan.",
    problem: {
      title: "Clicks become expensive when the rest of the system is disconnected.",
      body:
        "Weak targeting, unclear offers, mismatched landing pages, slow follow-up, or missing lead definitions can consume budget without showing whether the campaign created worthwhile opportunities.",
      signals: [
        "Campaigns send every visitor to a generic page",
        "Lead quality is not recorded consistently",
        "Ad spend and management fees are difficult to separate",
        "Budget decisions are based on clicks alone",
      ],
    },
    solution: {
      title: "Connect the campaign to the customer and the sales process.",
      body:
        "We start with the offer, audience, service area, landing experience, business capacity, and definition of a useful lead before treating more traffic as the answer.",
      principles: [
        "Clear budget visibility",
        "Landing-page alignment",
        "Lead quality before click volume",
      ],
    },
    inclusions: [
      {
        title: "Campaign planning",
        body: "Define the service, audience, geography, offer, timing, capacity, and useful next action before launch.",
      },
      {
        title: "Search and audience targeting",
        body: "Build focused targeting around the available platform options and the business’s real market.",
      },
      {
        title: "Creative and message alignment",
        body: "Keep the ad promise consistent with what the customer sees after the click.",
      },
      {
        title: "Landing-page support",
        body: "Reduce friction between campaign intent, service information, proof, and the next action.",
      },
      {
        title: "Budget review",
        body: "Keep platform spend separate from management scope and explain the factors behind budget recommendations.",
      },
      {
        title: "Lead-quality review",
        body: "Compare campaign activity with available call, form, service-fit, location-fit, and follow-up information.",
      },
    ],
    benefit: {
      title: "Reach high-intent prospects without hiding the tradeoffs.",
      body:
        "A focused paid plan can create a faster path to relevant demand while keeping spend, assumptions, and lead-quality signals visible.",
      outcomes: [
        "Clearer campaign purpose",
        "Better alignment from ad to landing page",
        "Visible separation of spend and management",
        "Decisions informed by useful lead signals",
      ],
    },
    measurement: {
      title: "Measure beyond impressions and clicks.",
      body:
        "Campaign reporting should connect platform activity to the best available customer and lead information while making attribution limits clear.",
      signals: [
        "Spend, impressions, clicks, and landing-page actions",
        "Calls, forms, and other recorded inquiries",
        "Service fit, location fit, and lead quality when available",
        "Follow-up gaps and capacity constraints that affect outcomes",
      ],
      note:
        "Advertising does not guarantee leads, customers, revenue, or return. Ad spend is separate from management fees, and platform-reported conversions should be checked against business records where possible.",
    },
    faqs: [
      {
        question: "Is advertising spend included in the management scope?",
        answer:
          "No. Platform spend should be shown separately from campaign management so the actual media budget remains visible and adjustable.",
      },
      {
        question: "Should every local business start with paid advertising?",
        answer:
          "No. The offer, landing experience, tracking, follow-up, service area, reputation, and capacity should be reviewed first. In some cases, strengthening the foundation is the better starting point.",
      },
      {
        question: "Can a specific return on ad spend be guaranteed?",
        answer:
          "No. Market demand, competition, budget, pricing, sales follow-up, capacity, seasonality, and measurement quality all affect outcomes.",
      },
    ],
    related: [
      {
        label: "Website Design",
        href: "/services/website-design",
        description: "Give paid visitors a clear page that matches the campaign promise.",
      },
      {
        label: "Call & Lead Tracking",
        href: "/services/call-tracking",
        description: "Bring source and lead-quality context into campaign decisions.",
      },
      {
        label: "Local SEO",
        href: "/services/local-seo",
        description: "Build durable local discovery alongside optional paid reach.",
      },
    ],
    finalCta: {
      title: "Find out whether paid reach is the right next move.",
      body:
        "We’ll review the offer, market, landing experience, follow-up, tracking, and capacity before recommending a campaign direction.",
    },
    scene: "paidAdvertising",
  },

  callTracking: {
    slug: "call-tracking",
    name: "Call Tracking and Lead Management",
    shortName: "Call & lead tracking",
    eyebrow: "Clearer lead-source insight",
    metadataTitle: "Call Tracking & Lead Management",
    metadataDescription:
      "Organize practical call and inquiry tracking so a local business can better understand lead sources, quality, and follow-up gaps.",
    heroTitle: "See which marketing starts useful customer conversations.",
    heroDescription:
      "We help organize practical call, form, and inquiry tracking around the customer actions your team already handles—without pretending every contact is a qualified lead.",
    problem: {
      title: "Scattered inquiries make useful marketing hard to identify.",
      body:
        "When calls, forms, messages, and sales notes live in separate places, it is difficult to connect a lead with its source, understand quality, or see where follow-up may be breaking down.",
      signals: [
        "Every inquiry is counted as an equal lead",
        "Source information disappears during follow-up",
        "Missed calls and delayed responses are difficult to review",
        "Reports show activity without business outcomes",
      ],
    },
    solution: {
      title: "Define useful lead information before building the report.",
      body:
        "We map the inquiry path, agree on practical lead-quality signals, connect available sources, and create reporting that helps the business ask better follow-up questions.",
      principles: [
        "Useful definitions before dashboards",
        "Source context without false certainty",
        "Privacy and consent requirements considered in setup",
      ],
    },
    inclusions: [
      {
        title: "Inquiry-path review",
        body: "Map how calls, forms, messages, and other inquiries reach the team and where context is lost.",
      },
      {
        title: "Lead-quality definitions",
        body: "Agree on practical signals such as service fit, location fit, urgency, project type, and sales disposition.",
      },
      {
        title: "Source tracking setup",
        body: "Connect available website, profile, campaign, call, and form sources where the selected tools responsibly support it.",
      },
      {
        title: "Reporting views",
        body: "Organize a clear view of inquiry volume, source, quality, and unresolved data gaps.",
      },
      {
        title: "Follow-up gap review",
        body: "Look for missed calls, delayed responses, incomplete dispositions, and other operational issues that affect results.",
      },
      {
        title: "Ongoing refinement",
        body: "Update definitions and reporting as services, systems, teams, and business questions change.",
      },
    ],
    benefit: {
      title: "Replace lead-count fog with better business questions.",
      body:
        "A clearer tracking process helps the team understand where opportunities begin, which inquiries fit, and where marketing or follow-up deserves attention.",
      outcomes: [
        "More consistent source context",
        "A clearer definition of a useful lead",
        "Better visibility into follow-up gaps",
        "Reporting that separates activity from opportunity",
      ],
    },
    measurement: {
      title: "Document what the data can—and cannot—prove.",
      body:
        "Lead tracking is strongest when marketing sources and business follow-up records can be compared. Missing dispositions and offline decisions should remain visible as limitations.",
      signals: [
        "Tracked calls, forms, and messages by available source",
        "Qualified-opportunity rate using agreed definitions",
        "Missed-call and response patterns",
        "Known attribution gaps and unresolved inquiries",
      ],
      note:
        "Tracking configuration depends on the business’s phone, form, consent, privacy, and recordkeeping requirements. No report should claim exact revenue attribution when the underlying records do not support it.",
    },
    faqs: [
      {
        question: "Does call tracking replace the business phone system?",
        answer:
          "Not necessarily. The right approach depends on the current phone setup, routing needs, reporting goals, customer experience, and applicable consent requirements.",
      },
      {
        question: "Is every tracked call considered a qualified lead?",
        answer:
          "No. A call may be a customer question, vendor, wrong number, existing-client request, or poor-fit inquiry. Useful reporting separates volume from agreed quality signals when the team records them.",
      },
      {
        question: "Can tracking prove exactly how much revenue marketing created?",
        answer:
          "Only when the available source, sales, and revenue records support that connection. Attribution limits, offline decisions, repeat customers, and missing dispositions should be stated clearly.",
      },
    ],
    related: [
      {
        label: "Paid Advertising",
        href: "/services/paid-advertising",
        description: "Use lead-source and quality signals to guide campaign decisions.",
      },
      {
        label: "Website Design",
        href: "/services/website-design",
        description: "Create clear, measurable customer actions across the website.",
      },
      {
        label: "Google Business Profile",
        href: "/services/google-business-profile",
        description: "Connect available profile activity to wider inquiry context.",
      },
    ],
    finalCta: {
      title: "Build a clearer picture of where good inquiries begin.",
      body:
        "We’ll review the current phone, form, follow-up, and reporting process before recommending a practical tracking setup.",
    },
    scene: "callTracking",
  },
} as const satisfies Record<string, ServiceDetail>;
