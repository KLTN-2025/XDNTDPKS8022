/* eslint-disable react-hooks/exhaustive-deps */
"use client";
import socket from "@/lib/socket";
import { X } from "lucide-react";
import { useEffect, useState } from "react";
import { useSidebar } from "../../context/contextAdmin";

interface Message {
  senderId: string;
  receiverId: string;
  content: string;
}

export default function ChatPage() {
  const { setCountCustomer } = useSidebar();

  // Khởi tạo trạng thái với giá trị từ localStorage hoặc giá trị mặc định
  const [messages, setMessages] = useState<Record<string, Message[]>>(() => {
    try {
      const saved = localStorage.getItem("chat_messages");
      if (!saved) return {};

      const parsed = JSON.parse(saved);

      // Nếu đã là object (trường hợp lưu lần trước theo object)
      if (typeof parsed === "object" && !Array.isArray(parsed)) {
        return parsed;
      }

      // Nếu là array (lưu trước đó theo array, cần nhóm theo receiverId)
      if (Array.isArray(parsed)) {
        return parsed.reduce((acc, msg: Message) => {
          const key = msg.receiverId;
          if (!acc[key]) acc[key] = [];
          acc[key].push(msg);
          return acc;
        }, {} as Record<string, Message[]>);
      }

      return {};
    } catch (e) {
      console.error("Error parsing chat_messages from localStorage:", e);
      return {};
    }
  });

  const [waitingCustomers, setWaitingCustomers] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem("waiting_customers");

      return saved ? JSON.parse(saved) : [];
    } catch (e) {
      console.error("Error parsing waiting_customers from localStorage:", e);
      return [];
    }
  });

  const [activeCustomers, setActiveCustomers] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem("active_customers");
      return saved ? JSON.parse(saved) : [];
    } catch (e) {
      console.error("Error parsing active_customers from localStorage:", e);
      return [];
    }
  });

  const [currentCustomer, setCurrentCustomer] = useState<string | null>(() => {
    try {
      const savedActive = localStorage.getItem("active_customers");
      const active = savedActive ? JSON.parse(savedActive) : [];
      return active.length > 0 ? active[0] : null;
    } catch (e) {
      console.error("Error parsing active_customers for currentCustomer:", e);
      return null;
    }
  });

  const [input, setInput] = useState("");

  // Hàm lưu tất cả trạng thái vào localStorage
  const saveToLocalStorage = () => {
    try {
      localStorage.setItem("chat_messages", JSON.stringify(messages));
      localStorage.setItem(
        "waiting_customers",
        JSON.stringify(waitingCustomers)
      );
      localStorage.setItem("active_customers", JSON.stringify(activeCustomers));
    } catch (e) {
      console.error("Error saving to localStorage:", e);
    }
  };

  // Socket listeners
  useEffect(() => {
    socket.on("waiting_customers", (customers: string[]) => {
      setWaitingCustomers(customers);
    });

    socket.on("receive_message", (msg: Message) => {
      if (msg.senderId === currentCustomer) {
        return;
      }
      setMessages((prev) => {
        const prevMsgs = prev[msg.senderId] || [];
        return {
          ...prev,
          [msg.senderId]: [...prevMsgs, msg],
        };
      });
      // Nếu sender chưa có trong activeCustomers, thêm họ

      setActiveCustomers((prev) => {
        if (!prev.includes(msg.senderId)) {
          return [...prev, msg.senderId];
        }
        return prev;
      });
      // Nếu chưa có currentCustomer, chuyển sang sender

      setCurrentCustomer((curr) => curr || msg.senderId);
    });

    socket.on("chat_assigned", ({ customerId }: { customerId: string }) => {
      setActiveCustomers((prev) =>
        prev.includes(customerId) ? prev : [...prev, customerId]
      );
      if (!messages[customerId]) {
        setMessages((prev) => ({ ...prev, [customerId]: [] }));
      }
      setCurrentCustomer((c) => c || customerId);
    });

    if (!socket.connected) socket.connect();

    return () => {
      socket.off("user_info");
      socket.off("waiting_customers");
      socket.off("receive_message");
      socket.off("chat_assigned");
    };
  }, []);

  // Lưu vào localStorage khi trạng thái thay đổi
  useEffect(() => {
    saveToLocalStorage();
  }, [messages, waitingCustomers, activeCustomers]);

  const acceptCustomer = (customerId: string) => {
    socket.emit("accept_customer", customerId);
    setActiveCustomers((prev) =>
      prev.includes(customerId) ? prev : [...prev, customerId]
    );
    setCurrentCustomer(customerId);
  };

  const sendMessage = () => {
    if (!input.trim() || !currentCustomer) return;

    socket.emit("send_message", {
      receiverId: currentCustomer,
      content: input,
    });

    setMessages((prev) => ({
      ...prev,
      [currentCustomer]: [
        ...(prev[currentCustomer] || []),
        { senderId: "ME", receiverId: currentCustomer, content: input },
      ],
    }));

    setInput("");
  };

  const removeCustomerFromLocalStorage = (customerId: string) => {
    // Xóa customer khỏi activeCustomers
    const updatedCustomers = activeCustomers.filter((c) => c !== customerId);
    setActiveCustomers(updatedCustomers);
    localStorage.setItem("active_customers", JSON.stringify(updatedCustomers));

    // Xóa tất cả tin nhắn liên quan customerId
    setMessages((prev) => {
      const newMessages: Record<string, Message[]> = {};

      Object.entries(prev).forEach(([key, msgs]) => {
        // Lọc tất cả tin nhắn mà sender hoặc receiver là customerId
        const filteredMsgs = msgs.filter(
          (msg) => msg.senderId !== customerId && msg.receiverId !== customerId
        );

        if (filteredMsgs.length > 0) {
          newMessages[key] = filteredMsgs;
        }
      });

      // Lưu lại
      localStorage.setItem("chat_messages", JSON.stringify(newMessages));
      return newMessages;
    });

    setCurrentCustomer((prev) => {
      if (prev === customerId) {
        const nextWithMessages = updatedCustomers.find(
          (c) => (messages[c] || []).length > 0
        );
        return (
          nextWithMessages ||
          (updatedCustomers.length > 0 ? updatedCustomers[0] : null)
        );
      }
      return prev;
    });
  };

  const removeWaittingCustomer = (customer: string) => {
    const updatedCustomers = waitingCustomers.filter((c) => c !== customer);
    setWaitingCustomers(updatedCustomers);
    setCountCustomer(updatedCustomers.length);

    localStorage.setItem("waiting_customers", JSON.stringify(updatedCustomers));
  };

  const chatList = currentCustomer ? messages[currentCustomer] || [] : [];

  return (
    <div className=" bg-gradient-to-br from-slate-50 to-blue-50 p-4">
      <div className="flex gap-6 h-[calc(100vh-2rem)]  mx-auto">
        {/* Sidebar khách chờ */}
        <div className="w-80 bg-white/80 backdrop-blur-sm border border-white/20 rounded-2xl shadow-xl p-6">
          <div className="mb-6">
            <h3 className="font-bold text-lg text-gray-800 mb-4 flex items-center gap-2">
              <div className="w-3 h-3 bg-orange-400 rounded-full animate-pulse"></div>
              Khách đang chờ
            </h3>
            {waitingCustomers.length === 0 && (
              <div className="text-center py-8">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <svg
                    className="w-8 h-8 text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a1.994 1.994 0 01-2-2V10a2 2 0 012-2h2m2-4h4sped2 2 0 012 2v6a2 2 0 01-2 2h-4v4l-4-4H5a1.994 1.994 0 01-2-2V6a2 2 0 012-2h4z"
                    />
                  </svg>
                </div>
                <p className="text-gray-500 text-sm">Không có khách chờ</p>
              </div>
            )}
            {waitingCustomers.map((c) => (
              <div
                key={c}
                className="flex justify-between items-center mb-3 p-3 bg-orange-50 border border-orange-100 rounded-xl hover:bg-orange-100 transition-colors relative hover:cursor-pointer"
              >
                <div
                  className=" flex items-center gap-3  "
                  onClick={() => acceptCustomer(c)}
                >
                  <div className=" w-10 h-10 bg-gradient-to-br from-orange-400 to-orange-500 rounded-full flex items-center justify-center text-white font-semibold text-sm ">
                    {c.charAt(0).toUpperCase()}
                  </div>

                  <button className="font-medium text-gray-700 hover:cursor-pointer">
                    guest_{c.split("_")[2]}
                  </button>
                </div>
                <button
                  onClick={() => removeWaittingCustomer(c)}
                  className={`absolute  hover:text-red-500 right-0 top-0 hover:cursor-pointer text-red-600 `}
                >
                  <X />
                </button>
              </div>
            ))}
          </div>

          <div>
            <h3 className="font-bold text-lg text-gray-800 mb-4 flex items-center gap-2">
              <div className="w-3 h-3 bg-green-400 rounded-full"></div>
              Khách đang chat
            </h3>
            {activeCustomers.length === 0 && (
              <div className="text-center py-8">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <svg
                    className="w-8 h-8 text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                    />
                  </svg>
                </div>
                <p className="text-gray-500 text-sm">Chưa có khách nào</p>
              </div>
            )}
            {activeCustomers.map((c) => (
              <div
                key={c}
                className={`relative cursor-pointer p-3 rounded-xl mb-2 transition-all duration-200 flex items-center gap-3 ${
                  currentCustomer === c
                    ? "bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-lg transform scale-105"
                    : "hover:bg-blue-50 text-gray-700 hover:shadow-md"
                }`}
                onClick={() => setCurrentCustomer(c)}
              >
                <div
                  className={`relative w-10 h-10 rounded-full flex items-center justify-center font-semibold text-sm ${
                    currentCustomer === c
                      ? "bg-white/20 text-white"
                      : "bg-gradient-to-br from-blue-400 to-blue-500 text-white"
                  }`}
                >
                  {c.charAt(0).toUpperCase()}
                </div>
                <span className="font-medium"> guest_{c.split("_")[2]}</span>

                <button
                  onClick={() => removeCustomerFromLocalStorage(c)}
                  className={`absolute  hover:text-red-500 right-0 top-0 hover:cursor-pointer ${
                    currentCustomer === c ? "text-white" : "text-blue-700"
                  } `}
                >
                  <X />
                </button>

                {currentCustomer === c && (
                  <div className="ml-auto">
                    <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Khung chat */}
        <div className="flex-1 flex flex-col bg-white/80 backdrop-blur-sm border border-white/20 rounded-2xl shadow-xl overflow-hidden">
          <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white p-6 flex items-center gap-4">
            <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
              {currentCustomer ? (
                <span className="font-bold text-lg">
                  {currentCustomer.charAt(0).toUpperCase()}
                </span>
              ) : (
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                  />
                </svg>
              )}
            </div>
            <div>
              <h2 className="font-bold text-xl">
                {currentCustomer
                  ? `Chat với ${currentCustomer}`
                  : "Chưa chọn khách"}
              </h2>
              {currentCustomer && (
                <div className="text-blue-100 text-sm flex items-center gap-1">
                  <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                  Đang hoạt động
                </div>
              )}
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-gradient-to-b from-gray-50/50 to-white/50">
            {chatList.length === 0 && currentCustomer && (
              <div className="text-center py-12">
                <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg
                    className="w-10 h-10 text-blue-500"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                    />
                  </svg>
                </div>
                <p className="text-gray-500">
                  Bắt đầu cuộc trò chuyện với {currentCustomer}
                </p>
              </div>
            )}

            {chatList.map((msg, idx) => (
              <div
                key={idx}
                className={`flex ${
                  msg.senderId === "ME" ? "justify-end" : "justify-start"
                }`}
              >
                <div
                  className={`flex items-end gap-2 max-w-xs lg:max-w-md ${
                    msg.senderId === "ME" ? "flex-row-reverse" : "flex-row"
                  }`}
                >
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-semibold ${
                      msg.senderId === "ME"
                        ? "bg-gradient-to-br from-blue-500 to-blue-600 text-white"
                        : "bg-gradient-to-br from-gray-400 to-gray-500 text-white"
                    }`}
                  >
                    {msg.senderId === "ME"
                      ? "ME"
                      : msg.senderId.charAt(0).toUpperCase()}
                  </div>
                  <div
                    className={`px-4 py-3 rounded-2xl shadow-sm ${
                      msg.senderId === "ME"
                        ? "bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-br-md"
                        : "bg-white border border-gray-200 text-gray-800 rounded-bl-md"
                    }`}
                  >
                    <p className="text-sm leading-relaxed">{msg.content}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {currentCustomer && (
            <div className="p-6 bg-white/90 backdrop-blur-sm border-t border-gray-200/50">
              <div className="flex gap-3">
                <div className="flex-1 relative">
                  <input
                    className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 pr-12 focus:border-blue-500 focus:outline-none transition-colors bg-white/80 backdrop-blur-sm placeholder-gray-500"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && sendMessage()}
                    placeholder="Nhập tin nhắn..."
                  />
                  <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                    <svg
                      className="w-5 h-5 text-gray-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M7 4V2a1 1 0 011-1h8a1 1 0 011 1v2M7 4h10M7 4l-2 16h14L17 4M9 9v6M15 9v6"
                      />
                    </svg>
                  </div>
                </div>
                <button
                  className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-6 py-3 rounded-xl font-medium transition-all duration-200 transform hover:scale-105 shadow-lg hover:shadow-xl flex items-center gap-2"
                  onClick={sendMessage}
                >
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
                    />
                  </svg>
                  Gửi
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
