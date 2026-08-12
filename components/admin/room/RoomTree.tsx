"use client";

import Tree from "rc-tree";
import type { DataNode, EventDataNode } from "rc-tree/es/interface";
import "rc-tree/assets/index.css";
import { createClient } from "@/lib/supabase/client";
import { useQueryClient } from "@tanstack/react-query";
import { deleteRoom, deleteRoomGroup, type RoomRow } from "@/lib/api/room";
import { roomsKey } from "@/hooks/queries/useRooms";

interface RoomTreeNode extends DataNode {
  raw: RoomRow;
}

interface RoomTreeProps {
  data: RoomRow[];
  onRoomSelect: (room: RoomRow) => void;
}

export default function RoomTree({ data, onRoomSelect }: RoomTreeProps) {
  const supabase = createClient();
  const queryClient = useQueryClient();

  const categories = data
    .filter((r) => r.depth === 0)
    .sort((a, b) => a.room_no - b.room_no);

  const treeData: RoomTreeNode[] = categories.map((cat) => {
    const children: RoomTreeNode[] = data
      .filter((r) => r.depth === 1 && String(r.parent_no) === String(cat.room_no))
      .sort((a, b) => a.room_no - b.room_no)
      .map((child) => ({
        key: `room-${child.room_no}`,
        title: <TreeItem label={child.room_name} onDelete={() => handleDelete(child)} />,
        isLeaf: true,
        raw: child,
      }));

    return {
      key: `cat-${cat.room_no}`,
      title: <TreeItem label={cat.room_name} onDelete={() => handleDelete(cat)} />,
      isLeaf: false,
      raw: cat,
      children,
    };
  });

  const handleSelect = (_keys: React.Key[], info: { node: EventDataNode<RoomTreeNode> }) => {
    if (info.node.raw) {
      onRoomSelect(info.node.raw);
    }
  };

  const handleDelete = async (room: RoomRow) => {
    const ok = window.confirm(`${room.room_name}를 삭제하시겠습니까?`);
    if (!ok) return;

    try {
      if (room.depth === 0) {
        await deleteRoomGroup(supabase, room);
      } else {
        await deleteRoom(supabase, room);
      }
      queryClient.invalidateQueries({ queryKey: roomsKey });
    } catch (e) {
      if (e instanceof Error && e.message === "HAS_RESERVATION") {
        alert("예약이 존재하는 객실은 삭제할 수 없습니다.");
      } else if (e instanceof Error && e.message === "CHILD_HAS_RESERVATION") {
        alert("하위 객실 중 예약이 존재하여 삭제할 수 없습니다.");
      } else {
        alert("삭제 중 오류가 발생했습니다.");
      }
    }
  };

  return <Tree treeData={treeData} defaultExpandAll onSelect={handleSelect} />;
}

function TreeItem({ label, onDelete }: { label: string; onDelete: () => void }) {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        width: "100%",
        marginLeft: "3px",
      }}
    >
      <span>{label}</span>
      <button
        onClick={(e) => {
          e.stopPropagation();
          onDelete();
        }}
        style={{
          border: "none",
          background: "transparent",
          cursor: "pointer",
          color: "#ff4d4f",
          fontSize: "14px",
        }}
      >
        ✕
      </button>
    </div>
  );
}