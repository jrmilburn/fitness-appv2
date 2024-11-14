
export default function Home() {
  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <div className="grid grid-cols-2 grid-rows-2 w-full h-full gap-4">
        <div className="bg-gray-200">Item 1</div>
        <div className="bg-gray-300">Item 2</div>
        <div className="bg-gray-400">Item 3</div>
        <div className="bg-gray-500">Item 4</div>
      </div>
    </div>
  );
}
