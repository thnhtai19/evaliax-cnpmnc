import { Users, FileText, Settings, LayoutDashboard, ClipboardList, LogOut, ListChecks } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import LogoHeader from "../LogoHeader";
import { useAuth } from "@/hooks/useAuthContext";

type MenuItem =
  | { title: string; icon: typeof LayoutDashboard; href: string; onClick?: never }
  | { title: string; icon: typeof LayoutDashboard; href?: never; onClick: () => void };

const Sidebar = () => {
  const location = useLocation();
  const { user, logout } = useAuth();

  const displayName = user?.name || user?.email || "Người dùng";
  const displayRole = user?.role;
  const isEmployee = displayRole === "EMPLOYEE";

  const allMenuItems: MenuItem[] = [
    {
      title: "Tổng quan",
      icon: LayoutDashboard,
      href: "/dashboard",
    },
    {
      title: "Nhân viên",
      icon: Users,
      href: "/employee",
    },
    {
      title: "Tất cả đánh giá",
      icon: ClipboardList,
      href: "/assessments",
    },
    {
      title: "Tiêu chí",
      icon: ListChecks,
      href: "/criteria",
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
    {
      title: "Đăng xuất",
      icon: LogOut,
      onClick: () => logout(),
    },
  ];

  // Filter menu items based on role
  const menuItems: MenuItem[] = isEmployee
    ? allMenuItems.filter((item) => item.title === "Tổng quan" || item.title === "Đăng xuất")
    : allMenuItems;

  return (
    <aside className="flex h-screen w-64 flex-col border-r bg-white">
      <div className="flex items-center gap-3 border-b px-6 py-5">
        <LogoHeader size="large" />
      </div>

      <nav className="flex-1 space-y-1 p-4">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const key = item.href ?? item.title;

          if (item.href) {
            // Special handling for /assessments/:id - don't active "Đánh giá" menu
            const isActive =
              item.href === "/"
                ? location.pathname === "/"
                : item.href === "/assessments"
                  ? location.pathname === item.href // Only active if exact match, not for /assessments/:id
                  : location.pathname === item.href || location.pathname.startsWith(`${item.href}/`);

            return (
              <Link
                key={key}
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
          }

          return (
            <button
              key={key}
              type="button"
              onClick={item.onClick}
              className="cursor-pointer flex w-full items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-100"
            >
              <Icon className="size-5" />
              <span>{item.title}</span>
            </button>
          );
        })}
      </nav>

      <div className="border-t p-4">
        <div className="flex items-center gap-3 rounded-lg p-3">
          <img
            src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(displayName)}`}
            alt={displayName}
            className="size-10 rounded-full"
          />
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-gray-900 truncate">{displayName}</p>
            {displayRole && <p className="text-xs text-gray-500 truncate">{displayRole}</p>}
          </div>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
