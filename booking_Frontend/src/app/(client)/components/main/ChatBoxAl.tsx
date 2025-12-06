"use client";
import { URL_API } from "@/lib/fetcher";
import axios from "axios";
import { useState, useRef, useEffect } from "react";
import { PaperAirplaneIcon } from "@heroicons/react/24/outline";
import { Maximize, X } from "lucide-react";
import Image from "next/image";
import MarkDown from "@/hook/MarkDown";
import axiosInstance from "@/lib/axios";
import { useChatSession } from "@/hook/useChatSession";

interface ChatMessage {
  lc: number; // LangChain message index
  type: string; // "constructor"
  id: string[]; // ["langchain_core", "messages", "HumanMessage"]
  kwargs: {
    content: string; // Nội dung tin nhắn
  };
}

export default function ChatBoxAL() {
  const [history, setHistory] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [expand, setExpand] = useState(false);
  const sessionId = useChatSession();

  // Auto-scroll to bottom when mssages
  useEffect(() => {
    scrollToBottom();
  }, [history]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const res = await axiosInstance.post("/api/chatai/", {
          sessionId,
          message: "",
        });
        if (res.data?.history) {
          setHistory(res.data.history);
        }
      } catch (error) {
        console.error("Lỗi khi lấy lịch sử chat:", error);
      }
    };

    if (isOpen) {
      fetchHistory();
    }
  }, [isOpen]);

  async function sendMessage(e?: React.FormEvent) {
    e?.preventDefault();
    if (!input.trim() || isLoading) return;
    const userMessage = input.trim();
    setInput("");
    setIsLoading(true);

    const optimisticMessage: ChatMessage = {
      lc: Date.now(),
      type: "constructor",
      id: ["langchain_core", "messages", "HumanMessage"],
      kwargs: {
        content: userMessage,
      },
    };

    setHistory((prev) => [...prev, optimisticMessage]);

    try {
      const res = await axios.post(`${URL_API}/api/chatai`, {
        message: input,
        sessionId,
      });

      if (res.data) {
        setHistory(res.data.history);
      }
    } catch (error) {
      console.error("Lỗi khi gửi tin nhắn:", error);
      setHistory((prev) =>
        prev.filter((msg) => msg.lc !== optimisticMessage.lc)
      );
    } finally {
      setIsLoading(false);
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      sendMessage();
    }
  };

  return (
    <>
      {/* Floating action button - shows on mobile and desktop */}
      {!isOpen && (
        <div className="group fixed bottom-14 right-5 z-50 w-full">
          {/* Nút chatbot */}
          <div
            className="fixed rounded-full bg-gradient-to-r animate-bounce-light from-blue-500 to-blue-600 text-white p-1 w-fit cursor-pointer border-none outline-none bottom-14 right-5"
            onClick={() => setIsOpen(!isOpen)}
            title="Hỗ Trợ Bạn Tìm Thông Tin Nhanh Chống Bằng Ai"
          >
            <Image
              src={"/image/iSeeMascoticenter.gif"}
              alt="anhdaidien"
              width={50}
              height={50}
              className="object-contain rounded-full "
            />
          </div>

          {/* Tooltip */}
          <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-white shadow-2xl border-2 px-4 py-2 rounded-2xl absolute -top-28 -right-7">
            xin chào tôi là lễ tân Ai
          </div>
        </div>
      )}

      {isOpen && (
        <div
          className={`fixed flex flex-col bg-white rounded-xl shadow-lg overflow-hidden z-40 md:mb-6 md:mr-14  h-[calc(100vh-8rem)] w-[calc(100vw-2rem)]
    ${expand ? "max-w-6xl" : "max-w-lg"} bottom-20  right-4 `}
        >
          {/* Chat header */}
          <div className="bg-gradient-to-r from-blue-500 to-blue-600 px-4 py-2 text-white flex justify-between items-center cursor-pointer">
            <div>
              <h2 className="text-xl font-semibold">Trợ Lý Ai</h2>
              <p className="text-sm opacity-80">Tôi có thể giúp gì cho bạn?</p>
            </div>
            <div className="flex items-center gap-8  cursor-pointer">
              <Maximize
                onClick={() => setExpand(!expand)}
                className="hidden md:block hover:scale-120 transition-transform "
              />
              <button
                onClick={() => setIsOpen(false)}
                className="p-1 rounded-full hover:bg-blue-400 transition-colors"
              >
                <X className="w-7 h-7 text-red-500 hover:text-red-600" />
              </button>
            </div>
          </div>

          {/* Messages area */}
          <div className="flex-1 px-5 py-1 mt-4 overflow-y-auto bg-gray-50">
            {history?.length === 0 ? (
              <div className="flex items-center justify-center h-full text-gray-500 text-center px-4">
                <p>Bắt đầu cuộc trò chuyện bằng cách nhập tin nhắn bên dưới</p>
              </div>
            ) : (
              history?.map((m, i) => {
                const isUser = m.id.includes("HumanMessage");
                const isAssistant = m.id.includes("AIMessage");
                const text = m.kwargs?.content || "";
                return (
                  <div
                    key={i}
                    className={`mb-4 flex items-end ${
                      isUser ? "justify-end" : "justify-start"
                    }`}
                  >
                    {isAssistant && (
                      <div className="mr-1 p-1 rounded-full bg-blue-500">
                        <Image
                          src={"/image/chatbot-chat.avif"}
                          alt="anhdaidien"
                          width={50}
                          height={50}
                          className="w-8 h-8 object-contain rounded-full"
                        />
                      </div>
                    )}
                    <div
                      className={`max-w-[80%] rounded-lg px-3 ${
                        isUser
                          ? "bg-blue-500 text-white rounded-br-none text-end"
                          : "bg-gray-200 text-gray-800 rounded-bl-none text-start"
                      }`}
                    >
                      <MarkDown>{text}</MarkDown>
                    </div>
                    {isUser && (
                      <div className="ml-1 p-1 rounded-full bg-blue-500">
                        <Image
                          src={"/image/anhdaidien.jpg"}
                          alt="anhdaidien"
                          width={50}
                          height={50}
                          className="w-8 h-8 object-contain rounded-full"
                        />
                      </div>
                    )}
                  </div>
                );
              })
            )}
            <div ref={messagesEndRef} />
            {isLoading && (
              <div className="flex justify-start  mb-4">
                <div className="mr-1 p-1 rounded-full bg-blue-500">
                  <Image
                    src={"/image/chatbot-chat.avif"}
                    alt="anhdaidien"
                    width={50}
                    height={50}
                    className="w-8 h-8 object-contain rounded-full"
                  />
                </div>
                <div className="bg-gray-200 text-gray-800 rounded-lg rounded-bl-none p-3 max-w-[80%]">
                  <div className="flex space-x-2">
                    <div className="w-2 h-2 rounded-full bg-gray-500 animate-bounce"></div>
                    <div className="w-2 h-2 rounded-full bg-gray-500 animate-bounce delay-100"></div>
                    <div className="w-2 h-2 rounded-full bg-gray-500 animate-bounce delay-200"></div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Input area */}
          <form onSubmit={sendMessage} className="border-t p-4 bg-white">
            <div className="flex gap-2">
              <input
                className="flex-1 border border-gray-300 rounded-full px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Type your message..."
                disabled={isLoading}
              />
              <button
                type="submit"
                className="bg-blue-500 hover:bg-blue-600 text-white rounded-full p-2 w-10 h-10 flex items-center justify-center transition-colors disabled:opacity-50"
                disabled={!input.trim() || isLoading}
              >
                <PaperAirplaneIcon className="w-5 h-5" />
              </button>
            </div>
          </form>
        </div>
      )}
    </>
  );
}
