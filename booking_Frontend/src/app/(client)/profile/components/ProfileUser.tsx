"use client";

import React from "react";
import { Card } from "@/components/ui/card";
import { User } from "lucide-react";

interface CustomerInfo {
  address: string;
  city: string;
  country: string;
  idNumber: string;
}

interface UserProfile {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  phone: string;
  status: string;
  createdAt: string;
  customer: CustomerInfo | null;
}

const ProfileUser: React.FC<{ user: UserProfile }> = ({ user }) => {
  return (
    <div className="container mx-auto p-4 max-w-4xl">
      <Card className="p-2 sm:p-8 shadow-lg hover:shadow-xl transition-shadow duration-300">
        <div className="flex flex-col items-center mb-5">
          <div className="h-20 w-20 sm:h-28 sm:w-28 rounded-full bg-secondary flex items-center justify-center mb-4 sm:mb-6 border-4 border-primary/10 shadow-md hover:scale-105 transition-transform duration-300">
            <User className="h-10 w-10 sm:h-16 sm:w-16 text-secondary-foreground" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent text-center">
            {user.firstName} {user.lastName}
          </h1>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
          <div className="space-y-4">
            <div className="border-l-4 border-primary pl-4 transition-all hover:border-secondary">
              <h3 className="font-semibold text-muted-foreground text-sm sm:text-base">
                Email
              </h3>
              <p className="text-sm sm:text-lg">{user.email}</p>
            </div>
            <div className="border-l-4 border-primary pl-4 transition-all hover:border-secondary">
              <h3 className="font-semibold text-muted-foreground text-sm sm:text-base">
                Số điện thoại
              </h3>
              <p className="text-sm sm:text-lg">{user.phone}</p>
            </div>
            <div className="border-l-4 border-primary pl-4 transition-all hover:border-secondary">
              <h3 className="font-semibold text-muted-foreground text-sm sm:text-base">
                Trạng thái
              </h3>
              <p className="text-sm sm:text-lg capitalize">
                {user.status ? (
                  <span className="text-green-600">hoạt động</span>
                ) : (
                  <span className="text-red-600">vô hiệu hóa</span>
                )}
              </p>
            </div>
          </div>

          {user.customer && (
            <div className="space-y-4">
              <div className="border-l-4 border-primary pl-4 transition-all hover:border-secondary">
                <h3 className="font-semibold text-muted-foreground text-sm sm:text-base">
                  Địa chỉ
                </h3>
                <p className="text-base sm:text-lg">{user.customer.address}</p>
              </div>
              <div className="border-l-4 border-primary pl-4 transition-all hover:border-secondary">
                <h3 className="font-semibold text-muted-foreground text-sm sm:text-base">
                  Thành phố
                </h3>
                <p className="text-base sm:text-lg capitalize">
                  {user.customer.city}
                </p>
              </div>
              <div className="border-l-4 border-primary pl-4 transition-all hover:border-secondary">
                <h3 className="font-semibold text-muted-foreground text-sm sm:text-base">
                  Quốc gia
                </h3>
                <p className="text-base sm:text-lg">{user.customer.country}</p>
              </div>
              <div className="border-l-4 border-primary pl-4 transition-all hover:border-secondary">
                <h3 className="font-semibold text-muted-foreground text-sm sm:text-base">
                  Số CMND/CCCD
                </h3>
                <p className="text-base sm:text-lg">{user.customer.idNumber}</p>
              </div>
            </div>
          )}
        </div>
      </Card>
    </div>
  );
};

export default ProfileUser;
