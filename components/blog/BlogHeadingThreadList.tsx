import { useCallback, useEffect, useMemo, useState } from "react";
import {
  AssistantRuntimeProvider,
  ThreadListItemPrimitive,
  ThreadListPrimitive,
  useAuiState,
  useExternalStoreRuntime,
} from "@assistant-ui/react";
import {
  BLOG_HEADING_SCROLL_OFFSET_PX,
  activeHeadingId,
  blogTocHeadings,
  headingDepth,
  headingIndentClass,
  headingsToThreads,
  initialHeadingId,
  type BlogHeading,
} from "./headings";

type Props = {
  headings: BlogHeading[];
};

function HeadingThreadListItem() {
  const depth = useAuiState((s) => headingDepth(s.threadListItem.custom));

  return (
    <ThreadListItemPrimitive.Root className="group relative flex min-h-8 items-center rounded-md transition-colors hover:bg-surface focus-visible:bg-surface data-[active]:bg-surface">
      <ThreadListItemPrimitive.Trigger
        className={`flex h-full min-w-0 flex-1 items-center rounded-md py-1.5 pe-2.5 text-start font-sans text-sm text-muted outline-none transition-colors hover:text-white focus-visible:text-voltage group-data-[active]:text-voltage ${headingIndentClass(depth)}`}
      >
        <span className="truncate">
          <ThreadListItemPrimitive.Title />
        </span>
      </ThreadListItemPrimitive.Trigger>
    </ThreadListItemPrimitive.Root>
  );
}

function scrollToHeading(id: string) {
  const heading = document.getElementById(id);
  if (!heading) return;

  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  heading.scrollIntoView({
    behavior: reduce ? "auto" : "smooth",
    block: "start",
  });

  const hash = `#${id}`;
  if (window.location.hash !== hash) {
    window.history.replaceState(null, "", hash);
  }
}

export default function BlogHeadingThreadList({ headings }: Props) {
  const toc = useMemo(() => blogTocHeadings(headings), [headings]);
  const threads = useMemo(() => headingsToThreads(toc), [toc]);
  const [activeId, setActiveId] = useState(threads[0]?.id ?? "");

  const onSwitchToThread = useCallback((id: string) => {
    setActiveId(id);
    scrollToHeading(id);
  }, []);

  const runtime = useExternalStoreRuntime({
    messages: [],
    onNew: async () => {},
    adapters: {
      threadList: {
        threadId: activeId,
        threads,
        onSwitchToThread,
      },
    },
  });

  useEffect(() => {
    const fromHash = initialHeadingId(toc, window.location.hash);
    if (fromHash) setActiveId(fromHash);
  }, [toc]);

  useEffect(() => {
    const onHashChange = () => {
      const next = initialHeadingId(toc, window.location.hash);
      if (next) setActiveId(next);
    };

    window.addEventListener("hashchange", onHashChange);
    return () => window.removeEventListener("hashchange", onHashChange);
  }, [toc]);

  useEffect(() => {
    let frame = 0;

    const update = () => {
      frame = 0;
      const tops = toc.map((heading) => {
        const element = document.getElementById(heading.slug);
        return element
          ? element.getBoundingClientRect().top
          : Number.POSITIVE_INFINITY;
      });
      const next = activeHeadingId(toc, tops, BLOG_HEADING_SCROLL_OFFSET_PX);
      if (next) {
        setActiveId((current) => (current === next ? current : next));
      }
    };

    const onScroll = () => {
      if (frame) return;
      frame = window.requestAnimationFrame(update);
    };

    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);

    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (frame) window.cancelAnimationFrame(frame);
    };
  }, [toc]);

  if (threads.length === 0) return null;

  return (
    <AssistantRuntimeProvider runtime={runtime}>
      <p className="mb-3 font-sans text-sm text-muted">On this page</p>
      <ThreadListPrimitive.Root asChild>
        <nav
          aria-label="On this page"
          className="flex max-h-[min(24rem,70vh)] flex-col gap-0.5 overflow-y-auto lg:max-h-[calc(100vh-8rem)]"
        >
          <ThreadListPrimitive.Items>
            {() => <HeadingThreadListItem />}
          </ThreadListPrimitive.Items>
        </nav>
      </ThreadListPrimitive.Root>
    </AssistantRuntimeProvider>
  );
}
