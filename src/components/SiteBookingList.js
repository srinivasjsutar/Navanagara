import axios from "axios";
import { useEffect, useState } from "react";
import { Header } from "./Header";
import { toast } from "react-toastify";

export function SiteBookingList() {
  const headers = ["Date", "Member Name", "Seniority No.", "Project Name", ""];
  const [Memberdetails, SetMemberDetails] = useState([]);
  const [filteredMembers, setFilteredMembers] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedMember, setSelectedMember] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showMemberDetails, setShowMemberDetails] = useState(false);
  const [memberDetailsData, setMemberDetailsData] = useState(null);

  useEffect(() => {
    axios
      .get("https://navagara-backend.onrender.com/sitebookings")
      .then((response) => {
        SetMemberDetails(response.data || []);
        setFilteredMembers(response.data || []);
      })
      .catch((err) => console.error("Unable to fetch the data", err));
  }, []);

  // Filter members based on search query
  useEffect(() => {
    if (searchQuery.trim() === "") {
      setFilteredMembers(Memberdetails);
    } else {
      const filtered = Memberdetails.filter((member) =>
        member.seniority_no?.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredMembers(filtered);
    }
  }, [searchQuery, Memberdetails]);

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const clearSearch = () => {
    setSearchQuery("");
  };

  const handleViewDetails = (member) => {
    setSelectedMember(member);
    setIsModalOpen(true);
    setShowMemberDetails(false);
    setMemberDetailsData(null);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedMember(null);
    setShowMemberDetails(false);
    setMemberDetailsData(null);
  };

  const handleViewMemberDetails = async () => {
    try {
      const response = await axios.get("https://navagara-backend.onrender.com/members");
      const members = response.data.data || [];

      // Find member by membership ID
      const memberData = members.find(
        (member) => member.seniority_no === selectedMember.seniority_no,
      );

      if (memberData) {
        setMemberDetailsData(memberData);
        setShowMemberDetails(true);
      } else {
        toast.success("Member details not found!");
      }
    } catch (err) {
      console.error("Unable to fetch member details", err);
      toast.error("Error fetching member details!");
    }
  };

  const handleBackToSiteBooking = () => {
    setShowMemberDetails(false);
    setMemberDetailsData(null);
  };

  // Calculate pending amount
  const calculatePendingAmount = (member) => {
    const bookingAmount = parseFloat(member.bookingamount) || 0;
    const downPayment = parseFloat(member.downpayment) || 0;
    const totalAmount = parseFloat(member.totalamount) || 0;
    const pending = bookingAmount + downPayment - totalAmount;
    return pending.toFixed(2);
  };

  return (
    <div>
      <Header />

      <div className="px-[50px] pt-[50px]">
        <div className="flex justify-between items-center mb-6">
          <h1 className="font-semibold text-[24px]">All Sitebookings List</h1>
          
          {/* Search Bar */}
          <div className="relative w-[300px]">
            <div className="relative">
              <input
                type="text"
                placeholder="Search by Seniority Number..."
                value={searchQuery}
                onChange={handleSearchChange}
                className="w-full px-4 py-2 pl-10 pr-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#8356D6] focus:border-transparent"
              />
              {/* Search Icon */}
              <svg
                className="absolute left-64 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
              {/* Clear Button */}
              {searchQuery && (
                <button
                  onClick={clearSearch}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
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
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              )}
            </div>
            {/* Search Results Count */}
            {searchQuery && (
              <div className="absolute top-full mt-2 text-sm text-gray-600">
                Found {filteredMembers.length} result{filteredMembers.length !== 1 ? 's' : ''}
              </div>
            )}
          </div>
        </div>
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
              {filteredMembers.map((member, rowIndex) => (
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
                    {member.projectname || "-"}
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

          {filteredMembers.length === 0 && (
            <div className="p-6 text-center text-red-600">
              {searchQuery ? `No bookings found for "${searchQuery}"` : "Not found."}
            </div>
          )}
        </div>
      </div>

      {/* Modal */}
      {isModalOpen && selectedMember && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
          onClick={closeModal}
        >
          <div
            className="bg-white rounded-2xl shadow-2xl w-full max-w-[900px] max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Back Button */}
            <div className="p-6 pb-4">
              <button
                onClick={
                  showMemberDetails ? handleBackToSiteBooking : closeModal
                }
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
                <span className="font-medium">
                  {showMemberDetails
                    ? "Back to Site Booking"
                    : "Back to Site Booking"}
                </span>
              </button>
            </div>

            {/* Modal Content - Site Booking Details */}
            {!showMemberDetails && (
              <div className="px-6 pb-6">
                <div className="bg-white border border-gray-200 rounded-2xl p-6">
                  {/* Header with Title and Profile Picture */}
                  <div className="flex justify-between items-start mb-6">
                    <h2 className="text-2xl font-semibold">
                      Site Booking Details
                    </h2>
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
                    <div className="flex items-center gap-2">
                      <img
                        src="/images/person_1.svg"
                        alt="Person icon"
                        className="pb-1"
                      />
                      <div className="flex ">
                        <dt className="text-[#8356D6] font-medium text-[16px]">
                          Name:
                        </dt>
                        &nbsp;
                        <dd className="font-semibold text-[16px] text-[#595757]">
                          {selectedMember.name || "-"}
                        </dd>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <img
                        src="/images/assignment_ind.png"
                        alt="ID icon"
                        className="pb-1"
                      />
                      <div className="flex">
                        <dt className="text-[#8356D6] font-medium text-[16px]">
                          Seniority No:
                        </dt>
                        &nbsp;
                        <dd className="font-semibold text-[16px] text-[#595757]">
                          {selectedMember.seniority_no || "-"}
                        </dd>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <img
                        src="/images/call.svg"
                        alt="Phone icon"
                        className="pb-1"
                      />
                      <div className="flex">
                        <dt className="text-[#8356D6] font-medium text-[16px]">
                          Mobile:
                        </dt>
                        &nbsp;
                        <dd className="font-semibold text-[16px] text-[#595757]">
                          {selectedMember.mobilenumber || "-"}
                        </dd>
                      </div>
                    </div>
                  </dl>

                  {/* Details Grid - 2 columns using dl/dt/dd */}
                  <dl className="grid grid-cols-2 gap-x-12 gap-y-6">
                    <div className="border-b border-gray-200 pb-4">
                      <dt className="inline font-semibold">Project Name: </dt>
                      <dd className="inline font-normal">
                        {selectedMember.projectname || "-"}
                      </dd>
                    </div>

                    <div className="border-b border-gray-200 pb-4">
                      <dt className="inline font-semibold">Site Dimension: </dt>
                      <dd className="inline font-normal">
                        {selectedMember.sitedimension || "-"}
                      </dd>
                    </div>

                    <div className="border-b border-gray-200 pb-4">
                      <dt className="inline font-semibold">Transaction Id: </dt>
                      <dd className="inline font-normal">
                        {selectedMember.transactionid || "-"}
                      </dd>
                    </div>

                    <div className="border-b border-gray-200 pb-4">
                      <dt className="inline font-semibold">Booking Amount: </dt>
                      <dd className="inline font-normal">
                        ₹{selectedMember.bookingamount || "-"}
                      </dd>
                    </div>

                    <div className="border-b border-gray-200 pb-4">
                      <dt className="inline font-semibold">Down Payment: </dt>
                      <dd className="inline font-normal">
                        ₹{selectedMember.downpayment || "-"}
                      </dd>
                    </div>

                    <div className="border-b border-gray-200 pb-4">
                      <dt className="inline font-semibold">Payment Mode: </dt>
                      <dd className="inline font-normal">
                        {selectedMember.paymentmode || "-"}
                      </dd>
                    </div>

                    <div className="border-b border-gray-200 pb-4">
                      <dt className="inline font-semibold">Total Amount: </dt>
                      <dd className="inline font-normal">
                        ₹{selectedMember.totalamount || "-"}
                      </dd>
                    </div>

                    <div className="border-b border-gray-200 pb-4">
                      <dt className="inline font-semibold">Pending Amount: </dt>
                      <dd className="inline font-normal">
                        ₹{calculatePendingAmount(selectedMember)}
                      </dd>
                    </div>
                  </dl>

                  <div className="text-center mt-6">
                    <button
                      onClick={handleViewMemberDetails}
                      className="bg-gradient-to-r from-[#FFFF00] via-[#7158B6] to-[#7158B6] px-6 py-2 rounded-full text-white font-semibold text-[16px] hover:opacity-90 transition-opacity"
                    >
                      View Member Details
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Modal Content - Member Details */}
            {showMemberDetails && memberDetailsData && (
              <div className="px-6 pb-6">
                <div className="bg-white border border-gray-200 rounded-2xl p-6">
                  {/* Header with Title and Profile Picture */}
                  <div className="flex justify-between items-start mb-6">
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
                    <div className="flex items-center gap-2">
                      <img
                        src="/images/person_1.svg"
                        alt="Person icon"
                        className="pb-1"
                      />
                      <div className="flex">
                        <dt className="text-[#8356D6] font-medium text-[16px]">
                          Name:
                        </dt>
                        &nbsp;
                        <dd className="font-semibold text-[16px] text-[#595757]">
                          {memberDetailsData.name || "-"}
                        </dd>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <img
                        src="/images/assignment_ind.png"
                        alt="ID icon"
                        className="pb-1"
                      />
                      <div className="flex">
                        <dt className="text-[#8356D6] font-medium text-[16px]">
                          Seniority No:
                        </dt>
                        <dd className="font-semibold text-[16px] text-[#595757]">
                          {memberDetailsData.seniority_no || "-"}
                        </dd>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <img
                        src="/images/call.svg"
                        alt="Phone icon"
                        className="pb-1"
                      />
                      <div className="flex">
                        <dt className="text-[#8356D6] font-medium text-[16px]">
                          Mobile:
                        </dt>
                        &nbsp;
                        <dd className="font-semibold text-[16px] text-[#595757]">
                          {memberDetailsData.mobile || "-"}
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
                        {memberDetailsData.applicationno || "-"}
                      </dd>
                    </div>

                    <div className="border-b border-gray-200 pb-4">
                      <dt className="inline font-semibold">
                        Membership Type:{" "}
                      </dt>
                      <dd className="inline font-normal">
                        {memberDetailsData.membershiptype || "-"}
                      </dd>
                    </div>

                    <div className="border-b border-gray-200 pb-4">
                      <dt className="inline font-semibold">Membership Date: </dt>
                      <dd className="inline font-normal">
                        {memberDetailsData.membershipday || "-"}
                      </dd>
                    </div>

                    <div className="border-b border-gray-200 pb-4">
                      <dt className="inline font-semibold">
                        Membership Fees:{" "}
                      </dt>
                      <dd className="inline font-normal">
                        {memberDetailsData.membershipfees || "-"}
                      </dd>
                    </div>

                    <div className="border-b border-gray-200 pb-4">
                      <dt className="inline font-semibold">Email: </dt>
                      <dd className="inline font-normal">
                        {memberDetailsData.email || "-"}
                      </dd>
                    </div>

                    <div className="border-b border-gray-200 pb-4">
                      <dt className="inline font-semibold">DOB: </dt>
                      <dd className="inline font-normal">
                        {/* {memberDetailsData.dob || "-"} */}
                        {memberDetailsData.dob
                        ? new Date(memberDetailsData.dob).toLocaleDateString():"-"}
                      </dd>
                    </div>

                    <div className="border-b border-gray-200 pb-4">
                      <dt className="inline font-semibold">Adhar Number: </dt>
                      <dd className="inline font-normal">
                        {memberDetailsData.aadharnumber || "-"}
                      </dd>
                    </div>

                    <div className="border-b border-gray-200 pb-4">
                      <dt className="inline font-semibold">Birth Place: </dt>
                      <dd className="inline font-normal">
                        {memberDetailsData.birthplace || "-"}
                      </dd>
                    </div>

                    <div className="border-b border-gray-200 pb-4">
                      <dt className="inline font-semibold">
                        Alternate Mobile Number:{" "}
                      </dt>
                      <dd className="inline font-normal">
                        {memberDetailsData.alternatemobile || "-"}
                      </dd>
                    </div>

                    <div className="border-b border-gray-200 pb-4">
                      <dt className="inline font-semibold">
                        Alternate Email:{" "}
                      </dt>
                      <dd className="inline font-normal">
                        {memberDetailsData.alternateemail || "-"}
                      </dd>
                    </div>

                    <div className="border-b border-gray-200 pb-4">
                      <dt className="inline font-semibold">
                        Permanent Address:{" "}
                      </dt>
                      <dd className="inline font-normal">
                        {memberDetailsData.permanentaddress || "-"}
                      </dd>
                    </div>

                    <div className="border-b border-gray-200 pb-4">
                      <dt className="inline font-semibold">
                        Correspondence Address:{" "}
                      </dt>
                      <dd className="inline font-normal">
                        {memberDetailsData.correspondenceaddress || "-"}
                      </dd>
                    </div>

                    <div className="border-b border-gray-200 pb-4">
                      <dt className="inline font-semibold">Nominee Name: </dt>
                      <dd className="inline font-normal">
                        {memberDetailsData.nomineename || "-"}
                      </dd>
                    </div>

                    <div className="border-b border-gray-200 pb-4">
                      <dt className="inline font-semibold">
                        Nominee Mobile Number:{" "}
                      </dt>
                      <dd className="inline font-normal">
                        {memberDetailsData.nomineenumber || "-"}
                      </dd>
                    </div>

                    <div className="border-b border-gray-200 pb-4">
                      <dt className="inline font-semibold">Nominee Age: </dt>
                      <dd className="inline font-normal">
                        {memberDetailsData.nomineeage || "-"}
                      </dd>
                    </div>

                    <div className="border-b border-gray-200 pb-4">
                      <dt className="inline font-semibold">
                        Nominee Relationship:{" "}
                      </dt>
                      <dd className="inline font-normal">
                        {memberDetailsData.nomineerelationship || "-"}
                      </dd>
                    </div>

                    <div className="border-b border-gray-200 pb-4 col-span-2">
                      <dt className="inline font-semibold">
                        Nominee Address:{" "}
                      </dt>
                      <dd className="inline font-normal">
                        {memberDetailsData.nomineeaddress || "-"}
                      </dd>
                    </div>
                  </dl>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}