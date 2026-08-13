import Link from "next/link";

export default function NotFound() {
  return (
    <div className="w-full min-h-[50vh] flex flex-col items-center justify-center gap-4 text-center px-4">
      <p className="text-lg text-gray-700 font-medium">
        잘못된 주소입니다.
      </p>
      <p className="text-sm text-gray-500">
        요청하신 페이지를 찾을 수 없습니다.
      </p>

      <div className="flex gap-3 mt-2">
        <Link
          href="/"
          className="bg-[#3c2c2c] text-white px-5 py-2 rounded-lg text-sm"
        >
          메인으로
        </Link>
      </div>
    </div>
  );
}