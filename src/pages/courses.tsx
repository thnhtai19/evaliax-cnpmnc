import React, { useState } from "react";
import { FaPlus, FaSearch } from "react-icons/fa";
import { format } from "date-fns";
import { useNavigate } from "react-router-dom";
import EmployeeActionsDropdown from "@/components/Employee.Drop/EmployeeDropDown";
import Sidebar from "@/components/shared/sidebar";

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

const EmployeeList: React.FC = () => {
  const navigate = useNavigate();
  const [employees] = useState<Employee[]>(dummyEmployees);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [perPage, setPerPage] = useState(5);
  const [page, setPage] = useState(1);

  const handleViewAssessments = (employeeId: string) => {
    // Map employee ID to assessment employee ID
    // Since employee IDs are strings like "EMP001", we need to map them
    // For now, we'll use a simple mapping or extract number from ID
    const numericId = parseInt(employeeId.replace("EMP", "")) + 44; // Map EMP001 -> 45, EMP002 -> 46, etc.
    navigate(`/assessments/${numericId}`);
  };

  const filtered = employees
    .filter(
      (emp) =>
        emp.name.toLowerCase().includes(search.toLowerCase()) || emp.id.toLowerCase().includes(search.toLowerCase()),
    )
    .filter((emp) => statusFilter === "All" || emp.status === statusFilter);

  const currentData = filtered.slice((page - 1) * perPage, page * perPage);

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar />

      <main className="flex-1 overflow-y-hidden">
        <div className="p-8  h-screen ">
          <div className="p-6 bg-white shadow-lg rounded-xl max-w-full h-full">
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
                          onViewAssessments={() => handleViewAssessments(emp.id)}
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
    </div>
  );
};

export default EmployeeList;
