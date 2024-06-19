import { useEffect, useRef } from "react";

const useClickOutsideList = (callback: () => void) => {
  const listRef = useRef<HTMLDivElement>(null);
  const plusButtonRef = useRef<HTMLDivElement>(null);

  // 💡 Handler to click outside user list
  useEffect(() => {
    const listener = (event: MouseEvent | TouchEvent) => {
      if (
        !listRef.current ||
        listRef.current.contains(event.target as Node) ||
        !plusButtonRef.current ||
        plusButtonRef.current.contains(event.target as Node)
      ) {
        return;
      }

      callback();
    };

    document.addEventListener("mousedown", listener);
    document.addEventListener("touchstart", listener);

    return () => {
      document.removeEventListener("mousedown", listener);
      document.removeEventListener("touchstart", listener);
    };
  }, [listRef, plusButtonRef]);

  return { listRef, plusButtonRef };
};

export default useClickOutsideList;
