import { useState, useCallback, useLayoutEffect } from 'react';

const getDimensions = (element: HTMLElement) => element.getBoundingClientRect();

export function useDimensions(responsive = true) {
  const [dimensions, setDimensions] = useState<DOMRect>({} as DOMRect);
  const [element, setElement] = useState<HTMLElement>({} as HTMLElement);

  const hook = useCallback((e) => {
    setElement(e);
  }, []);

  useLayoutEffect(() => {
    if (element !== null) {
      const updateDimensions = () => {
        window.requestAnimationFrame(() => {
          setDimensions(getDimensions(element));
        })
      }

      updateDimensions();

      if (responsive) {
        window.addEventListener('resize', updateDimensions);

        return () => {
          window.removeEventListener('resize', updateDimensions);
        }
      }
    }
  }, [element, hook, responsive]);

  return { hook, dimensions, element };
}