export default function Modal({ item, close }: any) {
  if (!item) return null;

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex justify-center items-center z-50">
      <div className="bg-[#1a1a1a] p-6 rounded-xl w-[90%] max-w-md border border-[#262626]">
        <h1 className="text-2xl font-bold mb-2">{item.title}</h1>
        <p className="text-gray-400 mb-4">
          {item.type === "podcast"
            ? `${item.author} • ${item.duration}`
            : `${item.author} • ${item.readTime}`}
        </p>

        <a
          href={item.url}
          target="_blank"
          className="block bg-white text-black px-4 py-2 rounded-md text-center font-semibold"
        >
          Open
        </a>

        <button
          className="mt-4 w-full text-white border border-gray-600 py-2 rounded-md"
          onClick={close}
        >
          Close
        </button>
      </div>
    </div>
  );
}
