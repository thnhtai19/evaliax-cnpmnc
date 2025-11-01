import { BookOpen, Users, FileText, Settings, LayoutDashboard, LogOut, GraduationCap, ClipboardList } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import LogoHeader from "../LogoHeader";
import { useAuth } from "@/hooks/useAuthContext";
import { useState } from "react";
import { Menu, MenuItem, IconButton } from "@mui/material";

const menuItems = [
  {
    title: "Tổng quan",
    icon: LayoutDashboard,
    href: "/dashboard",
  },
  {
    title: "Khóa học",
    icon: BookOpen,
    href: "/courses",
  },
  {
    title: "Học viên",
    icon: Users,
    href: "/students",
  },
  {
    title: "Đánh giá",
    icon: ClipboardList,
    href: "/assessments",
  },
  {
    title: "Báo cáo",
    icon: FileText,
    href: "/reports",
  },
  {
    title: "Cài đặt",
    icon: Settings,
    href: "/settings",
  },
];

const Sidebar = () => {
  const location = useLocation();
  const { user, logout } = useAuth();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const handleMenuClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    handleMenuClose();
    logout();
  };

  return (
    <aside className="flex h-screen w-64 flex-col border-r bg-white">
      {/* Logo Section */}
      <div className="flex items-center gap-3 border-b px-6 py-5">
        <LogoHeader size="large" />
      </div>

      {/* Navigation Menu */}
      <nav className="flex-1 space-y-1 p-4">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.href;

          return (
            <Link
              key={item.href}
              to={item.href}
              className={cn(
                "flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium transition-colors",
                isActive ? "bg-blue-500 text-white" : "text-gray-700 hover:bg-gray-100",
              )}
            >
              <Icon className="size-5" />
              <span>{item.title}</span>
            </Link>
          );
        })}
      </nav>

      {/* User Profile Section */}
      <div className="border-t p-4">
        <div className="flex items-center gap-3 rounded-lg p-3 hover:bg-gray-100 transition-colors">
          <img
            src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.name || user?.username || 'User'}`}
            alt={user?.name || user?.username || 'User'}
            className="size-10 rounded-full"
          />
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-gray-900 truncate">
              {user?.name || user?.username || 'User'}
            </p>
            <p className="text-xs text-gray-500 truncate">
              {user?.email || user?.username}
            </p>
          </div>
          <IconButton
            onClick={handleMenuClick}
            size="small"
            className="text-gray-400 hover:text-gray-600"
          >
            <svg className="size-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z"
              />
            </svg>
          </IconButton>
        </div>
        <Menu
          anchorEl={anchorEl}
          open={open}
          onClose={handleMenuClose}
          anchorOrigin={{
            vertical: 'top',
            horizontal: 'right',
          }}
          transformOrigin={{
            vertical: 'bottom',
            horizontal: 'right',
          }}
        >
          <MenuItem onClick={handleLogout}>
            <LogOut className="size-4 mr-2" />
            Đăng xuất
          </MenuItem>
        </Menu>
      </div>
    </aside>
  );
};

export default Sidebar;
