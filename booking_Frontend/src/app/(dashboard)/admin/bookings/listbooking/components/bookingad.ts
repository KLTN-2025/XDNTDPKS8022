export interface IBooking {
  id: string;
  checkInDate: string; // ISO string
  checkOutDate: string; // ISO string
  status: "PENDING" | "CONFIRMED" | "CANCELLED" | "CHECKED_IN" | "CHECKED_OUT";
  totalAmount: string; // String to match API
  totalGuests: number;
  createdAt: string;
  bookingItems: {
    room: { roomNumber: number; roomType: { name: string; photoUrls: string } };
  }[];
  customer: {
    id: string;
    idNumber: number;
    user: {
      firstName: string;
      lastName: string;
      email: string;
      phone: string;
    };
  };
  payments: {
    id: string;
    status: "PENDING" | "COMPLETED" | "FAILED";
    paymentMethod: string;
    transactionId?: string;
    amount: number;
  }[];
}
