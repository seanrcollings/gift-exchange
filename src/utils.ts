import type { GiftExchangeConfig } from "./gift-exchange";

function hash(input: string): number {
  let hash = 0;

  for (let i = 0; i < input.length; i++) {
    const char = input.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash = hash & hash; // Convert to 32-bit integer
  }

  return Math.abs(hash);
}

const colors = [
  "gold",
  "bronze",
  "brown",
  "yellow",
  "amber",
  "orange",
  "tomato",
  "red",
  "ruby",
  "crimson",
  "pink",
  "plum",
  "purple",
  "violet",
  "iris",
  "indigo",
  "blue",
  "cyan",
  "teal",
  "jade",
  "green",
  "grass",
  "lime",
  "mint",
  "sky",
] as const;

export type Color = (typeof colors)[number];

export function getColor(input: string): Color {
  const inputHash = hash(input);
  const colorIndex = inputHash % colors.length;
  return colors[colorIndex];
}

export function encodeBase64Url(config: GiftExchangeConfig): string {
  const json = JSON.stringify(config);
  const base64 = btoa(json);
  return encodeURIComponent(base64);
}

export function decodeBase64Url(data: string): GiftExchangeConfig | null {
  try {
    const base64 = decodeURIComponent(data);
    const json = atob(base64);
    const config = JSON.parse(json) as GiftExchangeConfig;
    return config;
  } catch {
    return null;
  }
}
