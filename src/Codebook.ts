// Theme definitions for scoring transcripts. Each pattern is matched
// case-insensitively. Keep phrases specific: single generic words like
// "focus" or "health" match far too much ordinary conversation.

export type ThemeGroup = "business" | "mindset" | "health" | "life";

export type Theme = Readonly<{
  id: string;
  label: string;
  group: ThemeGroup;
  // True for themes from the original hypothesis, false for ones added to test it.
  predicted: boolean;
  patterns: readonly RegExp[];
}>;

const p = (source: string): RegExp => new RegExp(`\\b(?:${source})\\b`, "gi");

export const CODEBOOK: readonly Theme[] = [
  {
    id: "consistency",
    label: "Consistency and showing up daily",
    group: "mindset",
    predicted: true,
    patterns: [
      p("consisten(?:cy|t|tly)"),
      p("every single day"),
      p("day in,? day out"),
      p("showing up|show up every"),
      p("small (?:wins|steps|habits)"),
      p("discipline"),
    ],
  },
  {
    id: "fear-courage",
    label: "Facing fear and discomfort",
    group: "mindset",
    predicted: true,
    patterns: [
      p("fear[- ]setting"),
      p("(?:face|facing|faced) (?:my |your |the )?fears?"),
      p("comfort zone"),
      p("uncomfortable|discomfort"),
      p("courage|courageous"),
      p("scared me|terrified me"),
    ],
  },
  {
    id: "focus",
    label: "Focus and saying no",
    group: "business",
    predicted: true,
    patterns: [
      p("say(?:ing)? no"),
      p("hell yeah or no|hell yes or no"),
      p("the one thing|one thing at a time"),
      p("prioriti[sz]e|prioriti[sz]ation"),
      p("deep work"),
      p("distractions?"),
      p("80/20|pareto"),
    ],
  },
  {
    id: "leverage-skills",
    label: "Specific skills and leverage",
    group: "business",
    predicted: true,
    patterns: [
      p("leverage"),
      p("specific knowledge"),
      p("skill ?sets?|skill stack"),
      p("equity|ownership"),
      p("trading (?:your )?time for money"),
      p("scalable|at scale"),
    ],
  },
  {
    id: "long-term-compounding",
    label: "Long-term thinking and compounding",
    group: "business",
    predicted: true,
    patterns: [
      p("long[- ]term"),
      p("compound(?:ing|s|ed)?(?: interest)?"),
      p("delayed gratification"),
      p("patience"),
      p("(?:ten|10|twenty|20|thirty|30)[- ]years? (?:from now|time|horizon)"),
    ],
  },
  {
    id: "relationships",
    label: "The people around you",
    group: "life",
    predicted: true,
    patterns: [
      p("surround (?:yourself|myself)"),
      p("the people (?:around|you spend)"),
      p("relationships?"),
      p("co-?founders?"),
      p("my (?:wife|husband|partner|kids|children|family)"),
    ],
  },
  {
    id: "health-foundation",
    label: "Sleep, exercise and health",
    group: "health",
    predicted: true,
    patterns: [
      p("sleep(?:ing)?"),
      p("exercis(?:e|ing)|work ?outs?|resistance training"),
      p("morning (?:sunlight|light|routine)"),
      p("nutrition|diet"),
      p("cold (?:plunge|exposure|shower)"),
      p("burn(?:ed|t)? ?out"),
    ],
  },
  {
    id: "self-awareness",
    label: "Self-awareness, therapy and the past",
    group: "mindset",
    predicted: true,
    patterns: [
      p("therap(?:y|ist)"),
      p("childhood"),
      p("trauma"),
      p("self[- ]awareness|self[- ]aware"),
      p("journal(?:ing)?"),
      p("meditat(?:e|ion|ing)"),
      p("insecur(?:e|ity|ities)"),
    ],
  },
  {
    id: "meaning-redefined",
    label: "Redefining success beyond money",
    group: "life",
    predicted: true,
    patterns: [
      p("meaning(?:ful)?|purpose"),
      p("happiness|fulfil(?:l|led|ling|ment)"),
      p("money (?:doesn't|didn't|won't|can't) (?:make|buy)"),
      p("regrets?"),
      p("(?:had|have|is) enough"),
    ],
  },
  // Themes below were not part of the original hypothesis. They are here so
  // the analysis can surface patterns the summary missed.
  {
    id: "luck-timing",
    label: "Luck and timing",
    group: "business",
    predicted: false,
    patterns: [p("luck(?:y|ily)?"), p("right place at the right time"), p("timing"), p("serendipit(?:y|ous)")],
  },
  {
    id: "failure-learning",
    label: "Failure as learning",
    group: "mindset",
    predicted: false,
    patterns: [
      p("fail(?:ed|ure|ures|ing)?"),
      p("mistakes?"),
      p("lessons? (?:learned|learnt)"),
      p("rejection|rejected"),
    ],
  },
  {
    id: "reading-learning",
    label: "Reading and constant learning",
    group: "mindset",
    predicted: false,
    patterns: [p("(?:favou?rite|recommend(?:ed)?) books?|books? (?:that )?changed"), p("read(?:ing)? (?:a lot|every)"), p("curio(?:us|sity)"), p("first principles")],
  },
  {
    id: "mentors",
    label: "Mentors and asking for help",
    group: "life",
    predicted: false,
    patterns: [p("mentors?|mentorship"), p("role models?"), p("ask(?:ed|ing)? for help"), p("advisors?")],
  },
  {
    id: "customer-obsession",
    label: "Customers and solving real problems",
    group: "business",
    predicted: false,
    patterns: [p("customers?"), p("solve (?:a |the )?(?:real )?problems?"), p("product[- ]market fit")],
  },
  {
    id: "hard-work",
    label: "Outworking everyone",
    group: "business",
    predicted: false,
    patterns: [
      p("hard work|work(?:ed)? (?:so |really )?hard"),
      p("hustle"),
      p("\\d{2,3}[- ]hour (?:weeks?|days?)"),
      p("outwork"),
      p("sacrifice[sd]?"),
    ],
  },
  {
    id: "stories-identity",
    label: "Identity and self-belief",
    group: "mindset",
    predicted: false,
    patterns: [p("self[- ]belief|believe in (?:yourself|myself)"), p("identity"), p("confidence"), p("imposter syndrome")],
  },
];
