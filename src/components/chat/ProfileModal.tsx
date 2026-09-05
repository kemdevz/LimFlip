'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';

interface ProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  username?: string;
  avatarUrl?: string;
  userId?: string;
}

export default function ProfileModal({
  isOpen,
  onClose,
  username = 'justjakep',
  avatarUrl,
  userId,
}: ProfileModalProps) {
  const { user } = useAuth();
  const [shouldRender, setShouldRender] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [chartPosition, setChartPosition] = useState({ x: 618, y: 160, data: null as any });
  const [showGameInfo, setShowGameInfo] = useState(false);
  const [userData, setUserData] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  // Fetch user stats when modal opens
  useEffect(() => {
    const targetUserId = userId || user?.id;
    if (isOpen && targetUserId) {
      fetchUserStats(targetUserId);
    }
  }, [isOpen, userId, user?.id]);

  const fetchUserStats = async (targetUserId: string) => {
    try {
      setLoading(true);
      const response = await fetch(`http://localhost:3001/user/${targetUserId}/stats`);
      if (response.ok) {
        const data = await response.json();
        setUserData(data);
      }
    } catch (error) {
      console.error('Error fetching user stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatAmount = (amount: number) => {
    if (amount >= 1000000) {
      return `B$${(amount / 1000000).toFixed(1)}M`;
    } else if (amount >= 1000) {
      return `B$${(amount / 1000).toFixed(1)}K`;
    } else {
      return `B$${amount.toFixed(2)}`;
    }
  };

  const formatJoinDate = (dateStr: string) => {
    if (!dateStr) return dateStr;
    const months: Record<string, string> = {
      'January': 'Jan', 'February': 'Feb', 'March': 'Mar', 'April': 'Apr',
      'May': 'May', 'June': 'June', 'July': 'July', 'August': 'Aug',
      'September': 'Sept', 'October': 'Oct', 'November': 'Nov', 'December': 'Dec'
    };
    let result = dateStr;
    for (const [full, abbr] of Object.entries(months)) {
      if (result.startsWith(full)) {
        result = result.replace(full, abbr);
        break;
      }
    }
    return result;
  };

  // Generate SVG path from profit history data
  const generateChartPath = () => {
    const profitData = userData?.profitHistory || [];
    
    if (profitData.length === 0) {
      // Return default path if no data
      return "M1.5 198.871H153.951L229.24 191.541C229.665 191.5 230.094 191.513 230.516 191.581L266.066 197.287L288.629 198.806C289.263 198.849 289.9 198.77 290.505 198.574L308.4 192.778C308.897 192.617 309.417 192.535 309.94 192.535H334.795C337.238 192.535 339.324 190.769 339.727 188.359L346.549 147.538C347.315 142.957 353.754 142.579 355.05 147.04C356.211 151.034 361.769 151.298 363.303 147.432L419.98 4.65569C420.855 2.45159 423.158 1.16526 425.494 1.57606L518.162 17.8751C519.668 18.14 520.97 19.08 521.696 20.4262L547.296 67.8975C548.324 69.8039 550.463 70.8316 552.594 70.4431L596.435 62.4505C597.61 62.2363 598.822 62.4497 599.853 63.052L653.878 94.6092C654.741 95.1132 655.433 95.8642 655.865 96.7653L691.284 170.656C692.363 172.907 694.937 174.017 697.315 173.257L760.636 153.025C761.877 152.628 763.223 152.732 764.389 153.313L807.061 174.583L838.5 192.535";
    }
    
    const chartWidth = 837;
    const chartHeight = 198;
    const stepX = chartWidth / (profitData.length - 1);
    
    // Find min and max profit for scaling
    const profits = profitData.map((d: any) => d.profit);
    const minProfit = Math.min(...profits);
    const maxProfit = Math.max(...profits);
    const profitRange = maxProfit - minProfit || 1;
    
    // Add padding to range for better visualization
    const padding = profitRange * 0.1;
    const adjustedMin = minProfit - padding;
    const adjustedMax = maxProfit + padding;
    const adjustedRange = adjustedMax - adjustedMin;
    
    // Generate path points with accurate positioning
    const points = profitData.map((data: any, index: number) => {
      // Normalize profit to 0-1 range based on adjusted min/max
      const normalizedProfit = (data.profit - adjustedMin) / adjustedRange;
      const x = index * stepX;
      // Invert Y since SVG coordinates go from top to bottom
      const y = chartHeight - (normalizedProfit * chartHeight);
      return { x, y };
    });
    
    // Create simple linear SVG path string
    let pathD = `M ${points[0].x} ${points[0].y}`;
    
    for (let i = 1; i < points.length; i++) {
      pathD += ` L ${points[i].x} ${points[i].y}`;
    }
    
    return pathD;
  };

  useEffect(() => {
    if (isOpen) {
      setShouldRender(true);
      setTimeout(() => setIsVisible(true), 10);
    } else {
      setIsVisible(false);
      const timer = setTimeout(() => setShouldRender(false), 150);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  const handleChartMouseMove = (e: React.MouseEvent) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    
    // Use actual profit history data if available, otherwise use default points
    const profitData = userData?.profitHistory || [];
    
    if (profitData.length === 0) {
      // Fallback to default points if no data
      const defaultPathPoints = [
        { x: 1.5, y: 198.871 },
        { x: 153.951, y: 198.871 },
        { x: 229.24, y: 191.541 },
        { x: 230.516, y: 191.581 },
        { x: 266.066, y: 197.287 },
        { x: 288.629, y: 198.806 },
        { x: 290.505, y: 198.574 },
        { x: 308.4, y: 192.778 },
        { x: 309.94, y: 192.535 },
        { x: 334.795, y: 192.535 },
        { x: 339.727, y: 188.359 },
        { x: 346.549, y: 147.538 },
        { x: 355.05, y: 147.04 },
        { x: 363.303, y: 147.432 },
        { x: 419.98, y: 4.65569 },
        { x: 425.494, y: 1.57606 },
        { x: 518.162, y: 17.8751 },
        { x: 521.696, y: 20.4262 },
        { x: 547.296, y: 67.8975 },
        { x: 552.594, y: 70.4431 },
        { x: 596.435, y: 62.4505 },
        { x: 599.853, y: 63.052 },
        { x: 653.878, y: 94.6092 },
        { x: 655.865, y: 96.7653 },
        { x: 691.284, y: 170.656 },
        { x: 697.315, y: 173.257 },
        { x: 760.636, y: 153.025 },
        { x: 764.389, y: 153.313 },
        { x: 807.061, y: 174.583 },
        { x: 838.5, y: 192.535 }
      ];
      
      let closestPoint = defaultPathPoints[0];
      let minDistance = Math.abs(mouseX - (defaultPathPoints[0].x + 131));
      
      for (const point of defaultPathPoints) {
        const distance = Math.abs(mouseX - (point.x + 131));
        if (distance < minDistance) {
          minDistance = distance;
          closestPoint = point;
        }
      }
      
      const constrainedX = Math.max(131, Math.min(968, closestPoint.x + 131));
      const constrainedY = Math.max(153, Math.min(351, closestPoint.y + 153));
      setChartPosition({ x: constrainedX - 6, y: constrainedY - 6, data: null });
      setShowGameInfo(true);
      return;
    }
    
    // Calculate chart points from actual profit data
    const chartWidth = 837;
    const chartHeight = 198;
    const stepX = chartWidth / (profitData.length - 1);
    
    // Use same scaling logic as generateChartPath for consistency
    const profits = profitData.map((d: any) => d.profit);
    const minProfit = Math.min(...profits);
    const maxProfit = Math.max(...profits);
    const profitRange = maxProfit - minProfit || 1;
    const padding = profitRange * 0.1;
    const adjustedMin = minProfit - padding;
    const adjustedMax = maxProfit + padding;
    const adjustedRange = adjustedMax - adjustedMin;
    
    const pathPoints = profitData.map((data: any, index: number) => {
      const normalizedProfit = (data.profit - adjustedMin) / adjustedRange;
      const x = index * stepX;
      const y = chartHeight - (normalizedProfit * chartHeight);
      return { x, y, data };
    });
    
    let closestPoint = pathPoints[0];
    let minDistance = Math.abs(mouseX - (pathPoints[0].x + 131));
    
    for (const point of pathPoints) {
      const distance = Math.abs(mouseX - (point.x + 131));
      if (distance < minDistance) {
        minDistance = distance;
        closestPoint = point;
      }
    }
    
    const constrainedX = Math.max(131, Math.min(968, closestPoint.x + 131));
    const constrainedY = Math.max(153, Math.min(351, closestPoint.y + 153));
    setChartPosition({ x: constrainedX - 6, y: constrainedY - 6, data: closestPoint.data });
    setShowGameInfo(true);
  };

  const handleChartMouseLeave = () => {
    setShowGameInfo(false);
  };

  if (!shouldRender) return null;

  return (
    <div
      className="responsive-modal-overlay"
      style={{
        background: 'rgba(0, 0, 0, 0.5)',
        zIndex: 10000,
        opacity: isVisible ? 1 : 0,
        transition: 'opacity 0.15s ease-in-out',
        pointerEvents: isVisible ? 'auto' : 'none',
      }}
      onClick={onClose}
    >
      <div
        className="relative w-[1066px] h-[701px] shadow-[0px_4px_27.200000762939453px_0px_rgba(0,0,0,0.25)] overflow-hidden transition-transform duration-150"
        style={{ transform: isVisible ? 'scale(1)' : 'scale(0.95)' }}
        onClick={(e) => e.stopPropagation()}
      >
        
        <div className="w-[1062px] h-[701px] left-0 top-0 absolute rounded-2xl border border-zinc-800" style={{ background: '#191D29' }} />

        
        <div className="w-[124px] h-[36px] left-[824px] top-[100px] absolute rounded-[15px]" style={{ background: '#C77DFF' }}>
          <div className="w-[67px] h-[19px] left-[28px] top-[8px] absolute justify-start text-white text-[15px] font-semibold font-['Poppins'] leading-[22px]">Send Tip</div>
        </div>

        
        <div className="w-[36px] h-[36px] left-[960px] top-[100px] absolute rounded-[12px] flex items-center justify-center" style={{ background: '#2F3646' }}>
          <img src="/assets/svg/ui/roblox.svg" alt="Roblox" className="w-[26px] h-[26px]" />
        </div>

        
        <svg className="w-[18px] h-[18px] right-[20px] top-[20px] absolute cursor-pointer" width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg" onClick={onClose}>
          <path d="M17.6208 15.8023C17.8622 16.0437 17.9979 16.3712 17.9979 16.7126C17.9979 17.054 17.8622 17.3815 17.6208 17.6229C17.3793 17.8644 17.0518 18 16.7104 18C16.3689 18 16.0415 17.8644 15.8 17.6229L9 10.8212L2.19785 17.6208C1.9564 17.8622 1.62893 17.9979 1.28747 17.9979C0.946013 17.9979 0.61854 17.8622 0.377092 17.6208C0.135644 17.3794 3.59785e-09 17.0519 0 16.7105C-3.59785e-09 16.369 0.135644 16.0416 0.377092 15.8001L7.17924 9.00054L0.379234 2.19879C0.137786 1.95736 0.00214212 1.6299 0.00214212 1.28847C0.00214212 0.947028 0.137786 0.619574 0.379234 0.37814C0.620682 0.136707 0.948155 0.0010708 1.28961 0.00107079C1.63107 0.00107079 1.95855 0.136707 2.19999 0.37814L9 7.17988L15.8021 0.377069C16.0436 0.135636 16.3711 -5.68837e-09 16.7125 0C17.054 5.68837e-09 17.3815 0.135636 17.6229 0.377069C17.8644 0.618503 18 0.945957 18 1.2874C18 1.62883 17.8644 1.95629 17.6229 2.19772L10.8208 9.00054L17.6208 15.8023Z" fill="#424964"/>
        </svg>

        
        <div className="w-[674px] h-32 left-[55px] top-[23px] absolute">
          
          <img
            className="size-24 left-0 top-[22px] absolute rounded-[69px]"
            style={{ background: '#11151D' }}
            src={avatarUrl || '/assets/images/auth/PFPJAKEP.png'}
          />
          
          <div className="w-[569px] h-32 left-[105px] top-0 absolute">
            <div className="w-20 left-[1px] top-[31px] absolute justify-start text-white text-lg font-semibold font-['Poppins']">{username}</div>
            <div className="w-[515px] h-10 left-[1px] top-[72px] absolute">
              
              <div className="w-[194px] h-[39px] left-[254.5px] top-0 absolute">
                <div className="w-[194.24px] h-[39px] left-[-0.12px] top-0 absolute rounded-[15px]" style={{ background: '#202634' }} />
                <svg className="w-[20px] h-[20px] left-[15px] top-[9.5px] absolute" width="20" height="20" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M6.5 13C4.68333 13 3.146 12.3707 1.888 11.112C0.63 9.85333 0.000667196 8.316 5.29101e-07 6.5C-0.000666138 4.684 0.628667 3.14667 1.888 1.888C3.14733 0.629333 4.68467 0 6.5 0C8.31533 0 9.853 0.629333 11.113 1.888C12.373 3.14667 13.002 4.684 13 6.5C13 7.23333 12.8833 7.925 12.65 8.575C12.4167 9.225 12.1 9.8 11.7 10.3L17.3 15.9C17.4833 16.0833 17.575 16.3167 17.575 16.6C17.575 16.8833 17.4833 17.1167 17.3 17.3C17.1167 17.4833 16.8833 17.575 16.6 17.575C16.3167 17.575 16.0833 17.4833 15.9 17.3L10.3 11.7C9.8 12.1 9.225 12.4167 8.575 12.65C7.925 12.8833 7.23333 13 6.5 13ZM6.5 11C7.75 11 8.81267 10.5627 9.688 9.688C10.5633 8.81333 11.0007 7.75067 11 6.5C10.9993 5.24933 10.562 4.187 9.688 3.313C8.814 2.439 7.75133 2.00133 6.5 2C5.24867 1.99867 4.18633 2.43633 3.313 3.313C2.43967 4.18967 2.002 5.252 2 6.5C1.998 7.748 2.43567 8.81067 3.313 9.688C4.19033 10.5653 5.25267 11.0027 6.5 11Z" fill="white"/>
                </svg>
                <div className="w-[106px] h-[23px] left-[43px] top-[8px] absolute justify-start text-white text-[15px] font-semibold font-['Poppins'] leading-[22px]">{username}2</div>
                <svg className="w-[18px] h-[14px] right-[15px] top-[12px] absolute" width="18" height="14" viewBox="0 0 18 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M17.364 7.37629C17.5514 7.18876 17.6567 6.93445 17.6567 6.66929C17.6567 6.40412 17.5514 6.14982 17.364 5.96229L11.707 0.305288C11.6147 0.209778 11.5044 0.133596 11.3824 0.0811869C11.2604 0.0287779 11.1291 0.00119157 10.9964 3.77564e-05C10.8636 -0.00111606 10.7319 0.0241859 10.609 0.0744668C10.4861 0.124748 10.3744 0.199001 10.2806 0.292893C10.1867 0.386786 10.1124 0.498438 10.0621 0.621334C10.0118 0.74423 9.98655 0.87591 9.9877 1.00869C9.98885 1.14147 10.0164 1.27269 10.0689 1.39469C10.1213 1.5167 10.1974 1.62704 10.293 1.71929L14.243 5.66929L0.999952 5.66929C0.734736 5.66929 0.480381 5.77465 0.292845 5.96218C0.105308 6.14972 -4.76837e-05 6.40407 -4.76837e-05 6.66929C-4.76837e-05 6.9345 0.105308 7.18886 0.292845 7.37639C0.480381 7.56393 0.734736 7.66929 0.999952 7.66929L14.243 7.66929L10.293 11.6193C10.1108 11.8079 10.01 12.0605 10.0123 12.3227C10.0146 12.5849 10.1197 12.8357 10.3051 13.0211C10.4905 13.2065 10.7414 13.3117 11.0036 13.314C11.2657 13.3162 11.5183 13.2154 11.707 13.0333L17.364 7.37629Z" fill="#8890A2"/>
                </svg>
              </div>
              
              <div className="w-[245px] h-[39px] left-0 top-0 absolute">
                <div className="w-[245px] h-[39px] left-0 top-0 absolute rounded-[15px]" style={{ background: '#202634' }} />
                <div className="w-[67px] h-[23px] left-[17px] top-[8px] absolute justify-start text-[#8890A2] text-[15px] font-semibold font-['Poppins'] leading-[22px]">Joined</div>
                <div className="w-[111.68px] h-[23px] left-[112.2px] top-[8px] absolute justify-start text-white text-[15px] font-semibold font-['Poppins'] leading-[22px]">{formatJoinDate(userData?.joinDate || 'May 29, 2021')}</div>
                <div className="w-px h-[13px] left-[92px] top-[13px] absolute bg-[#8890A2] rounded-[8px]" />
              </div>
            </div>
          </div>
        </div>

        
        <div className="w-[933px] h-px left-[59px] top-[159px] absolute bg-gray-800" />

        
        <div className="w-[1002px] h-[468px] left-[30px] top-[199px] absolute">
          <div className="w-96 left-[29px] top-0 absolute justify-start text-white text-lg font-semibold font-['Poppins']">Profit Chart</div>
          
          
          <div className="size- left-[72px] top-[141px] absolute inline-flex flex-col justify-start items-start">
            <div className="w-24 h-11 justify-start text-slate-500 text-xs font-semibold font-['Poppins']">1,000,000</div>
            <div className="w-20 h-11 justify-start text-slate-500 text-xs font-semibold font-['Poppins']">250,000</div>
            <div className="w-20 h-11 justify-start text-slate-500 text-xs font-semibold font-['Poppins']">100,000</div>
            <div className="w-20 h-11 justify-start text-slate-500 text-xs font-semibold font-['Poppins']">50,000</div>
            <div className="w-20 h-11 justify-start text-slate-500 text-xs font-semibold font-['Poppins']">25,000</div>
            <div className="w-20 h-11 justify-start text-slate-500 text-xs font-semibold font-['Poppins']">0.00</div>
          </div>

          
          <div 
            className="w-[837px] h-[198px] left-[131px] top-[153px] absolute rounded-[5px]"
            onMouseMove={handleChartMouseMove}
            onMouseLeave={handleChartMouseLeave}
          >
            
            <svg className="w-[834px] h-[7px] left-[0px] top-[198px] absolute" width="834" height="7" viewBox="0 0 834 7" fill="none" xmlns="http://www.w3.org/2000/svg">
              <ellipse cx="417" cy="3.5" rx="3.5" ry="417" transform="rotate(-90 417 3.5)" fill="#1B1F2B"/>
            </svg>
            <svg className="w-[834px] h-[7px] left-[0px] top-[115px] absolute" width="834" height="7" viewBox="0 0 834 7" fill="none" xmlns="http://www.w3.org/2000/svg">
              <ellipse cx="417" cy="3.5" rx="3.5" ry="417" transform="rotate(-90 417 3.5)" fill="#1B1F2B"/>
            </svg>
            <svg className="w-[834px] h-[7px] left-[0px] top-[43px] absolute" width="834" height="7" viewBox="0 0 834 7" fill="none" xmlns="http://www.w3.org/2000/svg">
              <ellipse cx="417" cy="3.5" rx="3.5" ry="417" transform="rotate(-90 417 3.5)" fill="#1B1F2B"/>
            </svg>
            
            <svg className="w-[840px] h-[201px] left-0 top-0 absolute" width="840" height="201" viewBox="0 0 840 201" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d={generateChartPath()} stroke="#C77DFF" strokeWidth="3" strokeLinecap="round"/>
            </svg>
          </div>
          
          
          <div 
            className="size-3 absolute bg-blue-600 rounded-[48px] border border-white transition-all duration-100 ease-out"
            style={{ 
              left: `${chartPosition.x}px`, 
              top: `${chartPosition.y}px`,
              opacity: showGameInfo ? 1 : 0
            }}
          />
          
          
          <div 
            className="w-[106px] h-[80px] absolute transition-all duration-100 ease-out rounded-[15px]"
            style={{
              left: `${chartPosition.x + 31}px`,
              top: `${chartPosition.y - 45}px`,
              opacity: showGameInfo ? 1 : 0,
              background: '#202634'
            }}
          >
            <div className="w-[103px] h-[15px] left-[8px] top-[7px] absolute justify-start text-[#787C84] text-[10px] font-semibold font-['Poppins'] leading-[15px]">{chartPosition.data?.date || 'March, 10th'}</div>
            <div className="w-[87px] h-[16px] left-[8px] top-[28px] absolute justify-start"><span className="text-[#787C84] text-[10.9806px] font-semibold font-['Poppins'] leading-[16px]">ID: </span><span className="text-white text-[10.9806px] font-semibold font-['Poppins'] leading-[16px]">{chartPosition.data?.gameId || '572245'}</span></div>
            <div className="w-[87px] h-[16px] left-[8px] top-[41.51px] absolute justify-start"><span className="text-[#787C84] text-[10.9806px] font-semibold font-['Poppins'] leading-[16px]">Game: </span><span className="text-white text-[10.9806px] font-semibold font-['Poppins'] leading-[16px]">{chartPosition.data?.gameType || 'Jackpot'}</span></div>
            <div className="w-[87px] h-[16px] left-[8px] top-[55.03px] absolute justify-start"><span className="text-[#787C84] text-[10.9806px] font-semibold font-['Poppins'] leading-[16px]">Profit: </span><span className="text-blue-600 text-[10.9806px] font-semibold font-['Poppins'] leading-[16px]">{chartPosition.data?.profit ? formatAmount(chartPosition.data.profit) : 'A$43.2K'}</span></div>
          </div>

          
          <div className="w-32 h-4 left-[25.34px] top-[320.41px] absolute origin-top-left -rotate-90 text-center justify-start text-gray-400 text-xs font-bold font-['Poppins'] tracking-widest">CUMALATIVE NET-PROFIT</div>

          
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

          
          <div className="w-[933px] h-[63px] left-[29px] top-[31px] absolute rounded-[15px]" style={{ background: '#202634' }} />
          <img src="/assets/profile/wallet.svg" alt="Wallet" className="w-5 h-4 left-[44px] top-[66px] absolute" />
          <div className="w-[85px] h-[40px] left-[867px] top-[43px] absolute rounded-[15px]" style={{ background: '#2B3242' }}>
            <svg className="w-[14px] h-[8px] right-[10px] top-[16px] absolute" width="14" height="8" viewBox="0 0 14 8" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M6.7998 7.4502C6.70477 7.4502 6.61021 7.43133 6.52246 7.39551C6.43484 7.35969 6.35558 7.30676 6.28906 7.24023L0.348633 1.30078C0.222068 1.17429 0.149414 1.00396 0.149414 0.826172C0.149514 0.64852 0.222156 0.478946 0.348633 0.352539L0.357422 0.34375L0.358398 0.344727C0.42024 0.283426 0.493182 0.234353 0.574219 0.201172C0.656479 0.167525 0.744896 0.14943 0.833984 0.149414C0.923116 0.149414 1.01145 0.167509 1.09375 0.201172C1.17605 0.234839 1.25103 0.284051 1.31348 0.34668L6.79883 5.83496L12.2861 0.34668C12.3486 0.284052 12.4236 0.234839 12.5059 0.201172C12.5882 0.167509 12.6765 0.149414 12.7656 0.149414C12.8547 0.14943 12.9431 0.167525 13.0254 0.201172C13.1066 0.234441 13.1802 0.283195 13.2422 0.344727V0.34375L13.251 0.352539C13.3775 0.478946 13.4501 0.64852 13.4502 0.826172C13.4502 1.00396 13.3775 1.17429 13.251 1.30078L7.31055 7.24023C7.24402 7.30676 7.16477 7.35969 7.07715 7.39551C6.9894 7.43133 6.89483 7.4502 6.7998 7.4502Z" fill="#6E7484" stroke="#6E7484" strokeWidth="0.3"/>
            </svg>
          </div>
          <div className="w-96 left-[44px] top-[39px] absolute justify-start text-gray-400 text-base font-semibold font-['Poppins']">Net Profit</div>
          <div className="w-96 left-[72px] top-[59.02px] absolute justify-start text-white text-xl font-semibold font-['Poppins']">{formatAmount(userData?.totalProfit || 0)}</div>
          <div className="w-10 left-[880px] top-[52px] absolute justify-start text-stone-300 text-sm font-semibold font-['Poppins']">1 Day</div>
        </div>
      </div>
    </div>
  );
}
