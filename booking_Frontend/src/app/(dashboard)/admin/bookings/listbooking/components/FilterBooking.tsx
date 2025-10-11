import SearchForm from "@/app/(dashboard)/components/searchPage/SearchForm";
import { Calendar, Search } from "lucide-react";
import React from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

interface IFilterBooking {
  setDates: React.Dispatch<React.SetStateAction<Dates>>;
  dates: Dates;
  isNumber: string | number;
  setIsNumber: (value: string) => void;
}

type Dates = {
  checkInDate: Date | null;
  checkOutDate: Date | null;
};

const FilterBooking = ({
  dates,
  setDates,
  isNumber,
  setIsNumber,
}: IFilterBooking) => {
  return (
    <div className="w-full bg-card  p-4 mb-5  transition-all duration-300 ">
      <div className="flex flex-col md:flex-row md:justify-around gap-4 w-full">
        {/* Check-in Date */}
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-primary" />
            <label className="text-sm font-medium text-foreground font-serif">
              Ngày nhận phòng
            </label>
          </div>
          <div className="relative group">
            <DatePicker
              placeholderText="Chọn ngày nhận phòng"
              dateFormat="dd/MM/yyyy"
              className="w-full p-3 bg-input border border-border rounded-xl focus:ring-2 focus:ring-ring focus:border-primary transition-all duration-200 text-foreground placeholder:text-muted-foreground font-sans hover:border-primary/50"
              selected={dates.checkInDate}
              onChange={(date) =>
                setDates((prev) => ({
                  ...prev,
                  checkInDate: date,
                }))
              }
              showPopperArrow={false}
              popperClassName="react-datepicker-popper"
            />
            {/* <CHANGE> Added subtle gradient border effect */}
            <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-primary/20 to-accent/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none -z-10 blur-sm" />
          </div>
        </div>
        {/* Check-out Date */}
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-accent" />
            <label className="text-sm font-medium text-foreground font-serif">
              Ngày trả phòng
            </label>
          </div>
          <div className="relative group">
            <DatePicker
              placeholderText="Chọn ngày trả phòng"
              dateFormat="dd/MM/yyyy"
              className="w-full p-3 bg-input border border-border rounded-xl focus:ring-2 focus:ring-ring focus:border-accent transition-all duration-200 text-foreground placeholder:text-muted-foreground font-sans hover:border-accent/50"
              selected={dates.checkOutDate}
              onChange={(date) =>
                setDates((prev) => ({
                  ...prev,
                  checkOutDate: date,
                }))
              }
              showPopperArrow={false}
              popperClassName="react-datepicker-popper"
            />
            {/* <CHANGE> Added subtle gradient border effect */}
            <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-accent/20 to-primary/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none -z-10 blur-sm" />
          </div>
        </div>
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <Search className="w-5 h-5 text-primary" />
            <label className="text-sm font-medium text-foreground font-serif">
              Tìm Kiếm
            </label>
          </div>
          <SearchForm
            placeholder="Nhập CCCD vào đây ..."
            search={isNumber}
            setSearch={setIsNumber}
            resetPage
            className="w-[290px]"
            setPage={() => {}}
          />
        </div>
      </div>
    </div>
  );
};

export default FilterBooking;
