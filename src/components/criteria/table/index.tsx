import Tooltip from "@mui/material/Tooltip";
import { useState, useEffect } from "react";
import { FaPlus, FaSearch, FaTimes } from "react-icons/fa";
import type { Criteria } from "@/service/api/criteria/get-list/types";
import DeleteOutlineOutlinedIcon from "@mui/icons-material/DeleteOutlineOutlined";
import { useSearchParams } from "react-router-dom";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteCriteria } from "@/service/api/criteria/delete";
import { toast } from "react-toastify";

interface CriteriaListProps {
  criteriaList?: Criteria[];
  onAddCriteria?: (criteria: Omit<Criteria, "criteriaId">) => void;
}

export const CriteriaList = ({ criteriaList = [], onAddCriteria }: CriteriaListProps) => {
  const [searchParams, setSearchParams] = useSearchParams();
  const searchTextFromUrl = searchParams.get("searchText") || "";
  const pageFromUrl = Number(searchParams.get("page")) || 1;

  const [search, setSearch] = useState(searchTextFromUrl);
  const [categoryFilter] = useState("All");
  const [perPage] = useState(5);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [criteriaToDelete, setCriteriaToDelete] = useState<Criteria | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    weight: 1,
    category: "HARDSKILL" as "HARDSKILL" | "SOFTSKILL",
  });

  const queryClient = useQueryClient();

  // Debounce search và update query params
  useEffect(() => {
    const debounceTimer = setTimeout(() => {
      setSearchParams(
        (prev) => {
          const newSearchParams = new URLSearchParams(prev);
          const currentSearchText = prev.get("searchText") || "";
          const newSearchText = search.trim();

          // Chỉ update nếu giá trị thay đổi
          if (currentSearchText !== newSearchText) {
            if (newSearchText === "") {
              newSearchParams.delete("searchText");
            } else {
              newSearchParams.set("searchText", newSearchText);
            }
            // Reset về trang 1 khi search thay đổi
            newSearchParams.set("page", "1");
          }
          return newSearchParams;
        },
        { replace: true },
      );
    }, 1000); // Debounce 1000ms (1 giây)

    return () => clearTimeout(debounceTimer);
  }, [search, setSearchParams]);

  // Sync search state với URL khi URL thay đổi từ bên ngoài (chỉ khi khác với state hiện tại)
  useEffect(() => {
    if (searchTextFromUrl !== search) {
      setSearch(searchTextFromUrl);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchTextFromUrl]);

  const filtered = criteriaList.filter((assess) => categoryFilter === "All" || assess.category === categoryFilter);

  // API đã trả về data đã được paginate với limit = 5, nên chỉ hiển thị tối đa 5 records
  // Tính totalPages dựa trên số lượng data từ API (tạm thời, cần API trả về totalPages)
  const totalPages = Math.ceil(filtered.length / perPage);
  const currentData = filtered.slice(0, 5); // Chỉ hiển thị tối đa 5 records

  // Handle change page
  const handleChangePage = (newPage: number) => {
    setSearchParams(
      (prev) => {
        const newSearchParams = new URLSearchParams(prev);
        newSearchParams.set("page", newPage.toString());
        return newSearchParams;
      },
      { replace: true },
    );
  };

  // Handle reset search
  const handleResetSearch = () => {
    setSearch("");
    setSearchParams(
      (prev) => {
        const newSearchParams = new URLSearchParams(prev);
        newSearchParams.delete("searchText");
        newSearchParams.set("page", "1");
        return newSearchParams;
      },
      { replace: true },
    );
  };

  // Lấy danh sách category unique để filter (tạm thời không dùng)
  // const categories = Array.from(new Set(criteriaList.map((a) => a.category)));

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
      handleChangePage(1); // Reset về trang đầu để thấy item mới
      handleCloseModal();
    }
  };

  // Mutation để xóa criteria
  const deleteMutation = useMutation({
    mutationFn: (criteriaId: number) => {
      console.log("Calling deleteCriteria with criteriaId:", criteriaId);
      return deleteCriteria(criteriaId);
    },
    onSuccess: () => {
      toast.success("Xóa tiêu chí thành công!");
      // Invalidate và refetch tất cả queries có prefix ["criteria"]
      queryClient.invalidateQueries({ queryKey: ["criteria"] });
      setIsDeleteModalOpen(false);
      setCriteriaToDelete(null);
    },
    onError: (error) => {
      toast.error(`Lỗi khi xóa tiêu chí: ${error instanceof Error ? error.message : "Có lỗi xảy ra"}`);
      console.error("Delete error:", error);
    },
  });

  // Handler mở modal xác nhận xóa
  const handleOpenDeleteModal = (criteria: Criteria) => {
    // Debug: Kiểm tra criteria object
    console.log("Criteria to delete:", criteria);
    console.log("Criteria ID:", criteria?.criteriaId);

    if (!criteria || !criteria.criteriaId) {
      toast.error("Không tìm thấy ID tiêu chí");
      console.error("Invalid criteria object:", criteria);
      return;
    }

    setCriteriaToDelete(criteria);
    setIsDeleteModalOpen(true);
  };

  // Handler đóng modal xác nhận xóa
  const handleCloseDeleteModal = () => {
    setIsDeleteModalOpen(false);
    setCriteriaToDelete(null);
  };

  // Handler xác nhận xóa
  const handleConfirmDelete = () => {
    if (criteriaToDelete && criteriaToDelete.criteriaId) {
      const criteriaId = criteriaToDelete.criteriaId;
      if (typeof criteriaId === "number" && !isNaN(criteriaId)) {
        deleteMutation.mutate(criteriaId);
      } else {
        toast.error("ID tiêu chí không hợp lệ");
        console.error("Invalid criteriaId:", criteriaId);
      }
    } else {
      toast.error("Không tìm thấy thông tin tiêu chí cần xóa");
      console.error("criteriaToDelete is null or criteriaId is missing:", criteriaToDelete);
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
        <div className="relative w-full md:max-w-xs flex items-center gap-2">
          <div className="relative flex-1">
            <input
              type="text"
              placeholder="Tìm kiếm theo tên"
              className="w-full border border-gray-300 rounded-md py-2 pl-10 pr-10 focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
              }}
            />
            <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            {search && (
              <button
                onClick={handleResetSearch}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                type="button"
              >
                <FaTimes />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full text-sm text-gray-700 border border-gray-200 rounded-lg">
          <thead className="bg-gradient-to-r from-blue-50 to-indigo-50 text-xs text-gray-700 uppercase tracking-wide border-b-2 border-blue-200">
            <tr>
              <th className="px-4 py-3 text-left">STT</th>
              <th className="px-4 py-3 text-left">Tên tiêu chí</th>
              <th className="px-4 py-3 text-left">Mô tả</th>
              <th className="px-4 py-3 text-center">Trọng số</th>
              <th className="px-4 py-3 text-center">Danh mục</th>
              <th className="px-4 py-3 text-center">Hành động</th>
            </tr>
          </thead>
          <tbody>
            {currentData.map((criteria, index) => (
              <tr key={criteria.criteriaId} className="border-t hover:bg-gray-50 transition">
                <td className="px-4 py-3">{(pageFromUrl - 1) * perPage + index + 1}</td>
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
                      onClick={() => handleOpenDeleteModal(criteria)}
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
            onClick={() => handleChangePage(Math.max(1, pageFromUrl - 1))}
            disabled={pageFromUrl === 1}
            className="px-4 py-2 border border-gray-300 rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-blue-50 hover:border-blue-300 hover:text-blue-700 transition-colors"
          >
            Trước
          </button>
          <span className="text-sm font-medium text-gray-700 px-4">
            Trang {pageFromUrl} / {totalPages}
          </span>
          <button
            onClick={() => handleChangePage(Math.min(totalPages, pageFromUrl + 1))}
            disabled={pageFromUrl === totalPages}
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

      {/* Modal Xác Nhận Xóa */}
      {isDeleteModalOpen && criteriaToDelete && (
        <div className="fixed inset-0 flex items-center justify-center z-50 backdrop-blur-sm bg-white/30">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md mx-4">
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-bold text-gray-800">Xác nhận xóa tiêu chí</h3>
                <button
                  onClick={handleCloseDeleteModal}
                  className="text-gray-400 hover:text-gray-600 text-2xl font-bold"
                  disabled={deleteMutation.isPending}
                >
                  ×
                </button>
              </div>

              <div className="mb-6">
                <p className="text-gray-700 mb-2">
                  Bạn có chắc chắn muốn xóa tiêu chí <span className="font-semibold">"{criteriaToDelete.name}"</span>?
                </p>
                <p className="text-sm text-gray-500">Hành động này không thể hoàn tác.</p>
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={handleCloseDeleteModal}
                  disabled={deleteMutation.isPending}
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Hủy
                </button>
                <button
                  type="button"
                  onClick={handleConfirmDelete}
                  disabled={deleteMutation.isPending}
                  className="flex-1 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-md transition disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {deleteMutation.isPending ? "Đang xóa..." : "Xóa"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
