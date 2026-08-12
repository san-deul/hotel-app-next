const ROLE_STYLE: Record<string, string> = {
  admin: "bg-red-100 text-red-600",
  manager: "bg-blue-100 text-blue-600",
};

export default function RoleBadge({ role }: { role: string }) {
  const style = ROLE_STYLE[role] ?? "bg-gray-100 text-gray-600";
  return (
    <span className={`px-3 py-1 text-xs rounded-full font-semibold ${style}`}>
      {role.toUpperCase()}
    </span>
  );
}