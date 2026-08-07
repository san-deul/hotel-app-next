import Link from "next/link";


export default function NotFound() {
  return (
    <div className="p-10 text-center">
      <h2 className="text-2xl font-serif mb-4">객실을 찾을 수 없습니다</h2>
      <p className="text-gray-500 mb-6">
        요청하신 객실 정보가 존재하지 않거나 삭제되었습니다.
      </p>
      <Link href="/rooms" className="underline text-[#6d563b]">
        객실 목록으로 돌아가기
      </Link>
    </div>
  );
}