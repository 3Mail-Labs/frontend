"use client";

export function NoListsPlaceholder() {
  return (
    <div className="col-span-3 flex flex-col items-center justify-center rounded-md border border-gray-200 bg-white py-12">
      <h2 className="z-10 mb-2 text-xl font-semibold text-gray-700">
        You don&apos;t have any lists yet!
      </h2>
      <button className="rounded-md border border-black bg-black px-10 py-2 text-sm font-medium text-white transition-all duration-75 hover:bg-white hover:text-black active:scale-95">
        Create a list
      </button>
    </div>
  );
}
