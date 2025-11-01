// components/EmployeeActionsDropdown.tsx
import React, { useState, useRef, useEffect } from "react";
import { MdDeleteForever } from "react-icons/md";

interface Props {
  onViewAssessments?: () => void;
  onEdit: () => void;
  onDelete: () => void;
}

const EmployeeActionsDropdown: React.FC<Props> = ({ onViewAssessments, onEdit, onDelete }) => {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  // Đóng dropdown khi click ra ngoài
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative inline-block text-left" ref={ref}>
      <button onClick={() => setOpen(!open)} className="text-gray-500 hover:text-gray-700 px-2 py-1" title="Hành động">
        ⋮
      </button>

      {open && (
        <div className="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-gray-200 z-50">
          <div className="py-1 text-sm text-gray-700">
            {onViewAssessments && (
              <button
                onClick={() => {
                  onViewAssessments();
                  setOpen(false);
                }}
                className="w-full text-left px-4 py-2 hover:bg-gray-100"
              >
                📋 Xem các đánh giá
              </button>
            )}
            <button
              onClick={() => {
                onEdit();
                setOpen(false);
              }}
              className="w-full text-left px-4 py-2 hover:bg-gray-100"
            >
              ✏️ Chỉnh sửa thông tin
            </button>
            <button
              onClick={() => {
                onDelete();
                setOpen(false);
              }}
              className=" flex gap-3 justify-items-center w-full text-left px-4 py-2 hover:bg-gray-100 text-red-600"
            >
              <MdDeleteForever size={18} /> <span>Xoá nhân viên</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default EmployeeActionsDropdown;
