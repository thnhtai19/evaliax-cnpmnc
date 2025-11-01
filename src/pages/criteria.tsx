import React, { useState } from "react";
import Sidebar from "@/components/shared/sidebar";
import { CriteriaList } from "@/components/criteria/table";
import type { Criteria } from "@/service/api/criteria/get-list/types";
import { toast } from "react-toastify";

const dummyCriteria: Criteria[] = [
  {
    criteriaId: 1,
    name: "Kỹ năng giao tiếp",
    description: "Khả năng giao tiếp hiệu quả với đồng nghiệp và khách hàng",
    weight: 8,
    category: "SOFTSKILL",
  },
  {
    criteriaId: 2,
    name: "Kiến thức JavaScript",
    description: "Hiểu biết sâu về JavaScript và các framework liên quan",
    weight: 9,
    category: "HARDSKILL",
  },
  {
    criteriaId: 3,
    name: "Làm việc nhóm",
    description: "Khả năng hợp tác và làm việc hiệu quả trong nhóm",
    weight: 7,
    category: "SOFTSKILL",
  },
  {
    criteriaId: 4,
    name: "Kiến thức React",
    description: "Nắm vững React, hooks, và các best practices",
    weight: 10,
    category: "HARDSKILL",
  },
  {
    criteriaId: 5,
    name: "Quản lý thời gian",
    description: "Khả năng quản lý và phân bổ thời gian hiệu quả",
    weight: 7,
    category: "SOFTSKILL",
  },
  {
    criteriaId: 6,
    name: "Kiến thức Node.js",
    description: "Hiểu biết về Node.js và backend development",
    weight: 8,
    category: "HARDSKILL",
  },
  {
    criteriaId: 7,
    name: "Giải quyết vấn đề",
    description: "Khả năng phân tích và giải quyết các vấn đề phức tạp",
    weight: 9,
    category: "SOFTSKILL",
  },
  {
    criteriaId: 8,
    name: "Kiến thức TypeScript",
    description: "Sử dụng thành thạo TypeScript trong development",
    weight: 9,
    category: "HARDSKILL",
  },
  {
    criteriaId: 9,
    name: "Lãnh đạo",
    description: "Khả năng lãnh đạo và hướng dẫn team",
    weight: 8,
    category: "SOFTSKILL",
  },
  {
    criteriaId: 10,
    name: "Kiến thức Database",
    description: "Hiểu biết về SQL và NoSQL databases",
    weight: 8,
    category: "HARDSKILL",
  },
];

const CriteriaPage: React.FC = () => {
  const [criteriaList, setCriteriaList] = useState<Criteria[]>(dummyCriteria);
  // const { data: criteriaList, isLoading, error } = useSearchCriteria();
  // if (isLoading) return <div>Loading...</div>;
  // if (error) return <div>Error: {error.message}</div>;

  const handleAddCriteria = (newCriteria: Omit<Criteria, "criteriaId">) => {
    setCriteriaList((prevList) => {
      const maxId = prevList.length > 0 ? Math.max(...prevList.map((c) => c.criteriaId)) : 0;
      const criteria: Criteria = {
        ...newCriteria,
        criteriaId: maxId + 1,
      };

      return [...prevList, criteria];
    });
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
