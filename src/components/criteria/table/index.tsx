import Tooltip from "@mui/material/Tooltip";
import { useState } from "react";
import { FaPlus, FaSearch } from "react-icons/fa";
import type { Criteria } from "@/service/api/criteria/get-list/types";
import DeleteOutlineOutlinedIcon from "@mui/icons-material/DeleteOutlineOutlined";
interface CriteriaListProps {
  criteriaList?: Criteria[];
  onAddCriteria?: (criteria: Omit<Criteria, "criteriaId">) => void;
}

export const CriteriaList = ({ criteriaList = [], onAddCriteria }: CriteriaListProps) => {
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [perPage, setPerPage] = useState(5);
  const [page, setPage] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    weight: 1,
    category: "HARDSKILL" as "HARDSKILL" | "SOFTSKILL",
  });

  const filtered = criteriaList
    .filter(
      (assess) =>
        assess?.name.toLowerCase().includes(search.toLowerCase()) ||
        assess?.criteriaId.toString().toLowerCase().includes(search.toLowerCase()) ||
        assess?.description.toLowerCase().includes(search.toLowerCase()),
    )
    .filter((assess) => categoryFilter === "All" || assess.category === categoryFilter);

  const totalPages = Math.ceil(filtered.length / perPage);
  const currentData = filtered.slice((page - 1) * perPage, page * perPage);

  // Lấy danh sách category unique để filter
  const categories = Array.from(new Set(criteriaList.map((a) => a.category)));

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setFormData({
      name: "",
      description: "",
      weight: 1,
      category: "HARDSKILL",
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.name.trim() && formData.description.trim()) {
      onAddCriteria?.(formData);
      setPage(1); // Reset về trang đầu để thấy item mới
      handleCloseModal();
    }
  };

  return (
    <div className="p-6 bg-white shadow-lg rounded-xl w-full">
      <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-6 gap-4">
        <h2 className="text-2xl font-bold text-gray-800">Danh sách tiêu chí</h2>
        <div className="flex gap-3">
          <button
            onClick={handleOpenModal}
            className="flex cursor-pointer items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md transition shadow-sm"
          >
            <FaPlus /> Thêm tiêu chí
          </button>
        </div>
      </div>

      {/* Controls */}
      <div className="flex flex-col md:flex-row items-center gap-4 mb-4">
        <div className="relative w-full md:max-w-xs">
          <input
            type="text"
            placeholder="Tìm kiếm theo tên, mã hoặc mô tả"
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
          className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
          value={categoryFilter}
          onChange={(e) => {
            setCategoryFilter(e.target.value);
            setPage(1);
          }}
        >
          <option value="All">Tất cả danh mục</option>
          {categories.map((cat) => (
            <option key={cat} value={cat}>
              {cat}
            </option>
          ))}
        </select>

        <select
          className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
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
              <th className="px-4 py-3 text-left">Mã tiêu chí</th>
              <th className="px-4 py-3 text-left">Tên tiêu chí</th>
              <th className="px-4 py-3 text-left">Mô tả</th>
              <th className="px-4 py-3 text-center">Trọng số</th>
              <th className="px-4 py-3 text-center">Danh mục</th>
              <th className="px-4 py-3 text-center">Hành động</th>
            </tr>
          </thead>
          <tbody>
            {currentData.map((criteria) => (
              <tr key={criteria.criteriaId} className="border-t hover:bg-gray-50 transition">
                <td className="px-4 py-3">{criteria.criteriaId}</td>
                <td className="px-4 py-3 font-medium">{criteria.name}</td>
                <td className="px-4 py-3">{criteria.description}</td>
                <td className="px-4 py-3 text-center">
                  <span className="inline-block px-3 py-1 text-xs font-semibold rounded-full bg-indigo-100 text-indigo-700 border border-indigo-200">
                    {criteria.weight.toString()}
                  </span>
                </td>
                <td className="px-4 py-3 text-center">
                  <span
                    className={`inline-block px-3 py-1 text-xs font-semibold rounded-full ${
                      criteria.category === "SOFTSKILL"
                        ? "bg-amber-100 text-amber-700 border border-amber-200"
                        : "bg-teal-100 text-teal-700 border border-teal-200"
                    }`}
                  >
                    {criteria.category}
                  </span>
                </td>
                <td className="px-4 py-3 text-center">
                  <Tooltip title="Xóa tiêu chí">
                    <DeleteOutlineOutlinedIcon
                      className="text-red-600 hover:text-red-800 transition-colors"
                      style={{ fontSize: 20, cursor: "pointer" }}
                    />
                  </Tooltip>
                </td>
              </tr>
            ))}
            {currentData.length === 0 && (
              <tr>
                <td colSpan={6} className="text-center text-gray-400 py-6">
                  Không tìm thấy tiêu chí phù hợp.
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

      {/* Modal Thêm Tiêu Chí */}
      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center z-50 backdrop-blur-sm bg-white/30">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md mx-4">
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-bold text-gray-800">Thêm tiêu chí mới</h3>
                <button onClick={handleCloseModal} className="text-gray-400 hover:text-gray-600 text-2xl font-bold">
                  ×
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Tên tiêu chí <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Nhập tên tiêu chí"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Mô tả <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    required
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Nhập mô tả tiêu chí"
                    rows={3}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Trọng số <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    required
                    min="1"
                    max="10"
                    value={formData.weight}
                    onChange={(e) => setFormData({ ...formData, weight: Number(e.target.value) })}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Danh mục <span className="text-red-500">*</span>
                  </label>
                  <select
                    required
                    value={formData.category}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        category: e.target.value as "HARDSKILL" | "SOFTSKILL",
                      })
                    }
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="HARDSKILL">HARDSKILL</option>
                    <option value="SOFTSKILL">SOFTSKILL</option>
                  </select>
                </div>

                <div className="flex gap-3 pt-4">
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
                    Thêm tiêu chí
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
