"use client";
import { useEffect, useState, useRef } from "react";
import socket from "@/lib/socket";
import { MessageCircle, X } from "lucide-react";

interface Message {
  senderId: string;
  receiverId: string;
  content: string;
}

interface UserInfo {
  userId: string;
  role: string;
}

export default function CustomerChat() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState("");
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null);
  // useRef để luôn lấy userId hiện tại trong chat_assigned
  const userInfoRef = useRef<UserInfo | null>(null);

  console.log("userInfo", userInfo);

  useEffect(() => {
    // Listener user_info
    const handleUserInfo = (data: UserInfo) => {
      setUserInfo(data);
      userInfoRef.current = data; // cập nhật ref
      console.log("Received user_info:", data);
    };

    socket.on("user_info", handleUserInfo);

    // Listener tin nhắn
    const handleReceiveMessage = (msg: Message) => {
      setMessages((prev) => [...prev, msg]);
    };
    socket.on("receive_message", handleReceiveMessage);

    // Listener chat_assigned
    const handleChatAssigned = () => {
      const currentUserId = userInfoRef.current?.userId || "";
      setMessages((prev) => [
        ...prev,
        {
          senderId: "BOT",
          receiverId: currentUserId,
          content: "Bạn đã được kết nối với nhân viên!",
        },
      ]);
    };
    socket.on("chat_assigned", handleChatAssigned);

    // Kết nối socket sau khi gắn listener
    if (!socket.connected) socket.connect();

    return () => {
      socket.off("user_info", handleUserInfo);
      socket.off("receive_message", handleReceiveMessage);
      socket.off("chat_assigned", handleChatAssigned);
    };
  }, []);

  const sendMessage = () => {
    if (!input.trim() || !userInfo) return;

    socket.emit("send_message", {
      receiverId: undefined, // server sẽ tự xác định nếu CUSTOMER
      content: input,
    });

    setInput("");
  };

  const role = userInfo?.role || "";

  return (
    <>
      {/* Nút chat icon - luôn hiển thị khi chat box đóng */}
      {!isOpen && (
        <div
          className="fixed bottom-6 left-12 w-14 h-14 bg-blue-600 rounded-full z-30 flex items-center justify-center text-white text-xl font-bold cursor-pointer shadow-lg hover:bg-blue-700 transition-colors"
          onClick={() => setIsOpen(true)}
        >
          <MessageCircle />
        </div>
      )}

      {/* Chat box - hiển thị khi isOpen = true */}
      {isOpen && (
        <div className="fixed bottom-3 md:bottom-6 left-8 md:left-20 w-96 bg-white h-96 shadow-xl rounded-xl border border-gray-200 flex flex-col overflow-hidden z-50">
          {/* Header */}
          <div className="bg-blue-600 text-white p-3 rounded-t-xl font-semibold flex items-center justify-between">
            Hỗ trợ khách hàng ({role || "đang tải..."})
            <X
              className="w-6 h-6 hover:text-red-500 cursor-pointer"
              onClick={() => setIsOpen(false)}
            />
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-3 h-64 space-y-3">
            {messages.map((msg, idx) => {
              const isMine = msg.senderId === userInfo?.userId;
              const isEmployee = role === "EMPLOYEE";
              const bubbleColor =
                role === "CUSTOMER"
                  ? isMine
                    ? "bg-blue-500 text-white rounded-br-none"
                    : "bg-gray-100 text-gray-800 rounded-bl-none"
                  : isMine
                  ? "bg-gray-100 text-gray-800 rounded-br-none"
                  : "bg-blue-500 text-white rounded-bl-none";

              return (
                <div
                  key={idx}
                  className={`flex ${
                    isMine ? "justify-end" : "justify-start"
                  } items-end gap-2`}
                >
                  {(!isMine || isEmployee) && (
                    <div className="w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center font-bold flex-shrink-0">
                      E
                    </div>
                  )}

                  <div
                    className={`max-w-xs px-4 py-2 rounded-lg ${bubbleColor} shadow-sm`}
                  >
                    <p>{msg.content}</p>
                  </div>

                  {isMine && !isEmployee && (
                    <div className="w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center font-bold flex-shrink-0">
                      C
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Input area */}
          <div className="p-3 border-t border-gray-200 bg-gray-50">
            <div className="flex gap-2">
              <input
                className="flex-1 border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && sendMessage()}
                placeholder="Nhập tin nhắn..."
              />
              <button
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors shadow-sm"
                onClick={sendMessage}
              >
                Gửi
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
