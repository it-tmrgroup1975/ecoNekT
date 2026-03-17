import { Skeleton } from "../../../components/ui/skeleton";

interface EmployeeSkeletonProps {
  viewMode: "list" | "kanban";
  rowCount?: number;
}

export function EmployeeSkeleton({ viewMode, rowCount = 5 }: EmployeeSkeletonProps) {
  if (viewMode === "list") {
    return (
      <div className="space-y-4">
        {/* Search Bar Skeleton */}
        <div className="flex items-center justify-between gap-4">
          <Skeleton className="h-10 w-full max-w-sm rounded-xl" />
          <Skeleton className="h-10 w-32 rounded-xl" />
        </div>

        {/* Table Skeleton */}
        <div className="rounded-2xl border border-primary/5 overflow-hidden shadow-sm">
          <div className="bg-primary/5 h-12 border-b border-primary/5 px-4 flex items-center gap-4">
             <Skeleton className="h-4 w-24" />
             <Skeleton className="h-4 w-32" />
             <Skeleton className="h-4 w-32" />
             <Skeleton className="h-4 w-24" />
          </div>
          <div className="divide-y divide-primary/5">
            {Array.from({ length: rowCount }).map((_, i) => (
              <div key={i} className="px-4 py-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Skeleton className="h-10 w-10 rounded-full" />
                  <div className="space-y-2">
                    <Skeleton className="h-4 w-32" />
                    <Skeleton className="h-3 w-20" />
                  </div>
                </div>
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-4 w-24" />
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {Array.from({ length: rowCount * 2 }).map((_, i) => (
        <div key={i} className="bg-white p-6 rounded-3xl border border-primary/5 space-y-4">
          <div className="flex flex-col items-center text-center space-y-4">
            <Skeleton className="h-24 w-24 rounded-full" />
            <div className="space-y-2 flex flex-col items-center">
              <Skeleton className="h-5 w-40" />
              <Skeleton className="h-4 w-28" />
            </div>
            <Skeleton className="h-6 w-20 rounded-full" />
          </div>
        </div>
      ))}
    </div>
  );
}