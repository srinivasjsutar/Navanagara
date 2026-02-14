import axios from "axios";
import React, { useEffect, useState } from "react";

export default function PaymentTable() {
  const [tableData, setTableData] = useState([]);

  const headers = [
    "Date",
    "Seniority No",
    "Name",
    "Project",
    "Payment Mode",
    "Payment Type",
    "Amount",
  ];

  useEffect(() => {
    axios
      .get("https://navagara-backend.onrender.com/receipts")
      .then((response) => {
        setTableData(response.data.data || []);
      })
      .catch((err) => console.error("Unable to fetch the data!..", err));
  }, []);

  return (
    <div className="w-full max-w-[1070px] mx-auto p-6">
      <div className="overflow-hidden rounded-2xl shadow-lg">
        <table className="w-full">
          <thead>
            <tr className="bg-[#8356D6]">
              {headers.map((header, index) => (
                <th
                  key={index}
                  className="px-6 py-4 text-center text-white font-semibold text-base tracking-wide"
                >
                  {header}
                </th>
              ))}
            </tr>
          </thead>

          <tbody className="bg-white">
            {tableData.map((receipt, rowIndex) => (
              <tr
                key={rowIndex}
                className="border-b border-gray-200 text-center hover:bg-purple-50 transition-colors duration-200"
              >
                <td className="px-6 py-4 text-gray-700 font-medium">
                  {receipt.date
                    ? new Date(receipt.date).toLocaleDateString()
                    : "-"}
                </td>

                <td className="px-6 py-4 text-gray-700 font-medium">
                  {receipt.seniority_no || "-"}
                </td>

                <td className="px-6 py-4 text-gray-700 font-medium">
                  {receipt.name || "-"}
                </td>

                <td className="px-6 py-4 text-gray-700 font-medium">
                  {receipt.projectname || "-"}
                </td>

                <td className="px-6 py-4 text-gray-700 font-medium">
                  {receipt.paymentmode || "-"}
                </td>

                <td className="px-6 py-4 text-gray-700 font-medium">
                  {receipt.paymenttype || "-"}
                </td>

                <td className="px-6 py-4 text-gray-700 font-medium">
                  ₹{Number(receipt.totalreceived ?? receipt.amountpaid ?? 0).toLocaleString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {tableData.length === 0 && (
          <div className="p-6 text-center text-gray-500">
            No receipts found.
          </div>
        )}
      </div>
    </div>
  );
}
