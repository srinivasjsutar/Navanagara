import axios from "axios";
import { useEffect, useState } from "react";
import { Header } from "./Header";

export function MemberList() {

  const headers = [
    "Date",
    "Member Name",
    "Seniority No",
    "Membership Type",
    "",
  ];
  const [Memberdetails, SetMemberDetails] = useState([]);
  const [selectedMember, setSelectedMember] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    axios
      .get("https://navagara-backend.onrender.com/members")
      .then((response) => {
        SetMemberDetails(response.data.data || []);
      })
      .catch((err) => console.error("Unable to fetch the data", err));
  }, []);

  const handleViewDetails = (member) => {
    setSelectedMember(member);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedMember(null);
  };

  return (
    <div>
      <Header />

      <div className="px-[50px] pt-[50px] font-semibold text-[24px]">
        All Member List
      </div>
      <div className="w-full max-w-[1120px] mx-auto p-6">
        <div className="overflow-hidden rounded-2xl shadow-lg">
          <table className="w-full">
            <thead>
              <tr className="bg-[#8356D6]">
                {headers.map((header, index) => (
                  <th
                    key={index}
                    className="px-6 py-4 text-start text-white font-semibold text-base tracking-wide"
                  >
                    {header}
                  </th>
                ))}
              </tr>
            </thead>

            <tbody className="bg-white">
              {Memberdetails.map((member, rowIndex) => (
                <tr
                  key={rowIndex}
                  className="border-b border-gray-200 text-start text-[14px] hover:bg-purple-50 transition-colors duration-200"
                >
                  <td className="px-6 py-4 text-gray-700 font-medium">
                    {/* {member.date || "-"} */}
                    {member.date
                      ? new Date(member.date).toLocaleDateString()
                      : "-"}
                  </td>
                  <td className="px-6 py-4 text-gray-700 font-medium">
                    {member.name || "-"}
                  </td>

                  <td className="px-6 py-4 text-gray-700 font-medium">
                    {member.seniority_no || "-"}
                  </td>

                  <td className="px-6 py-4 text-gray-700 font-medium">
                    {member.membershiptype || "-"}
                  </td>
                  <td>
                    <button
                      onClick={() => handleViewDetails(member)}
                      className="w-[170px] font-medium border-1 py-[6px] px-[10px] border-[#8356D6] rounded text-[14px] text-[#8356D6] hover:bg-[#8356D6] hover:text-white transition-colors duration-200"
                    >
                      View Details
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {Memberdetails.length === 0 && (
            <div className="p-6 text-center text-red-600">Not found.</div>
          )}
        </div>
      </div>

      {/* Modal */}
      {isModalOpen && selectedMember && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 "
          onClick={closeModal}
        >
          <div
            className="bg-white rounded-2xl shadow-2xl w-full max-w-[900px] max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Back Button */}
            <div className="p-6 pb-4">
              <button
                onClick={closeModal}
                className="flex items-center gap-2 text-[#8356D6] border border-[#8356D6] px-4 py-2 rounded-full hover:bg-purple-50 transition-colors"
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 19l-7-7 7-7"
                  />
                </svg>
                <span className="font-medium">Back to Member List</span>
              </button>
            </div>

            {/* Modal Content */}
            <div className="px-6 pb-6">
              <div className="bg-white border border-gray-200 rounded-2xl p-6">
                {/* Header with Title and Profile Picture */}
                <div className="flex justify-between items-start ">
                  <h2 className="text-2xl font-semibold">Member Details</h2>
                  <div className="w-16 h-16 bg-gray-200 rounded-full overflow-hidden flex items-center justify-center">
                    {/* Placeholder profile image */}
                    <svg
                      className="w-10 h-10 text-gray-400"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                </div>

                {/* Top Row - Name, Membership ID, Mobile */}
                <dl className="flex gap-[70px] mb-6 pb-6 border-b border-gray-200">
                  <div className="flex items-center gap-1">
                    <img src="/images/person_1.svg" alt="Person icon" className="pb-1"/>
                    <div className="flex text-center">
                      <dt className="text-[#8356D6] font-medium text-[16px]">
                        Name:
                      </dt>
                      &nbsp;
                      <dd className="font-semibold text-[16px] text-[#595757]">
                        {selectedMember.name || "-"}
                      </dd>
                    </div>
                  </div>

                  <div className="flex items-center gap-1">
                    <img src="/images/assignment_ind.png" alt="ID icon" className="pb-1"/>
                    <div className="flex text-center">
                      <dt className="text-[#8356D6] font-medium text-[16px]">
                        Seniority No:
                      </dt>
                      &nbsp;
                      <dd className="font-semibold text-[16px] text-[#595757]">
                        {selectedMember.seniority_no || "-"}
                      </dd>
                    </div>
                  </div>

                  <div className="flex items-center gap-1">
                    <img src="/images/call.svg" alt="Phone icon" className="pb-1" />
                    <div className="flex text-center">
                      <dt className="text-[#8356D6] font-medium text-[16px]">
                        Mobile:
                      </dt>
                      &nbsp;
                      <dd className="font-semibold text-[16px] text-[#595757]">
                        {selectedMember.mobile || "-"}
                      </dd>
                    </div>
                  </div>
                </dl>

                {/* Details Grid - 2 columns using dl/dt/dd */}
                <dl className="grid grid-cols-2 gap-x-12 gap-y-6">
                  <div className="border-b border-gray-200 pb-4">
                    <dt className="inline font-semibold">
                      Application Number:{" "}
                    </dt>
                    <dd className="inline font-normal">
                      {selectedMember.applicationno || "-"}
                    </dd>
                  </div>

                  <div className="border-b border-gray-200 pb-4">
                    <dt className="inline font-semibold">Membership Type: </dt>
                    <dd className="inline font-normal">
                      {selectedMember.membershiptype || "-"}
                    </dd>
                  </div>

                  <div className="border-b border-gray-200 pb-4">
                    <dt className="inline font-semibold">Membership Day: </dt>
                    <dd className="inline font-normal">
                      {selectedMember.membershipday ||"-"}
                    </dd>
                  </div>

                  <div className="border-b border-gray-200 pb-4">
                    <dt className="inline font-semibold">Membership Fees: </dt>
                    <dd className="inline font-normal">
                      {selectedMember.membershipfees || "-"}
                    </dd>
                  </div>

                  <div className="border-b border-gray-200 pb-4">
                    <dt className="inline font-semibold">Email: </dt>
                    <dd className="inline font-normal">
                      {selectedMember.email || "-"}
                    </dd>
                  </div>

                  <div className="border-b border-gray-200 pb-4">
                    <dt className="inline font-semibold">DOB: </dt>
                    <dd className="inline font-normal">
                      {selectedMember.dob ? new Date(selectedMember.dob).toLocaleDateString(): "-"}
                    </dd>
                  </div>

                  <div className="border-b border-gray-200 pb-4">
                    <dt className="inline font-semibold">Adhar Number: </dt>
                    <dd className="inline font-normal">
                      {selectedMember.aadharnumber || "-"}
                    </dd>
                  </div>

                  <div className="border-b border-gray-200 pb-4">
                    <dt className="inline font-semibold">Birth Place: </dt>
                    <dd className="inline font-normal">
                      {selectedMember.birthplace || "-"}
                    </dd>
                  </div>

                  <div className="border-b border-gray-200 pb-4">
                    <dt className="inline font-semibold">
                      Alternate Mobile Number:{" "}
                    </dt>
                    <dd className="inline font-normal">
                      {selectedMember.alternatemobile || "-"}
                    </dd>
                  </div>

                  <div className="border-b border-gray-200 pb-4">
                    <dt className="inline font-semibold">Alternate Email: </dt>
                    <dd className="inline font-normal">
                      {selectedMember.alternateemail || "-"}
                    </dd>
                  </div>

                  <div className="border-b border-gray-200 pb-4">
                    <dt className="inline font-semibold">
                      Permanent Address:{" "}
                    </dt>
                    <dd className="inline font-normal">
                      {selectedMember.permanentaddress || "-"}
                    </dd>
                  </div>

                  <div className="border-b border-gray-200 pb-4">
                    <dt className="inline font-semibold">
                      Correspondence Address:{" "}
                    </dt>
                    <dd className="inline font-normal">
                      {selectedMember.correspondenceaddress || "-"}
                    </dd>
                  </div>

                  <div className="border-b border-gray-200 pb-4">
                    <dt className="inline font-semibold">Nominee Name: </dt>
                    <dd className="inline font-normal">
                      {selectedMember.nomineename || "-"}
                    </dd>
                  </div>

                  <div className="border-b border-gray-200 pb-4">
                    <dt className="inline font-semibold">
                      Nominee Mobile Number:{" "}
                    </dt>
                    <dd className="inline font-normal">
                      {selectedMember.nomineenumber || "-"}
                    </dd>
                  </div>

                  <div className="border-b border-gray-200 pb-4">
                    <dt className="inline font-semibold">Nominee Age: </dt>
                    <dd className="inline font-normal">
                      {selectedMember.nomineeage || "-"}
                    </dd>
                  </div>

                  <div className="border-b border-gray-200 pb-4">
                    <dt className="inline font-semibold">
                      Nominee Relationship:{" "}
                    </dt>
                    <dd className="inline font-normal">
                      {selectedMember.nomineerelationship || "-"}
                    </dd>
                  </div>

                  <div className="border-b border-gray-200 pb-4 col-span-2">
                    <dt className="inline font-semibold">Nominee Address: </dt>
                    <dd className="inline font-normal">
                      {selectedMember.nomineeaddress || "-"}
                    </dd>
                  </div>
                </dl>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
