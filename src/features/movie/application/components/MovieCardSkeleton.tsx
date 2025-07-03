import React from "react";
import { Card, CardHeader, CardFooter } from "@heroui/card";
import { Skeleton } from "@heroui/skeleton";

export const MovieCardSkeleton: React.FC = () => {
  return (
    <Card className="relative overflow-hidden w-80 h-96 flex-shrink-0">
      <Skeleton className="w-full h-full rounded-none" />

      <div
        className="absolute top-0 left-0 right-0 h-32 z-5 pointer-events-none"
        style={{
          background:
            "linear-gradient(180deg, rgba(0, 0, 0, 0.9) 0%, rgba(0, 0, 0, 0.5) 60%, transparent 100%)",
        }}
      />

      <CardHeader className="absolute top-0 left-0 right-0 h-32 flex-col items-start justify-start p-4 z-10">
        <Skeleton className="w-4/5 h-6 mb-2 rounded-lg bg-white/20" />
        <Skeleton className="w-2/5 h-5 rounded-lg bg-white/20" />
      </CardHeader>

      <CardFooter className="absolute bottom-0 z-10 p-2 flex flex-col gap-2 bg-default-50/90 backdrop-blur-sm border-t-1 border-default-200">
        <div className="w-full">
          <Skeleton className="w-full h-8 rounded-lg mb-2" />
          <div className="flex gap-2 flex-wrap">
            <Skeleton className="w-16 h-6 rounded-full" />
            <Skeleton className="w-20 h-6 rounded-full" />
            <Skeleton className="w-24 h-6 rounded-full" />
            <Skeleton className="w-18 h-6 rounded-full" />
          </div>
        </div>
      </CardFooter>
    </Card>
  );
};
