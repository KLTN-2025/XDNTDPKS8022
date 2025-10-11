export const formatDate = (dateString: string) => {
  if (!dateString) return "";
  const date = new Date(dateString);
  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0"); // tháng bắt đầu từ 0
  const year = date.getFullYear();
  return `${day}/${month}/${year}`;
};

export const calculateNights = (
  checkInDate: Date | null,
  checkOutDate: Date | null
) => {
  if (checkInDate == null || checkOutDate == null) return null;

  const checkIn = new Date(checkInDate);
  const checkOut = new Date(checkOutDate);

  const diffTime = checkOut.getTime() - checkIn.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  return diffDays > 0 ? diffDays : 0;
};
