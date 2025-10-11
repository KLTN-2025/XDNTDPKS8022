import ProfileMenu from "./ProfileMenu";
import { User, CalendarCheck, KeyRound, Star } from "lucide-react";

interface ProfileSidebarItem {
  id: number;
  label: string;
  path: string;
  icon?: React.ReactNode;
}

export const profileSidebarItems: ProfileSidebarItem[] = [
  {
    id: 1,
    label: "Thông tin cá nhân",
    path: "/profile",
    icon: <User />,
  },
  {
    id: 2,
    label: "Đơn đặt phòng",
    path: "/profile/bookings",
    icon: <CalendarCheck />,
  },
  {
    id: 3,
    label: "Đổi mật khẩu",
    path: "/profile/change-password",
    icon: <KeyRound />,
  },
  {
    id: 4,
    label: "Đánh giá của tôi",
    path: "/profile/reviews",
    icon: <Star />,
  },
];

const ProfileItems = () => {
  return (
    <div className=" h-full md:ml-10 ml-4">
      <div className="text-base font-semibold mb-6">
        Xin chào, <span className=" text-amber-600">Khách hàng</span>
      </div>
      <ProfileMenu menuItems={profileSidebarItems} />
    </div>
  );
};

export default ProfileItems;
