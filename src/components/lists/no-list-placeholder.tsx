"use client";

export function NoListsPlaceholder() {
  return (
    <div className="col-span-3 flex flex-col items-center justify-center rounded-md border border-border py-12">
      <h2 className="z-10 text-lg font-medium">You don&apos;t have any lists yet!</h2>
    </div>
  );
}
