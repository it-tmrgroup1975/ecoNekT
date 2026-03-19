import { Skeleton } from "../ui/skeleton";

// Skeleton for Dashboard Header & Stats
export const DashboardSkeleton = () => (
  <div className="space-y-6 p-4">
    <div className="flex items-center justify-between">
      <div className="space-y-2">
        <Skeleton className="h-4 w-[100px]" />
        <Skeleton className="h-6 w-[150px]" />
      </div>
      <Skeleton className="h-12 w-12 rounded-full" />
    </div>
    <div className="grid grid-cols-2 gap-4">
      <Skeleton className="h-24 w-full rounded-xl" />
      <Skeleton className="h-24 w-full rounded-xl" />
    </div>
    <Skeleton className="h-40 w-full rounded-xl" />
     <div className="grid grid-cols-2 gap-4">
      <Skeleton className="h-24 w-full rounded-xl" />
      <Skeleton className="h-24 w-full rounded-xl" />
    </div>
    <Skeleton className="h-40 w-full rounded-xl" />
  </div>
);

// Skeleton for List items (Payroll/Notifications)
export const ListSkeleton = () => (
  <div className="space-y-4 p-4">
    {[1, 2, 3, 4, 5].map((i) => (
      <div key={i} className="flex items-center space-x-4 border-b pb-4">
        <Skeleton className="h-10 w-10 rounded-full" />
        <div className="flex-1 space-y-2">
          <Skeleton className="h-4 w-[60%]" />
          <Skeleton className="h-3 w-[40%]" />
        </div>
        <Skeleton className="h-4 w-[50px]" />
      </div>
    ))}
  </div>
);