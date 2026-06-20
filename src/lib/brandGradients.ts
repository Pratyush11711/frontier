/** Frontier brand linear gradients (§4.3) — top to bottom */
export const brandGradients = {
  slateDeep: "linear-gradient(180deg, #4a5568 0%, #000000 100%)",
  tealDeep: "linear-gradient(180deg, #2d7a8a 0%, #051a1a 100%)",
  pacificDeep: "linear-gradient(180deg, #0d717b 0%, #021a24 100%)",
  pinkPeriwinkle: "linear-gradient(180deg, #fce4ec 0%, #7986cb 100%)",
  peachPurple: "linear-gradient(180deg, #ffccbc 0%, #673ab7 100%)",
  orangeBurnt: "linear-gradient(180deg, #ffb74d 0%, #bf360c 100%)",
  whiteBlush: "linear-gradient(180deg, #ffffff 0%, #f9f1f1 100%)",
} as const;

export type BrandGradientKey = keyof typeof brandGradients;
