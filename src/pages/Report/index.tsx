import { useState, useMemo } from "react";
import Sidebar from "@/components/shared/sidebar";
import { FileText, Loader2, Search, TrendingUp, Users } from "lucide-react";
import { useEmployeeReports } from "./api";

// Helper function to format date as YYYY-MM-DD
const formatDate = (date: Date): string => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

// Helper function to get default dates
const getDefaultDates = () => {
  const today = new Date();
  const oneMonthAgo = new Date();
  oneMonthAgo.setMonth(today.getMonth() - 1);
  
  return {
    startDate: formatDate(oneMonthAgo),
    endDate: formatDate(today),
  };
};

export default function ReportPage() {
  const defaultDates = useMemo(() => getDefaultDates(), []);
  
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState<"name" | "score" | "assessments">("score");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const [perPage, setPerPage] = useState(10);
  const [page, setPage] = useState(1);
  const [startDate, setStartDate] = useState<string>(defaultDates.startDate);
  const [endDate, setEndDate] = useState<string>(defaultDates.endDate);

  const { data: reports, isLoading, error } = useEmployeeReports(
    startDate || undefined,
    endDate || undefined,
    sortOrder
  );

  // Filter and sort data
  const filteredAndSorted = useMemo(() => {
    if (!reports) return [];

    let filtered = reports.filter(
      (report) =>
        report.employee.name.toLowerCase().includes(search.toLowerCase()) ||
        report.employee.email.toLowerCase().includes(search.toLowerCase()) ||
        report.employee.id.toString().includes(search)
    );

    // Sort data
    filtered = [...filtered].sort((a, b) => {
      let comparison = 0;

      switch (sortBy) {
        case "name":
          comparison = a.employee.name.localeCompare(b.employee.name);
          break;
        case "score":
          // Handle -1.0 scores (no assessments) - put them at the end
          if (a.averageScore === -1 && b.averageScore !== -1) return 1;
          if (a.averageScore !== -1 && b.averageScore === -1) return -1;
          comparison = a.averageScore - b.averageScore;
          break;
        case "assessments":
          comparison = a.totalAssessments - b.totalAssessments;
          break;
      }

      return sortOrder === "asc" ? comparison : -comparison;
    });

    return filtered;
  }, [reports, search, sortBy, sortOrder]);

  const totalPages = Math.ceil(filteredAndSorted.length / perPage);
  const currentData = filteredAndSorted.slice((page - 1) * perPage, page * perPage);

  const handleSort = (field: "name" | "score" | "assessments") => {
    if (sortBy === field) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortBy(field);
      setSortOrder("desc");
    }
    setPage(1);
  };

  const stats = useMemo(() => {
    if (!reports) return { total: 0, withAssessments: 0, averageScore: 0 };

    const withAssessments = reports.filter((r) => r.totalAssessments > 0);
    const validScores = withAssessments.map((r) => r.averageScore);
    const avgScore =
      validScores.length > 0
        ? validScores.reduce((sum, score) => sum + score, 0) / validScores.length
        : 0;

    return {
      total: reports.length,
      withAssessments: withAssessments.length,
      averageScore: avgScore,
    };
  }, [reports]);

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar />
      <main className="flex-1 overflow-auto">
        <div className="p-8">
          <div className="mb-6">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Báo cáo nhân viên</h1>
            <p className="text-gray-600">Tổng quan về điểm đánh giá và số lượng đánh giá của nhân viên</p>
          </div>

          {/* Statistics Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="bg-white p-6 rounded-lg shadow-sm border">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Tổng nhân viên</p>
                  {isLoading ? (
                    <div className="h-8 w-16 bg-gray-200 rounded animate-pulse" />
                  ) : (
                    <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
                  )}
                </div>
                <Users className="size-8 text-blue-500" />
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-sm border">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Đã có đánh giá</p>
                  {isLoading ? (
                    <div className="h-8 w-16 bg-gray-200 rounded animate-pulse" />
                  ) : (
                    <p className="text-2xl font-bold text-gray-900">{stats.withAssessments}</p>
                  )}
                </div>
                <FileText className="size-8 text-green-500" />
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-sm border">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Điểm trung bình</p>
                  {isLoading ? (
                    <div className="h-8 w-16 bg-gray-200 rounded animate-pulse" />
                  ) : (
                    <p className="text-2xl font-bold text-gray-900">
                      {stats.averageScore > 0 ? stats.averageScore.toFixed(2) : "N/A"}
                    </p>
                  )}
                </div>
                <TrendingUp className="size-8 text-purple-500" />
              </div>
            </div>
          </div>

          {/* Report Table */}
          <div className="bg-white rounded-lg shadow-sm border">
            <div className="p-6">
              {/* Search and Filters */}
              <div className="flex flex-col gap-4 mb-6">
                {/* Date Range Filters */}
                <div className="flex flex-col sm:flex-row gap-4">
                  <div className="flex-1">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Ngày bắt đầu
                    </label>
                    <input
                      type="date"
                      value={startDate}
                      onChange={(e) => {
                        setStartDate(e.target.value);
                        setPage(1);
                      }}
                      disabled={isLoading}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
                    />
                  </div>
                  <div className="flex-1">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Ngày kết thúc
                    </label>
                    <input
                      type="date"
                      value={endDate}
                      onChange={(e) => {
                        setEndDate(e.target.value);
                        setPage(1);
                      }}
                      min={startDate || undefined}
                      disabled={isLoading}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
                    />
                  </div>
                  {(startDate || endDate) && (
                    <div className="flex items-end">
                      <button
                        onClick={() => {
                          setStartDate("");
                          setEndDate("");
                          setPage(1);
                        }}
                        disabled={isLoading}
                        className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        Xóa bộ lọc
                      </button>
                    </div>
                  )}
                </div>

                {/* Search and Per Page */}
                <div className="flex flex-col md:flex-row gap-4">
                  <div className="flex-1 relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 size-5" />
                    <input
                      type="text"
                      placeholder="Tìm kiếm theo tên, email hoặc ID..."
                      value={search}
                      onChange={(e) => {
                        setSearch(e.target.value);
                        setPage(1);
                      }}
                      disabled={isLoading}
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
                    />
                  </div>

                  <div className="flex items-end">
                    <select
                      className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
                      value={perPage}
                      onChange={(e) => {
                        setPerPage(Number(e.target.value));
                        setPage(1);
                      }}
                      disabled={isLoading}
                    >
                      {[5, 10, 20, 50].map((n) => (
                        <option key={n} value={n}>
                          {n}/trang
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              {isLoading ? (
                <div className="text-center py-16">
                  <Loader2 className="size-16 text-blue-500 mx-auto mb-4 animate-spin" />
                  <p className="text-lg font-medium text-gray-700 mb-1">Đang tải dữ liệu...</p>
                  <p className="text-sm text-gray-500">Vui lòng đợi trong giây lát</p>
                </div>
              ) : error ? (
                <div className="text-center py-12">
                  <p className="text-red-600">Có lỗi xảy ra khi tải dữ liệu</p>
                </div>
              ) : currentData.length === 0 ? (
                <div className="text-center py-12">
                  <FileText className="size-12 text-gray-300 mx-auto mb-2" />
                  <p className="text-gray-600">Không tìm thấy dữ liệu</p>
                </div>
              ) : (
                <>
                  {/* Table */}
                  <div className="overflow-x-auto">
                    <table className="min-w-full text-sm text-gray-700 border border-gray-200 rounded-lg">
                      <thead className="bg-gradient-to-r from-blue-50 to-indigo-50 text-xs text-gray-700 uppercase tracking-wide border-b-2 border-blue-200">
                        <tr>
                          <th className="px-4 py-3 text-left">STT</th>
                          <th
                            className="px-4 py-3 text-left cursor-pointer hover:bg-blue-100 transition"
                            onClick={() => handleSort("name")}
                          >
                            <div className="flex items-center gap-2">
                              Nhân viên
                              {sortBy === "name" && (
                                <span className="text-blue-600">{sortOrder === "asc" ? "↑" : "↓"}</span>
                              )}
                            </div>
                          </th>
                          <th
                            className="px-4 py-3 text-center cursor-pointer hover:bg-blue-100 transition"
                            onClick={() => handleSort("score")}
                          >
                            <div className="flex items-center justify-center gap-2">
                              Điểm trung bình
                              {sortBy === "score" && (
                                <span className="text-blue-600">{sortOrder === "asc" ? "↑" : "↓"}</span>
                              )}
                            </div>
                          </th>
                          <th
                            className="px-4 py-3 text-center cursor-pointer hover:bg-blue-100 transition"
                            onClick={() => handleSort("assessments")}
                          >
                            <div className="flex items-center justify-center gap-2">
                              Số đánh giá
                              {sortBy === "assessments" && (
                                <span className="text-blue-600">{sortOrder === "asc" ? "↑" : "↓"}</span>
                              )}
                            </div>
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {currentData.map((report, index) => {
                          const hasAssessments = report.totalAssessments > 0;
                          const displayScore = report.averageScore === -1 ? null : report.averageScore;

                          return (
                            <tr
                              key={report.employee.id}
                              className="border-t hover:bg-gray-50 transition"
                            >
                              <td className="px-4 py-3 text-gray-600">
                                {(page - 1) * perPage + index + 1}
                              </td>
                              <td className="px-4 py-3">
                                <div>
                                  <div className="font-semibold text-gray-900">{report.employee.name}</div>
                                  <div className="text-xs text-gray-500">{report.employee.email}</div>
                                  <div className="text-xs text-gray-400">ID: {report.employee.id}</div>
                                </div>
                              </td>
                              <td className="px-4 py-3 text-center">
                                {displayScore !== null ? (
                                  <span
                                    className={`inline-block px-3 py-1 text-sm font-semibold rounded-full ${
                                      displayScore >= 80
                                        ? "bg-green-100 text-green-700 border border-green-200"
                                        : displayScore >= 60
                                          ? "bg-yellow-100 text-yellow-700 border border-yellow-200"
                                          : "bg-red-100 text-red-700 border border-red-200"
                                    }`}
                                  >
                                    {displayScore.toFixed(2)}
                                  </span>
                                ) : (
                                  <span className="inline-block px-3 py-1 text-sm font-medium text-gray-500 rounded-full bg-gray-100 border border-gray-200">
                                    Chưa có đánh giá
                                  </span>
                                )}
                              </td>
                              <td className="px-4 py-3 text-center">
                                <span
                                  className={`inline-block px-3 py-1 text-sm font-semibold rounded-full ${
                                    hasAssessments
                                      ? "bg-blue-100 text-blue-700 border border-blue-200"
                                      : "bg-gray-100 text-gray-500 border border-gray-200"
                                  }`}
                                >
                                  {report.totalAssessments}
                                </span>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>

                  {/* Pagination */}
                  {totalPages > 1 && (
                    <div className="flex items-center justify-between mt-6">
                      <div className="text-sm text-gray-600">
                        Hiển thị {(page - 1) * perPage + 1} - {Math.min(page * perPage, filteredAndSorted.length)} trong
                        tổng số {filteredAndSorted.length} nhân viên
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => setPage((p) => Math.max(1, p - 1))}
                          disabled={page === 1}
                          className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          Trước
                        </button>
                        {Array.from({ length: totalPages }, (_, i) => i + 1)
                          .filter(
                            (p) =>
                              p === 1 ||
                              p === totalPages ||
                              (p >= page - 1 && p <= page + 1)
                          )
                          .map((p, idx, arr) => (
                            <div key={p} className="flex items-center gap-2">
                              {idx > 0 && arr[idx - 1] !== p - 1 && (
                                <span className="px-2 text-gray-400">...</span>
                              )}
                              <button
                                onClick={() => setPage(p)}
                                className={`px-4 py-2 border rounded-md text-sm font-medium ${
                                  page === p
                                    ? "bg-blue-500 text-white border-blue-500"
                                    : "border-gray-300 text-gray-700 bg-white hover:bg-gray-50"
                                }`}
                              >
                                {p}
                              </button>
                            </div>
                          ))}
                        <button
                          onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                          disabled={page === totalPages}
                          className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          Sau
                        </button>
                      </div>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

