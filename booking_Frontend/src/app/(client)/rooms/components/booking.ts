import { Banknote, CreditCard, QrCode, Wallet } from "lucide-react";

export enum PaymentMethod {
  CASH = "CASH",
  CREDIT_CARD = "CREDIT_CARD",
  PAYPAL = "PayPal",
  QR_CODE = "QR_CODE",
}

export const paymentMethodDisplayNames: Record<PaymentMethod, string> = {
  [PaymentMethod.CASH]: "Tiền Mặt",
  [PaymentMethod.CREDIT_CARD]: "Thẻ Tín Dụng",
  [PaymentMethod.PAYPAL]: "PayPal",
  [PaymentMethod.QR_CODE]: "QR Code",
};

export const paymentMethodDescriptions: Record<PaymentMethod, string> = {
  [PaymentMethod.CASH]: "Thanh toán bằng tiền mặt khi nhận phòng",
  [PaymentMethod.CREDIT_CARD]:
    "Thanh toán an toàn bằng thẻ tín dụng/thẻ ghi nợ",
  [PaymentMethod.PAYPAL]: "Thanh toán bằng tài khoản PayPal của bạn",
  [PaymentMethod.QR_CODE]: "Quét mã QR bằng ứng dụng ngân hàng của bạn",
};

export const paymentMethodIcons: Record<
  PaymentMethod,
  React.ComponentType<{ className: string }>
> = {
  [PaymentMethod.CASH]: Banknote,
  [PaymentMethod.CREDIT_CARD]: CreditCard,
  [PaymentMethod.PAYPAL]: Wallet,
  [PaymentMethod.QR_CODE]: QrCode,
};
