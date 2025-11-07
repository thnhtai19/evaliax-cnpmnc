import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import Sidebar from "@/components/shared/sidebar";
import { format } from "date-fns";
import { FileText, Loader2, Plus, Edit, ArrowLeft, X } from "lucide-react";
import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getAssessmentsByEmployee } from "@/service/api/assessments/get-by-employee";
import { FaFileExport } from "react-icons/fa";
import * as XLSX from "xlsx";
import { createAssessment } from "@/service/api/assessments/create";
import { updateAssessment, type UpdateAssessmentRequest } from "@/service/api/assessments/update";
import { updateAssessmentStatus } from "@/service/api/assessments/update-status";
import { getCriteriaList } from "@/service/api/criteria/get-list";
import type { Criteria as CriteriaType } from "@/service/api/criteria/get-list/types";
import { toast } from "react-toastify";
import type { Assessment } from "@/service/api/assessments/get-supervisor/types";

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

export default function AssessmentsByEmployeePage() {
  const { employeeId } = useParams<{ employeeId: string }>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const employeeIdNum = employeeId ? parseInt(employeeId, 10) : 0;

  const { data, isLoading, error } = useQuery({
    queryKey: ["employee-assessments", employeeIdNum],
    queryFn: () => getAssessmentsByEmployee(employeeIdNum),
    enabled: !!employeeIdNum,
  });

  const { data: criteriaData } = useQuery({
    queryKey: ["criteria"],
    queryFn: () => getCriteriaList({}),
  });

  const [expandedRows, setExpandedRows] = useState<Set<number>>(new Set());
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isStatusModalOpen, setIsStatusModalOpen] = useState(false);
  const [editingAssessment, setEditingAssessment] = useState<Assessment | null>(null);
  const [updatingStatusAssessment, setUpdatingStatusAssessment] = useState<Assessment | null>(null);
  const [formData, setFormData] = useState<AssessmentFormData>({
    employeeId: employeeIdNum,
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
    setFormData({
      employeeId: employeeIdNum,
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
      employeeId: employeeIdNum,
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

    // Validate score range (0-100), cho phép nhập 0
    if (field === "score") {
      const numValue = typeof value === "string" ? Number(value) : value;
      if (!isNaN(numValue)) {
        if (numValue < 0) {
          value = 0;
        } else if (numValue > 100) {
          value = 100;
        } else {
          value = numValue; // Cho phép 0-100
        }
      }
    }

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
      queryClient.invalidateQueries({ queryKey: ["employee-assessments", employeeIdNum] });
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
      toast.error("Vui lòng thêm ít nhất một tiêu chí");
    }
  };

  const criteriaList: CriteriaType[] = criteriaData?.data || [];

  // Handler mở modal cập nhật status
  const handleOpenStatusModal = (assessment: Assessment) => {
    setUpdatingStatusAssessment(assessment);
    setIsStatusModalOpen(true);
  };

  // Handler đóng modal cập nhật status
  const handleCloseStatusModal = () => {
    setIsStatusModalOpen(false);
    setUpdatingStatusAssessment(null);
  };

  // Mutation để cập nhật status
  const updateStatusMutation = useMutation({
    mutationFn: ({ assessmentId, status }: { assessmentId: number; status: string }) =>
      updateAssessmentStatus(assessmentId, { status }),
    onSuccess: () => {
      toast.success("Cập nhật trạng thái thành công!");
      // Invalidate và refetch danh sách assessments
      queryClient.invalidateQueries({ queryKey: ["employee-assessments", employeeIdNum] });
      handleCloseStatusModal();
    },
    onError: (error) => {
      toast.error(`Lỗi khi cập nhật trạng thái: ${error instanceof Error ? error.message : "Có lỗi xảy ra"}`);
      console.error("Update status error:", error);
    },
  });

  const handleUpdateStatus = () => {
    if (!updatingStatusAssessment) {
      toast.error("Không tìm thấy đánh giá");
      return;
    }

    // Tự động set status là "Published"
    updateStatusMutation.mutate({
      assessmentId: updatingStatusAssessment.assessmentId,
      status: "Published",
    });
  };

  const handleOpenEditModal = (assessment: Assessment) => {
    setEditingAssessment(assessment);
    setFormData({
      employeeId: assessment.employee.id,
      scores: assessment.criteriaScores.map((criteriaScore) => ({
        criteriaId: criteriaScore.criteria.criteriaId,
        score: criteriaScore.score,
        comment: criteriaScore.comment || "",
      })),
    });
    setIsEditModalOpen(true);
  };

  const handleCloseEditModal = () => {
    setIsEditModalOpen(false);
    setEditingAssessment(null);
    setFormData({
      employeeId: employeeIdNum,
      scores: [
        {
          criteriaId: 0,
          score: 0,
          comment: "",
        },
      ],
    });
  };

  // Mutation để cập nhật assessment
  const updateMutation = useMutation({
    mutationFn: ({ assessmentId, data }: { assessmentId: number; data: UpdateAssessmentRequest }) =>
      updateAssessment(assessmentId, data),
    onSuccess: () => {
      toast.success("Cập nhật đánh giá thành công!");
      // Invalidate và refetch danh sách assessments
      queryClient.invalidateQueries({ queryKey: ["employee-assessments", employeeIdNum] });
      handleCloseEditModal();
    },
    onError: (error) => {
      toast.error(`Lỗi khi cập nhật đánh giá: ${error instanceof Error ? error.message : "Có lỗi xảy ra"}`);
      console.error("Update assessment error:", error);
    },
  });

  const handleUpdateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingAssessment) return;

    if (formData.employeeId > 0 && formData.scores.length > 0) {
      // Validate all scores have criteriaId and score
      const isValid = formData.scores.every(
        (score) => score.criteriaId > 0 && score.score > 0 && score.comment.trim() !== "",
      );
      if (isValid) {
        updateMutation.mutate({
          assessmentId: editingAssessment.assessmentId,
          data: {
            employeeId: formData.employeeId,
            scores: formData.scores.map((score) => ({
              criteriaId: score.criteriaId,
              score: score.score,
              comment: score.comment.trim(),
            })),
          },
        });
      } else {
        toast.error("Vui lòng điền đầy đủ thông tin cho tất cả tiêu chí");
      }
    } else {
      toast.error("Vui lòng thêm ít nhất một tiêu chí");
    }
  };

  const handleExportToExcel = () => {
    if (!data || !data.data || data.data.length === 0) {
      alert("Không có dữ liệu để xuất");
      return;
    }

    // Prepare main assessments data
    const assessmentsData = data.data.map((assessment, index) => ({
      STT: index + 1,
      "ID Đánh giá": assessment.assessmentId,
      "Tên nhân viên": assessment.employee.name,
      "Email nhân viên": assessment.employee.email,
      "Người đánh giá": assessment.supervisor.name,
      "Trạng thái":
        assessment.status === "InProgress"
          ? "Đang tiến hành"
          : assessment.status === "Completed"
            ? "Hoàn thành"
            : assessment.status === "Pending"
              ? "Chờ xử lý"
              : assessment.status === "Draft"
                ? "Bản nháp"
                : assessment.status,
      "Tổng điểm": assessment.totalScore.toFixed(2),
      "Số tiêu chí": assessment.criteriaScores.length,
      "Ngày tạo": format(new Date(assessment.createdAt), "dd/MM/yyyy HH:mm"),
    }));

    // Prepare detailed criteria scores data
    interface DetailedCriteriaData {
      "STT Đánh giá": number;
      "ID Đánh giá": number;
      "STT Tiêu chí": number;
      "ID Tiêu chí": number;
      "Tên tiêu chí": string;
      "Mô tả": string;
      Loại: string;
      "Trọng số": number;
      Điểm: number;
      "Nhận xét": string;
    }
    const detailedData: DetailedCriteriaData[] = [];
    data.data.forEach((assessment, assessmentIndex) => {
      assessment.criteriaScores.forEach((criteriaScore, criteriaIndex) => {
        detailedData.push({
          "STT Đánh giá": assessmentIndex + 1,
          "ID Đánh giá": assessment.assessmentId,
          "STT Tiêu chí": criteriaIndex + 1,
          "ID Tiêu chí": criteriaScore.criteria.criteriaId,
          "Tên tiêu chí": criteriaScore.criteria.criteriaName,
          "Mô tả": criteriaScore.criteria.description,
          Loại: criteriaScore.criteria.category,
          "Trọng số": criteriaScore.criteria.weight,
          Điểm: criteriaScore.score,
          "Nhận xét": criteriaScore.comment || "-",
        });
      });
    });

    const wb = XLSX.utils.book_new();

    const wsAssessments = XLSX.utils.json_to_sheet(assessmentsData);
    const wsDetails = XLSX.utils.json_to_sheet(detailedData);

    wsAssessments["!cols"] = [
      { wch: 5 }, // STT
      { wch: 12 }, // ID Đánh giá
      { wch: 20 }, // Tên nhân viên
      { wch: 30 }, // Email nhân viên
      { wch: 20 }, // Người đánh giá
      { wch: 15 }, // Trạng thái
      { wch: 12 }, // Tổng điểm
      { wch: 12 }, // Số tiêu chí
      { wch: 18 }, // Ngày tạo
    ];

    wsDetails["!cols"] = [
      { wch: 12 }, // STT Đánh giá
      { wch: 12 }, // ID Đánh giá
      { wch: 12 }, // STT Tiêu chí
      { wch: 12 }, // ID Tiêu chí
      { wch: 30 }, // Tên tiêu chí
      { wch: 40 }, // Mô tả
      { wch: 15 }, // Loại
      { wch: 10 }, // Trọng số
      { wch: 8 }, // Điểm
      { wch: 40 }, // Nhận xét
    ];

    // Add worksheets to workbook
    XLSX.utils.book_append_sheet(wb, wsAssessments, "Tổng quan đánh giá");
    XLSX.utils.book_append_sheet(wb, wsDetails, "Chi tiết tiêu chí");

    // Generate filename with employee name and current date
    const fileName = `Danh_gia_${employeeName.replace(/\s+/g, "_")}_${format(new Date(), "dd-MM-yyyy_HH-mm")}.xlsx`;

    // Save file
    XLSX.writeFile(wb, fileName);
  };

  const employeeName = data?.data?.[0]?.employee?.name || "Nhân viên";

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar />

      {/* Main Content */}
      <main className="flex-1 overflow-auto">
        <div className="p-8">
          {/* Breadcrumb */}
          <nav className="flex mb-6" aria-label="Breadcrumb">
            <ol className="inline-flex items-center space-x-1 md:space-x-3">
              <li className="inline-flex items-center">
                <button
                  onClick={() => navigate("/employee")}
                  className="inline-flex items-center text-sm font-medium text-gray-700 hover:text-blue-600"
                >
                  Nhân viên
                </button>
              </li>
              <li>
                <div className="flex items-center">
                  <svg
                    className="w-3 h-3 text-gray-400 mx-1"
                    aria-hidden="true"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 6 10"
                  >
                    <path
                      stroke="currentColor"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="m1 9 4-4-4-4"
                    />
                  </svg>
                  <span className="ml-1 text-sm font-medium text-gray-500 md:ml-2">Tất cả đánh giá</span>
                </div>
              </li>
            </ol>
          </nav>

          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <button
                onClick={() => navigate("/employee")}
                className="p-2 hover:bg-gray-100 rounded-lg transition"
                title="Quay lại"
              >
                <ArrowLeft className="size-5 text-gray-600" />
              </button>
              <FileText className="size-8 text-blue-600" />
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Đánh giá của {employeeName}</h1>
                <p className="text-sm text-gray-500">ID nhân viên: {employeeId}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={handleExportToExcel}
                className="flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-md transition cursor-pointer"
                title="Xuất file Excel"
              >
                <FaFileExport className="size-4" />
                Xuất Excel
              </button>
              <button
                onClick={handleOpenModal}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md transition cursor-pointer"
              >
                <Plus className="size-4" />
                Tạo đánh giá mới
              </button>
            </div>
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
                    <p className="text-gray-600 text-lg mb-4">Chưa có đánh giá nào cho nhân viên này</p>
                    <button
                      onClick={handleOpenModal}
                      className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md transition"
                    >
                      <Plus className="size-4" />
                      Tạo đánh giá đầu tiên
                    </button>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="min-w-full text-sm text-gray-700 border border-gray-200 rounded-lg">
                      <thead className="bg-gray-100 text-xs text-gray-600 uppercase tracking-wide">
                        <tr>
                          <th className="px-4 py-3 text-center">STT</th>
                          <th className="px-4 py-3 text-center">Trạng thái</th>
                          <th className="px-4 py-3 text-center">Tổng điểm</th>
                          <th className="px-4 py-3 text-center">Số tiêu chí</th>
                          <th className="px-4 py-3 text-left">Ngày tạo</th>
                          <th className="px-4 py-3 text-center">Hành động</th>
                        </tr>
                      </thead>
                      <tbody>
                        {data.data.map((assessment, index) => {
                          const isExpanded = expandedRows.has(assessment.assessmentId);
                          return (
                            <>
                              <tr key={assessment.assessmentId} className="border-t hover:bg-gray-50 transition">
                                <td className="px-4 py-3 text-center font-medium text-gray-900">{index + 1}</td>
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
                                  <div className="flex items-center justify-center gap-2">
                                    {assessment.status !== "Published" && (
                                      <button
                                        onClick={() => handleOpenStatusModal(assessment)}
                                        className="flex items-center gap-1 px-3 py-1.5 text-sm text-purple-600 hover:bg-purple-50 rounded-md transition"
                                        title="Cập nhật trạng thái"
                                      >
                                        <span>Cập nhật trạng thái</span>
                                      </button>
                                    )}
                                    <button
                                      onClick={() => handleOpenEditModal(assessment)}
                                      className="flex items-center gap-1 px-3 py-1.5 text-sm text-green-600 hover:bg-green-50 rounded-md transition"
                                      title="Chỉnh sửa"
                                    >
                                      <Edit className="size-4" />
                                      <span>Sửa</span>
                                    </button>
                                    <button
                                      onClick={() => toggleRow(assessment.assessmentId)}
                                      className="flex items-center gap-1 px-3 py-1.5 text-sm text-blue-600 hover:bg-blue-50 rounded-md transition"
                                      title={isExpanded ? "Thu gọn" : "Chi tiết"}
                                    >
                                      {isExpanded ? "Thu gọn" : "Chi tiết"}
                                    </button>
                                  </div>
                                </td>
                              </tr>
                              {isExpanded && (
                                <tr className="bg-gray-50">
                                  <td colSpan={6} className="px-4 py-4">
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
                )}
              </>
            )}
          </div>
        </div>
      </main>

      {/* Modal Tạo Đánh Giá */}
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
                <h3 className="text-xl font-bold text-gray-800">Tạo đánh giá mới</h3>
                <button
                  onClick={handleCloseModal}
                  className="text-gray-400 hover:text-gray-600 text-2xl font-bold"
                  disabled={createMutation.isPending}
                >
                  ×
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Nhân viên <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={`${data?.data?.[0]?.employee?.name || "Nhân viên"} (ID: ${employeeIdNum})`}
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
                              step="1"
                              value={score.score || ""}
                              onChange={(e) => {
                                const inputValue = e.target.value;
                                if (inputValue === "") {
                                  handleScoreChange(index, "score", "");
                                  return;
                                }
                                const numValue = Number(inputValue);
                                if (!isNaN(numValue)) {
                                  const clampedValue = Math.max(0, Math.min(100, numValue));
                                  handleScoreChange(index, "score", clampedValue);
                                }
                              }}
                              onBlur={(e) => {
                                const inputValue = e.target.value;
                                if (inputValue === "") {
                                  handleScoreChange(index, "score", 0);
                                  return;
                                }
                                const numValue = Number(inputValue);
                                if (!isNaN(numValue)) {
                                  const clampedValue = Math.max(0, Math.min(100, numValue));
                                  handleScoreChange(index, "score", clampedValue);
                                }
                              }}
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
                    disabled={createMutation.isPending}
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition disabled:opacity-50 disabled:cursor-not-allowed"
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

      {/* Modal Sửa Đánh Giá */}
      {isEditModalOpen && editingAssessment && (
        <div
          className="fixed inset-0 flex items-center justify-center z-50 backdrop-blur-sm bg-white/30"
          onClick={handleCloseEditModal}
        >
          <div
            className="bg-white rounded-lg shadow-xl w-full max-w-3xl mx-4 max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-bold text-gray-800">Sửa đánh giá #{editingAssessment.assessmentId}</h3>
                <button
                  onClick={handleCloseEditModal}
                  className="text-gray-400 hover:text-gray-600 text-2xl font-bold"
                  disabled={updateMutation.isPending}
                >
                  ×
                </button>
              </div>

              <form onSubmit={handleUpdateSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Nhân viên <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={`${editingAssessment.employee.name} (ID: ${editingAssessment.employee.id})`}
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
                              step="1"
                              value={score.score || ""}
                              onChange={(e) => {
                                const inputValue = e.target.value;
                                if (inputValue === "") {
                                  handleScoreChange(index, "score", "");
                                  return;
                                }
                                const numValue = Number(inputValue);
                                if (!isNaN(numValue)) {
                                  const clampedValue = Math.max(0, Math.min(100, numValue));
                                  handleScoreChange(index, "score", clampedValue);
                                }
                              }}
                              onBlur={(e) => {
                                const inputValue = e.target.value;
                                if (inputValue === "") {
                                  handleScoreChange(index, "score", 0);
                                  return;
                                }
                                const numValue = Number(inputValue);
                                if (!isNaN(numValue)) {
                                  const clampedValue = Math.max(0, Math.min(100, numValue));
                                  handleScoreChange(index, "score", clampedValue);
                                }
                              }}
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
                    onClick={handleCloseEditModal}
                    disabled={updateMutation.isPending}
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Hủy
                  </button>
                  <button
                    type="submit"
                    disabled={updateMutation.isPending}
                    className="flex-1 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-md transition disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {updateMutation.isPending ? "Đang cập nhật..." : "Cập nhật đánh giá"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Modal Xác Nhận Cập Nhật Trạng Thái */}
      {isStatusModalOpen && updatingStatusAssessment && (
        <div
          className="fixed inset-0 flex items-center justify-center z-50 backdrop-blur-sm bg-white/30"
          onClick={handleCloseStatusModal}
        >
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md mx-4" onClick={(e) => e.stopPropagation()}>
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-bold text-gray-800">
                  Xác nhận cập nhật trạng thái đánh giá #{updatingStatusAssessment.assessmentId}
                </h3>
                <button
                  onClick={handleCloseStatusModal}
                  className="text-gray-400 hover:text-gray-600 text-2xl font-bold"
                  disabled={updateStatusMutation.isPending}
                >
                  ×
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <p className="text-gray-700 mb-4">
                    Bạn có chắc chắn muốn cập nhật trạng thái đánh giá này thành{" "}
                    <span className="font-semibold">"Đã công bố"</span>?
                  </p>
                  <div className="mt-3">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Trạng thái hiện tại</label>
                    <div>{getStatusBadge(updatingStatusAssessment.status)}</div>
                  </div>
                  <div className="mt-3">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Trạng thái mới</label>
                    <div>{getStatusBadge("Published")}</div>
                  </div>
                </div>

                <div className="flex gap-3 pt-4 border-t">
                  <button
                    type="button"
                    onClick={handleCloseStatusModal}
                    disabled={updateStatusMutation.isPending}
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Hủy
                  </button>
                  <button
                    type="button"
                    onClick={handleUpdateStatus}
                    disabled={updateStatusMutation.isPending}
                    className="flex-1 px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-md transition disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {updateStatusMutation.isPending ? "Đang cập nhật..." : "Xác nhận"}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
