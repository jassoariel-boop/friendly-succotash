// Turns raw transcript sources (tim.blog HTML, YouTube .vtt captions) into
// plain guest-focused text.

const ENTITIES: Readonly<Record<string, string>> = {
  "&amp;": "&",
  "&lt;": "<",
  "&gt;": ">",
  "&quot;": '"',
  "&#39;": "'",
  "&#8217;": "'",
  "&#8216;": "'",
  "&#8220;": '"',
  "&#8221;": '"',
  "&#8211;": "-",
  "&#8212;": "-",
  "&nbsp;": " ",
  "&#038;": "&",
};

export const decodeEntities = (text: string): string =>
  text.replace(/&(?:#\d+|[a-z]+);/gi, (entity) => ENTITIES[entity.toLowerCase()] ?? " ");

// Pulls the post body out of a WordPress page and keeps paragraph breaks.
export const htmlToText = (html: string): string => {
  const body = html.match(/<div class="entry-content[^"]*"[^>]*>([\s\S]*?)<\/article>/i)?.[1] ?? html;
  return decodeEntities(
    body
      .replace(/<(script|style|noscript)[\s\S]*?<\/\1>/gi, " ")
      .replace(/<\/(p|div|h\d|li)>|<br\s*\/?>/gi, "\n")
      .replace(/<[^>]+>/g, " "),
  )
    .split("\n")
    .map((line) => line.replace(/\s+/g, " ").trim())
    .filter((line) => line.length > 0)
    .join("\n");
};

// A speaker label such as "Tim Ferriss:" or "Dr. Dominic D’Agostino:" at the
// start of a line. Names may include accents, curly apostrophes and particles.
export const SPEAKER_LABEL =
  /^(\p{Lu}[\p{L}\p{M}.'’-]*(?: (?:\p{Lu}[\p{L}\p{M}.'’-]*|de|van|von|da|del|la|le)){0,4}):\s/u;

// Drops lines spoken by the host. Ferriss transcripts prefix turns with
// "Tim Ferriss:"; lines without a speaker label stay with the previous speaker.
export const removeHostLines = (text: string, hostNames: readonly string[]): string => {
  const hosts = hostNames.map((name) => name.toLowerCase());
  let hostSpeaking = false;
  return text
    .split("\n")
    .filter((line) => {
      const label = line.match(SPEAKER_LABEL)?.[1];
      if (label !== undefined) hostSpeaking = hosts.includes(label.toLowerCase());
      return !hostSpeaking;
    })
    .join("\n");
};

// YouTube auto-captions repeat each phrase across several cues as it rolls
// on screen. Keep each distinct line once, in order.
export const vttToText = (vtt: string): string => {
  const lines = vtt
    .split(/\r?\n/)
    .filter((line) => line.trim() !== "" && !/^(WEBVTT|Kind:|Language:|NOTE)/.test(line) && !line.includes("-->"))
    .filter((line) => !/^\d+$/.test(line.trim()))
    .map((line) => decodeEntities(line.replace(/<[^>]+>/g, "")).replace(/\s+/g, " ").trim())
    .filter((line) => line.length > 0);
  return lines.filter((line, i) => line !== lines[i - 1]).join("\n");
};

export const wordCount = (text: string): number => text.split(/\s+/).filter((w) => w.length > 0).length;
