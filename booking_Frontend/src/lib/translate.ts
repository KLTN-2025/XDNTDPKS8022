// Translate status to Vietnamese
export const translateStatus = (status: string) => {
  const statusMap: Record<string, string> = {
    PENDING: "Đang chờ xác nhận",
    CONFIRMED: "Đã xác nhận",
    CHECKED_IN: "Đã nhận phòng",
    CHECKED_OUT: "Đã trả phòng",
    CANCELLED: "Đã hủy",
    NO_SHOW: "Không đến",
  };
  return statusMap[status] || status;
};
export const translatePaymentStatus = (status: string) => {
  const statusMap: Record<string, string> = {
    PENDING: "Đang chờ thanh toán",
    COMPLETED: "Đã thanh toán",
    FAILED: "Thanh toán thất bại",
    REFUNDED: "Đã hoàn tiền",
  };

  return statusMap[status] || status;
};
// Translate payment method
export const translatePaymentMethod = (method: string) => {
  const methodMap: Record<string, string> = {
    CASH: "Tiền mặt",
    CREDIT_CARD: "Thẻ tín dụng",
    DEBIT_CARD: "Thẻ ghi nợ",
    BANK_TRANSFER: "Chuyển khoản",
    PAYPAL: "PayPal",
    MOBILE_PAYMENT: "Ví điện tử",
  };
  return methodMap[method] || method;
};
