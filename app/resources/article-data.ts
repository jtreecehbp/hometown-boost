export type ResourceLink = {
  label: string;
  href: string;
  description: string;
};

export type OfficialReference = {
  label: string;
  href: string;
};

export type ArticleSection = {
  id: string;
  heading: string;
  paragraphs: string[];
  bullets?: string[];
  callout?: string;
};

export type ResourceArticle = {
  slug: string;
  category: string;
  title: string;
  shortTitle: string;
  description: string;
  summary: string;
  takeaway: string;
  featured?: boolean;
  readTime: string;
  published: string;
  updatedLabel: string;
  introduction: string[];
  sections: ArticleSection[];
  checklistTitle: string;
  checklist: string[];
  closing: string;
  officialReferences: OfficialReference[];
  related: ResourceLink[];
};

export const resourceArticles = {
  "rank-higher-google-maps": {
    slug: "rank-higher-google-maps",
    category: "Local SEO",
    title: "How to rank higher in Google Maps",
    shortTitle: "Rank higher in Google Maps",
    description:
      "Learn how profile accuracy, relevance, reviews, website support, and measurement can improve a local business’s visibility in Google Maps.",
    summary:
      "A practical look at relevance, distance, prominence, complete business information, and the website signals that support stronger local visibility.",
    takeaway:
      "Know which local visibility inputs you can improve—and which shortcuts to ignore.",
    featured: true,
    readTime: "10 minute read",
    published: "2026-07-16",
    updatedLabel: "Updated July 16, 2026",
    introduction: [
      "Ranking higher in Google Maps is not a single switch. It is the result of making your business easier for Google to understand and easier for customers to trust and choose.",
      "Google says local results are mainly based on relevance, distance, and prominence. You can improve the information and experience that support relevance and prominence. You cannot control where every searcher is located, and nobody can pay Google for a better organic local ranking.",
      "That makes the best plan refreshingly practical: represent the business accurately, build useful service and location information, earn genuine customer feedback, and measure the actions that matter over time.",
    ],
    sections: [
      {
        id: "understand-the-map",
        heading: "Start by understanding the local result",
        paragraphs: [
          "A Maps result is not one universal scoreboard. The order can change with the search phrase, the searcher’s location, the device, and the businesses Google considers relevant at that moment. A contractor may be visible for one service in the center of town and much less visible for a different service several towns away.",
          "Instead of asking only, “What position are we?” define the searches, services, and geographic areas that matter. Track a small set consistently. Pair visibility with calls, website clicks, direction requests, and qualified inquiries so rank never becomes a vanity metric.",
        ],
        bullets: [
          "Choose priority services rather than tracking every possible keyword.",
          "Choose the towns or neighborhoods that match real operating capacity.",
          "Record a baseline before making major changes.",
          "Review trends over a useful period instead of reacting to one search.",
        ],
      },
      {
        id: "profile-accuracy",
        heading: "Make the Business Profile complete and accurate",
        paragraphs: [
          "Google’s own local-ranking guidance emphasizes complete, accurate business information. Begin with the real-world business name, the most specific primary category that describes the core business, accurate hours, the correct phone number, the right website page, and a precise address or service area.",
          "Avoid adding service phrases, town names, or promotional language to the business name unless they are part of the name customers actually see in the real world. Category choices should describe what the business is, not become a list of every keyword the owner hopes to rank for.",
          "Service-area businesses should represent where they actually travel. A larger service area does not create an automatic ranking advantage, and an inaccurate address can create customer confusion or policy risk.",
        ],
        bullets: [
          "Use the real business name consistently.",
          "Select one accurate primary category and only relevant secondary categories.",
          "Keep regular, holiday, and seasonal hours current.",
          "Use a phone number answered by the business or its authorized team.",
          "Link to the most helpful website destination for that location.",
        ],
      },
      {
        id: "relevance",
        heading: "Build relevance with useful service information",
        paragraphs: [
          "A profile can only say so much. The website should explain the services, products, problems solved, service areas, and next steps in language customers understand. A page about one meaningful service is usually more useful than a generic paragraph that lists twenty offerings.",
          "Use the words customers use naturally in page titles, headings, body copy, image descriptions where appropriate, and internal links. Write for the person comparing options, not for a search engine checklist. Helpful pages answer practical questions about fit, process, coverage, timing, and how to get started.",
          "For a multi-location business, each legitimate location needs accurate local information and content that reflects what is actually available there. For a service-area business, location content should be honest about coverage and should add more value than swapping one town name for another.",
        ],
        callout:
          "A strong local page makes the business more understandable. It does not repeat a city name until the page becomes awkward to read.",
      },
      {
        id: "prominence-and-trust",
        heading: "Strengthen prominence and customer trust",
        paragraphs: [
          "Google describes prominence as how well known a business is. Its guidance notes signals such as information across the web, links, and reviews. In practice, that means building a business people genuinely mention, recommend, and recognize—not buying a bundle of low-quality directory links.",
          "Keep important business information consistent on major profiles and industry sources. Earn local mentions through real relationships, sponsorships, associations, useful partnerships, and work worth talking about. Publish project, product, or service information that other people may reasonably reference.",
          "Reviews support trust and can also contribute to local prominence. Ask customers for honest feedback through a repeatable process. Do not offer rewards for reviews or pressure customers to leave only positive feedback.",
        ],
      },
      {
        id: "activity-and-maintenance",
        heading: "Treat local visibility as maintenance, not a launch task",
        paragraphs: [
          "Business details change. Teams add services, holiday hours shift, photos age, and customer questions reveal missing information. Schedule a simple recurring profile review instead of waiting for a problem.",
          "Check that edits are live, review recent customer feedback, replace outdated photos, confirm landing pages still match the profile, and look for new search terms or customer questions. Activity should have a business reason; posting for the sake of looking busy is not a strategy.",
        ],
        bullets: [
          "Review core profile details monthly.",
          "Update special hours before holidays and seasonal changes.",
          "Add current, representative photos from the real business.",
          "Respond thoughtfully to reviews without using canned sales copy.",
          "Check that the linked website page remains accurate and fast on mobile.",
        ],
      },
      {
        id: "measurement",
        heading: "Measure visibility alongside customer actions",
        paragraphs: [
          "A stronger map position is useful only when it helps the right customers find and contact the business. Review the searches that surface the profile, website clicks, call-button clicks, direction requests, and bookings where those metrics apply. Then compare them with the business’s own call, form, and sales records.",
          "Document changes and give them enough time to produce a meaningful pattern. Local performance can move with seasonality, competition, demand, operating hours, and Google’s systems. A short-lived rise or drop should prompt investigation, not a guaranteed conclusion.",
        ],
        callout:
          "No honest provider can guarantee a particular Google Maps position. The controllable work is accuracy, usefulness, customer experience, measurement, and steady improvement.",
      },
    ],
    checklistTitle: "Google Maps visibility checklist",
    checklist: [
      "Confirm the profile is owned by the business and access is documented.",
      "Use the real-world business name without added keywords.",
      "Choose an accurate primary category and only relevant secondary categories.",
      "Verify address, service area, phone, website, and all hours.",
      "Create useful pages for priority services and legitimate locations.",
      "Keep business information consistent on important external profiles.",
      "Ask customers for genuine reviews without incentives.",
      "Respond to reviews and use recurring themes to improve the customer experience.",
      "Track priority searches across the areas the business can actually serve.",
      "Connect visibility reporting to calls, leads, visits, and qualified opportunities.",
    ],
    closing:
      "The most dependable way to improve local visibility is to make the business more accurate, useful, and trusted at every step. Start with the profile, support it with strong website information, then keep learning from real customer behavior.",
    officialReferences: [
      {
        label: "Google Business Profile Help: Tips to improve your local ranking",
        href: "https://support.google.com/business/answer/7091?hl=en",
      },
      {
        label: "Google Business Profile Help: Guidelines for representing your business",
        href: "https://support.google.com/business/answer/3038177?hl=en",
      },
      {
        label: "Google Search Central: Search Essentials",
        href: "https://developers.google.com/search/docs/essentials",
      },
    ],
    related: [
      {
        label: "Local SEO",
        href: "/services#local-seo",
        description: "See how local visibility work fits into an ongoing growth plan.",
      },
      {
        label: "Google Business Profile management",
        href: "/services#google-business-profile",
        description: "Explore practical profile cleanup, upkeep, and performance review.",
      },
      {
        label: "Results and measurement",
        href: "/results",
        description: "Learn how Hometown Boost connects visibility to useful business actions.",
      },
    ],
  },
  "website-not-generating-calls": {
    slug: "website-not-generating-calls",
    category: "Website Strategy",
    title: "Why your local business website is not generating calls",
    shortTitle: "Why your website is not generating calls",
    description:
      "Find why a local business website gets visits but too few calls, then fix offer clarity, mobile friction, trust, page intent, and tracking gaps.",
    summary:
      "Learn how unclear offers, weak mobile experiences, buried contact options, and mismatched search intent can quietly cost a business good leads.",
    takeaway: "Use a simple page-by-page checklist to find conversion friction.",
    featured: true,
    readTime: "9 minute read",
    published: "2026-07-16",
    updatedLabel: "Updated July 16, 2026",
    introduction: [
      "A website can look polished, receive traffic, and still fail to produce useful calls. That usually does not mean the business needs a louder headline or another animation. It means there is friction between what the visitor needs and what the page helps them do.",
      "The fastest way to diagnose the problem is to follow the customer’s path: what brought them to the page, what they need to understand, what proof they need, and how easily they can take the next step on a phone.",
      "Do not judge the site by traffic alone. Start with qualified calls, forms, appointments, direction requests, and the conversations the team actually wants more of.",
    ],
    sections: [
      {
        id: "define-a-useful-call",
        heading: "Define what a useful call actually is",
        paragraphs: [
          "Before changing the website, agree on what counts. A roofing company may value full replacement inquiries more than small repairs. An equipment dealer may care about product availability, service, parts, and financing calls differently. A repair shop may need calls from a realistic driving radius during hours the team can answer.",
          "Review a sample of recent inquiries and label them by service fit, location fit, urgency, and outcome. This keeps the project focused on better opportunities instead of simply making the phone ring more often.",
        ],
        bullets: [
          "Which services or products make a call worthwhile?",
          "Which geographic areas can the business serve profitably?",
          "What information helps the team qualify the opportunity?",
          "Who answers, and what happens when the call is missed?",
        ],
      },
      {
        id: "match-search-intent",
        heading: "Make each page match the visitor’s reason for arriving",
        paragraphs: [
          "A person searching for emergency repair needs a different path than someone comparing equipment models or planning a future project. Sending every visitor to a general homepage forces them to work too hard.",
          "Create useful destinations for important services, products, problems, and locations. The page title and main heading should confirm the visitor is in the right place. The opening copy should explain who the service is for, what the business handles, and what to do next.",
          "Google’s Search Essentials recommends helpful, reliable, people-first content and using the words people use in prominent places. That is good conversion advice too: clarity helps both discovery and decision-making.",
        ],
        callout:
          "A page should answer the visitor’s first question before asking for a call.",
      },
      {
        id: "mobile-first-screen",
        heading: "Fix the first mobile screen",
        paragraphs: [
          "Many local customers arrive on a phone, often while comparing several businesses. In the first screen they should be able to identify the company, understand the service or product, see the coverage area when relevant, and find a clear next step.",
          "Test the page on a real phone with one hand. Look for tiny text, slow images, buttons hidden below oversized artwork, menus that cover content, phone numbers that are not tappable, and forms that demand too much information before a conversation can begin.",
          "The primary action may be a call, request form, appointment, directions, inventory inquiry, or quote. Choose the action that matches the page rather than using the same button everywhere.",
        ],
        bullets: [
          "Use a descriptive call-to-action label.",
          "Keep tap targets comfortable and separated.",
          "Place the phone number where it can be found without hunting.",
          "Avoid artwork that pushes the offer and action out of view.",
          "Keep forms short enough for the stage of the decision.",
        ],
      },
      {
        id: "trust-gap",
        heading: "Close the trust gap before asking for contact",
        paragraphs: [
          "Local customers are often deciding whether to invite someone to a home, leave a vehicle or machine, spend a meaningful amount of money, or depend on a business in an urgent moment. A generic promise is not enough.",
          "Use specific service details, real project or product photos, clear coverage information, credentials where appropriate, recent reviews used with permission, and plain explanations of the process. Show what happens after a visitor reaches out.",
          "Do not manufacture proof. If client results or testimonials are not approved, explain the process and measurement standard honestly until real proof is available.",
        ],
      },
      {
        id: "contact-friction",
        heading: "Remove friction from the contact path",
        paragraphs: [
          "A visible button is not enough if it leads to a dead form, an unmonitored inbox, a scheduling page with no appointments, or a phone tree nobody owns. Test the entire path from click to response.",
          "Ask only for information needed to make the next conversation useful. Clearly identify required fields, provide helpful error messages, confirm that a submission succeeded, and tell the visitor what happens next. Offer an appropriate alternative when someone cannot or does not want to use the main method.",
        ],
        bullets: [
          "Submit every form on desktop and mobile.",
          "Confirm delivery to a monitored destination.",
          "Test confirmation messages and follow-up emails.",
          "Call every published phone number.",
          "Check booking availability and time-zone handling.",
          "Assign ownership for missed calls and new leads.",
        ],
      },
      {
        id: "measure-the-funnel",
        heading: "Measure the full path, not just the click",
        paragraphs: [
          "Record the page a visitor entered, the action taken, the source where practical, and whether the inquiry became a qualified opportunity. A page with fewer calls may still be better if those calls are a stronger fit.",
          "Look for page-level patterns. If visitors reach a service page but do not act, the offer or trust may be weak. If forms begin but do not finish, the form may ask too much. If many calls are missed, the website may be doing its job while the follow-up process needs attention.",
          "Make one focused improvement at a time and document the change. Seasonality, demand, advertising, and staffing can affect results, so avoid treating a short window as proof of a guaranteed outcome.",
        ],
      },
    ],
    checklistTitle: "Page-by-page call conversion checklist",
    checklist: [
      "Name the page’s primary visitor and desired action.",
      "Confirm the title and H1 match the service, product, or problem.",
      "Explain the offer and coverage area in the opening screen.",
      "Use one primary call to action with a clear label.",
      "Make phone numbers tappable and forms usable on mobile.",
      "Add specific trust signals without invented claims.",
      "Explain what happens after the visitor reaches out.",
      "Test forms, phone numbers, booking links, and confirmations.",
      "Track source, landing page, action, and lead quality where practical.",
      "Review missed calls and response time alongside website performance.",
    ],
    closing:
      "A website generates more useful calls when it makes the customer’s decision easier. Clarify the page, prove the fit, remove contact friction, and connect every inquiry to a follow-up process the business can actually manage.",
    officialReferences: [
      {
        label: "Google Search Central: Search Essentials",
        href: "https://developers.google.com/search/docs/essentials",
      },
    ],
    related: [
      {
        label: "Website design",
        href: "/services#website-design",
        description: "See how Hometown Boost structures a clearer path from visit to conversation.",
      },
      {
        label: "Call and lead tracking",
        href: "/services#lead-tracking",
        description: "Connect website actions with the inquiries your team receives.",
      },
      {
        label: "Measurement approach",
        href: "/results",
        description: "Review the signals that turn website activity into a useful business question.",
      },
    ],
  },
  "get-more-google-reviews": {
    slug: "get-more-google-reviews",
    category: "Review Growth",
    title: "How to get more Google reviews without making it awkward",
    shortTitle: "Get more Google reviews",
    description:
      "Build a policy-aware Google review process around genuine customer experiences, clear timing, an easy link, team ownership, and thoughtful responses.",
    summary:
      "Build an honest request routine around the moments customers are most likely to respond, without making the process awkward for your team or customers.",
    takeaway: "Turn review requests into a repeatable part of customer follow-up.",
    readTime: "9 minute read",
    published: "2026-07-16",
    updatedLabel: "Updated July 16, 2026",
    introduction: [
      "The best review program is not a one-time campaign. It is a small, respectful habit built into the moments when a customer has enough experience to give honest feedback.",
      "Google allows businesses to ask customers for reviews and provides a review link or QR code to make the process easier. Google also says reviews must reflect genuine experiences and prohibits incentives offered in exchange for reviews, changes, or removal of negative feedback.",
      "The goal is not to manufacture a perfect rating. It is to make it easy for real customers to share balanced feedback while the business listens and improves.",
    ],
    sections: [
      {
        id: "right-moment",
        heading: "Choose the right moment to ask",
        paragraphs: [
          "Ask after the customer has experienced the value: a repair is complete, equipment is delivered, a project milestone is approved, an appointment ends, or a customer expresses satisfaction. Asking too early feels disconnected. Waiting months makes the experience harder to recall.",
          "Map the real customer journey and choose one or two reliable moments. The right moment differs by business. A quick service visit may justify a same-day request; a long project may need a final walkthrough first.",
        ],
        bullets: [
          "The customer has received the promised service or product.",
          "Any immediate issue has been acknowledged and handled.",
          "The person asking has permission and the right contact information.",
          "The request feels like part of normal follow-up, not pressure.",
        ],
      },
      {
        id: "make-it-easy",
        heading: "Make the request easy to complete",
        paragraphs: [
          "Use the review link or QR code available through the Business Profile. Add it to a short thank-you email, text, receipt, leave-behind card, or in-store sign where appropriate. Test the destination while signed out and on a phone so the team knows what customers will experience.",
          "Keep the request short. Thank the customer, ask for honest feedback, provide the link, and explain that the feedback helps the business and future customers. Do not write the review for them or tell them which rating to choose.",
        ],
        callout:
          "A useful request sounds like: “Thank you for choosing us. If you have a moment, would you share an honest review of your experience? Here is the direct link.”",
      },
      {
        id: "ask-fairly",
        heading: "Ask consistently and fairly",
        paragraphs: [
          "A healthy process does not ask only the customers expected to leave five stars. Build the request around a completed customer experience or another neutral rule the team can follow consistently.",
          "Do not offer discounts, gifts, contest entries, or other incentives in exchange for a review. Do not ask an employee, agency, friend, or person without a genuine customer experience to post one. Do not create a path that sends happy customers to Google while quietly diverting unhappy customers elsewhere.",
          "If the business wants private feedback too, invite it as a separate customer-care option without using it to filter who receives the public review request.",
        ],
      },
      {
        id: "build-workflow",
        heading: "Give the workflow an owner",
        paragraphs: [
          "Review requests fail when everyone is supposed to send them and nobody is responsible. Assign the trigger, sender, timing, and follow-up. Keep the workflow simple enough to survive a busy week.",
          "A service business might mark the job complete, send the request automatically after a brief delay, and allow one courteous reminder. A retail business might place the QR code on a receipt and train staff to mention it naturally. A dealership might send different follow-up after a purchase, delivery, parts visit, or service visit.",
        ],
        bullets: [
          "Trigger: what event makes a customer eligible for the request?",
          "Owner: who sends or verifies the request?",
          "Channel: email, text, receipt, QR code, or another appropriate method?",
          "Timing: how soon after the experience?",
          "Reminder: whether one follow-up is appropriate and when it stops.",
        ],
      },
      {
        id: "respond-to-reviews",
        heading: "Respond like a real business",
        paragraphs: [
          "A response shows that feedback reaches a person. Thank reviewers for specific positive feedback without revealing private details. For criticism, acknowledge the concern, avoid arguing in public, and offer a reasonable path to continue the conversation directly.",
          "Do not copy the same promotional paragraph under every review. A short, specific response usually feels more credible. Establish who can respond, which situations need escalation, and what information should never be disclosed.",
        ],
      },
      {
        id: "measure-and-learn",
        heading: "Measure consistency, not just the average rating",
        paragraphs: [
          "Track requests sent, reviews received, review recency, response time, rating distribution, and recurring themes. A perfect average is not the only sign of trust; customers also look for recent, detailed feedback and thoughtful responses.",
          "Use review themes as operating insight. Repeated praise can clarify what the business should emphasize. Repeated concerns can reveal a process, communication, or expectation gap. Marketing cannot repair an experience the business refuses to examine.",
          "Avoid promising a specific number of reviews or rating. Response rates vary by customer type, timing, channel, and experience.",
        ],
      },
    ],
    checklistTitle: "Review request workflow checklist",
    checklist: [
      "Choose a neutral customer milestone that triggers the request.",
      "Generate and test the official review link or QR code.",
      "Write a short request for honest feedback without rating pressure.",
      "Choose the appropriate channel and timing for each customer journey.",
      "Assign one person or system to own delivery and follow-up.",
      "Never offer an incentive in exchange for a review.",
      "Ask customers consistently rather than selecting only expected promoters.",
      "Create a response standard for positive, neutral, and critical feedback.",
      "Protect customer privacy in public responses.",
      "Review recurring themes and improve the underlying experience.",
    ],
    closing:
      "More reviews begin with a real customer experience and a simple habit. Ask honestly, make the path easy, respond thoughtfully, and treat the feedback as useful business information—not just a number beside the company name.",
    officialReferences: [
      {
        label: "Google Business Profile Help: Create a review link or QR code",
        href: "https://support.google.com/business/answer/16816815?hl=en",
      },
      {
        label: "Google Business Profile Help: Tips to get more reviews",
        href: "https://support.google.com/business/answer/3474122?hl=en",
      },
      {
        label: "Google Business Profile Help: Restrictions for fake or incentivized reviews",
        href: "https://support.google.com/business/answer/14114287?hl=en",
      },
    ],
    related: [
      {
        label: "Reputation and review growth",
        href: "/services#reputation-management",
        description: "See how a repeatable review process fits into broader trust building.",
      },
      {
        label: "Reviews and client stories",
        href: "/reviews",
        description: "Read Hometown Boost’s standard for publishing real, approved customer proof.",
      },
      {
        label: "Google Business Profile management",
        href: "/services#google-business-profile",
        description: "Keep profile information, activity, reviews, and performance review connected.",
      },
    ],
  },
  "google-business-profile-mistakes": {
    slug: "google-business-profile-mistakes",
    category: "Google Business Profile",
    title: "Google Business Profile mistakes local businesses should avoid",
    shortTitle: "Google Business Profile mistakes to avoid",
    description:
      "Avoid Google Business Profile mistakes involving names, categories, locations, hours, access, reviews, photos, website links, and reporting.",
    summary:
      "Spot common issues with categories, service areas, hours, photos, duplicate information, and neglected customer questions before they create confusion.",
    takeaway: "Keep the profile accurate, active, and useful to real searchers.",
    readTime: "10 minute read",
    published: "2026-07-16",
    updatedLabel: "Updated July 16, 2026",
    introduction: [
      "A Google Business Profile often becomes a customer’s first view of a local business. The wrong hours, an inaccurate location, a weak category choice, or an unanswered access problem can create friction before the customer ever reaches the website.",
      "Most costly mistakes are not advanced SEO problems. They are accuracy, ownership, policy, and maintenance problems. Fixing them starts with representing the real business clearly and making someone responsible for keeping the information current.",
      "The checklist below focuses on controllable improvements. It does not promise a particular ranking or number of leads.",
    ],
    sections: [
      {
        id: "business-name",
        heading: "Mistake 1: Adding keywords to the business name",
        paragraphs: [
          "The profile name should match the business name used consistently in the real world. Adding services, cities, slogans, hours, or promotional language can misrepresent the business and create policy risk.",
          "Use the proper fields for categories, service areas, hours, services, and descriptions. If the branding changes, update real-world signage and business materials as part of a legitimate change rather than treating the name field like an advertising headline.",
        ],
      },
      {
        id: "categories",
        heading: "Mistake 2: Treating categories like keywords",
        paragraphs: [
          "The primary category should be the most specific available option that describes the core business. Secondary categories should represent meaningful parts of the same business, not every product, service, or search phrase imaginable.",
          "Category changes can affect available profile features and may sometimes require verification. Document the current selection, the reason for a change, and the date. Avoid changing categories repeatedly without a business reason.",
        ],
        bullets: [
          "Choose what the business is, not what it sells as a single product.",
          "Use the most specific accurate primary category available.",
          "Add only relevant secondary categories.",
          "Review category fit when the real business model changes.",
        ],
      },
      {
        id: "location-and-service-area",
        heading: "Mistake 3: Misrepresenting the address or service area",
        paragraphs: [
          "A storefront, service-area business, and hybrid business have different location realities. A business that does not receive customers at its address should not present that address as a staffed storefront. Virtual offices and borrowed addresses can create customer and policy problems.",
          "Google’s current guidance says service areas are entered as cities, postal codes, or other areas rather than a radius. Keep them specific and realistic. Listing a huge region does not mean the business will rank equally across it or can serve it well.",
        ],
        callout:
          "Represent where customers can actually visit and where the team can actually provide service.",
      },
      {
        id: "hours-contact-links",
        heading: "Mistake 4: Letting hours, phone numbers, or links go stale",
        paragraphs: [
          "Incorrect hours waste a customer’s time and erode trust. Update regular hours, special hours, temporary closures, and seasonal changes before customers discover the mistake. Use a location-specific phone number or another number that reaches the business’s authorized team.",
          "The website link should lead to a current, secure, mobile-friendly destination that matches the location or business represented. Test campaign and booking links from the customer’s point of view.",
        ],
        bullets: [
          "Check regular and special hours before holidays.",
          "Call the published phone number from outside the business.",
          "Open every profile link on a phone.",
          "Confirm appointment or ordering links still work.",
          "Remove outdated tracking links when campaigns end.",
        ],
      },
      {
        id: "ownership-and-duplicates",
        heading: "Mistake 5: Losing control of ownership and duplicate profiles",
        paragraphs: [
          "Profile ownership should stay with the business, with managers added through their own accounts. Shared passwords, former employees, or an agency as the only owner create avoidable risk.",
          "Maintain a simple access record with the primary owner, managers, recovery information, and review dates. Investigate suspected duplicates carefully before requesting a merge or removal; two profiles may represent different legitimate locations or departments.",
        ],
      },
      {
        id: "thin-customer-information",
        heading: "Mistake 6: Publishing thin or inconsistent customer information",
        paragraphs: [
          "A profile should help customers understand the business. Use accurate services, a useful description, representative photos, and relevant attributes where available. Avoid stuffing the description with promotions or vague claims.",
          "Photos should reflect the real location, team, products, vehicles, or completed work. Keep customer privacy, permissions, and industry rules in mind. Replace misleading or outdated imagery rather than treating photo volume as a ranking tactic.",
        ],
      },
      {
        id: "reviews-and-performance",
        heading: "Mistake 7: Ignoring reviews or reading metrics without context",
        paragraphs: [
          "Reviews deserve a consistent, policy-aware request and response process. Do not buy reviews or offer incentives. Respond without exposing private customer details, and route sensitive issues to a direct conversation.",
          "Business Profile performance can include views, searches, website clicks, call-button clicks, directions, and other interactions that apply to the profile. These are useful signals, but they are not the same as completed calls, store visits, qualified leads, or revenue. Compare them with the business’s own records.",
          "Document the reporting period and definitions. A change in profile interaction should prompt a question, not an unsupported claim about business impact.",
        ],
      },
    ],
    checklistTitle: "Monthly Business Profile audit",
    checklist: [
      "Confirm the business owns the profile and manager access is current.",
      "Verify the name matches real-world branding.",
      "Review the primary and secondary categories for accuracy.",
      "Confirm address or service area matches how the business operates.",
      "Update regular, holiday, seasonal, and special hours.",
      "Test phone, website, booking, ordering, and appointment links.",
      "Review services, description, attributes, and current photos.",
      "Respond to recent reviews and investigate recurring themes.",
      "Check for unauthorized edits or potential duplicate profiles.",
      "Compare profile interactions with calls, forms, visits, and lead records.",
    ],
    closing:
      "A useful Business Profile is accurate, owned, maintained, and connected to the real customer experience. Solve those fundamentals before chasing tactics, and review them often enough that customers are not the first people to find a mistake.",
    officialReferences: [
      {
        label: "Google Business Profile Help: Guidelines for representing your business",
        href: "https://support.google.com/business/answer/3038177?hl=en",
      },
      {
        label: "Google Business Profile Help: Manage your business category",
        href: "https://support.google.com/business/answer/7249669?hl=en",
      },
      {
        label: "Google Business Profile Help: Manage service areas",
        href: "https://support.google.com/business/answer/9157481?hl=en",
      },
      {
        label: "Google Business Profile Help: Understand profile performance",
        href: "https://support.google.com/business/answer/9918094?hl=en",
      },
    ],
    related: [
      {
        label: "Google Business Profile management",
        href: "/services#google-business-profile",
        description: "See how cleanup, updates, and performance review fit into ongoing support.",
      },
      {
        label: "Local SEO",
        href: "/services#local-seo",
        description: "Connect accurate profile information with useful website and local-search work.",
      },
      {
        label: "How to rank higher in Google Maps",
        href: "/resources/rank-higher-google-maps",
        description: "Put profile accuracy into the wider relevance, distance, and prominence picture.",
      },
    ],
  },
  "marketing-metrics-to-track": {
    slug: "marketing-metrics-to-track",
    category: "Lead Tracking",
    title: "What local businesses should track from their marketing",
    shortTitle: "Local marketing metrics to track",
    description:
      "Build a plain-language local marketing scorecard around visibility, website actions, calls, qualified leads, reviews, costs, and attribution limits.",
    summary:
      "Focus reporting on calls, qualified leads, forms, direction requests, and other signals that connect marketing work to actual customer activity.",
    takeaway: "Build a short scorecard your team can understand at a glance.",
    readTime: "10 minute read",
    published: "2026-07-16",
    updatedLabel: "Updated July 16, 2026",
    introduction: [
      "Local-business reporting becomes confusing when every platform presents its own scoreboard. Impressions, clicks, profile views, calls, forms, appointments, quotes, and sales all describe different moments in the customer journey.",
      "A useful scorecard connects those moments without pretending the data is perfect. Start with the business outcome, work backward to the customer actions that precede it, and define what each source can actually measure.",
      "The goal is not a larger dashboard. It is a shorter, more trustworthy conversation about what happened and what to do next.",
    ],
    sections: [
      {
        id: "measurement-chain",
        heading: "Use a simple measurement chain",
        paragraphs: [
          "Organize the report into four levels: visibility, engagement, inquiry, and business outcome. Visibility shows whether people had a chance to find the business. Engagement shows whether they took a meaningful next step. Inquiry records the call, form, message, booking, or visit signal. Business outcome records whether the opportunity was qualified and what happened next.",
          "Do not collapse the levels. A website click is not a lead. A call-button click is not proof that a completed call occurred. A form submission is not automatically a good customer. A lead is not revenue until the business’s records support that connection.",
        ],
        bullets: [
          "Visibility: search appearances, map visibility, profile or page views.",
          "Engagement: website clicks, service-page visits, directions, call-button clicks.",
          "Inquiry: completed calls, forms, messages, bookings, counter conversations.",
          "Outcome: qualified opportunity, quote, appointment, sale, or another approved result.",
        ],
      },
      {
        id: "business-profile-metrics",
        heading: "Track Business Profile interactions with context",
        paragraphs: [
          "Google Business Profile performance can show metrics such as views, searches, website clicks, call-button clicks, directions, and bookings where they apply. Availability varies by profile and feature.",
          "Record the date range and compare like periods. Note major changes to hours, categories, website links, advertising, seasonality, or demand. Pair profile interactions with phone, website, scheduling, and sales records rather than treating platform activity as a completed customer outcome.",
        ],
        callout:
          "Use platform metrics as signals. Use business records to decide whether those signals became useful customer activity.",
      },
      {
        id: "website-metrics",
        heading: "Measure website paths, not traffic alone",
        paragraphs: [
          "Website traffic matters when the right people reach useful pages. Track entry pages, service and location paths, important button clicks, form starts, completed forms, booking actions, and phone-link taps. Separate paid, organic, referral, direct, and campaign sources where the data is reliable.",
          "Look for friction. A service page with many visits but few actions may need clearer information or proof. A form with many starts but few completions may ask too much. A page with fewer visits but a high share of qualified inquiries may deserve more attention.",
          "Consent settings, browser privacy, cross-device behavior, and offline actions can create gaps. Report the gap instead of filling it with an estimate presented as fact.",
        ],
      },
      {
        id: "calls-and-leads",
        heading: "Separate calls and leads by quality",
        paragraphs: [
          "Count completed calls when the tracking setup supports it, then classify a manageable sample by service fit, location fit, urgency, new or existing customer, and outcome. The business should define a qualified opportunity in plain language.",
          "Missed calls, voicemail, spam, vendor calls, wrong numbers, existing-customer service, and new sales opportunities should not all be treated the same. A smaller number of well-matched calls can be more valuable than a larger unqualified volume.",
          "Respect applicable consent and recording requirements when using call tracking. Limit access to the people who need it and document how data is retained.",
        ],
      },
      {
        id: "reviews-and-reputation",
        heading: "Track review health beyond the star average",
        paragraphs: [
          "Useful reputation metrics include new review volume, recency, rating distribution, response consistency, response time, and recurring customer themes. Compare requests sent with reviews received if the business owns that workflow.",
          "Do not use the average rating as the only trust measure. Detailed recent feedback and thoughtful responses can give customers more useful context. Never promise a perfect rating or offer incentives for reviews.",
        ],
      },
      {
        id: "cost-and-outcomes",
        heading: "Add cost and sales outcomes carefully",
        paragraphs: [
          "For paid programs, record platform spend separately from management fees and production costs. Where the business can connect leads to outcomes, calculate cost per qualified opportunity and cost per approved sale—not only cost per click or raw lead.",
          "Revenue attribution requires dependable business records and agreed rules. A customer may see a vehicle, ask a neighbor, search the business name, visit the site, and call later. Use the strongest evidence available, identify the attribution model, and state its limits.",
          "Marketing performance can also be affected by answer rate, speed to follow-up, quoting, inventory, staffing, service capacity, price, and seasonality. Reporting should create a shared business question rather than assign every outcome to one channel.",
        ],
      },
      {
        id: "monthly-scorecard",
        heading: "Build a one-page monthly scorecard",
        paragraphs: [
          "Choose a small set of measures tied to the current goal. Show the current period, a useful comparison, the definition, the data source, and a short note about context. Finish with one to three actions rather than a list of everything that moved.",
          "A contractor might track priority local visibility, relevant service-page visits, completed calls, qualified estimates, missed-call rate, and new reviews. A dealership might add product inquiries, direction requests, service calls, and inventory-page engagement. The scorecard should reflect the business model.",
        ],
        bullets: [
          "Business goal for the period.",
          "Five to eight defined measures.",
          "Current result and useful comparison.",
          "Source and known data limits.",
          "What likely influenced the result.",
          "The next focused action and its owner.",
        ],
      },
    ],
    checklistTitle: "Local marketing measurement checklist",
    checklist: [
      "Write the business goal before choosing platform metrics.",
      "Define visibility, engagement, inquiry, and outcome separately.",
      "Name the source and owner for every measure.",
      "Track completed calls and forms, not only button clicks.",
      "Create a plain-language definition of a qualified lead.",
      "Review missed calls and response time alongside lead volume.",
      "Track review recency, distribution, responses, and themes.",
      "Separate ad spend, management, and production costs.",
      "State attribution and data-quality limits clearly.",
      "End each report with a small number of owned next actions.",
    ],
    closing:
      "Good measurement does not remove uncertainty. It makes the uncertainty visible, connects activity to the best available business evidence, and helps the team choose a better next move.",
    officialReferences: [
      {
        label: "Google Business Profile Help: Understand profile performance",
        href: "https://support.google.com/business/answer/9918094?hl=en",
      },
    ],
    related: [
      {
        label: "Call and lead tracking",
        href: "/services#lead-tracking",
        description: "See how source tracking and lead-quality definitions fit together.",
      },
      {
        label: "Results and measurement",
        href: "/results",
        description: "Explore Hometown Boost’s framework for turning activity into a useful question.",
      },
      {
        label: "Pricing and plan scope",
        href: "/pricing",
        description: "Understand where tracking and reporting may fit within a support plan.",
      },
    ],
  },
  "equipment-dealer-website": {
    slug: "equipment-dealer-website",
    category: "Equipment Dealer Marketing",
    title: "What equipment dealers need from a modern website",
    shortTitle: "A modern equipment dealer website",
    description:
      "Plan an equipment dealer website around inventory, product detail, financing, parts and service, locations, mobile inquiries, and lead measurement.",
    summary:
      "Explore inventory discovery, brand and category paths, financing clarity, service visibility, location content, and easy ways for buyers to start a conversation.",
    takeaway: "Make the path from product research to dealer contact feel effortless.",
    readTime: "11 minute read",
    published: "2026-07-16",
    updatedLabel: "Updated July 16, 2026",
    introduction: [
      "Equipment buyers often research long before they call or visit. They compare brands, categories, models, condition, attachments, financing information, parts support, service capability, and distance from the dealership.",
      "A modern dealer website should make that research easier without pretending the online listing replaces a knowledgeable conversation. It should help the shopper find a relevant machine, understand the dealership’s support, and reach the right person with useful context.",
      "The exact feature set depends on inventory systems, brands, locations, staff, and sales process. Start with the customer paths the dealership can maintain reliably.",
    ],
    sections: [
      {
        id: "customer-paths",
        heading: "Organize around the way buyers shop",
        paragraphs: [
          "A homepage grid of logos is not an inventory strategy. Buyers may begin with a task, equipment type, brand, model, condition, price range, horsepower, attachment, or availability question. Build navigation around the strongest real paths.",
          "Use plain category names, useful filters, and clear breadcrumbs. Keep new, used, rental, parts, and service paths distinct where the dealership offers them. Make it easy to return to a comparison or contact a location without losing the current product context.",
        ],
        bullets: [
          "Equipment category and use case.",
          "Brand and model family.",
          "New, used, rental, or available soon.",
          "Location or realistic delivery area.",
          "Parts, service, attachments, and support.",
        ],
      },
      {
        id: "inventory-detail",
        heading: "Make inventory detail trustworthy and useful",
        paragraphs: [
          "A listing should answer the questions the sales team hears repeatedly. Use accurate model information, stock or unit identifier, condition, hours where relevant, included attachments, important specifications, location, availability language, and current photos of the actual unit when possible.",
          "Avoid publishing an item as available when the feed is stale. If availability changes quickly, explain that clearly and offer a way to confirm. Mark sold inventory appropriately and decide whether useful sold pages remain as examples or redirect to the closest current alternative.",
          "Provide a descriptive inquiry action such as “Ask about this unit” rather than a generic “Submit.” Pass the unit identifier and page URL into the lead record so the customer does not have to repeat what they were viewing.",
        ],
      },
      {
        id: "brand-and-category-pages",
        heading: "Support inventory with durable brand and category pages",
        paragraphs: [
          "Inventory changes. Useful category, brand, and model-family pages give shoppers a stable place to learn what the dealership carries, who the equipment fits, what support is available, and how to talk with the team.",
          "Do not publish hundreds of thin combinations just because a filter exists. Prioritize pages with real inventory, customer demand, distinct information, and a reason to remain useful when individual units sell.",
          "Include real dealership knowledge: selection guidance, common applications, compatible attachments, service considerations, and questions to bring to the sales conversation. Keep manufacturer specifications accurate and respect brand requirements.",
        ],
      },
      {
        id: "financing-trade-delivery",
        heading: "Explain financing, trade-ins, and delivery without overpromising",
        paragraphs: [
          "Buyers need to know whether financing, leasing, trade-ins, delivery, and demos may be available. Explain the process and required next step in plain language. Avoid publishing payment examples or approval claims that are not reviewed, current, and accompanied by appropriate terms.",
          "A trade-in form should collect enough information for a useful first review without becoming an inspection report. A delivery section should describe the practical coverage and quote process instead of implying every machine can be delivered everywhere at one fixed cost.",
        ],
      },
      {
        id: "parts-service",
        heading: "Give parts and service equal visibility",
        paragraphs: [
          "Parts and service relationships can be a major reason a buyer chooses one dealer over another. Make department hours, phone numbers, location, appointment or request path, supported brands, and service capabilities easy to find.",
          "Route parts, service, warranty, rental, and sales inquiries to the right team. A single general form may create slow follow-up and poor reporting. If online parts lookup or ordering exists, explain its coverage and provide help when a customer does not know the exact part number.",
        ],
        bullets: [
          "Department-specific contact options.",
          "Supported brands and equipment types.",
          "Service-area or pickup expectations.",
          "Appointment or request process.",
          "Emergency, mobile, or seasonal services only when actually offered.",
        ],
      },
      {
        id: "location-and-mobile",
        heading: "Build each location and mobile path for action",
        paragraphs: [
          "Each legitimate dealership location should have accurate hours, address, phone, departments, brands, inventory context, and directions. Avoid copying one generic paragraph across locations when the actual capabilities differ.",
          "On mobile, inventory images, filters, specifications, and contact buttons must stay usable. Keep tap targets comfortable, avoid blocking the product with pop-ups, and make the selected unit visible in the inquiry experience.",
          "Test the path during busy periods and from weak mobile connections. Large image galleries and third-party inventory widgets can create delays that do not show up on an office desktop.",
        ],
      },
      {
        id: "dealer-measurement",
        heading: "Measure the journey from research to dealership conversation",
        paragraphs: [
          "Track inventory and category-page engagement, unit inquiries, calls, directions, parts and service requests, financing or trade-in starts, and the source attached to each lead where practical. Ask the sales and service teams which inquiries are useful and which information was missing.",
          "Inventory shoppers may return several times and use more than one channel. Treat attribution carefully. A tracked form can show a clear website action; it may not capture the earlier ad, manufacturer site, referral, or offline interaction that influenced the decision.",
          "Use the data to improve the path: better filters, clearer listings, stronger department routing, faster follow-up, and more useful durable content. Do not promise a specific lead or sales result from a website feature alone.",
        ],
      },
    ],
    checklistTitle: "Equipment dealer website checklist",
    checklist: [
      "Define durable paths by category, brand, condition, and location.",
      "Keep inventory availability and unit details accurate.",
      "Use real unit photos and clear condition information where possible.",
      "Pass the unit identifier into calls, forms, and lead records.",
      "Build useful category and brand pages that remain valuable as inventory changes.",
      "Explain financing, trade-in, demo, and delivery processes carefully.",
      "Give parts and service their own visible, correctly routed paths.",
      "Publish accurate department information for every legitimate location.",
      "Test inventory, filters, galleries, and inquiry actions on mobile.",
      "Review lead quality with sales, parts, and service teams.",
    ],
    closing:
      "A strong equipment dealer website respects the research buyers want to do and the human expertise they still need. Make inventory understandable, support easy to find, and every inquiry easier for the right dealership team to continue.",
    officialReferences: [],
    related: [
      {
        label: "Equipment dealers",
        href: "/industries#equipment-dealers",
        description: "See the wider customer journey and marketing priorities for equipment dealerships.",
      },
      {
        label: "Website design",
        href: "/services#website-design",
        description: "Explore conversion-focused website structure and ongoing content support.",
      },
      {
        label: "Call and lead tracking",
        href: "/services#lead-tracking",
        description: "Connect unit, parts, service, and location inquiries to useful source context.",
      },
    ],
  },
  "contractor-local-search": {
    slug: "contractor-local-search",
    category: "Contractor Marketing",
    title: "How contractors can improve local search visibility",
    shortTitle: "Improve contractor local search visibility",
    description:
      "Build a contractor local-search plan with accurate business information, service pages, project proof, reviews, lead routing, and honest measurement.",
    summary:
      "Connect service pages, project proof, service-area content, reviews, and a strong Google presence so nearby customers can find the right help faster.",
    takeaway: "Create a search footprint that matches how customers describe the work.",
    readTime: "10 minute read",
    published: "2026-07-16",
    updatedLabel: "Updated July 16, 2026",
    introduction: [
      "Contractor searches are specific. Customers describe a problem, project, trade, service, material, urgency, or town. They compare proof, reviews, service area, responsiveness, and whether the business seems equipped for the work.",
      "Improving local visibility means representing the business accurately across Google and the web, then building useful pages that match the work the contractor wants and can serve. It does not mean publishing hundreds of nearly identical town pages or forcing keywords into every sentence.",
      "The plan below connects discovery, trust, conversion, and measurement without promising a guaranteed ranking or lead volume.",
    ],
    sections: [
      {
        id: "priority-services",
        heading: "Start with priority services and real capacity",
        paragraphs: [
          "List the services the contractor wants more of, the jobs that are a good fit, and the areas the team can serve profitably. Separate urgent repair, planned project, maintenance, inspection, installation, replacement, and specialty work where the customer journey differs.",
          "Choose a manageable first set. A clear page for a high-value service is more useful than a shallow list of every task the crew has ever performed. Coordinate the plan with seasonality, crews, inventory, licensing, scheduling, and follow-up capacity.",
        ],
        bullets: [
          "Which services are priorities now?",
          "What job size or type is a strong fit?",
          "Where can crews respond reliably?",
          "Which services require urgent calls versus planned estimates?",
          "What proof can the business publish with permission?",
        ],
      },
      {
        id: "business-profile",
        heading: "Represent the business accurately on Google",
        paragraphs: [
          "Use the real-world business name, an accurate primary category, current phone and website, correct hours, and the address or service-area setup that matches how the business operates. Google’s guidance says service-area businesses that do not serve customers at their address should remove the public address and use service areas instead.",
          "Keep the selected service areas realistic. Google’s current profile tool uses cities, postal codes, or other defined areas rather than a radius. A larger list does not create equal visibility across the region and can set the wrong customer expectation.",
          "Review profile services, photos, and customer-facing details regularly. Use real project and team imagery with permission. Avoid adding town or service keywords to the business name when they are not part of the actual brand.",
        ],
      },
      {
        id: "service-pages",
        heading: "Create useful pages for the work customers seek",
        paragraphs: [
          "A service page should explain the problem or project, the business’s approach, what may be included, who the service fits, important process or timing expectations, the coverage area, and the next step. Use the customer’s language naturally in the title, H1, body, links, and relevant image descriptions.",
          "Show differences that matter. Roof repair and replacement have different decisions. Emergency plumbing and a planned remodel have different urgency. Residential and commercial work may need different proof and qualification.",
          "Google’s Search Essentials recommends helpful, reliable, people-first content. Write pages that help a customer choose, not pages created only to repeat a phrase.",
        ],
        callout:
          "A service page earns its place when it answers a real customer question and supports a real service the contractor can deliver.",
      },
      {
        id: "location-content",
        heading: "Use location content only when it adds local value",
        paragraphs: [
          "Location pages can be useful when a contractor has legitimate offices, distinct crews, meaningful market differences, or enough local experience to provide specific information. They become weak when the only change is a town name.",
          "A useful service-area page may include services offered there, relevant project examples, local building or scheduling considerations the contractor is qualified to discuss, travel or response expectations, and customer proof from that area used with permission.",
          "Do not claim an office where none exists or imply instant coverage across an area the team cannot support. Keep website coverage consistent with the Business Profile and sales process.",
        ],
      },
      {
        id: "proof-and-reviews",
        heading: "Turn real work into useful proof",
        paragraphs: [
          "Project photos, before-and-after context, service explanations, licenses or credentials where appropriate, and customer reviews can reduce uncertainty. Obtain permission and avoid revealing a customer’s address, personal details, or sensitive information.",
          "Ask customers for honest Google reviews through a consistent workflow after a meaningful service milestone. Do not offer incentives or selectively route only expected positive reviewers to Google. Respond thoughtfully and use recurring themes to improve operations and website copy.",
          "A project story does not need an inflated result. Explain the starting problem, constraints, work completed, and what the customer approved for publication.",
        ],
      },
      {
        id: "mobile-and-leads",
        heading: "Make mobile contact and lead routing dependable",
        paragraphs: [
          "Contractor customers often search from a phone. Put the service, coverage, proof, and next step where they can find them quickly. Make numbers tappable, forms short enough for the situation, and emergency instructions clear only when the business truly offers emergency response.",
          "Route inquiries by service, area, urgency, and preferred contact method. Test every form and published number. Assign ownership for missed calls, after-hours messages, and estimate follow-up.",
          "The website cannot compensate for a lead path nobody monitors. Track response time and missed-call patterns alongside search and conversion performance.",
        ],
      },
      {
        id: "contractor-measurement",
        heading: "Measure qualified opportunities, not ranking alone",
        paragraphs: [
          "Track priority local visibility, Business Profile interactions, service-page visits, completed calls and forms, direction requests where relevant, and new reviews. Then classify inquiries by service fit, location fit, urgency, job size, and outcome.",
          "Compare meaningful periods and note weather, seasonality, storm events, advertising, staffing, price changes, and service capacity. These factors can move calls and lead quality even when search visibility is stable.",
          "No provider can guarantee a particular organic or Maps ranking. Use ranking as one discovery signal and qualified opportunities as the stronger business conversation.",
        ],
      },
    ],
    checklistTitle: "Contractor local-search checklist",
    checklist: [
      "Choose priority services, job types, and profitable service areas.",
      "Confirm Business Profile name, category, hours, phone, website, and location setup.",
      "Create substantial pages for the services customers actually seek.",
      "Publish location content only when it offers real local value.",
      "Add approved project photos, process details, and customer proof.",
      "Build a genuine, non-incentivized review request workflow.",
      "Make calls and forms easy to complete on a phone.",
      "Route leads by service, area, urgency, and ownership.",
      "Track completed inquiries and qualified opportunities, not only clicks.",
      "Review seasonality, capacity, and follow-up alongside marketing data.",
    ],
    closing:
      "Contractor visibility improves when the business is represented accurately, the website matches real customer needs, and the lead path works after the click. Build those pieces in priority order and measure the opportunities the team can actually serve.",
    officialReferences: [
      {
        label: "Google Business Profile Help: Guidelines for representing your business",
        href: "https://support.google.com/business/answer/3038177?hl=en",
      },
      {
        label: "Google Business Profile Help: Manage service areas",
        href: "https://support.google.com/business/answer/9157481?hl=en",
      },
      {
        label: "Google Search Central: Search Essentials",
        href: "https://developers.google.com/search/docs/essentials",
      },
      {
        label: "Google Business Profile Help: Tips to get more reviews",
        href: "https://support.google.com/business/answer/3474122?hl=en",
      },
    ],
    related: [
      {
        label: "Contractors",
        href: "/industries#contractors",
        description: "See how Hometown Boost approaches the contractor customer journey.",
      },
      {
        label: "Local SEO",
        href: "/services#local-seo",
        description: "Explore service pages, location relevance, technical upkeep, and measurement.",
      },
      {
        label: "How to rank higher in Google Maps",
        href: "/resources/rank-higher-google-maps",
        description: "Understand the wider local-ranking framework and controllable inputs.",
      },
    ],
  },
} satisfies Record<string, ResourceArticle>;

export const starterArticles = Object.values(resourceArticles);

export const plannedResources = [
  {
    slug: "local-ads-ready-to-scale",
    category: "Advertising",
    title: "How to know when local ads are ready to scale",
    summary:
      "Before increasing spend, check the offer, landing experience, follow-up process, lead quality, and tracking needed to make paid traffic accountable.",
    takeaway: "Strengthen the system behind the ad before paying for more clicks.",
  },
  {
    slug: "monthly-marketing-scorecard",
    category: "Small-Business Growth",
    title: "A simple monthly local-marketing scorecard",
    summary:
      "Bring visibility, engagement, leads, reviews, and follow-up into one plain-language monthly check-in that keeps decisions focused on progress.",
    takeaway: "Leave each review with one clear priority for the next month.",
  },
] as const;
