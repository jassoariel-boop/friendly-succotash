import { describe, expect, test } from "bun:test";
import { htmlToText, removeHostLines, vttToText, wordCount } from "../src/TranscriptCleaner.ts";
import { conversationOnly, isGuestInterview, lastIndexPage, parseTranscriptLinks, transcriptFromPost } from "../src/FerrissFetcher.ts";

describe("htmlToText", () => {
  test("keeps paragraphs, strips tags and decodes entities", () => {
    const html = `<div class="entry-content"><p>Tim Ferriss: Hi&nbsp;there.</p><p>Guest: It&#8217;s <b>great</b>.</p></div></article>`;
    expect(htmlToText(html)).toBe("Tim Ferriss: Hi there.\nGuest: It's great .");
  });

  test("drops scripts", () => {
    expect(htmlToText("<p>Hello</p><script>var x = 1;</script>")).toBe("Hello");
  });
});

describe("removeHostLines", () => {
  test("drops host turns including unlabelled continuation lines", () => {
    const text = ["Tim Ferriss: Welcome.", "Second host line.", "Naval Ravikant: Thanks.", "More from Naval."].join("\n");
    expect(removeHostLines(text, ["Tim Ferriss"])).toBe("Naval Ravikant: Thanks.\nMore from Naval.");
  });
});

describe("vttToText", () => {
  test("removes headers, timestamps, inline tags and rolling duplicates", () => {
    const vtt = [
      "WEBVTT",
      "Kind: captions",
      "Language: en",
      "",
      "00:00:01.000 --> 00:00:02.000",
      "so the<00:00:01.500><c> key</c> is",
      "",
      "00:00:02.000 --> 00:00:03.000",
      "so the key is",
      "",
      "00:00:03.000 --> 00:00:04.000",
      "consistency",
    ].join("\n");
    expect(vttToText(vtt)).toBe("so the key is\nconsistency");
  });
});

describe("parseTranscriptLinks", () => {
  test("reads episode number, title and url, once per episode", () => {
    const html = `
      <a href="https://tim.blog/2018/09/20/all-transcripts-from-the-tim-ferriss-show/">index</a>
      <a href="https://tim.blog/?p=117133" target="_blank">#884: How to Spot 10-Year Trends &#8212; Kevin Ryan</a>
      <a href="https://tim.blog/?p=117133">#884: duplicate</a>
      <a href="https://tim.blog/about/">About</a>
      <a href="?transcript-page=16">16</a>`;
    expect(parseTranscriptLinks(html)).toEqual([
      {
        episode: 884,
        title: "How to Spot 10-Year Trends - Kevin Ryan",
        url: "https://tim.blog/?p=117133",
        slug: "884-how-to-spot-10-year-trends-kevin-ryan",
      },
    ]);
    expect(lastIndexPage(html)).toBe(16);
  });

  test("filters out solo and compilation episodes", () => {
    expect(isGuestInterview("Q&A with Tim — On Happiness")).toBe(false);
    expect(isGuestInterview("The Random Show — Fasting")).toBe(false);
    expect(isGuestInterview("How to Simplify Your Life — Tips from Oliver Burkeman")).toBe(false);
    expect(isGuestInterview("Naval Ravikant — The Angel Philosopher")).toBe(true);
    expect(isGuestInterview("TOMS Founder Blake Mycoskie — Fear{less} with Tim Ferriss")).toBe(true);
  });
});

test("transcriptFromPost removes the host", () => {
  const html = `<div class="entry-content wp-block" id="x"><p class="wp-block-paragraph"><strong>Tim Ferriss:</strong> Question?</p><p>Jane Doe: Answer.</p></div></article>`;
  expect(transcriptFromPost(html)).toBe("Jane Doe: Answer.");
});

test("guest names with accents and curly apostrophes count as speaker labels", () => {
  const text = ["Tim Ferriss: Hi.", "Dr. Dominic D’Agostino: Hello.", "Tobi Lütke: Hey.", "Guy de Lavalle: Bonjour."].join("\n");
  expect(removeHostLines(text, ["Tim Ferriss"])).toBe("Dr. Dominic D’Agostino: Hello.\nTobi Lütke: Hey.\nGuy de Lavalle: Bonjour.");
});

test("conversationOnly drops a legal notice placed before the conversation", () => {
  const text = [
    "#177: Seth Godin",
    "DUE TO SOME HEADACHES IN THE PAST, PLEASE NOTE LEGAL CONDITIONS:",
    "WHAT YOU’RE WELCOME TO DO:",
    "WHAT IS NOT ALLOWED:",
    "No one is authorized to copy any portion.",
    "Seth Godin: Thanks, Tim.",
    "More from Seth.",
    "Share on Facebook",
  ];
  expect(conversationOnly(text.join("\n"))).toBe("Seth Godin: Thanks, Tim.\nMore from Seth.");
});

test("conversationOnly drops the intro and the share/comment footer", () => {
  const text = ["Please enjoy this transcript.", "Tim Ferriss: Hi.", "Jane Doe: Hello.", "Share on Facebook", "Comment Rules: be cool."];
  expect(conversationOnly(text.join("\n"))).toBe("Tim Ferriss: Hi.\nJane Doe: Hello.");
});

test("wordCount", () => {
  expect(wordCount("  one two\nthree ")).toBe(3);
});
