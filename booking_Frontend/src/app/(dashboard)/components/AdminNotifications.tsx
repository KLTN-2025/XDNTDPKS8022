"use client";

import { useEffect, useState } from "react";
import { Bell } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { pusherClient } from "@/lib/pusher";

export default function AdminNotifications() {
  const [notifications, setNotifications] = useState<any[]>([]);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const channel = pusherClient.subscribe("admin-channel");

    channel.bind("new-booking", (data: any) => {
      setNotifications((prev) => [
        { id: Date.now(), ...data },
        ...prev.slice(0, 9), // chỉ giữ 10 thông báo gần nhất
      ]);
    });
    return () => {
      channel.unbind_all();
      channel.unsubscribe();
    };
  }, []);

  const unreadCount = notifications.length;

  return (
    <div className="relative">
      {/* Nút chuông */}
      <button
        onClick={() => setOpen(!open)}
        className="relative p-2 rounded-full hover:bg-gray-100"
      >
        <Bell className="w-6 h-6 text-gray-700" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs px-1.5 py-0.5 rounded-full">
            {unreadCount}
          </span>
        )}
      </button>

      {/* Danh sách thông báo */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="absolute right-0 mt-2 w-80 bg-white shadow-lg rounded-lg border border-gray-200 z-50"
          >
            <div className="p-2 max-h-96 overflow-auto">
              {notifications.length === 0 ? (
                <p className="text-gray-500 text-sm text-center p-4">
                  Không có thông báo mới
                </p>
              ) : (
                notifications.map((n) => (
                  <div
                    key={n.id}
                    className="border-b border-gray-100 p-3 hover:bg-gray-50"
                  >
                    <p className="font-medium text-sm text-gray-800">
                      🛏️ {n.customer} vừa đặt phòng {n.room}
                    </p>
                  </div>
                ))
              )}
            </div>
            <button
              onClick={() => setNotifications([])}
              className="w-full py-2 text-sm text-gray-600 hover:bg-gray-50 border-t"
            >
              Đánh dấu đã đọc
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
