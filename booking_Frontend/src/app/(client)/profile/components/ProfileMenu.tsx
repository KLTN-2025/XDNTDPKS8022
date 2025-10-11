"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";

interface ProfileSidebarItem {
  id: number;
  label: string;
  path: string;
  icon?: React.ReactNode;
}

interface ProfileMenuProps {
  menuItems: ProfileSidebarItem[];
}

const ProfileMenu: React.FC<ProfileMenuProps> = ({ menuItems }) => {
  const pathname = usePathname();

  return (
    <div className="flex flex-col  space-y-1 ">
      {menuItems.map((item) => (
        <Link
          key={item.id}
          href={item.path}
          className={`flex items-center gap-2 p-3 rounded-lg transition-colors
                        ${
                          pathname === item.path
                            ? " text-yellow-700 "
                            : "hover:bg-gray-100 w-fit"
                        }`}
        >
          {item.icon && (
            <span className="md:w-5 md:h-5 w-10 h-10  md:mr-3 mr-0">
              {item.icon}
            </span>
          )}
          <span className="md:block hidden">{item.label}</span>
        </Link>
      ))}
    </div>
  );
};

export default ProfileMenu;
