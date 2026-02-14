import { Link, useLocation } from "react-router-dom";

export function SideBar() {
  const location = useLocation();

  // Helper function to check if a route or its children are active
  const isActive = (path, childPaths = []) => {
    if (location.pathname === path) return true;
    return childPaths.some(childPath => location.pathname === childPath);
  };

  return (
    <div className="sidebar w-[350px] shadow-xl flex flex-col bg-[#7C66CA] min-h-screen">
      <div className="p-6">
        <div className="flex justify-center">
          <img src="/images/logo.svg" className="w-[120px] h-[120px]" />
        </div>
        <ul className="mt-[35px] w-[326px]">
          <li className="mt-3">
            <Link
              to="/dashboard"
              className={`flex py-1 rounded-s-xl px-4 gap-4 no-underline text-[20px] transition-all ${
                isActive("/dashboard")
                  ? "bg-[#FFFF00]"
                  : "hover:border hover:border-white"
              }`}
            >
              <img
                src={
                  isActive("/dashboard")
                    ? "/images/purple_dashboard.svg"
                    : "/images/dashboard.svg"
                }
                alt="Dashboard"
              />
              <span
                className={`${
                  isActive("/dashboard")
                    ? "text-[#7C66CA] font-semibold"
                    : "text-white"
                }`}
              >
                Dashboard
              </span>
            </Link>
          </li>
          {/* <li className="mt-3">
            <Link
              to="/addadmin"
              className={`flex py-1 rounded-s-xl px-4 gap-4 no-underline text-[20px] transition-all ${
                isActive("/addadmin")
                  ? "bg-[#FFFF00]"
                  : "hover:border hover:border-white"
              }`}
            >
              <img
                src={
                  isActive("/addadmin")
                    ? "/images/identity_platform.svg"
                    : "/images/admin_icon.svg"
                }
                alt="Add Admin"
              />
              <span
                className={`${
                  isActive("/addadmin")
                    ? "text-[#7C66CA] font-semibold"
                    : "text-white"
                }`}
              >
                Add Admin
              </span>
            </Link>
          </li> */}
          <li className="mt-3">
            <Link
              to="/addmember"
              className={`flex py-1 rounded-s-xl px-4 gap-4 no-underline text-[20px] transition-all ${
                isActive("/addmember")
                  ? "bg-[#FFFF00]"
                  : "hover:border hover:border-white"
              }`}
            >
              <img
                src={
                  isActive("/addmember")
                    ? "/images/person_add.svg"
                    : "/images/add_member_icon.svg"
                }
                alt="Add Member"
              />
              <span
                className={`${
                  isActive("/addmember")
                    ? "text-[#7C66CA] font-semibold"
                    : "text-white"
                }`}
              >
                Add Member
              </span>
            </Link>
          </li>
          <li className="mt-3">
            <Link
              to="/sitebookingform"
              className={`flex py-1 rounded-s-xl px-4 gap-4 no-underline text-[20px] transition-all ${
                isActive("/sitebookingform")
                  ? "bg-[#FFFF00]"
                  : "hover:border hover:border-white"
              }`}
            >
              <img
                src={
                  isActive("/sitebookingform")
                    ? "/images/calendar_add_on.svg"
                    : "/images/calender.svg"
                }
                alt="Add Site Booking"
              />
              <span
                className={`${
                  isActive("/sitebookingform")
                    ? "text-[#7C66CA] font-semibold"
                    : "text-white"
                }`}
              >
                Add Site Booking
              </span>
            </Link>
          </li>
          <li className="mt-3">
            <Link
              to="/receiptform"
              className={`flex py-1 rounded-s-xl px-4 gap-4 no-underline text-[20px] transition-all ${
                isActive("/receiptform")
                  ? "bg-[#FFFF00]"
                  : "hover:border hover:border-white"
              }`}
            >
              <img
                src={
                  isActive("/receiptform")
                    ? "/images/purple_add_circle.svg"
                    : "/images/add_circle.svg"
                }
                alt="Add Receipt"
              />
              <span
                className={`${
                  isActive("/receiptform")
                    ? "text-[#7C66CA] font-semibold"
                    : "text-white"
                }`}
              >
                Add Receipt
              </span>
            </Link>
          </li>
          <li className="mt-3">
            <Link
              to="/report"
              className={`flex py-1 rounded-s-xl px-4 gap-4 no-underline text-[20px] transition-all ${
                isActive("/report", ["/memberlist", "/sitebookinglist", "/receiptlist"])
                  ? "bg-[#FFFF00]"
                  : "hover:border hover:border-white"
              }`}
            >
              <img
                src={
                  isActive("/report", ["/memberlist", "/sitebookinglist", "/receiptlist"])
                    ? "/images/purple_bar_chart.svg"
                    : "/images/bar_chart.svg"
                }
                alt="Reports"
              />
              <span
                className={`${
                  isActive("/report", ["/memberlist", "/sitebookinglist", "/receiptlist"])
                    ? "text-[#7C66CA] font-semibold"
                    : "text-white"
                }`}
              >
                Reports
              </span>
            </Link>
          </li>
          <li className="mt-3">
            <Link
              to="/payments"
              className={`flex py-1 rounded-s-xl px-4 gap-4 no-underline text-[20px] transition-all ${
                isActive("/payments")
                  ? "bg-[#FFFF00]"
                  : "hover:border hover:border-white"
              }`}
            >
              <img
                src={
                  isActive("/payments")
                    ? "/images/account_balance_wallet.svg"
                    : "/images/payment_icon.svg"
                }
                alt="Payments"
              />
              <span
                className={`${
                  isActive("/payments")
                    ? "text-[#7C66CA] font-semibold"
                    : "text-white"
                }`}
              >
                Payments
              </span>
            </Link>
          </li>
        </ul>
      </div>
      <div className="bg-white w-full p-4 mt-auto flex justify-center items-center">
        <img src="/images/exit.svg" />
        <Link path="*" className="text-[24px] text-dark no-underline ps-[30px]">
          Sign Out
        </Link>
      </div>
    </div>
  );
}
