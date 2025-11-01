import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import Sidebar from "@/components/shared/sidebar";
import { format } from "date-fns";
import { FileText, Loader2, Eye, ChevronUp } from "lucide-react";
import { useState } from "react";

// TypeScript interfaces based on the API response
interface Criteria {
  criteriaId: number;
  criteriaName: string;
  description: string;
  weight: number;
  category: string;
}

interface CriteriaScore {
  criteria: Criteria;
  score: number;
  comment: string;
}

interface Supervisor {
  id: number;
  name: string;
  email: string;
}

interface Employee {
  id: number;
  name: string;
  email: string;
}

interface Assessment {
  assessmentId: number;
  supervisor: Supervisor;
  employee: Employee;
  status: string;
  totalScore: number;
  criteriaScores: CriteriaScore[];
  createdAt: string;
}

interface AssessmentResponse {
  message: string;
  status: number;
  data: Assessment[];
}

// Mock data for testing
const mockAssessmentData: AssessmentResponse = {
  message: "Success",
  status: 200,
  data: [
    {
      assessmentId: 12,
      supervisor: {
        id: 3,
        name: "Alice Johnson",
        email: "alice.johnson@company.com",
      },
      employee: {
        id: 45,
        name: "Bob Smith",
        email: "bob.smith@company.com",
      },
      status: "InProgress",
      totalScore: 90.45,
      criteriaScores: [
        {
          criteria: {
            criteriaId: 7,
            criteriaName: "Problem Solving",
            description: "Ability to identify issues and propose effective solutions.",
            weight: 3,
            category: "HARDSKILL",
          },
          score: 80,
          comment: "Excellent teamwork and initiative.",
        },
        {
          criteria: {
            criteriaId: 8,
            criteriaName: "Communication",
            description: "Effective verbal and written communication skills.",
            weight: 2,
            category: "SOFTSKILL",
          },
          score: 90,
          comment: "Good technical skills but needs improvement in documentation.",
        },
        {
          criteria: {
            criteriaId: 9,
            criteriaName: "Leadership",
            description: "Ability to lead and inspire team members.",
            weight: 4,
            category: "SOFTSKILL",
          },
          score: 90,
          comment: "Outstanding leadership during project delivery.",
        },
      ],
      createdAt: "2025-11-01T03:45:00Z",
    },
    {
      assessmentId: 13,
      supervisor: {
        id: 3,
        name: "Alice Johnson",
        email: "alice.johnson@company.com",
      },
      employee: {
        id: 46,
        name: "Nguyễn Văn A",
        email: "nguyen.van.a@company.com",
      },
      status: "Completed",
      totalScore: 85.75,
      criteriaScores: [
        {
          criteria: {
            criteriaId: 7,
            criteriaName: "Problem Solving",
            description: "Ability to identify issues and propose effective solutions.",
            weight: 3,
            category: "HARDSKILL",
          },
          score: 85,
          comment: "Shows good analytical thinking and problem-solving abilities.",
        },
        {
          criteria: {
            criteriaId: 10,
            criteriaName: "Technical Skills",
            description: "Proficiency in required technical tools and technologies.",
            weight: 5,
            category: "HARDSKILL",
          },
          score: 90,
          comment: "Very strong technical foundation, constantly learning new technologies.",
        },
        {
          criteria: {
            criteriaId: 11,
            criteriaName: "Time Management",
            description: "Ability to manage time effectively and meet deadlines.",
            weight: 2,
            category: "SOFTSKILL",
          },
          score: 75,
          comment: "Sometimes needs better prioritization of tasks.",
        },
      ],
      createdAt: "2025-10-28T10:30:00Z",
    },
    {
      assessmentId: 14,
      supervisor: {
        id: 4,
        name: "David Lee",
        email: "david.lee@company.com",
      },
      employee: {
        id: 47,
        name: "Trần Thị B",
        email: "tran.thi.b@company.com",
      },
      status: "Pending",
      totalScore: 78.5,
      criteriaScores: [
        {
          criteria: {
            criteriaId: 7,
            criteriaName: "Problem Solving",
            description: "Ability to identify issues and propose effective solutions.",
            weight: 3,
            category: "HARDSKILL",
          },
          score: 75,
          comment: "Adequate problem-solving skills, could benefit from more experience.",
        },
        {
          criteria: {
            criteriaId: 12,
            criteriaName: "Collaboration",
            description: "Ability to work effectively in team environments.",
            weight: 3,
            category: "SOFTSKILL",
          },
          score: 85,
          comment: "Great team player, always willing to help colleagues.",
        },
        {
          criteria: {
            criteriaId: 8,
            criteriaName: "Communication",
            description: "Effective verbal and written communication skills.",
            weight: 2,
            category: "SOFTSKILL",
          },
          score: 80,
          comment: "Clear and professional communication style.",
        },
      ],
      createdAt: "2025-10-25T14:20:00Z",
    },
    {
      assessmentId: 15,
      supervisor: {
        id: 5,
        name: "Sarah Williams",
        email: "sarah.williams@company.com",
      },
      employee: {
        id: 48,
        name: "Lê Văn C",
        email: "le.van.c@company.com",
      },
      status: "Completed",
      totalScore: 92.3,
      criteriaScores: [
        {
          criteria: {
            criteriaId: 10,
            criteriaName: "Technical Skills",
            description: "Proficiency in required technical tools and technologies.",
            weight: 5,
            category: "HARDSKILL",
          },
          score: 95,
          comment: "Exceptional technical expertise, mentor to junior developers.",
        },
        {
          criteria: {
            criteriaId: 7,
            criteriaName: "Problem Solving",
            description: "Ability to identify issues and propose effective solutions.",
            weight: 3,
            category: "HARDSKILL",
          },
          score: 90,
          comment: "Excellent at debugging complex issues quickly.",
        },
        {
          criteria: {
            criteriaId: 13,
            criteriaName: "Innovation",
            description: "Ability to suggest and implement creative solutions.",
            weight: 2,
            category: "HARDSKILL",
          },
          score: 88,
          comment: "Brings fresh perspectives to challenging problems.",
        },
      ],
      createdAt: "2025-10-30T09:15:00Z",
    },
    {
      assessmentId: 16,
      supervisor: {
        id: 3,
        name: "Alice Johnson",
        email: "alice.johnson@company.com",
      },
      employee: {
        id: 49,
        name: "Phạm Thị D",
        email: "pham.thi.d@company.com",
      },
      status: "Draft",
      totalScore: 70.25,
      criteriaScores: [
        {
          criteria: {
            criteriaId: 11,
            criteriaName: "Time Management",
            description: "Ability to manage time effectively and meet deadlines.",
            weight: 2,
            category: "SOFTSKILL",
          },
          score: 65,
          comment: "Needs improvement in meeting project deadlines consistently.",
        },
        {
          criteria: {
            criteriaId: 8,
            criteriaName: "Communication",
            description: "Effective verbal and written communication skills.",
            weight: 2,
            category: "SOFTSKILL",
          },
          score: 70,
          comment: "Basic communication skills, room for improvement.",
        },
        {
          criteria: {
            criteriaId: 12,
            criteriaName: "Collaboration",
            description: "Ability to work effectively in team environments.",
            weight: 3,
            category: "SOFTSKILL",
          },
          score: 75,
          comment: "Works well independently but could engage more with team.",
        },
      ],
      createdAt: "2025-11-02T16:45:00Z",
    },
    {
      assessmentId: 17,
      supervisor: {
        id: 6,
        name: "Michael Chen",
        email: "michael.chen@company.com",
      },
      employee: {
        id: 50,
        name: "Hoàng Văn E",
        email: "hoang.van.e@company.com",
      },
      status: "InProgress",
      totalScore: 88.9,
      criteriaScores: [
        {
          criteria: {
            criteriaId: 9,
            criteriaName: "Leadership",
            description: "Ability to lead and inspire team members.",
            weight: 4,
            category: "SOFTSKILL",
          },
          score: 90,
          comment: "Natural leader, takes initiative in challenging situations.",
        },
        {
          criteria: {
            criteriaId: 7,
            criteriaName: "Problem Solving",
            description: "Ability to identify issues and propose effective solutions.",
            weight: 3,
            category: "HARDSKILL",
          },
          score: 88,
          comment: "Strong analytical skills and systematic approach.",
        },
        {
          criteria: {
            criteriaId: 10,
            criteriaName: "Technical Skills",
            description: "Proficiency in required technical tools and technologies.",
            weight: 5,
            category: "HARDSKILL",
          },
          score: 87,
          comment: "Solid technical foundation with continuous learning mindset.",
        },
      ],
      createdAt: "2025-11-03T11:20:00Z",
    },
    {
      assessmentId: 18,
      supervisor: {
        id: 4,
        name: "David Lee",
        email: "david.lee@company.com",
      },
      employee: {
        id: 51,
        name: "Võ Thị F",
        email: "vo.thi.f@company.com",
      },
      status: "Completed",
      totalScore: 81.6,
      criteriaScores: [
        {
          criteria: {
            criteriaId: 8,
            criteriaName: "Communication",
            description: "Effective verbal and written communication skills.",
            weight: 2,
            category: "SOFTSKILL",
          },
          score: 85,
          comment: "Excellent written and verbal communication skills.",
        },
        {
          criteria: {
            criteriaId: 12,
            criteriaName: "Collaboration",
            description: "Ability to work effectively in team environments.",
            weight: 3,
            category: "SOFTSKILL",
          },
          score: 82,
          comment: "Works well in cross-functional teams.",
        },
        {
          criteria: {
            criteriaId: 11,
            criteriaName: "Time Management",
            description: "Ability to manage time effectively and meet deadlines.",
            weight: 2,
            category: "SOFTSKILL",
          },
          score: 78,
          comment: "Generally good time management, occasional delays.",
        },
      ],
      createdAt: "2025-10-27T08:10:00Z",
    },
  ],
};

// API function to fetch assessments
const fetchAssessments = async (): Promise<AssessmentResponse> => {
  try {
    // Replace with your actual API endpoint
    const response = await axios.get<unknown>("/api/assessments", {
      headers: {
        "Content-Type": "application/json",
      },
    });

    // Check if response is string (HTML) instead of JSON
    if (typeof response.data === "string" || response.data === null || response.data === undefined) {
      console.warn("API returned HTML or invalid response, using mock data");
      return mockAssessmentData;
    }

    // Check if response has expected structure
    const data = response.data as AssessmentResponse;
    if (data && typeof data === "object" && "data" in data && Array.isArray(data.data)) {
      return data;
    }

    // If response structure is invalid, use mock data
    console.warn("API returned invalid response structure, using mock data");
    return mockAssessmentData;
  } catch (error) {
    // Fallback to mock data if API fails
    console.warn("API call failed, using mock data:", error);
    return mockAssessmentData;
  }
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

export default function AssessmentsPage() {
  const { data, isLoading, error } = useQuery({
    queryKey: ["assessments"],
    queryFn: fetchAssessments,
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
  console.log("data", data);
  console.log(isLoading);
  console.log(error);
  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar />

      {/* Main Content */}
      <main className="flex-1 overflow-auto">
        <div className="p-8">
          <div className="flex items-center gap-3 mb-6">
            <FileText className="size-8 text-blue-600" />
            <h1 className="text-3xl font-bold text-gray-900">Đánh giá nhân viên</h1>
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
                  <div className="overflow-x-auto">
                    <table className="min-w-full text-sm text-gray-700 border border-gray-200 rounded-lg">
                      <thead className="bg-gray-100 text-xs text-gray-600 uppercase tracking-wide">
                        <tr>
                          <th className="px-4 py-3 text-left">ID đánh giá</th>
                          <th className="px-4 py-3 text-left">Nhân viên</th>
                          <th className="px-4 py-3 text-left">Người đánh giá</th>
                          <th className="px-4 py-3 text-center">Trạng thái</th>
                          <th className="px-4 py-3 text-center">Tổng điểm</th>
                          <th className="px-4 py-3 text-center">Số tiêu chí</th>
                          <th className="px-4 py-3 text-left">Ngày tạo</th>
                          <th className="px-4 py-3 text-center">Hành động</th>
                        </tr>
                      </thead>
                      <tbody>
                        {data.data.map((assessment) => {
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
                                <td className="px-4 py-3">
                                  <div>
                                    <p className="font-semibold text-gray-900">{assessment.supervisor.name}</p>
                                    <p className="text-xs text-gray-500">{assessment.supervisor.email}</p>
                                    <p className="text-xs text-gray-400">ID: {assessment.supervisor.id}</p>
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
                                  <td colSpan={8} className="px-4 py-4">
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
