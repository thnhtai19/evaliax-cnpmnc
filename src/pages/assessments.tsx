import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import Sidebar from "@/components/shared/sidebar";
import { format } from "date-fns";
import { FileText, Loader2, Eye, ChevronUp, Plus, X } from "lucide-react";
import { useState } from "react";
import { getCriteriaList } from "@/service/api/criteria/get-list";
import type { Criteria as CriteriaType } from "@/service/api/criteria/get-list/types";
import { getSupervisorAssessments } from "@/service/api/assessments/get-supervisor";
import { createAssessment } from "@/service/api/assessments/create";
import { getEmployeeList } from "@/service/api/employee/get-list";
import { toast } from "react-toastify";

const getStatusBadge = (status: string) => {
  const statusMap: Record<string, { bg: string; text: string; label: string }> = {
    InProgress: { bg: "bg-yellow-100", text: "text-yellow-800", label: "Đang tiến hành" },
    Completed: { bg: "bg-green-100", text: "text-green-800", label: "Hoàn thành" },
    Published: { bg: "bg-green-100", text: "text-green-800", label: "Đã công bố" },
    Pending: { bg: "bg-gray-100", text: "text-gray-800", label: "Chờ xử lý" },
    Draft: { bg: "bg-blue-100", text: "text-blue-800", label: "Bản nháp" },
  };

  const statusConfig = statusMap[status] || { bg: "bg-gray-100", text: "text-gray-800", label: status };
  return (
    <span
      className={`inline-block px-2 py-1 text-xs font-semibold rounded-full ${statusConfig.bg} ${statusConfig.text}`}
    >
      {statusConfig.label}
    </span>
  );
};

interface ScoreFormData {
  criteriaId: number;
  score: number;
  comment: string;
}

interface AssessmentFormData {
  employeeId: number;
  scores: ScoreFormData[];
}

export default function AssessmentsPage() {
  const queryClient = useQueryClient();

  const { data, isLoading, error } = useQuery({
    queryKey: ["assessments"],
    queryFn: getSupervisorAssessments,
  });

  const { data: criteriaData } = useQuery({
    queryKey: ["criteria"],
    queryFn: () => getCriteriaList({}),
  });

  const { data: employeeData } = useQuery({
    queryKey: ["employees"],
    queryFn: () => getEmployeeList({ page: 0, size: 100 }),
  });

  const [expandedRows, setExpandedRows] = useState<Set<number>>(new Set());
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(5);
  const [formData, setFormData] = useState<AssessmentFormData>({
    employeeId: 0,
    scores: [
      {
        criteriaId: 0,
        score: 0,
        comment: "",
      },
    ],
  });

  const toggleRow = (assessmentId: number) => {
    const newExpanded = new Set(expandedRows);
    if (newExpanded.has(assessmentId)) {
      newExpanded.delete(assessmentId);
    } else {
      newExpanded.add(assessmentId);
    }
    setExpandedRows(newExpanded);
  };

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setFormData({
      employeeId: 0,
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

  // Mutation để tạo assessment
  const createMutation = useMutation({
    mutationFn: createAssessment,
    onSuccess: () => {
      toast.success("Tạo đánh giá thành công!");
      // Invalidate và refetch danh sách assessments
      queryClient.invalidateQueries({ queryKey: ["assessments"] });
      handleCloseModal();
    },
    onError: (error) => {
      toast.error(`Lỗi khi tạo đánh giá: ${error instanceof Error ? error.message : "Có lỗi xảy ra"}`);
      console.error("Create assessment error:", error);
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.employeeId > 0 && formData.scores.length > 0) {
      // Validate all scores have criteriaId and score
      const isValid = formData.scores.every(
        (score) => score.criteriaId > 0 && score.score > 0 && score.comment.trim() !== "",
      );
      if (isValid) {
        createMutation.mutate({
          employeeId: formData.employeeId,
          scores: formData.scores.map((score) => ({
            criteriaId: score.criteriaId,
            score: score.score,
            comment: score.comment.trim(),
          })),
        });
      } else {
        toast.error("Vui lòng điền đầy đủ thông tin cho tất cả tiêu chí");
      }
    } else {
      toast.error("Vui lòng chọn nhân viên và thêm ít nhất một tiêu chí");
    }
  };

  const criteriaList: CriteriaType[] = criteriaData?.data || [];
  const employeeList = employeeData?.content || [];
  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar />

      {/* Main Content */}
      <main className="flex-1 overflow-auto">
        <div className="p-8">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <FileText className="size-8 text-blue-600" />
              <h1 className="text-3xl font-bold text-gray-900">Tất cả đánh giá</h1>
            </div>
            <button
              onClick={handleOpenModal}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md transition shadow-sm"
            >
              <Plus className="size-4" /> Thêm đánh giá
            </button>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm border">
            {isLoading && (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="size-8 animate-spin text-blue-600" />
                <span className="ml-3 text-gray-600">Đang tải dữ liệu...</span>
              </div>
            )}

            {error && (
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-4">
                <p className="text-yellow-800 font-semibold">Cảnh báo: Không thể kết nối API</p>
                <p className="text-yellow-600 text-sm mt-1">Đang sử dụng dữ liệu mẫu để hiển thị</p>
              </div>
            )}

            {!isLoading && (
              <>
                {!data || !data.data || data.data.length === 0 ? (
                  <div className="text-center py-12">
                    <FileText className="size-16 text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-600 text-lg">Chưa có đánh giá nào</p>
                  </div>
                ) : (
                  <>
                    {/* Pagination Controls - Top */}
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-gray-600">Hiển thị:</span>
                        <select
                          value={perPage}
                          onChange={(e) => {
                            setPerPage(Number(e.target.value));
                            setPage(1);
                          }}
                          className="border border-gray-300 rounded-md px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                          <option value={5}>5</option>
                          <option value={10}>10</option>
                          <option value={20}>20</option>
                          <option value={50}>50</option>
                        </select>
                        <span className="text-sm text-gray-600">mỗi trang</span>
                      </div>
                      <div className="text-sm text-gray-600">
                        Hiển thị {(page - 1) * perPage + 1} - {Math.min(page * perPage, data.data.length)} trong tổng số{" "}
                        {data.data.length} đánh giá
                      </div>
                    </div>

                    <div className="overflow-x-auto">
                      <table className="min-w-full text-sm text-gray-700 border border-gray-200 rounded-lg">
                        <thead className="bg-gray-100 text-xs text-gray-600 uppercase tracking-wide">
                          <tr>
                            <th className="px-4 py-3 text-left">ID đánh giá</th>
                            <th className="px-4 py-3 text-left">Nhân viên</th>
                            <th className="px-4 py-3 text-center">Trạng thái</th>
                            <th className="px-4 py-3 text-center">Tổng điểm</th>
                            <th className="px-4 py-3 text-center">Số tiêu chí</th>
                            <th className="px-4 py-3 text-left">Ngày tạo</th>
                            <th className="px-4 py-3 text-center">Hành động</th>
                          </tr>
                        </thead>
                        <tbody>
                          {data.data.slice((page - 1) * perPage, page * perPage).map((assessment) => {
                            const isExpanded = expandedRows.has(assessment.assessmentId);
                            return (
                              <>
                                <tr
                                  key={assessment.assessmentId}
                                  className="border-t hover:bg-gray-50 transition cursor-pointer"
                                >
                                  <td className="px-4 py-3 font-medium text-gray-900">#{assessment.assessmentId}</td>
                                  <td className="px-4 py-3">
                                    <div>
                                      <p className="font-semibold text-gray-900">{assessment.employee.name}</p>
                                      <p className="text-xs text-gray-500">{assessment.employee.email}</p>
                                      <p className="text-xs text-gray-400">ID: {assessment.employee.id}</p>
                                    </div>
                                  </td>
                                  <td className="px-4 py-3 text-center">{getStatusBadge(assessment.status)}</td>
                                  <td className="px-4 py-3 text-center">
                                    <span className="text-lg font-bold text-blue-600">
                                      {assessment.totalScore.toFixed(2)}
                                    </span>
                                  </td>
                                  <td className="px-4 py-3 text-center">
                                    <span className="px-2 py-1 bg-blue-50 text-blue-700 rounded-md font-medium">
                                      {assessment.criteriaScores.length}
                                    </span>
                                  </td>
                                  <td className="px-4 py-3 text-gray-600">
                                    {format(new Date(assessment.createdAt), "dd/MM/yyyy HH:mm")}
                                  </td>
                                  <td className="px-4 py-3 text-center">
                                    <button
                                      onClick={() => toggleRow(assessment.assessmentId)}
                                      className="flex items-center justify-center gap-1 px-3 py-1.5 text-sm text-blue-600 hover:bg-blue-50 rounded-md transition"
                                    >
                                      {isExpanded ? (
                                        <>
                                          <ChevronUp className="size-4" />
                                          <span>Thu gọn</span>
                                        </>
                                      ) : (
                                        <>
                                          <Eye className="size-4" />
                                          <span>Chi tiết</span>
                                        </>
                                      )}
                                    </button>
                                  </td>
                                </tr>
                                {isExpanded && (
                                  <tr className="bg-gray-50">
                                    <td colSpan={7} className="px-4 py-4">
                                      <div className="space-y-4">
                                        <div>
                                          <h4 className="text-sm font-semibold text-gray-700 mb-3 uppercase">
                                            Chi tiết điểm số ({assessment.criteriaScores.length} tiêu chí)
                                          </h4>
                                          <div className="overflow-x-auto">
                                            <table className="min-w-full text-sm border border-gray-200 rounded-lg bg-white">
                                              <thead className="bg-gray-100">
                                                <tr>
                                                  <th className="px-3 py-2 text-left text-xs font-semibold text-gray-600">
                                                    Tiêu chí
                                                  </th>
                                                  <th className="px-3 py-2 text-left text-xs font-semibold text-gray-600">
                                                    Mô tả
                                                  </th>
                                                  <th className="px-3 py-2 text-center text-xs font-semibold text-gray-600">
                                                    Điểm
                                                  </th>
                                                  <th className="px-3 py-2 text-center text-xs font-semibold text-gray-600">
                                                    Trọng số
                                                  </th>
                                                  <th className="px-3 py-2 text-center text-xs font-semibold text-gray-600">
                                                    Loại
                                                  </th>
                                                  <th className="px-3 py-2 text-left text-xs font-semibold text-gray-600">
                                                    Nhận xét
                                                  </th>
                                                </tr>
                                              </thead>
                                              <tbody>
                                                {assessment.criteriaScores.map((criteriaScore, index) => (
                                                  <tr key={index} className="border-t hover:bg-gray-50">
                                                    <td className="px-3 py-3">
                                                      <div>
                                                        <p className="font-semibold text-gray-900">
                                                          {criteriaScore.criteria.criteriaName}
                                                        </p>
                                                        <p className="text-xs text-gray-400">
                                                          ID: {criteriaScore.criteria.criteriaId}
                                                        </p>
                                                      </div>
                                                    </td>
                                                    <td className="px-3 py-3 text-gray-600 max-w-xs">
                                                      <p className="text-xs">{criteriaScore.criteria.description}</p>
                                                    </td>
                                                    <td className="px-3 py-3 text-center">
                                                      <span className="text-lg font-bold text-blue-600">
                                                        {criteriaScore.score}
                                                      </span>
                                                    </td>
                                                    <td className="px-3 py-3 text-center">
                                                      <span className="px-2 py-1 bg-gray-100 text-gray-700 rounded-md text-xs font-medium">
                                                        {criteriaScore.criteria.weight}
                                                      </span>
                                                    </td>
                                                    <td className="px-3 py-3 text-center">
                                                      <span className="px-2 py-1 bg-purple-50 text-purple-700 rounded-md text-xs font-medium">
                                                        {criteriaScore.criteria.category}
                                                      </span>
                                                    </td>
                                                    <td className="px-3 py-3 text-gray-700 max-w-md">
                                                      <p className="text-sm">{criteriaScore.comment || "-"}</p>
                                                    </td>
                                                  </tr>
                                                ))}
                                              </tbody>
                                            </table>
                                          </div>
                                        </div>
                                      </div>
                                    </td>
                                  </tr>
                                )}
                              </>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>

                    {/* Pagination Controls - Bottom */}
                    {data.data.length > perPage && (
                      <div className="flex items-center justify-between mt-4">
                        <div className="text-sm text-gray-600">
                          Hiển thị {(page - 1) * perPage + 1} - {Math.min(page * perPage, data.data.length)} trong tổng
                          số {data.data.length} đánh giá
                        </div>
                        <div className="flex gap-2">
                          <button
                            onClick={() => setPage((p) => Math.max(1, p - 1))}
                            disabled={page === 1}
                            className="px-3 py-2 border border-gray-300 rounded-md text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                          >
                            Trước
                          </button>
                          <span className="px-3 py-2 text-sm text-gray-700">
                            Trang {page} / {Math.ceil(data.data.length / perPage)}
                          </span>
                          <button
                            onClick={() => setPage((p) => Math.min(Math.ceil(data.data.length / perPage), p + 1))}
                            disabled={page >= Math.ceil(data.data.length / perPage)}
                            className="px-3 py-2 border border-gray-300 rounded-md text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                          >
                            Sau
                          </button>
                        </div>
                      </div>
                    )}
                  </>
                )}
              </>
            )}
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
                    Nhân viên <span className="text-red-500">*</span>
                  </label>
                  <select
                    required
                    value={formData.employeeId || ""}
                    onChange={(e) => setFormData({ ...formData, employeeId: Number(e.target.value) })}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Chọn nhân viên</option>
                    {employeeList.map((employee) => (
                      <option key={employee.id} value={employee.id}>
                        {employee.name} (ID: {employee.id}) - {employee.email}
                      </option>
                    ))}
                  </select>
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
                    disabled={createMutation.isPending}
                    className="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md transition disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {createMutation.isPending ? "Đang tạo..." : "Tạo đánh giá"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
