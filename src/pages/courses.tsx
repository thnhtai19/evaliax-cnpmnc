import React, { useState } from "react";
import { FaPlus, FaSearch } from "react-icons/fa";
import { Plus, X } from "lucide-react";
import { format } from "date-fns";
import EmployeeActionsDropdown from "@/components/Employee.Drop/EmployeeDropDown";
import Sidebar from "@/components/shared/sidebar";
import { useQuery } from "@tanstack/react-query";
import { getCriteriaList } from "@/service/api/criteria/get-list";
import type { Criteria as CriteriaType } from "@/service/api/criteria/get-list/types";

interface Employee {
  id: string;
  name: string;
  position: string;
  status: "Active" | "Inactive";
  joinedAt: Date;
}

const dummyEmployees: Employee[] = [
  {
    id: "EMP001",
    name: "Nguyễn Văn A",
    position: "Kế toán",
    status: "Active",
    joinedAt: new Date("2022-03-15"),
  },
  {
    id: "EMP002",
    name: "Trần Thị B",
    position: "Nhân sự",
    status: "Active",
    joinedAt: new Date("2021-11-20"),
  },
  {
    id: "EMP003",
    name: "Lê Văn C",
    position: "IT Support",
    status: "Inactive",
    joinedAt: new Date("2020-05-01"),
  },
  {
    id: "EMP004",
    name: "Phạm Thị D",
    position: "Kỹ sư phần mềm",
    status: "Active",
    joinedAt: new Date("2023-01-05"),
  },
];

interface ScoreFormData {
  criteriaId: number;
  score: number;
  comment: string;
}

interface AssessmentFormData {
  employeeId: string;
  scores: ScoreFormData[];
}

const EmployeeList: React.FC = () => {
  const [employees] = useState<Employee[]>(dummyEmployees);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [perPage, setPerPage] = useState(5);
  const [page, setPage] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState<AssessmentFormData>({
    employeeId: "",
    scores: [
      {
        criteriaId: 0,
        score: 0,
        comment: "",
      },
    ],
  });

  const { data: criteriaData } = useQuery({
    queryKey: ["criteria"],
    queryFn: () => getCriteriaList({}),
  });

  const criteriaList: CriteriaType[] = criteriaData?.payload?.data || [];

  const filtered = employees
    .filter(
      (emp) =>
        emp.name.toLowerCase().includes(search.toLowerCase()) || emp.id.toLowerCase().includes(search.toLowerCase()),
    )
    .filter((emp) => statusFilter === "All" || emp.status === statusFilter);

  const currentData = filtered.slice((page - 1) * perPage, page * perPage);

  const handleOpenAssessmentModal = (employeeId: string) => {
    setFormData({
      employeeId: employeeId,
      scores: [
        {
          criteriaId: 0,
          score: 0,
          comment: "",
        },
      ],
    });
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setFormData({
      employeeId: "",
      scores: [
        {
          criteriaId: 0,
          score: 0,
          comment: "",
        },
      ],
    });
  };

  const handleAddScore = () => {
    setFormData({
      ...formData,
      scores: [
        ...formData.scores,
        {
          criteriaId: 0,
          score: 0,
          comment: "",
        },
      ],
    });
  };

  const handleRemoveScore = (index: number) => {
    setFormData({
      ...formData,
      scores: formData.scores.filter((_, i) => i !== index),
    });
  };

  const handleScoreChange = (index: number, field: keyof ScoreFormData, value: number | string) => {
    const newScores = [...formData.scores];
    newScores[index] = {
      ...newScores[index],
      [field]: value,
    };
    setFormData({
      ...formData,
      scores: newScores,
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.employeeId && formData.scores.length > 0) {
      // Validate all scores have criteriaId and score
      const isValid = formData.scores.every(
        (score) => score.criteriaId > 0 && score.score > 0 && score.comment.trim() !== "",
      );
      if (isValid) {
        console.log("Submit assessment:", formData);
        // TODO: Call API to create assessment
        handleCloseModal();
      }
    }
  };

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar />

      <main className="flex-1 overflow-auto">
        <div className="p-8">
          <div className="p-6 bg-white shadow-lg rounded-xl max-w-full">
            <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-6 gap-4">
              <h2 className="text-2xl font-bold text-gray-800">Danh sách nhân viên</h2>
              <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md transition">
                <FaPlus /> Thêm nhân viên
              </button>
            </div>

            {/* Controls */}
            <div className="flex flex-col md:flex-row items-center gap-4 mb-4">
              <div className="relative w-full md:max-w-xs">
                <input
                  type="text"
                  placeholder="Tìm kiếm theo tên hoặc mã"
                  className="w-full border border-gray-300 rounded-md py-2 pl-10 pr-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={search}
                  onChange={(e) => {
                    setSearch(e.target.value);
                    setPage(1);
                  }}
                />
                <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              </div>

              <select
                className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none"
                value={statusFilter}
                onChange={(e) => {
                  setStatusFilter(e.target.value);
                  setPage(1);
                }}
              >
                <option value="All">Tất cả trạng thái</option>
                <option value="Active">Đang làm</option>
                <option value="Inactive">Đã nghỉ</option>
              </select>

              <select
                className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none"
                value={perPage}
                onChange={(e) => {
                  setPerPage(Number(e.target.value));
                  setPage(1);
                }}
              >
                {[5, 10, 20].map((n) => (
                  <option key={n} value={n}>
                    {n}/trang
                  </option>
                ))}
              </select>
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
              <table className="min-w-full text-sm text-gray-700 border border-gray-200 rounded-lg">
                <thead className="bg-gray-100 text-xs text-gray-600 uppercase tracking-wide">
                  <tr>
                    <th className="px-4 py-3 text-left">Mã NV</th>
                    <th className="px-4 py-3 text-left">Tên nhân viên</th>
                    <th className="px-4 py-3 text-left">Chức vụ</th>
                    <th className="px-4 py-3 text-center">Trạng thái</th>
                    <th className="px-4 py-3 text-left">Ngày vào</th>
                    <th className="px-4 py-3 text-center">Hành động</th>
                  </tr>
                </thead>
                <tbody>
                  {currentData.map((emp) => (
                    <tr key={emp.id} className="border-t hover:bg-gray-50 transition">
                      <td className="px-4 py-3">{emp.id}</td>
                      <td className="px-4 py-3 font-medium">{emp.name}</td>
                      <td className="px-4 py-3">{emp.position}</td>
                      <td className="px-4 py-3 text-center">
                        <span
                          className={`inline-block px-2 py-1 text-xs font-semibold rounded-full ${
                            emp.status === "Active" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-700"
                          }`}
                        >
                          {emp.status === "Active" ? "Đang làm" : "Đã nghỉ"}
                        </span>
                      </td>
                      <td className="px-4 py-3">{format(emp.joinedAt, "dd/MM/yyyy")}</td>
                      <td className="px-4 py-3 text-center">
                        <EmployeeActionsDropdown
                          onViewDetails={() => handleOpenAssessmentModal(emp.id)}
                          onEdit={() => alert(`Chỉnh sửa ${emp.name}`)}
                          onDelete={() => confirm(`Bạn chắc chắn muốn xoá ${emp.name}?`)}
                        />
                      </td>
                    </tr>
                  ))}
                  {currentData.length === 0 && (
                    <tr>
                      <td colSpan={5} className="text-center text-gray-400 py-6">
                        Không tìm thấy nhân viên phù hợp.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </main>

      {/* Modal Thêm Đánh Giá */}
      {isModalOpen && (
        <div
          className="fixed inset-0 flex items-center justify-center z-50 backdrop-blur-sm bg-white/30"
          onClick={handleCloseModal}
        >
          <div
            className="bg-white rounded-lg shadow-xl w-full max-w-3xl mx-4 max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-bold text-gray-800">Thêm đánh giá mới</h3>
                <button onClick={handleCloseModal} className="text-gray-400 hover:text-gray-600 text-2xl font-bold">
                  ×
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    ID Nhân viên <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.employeeId}
                    disabled
                    className="w-full border border-gray-300 rounded-md px-3 py-2 bg-gray-100 text-gray-600 cursor-not-allowed"
                  />
                </div>

                <div className="border-t pt-4">
                  <div className="flex justify-between items-center mb-3">
                    <label className="block text-sm font-medium text-gray-700">
                      Danh sách tiêu chí đánh giá <span className="text-red-500">*</span>
                    </label>
                    <button
                      type="button"
                      onClick={handleAddScore}
                      className="flex items-center gap-2 px-3 py-1 text-sm bg-green-600 hover:bg-green-700 text-white rounded-md transition"
                    >
                      <Plus className="size-4" /> Thêm tiêu chí
                    </button>
                  </div>

                  <div className="space-y-4">
                    {formData.scores.map((score, index) => (
                      <div key={index} className="border border-gray-200 rounded-lg p-4 bg-gray-50">
                        <div className="flex justify-between items-center mb-3">
                          <span className="text-sm font-semibold text-gray-700">Tiêu chí #{index + 1}</span>
                          {formData.scores.length > 1 && (
                            <button
                              type="button"
                              onClick={() => handleRemoveScore(index)}
                              className="text-red-600 hover:text-red-800 transition"
                            >
                              <X className="size-4" />
                            </button>
                          )}
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          <div>
                            <label className="block text-xs font-medium text-gray-600 mb-1">
                              Tiêu chí <span className="text-red-500">*</span>
                            </label>
                            <select
                              required
                              value={score.criteriaId || ""}
                              onChange={(e) => handleScoreChange(index, "criteriaId", Number(e.target.value))}
                              className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                              <option value="">Chọn tiêu chí</option>
                              {criteriaList.map((criteria) => (
                                <option key={criteria.criteriaId} value={criteria.criteriaId}>
                                  {criteria.name} (ID: {criteria.criteriaId})
                                </option>
                              ))}
                            </select>
                          </div>

                          <div>
                            <label className="block text-xs font-medium text-gray-600 mb-1">
                              Điểm <span className="text-red-500">*</span>
                            </label>
                            <input
                              type="number"
                              required
                              min="0"
                              max="100"
                              value={score.score || ""}
                              onChange={(e) => handleScoreChange(index, "score", Number(e.target.value))}
                              className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                              placeholder="0-100"
                            />
                          </div>
                        </div>

                        <div className="mt-3">
                          <label className="block text-xs font-medium text-gray-600 mb-1">
                            Nhận xét <span className="text-red-500">*</span>
                          </label>
                          <textarea
                            required
                            value={score.comment}
                            onChange={(e) => handleScoreChange(index, "comment", e.target.value)}
                            className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="Nhập nhận xét..."
                            rows={2}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex gap-3 pt-4 border-t">
                  <button
                    type="button"
                    onClick={handleCloseModal}
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition"
                  >
                    Hủy
                  </button>
                  <button
                    type="submit"
                    className="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md transition"
                  >
                    Tạo đánh giá
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EmployeeList;
