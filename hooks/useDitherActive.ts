import { useEffect, useState, type RefObject } from "react";
import { useReducedMotion } from "motion/react";

function prefersSaveData() {
  const connection = (
    navigator as Navigator & {
      connection?: { saveData?: boolean };
    }
  ).connection;
  return connection?.saveData === true;
}

export function useDitherActive(targetRef: RefObject<HTMLElement | null>) {
  const prefersReducedMotion = useReducedMotion();
  const [inView, setInView] = useState(false);
  const [documentVisible, setDocumentVisible] = useState(
    () => typeof document === "undefined" || !document.hidden,
  );
  const [dataAllowed, setDataAllowed] = useState(true);

  useEffect(() => {
    setDataAllowed(!prefersSaveData());
  }, []);

  useEffect(() => {
    const target = targetRef.current;
    if (!target) return;

    const observer = new IntersectionObserver(
      ([entry]) => setInView(entry.isIntersecting),
      { threshold: 0, rootMargin: "80px 0px" },
    );
    observer.observe(target);
    return () => observer.disconnect();
  }, [targetRef]);

  useEffect(() => {
    const onVisibilityChange = () => {
      setDocumentVisible(!document.hidden);
    };

    document.addEventListener("visibilitychange", onVisibilityChange);
    return () =>
      document.removeEventListener("visibilitychange", onVisibilityChange);
  }, []);

  const shouldRun =
    dataAllowed && !prefersReducedMotion && inView && documentVisible;

  return { shouldRun, inView };
}
