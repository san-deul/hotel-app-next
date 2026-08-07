"use client";

import Link from "next/link";

export default function Error({
  error,
  reset,
}: {
  error: Error;
  reset: () => void;
}) {
  return (
    <div className="w-full min-h-[50vh] flex flex-col items-center justify-center gap-4 text-center px-4">
      <p className="text-lg text-gray-700 font-medium">
        일시적인 오류가 발생했습니다.
      </p>
      <p className="text-sm text-gray-500">
        잠시 후 다시 시도하시거나, 메인페이지로 돌아가주세요.
      </p>

      <div className="flex gap-3 mt-2">

        <button
          onClick={() => reset()}
          className="border border-[#3c2c2c] text-[#3c2c2c] px-5 py-2 rounded-lg text-sm"
        >
          다시 시도
        </button>

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