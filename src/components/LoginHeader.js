import { Link } from "react-router-dom"

export function LoginHeader() {
    return(
        <div className="flex justify-content-between px-[80px] align-items-center h-[90px] lg:h-[90px] bg-[#7158B6]">
            <div><img src="/images/logo.svg"/></div>
            <div className="flex gap-3">
                <Link to="#" className="text-[#6952A9] py-[12px] px-4 rounded-full bg-[#FFFF]  font-semibold text-[16px] no-underline">Admin Login</Link>
            </div>
        </div>
    )
}   