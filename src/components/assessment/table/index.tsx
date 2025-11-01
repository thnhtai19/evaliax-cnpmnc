import Tooltip from "@mui/material/Tooltip";
import { useState } from "react";
import { FaPlus, FaSearch } from "react-icons/fa";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import { format } from "date-fns";

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

interface Assessment {
  assessmentId: number;
  supervisor: Supervisor;
  employee: Employee;
  status: string;
  totalScore: number;
  criteriaScores: CriteriaScore[];
  createdAt: string;
}

const dummyAssessments: Assessment[] = [
  {
    assessmentId: 12,
    supervisor: {
      id: 3,
      name: "Alice Johnson",
      email: "supervisor@gmail.com",
    },
    employee: {
      id: 45,
      name: "Bob Smith",
      email: "employee@gmail.com",
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
          criteriaName: "Teamwork",
          description: "Ability to collaborate effectively with team members.",
          weight: 4,
          category: "SOFTSKILL",
        },
        score: 90,
        comment: "Good technical skills but needs improvement in documentation.",
      },
      {
        criteria: {
          criteriaId: 9,
          criteriaName: "Communication",
          description: "Effective verbal and written communication skills.",
          weight: 3,
          category: "SOFTSKILL",
        },
        score: 95,
        comment: "Strong communication skills demonstrated.",
      },
    ],
    createdAt: new Date("2024-01-15T10:30:00").toISOString(),
  },
  {
    assessmentId: 13,
    supervisor: {
      id: 3,
      name: "Alice Johnson",
      email: "supervisor@gmail.com",
    },
    employee: {
      id: 46,
      name: "Charlie Brown",
      email: "charlie@gmail.com",
    },
    status: "Completed",
    totalScore: 85.5,
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
        comment: "Shows good analytical thinking.",
      },
      {
        criteria: {
          criteriaId: 8,
          criteriaName: "Teamwork",
          description: "Ability to collaborate effectively with team members.",
          weight: 4,
          category: "SOFTSKILL",
        },
        score: 86,
        comment: "Works well in team settings.",
      },
    ],
    createdAt: new Date("2024-01-20T14:15:00").toISOString(),
  },
  {
    assessmentId: 14,
    supervisor: {
      id: 4,
      name: "David Wilson",
      email: "david.wilson@gmail.com",
    },
    employee: {
      id: 47,
      name: "Eva Martinez",
      email: "eva@gmail.com",
    },
    status: "InProgress",
    totalScore: 88.75,
    criteriaScores: [
      {
        criteria: {
          criteriaId: 10,
          criteriaName: "Leadership",
          description: "Capability to lead and guide team members.",
          weight: 5,
          category: "SOFTSKILL",
        },
        score: 88,
        comment: "Demonstrates strong leadership qualities.",
      },
      {
        criteria: {
          criteriaId: 11,
          criteriaName: "Technical Knowledge",
          description: "Depth of technical expertise in relevant domain.",
          weight: 4,
          category: "HARDSKILL",
        },
        score: 89,
        comment: "Excellent technical foundation.",
      },
    ],
    createdAt: new Date("2024-01-25T09:00:00").toISOString(),
  },
];
export const AssessmentTable = () => {
  const [assessments] = useState<Assessment[]>(dummyAssessments);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [perPage, setPerPage] = useState(5);
  const [page, setPage] = useState(1);

  const filtered = assessments
    .filter(
      (assess) =>
        assess.employee.name.toLowerCase().includes(search.toLowerCase()) ||
        assess.supervisor.name.toLowerCase().includes(search.toLowerCase()) ||
        assess.assessmentId.toString().includes(search.toLowerCase()),
    )
    .filter((assess) => statusFilter === "All" || assess.status === statusFilter);

  const totalPages = Math.ceil(filtered.length / perPage);
  const currentData = filtered.slice((page - 1) * perPage, page * perPage);

  // Lấy danh sách status unique để filter
  const statuses = Array.from(new Set(assessments.map((a) => a.status)));

  return (
    <div className="p-6 bg-white shadow-lg rounded-xl w-full">
      <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-6 gap-4">
        <h2 className="text-2xl font-bold text-gray-800">Danh sách đánh giá</h2>
        <div className="flex gap-3">
          <button className="flex cursor-pointer items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md transition shadow-sm">
            <FaPlus /> Thêm đánh giá
          </button>
        </div>
      </div>

      {/* Controls */}
      <div className="flex flex-col md:flex-row items-center gap-4 mb-4">
        <div className="relative w-full md:max-w-xs">
          <input
            type="text"
            placeholder="Tìm kiếm theo tên nhân viên, giám sát hoặc mã đánh giá"
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
          className="border border-gray-300 rounded-md pl-3 pr-8 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
          value={statusFilter}
          onChange={(e) => {
            setStatusFilter(e.target.value);
            setPage(1);
          }}
        >
          <option value="All">Tất cả trạng thái</option>
          {statuses.map((status) => (
            <option key={status} value={status}>
              {status}
            </option>
          ))}
        </select>

        <select
          className="border border-gray-300 rounded-md pl-3 pr-8 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
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
          <thead className="bg-gradient-to-r from-blue-50 to-indigo-50 text-xs text-gray-700 uppercase tracking-wide border-b-2 border-blue-200">
            <tr>
              <th className="px-4 py-3 text-left">Mã ĐG</th>
              <th className="px-4 py-3 text-left">Nhân viên</th>
              <th className="px-4 py-3 text-left">Giám sát</th>
              <th className="px-4 py-3 text-center">Tổng điểm</th>
              <th className="px-4 py-3 text-center">Trạng thái</th>
              <th className="px-4 py-3 text-left">Ngày tạo</th>
              <th className="px-4 py-3 text-center">Hành động</th>
            </tr>
          </thead>
          <tbody>
            {currentData.map((assess) => (
              <tr key={assess.assessmentId} className="border-t hover:bg-gray-50 transition">
                <td className="px-4 py-3 font-medium">#{assess.assessmentId}</td>
                <td className="px-4 py-3">
                  <div>
                    <div className="font-medium text-gray-900">{assess.employee.name}</div>
                    <div className="text-xs text-gray-500">{assess.employee.email}</div>
                  </div>
                </td>
                <td className="px-4 py-3">
                  <div>
                    <div className="font-medium text-gray-900">{assess.supervisor.name}</div>
                    <div className="text-xs text-gray-500">{assess.supervisor.email}</div>
                  </div>
                </td>
                <td className="px-4 py-3 text-center">
                  <span className="inline-block px-3 py-1 text-sm font-semibold rounded-full bg-indigo-100 text-indigo-700 border border-indigo-200">
                    {assess.totalScore.toFixed(2)}
                  </span>
                </td>
                <td className="px-4 py-3 text-center">
                  <span
                    className={`inline-block px-3 py-1 text-xs font-semibold rounded-full ${
                      assess.status === "Completed"
                        ? "bg-green-100 text-green-700 border border-green-200"
                        : assess.status === "InProgress"
                          ? "bg-yellow-100 text-yellow-700 border border-yellow-200"
                          : "bg-gray-100 text-gray-700 border border-gray-200"
                    }`}
                  >
                    {assess.status === "Completed"
                      ? "Hoàn thành"
                      : assess.status === "InProgress"
                        ? "Đang tiến hành"
                        : assess.status}
                  </span>
                </td>
                <td className="px-4 py-3 text-sm text-gray-600">
                  {format(new Date(assess.createdAt), "dd/MM/yyyy HH:mm")}
                </td>
                <td className="px-4 py-3 text-center">
                  <Tooltip title="Xem chi tiết">
                    <VisibilityOutlinedIcon
                      className="text-blue-600 hover:text-blue-800 transition-colors"
                      style={{ fontSize: 20, cursor: "pointer" }}
                    />
                  </Tooltip>
                </td>
              </tr>
            ))}
            {currentData.length === 0 && (
              <tr>
                <td colSpan={7} className="text-center text-gray-400 py-6">
                  Không tìm thấy đánh giá phù hợp.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-2 mt-4">
          <button
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
            className="px-4 py-2 border border-gray-300 rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-blue-50 hover:border-blue-300 hover:text-blue-700 transition-colors"
          >
            Trước
          </button>
          <span className="text-sm font-medium text-gray-700 px-4">
            Trang {page} / {totalPages}
          </span>
          <button
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={page === totalPages}
            className="px-4 py-2 border border-gray-300 rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-blue-50 hover:border-blue-300 hover:text-blue-700 transition-colors"
          >
            Sau
          </button>
        </div>
      )}
    </div>
  );
};
