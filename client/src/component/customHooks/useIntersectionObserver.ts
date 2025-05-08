import { useCallback, useRef } from 'react';

export default function useIntersectionObserver<T extends HTMLElement>(
    callback: () => void,
    deps: any[],
    options: IntersectionObserverInit = { threshold: 0.1 } // Reduced the threshold to trigger more easily
) {
    const observer = useRef<IntersectionObserver | null>(null);

    const ref = useCallback(
        (node: T | null) => {
            // Log when ref is updated
            console.log("Ref updated:", node);

            if (observer.current) {
                observer.current.disconnect();
            }

            if (node) {
                observer.current = new IntersectionObserver(
                    (entries) => {
                        if (entries[0].isIntersecting) {
                            console.log("Element is intersecting");
                            callback(); // Fetch more messages
                        } else {
                            console.log("Element is NOT intersecting");
                        }
                    },
                    options
                );
                observer.current.observe(node);
            }
        },
        [callback, ...deps]
    );

    return ref;
}
