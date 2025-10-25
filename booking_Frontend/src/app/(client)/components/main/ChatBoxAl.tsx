"use client";
import ReactMarkdown from "react-markdown";
import { URL_API } from "@/lib/fetcher";
import axios from "axios";
import { useState, useRef, useEffect } from "react";
import { PaperAirplaneIcon } from "@heroicons/react/24/outline";
import { BotMessageSquare, Maximize, X } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

export default function ChatBoxAL() {
  const [messages, setMessages] = useState<
    {
      role: string;
      content: string;
    }[]
  >([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [expand, setExpand] = useState(false);
  // Auto-scroll to bottom when mssages
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  async function sendMessage(e?: React.FormEvent) {
    e?.preventDefault();
    if (!input.trim() || isLoading) return;

    const newMessages = [
      ...messages,
      {
        role: "user",
        content: input,
      },
    ];
    setMessages(newMessages);
    setInput("");
    setIsLoading(true);

    try {
      const res = await axios.post(`${URL_API}/api/chatai`, {
        message: input,
      });

      if (res.data) {
        const data = res.data.data;
        setMessages([
          ...newMessages,
          {
            role: "system",
            content: data,
          },
        ]);
      }
    } catch (error) {
      setMessages([
        ...newMessages,
        {
          role: "system",
          content: "xảy ra lỗi, vui lòng thử lại sau.",
        },
      ]);
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
        <div
          className="fixed rounded-full bg-gradient-to-r from-blue-500 to-blue-600 text-white p-4 hover:cursor-pointer w-fit z-50 bottom-14  right-5 md:right-4 border-none outline-none"
          onClick={() => setIsOpen(!isOpen)}
          title="Chat Bot Ai"
        >
          <BotMessageSquare className="w-6 h-6 md:w-7 md:h-7 animate-bounce-light " />
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
            {messages.length === 0 ? (
              <div className="flex items-center justify-center h-full text-gray-500 text-center px-4">
                <p>Bắt đầu cuộc trò chuyện bằng cách nhập tin nhắn bên dưới</p>
              </div>
            ) : (
              messages.map((m, i) => (
                <div
                  key={i}
                  className={`mb-4 flex items-end ${
                    m.role === "user" ? "justify-end" : "justify-start"
                  }`}
                >
                  {m.role !== "user" && (
                    <div className="mr-1 p-1 rounded-full bg-blue-500">
                      <Image
                        src={"/image/nhanvien.png"}
                        alt="anhdaidien"
                        width={50}
                        height={50}
                        className="w-8 h-8 object-contain rounded-full"
                      />
                    </div>
                  )}
                  <div
                    className={`max-w-[80%] rounded-lg px-3 ${
                      m.role === "user"
                        ? "bg-blue-500 text-white rounded-br-none text-end"
                        : "bg-gray-200 text-gray-800 rounded-bl-none text-start"
                    }`}
                  >
                    <ReactMarkdown
                      components={{
                        div: ({ children }) => (
                          <p className="text-base my-6">{children}</p>
                        ),
                        p: ({ children }) => (
                          <p className="text-lg leading-relaxed my-2 josefin-sans ">
                            {children}
                          </p>
                        ),
                        strong: ({ children }) => (
                          <strong className="text-black font-bold">
                            {children}
                          </strong>
                        ),
                        em: ({ children }) => (
                          <em className="italic text-orange-500">{children}</em>
                        ),
                        a: ({ href, children }) => (
                          <Link
                            href={href || "#"}
                            className="underline text-blue-500 my-5"
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            {children}
                          </Link>
                        ),
                        h1: ({ children }) => (
                          <h1 className="text-2xl font-bold text-gray-900 ">
                            {children}
                          </h1>
                        ),
                        h2: ({ children }) => (
                          <h2 className="text-xl font-semibold text-gray-800 mt-4">
                            {children}
                          </h2>
                        ),
                        h3: ({ children }) => (
                          <h3 className="text-lg font-semibold text-gray-700 mt-3">
                            {children}
                          </h3>
                        ),
                        ul: ({ children }) => (
                          <ul
                            className="list-disc list-inside ml-4 mt-2"
                            style={{
                              listStyleType: "revert-layer", // bullet kiểu chấm
                              paddingLeft: "20px",
                              marginTop: "8px",
                            }}
                          >
                            {children}
                          </ul>
                        ),
                        li: ({ children }) => (
                          <li className="mb-1 josefin-sans">{children}</li>
                        ),
                        code: ({ children }) => (
                          <code className="bg-gray-100 text-sm text-gray-800 px-1 py-0.5 rounded">
                            {children}
                          </code>
                        ),
                      }}
                    >
                      {m.content}
                    </ReactMarkdown>
                  </div>
                  {m.role === "user" && (
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
              ))
            )}
            <div ref={messagesEndRef} />
            {isLoading && (
              <div className="flex justify-start  mb-4">
                <div className="mr-1 p-1 rounded-full bg-blue-500">
                  <Image
                    src={"/image/nhanvien.png"}
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
