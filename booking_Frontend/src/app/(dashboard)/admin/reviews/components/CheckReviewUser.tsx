"use client";
import React from "react";
import moment from "moment";
import DeleteReview from "./DeleteReview";

moment.locale("vi"); // Kích hoạt locale tiếng Việt

interface User {
  id: string;
  lastName: string;
  firstName: string;
}

interface Customer {
  user: User;
}

interface Review {
  id: string;
  rating: number;
  comment: string;
  reviewDate: string;
  customer: Customer;
}

interface CheckReviewUserProps {
  reviews: Review[];
}

export default function CheckReviewUser({ reviews }: CheckReviewUserProps) {
  return (
    <div className="space-y-6  mx-auto scroll-auto  bg-white p-8">
      <div>
        <h1 className="text-2xl font-semibold mb-2">
          Danh Sách Đánh Giá của Hotel
        </h1>
      </div>
      {reviews && reviews.length > 0 ? (
        reviews.map((review) => (
          <div
            key={review.id}
            className="relative bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow duration-300 p-6 border border-gray-100"
          >
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4">
              <div className="mb-4 sm:mb-0">
                <h3 className="text-lg font-semibold text-gray-800">
                  {review.customer.user.firstName}{" "}
                  {review.customer.user.lastName}
                </h3>
                <p className="text-sm text-gray-500 mt-1">
                  {moment(review.reviewDate).fromNow()}
                </p>
              </div>
              <div className="flex items-center space-x-1">
                {[...Array(5)].map((_, index) => (
                  <svg
                    key={index}
                    className={`w-5 h-5 ${
                      index < review.rating
                        ? "text-yellow-400"
                        : "text-gray-300"
                    }`}
                    fill="currentColor"
                    viewBox="0 0 20 20"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.97a1 1 0 00.95.69h4.18c.969 0 1.371 1.24.588 1.81l-3.392 2.46a1 1 0 00-.364 1.118l1.287 3.97c.3.921-.755 1.688-1.539 1.118l-3.392-2.46a1 1 0 00-1.176 0l-3.392 2.46c-.784.57-1.838-.197-1.539-1.118l1.287-3.97a1 1 0 00-.364-1.118L2.098 9.397c-.783-.57-.38-1.81.588-1.81h4.18a1 1 0 00.95-.69l1.286-3.97z" />
                  </svg>
                ))}
              </div>
            </div>{" "}
            <p className="text-gray-600 leading-relaxed">
              <span className="font-medium text-gray-800">Đánh giá: </span>
              {review.comment}
            </p>
            <div className="absolute top-0 right-0">
              <DeleteReview id={review.id} />
            </div>
          </div>
        ))
      ) : (
        <div className="text-center mt-7">chưa có đánh giá nào !!!</div>
      )}
    </div>
  );
}
