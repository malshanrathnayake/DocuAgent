"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

interface NavItem {
  title: string;
  href: string;
  icon?: React.ReactNode;
}

const navItems: NavItem[] = [
  {
    title: "Dashboard",
    href: "/dashboard",
  },
  {
    title: "Documents",
    href: "/documents",
  },
  {
    title: "Upload",
    href: "/upload",
  },
  {
    title: "Reports",
    href: "/reports",
  },
  {
    title: "Settings",
    href: "/settings",
  },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="fixed inset-y-0 left-0 z-10 w-64 bg-gray-900 text-white">
      <div className="flex flex-col h-full">
        <div className="p-4 border-b border-gray-800">
          <h1 className="text-xl font-bold">DocuAgent</h1>
        </div>
        <nav className="flex-1 overflow-y-auto p-2">
          <ul className="space-y-1">
            {navItems.map((item) => (
              <li key={item.href}>
                <Link 
                  href={item.href}
                  className={`flex items-center px-4 py-2 rounded-md hover:bg-gray-800 ${
                    pathname === item.href ? "bg-gray-800 text-white" : "text-gray-400"
                  }`}
                >
                  {item.icon}
                  <span className="ml-3">{item.title}</span>
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        <div className="p-4 border-t border-gray-800">
          <p className="text-sm text-gray-400">© DocuAgent 2025</p>
        </div>
      </div>
    </aside>
  );
}