import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import Sidebar from "@/components/shared/sidebar";
import { format } from "date-fns";
import { FileText } from "lucide-react";
import type { AssessmentResponse } from "@/lib/mockAssessmentData";
import { mockAssessmentData } from "@/lib/mockAssessmentData";

// Example API call using axios and TanStack Query
const fetchUserData = async () => {
  // Replace with your actual API endpoint
  const response = await axios.get("https://jsonplaceholder.typicode.com/users/1");
  return response.data;
};

// Get assessments for employee ID 46
const getEmployeeAssessments = (employeeId: number): AssessmentResponse => {
  const filtered = mockAssessmentData.data.filter((assessment) => assessment.employee.id === employeeId);
  return {
    message: "Success",
    status: 200,
    data: filtered,
  };
};

export default function Dashboard() {
  const { data, isLoading, error } = useQuery({
    queryKey: ["user"],
    queryFn: fetchUserData,
  });

  // Get assessments for employee ID 46
  const employeeAssessments = getEmployeeAssessments(46);

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar />

      {/* Main Content */}
      <main className="flex-1 overflow-auto">
        <div className="p-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-6">Tổng quan</h1>

          <div className="space-y-6">
            {/* Thông tin người dùng */}
            <div className="bg-white p-8 rounded-lg shadow-sm border">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">Thông tin người dùng</h2>

              {isLoading && <p className="text-gray-600">Đang tải...</p>}

              {error && <p className="text-red-600">Lỗi tải dữ liệu: {error.message}</p>}

              {data && (
                <div className="space-y-3">
                  <p className="text-gray-700">
                    <span className="font-semibold">Tên:</span> {data.name}
                  </p>
                  <p className="text-gray-700">
                    <span className="font-semibold">Email:</span> {data.email}
                  </p>
                  <p className="text-gray-700">
                    <span className="font-semibold">Tên đăng nhập:</span> {data.username}
                  </p>
                </div>
              )}
            </div>

            {/* Bảng đánh giá nhân viên ID 46 */}
            <div className="bg-white p-6 rounded-lg shadow-sm border">
              <div className="flex items-center gap-3 mb-4">
                <FileText className="size-6 text-blue-600" />
                <h2 className="text-xl font-semibold text-gray-800">
                  Đánh giá của {employeeAssessments.data[0]?.employee?.name || "Nhân viên"} (ID: 46)
                </h2>
              </div>

              {employeeAssessments.data.length === 0 ? (
                <div className="text-center py-8">
                  <FileText className="size-12 text-gray-300 mx-auto mb-2" />
                  <p className="text-gray-600">Chưa có đánh giá nào</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="min-w-full text-sm text-gray-700 border border-gray-200 rounded-lg">
                    <thead className="bg-gray-100 text-xs text-gray-600 uppercase tracking-wide">
                      <tr>
                        <th className="px-4 py-3 text-center">STT</th>
                        <th className="px-4 py-3 text-center">Tổng điểm</th>
                        <th className="px-4 py-3 text-center">Số tiêu chí</th>
                        <th className="px-4 py-3 text-left">Ngày tạo</th>
                      </tr>
                    </thead>
                    <tbody>
                      {employeeAssessments.data.map((assessment, index) => (
                        <tr key={assessment.assessmentId} className="border-t hover:bg-gray-50 transition">
                          <td className="px-4 py-3 text-center font-medium text-gray-900">{index + 1}</td>
                          <td className="px-4 py-3 text-center">
                            <span className="text-lg font-bold text-blue-600">{assessment.totalScore.toFixed(2)}</span>
                          </td>
                          <td className="px-4 py-3 text-center">
                            <span className="px-2 py-1 bg-blue-50 text-blue-700 rounded-md font-medium">
                              {assessment.criteriaScores.length}
                            </span>
                          </td>
                          <td className="px-4 py-3 text-gray-600">
                            {format(new Date(assessment.createdAt), "dd/MM/yyyy HH:mm")}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
