import { useState, useMemo, Fragment } from "react";
import Sidebar from "@/components/shared/sidebar";
import type { IEmployeeChartData } from "@/components/EmployeeChart";
import EmployeeChart from "@/components/EmployeeChart";
import {
  Card,
  CardContent,
  Typography,
  Box,
  TextField,
  Stack,
  Pagination,
  Chip,
  Collapse,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper
} from "@mui/material";
import { format } from "date-fns";
import { FileText, Loader2, ChevronDown, ChevronUp, Users, ClipboardList, TrendingUp, Award } from "lucide-react";
import { useEmployeeAssessments, useDashboardData } from "./api";
import { useAuth } from "@/hooks/useAuthContext";


export default function Dashboard() {
  const [startDate, setStartDate] = useState<string>("2025-01-01");
  const [endDate, setEndDate] = useState<string>("2025-01-31");
  const [page, setPage] = useState<number>(1);
  const [rowsPerPage] = useState<number>(5);
  const [expandedRows, setExpandedRows] = useState<Set<number>>(new Set());

  const { user: currentUser } = useAuth();
  const isSupervisor = currentUser?.role === "SUPERVISOR";
  
  const employeeId = currentUser?.id ? parseInt(currentUser.id, 10) : undefined;
  const { data: dashboardData, isLoading: isLoadingDashboard, error: dashboardError } = useDashboardData(employeeId);
  const { data: employeeAssessments, isLoading, error } = useEmployeeAssessments();

  // Transform monthlyStats to chart data format
  const chartData = useMemo(() => {
    if (!dashboardData?.monthlyStats) return [];
    
    return dashboardData.monthlyStats.map((stat) => {
      // Format: "MM/YYYY" for month display
      const monthStr = String(stat.month).padStart(2, '0');
      return {
        time: `${monthStr}/${stat.year}`,
        value: stat.avgScore,
      } as IEmployeeChartData;
    });
  }, [dashboardData]);

  // Filter chart data by date range
  const filteredData = useMemo(() => {
    if (!chartData.length) return [];
    
    const start = new Date(startDate);
    const end = new Date(endDate);
    
    return chartData.filter((item) => {
      // Parse "MM/YYYY" format
      const [month, year] = item.time.split('/');
      const itemDate = new Date(parseInt(year), parseInt(month) - 1, 1);
      
      return itemDate >= start && itemDate <= end;
    });
  }, [chartData, startDate, endDate]);

  // Pagination logic
  const paginatedAssessments = useMemo(() => {
    if (!employeeAssessments) return [];
    const startIndex = (page - 1) * rowsPerPage;
    const endIndex = startIndex + rowsPerPage;
    return employeeAssessments.slice(startIndex, endIndex);
  }, [employeeAssessments, page, rowsPerPage]);

  const totalPages = useMemo(() => {
    if (!employeeAssessments) return 0;
    return Math.ceil(employeeAssessments.length / rowsPerPage);
  }, [employeeAssessments, rowsPerPage]);

  const handleToggleExpand = (assessmentId: number) => {
    setExpandedRows((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(assessmentId)) {
        newSet.delete(assessmentId);
      } else {
        newSet.add(assessmentId);
      }
      return newSet;
    });
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "published":
        return "success";
      case "draft":
        return "warning";
      case "pending":
        return "info";
      default:
        return "default";
    }
  };

  // Supervisor Dashboard - General overview
  if (isSupervisor) {
    return (
      <div className="flex h-screen bg-gray-50">
        <Sidebar />
        <main className="flex-1 overflow-auto">
          <Box sx={{ p: 4 }}>
            <Typography variant="h4" sx={{ fontWeight: 'bold', mb: 3, color: '#1a1a1a' }}>
              Tổng quan
            </Typography>

            <Card elevation={2} sx={{ borderRadius: 2 }}>
              <CardContent>
                <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 2, color: '#1a1a1a' }}>
                  Chào mừng, {currentUser?.name || "Supervisor"}!
                </Typography>
                <Typography variant="body1" sx={{ color: 'text.secondary', mb: 2 }}>
                  Đây là trang tổng quan của bạn. Từ đây bạn có thể quản lý nhân viên, tạo đánh giá và xem báo cáo.
                </Typography>
                <Box sx={{ mt: 3 }}>
                  <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                    💡 <strong>Mẹo:</strong> Sử dụng menu bên trái để điều hướng đến các chức năng khác nhau.
                  </Typography>
                </Box>
              </CardContent>
            </Card>
          </Box>
        </main>
      </div>
    );
  }

  // Employee Dashboard - Detailed view with chart and assessments
  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar />
      <main className="flex-1 overflow-auto">
        <Box sx={{ p: 4 }}>
          <Typography variant="h4" sx={{ fontWeight: 'bold', mb: 3, color: '#1a1a1a' }}>
            Tổng quan
          </Typography>

          <Card elevation={2} sx={{ borderRadius: 2 }}>
            <CardContent>
              <Box
                sx={{
                  display: 'flex',
                  flexDirection: { xs: 'column', md: 'row' },
                  justifyContent: 'space-between',
                  alignItems: { xs: 'flex-start', md: 'center' },
                  gap: 2,
                  mb: 4
                }}
              >
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                    Biểu đồ hiệu suất
                  </Typography>
                </Box>

                <Stack direction="row" spacing={2}>
                  <TextField
                    label="Ngày bắt đầu"
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    InputLabelProps={{
                      shrink: true,
                    }}
                    size="small"
                    sx={{
                      minWidth: 180,
                    }}
                  />

                  <TextField
                    label="Ngày kết thúc"
                    type="date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    InputLabelProps={{
                      shrink: true,
                    }}
                    size="small"
                    sx={{
                      minWidth: 180,
                    }}
                  />
                </Stack>
              </Box>

              <Box sx={{ mt: 2 }}>
                {isLoadingDashboard ? (
                  <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 300 }}>
                    <Loader2 className="size-8 text-blue-500 animate-spin" />
                  </Box>
                ) : dashboardError ? (
                  <Box sx={{ textAlign: 'center', py: 4 }}>
                    <Typography variant="body2" sx={{ color: 'error.main' }}>
                      Không thể tải dữ liệu biểu đồ
                    </Typography>
                  </Box>
                ) : filteredData.length === 0 ? (
                  <Box sx={{ textAlign: 'center', py: 4 }}>
                    <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                      Không có dữ liệu trong khoảng thời gian đã chọn
                    </Typography>
                  </Box>
                ) : (
                  <EmployeeChart data={filteredData} />
                )}
              </Box>
            </CardContent>
          </Card>

          <Card className="mt-6">
            <div className="p-6 rounded-lg shadow-sm border">
              <div className="flex items-center gap-3 mb-4">
                <FileText className="size-6 text-blue-600" />
                <h2 className="text-xl font-semibold text-gray-800">
                  Đánh giá của {currentUser?.name || "Nhân viên"} (ID: 46)
                </h2>
              </div>

              {isLoading ? (
                <div className="text-center py-12">
                  <Loader2 className="size-16 text-blue-500 mx-auto mb-4 animate-spin" />
                  <p className="text-lg font-medium text-gray-700 mb-1">Đang tải đánh giá...</p>
                  <p className="text-sm text-gray-500">Vui lòng đợi trong giây lát</p>
                </div>
              ) : error ? (
                <div className="text-center py-12">
                  <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                    <p className="text-red-800 font-semibold mb-1">Có lỗi xảy ra khi tải dữ liệu</p>
                    <p className="text-red-600 text-sm">Vui lòng thử lại sau</p>
                  </div>
                </div>
              ) : (
                <>
                  {employeeAssessments?.length === 0 ? (
                    <div className="text-center py-8">
                      <FileText className="size-12 text-gray-300 mx-auto mb-2" />
                      <p className="text-gray-600">Chưa có đánh giá nào</p>
                    </div>
                  ) : (
                    <>
                      <TableContainer component={Paper} elevation={0} sx={{ border: '1px solid #e5e7eb', borderRadius: 2 }}>
                        <Table>
                          <TableHead>
                            <TableRow sx={{ backgroundColor: '#f9fafb' }}>
                              <TableCell sx={{ fontWeight: 600, color: '#6b7280', fontSize: '0.75rem', textTransform: 'uppercase' }} align="center" width="50px"></TableCell>
                              <TableCell sx={{ fontWeight: 600, color: '#6b7280', fontSize: '0.75rem', textTransform: 'uppercase' }} align="center" width="80px">STT</TableCell>
                              <TableCell sx={{ fontWeight: 600, color: '#6b7280', fontSize: '0.75rem', textTransform: 'uppercase' }} align="center" width="120px">ID Đánh giá</TableCell>
                              <TableCell sx={{ fontWeight: 600, color: '#6b7280', fontSize: '0.75rem', textTransform: 'uppercase' }} align="left">Người đánh giá</TableCell>
                              <TableCell sx={{ fontWeight: 600, color: '#6b7280', fontSize: '0.75rem', textTransform: 'uppercase' }} align="center" width="120px">Trạng thái</TableCell>
                              <TableCell sx={{ fontWeight: 600, color: '#6b7280', fontSize: '0.75rem', textTransform: 'uppercase' }} align="center" width="120px">Tổng điểm</TableCell>
                              <TableCell sx={{ fontWeight: 600, color: '#6b7280', fontSize: '0.75rem', textTransform: 'uppercase' }} align="center" width="120px">Số tiêu chí</TableCell>
                              <TableCell sx={{ fontWeight: 600, color: '#6b7280', fontSize: '0.75rem', textTransform: 'uppercase' }} align="left" width="180px">Ngày tạo</TableCell>
                            </TableRow>
                          </TableHead>
                          <TableBody>
                            {paginatedAssessments.map((assessment, index) => {
                              const isExpanded = expandedRows.has(assessment.assessmentId);
                              const globalIndex = (page - 1) * rowsPerPage + index;
                              return (
                                <Fragment key={assessment.assessmentId}>
                                  <TableRow 
                                    sx={{ 
                                      '&:hover': { backgroundColor: '#f9fafb' },
                                      cursor: 'pointer'
                                    }}
                                  >
                                    <TableCell align="center">
                                      <IconButton
                                        size="small"
                                        onClick={() => handleToggleExpand(assessment.assessmentId)}
                                        sx={{ color: '#6b7280' }}
                                      >
                                        {isExpanded ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                                      </IconButton>
                                    </TableCell>
                                    <TableCell align="center" sx={{ fontWeight: 500, color: '#111827' }}>
                                      {globalIndex + 1}
                                    </TableCell>
                                    <TableCell align="center" sx={{ fontWeight: 500, color: '#111827' }}>
                                      #{assessment.assessmentId}
                                    </TableCell>
                                    <TableCell>
                                      <Box>
                                        <Typography variant="body2" sx={{ fontWeight: 500, color: '#111827' }}>
                                          {assessment.supervisor.name}
                                        </Typography>
                                        <Typography variant="caption" sx={{ color: '#6b7280', fontSize: '0.75rem' }}>
                                          {assessment.supervisor.email}
                                        </Typography>
                                      </Box>
                                    </TableCell>
                                    <TableCell align="center">
                                      <Chip 
                                        label={assessment.status} 
                                        color={getStatusColor(assessment.status) as any}
                                        size="small"
                                        sx={{ fontWeight: 500 }}
                                      />
                                    </TableCell>
                                    <TableCell align="center">
                                      <Typography variant="body1" sx={{ fontWeight: 700, color: '#2563eb', fontSize: '1.1rem' }}>
                                        {assessment.totalScore.toFixed(2)}
                                      </Typography>
                                    </TableCell>
                                    <TableCell align="center">
                                      <Chip 
                                        label={assessment.criteriaScores.length} 
                                        sx={{ 
                                          backgroundColor: '#dbeafe', 
                                          color: '#1e40af',
                                          fontWeight: 600
                                        }}
                                        size="small"
                                      />
                                    </TableCell>
                                    <TableCell sx={{ color: '#6b7280' }}>
                                      {format(new Date(assessment.createdAt), "dd/MM/yyyy HH:mm")}
                                    </TableCell>
                                  </TableRow>
                                  <TableRow>
                                    <TableCell 
                                      style={{ paddingBottom: 0, paddingTop: 0 }} 
                                      colSpan={8}
                                    >
                                      <Collapse in={isExpanded} timeout="auto" unmountOnExit>
                                        <Box sx={{ margin: 2 }}>
                                          <Typography variant="h6" gutterBottom component="div" sx={{ fontWeight: 600, mb: 2, color: '#111827' }}>
                                            Chi tiết tiêu chí đánh giá
                                          </Typography>
                                          <Table size="small">
                                            <TableHead>
                                              <TableRow sx={{ backgroundColor: '#f3f4f6' }}>
                                                <TableCell sx={{ fontWeight: 600, fontSize: '0.875rem' }}>Tiêu chí</TableCell>
                                                <TableCell sx={{ fontWeight: 600, fontSize: '0.875rem' }} align="center" width="120px">Loại</TableCell>
                                                <TableCell sx={{ fontWeight: 600, fontSize: '0.875rem' }} align="center" width="100px">Trọng số</TableCell>
                                                <TableCell sx={{ fontWeight: 600, fontSize: '0.875rem' }} align="center" width="100px">Điểm</TableCell>
                                                <TableCell sx={{ fontWeight: 600, fontSize: '0.875rem' }}>Nhận xét</TableCell>
                                              </TableRow>
                                            </TableHead>
                                            <TableBody>
                                              {assessment.criteriaScores.map((criteriaScore, idx) => (
                                                <TableRow key={idx}>
                                                  <TableCell>
                                                    <Box>
                                                      <Typography variant="body2" sx={{ fontWeight: 500, color: '#111827' }}>
                                                        {criteriaScore.criteria.criteriaName}
                                                      </Typography>
                                                      <Typography variant="caption" sx={{ color: '#6b7280', fontSize: '0.75rem' }}>
                                                        {criteriaScore.criteria.description}
                                                      </Typography>
                                                    </Box>
                                                  </TableCell>
                                                  <TableCell align="center">
                                                    <Chip 
                                                      label={criteriaScore.criteria.category} 
                                                      size="small"
                                                      sx={{
                                                        backgroundColor: criteriaScore.criteria.category === 'HARDSKILL' ? '#fef3c7' : '#dbeafe',
                                                        color: criteriaScore.criteria.category === 'HARDSKILL' ? '#92400e' : '#1e40af',
                                                        fontWeight: 500,
                                                        fontSize: '0.7rem'
                                                      }}
                                                    />
                                                  </TableCell>
                                                  <TableCell align="center" sx={{ fontWeight: 500 }}>
                                                    {criteriaScore.criteria.weight}
                                                  </TableCell>
                                                  <TableCell align="center">
                                                    <Typography variant="body2" sx={{ fontWeight: 600, color: '#2563eb' }}>
                                                      {criteriaScore.score}
                                                    </Typography>
                                                  </TableCell>
                                                  <TableCell sx={{ color: '#6b7280', fontSize: '0.875rem' }}>
                                                    {criteriaScore.comment || '-'}
                                                  </TableCell>
                                                </TableRow>
                                              ))}
                                            </TableBody>
                                          </Table>
                                        </Box>
                                      </Collapse>
                                    </TableCell>
                                  </TableRow>
                                </Fragment>
                              );
                            })}
                          </TableBody>
                        </Table>
                      </TableContainer>
                      
                      {totalPages > 1 && (
                        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3 }}>
                          <Pagination
                            count={totalPages}
                            page={page}
                            onChange={(_, value) => setPage(value)}
                            color="primary"
                            showFirstButton
                            showLastButton
                            sx={{
                              '& .MuiPaginationItem-root': {
                                fontSize: '0.875rem',
                              }
                            }}
                          />
                        </Box>
                      )}
                      
                      <Box sx={{ mt: 2, textAlign: 'center' }}>
                        <Typography variant="body2" sx={{ color: '#6b7280' }}>
                          Hiển thị {paginatedAssessments.length} / {employeeAssessments?.length || 0} đánh giá
                        </Typography>
                      </Box>
                    </>
                  )}
                </>
              )}
            </div>
          </Card>
        </Box>
      </main>
    </div>
  );
}
