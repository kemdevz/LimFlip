'use client';

import { useState, useEffect } from 'react';

interface ProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  username?: string;
  avatarUrl?: string;
}

export default function ProfileModal({
  isOpen,
  onClose,
  username = 'justjakep',
  avatarUrl,
}: ProfileModalProps) {
  const [shouldRender, setShouldRender] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setShouldRender(true);
    } else {
      const timer = setTimeout(() => setShouldRender(false), 150);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  if (!shouldRender) return null;

  return (
    <div
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-[10000] transition-opacity duration-150"
      style={{ opacity: isOpen ? 1 : 0 }}
      onClick={onClose}
    >
      <div
        className="relative w-[1066px] h-[701px] shadow-[0px_4px_27.200000762939453px_0px_rgba(0,0,0,0.25)] overflow-hidden transition-transform duration-150"
        style={{ transform: isOpen ? 'scale(1)' : 'scale(0.95)' }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Main container */}
        <div className="w-[1062px] h-[701px] left-0 top-0 absolute rounded-2xl border border-zinc-800" style={{ background: '#191D29' }} />

        {/* Close button */}
        <div
          onClick={onClose}
          className="size-9 left-[956px] top-[100px] absolute bg-gray-700 rounded-xl cursor-pointer flex items-center justify-center"
        >
          <div className="size-6 left-[962px] top-[104px] absolute bg-gray-400" />
        </div>

        {/* Send Tip button */}
        <div className="w-32 h-9 left-[824px] top-[100px] absolute bg-blue-600 rounded-2xl cursor-pointer flex items-center justify-center">
          <div className="w-16 h-5 left-[853px] top-[107px] absolute justify-start text-white text-base font-semibold font-['Poppins']">Send Tip</div>
        </div>

        {/* Profile header section */}
        <div className="w-[674px] h-32 left-[55px] top-[23px] absolute">
          {/* Avatar */}
          <img
            className="size-24 left-0 top-[22px] absolute rounded-[69px]"
            src={avatarUrl || '/assets/images/auth/PFPJAKEP.png'}
          />
          {/* User info */}
          <div className="w-[569px] h-32 left-[105px] top-0 absolute">
            <div className="w-20 left-[1px] top-[31px] absolute justify-start text-white text-lg font-semibold font-['Poppins']">{username}</div>
            <div className="w-[515px] h-10 left-[1px] top-[72px] absolute">
              {/* Search badge */}
              <div className="w-48 h-10 left-[254.50px] top-0 absolute">
                <div className="w-48 h-10 left-[-0.12px] top-0 absolute bg-gray-800 rounded-2xl" />
                <div className="w-28 left-[43px] top-[8px] absolute justify-start text-white text-base font-semibold font-['Poppins']">{username}2</div>
                <div className="size-6 left-[43px] top-[5px] absolute" />
                <div className="size-4 left-[15.38px] top-[10.71px] absolute bg-white" />
                <div className="w-0 h-4 left-[180.83px] top-[12.84px] absolute origin-top-left rotate-90 bg-gray-400" />
              </div>
              {/* Joined date */}
              <div className="w-60 h-10 left-0 top-0 absolute">
                <div className="w-60 h-10 left-0 top-0 absolute bg-gray-800 rounded-2xl" />
                <div className="w-16 left-[17px] top-[8px] absolute justify-start text-gray-400 text-base font-semibold font-['Poppins']">Joined</div>
                <div className="w-28 left-[112.20px] top-[8.50px] absolute justify-start text-white text-base font-semibold font-['Poppins']">May 29, 2021</div>
                <div className="w-px h-3 left-[92px] top-[13px] absolute bg-gray-400 rounded-lg" />
              </div>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="w-[933px] h-px left-[59px] top-[159px] absolute bg-gray-800" />

        {/* Profit Chart section */}
        <div className="w-[1002px] h-[468px] left-[30px] top-[199px] absolute">
          <div className="w-96 left-[29px] top-0 absolute justify-start text-white text-lg font-semibold font-['Poppins']">Profit Chart</div>
          
          {/* Y-axis labels */}
          <div className="size- left-[72px] top-[141px] absolute inline-flex flex-col justify-start items-start">
            <div className="w-24 h-11 justify-start text-slate-500 text-xs font-semibold font-['Poppins']">1,000,000</div>
            <div className="w-20 h-11 justify-start text-slate-500 text-xs font-semibold font-['Poppins']">250,000</div>
            <div className="w-20 h-11 justify-start text-slate-500 text-xs font-semibold font-['Poppins']">100,000</div>
            <div className="w-20 h-11 justify-start text-slate-500 text-xs font-semibold font-['Poppins']">50,000</div>
            <div className="w-20 h-11 justify-start text-slate-500 text-xs font-semibold font-['Poppins']">25,000</div>
            <div className="w-20 h-11 justify-start text-slate-500 text-xs font-semibold font-['Poppins']">0.00</div>
          </div>

          {/* Chart line */}
          <div className="w-[837px] h-48 left-[131px] top-[153px] absolute rounded-[5px] outline outline-[3px] outline-offset-[-1.50px] outline-blue-600" />
          
          {/* Game info card */}
          <div className="w-32 h-20 left-[649px] top-[115px] absolute">
            <div className="w-28 h-20 left-0 top-[-1px] absolute bg-gray-800 rounded-2xl" />
            <div className="w-24 left-[8px] top-[7px] absolute justify-start text-zinc-500 text-[10px] font-semibold font-['Poppins']">March, 10th</div>
            <div className="w-20 left-[8px] top-[28px] absolute justify-start"><span className="text-zinc-500 text-xs font-semibold font-['Poppins']">ID: </span><span className="text-white text-xs font-semibold font-['Poppins']">572245</span></div>
            <div className="w-20 left-[8px] top-[41.51px] absolute justify-start"><span className="text-zinc-500 text-xs font-semibold font-['Poppins']">Game: </span><span className="text-white text-xs font-semibold font-['Poppins']">Jackpot</span></div>
            <div className="w-20 left-[8px] top-[55.03px] absolute justify-start"><span className="text-zinc-500 text-xs font-semibold font-['Poppins']">Profit: </span><span className="text-blue-600 text-xs font-semibold font-['Poppins']">A$43.2K</span></div>
          </div>

          {/* Chart indicator */}
          <div className="size-3 left-[618px] top-[160px] absolute bg-blue-600 rounded-[48px] border border-white" />

          {/* Y-axis label */}
          <div className="w-32 h-4 left-[25.34px] top-[320.41px] absolute origin-top-left -rotate-90 text-center justify-start text-gray-400 text-xs font-bold font-['Poppins'] tracking-widest">CUMALATIVE NET-PROFIT</div>

          {/* X-axis labels */}
          <div className="w-[887px] h-12 left-[96px] top-[388px] absolute">
            <div className="size- left-[26px] top-[13px] absolute inline-flex justify-start items-start gap-14">
              <div className="w-5 h-4 justify-start text-slate-500 text-[10px] font-semibold font-['Poppins']">Jan</div>
              <div className="w-5 h-4 justify-start text-slate-500 text-[10px] font-semibold font-['Poppins']">Feb</div>
              <div className="w-5 h-4 justify-start text-slate-500 text-[10px] font-semibold font-['Poppins']">Mar</div>
              <div className="w-5 h-4 justify-start text-slate-500 text-[10px] font-semibold font-['Poppins']">Apr</div>
              <div className="w-6 h-4 justify-start text-slate-500 text-[10px] font-semibold font-['Poppins']">May</div>
              <div className="w-5 h-4 justify-start text-slate-500 text-[10px] font-semibold font-['Poppins']">Jun</div>
              <div className="size-4 justify-start text-slate-500 text-[10px] font-semibold font-['Poppins']">Jul</div>
              <div className="w-6 h-4 justify-start text-slate-500 text-[10px] font-semibold font-['Poppins']">Aug</div>
              <div className="w-5 h-4 justify-start text-slate-500 text-[10px] font-semibold font-['Poppins']">Sep</div>
              <div className="w-5 h-4 justify-start text-slate-500 text-[10px] font-semibold font-['Poppins']">Oct</div>
              <div className="w-5 h-4 justify-start text-slate-500 text-[10px] font-semibold font-['Poppins']">Nov</div>
              <div className="w-5 h-4 justify-start text-slate-500 text-[10px] font-semibold font-['Poppins']">Dec</div>
            </div>
            <div className="w-[887px] h-px left-0 top-[2px] absolute bg-slate-500 rounded-2xl" />
            <div className="size- left-[32px] top-[-3px] absolute inline-flex justify-start items-start gap-16">
              <div className="size-2.5 bg-slate-500 rounded-full" />
              <div className="size-2.5 bg-slate-500 rounded-full" />
              <div className="size-2.5 bg-slate-500 rounded-full" />
              <div className="size-2.5 bg-slate-500 rounded-full" />
              <div className="size-2.5 bg-slate-500 rounded-full" />
              <div className="size-2.5 bg-slate-500 rounded-full" />
              <div className="size-2.5 bg-slate-500 rounded-full" />
              <div className="size-2.5 bg-slate-500 rounded-full" />
              <div className="size-2.5 bg-slate-500 rounded-full" />
              <div className="size-2.5 bg-slate-500 rounded-full" />
              <div className="size-2.5 bg-slate-500 rounded-full" />
              <div className="size-2.5 bg-slate-500 rounded-full" />
            </div>
            <div className="w-32 h-4 left-[354px] top-[43px] absolute justify-start text-gray-400 text-xs font-bold font-['Poppins'] tracking-widest">GAMES PLAYED</div>
          </div>

          {/* Net Profit section */}
          <div className="w-[933px] h-16 left-[29px] top-[31px] absolute bg-gray-800 rounded-2xl" />
          <div className="w-5 h-4 left-[44px] top-[66px] absolute bg-blue-600" />
          <div className="w-20 h-10 left-[867px] top-[43px] absolute bg-slate-800 rounded-2xl" />
          <div className="w-3 h-1.5 left-[941px] top-[67px] absolute origin-top-left -rotate-180 bg-gray-500 outline outline-[0.30px] outline-gray-500" />
          <div className="w-2 h-1.5 left-[156.22px] top-[72px] absolute origin-top-left -rotate-180 bg-blue-600" />
          <div className="w-96 left-[44px] top-[39px] absolute justify-start text-gray-400 text-base font-semibold font-['Poppins']">Net Profit</div>
          <div className="w-96 left-[72px] top-[59.02px] absolute justify-start text-white text-xl font-semibold font-['Poppins']">-45.2k</div>
          <div className="w-10 left-[880px] top-[52px] absolute justify-start text-stone-300 text-base font-semibold font-['Poppins']">1 Day</div>
        </div>

        {/* Extra element */}
        <div className="size-4 left-[1024px] top-[23px] absolute bg-slate-600" />
      </div>
    </div>
  );
}
