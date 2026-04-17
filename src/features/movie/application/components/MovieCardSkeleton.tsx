import { Card, Skeleton } from "@heroui/react";
import React from "react";

export const MovieCardSkeleton: React.FC = () => {
  return (
    <Card className="relative overflow-hidden w-[320px] h-[568px] flex-shrink-0 p-0 m-0">
      <Skeleton className="w-full h-full rounded-none" />
      <div
        className="absolute top-0 left-0 right-0 h-32 z-5 pointer-events-none"
        style={{
          background:
            "linear-gradient(180deg, rgba(0, 0, 0, 0.9) 0%, rgba(0, 0, 0, 0.5) 60%, transparent 100%)",
        }}
      />

      <Card.Header className="absolute top-0 left-0 right-0 h-32 flex-col items-start justify-start p-4 z-10">
        <Skeleton className="w-4/5 h-6 mb-2 rounded-lg bg-white/20" />
        <Skeleton className="w-2/5 h-5 rounded-lg bg-white/20" />
      </Card.Header>

      <Card.Footer className="absolute bottom-0 z-10 p-3 flex flex-col gap-2 w-full">
        <div className="w-full flex gap-2 justify-between">
          <Skeleton className="w-24 h-8 rounded-full bg-white/10" />
          <Skeleton className="w-28 h-8 rounded-full bg-white/10" />
        </div>
      </Card.Footer>
    </Card>
  );
};
