import { describe, expect, test } from "bun:test";
import { CODEBOOK } from "../src/Codebook.ts";

const matches = (themeId: string, text: string): boolean => {
  const theme = CODEBOOK.find((t) => t.id === themeId);
  if (theme === undefined) throw new Error(`no theme ${themeId}`);
  return theme.patterns.some((pattern) => {
    pattern.lastIndex = 0;
    return pattern.test(text);
  });
};

// Each theme gets one sentence that must match and one near miss that must not.
const CASES: readonly (readonly [string, string, string])[] = [
  ["consistency", "I wrote every single day for ten years.", "I wrote a lot that one year."],
  ["fear-courage", "Get out of your comfort zone.", "The zone defence was strong."],
  ["focus", "You have to get good at saying no.", "No, I don't think so."],
  ["leverage-skills", "Find your specific knowledge and add leverage.", "The knowledge was very general."],
  ["long-term-compounding", "Think long-term and let it compound.", "It was a long day."],
  ["relationships", "Surround yourself with people who push you.", "The building surrounds the park."],
  ["health-foundation", "I protect my sleep above everything.", "That talk put me to rest."],
  ["self-awareness", "Therapy changed how I saw my childhood.", "The child was hungry."],
  ["meaning-redefined", "I wanted a meaningful life.", "What do you mean?"],
  ["luck-timing", "Honestly a lot of it was luck.", "Lucknow is a city."],
  ["failure-learning", "My first company failed.", "The fairy tale was lovely."],
  ["reading-learning", "My favorite book is Meditations.", "I booked a flight."],
  ["mentors", "My mentor told me to quit.", "He mentioned it once."],
  ["customer-obsession", "Talk to your customers.", "The custom build was nice."],
  ["hard-work", "I did 100-hour weeks for years.", "The hour hand moved."],
  ["stories-identity", "I had terrible imposter syndrome.", "The impostor was caught."],
];

describe("codebook", () => {
  test("every theme has a test case", () => {
    expect(CASES.map(([id]) => id).sort()).toEqual(CODEBOOK.map((t) => t.id).sort());
  });

  test.each(CASES)("%s matches its example and not its near miss", (id, hit, miss) => {
    expect(matches(id, hit)).toBe(true);
    expect(matches(id, miss)).toBe(false);
  });

  test("theme ids are unique", () => {
    expect(new Set(CODEBOOK.map((t) => t.id)).size).toBe(CODEBOOK.length);
  });
});
