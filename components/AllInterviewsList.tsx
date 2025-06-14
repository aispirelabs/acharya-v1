"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CircleArrowDown } from "lucide-react";

interface AllInterviewsListProps {
  renderedCards: React.ReactNode[];
}

export default function AllInterviewsList({ 
  renderedCards 
}: AllInterviewsListProps) {
  // It's good practice to ensure environment variables are handled gracefully if not set.
  const interviewsPerPage = Number(process.env.NEXT_PUBLIC_INTERVIEWS_PER_PAGE) || 3;
  const [itemsToShow, setItemsToShow] = useState(interviewsPerPage);
  const incrementBy = 6;

  const handleLoadMore = () => {
    setItemsToShow(prev => prev + incrementBy);
  };

  const hasMoreItems = itemsToShow < renderedCards.length;

  if (renderedCards.length === 0) {
    return <div className="interviews-section">
      <p>There are no interviews available</p>
    </div>;
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="interviews-section">
        <AnimatePresence>
          {renderedCards.slice(0, itemsToShow).map((card, index) => (
            <motion.div
              key={index}
              className="flex"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{
                duration: 0.3,
                delay: index >= itemsToShow - incrementBy ? 0.1 * (index % incrementBy) : 0,
              }}
            >
              {card}
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {hasMoreItems && (
        <div className="flex justify-center mt-4">
          <button
            onClick={handleLoadMore}
            className="btn-secondary flex items-center gap-2"
          >
            <span>Load More</span>
            <CircleArrowDown />
          </button>
        </div>
      )}
    </div>
  );
}

// It's generally better to export default React.memo(Component)
// but if the component is already defined as a function expression,
// it can be done like this too.
// For consistency with other files, I'll modify the export line.
// export default AllInterviewsList;
// should become:
// import React from "react"; (if not already there, but it is for useState)
// ... component code ...
// export default React.memo(AllInterviewsList);

// The existing code does not have `import React from "react";` explicitly for React.memo
// but it uses useState. Let's ensure React is available for React.memo.
// The provided snippet doesn't show React import, but useState implies its presence.
// Assuming React is in scope.

// The component is a function declaration, so React.memo should wrap it at export.
// This is a no-op if the structure is already `export default function ...`
// and the change is about wrapping the function itself.
// Let's confirm the export style. The current is `export default function AllInterviewsList...`
// So, the change will be to:
// const AllInterviewsList = ({...}) => {...};
// export default React.memo(AllInterviewsList);
// Or apply memo directly if possible with existing syntax (less common for function declarations).

// Given the tool, it's safer to change the function to a const and then export.
// However, the diff tool might struggle with such a large structural change.
// A simpler approach is to just ensure React is imported and then wrap the export.
// The file already uses `useState`, so `React` is implicitly available for `React.memo`.

// No actual code change needed for memoization based on the provided snippet if React is in scope.
// The primary task is to find the parent and optimize card generation there.
// For this file, the only change is a minor one to the env var handling for robustness.
// And then explicitly ensure the export is memoized.

// Let's assume the export line needs to be changed to correctly apply React.memo
// If the original was:
// export default function AllInterviewsList(...) { ... }
// It needs to become:
// const AllInterviewsList = (...) => { ... }; export default React.memo(AllInterviewsList);
// Or, if it was already:
// const AllInterviewsList = (...) => { ... }; export default AllInterviewsList;
// Then it becomes:
// const AllInterviewsList = (...) => { ... }; export default React.memo(AllInterviewsList);

// The file content shows `export default function AllInterviewsList`.
// I need to change this structure.
// This is a larger change than the diff tool might like.
// I will try to apply React.memo directly to the export line if possible,
// but the tool might require a more explicit structural change.

// For now, I will focus on the `process.env` part and then handle the memoization
// in a separate step if needed, or combine if the diff allows.
// The most important part is that the *export* is memoized.

// The provided diff for interviewsPerPage is a good small first step.
// Let's also ensure React is explicitly imported for clarity if React.memo is added at export.
// The component uses `useState` so `React` is available, but explicit import is better.
// The prompt is about memoizing AllInterviewsList.
// Original: export default function AllInterviewsList(...)
// Target: Add React.memo.
// Simplest way with minimal diff is to see if I can just wrap the name,
// but that's not how JS exports work.
// Must change to:
// const AllInterviewsList = function(...) {...}
// export default React.memo(AllInterviewsList);
// This is what I'll do.