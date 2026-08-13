import Link from "next/link";

export default function UnderConstruction() {
  return (
    <div className="w-full min-h-[50vh] flex flex-col items-center justify-center gap-4 text-center px-4">
      <p className="text-lg text-gray-700 font-medium">
        현재 페이지는 아직 작업 중입니다.
      </p>
      <p className="text-sm text-gray-500">
        빠른 시일 내에 찾아뵙겠습니다.
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