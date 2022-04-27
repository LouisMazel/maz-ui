import LINK_BASE from "./linkBase";

export default [
  { charset: "utf-8" },
  {
    name: "viewport",
    content:
      "width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=0",
  },
  {
    hid: "robots",
    name: "robots",
    content: "index, follow",
  },
  { name: "msapplication-TileColor", content: "#2d89ef" },
  {
    name: "msapplication-config",
    content: `${LINK_BASE}icons/browserconfig.xml`,
  },
  { name: "theme-color", content: "#ffffff" },
  // Facebook & Linkedin
  { property: "og:site_name", content: "Maz UI" },
  { property: "og:type", content: "website" },
  // twitter
  { name: "twitter:card", content: "summary_large_image" },
  { name: "twitter:creator", content: "@mazeel" },
  { name: "twitter:site", content: "@maz__ui" },
  {
    hid: "description",
    name: "description",
    content:
      "Build your amazing interfaces with Maz UI and its stand-alone components - Stand-alone components library for Vue.JS & Nuxt.JS (v2.x)",
  },
];
