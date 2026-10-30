import { describe, expect, test } from "bun:test";
import { htmlToText, removeHostLines, vttToText, wordCount } from "../src/TranscriptCleaner.ts";
import { parseTranscriptLinks, transcriptFromPost } from "../src/FerrissFetcher.ts";

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
    expect(removeHostLines(text, "Tim Ferriss")).toBe("Naval Ravikant: Thanks.\nMore from Naval.");
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
  test("finds unique transcript posts and skips the index itself", () => {
    const html = `
      <a href="https://tim.blog/podcast-transcripts/">index</a>
      <a href="https://tim.blog/2020/10/15/naval-transcript/">Naval</a>
      <a href="https://tim.blog/2020/10/15/naval-transcript/">Naval again</a>
      <a href="https://tim.blog/about/">About</a>`;
    expect(parseTranscriptLinks(html)).toEqual([
      { slug: "naval-transcript", url: "https://tim.blog/2020/10/15/naval-transcript/" },
    ]);
  });
});

test("transcriptFromPost removes the host", () => {
  const html = `<div class="entry-content"><p>Tim Ferriss: Question?</p><p>Jane Doe: Answer.</p></div></article>`;
  expect(transcriptFromPost(html)).toBe("Jane Doe: Answer.");
});

test("wordCount", () => {
  expect(wordCount("  one two\nthree ")).toBe(3);
});
