import { useEffect, useState } from 'react';
import { useInView as useFramerInView } from 'motion/react';

export const useInView = (ref) => {
  const isInView = useFramerInView(ref, { amount: 0.2 });
  const [hasAnimated, setHasAnimated] = useState(false);

  useEffect(() => {
    if (isInView && !hasAnimated) {
      setHasAnimated(true);
    }
  }, [isInView, hasAnimated]);

  return { isInView, hasAnimated };
};