/**
 * @file how-to-schema.js
 * @description Generates validated HowTo Schema.org JSON-LD to force Google to render
 * expandable step accordions and rich snippet carousels under SERP listings.
 */

import { siteConfig } from "../../config/site.js";

const BASE_URL = (siteConfig.url || "https://www.bitsandtools.com").replace(/\/$/, "");

/**
 * Default step sequences for core categories
 */
const DEFAULT_HOWTO_STEPS = {
  pdf: [
    {
      name: "Select or Drop Files",
      text: "Drag and drop your PDF documents into the secure in-browser upload container or click 'Choose Files'.",
    },
    {
      name: "Configure & Arrange Options",
      text: "Reorder pages, select custom page ranges, or configure structural compression parameters in local memory.",
    },
    {
      name: "Process & Instant Download",
      text: "Execute the client-side operation with zero server uploads and download your processed document immediately.",
    },
  ],
  image: [
    {
      name: "Upload Image Files",
      text: "Select your JPG, PNG, or WebP photos directly from your device into the canvas workspace.",
    },
    {
      name: "Set Dimensions & Format",
      text: "Choose page size, crop ratios, margin dimensions, or target file size using interactive controls.",
    },
    {
      name: "Compile & Export",
      text: "Render output via HTML5 Canvas and download your formatted file with zero cloud latency.",
    },
  ],
  utility: [
    {
      name: "Paste Input Data",
      text: "Paste your raw text, JSON, code, or payload into the input editor.",
    },
    {
      name: "Apply Formatting or Action",
      text: "Select your desired operation: minify, format, decode, or validate in real-time.",
    },
    {
      name: "Copy or Export Output",
      text: "One-click copy the clean result to your clipboard or download as a file.",
    },
  ],
};

/**
 * Builds validated HowTo Schema.org structure
 * 
 * @param {object} params
 * @param {string} params.toolName - Name of the tool (e.g. "Merge PDF")
 * @param {string} params.route - Relative route (e.g. "/merge-pdf")
 * @param {string} [params.description] - Description of the how-to workflow
 * @param {Array<{ name: string, text: string }>} [params.steps] - Custom steps array
 * @param {string} [params.category="pdf"] - Tool category ("pdf" | "image" | "utility")
 * @returns {object} HowTo Schema JSON-LD object
 */
export function buildHowToSchema({
  toolName,
  route,
  description = null,
  steps = null,
  category = "pdf",
}) {
  const normalizedRoute = route.startsWith("/") ? route : `/${route}`;
  const fullUrl = `${BASE_URL}${normalizedRoute}`;
  const howToId = `${fullUrl}/#howto`;

  const effectiveSteps = steps || DEFAULT_HOWTO_STEPS[category] || DEFAULT_HOWTO_STEPS.pdf;

  const howToSteps = effectiveSteps.map((s, idx) => ({
    "@type": "HowToStep",
    position: idx + 1,
    name: s.name,
    text: s.text,
    url: `${fullUrl}/#step-${idx + 1}`,
  }));

  return {
    "@type": "HowTo",
    "@id": howToId,
    name: `How to ${toolName} Online (Step-by-Step)`,
    description:
      description ||
      `Learn how to ${toolName.toLowerCase()} directly inside your web browser in 3 easy steps with zero server file uploads and 100% privacy.`,
    totalTime: "PT1M",
    estimatedCost: {
      "@type": "MonetaryAmount",
      currency: "USD",
      value: "0",
    },
    supply: [],
    tool: [
      {
        "@type": "HowToTool",
        name: `Bits & Tools ${toolName} In-Browser Engine`,
      },
    ],
    step: howToSteps,
  };
}
