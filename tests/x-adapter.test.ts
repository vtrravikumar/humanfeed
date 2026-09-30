// @vitest-environment jsdom

import { afterEach, describe, expect, it, vi } from "vitest";

import { XAdapter } from "../src/platforms/x/x-adapter";

function addPost(markup: string): HTMLElement {
  document.body.insertAdjacentHTML("beforeend", markup);
  return document.body.lastElementChild as HTMLElement;
}

function postMarkup(id: string | undefined, media = ""): string {
  const statusLink = id ? `<a href="/example/status/${id}"></a>` : "";
  return `<article data-testid="tweet">${statusLink}${media}</article>`;
}

function imageMarkup(): string {
  return '<div data-testid="tweetPhoto"><img src="https://pbs.twimg.com/media/example.jpg" /></div>';
}

function cardImageMarkup(): string {
  return '<a data-testid="card.wrapper"><div data-testid="card.layoutLarge.media"><img src="https://pbs.twimg.com/card/example.jpg" /></div></a>';
}

function videoMarkup(): string {
  return '<div data-testid="videoPlayer"><video></video></div>';
}

async function flushMutations(): Promise<void> {
  await Promise.resolve();
}

afterEach(() => {
  document.body.innerHTML = "";
});

describe("XAdapter", () => {
  it("observes a post containing one image", () => {
    addPost(postMarkup("100", imageMarkup()));
    const onPost = vi.fn();
    new XAdapter(document).start(onPost);

    expect(onPost).toHaveBeenCalledWith(
      expect.objectContaining({
        observationId: "x:100",
        platform: "x",
        platformPostId: "100",
        media: [{ mediaId: "x:100:image:0", kind: "image" }]
      })
    );
  });

  it("observes an image in X's card layout media container", () => {
    addPost(postMarkup("1001", cardImageMarkup()));
    const onPost = vi.fn();
    new XAdapter(document).start(onPost);
    expect(onPost.mock.calls[0][0].media).toEqual([
      { mediaId: "x:1001:image:0", kind: "image" }
    ]);
  });

  it("observes multiple media items in one post", () => {
    addPost(postMarkup("101", imageMarkup() + imageMarkup()));
    const onPost = vi.fn();
    new XAdapter(document).start(onPost);
    expect(onPost.mock.calls[0][0].media).toEqual([
      { mediaId: "x:101:image:0", kind: "image" },
      { mediaId: "x:101:image:1", kind: "image" }
    ]);
  });

  it("observes a video post", () => {
    addPost(postMarkup("102", videoMarkup()));
    const onPost = vi.fn();
    new XAdapter(document).start(onPost);
    expect(onPost.mock.calls[0][0].media).toEqual([
      { mediaId: "x:102:video:0", kind: "video" }
    ]);
  });

  it("observes posts without media as an empty media list", () => {
    addPost(postMarkup("103"));
    const onPost = vi.fn();
    new XAdapter(document).start(onPost);
    expect(onPost.mock.calls[0][0].media).toEqual([]);
  });

  it("emits an updated snapshot when media is inserted after the post", async () => {
    const post = addPost(postMarkup("107"));
    const onPost = vi.fn();
    new XAdapter(document).start(onPost);

    expect(onPost).toHaveBeenCalledTimes(1);
    expect(onPost.mock.calls[0][0].media).toEqual([]);

    post.insertAdjacentHTML("beforeend", imageMarkup());
    await flushMutations();

    expect(onPost).toHaveBeenCalledTimes(2);
    expect(onPost.mock.calls[1][0]).toEqual(
      expect.objectContaining({
        observationId: "x:107",
        platformPostId: "107",
        media: [{ mediaId: "x:107:image:0", kind: "image" }]
      })
    );
  });

  it("does not re-emit when unrelated content is added to an observed post", async () => {
    const post = addPost(postMarkup("108", imageMarkup()));
    const onPost = vi.fn();
    new XAdapter(document).start(onPost);
    post.insertAdjacentHTML("beforeend", "<span>unrelated node</span>");
    await flushMutations();
    expect(onPost).toHaveBeenCalledTimes(1);
  });

  it("uses a local observation identifier when a post identifier is absent", () => {
    addPost(postMarkup(undefined, imageMarkup()));
    const onPost = vi.fn();
    new XAdapter(document).start(onPost);
    expect(onPost.mock.calls[0][0]).toEqual(
      expect.objectContaining({ observationId: "x:local:1" })
    );
    expect(onPost.mock.calls[0][0]).not.toHaveProperty("platformPostId");
  });

  it("does not emit duplicate snapshots for the same post and media", async () => {
    addPost(postMarkup("104", imageMarkup()));
    addPost(postMarkup("104", imageMarkup()));
    const onPost = vi.fn();
    const adapter = new XAdapter(document);
    adapter.start(onPost);
    document.body.appendChild(document.querySelector("article")!.cloneNode(true));
    await flushMutations();
    expect(onPost).toHaveBeenCalledTimes(1);
  });

  it("observes posts inserted after start", async () => {
    const onPost = vi.fn();
    new XAdapter(document).start(onPost);
    addPost(postMarkup("105", imageMarkup()));
    await flushMutations();
    expect(onPost).toHaveBeenCalledWith(
      expect.objectContaining({ platformPostId: "105" })
    );
  });

  it("stops observing dynamic posts after cleanup", async () => {
    const onPost = vi.fn();
    const stop = new XAdapter(document).start(onPost);
    stop();
    addPost(postMarkup("106", imageMarkup()));
    await flushMutations();
    expect(onPost).not.toHaveBeenCalled();
  });
}