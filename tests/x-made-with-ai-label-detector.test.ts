// @vitest-environment jsdom

import { afterEach, describe, expect, it, vi } from "vitest";

import { detectXMadeWithAiLabel } from "../src/platforms/x/x-made-with-ai-label-detector";

function addPost(markup: string): HTMLElement {
  document.body.insertAdjacentHTML("beforeend", `<article data-testid="tweet">${markup}</article>`);
  return document.body.lastElementChild as HTMLElement;
}

function observedBadge(label = "Made with AI"): string {
  return `<div dir="ltr" style="color: rgb(29, 155, 240)"><svg aria-hidden="true"></svg><span class="css-generated">${label}</span></div>`;
}

afterEach(() => {
  document.body.innerHTML = "";
  vi.useRealTimers();
});

describe("detectXMadeWithAiLabel", () => {
  it("detects the observed badge structure and returns platform-label evidence", () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2026-09-30T00:00:00.000Z"));
    const post = addPost(`<div data-testid="tweetPhoto"><img /></div>${observedBadge("  Made\n  with AI  ")}`);

    expect(detectXMadeWithAiLabel(post)).toEqual({
      providerId: "x-made-with-ai-label",
      kind: "platform-label",
      result: "ai-generated",
      strength: "strong",
      observedAt: Date.now(),
      explanation: 'The X "Made with AI" platform label was observed.'
    });
  });

  it("returns no evidence when the label is absent", () => {
    const post = addPost('<div dir="ltr"><svg></svg><span>Original media</span></div>');

    expect(detectXMadeWithAiLabel(post)).toBeUndefined();
  });

  it("requires the exact normalized label text", () => {
    const post = addPost(observedBadge("Made with ai"));

    expect(detectXMadeWithAiLabel(post)).toBeUndefined();
  });

  it("excludes matching words inside the post text", () => {
    const post = addPost(`<div data-testid="tweetText">${observedBadge()}</div>`);

    expect(detectXMadeWithAiLabel(post)).toBeUndefined();
  });

  it("requires an adjacent SVG badge icon", () => {
    const post = addPost('<div dir="ltr"><span>Made with AI</span><span>separate content</span><svg></svg></div>');

    expect(detectXMadeWithAiLabel(post)).toBeUndefined();
  });
});
