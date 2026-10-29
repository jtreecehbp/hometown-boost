/** Live client websites shown as real work. Screenshots live in /public/images/work/. */
export type Project = {
  name: string;
  category: string;
  url: string;
  copy: string;
  /** File stem for `<stem>-desktop.webp` and `<stem>-phone.webp`. */
  shot: string;
};

export const projects: Project[] = [
  {
    name: "Bobby’s Cycle Works",
    category: "Equipment & dealership",
    url: "https://bobbyscycleworks.com/",
    copy: "A searchable inventory, individual equipment pages, and clear paths to contact the shop.",
    shot: "bobbys-cycle-works",
  },
  {
    name: "Star Septic Services",
    category: "Home & commercial services",
    url: "https://starsepticservice.com/",
    copy: "Service and area pages, prominent calling options, and a straightforward service-request path.",
    shot: "star-septic-services",
  },
];
