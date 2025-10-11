import axios from "axios";
import { useRouter } from "next/navigation";
import React, { useState, useEffect } from "react";
import toast from "react-hot-toast";
import Modal from "react-modal";
import {
  Banknote,
  CreditCard,
  Wallet,
  QrCode,
  XIcon,
  CheckIcon,
} from "lucide-react";
import { URL_API } from "@/lib/fetcher";
import LoginModal from "./LoginModal";
import InfoBooking from "./InfoBooking";

enum PaymentMethod {
  CASH = "CASH",
  CREDIT_CARD = "CREDIT_CARD",
  PAYPAL = "PayPal",
  QR_CODE = "QR_CODE",
}

interface ModalPaymentProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  formData: {
    checkInDate: string;
    checkOutDate: string;
    totalGuests: number;
    specialRequests: string;
    totalAmount: number;
    discountId: number | null;
    pricePerNight: number;
    roomId: number;
  };
  onConfirmPayment?: (paymentMethod: PaymentMethod) => void;
}

const ModalPayment = ({ isOpen, setIsOpen, formData }: ModalPaymentProps) => {
  const [selectedPaymentMethod, setSelectedPaymentMethod] =
    useState<PaymentMethod | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [token, setToken] = useState<string | null>(null);
  const [isLogin, setIsLogin] = useState(false);
  const router = useRouter();

  useEffect(() => {
    Modal.setAppElement("#root");
  }, []);
  const handleClose = () => {
    setIsOpen(false);
    setIsProcessing(false);
    setSelectedPaymentMethod(null);
  };

  useEffect(() => {
    const interval = setInterval(() => {
      const getToken = localStorage.getItem("token");
      setToken(getToken);
    }, 500); // check mỗi 500ms

    return () => clearInterval(interval);
  }, []);

  const paymentMethodDisplayNames: Record<PaymentMethod, string> = {
    [PaymentMethod.CASH]: "Tiền Mặt",
    [PaymentMethod.CREDIT_CARD]: "Thẻ Tín Dụng",
    [PaymentMethod.PAYPAL]: "PayPal",
    [PaymentMethod.QR_CODE]: "QR Code",
  };

  const paymentMethodDescriptions: Record<PaymentMethod, string> = {
    [PaymentMethod.CASH]: "Thanh toán bằng tiền mặt khi nhận phòng",
    [PaymentMethod.CREDIT_CARD]:
      "Thanh toán an toàn bằng thẻ tín dụng/thẻ ghi nợ",
    [PaymentMethod.PAYPAL]: "Thanh toán bằng tài khoản PayPal của bạn",
    [PaymentMethod.QR_CODE]: "Quét mã QR bằng ứng dụng ngân hàng của bạn",
  };

  const paymentMethodIcons: Record<
    PaymentMethod,
    React.ComponentType<{ className: string }>
  > = {
    [PaymentMethod.CASH]: Banknote,
    [PaymentMethod.CREDIT_CARD]: CreditCard,
    [PaymentMethod.PAYPAL]: Wallet,
    [PaymentMethod.QR_CODE]: QrCode,
  };

  const handlePaymentMethodSelect = (method: PaymentMethod) => {
    if (!isProcessing) setSelectedPaymentMethod(method);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);
    if (token) {
      setIsLogin(false);
      try {
        const res = await axios.post(`${URL_API}/api/booking`, formData, {
          withCredentials: true,
        });
        if (res.data) {
          // router.push("/profile/bookings");
          toast.success("Đặt phòng thành công!");
          setIsOpen(false);
          const resPayment = await axios.post(`${URL_API}/api/payment`, {
            amount: formData.totalAmount,
            paymentMethod: selectedPaymentMethod,
            bookingId: res.data.data.id,
            status: "PENDING",
          });
          if (resPayment.data) {
            // phương thức thanh toán là QR_CODE
            if (
              selectedPaymentMethod === PaymentMethod.QR_CODE &&
              resPayment.data.status === "redirect"
            ) {
              const { url } = resPayment.data;
              window.location.href = url;
              console.log(url);
            }
          }
        }
      } catch (error: any) {
        toast.error(error?.response?.data?.message || "Có lỗi xảy ra!");
      } finally {
        setIsProcessing(false);
      }
    } else {
      setIsLogin(true);
      toast.error("Vui Lòng Đăng Nhập");
    }
  };

  return (
    <>
      <Modal
        isOpen={isOpen}
        onRequestClose={handleClose}
        contentLabel="Payment Confirmation"
        className="bg-white rounded-lg shadow-lg p-6 w-[90%] max-w-6xl mx-auto mt-5 outline-none"
        overlayClassName="fixed inset-0 bg-black/20 flex justify-center items-start z-50 overflow-auto"
      >
        <form className="flex flex-col" onSubmit={handleSubmit}>
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl md:text-2xl  font-bold">
              Xác Nhận Thanh Toán
            </h2>
            <button
              type="button"
              onClick={handleClose}
              className="text-gray-500 hover:text-gray-700"
            >
              <XIcon className="h-6 w-6" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Booking Information */}
            <InfoBooking formData={formData} />

            {/* Payment Methods */}
            <div>
              <h3 className="text-base md:text-xl   font-semibold mb-4">
                Chọn Phương Thức Thanh Toán
              </h3>
              <div className="space-y-3">
                {Object.values(PaymentMethod).map((method) => {
                  const Icon = paymentMethodIcons[method];
                  return (
                    <div
                      key={method}
                      onClick={() => handlePaymentMethodSelect(method)}
                      className={`p-4 border rounded-lg cursor-pointer flex items-center ${
                        selectedPaymentMethod === method
                          ? "border-blue-500 bg-blue-50"
                          : "hover:bg-gray-50"
                      }`}
                    >
                      <Icon className="h-6 w-6 mr-3" />
                      <div>
                        <h4 className="font-medium">
                          {paymentMethodDisplayNames[method]}
                        </h4>
                        <p className="text-sm text-gray-500">
                          {paymentMethodDescriptions[method]}
                        </p>
                      </div>
                      {selectedPaymentMethod === method && (
                        <CheckIcon className="h-6 w-6 text-blue-500 ml-auto" />
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          <div className="mt-8 flex justify-end space-x-3">
            <button
              type="button"
              onClick={handleClose}
              className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded disabled:opacity-50"
            >
              Hủy
            </button>
            <button
              type="submit"
              disabled={!selectedPaymentMethod || isProcessing}
              className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 flex items-center"
            >
              {isProcessing ? (
                <>
                  <svg
                    className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    />
                  </svg>
                  Đang xử lý...
                </>
              ) : (
                "Xác Nhận Thanh Toán"
              )}
            </button>
          </div>
        </form>
      </Modal>
      {isLogin && (
        <LoginModal
          isLogin={isLogin}
          setIsLogin={setIsLogin}
          setIsProcessing={setIsProcessing}
        />
      )}
    </>
  );
};

export default ModalPayment;
