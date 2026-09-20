import packageJson from "../../package.json";

const currentYear = new Date().getFullYear();

export const APP_CONFIG = {
  name: "Kalo Systems",
  version: packageJson.version,
  copyright: `© ${currentYear}, Kalo Systems Inc. All rights reserved.`,
  meta: {
    title: "Kalo Systems: AI Client Acquisition & Financial OS",
    description:
      "Kalo Systems AI Client Acquisition Dashboard with sub-45s Speed-to-Lead AI calling, CASL Compliance Shield, and Paperclip AI Agent Fleet.",
  },
};
