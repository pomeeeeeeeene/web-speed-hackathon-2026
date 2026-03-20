import { ReactNode, useEffect, useRef } from "react";

interface Props {
  children: ReactNode;
  items: any[];
  fetchMore: () => void;
}

export const InfiniteScroll = ({ children, fetchMore, items }: Props) => {
  const latestItem = items[items.length - 1];
  const sentinelRef = useRef<HTMLDivElement>(null);
  const wasIntersectingRef = useRef(false);

  useEffect(() => {
    const sentinel = sentinelRef.current;
    if (sentinel == null) {
      return;
    }

    wasIntersectingRef.current = false;

    const observer = new IntersectionObserver(
      ([entry]) => {
        const isIntersecting = entry?.isIntersecting ?? false;

        if (isIntersecting && !wasIntersectingRef.current && latestItem !== undefined) {
          fetchMore();
        }

        wasIntersectingRef.current = isIntersecting;
      },
      {
        root: null,
        threshold: 0,
        rootMargin: "0px 0px 300px 0px",
      },
    );

    observer.observe(sentinel);

    return () => {
      observer.disconnect();
    };
  }, [latestItem, fetchMore]);

  return (
    <>
      {children}
      <div ref={sentinelRef} aria-hidden className="h-px w-full" />
    </>
    );
};
