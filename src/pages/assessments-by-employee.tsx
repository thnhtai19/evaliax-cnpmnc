import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import Sidebar from "@/components/shared/sidebar";
import { format } from "date-fns";
import { FileText, Loader2, Plus, Edit, ArrowLeft } from "lucide-react";
import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import type { AssessmentResponse } from "@/lib/mockAssessmentData";
import { mockAssessmentData } from "@/lib/mockAssessmentData";

// API function to fetch assessments for a specific employee
const fetchEmployeeAssessments = async (employeeId: number): Promise<AssessmentResponse> => {
  try {
    const response = await axios.get<unknown>(`/api/assessments/employee/${employeeId}`, {
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (typeof response.data === "string" || response.data === null || response.data === undefined) {
      console.warn("API returned HTML or invalid response, using mock data");
      return filterMockDataByEmployee(employeeId);
    }

    const data = response.data as AssessmentResponse;
    if (data && typeof data === "object" && "data" in data && Array.isArray(data.data)) {
      return data;
    }

    console.warn("API returned invalid response structure, using mock data");
    return filterMockDataByEmployee(employeeId);
  } catch (error) {
    console.warn("API call failed, using mock data:", error);
    return filterMockDataByEmployee(employeeId);
  }
};

// Filter mock data by employee ID
const filterMockDataByEmployee = (employeeId: number): AssessmentResponse => {
  const filtered = mockAssessmentData.data.filter((assessment) => assessment.employee.id === employeeId);
  return {
    message: "Success",
    status: 200,
    data: filtered,
  };
};

const getStatusBadge = (status: string) => {
  const statusMap: Record<string, { bg: string; text: string; label: string }> = {
    InProgress: { bg: "bg-yellow-100", text: "text-yellow-800", label: "Đang tiến hành" },
    Completed: { bg: "bg-green-100", text: "text-green-800", label: "Hoàn thành" },
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

export default function AssessmentsByEmployeePage() {
  const { employeeId } = useParams<{ employeeId: string }>();
  const navigate = useNavigate();
  const employeeIdNum = employeeId ? parseInt(employeeId, 10) : 0;

  const { data, isLoading, error } = useQuery({
    queryKey: ["employee-assessments", employeeIdNum],
    queryFn: () => fetchEmployeeAssessments(employeeIdNum),
    enabled: !!employeeIdNum,
  });

  const [expandedRows, setExpandedRows] = useState<Set<number>>(new Set());

  const toggleRow = (assessmentId: number) => {
    const newExpanded = new Set(expandedRows);
    if (newExpanded.has(assessmentId)) {
      newExpanded.delete(assessmentId);
    } else {
      newExpanded.add(assessmentId);
    }
    setExpandedRows(newExpanded);
  };

  const handleCreateAssessment = () => {
    alert(`Tạo đánh giá mới cho nhân viên ID: ${employeeIdNum}`);
    // TODO: Implement create assessment logic
  };

  const handleEditAssessment = (assessmentId: number) => {
    alert(`Chỉnh sửa đánh giá #${assessmentId}`);
    // TODO: Implement edit assessment logic
  };

  const employeeName = data?.data?.[0]?.employee?.name || "Nhân viên";

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar />

      {/* Main Content */}
      <main className="flex-1 overflow-auto">
        <div className="p-8">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <button
                onClick={() => navigate("/courses")}
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
            <button
              onClick={handleCreateAssessment}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md transition"
            >
              <Plus className="size-4" />
              Tạo đánh giá mới
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
                    <p className="text-gray-600 text-lg mb-4">Chưa có đánh giá nào cho nhân viên này</p>
                    <button
                      onClick={handleCreateAssessment}
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
                                    <button
                                      onClick={() => handleEditAssessment(assessment.assessmentId)}
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
    </div>
  );
}
