import type { ImageKey } from "./images"

export type Compound = "soft" | "medium" | "hard"

/** Livery graphic, loosely tied to each project (see three/car/liveryArt.ts). */
export type LiveryPattern = "qr" | "ribbon" | "split" | "chart" | "facets" | "network" | "candles" | "pitch"

export type Livery = {
  /** main bodywork colour (taken from the project's brand colour) */
  primary: string
  /** wings, halo, helmet, endplates */
  secondary: string
  /** small highlights: slot glow, UI accents */
  accent: string
  /** colour of the sponsor text painted on the bodywork */
  decal: string
  finish: "gloss" | "metallic" | "satin"
  compound: Compound
  pattern: LiveryPattern
}

export type FigureImage = {
  image: ImageKey
  alt: string
  caption?: string
}

export type TreeNode = {
  label: string
  children?: TreeNode[]
}

export type DefinitionItem = {
  term: string
  detail: string | string[]
}

export type StepItem = {
  label: string
  title: string
  detail: string | string[]
}

export type ScreenItem = {
  title: string
  points: string[]
  note?: string
  image: ImageKey
  alt: string
}

export type CardList = {
  title?: string
  items: string[]
}

export type CardItem = {
  title: string
  intro?: string
  lists: CardList[]
}

export type Fact = {
  label: string
  value: string
}

export type FeedbackItem = {
  title: string
  points: string[]
  image: ImageKey
  alt: string
}

export type Block = {
  type: "p"
  text: string
} | {
  type: "lead"
  text: string
} | {
  type: "list"
  title?: string
  items: string[]
} | {
  type: "defs"
  items: DefinitionItem[]
} | {
  type: "steps"
  items: StepItem[]
} | {
  type: "chips"
  items: string[]
} | {
  type: "figure"
  tone?: "light" | "dark"
  size?: "wide" | "content"
  caption?: string
  image: ImageKey
  alt: string
} | {
  type: "gallery"
  tone?: "light" | "dark"
  columns?: 2 | 3
  images: FigureImage[]
} | {
  type: "tree"
  title?: string
  nodes: TreeNode[]
} | {
  type: "screens"
  tone?: "light" | "dark"
  items: ScreenItem[]
} | {
  type: "cards"
  items: CardItem[]
} | {
  type: "persona"
  name: string
  quote: string
  image: FigureImage
  facts: Fact[]
  traits: string[]
  about: string
  groups: CardList[]
  brands?: FigureImage
} | {
  type: "feedback"
  items: FeedbackItem[]
} | {
  type: "quote"
  text: string
}

export type Section = {
  id: string
  title: string
  blocks: Block[]
}

export type CaseStudy = {
  slug: string
  /** grid slot, 1 = pole position */
  position: number
  /** three-letter driver code on timing screens */
  code: string
  /** fictional formula car/model name */
  name: string
  driverName: string
  /** text painted on the car; defaults to the name */
  decalName?: string
  year: number
  season: string
  summary: string
  role: string
  duration: string
  industry: string
  platform: string
  tags: string[]
  thumb: ImageKey
  cover: ImageKey
  coverAlt: string
  livery: Livery
  sections: Section[]
}
