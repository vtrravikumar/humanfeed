import type { MediaObservation, PostObservation } from "../../core/observation";
import type { PlatformAdapter } from "../platform-adapter";

const POST_SELECTOR = 'article[data-testid="tweet"]';
const STATUS_LINK_SELECTOR = 'a[href*="/status/"]';
const IMAGE_SELECTOR =
  '[data-testid="tweetPhoto"] img, [data-testid="card.layoutLarge.media"] img';
const VIDEO_SELECTOR = "video";

interface PostState {
  lastMediaSignature?: string;
}

/**
 * Reads X's rendered media and emits normalized snapshots.
 * A post may be emitted again with the same observationId when its media changes.
 * This adapter neither changes the page nor assesses the observed media.
 */
export class XAdapter implements PlatformAdapter {
  readonly platform = "x" as const;

  private readonly postStates = new Map<string, PostState>();
  private readonly localObservationIds = new WeakMap<Element, string>();
  private nextObservation = 1;
  private stopCurrentObservation?: () => void;

  constructor(private readonly page: Document = document) {}

  start(onPost: (post: PostObservation) => void): () => void {
    this.stopCurrentObservation?.();
    this.observePosts(this.page, onPost);

    const root = this.page.body ?? this.page.documentElement;
    if (!root) return () => undefined;

    const observer = new MutationObserver((records) => {
      for (const record of records) {
        if (record.type === "attributes") {
          if (record.target.nodeType === Node.ELEMENT_NODE) {
            this.observePosts(record.target as Element, onPost);
          }
          continue;
        }
        for (const node of record.addedNodes) {
          if (node.nodeType === Node.ELEMENT_NODE) {
            this.observePosts(node as Element, onPost);
          }
        }
      }
    });

    observer.observe(root, {
      childList: true,
      subtree: true,
      attributes: true,
      attributeFilter: ["data-testid"]
    });

    const stop = () => {
      observer.disconnect();
      if (this.stopCurrentObservation === stop) this.stopCurrentObservation = undefined;
    };
    this.stopCurrentObservation = stop;
    return stop;
  }

  private observePosts(root: ParentNode, onPost: (post: PostObservation) => void): void {
    if (root.nodeType === Node.ELEMENT_NODE) {
      const element = root as Element;
      const containingPost = element.matches(POST_SELECTOR)
        ? element
        : element.closest(POST_SELECTOR);
      if (containingPost) this.observePost(containingPost, onPost);
    }
    for (const post of root.querySelectorAll(POST_SELECTOR)) {
      this.observePost(post, onPost);
    }
  }

  private observePost(postElement: Element, onPost: (post: PostObservation) => void): void {
    const platformPostId = this.getPlatformPostId(postElement);
    const observationId = platformPostId
      ? `x:${platformPostId}`
      : this.getLocalObservationId(postElement);
    const media = this.getMedia(postElement, observationId);
    const signature = JSON.stringify(media.map(({ kind }) => kind));
    const state = this.postStates.get(observationId) ?? {};
    if (state.lastMediaSignature === signature) return;

    state.lastMediaSignature = signature;
    this.postStates.set(observationId, state);
    onPost({
      observationId,
      platform: this.platform,
      ...(platformPostId ? { platformPostId } : {}),
      media,
      observedAt: Date.now()
    });
  }

  private getLocalObservationId(postElement: Element): string {
    const existing = this.localObservationIds.get(postElement);
    if (existing) return existing;
    const id = `x:local:${this.nextObservation++}`;
    this.localObservationIds.set(postElement, id);
    return id;
  }

  private getPlatformPostId(postElement: Element): string | undefined {
    const href = postElement.querySelector(STATUS_LINK_SELECTOR)?.getAttribute("href");
    return href?.match(/\/status\/(\d+)/)?.[1];
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