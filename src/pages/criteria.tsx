import React from "react";
import Sidebar from "@/components/shared/sidebar";
import { CriteriaList } from "@/components/criteria/table";
import type { Criteria } from "@/service/api/criteria/get-list/types";
import { toast } from "react-toastify";
import { useSearchCriteria } from "@/components/criteria/hooks/useSearchCriteria";

const CriteriaPage: React.FC = () => {
  const { data: criteriaList = [], isLoading, error } = useSearchCriteria();

  if (isLoading) {
    return (
      <div className="flex h-screen bg-gray-50">
        <Sidebar />
        <main className="flex-1 overflow-auto flex items-center justify-center">
          <div className="text-gray-600">Đang tải dữ liệu...</div>
        </main>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex h-screen bg-gray-50">
        <Sidebar />
        <main className="flex-1 overflow-auto flex items-center justify-center">
          <div className="text-red-600">Lỗi: {error instanceof Error ? error.message : "Có lỗi xảy ra"}</div>
        </main>
      </div>
    );
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const handleAddCriteria = (_newCriteria: Omit<Criteria, "criteriaId">) => {
    // TODO: Implement API call to add criteria
    toast.success("Tạo mới tiêu chí thành công!");
  };

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar />
      <main className="flex-1 overflow-auto">
        <div className="p-8">
          <CriteriaList criteriaList={criteriaList} onAddCriteria={handleAddCriteria} />
        </div>
      </main>
    </div>
  );
};

export default CriteriaPage;
