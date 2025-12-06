"use client";
import React from "react";
import moment from "moment";
import DeleteReview from "./DeleteReview";

moment.locale("vi");

interface User {
  id: string;
  lastName: string;
  firstName: string;
}

interface Customer {
  user: User;
}

export interface Review {
  id: string;
  rating: number;
  comment: string;
  reviewDate: string;
  customer: Customer;
}

export interface ReviewTableFormProps {
  reviews: Review[];
}

export default function ReviewTableForm({ reviews }: ReviewTableFormProps) {
  return (
    <div className="bg-white p-8">
      <h1 className="text-2xl font-semibold mb-6">
        Danh Sách Đánh Giá của Hotel
      </h1>

      <div className="overflow-x-auto shadow-md rounded-lg border border-gray-200">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Khách Hàng
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Thời Gian
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Đánh Giá
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Bình Luận
              </th>
              <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                Hành Động
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {reviews && reviews.length > 0 ? (
              reviews.map((review) => (
                <tr
                  key={review.id}
                  className="hover:bg-gray-50 transition-colors"
                >
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">
                      {review.customer.user.firstName}{" "}
                      {review.customer.user.lastName}
                    </div>
                  </td>

                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-500">
                      {moment(review.reviewDate).fromNow()}
                    </div>
                    <div className="text-xs text-gray-400">
                      {moment(review.reviewDate).format("DD/MM/YYYY")}
                    </div>
                  </td>

                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center space-x-1">
                      {[...Array(5)].map((_, index) => (
                        <svg
                          key={index}
                          className={`w-4 h-4 ${
                            index < review.rating
                              ? "text-yellow-400"
                              : "text-gray-300"
                          }`}
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.97a1 1 0 00.95.69h4.18c.969 0 1.371 1.24.588 1.81l-3.392 2.46a1 1 0 00-.364 1.118l1.287 3.97c.3.921-.755 1.688-1.539 1.118l-3.392-2.46a1 1 0 00-1.176 0l-3.392 2.46c-.784.57-1.838-.197-1.539-1.118l1.287-3.97a1 1 0 00-.364-1.118L2.098 9.397c-.783-.57-.38-1.81.588-1.81h4.18a1 1 0 00.95-.69l1.286-3.97z" />
                        </svg>
                      ))}
                    </div>
                  </td>

                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-600 max-w-md">
                      {review.comment}
                    </div>
                  </td>

                  <td className="px-6 py-4 whitespace-nowrap text-center">
                    <div className="flex justify-center space-x-2">
                      <DeleteReview id={review.id} />
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={5} className="px-6 py-8 text-center text-gray-500">
                  Chưa có đánh giá nào!!!
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
