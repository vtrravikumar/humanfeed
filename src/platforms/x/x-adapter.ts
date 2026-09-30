import type { MediaObservation, PostObservation } from "../../core/observation";
import type { PlatformAdapter } from "../platform-adapter";

const POST_SELECTOR = 'article[data-testid="tweet"]';
const STATUS_LINK_SELECTOR = 'a[href*="/status/"]';
const IMAGE_SELECTOR =
  '[data-testid="tweetPhoto"] img, [data-testid="card.layoutLarge.media"] img';
const VIDEO_SELECTOR = "video";

/**
 * Reads the X feed's rendered media elements and emits normalized observations.
 * It neither changes the page nor assesses the observed media.
 */
export class XAdapter implements PlatformAdapter {
  readonly platform = "x" as const;

  private readonly seenPostIds = new Set<string>();
  private readonly seenPostElements = new WeakSet<Element>();
  private nextObservation = 1;
  private stopCurrentObservation?: () => void;

  constructor(private readonly page: Document = document) {}

  start(onPost: (post: PostObservation) => void): () => void {
    this.stopCurrentObservation?.();
    this.observePosts(this.page, onPost);

    const root = this.page.body ?? this.page.documentElement;
    if (!root) {
      return () => undefined;
    }

    const observer = new MutationObserver((records) => {
        for (const record of records) {
        for (const node of record.addedNodes) {
          if (node.nodeType === Node.ELEMENT_NODE) {
            this.observePosts(node as Element, onPost);
          }
        }
      }
    });

    observer.observe(root, { childList: true, subtree: true });

    const stop = () => {
      observer.disconnect();
      if (this.stopCurrentObservation === stop) {
        this.stopCurrentObservation = undefined;
      }
    };

    this.stopCurrentObservation = stop;
    return stop;
  }

  private observePosts(root: ParentNode, onPost: (post: PostObservation) => void): void {
    if (this.isPost(root)) {
      this.observePost(root, onPost);
    }

    for (const post of root.querySelectorAll(POST_SELECTOR)) {
      this.observePost(post, onPost);
    }
  }

  private isPost(node: ParentNode): node is Element {
    return node.nodeType === 1 && (node as Element).matches(POST_SELECTOR);
  }

  private observePost(postElement: Element, onPost: (post: PostObservation) => void): void {
    if (this.seenPostElements.has(postElement)) {
      return;
    }

    const platformPostId = this.getPlatformPostId(postElement);
    if (platformPostId && this.seenPostIds.has(platformPostId)) {
      this.seenPostElements.add(postElement);
      return;
    }

    this.seenPostElements.add(postElement);
    if (platformPostId) {
      this.seenPostIds.add(platformPostId);
    }

    const observationId = platformPostId
      ? `x:${platformPostId}`
      : `x:local:${this.nextObservation++}`;

    onPost({
      observationId,
      platform: this.platform,
      ...(platformPostId ? { platformPostId } : {}),
      media: this.getMedia(postElement, observationId),
      observedAt: Date.now()
    });
  }

  private getPlatformPostId(postElement: Element): string | undefined {
    const href = postElement.querySelector(STATUS_LINK_SELECTOR)?.getAttribute("href");
    const match = href?.match(/\/status\/(\d+)/);
    return match?.[1];
  }

  private getMedia(postElement: Element, observationId: string): MediaObservation[] {
    const images = Array.from(postElement.querySelectorAll(IMAGE_SELECTOR)).map(
      (_image, index) => ({
        mediaId: `${observationId}:image:${index}`,
        kind: "image" as const
      })
    );
    const videos = Array.from(postElement.querySelectorAll(VIDEO_SELECTOR)).map(
      (_video, index) => ({
        mediaId: `${observationId}:video:${index}`,
        kind: "video" as const
      })
    );

    return [...images, ...videos];
  }
}
