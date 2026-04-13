"use client";

import * as React from "react";
import * as ProgressPrimitive from "@radix-ui/react-progress";

const Progress = ({ value }: { value: number }) => {
  return (
    <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
      <div
        className="h-full transition-all"
        style={{
          width: `${value}%`,
          background: "linear-gradient(to right, #7f1d1d, #b91c1c, #f59e0b)",
        }}
      />
    </div>
  );
};

export { Progress };