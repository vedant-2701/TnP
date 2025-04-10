// Textarea component extends from shadcnui - https://ui.shadcn.com/docs/components/textarea
"use client";
import * as React from "react";
import { cn } from "../../../lib/utils";
import { useMotionTemplate, useMotionValue, motion } from "motion/react";

const Textarea = React.forwardRef(({ className, value, onChange = null, ...props }, ref) => {
  const radius = 50; // Smaller radius for localized effect
  const [visible, setVisible] = React.useState(false);

  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const handleMouseMove = ({ currentTarget, clientX, clientY }) => {
    const { left, top } = currentTarget.getBoundingClientRect();
    mouseX.set(clientX - left);
    mouseY.set(clientY - top);
  };

  return (
    <motion.div
      style={{
        background: useMotionTemplate`
          radial-gradient(
            ${visible ? radius + "px" : "0px"} circle at ${mouseX}px ${mouseY}px,
            #3b82f6,
            transparent 50%
          )
        `,
      }}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setVisible(true)}
      onMouseLeave={() => setVisible(false)}
      className="group/textarea rounded-lg p-[2px] transition duration-300 relative overflow-hidden"
    >
      <textarea
        className={cn(
          `shadow-input dark:placeholder-text-neutral-600 flex min-h-[80px] w-full rounded-md border-none bg-gray-50 px-3 py-2 text-sm text-black transition duration-400 group-hover/textarea:shadow-none file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-neutral-400 focus-visible:ring-[2px] focus-visible:ring-neutral-400 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50 dark:bg-zinc-800 dark:text-white dark:shadow-[0px_0px_1px_1px_#404040] dark:focus-visible:ring-neutral-600`,
          className,
          "relative z-10" // Ensure textarea stays above the gradient
        )}
        ref={ref}
        value={value}
        onChange={onChange}
        {...props}
      />
      {/* Clip the gradient to show only top and bottom areas */}
      <motion.div
        className="absolute inset-0"
        style={{
          clipPath: "polygon(0 0, 100% 20%, 100% 80%, 0 100%)", // Limits effect to top and bottom
          background: useMotionTemplate`
            radial-gradient(
              ${visible ? radius + "px" : "0px"} circle at ${mouseX}px ${mouseY}px,
              #3b82f6,
              transparent 50%
            )
          `,
        }}
      />
    </motion.div>
  );
});
Textarea.displayName = "Textarea";

export { Textarea };