export function Header(){
    return(
        <div className="flex justify-between px-10 py-[24px] shadow-sm">
            <div className="font-semibold text-[30px] text-[#7C66CA]">Welcome, Navanagara</div>
            <div className="flex gap-3">
                <img src="/images/bell-icon.svg"/>
                <div className="w-12 h-12 bg-gray-200 rounded-full overflow-hidden flex items-center justify-center">
                    <img src="/images/profile.webp"/>
                  </div>
            </div>
        </div>
    )
}