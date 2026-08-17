import type { Config } from "tailwindcss";
import aoTokens from "../design-tokens/tailwind.ao.config";

/**
 * Compatibility adapter for tooling that still reads a Tailwind config file.
 * Tailwind v4 consumes the semantic bridge in client/src/index.css, while this
 * adapter keeps the same AO theme available to editor tooling and utilities.
 */
const config: Config = {
  ...aoTokens,
  content: ["./client/index.html", "./client/src/**/*.{ts,tsx}"],
};

export default config;
