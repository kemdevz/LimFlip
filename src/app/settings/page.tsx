'use client';

import { useState } from 'react';
import { useIsMobile } from '@/hooks/useMediaQuery';
import Subnavbar from '@/components/layout/Subnavbar';
import Navbar from '@/components/layout/Navbar';
import Sidebar from '@/components/layout/Sidebar';
import SignUpModal from '@/components/auth/SignUpModal';
import ValidateFairnessModal from '@/components/coinflip/ValidateFairnessModal';
import MyListingsModal from '@/components/market/MyListingsModal';
import CreateGiveawayModal from '@/components/giveaway/CreateGiveawayModal';
import PrivacyModal from '@/components/privacy/PrivacyModal';
import RulesModal from '@/components/rules/RulesModal';
import FaqModal from '@/components/faq/FaqModal';

export default function ProfilePage() {
  const isMobile = useIsMobile();
  const [isSignUpModalOpen, setIsSignUpModalOpen] = useState(false);
  const [isValidateFairnessOpen, setIsValidateFairnessOpen] = useState(false);
  const [isMyListingsOpen, setIsMyListingsOpen] = useState(false);
  const [isCreateGiveawayOpen, setIsCreateGiveawayOpen] = useState(false);
  const [isPrivacyModalOpen, setIsPrivacyModalOpen] = useState(false);
  const [isRulesModalOpen, setIsRulesModalOpen] = useState(false);
  const [isFaqModalOpen, setIsFaqModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'account' | 'linking'>('account');

  return (
    <div className="page-shell page-shell--fixed">
      
      <div
        className="page-bg page-bg--main"
        style={{
          backgroundImage: 'url(/assets/images/backgrounds/mainbg.png)',
        }}
      />
      
      
      <div
        className="absolute inset-0"
        style={{
          background: 'rgba(19, 22, 33, 0.3)',
        }}
      />

      <Subnavbar
        onTermsClick={() => window.location.href = '/tos'}
        onLeaderboardClick={() => {}}
        onProvablyFairClick={() => setIsValidateFairnessOpen(true)}
        onPrivacyClick={() => setIsPrivacyModalOpen(true)}
        onFaqClick={() => setIsFaqModalOpen(true)}
      />
      <Navbar
        onSignUpClick={() => setIsSignUpModalOpen(true)}
        onLogInClick={() => setIsSignUpModalOpen(true)}
        onSellItemsClick={() => setIsMyListingsOpen(true)}
      />
      <Sidebar onGiftClick={() => setIsCreateGiveawayOpen(true)} />

      
      <div
        style={{
          position: isMobile ? 'relative' : 'absolute',
          width: isMobile ? '100%' : '1920px',
          height: isMobile ? 'auto' : '1167px',
          left: isMobile ? '0' : '0px',
          top: isMobile ? '0' : '0px',
          padding: isMobile ? '20px' : '0',
        }}
      >
        
        <div
          style={{
            position: isMobile ? 'relative' : 'absolute',
            width: isMobile ? '100%' : '155px',
            height: isMobile ? 'auto' : '56px',
            left: isMobile ? '0' : '385px',
            top: isMobile ? '0' : '153px',
            fontFamily: 'Poppins',
            fontStyle: 'normal',
            fontWeight: 600,
            fontSize: isMobile ? '28px' : '37px',
            lineHeight: isMobile ? '42px' : '56px',
            color: '#FFFFFF',
            textAlign: isMobile ? 'center' : 'left',
            marginBottom: isMobile ? '20px' : '0',
          }}
        >
          Settings
        </div>

        
        <div
          style={{
            display: 'flex',
            flexDirection: isMobile ? 'row' : 'column',
            alignItems: isMobile ? 'center' : 'flex-start',
            justifyContent: isMobile ? 'center' : 'flex-start',
            padding: isMobile ? '0' : '0px',
            gap: isMobile ? '10px' : '12px',
            position: isMobile ? 'relative' : 'absolute',
            width: isMobile ? '100%' : '218px',
            height: isMobile ? 'auto' : '116px',
            left: isMobile ? '0' : '382px',
            top: isMobile ? '0' : '224px',
            marginBottom: isMobile ? '20px' : '0',
          }}
        >
          
          <div
            onClick={() => setActiveTab('account')}
            style={{
              width: isMobile ? 'calc(50% - 5px)' : '218px',
              height: isMobile ? '50px' : '52px',
              cursor: 'pointer',
              position: 'relative',
            }}
          >
            <div
              style={{
                position: 'absolute',
                width: isMobile ? '100%' : '218px',
                height: isMobile ? '100%' : '52px',
                left: '0px',
                top: '0px',
                background: activeTab === 'account' ? '#1E222F' : '#191D29',
                borderRadius: '13px',
              }}
            />
            <span
              style={{
                position: 'absolute',
                width: isMobile ? '100%' : '76px',
                height: isMobile ? '100%' : '27px',
                left: isMobile ? '50%' : '71px',
                top: isMobile ? '50%' : '12px',
                transform: isMobile ? 'translate(-50%, -50%)' : 'none',
                fontFamily: 'Poppins',
                fontStyle: 'normal',
                fontWeight: 500,
                fontSize: isMobile ? '16px' : '18px',
                lineHeight: isMobile ? '24px' : '27px',
                color: activeTab === 'account' ? '#FFFFFF' : '#606776',
                textAlign: 'center',
              }}
            >
              Account
            </span>
          </div>

          
          <div
            onClick={() => setActiveTab('linking')}
            style={{
              width: isMobile ? 'calc(50% - 5px)' : '218px',
              height: isMobile ? '50px' : '52px',
              cursor: 'pointer',
              position: 'relative',
              opacity: activeTab === 'linking' ? '1' : '0.63',
            }}
          >
            <div
              style={{
                position: 'absolute',
                width: isMobile ? '100%' : '218px',
                height: isMobile ? '100%' : '52px',
                left: '0px',
                top: '0px',
                background: activeTab === 'linking' ? '#1E222F' : '#191D29',
                borderRadius: '13px',
              }}
            />
            <span
              style={{
                position: 'absolute',
                width: isMobile ? '100%' : '64px',
                height: isMobile ? '100%' : '27px',
                left: isMobile ? '50%' : '77px',
                top: isMobile ? '50%' : '12px',
                transform: isMobile ? 'translate(-50%, -50%)' : 'none',
                fontFamily: 'Poppins',
                fontStyle: 'normal',
                fontWeight: 500,
                fontSize: isMobile ? '16px' : '18px',
                lineHeight: isMobile ? '24px' : '27px',
                color: activeTab === 'linking' ? '#FFFFFF' : '#606776',
                textAlign: 'center',
              }}
            >
              Linking
            </span>
          </div>
        </div>

        
        {activeTab === 'linking' && (
          <div
            style={{
              position: isMobile ? 'relative' : 'absolute',
              width: isMobile ? '100%' : '1269px',
              height: isMobile ? 'auto' : '520px',
              left: isMobile ? '0' : '622px',
              top: isMobile ? '0' : '224px',
              marginBottom: isMobile ? '20px' : '0',
            }}
          >
            
            <span
              style={{
                position: isMobile ? 'relative' : 'absolute',
                width: isMobile ? '100%' : '299px',
                height: isMobile ? 'auto' : '38px',
                left: isMobile ? '0' : '2px',
                top: isMobile ? '0' : '0px',
                fontFamily: 'Poppins',
                fontStyle: 'normal',
                fontWeight: 600,
                fontSize: isMobile ? '22px' : '25px',
                lineHeight: isMobile ? '33px' : '38px',
                color: '#FFFFFF',
                textAlign: isMobile ? 'center' : 'left',
                marginBottom: isMobile ? '10px' : '0',
              }}
            >
              Link Roblox Accounts
            </span>
            <span
              style={{
                position: isMobile ? 'relative' : 'absolute',
                width: isMobile ? '100%' : '461px',
                height: isMobile ? 'auto' : '30px',
                left: isMobile ? '0' : '2px',
                top: isMobile ? '0' : '44px',
                fontFamily: 'Poppins',
                fontStyle: 'normal',
                fontWeight: 500,
                fontSize: isMobile ? '16px' : '20px',
                lineHeight: isMobile ? '24px' : '30px',
                color: '#595F6F',
                textAlign: isMobile ? 'center' : 'left',
                marginBottom: isMobile ? '15px' : '0',
              }}
            >
              Link your account and deposit to the site.
            </span>

            
            <div
              style={{
                position: isMobile ? 'relative' : 'absolute',
                width: isMobile ? '100%' : '1268px',
                height: isMobile ? 'auto' : '60px',
                left: isMobile ? '0' : '0px',
                top: isMobile ? '0' : '84px',
                background: '#191D29',
                borderRadius: '12px',
                padding: isMobile ? '15px' : '0',
                marginBottom: isMobile ? '20px' : '0',
              }}
            >
              <span
                style={{
                  position: isMobile ? 'relative' : 'absolute',
                  width: isMobile ? '100%' : '1138px',
                  height: isMobile ? 'auto' : '26px',
                  left: isMobile ? '0' : '76px',
                  top: isMobile ? '0' : '17px',
                  fontFamily: 'Poppins',
                  fontStyle: 'normal',
                  fontWeight: 500,
                  fontSize: isMobile ? '14px' : '17px',
                  lineHeight: isMobile ? '21px' : '26px',
                  color: '#FFFFFF',
                  textAlign: isMobile ? 'center' : 'left',
                }}
              >
                Once you link you can then deposit as many times as you want. Max of 4 ROBLOX accounts linked. Discord is excluded
              </span>
            </div>

            
            <div
              style={{
                display: 'flex',
                flexDirection: isMobile ? 'column' : 'row',
                alignItems: isMobile ? 'center' : 'flex-start',
                padding: '0px',
                gap: isMobile ? '15px' : '18px',
                position: isMobile ? 'relative' : 'absolute',
                width: isMobile ? '100%' : '1269px',
                height: isMobile ? 'auto' : '360px',
                left: isMobile ? '0' : '0px',
                top: isMobile ? '0' : '160px',
              }}
            >
              
              <div
                style={{
                  width: isMobile ? '100%' : '419px',
                  height: isMobile ? 'auto' : '171px',
                  position: 'relative',
                }}
              >
                
                <div
                  style={{
                    position: isMobile ? 'relative' : 'absolute',
                    width: isMobile ? '100%' : '419px',
                    height: isMobile ? '60px' : '77px',
                    left: isMobile ? '0' : '0px',
                    top: isMobile ? '0' : '0px',
                    background: '#1E222F',
                    borderRadius: '12px',
                    cursor: 'pointer',
                    marginBottom: isMobile ? '10px' : '0',
                  }}
                >
                  <span
                    style={{
                      position: 'absolute',
                      width: isMobile ? '100%' : '247px',
                      height: isMobile ? '100%' : '35px',
                      left: isMobile ? '50%' : '28px',
                      top: isMobile ? '50%' : '21px',
                      transform: isMobile ? 'translate(-50%, -50%)' : 'none',
                      fontFamily: 'Poppins',
                      fontStyle: 'normal',
                      fontWeight: 600,
                      fontSize: isMobile ? '18px' : '23px',
                      lineHeight: isMobile ? '27px' : '34px',
                      color: '#FFFFFF',
                      textAlign: 'center',
                    }}
                  >
                    Link ROBLOX Account
                  </span>
                </div>

                
                <div
                  style={{
                    position: isMobile ? 'relative' : 'absolute',
                    width: isMobile ? '100%' : '419px',
                    height: isMobile ? '60px' : '77px',
                    left: isMobile ? '0' : '0px',
                    top: isMobile ? '0' : '91px',
                    background: '#1E222F',
                    borderRadius: '12px',
                    cursor: 'pointer',
                  }}
                >
                  <span
                    style={{
                      position: 'absolute',
                      width: isMobile ? '100%' : '259px',
                      height: isMobile ? '100%' : '35px',
                      left: isMobile ? '50%' : '28px',
                      top: isMobile ? '50%' : '21px',
                      transform: isMobile ? 'translate(-50%, -50%)' : 'none',
                      fontFamily: 'Poppins',
                      fontStyle: 'normal',
                      fontWeight: 600,
                      fontSize: isMobile ? '18px' : '23px',
                      lineHeight: isMobile ? '27px' : '34px',
                      color: '#FFFFFF',
                      textAlign: 'center',
                    }}
                  >
                    Link DISCORD Account
                  </span>
                </div>
              </div>

              
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'row',
                  flexWrap: 'wrap',
                  alignItems: isMobile ? 'center' : 'flex-start',
                  alignContent: 'flex-start',
                  justifyContent: isMobile ? 'center' : 'flex-start',
                  padding: '0px',
                  gap: isMobile ? '15px' : '18px',
                  width: isMobile ? '100%' : '832px',
                  height: isMobile ? 'auto' : '360px',
                }}
              >
                
                <div
                  style={{
                    width: isMobile ? 'calc(50% - 8px)' : '407px',
                    height: isMobile ? '150px' : '171px',
                    position: 'relative',
                  }}
                >
                  <div
                    style={{
                      position: 'absolute',
                      width: isMobile ? '100%' : '405px',
                      height: isMobile ? '100%' : '171px',
                      left: '0px',
                      top: '0px',
                      background: '#191D29',
                      borderRadius: '15px',
                    }}
                  />
                  <div
                    style={{
                      position: 'absolute',
                      width: isMobile ? '50px' : '67px',
                      height: isMobile ? '50px' : '67px',
                      left: isMobile ? '15px' : '28px',
                      top: isMobile ? '15px' : '20px',
                      background: 'url(/assets/images/auth/PFPJAKEP.png)',
                      backgroundSize: 'cover',
                      borderRadius: '111px',
                    }}
                  />
                  <span
                    style={{
                      position: 'absolute',
                      width: isMobile ? 'calc(100% - 80px)' : '123px',
                      height: isMobile ? 'auto' : '30px',
                      left: isMobile ? '75px' : '113px',
                      top: isMobile ? '20px' : '27px',
                      fontFamily: 'Poppins',
                      fontStyle: 'normal',
                      fontWeight: 600,
                      fontSize: isMobile ? '16px' : '20px',
                      lineHeight: isMobile ? '24px' : '30px',
                      color: '#FFFFFF',
                    }}
                  >
                    esed9hjdeis
                  </span>
                  <span
                    style={{
                      position: 'absolute',
                      width: isMobile ? 'auto' : '55px',
                      height: isMobile ? 'auto' : '24px',
                      left: isMobile ? '75px' : '113px',
                      top: isMobile ? '45px' : '56px',
                      fontFamily: 'Poppins',
                      fontStyle: 'normal',
                      fontWeight: 600,
                      fontSize: isMobile ? '14px' : '16px',
                      lineHeight: isMobile ? '21px' : '24px',
                      color: '#606679',
                    }}
                  >
                    Roblox
                  </span>
                  <div
                    style={{
                      position: 'absolute',
                      width: isMobile ? 'calc(100% - 30px)' : '358px',
                      height: isMobile ? '35px' : '44px',
                      left: isMobile ? '15px' : '27px',
                      top: isMobile ? '100px' : '104px',
                      background: '#1E222F',
                      borderRadius: '15px',
                    }}
                  >
                    <span
                      style={{
                        position: 'absolute',
                        width: isMobile ? 'auto' : '53px',
                        height: isMobile ? '100%' : '24px',
                        left: isMobile ? '50%' : '152px',
                        top: isMobile ? '50%' : '10px',
                        transform: isMobile ? 'translate(-50%, -50%)' : 'none',
                        fontFamily: 'Poppins',
                        fontStyle: 'normal',
                        fontWeight: 600,
                        fontSize: isMobile ? '14px' : '16px',
                        lineHeight: isMobile ? '21px' : '24px',
                        color: '#FFFFFF',
                        textAlign: 'center',
                      }}
                    >
                      Linked
                    </span>
                  </div>
                </div>

                
                <div
                  style={{
                    width: isMobile ? 'calc(50% - 8px)' : '407px',
                    height: isMobile ? '150px' : '171px',
                    position: 'relative',
                  }}
                >
                  <div
                    style={{
                      position: 'absolute',
                      width: isMobile ? '100%' : '405px',
                      height: isMobile ? '100%' : '171px',
                      left: '0px',
                      top: '0px',
                      background: '#191D29',
                      borderRadius: '15px',
                    }}
                  />
                  <div
                    style={{
                      position: 'absolute',
                      width: isMobile ? '50px' : '67px',
                      height: isMobile ? '50px' : '67px',
                      left: isMobile ? '15px' : '28px',
                      top: isMobile ? '15px' : '20px',
                      background: 'url(/assets/images/auth/PFPJAKEP.png)',
                      backgroundSize: 'cover',
                      borderRadius: '111px',
                    }}
                  />
                  <span
                    style={{
                      position: 'absolute',
                      width: isMobile ? 'calc(100% - 80px)' : '123px',
                      height: isMobile ? 'auto' : '30px',
                      left: isMobile ? '75px' : '113px',
                      top: isMobile ? '20px' : '27px',
                      fontFamily: 'Poppins',
                      fontStyle: 'normal',
                      fontWeight: 600,
                      fontSize: isMobile ? '16px' : '20px',
                      lineHeight: isMobile ? '24px' : '30px',
                      color: '#FFFFFF',
                    }}
                  >
                    esed9hjdeis
                  </span>
                  <span
                    style={{
                      position: 'absolute',
                      width: isMobile ? 'auto' : '55px',
                      height: isMobile ? 'auto' : '24px',
                      left: isMobile ? '75px' : '113px',
                      top: isMobile ? '45px' : '56px',
                      fontFamily: 'Poppins',
                      fontStyle: 'normal',
                      fontWeight: 600,
                      fontSize: isMobile ? '14px' : '16px',
                      lineHeight: isMobile ? '21px' : '24px',
                      color: '#606679',
                    }}
                  >
                    Roblox
                  </span>
                  <div
                    style={{
                      position: 'absolute',
                      width: isMobile ? 'calc(100% - 30px)' : '358px',
                      height: isMobile ? '35px' : '44px',
                      left: isMobile ? '15px' : '27px',
                      top: isMobile ? '100px' : '104px',
                      background: '#1E222F',
                      borderRadius: '15px',
                    }}
                  >
                    <span
                      style={{
                        position: 'absolute',
                        width: isMobile ? 'auto' : '53px',
                        height: isMobile ? '100%' : '24px',
                        left: isMobile ? '50%' : '152px',
                        top: isMobile ? '50%' : '10px',
                        transform: isMobile ? 'translate(-50%, -50%)' : 'none',
                        fontFamily: 'Poppins',
                        fontStyle: 'normal',
                        fontWeight: 600,
                        fontSize: isMobile ? '14px' : '16px',
                        lineHeight: isMobile ? '21px' : '24px',
                        color: '#FFFFFF',
                        textAlign: 'center',
                      }}
                    >
                      Linked
                    </span>
                  </div>
                </div>

                
                <div
                  style={{
                    width: isMobile ? 'calc(50% - 8px)' : '407px',
                    height: isMobile ? '150px' : '171px',
                    position: 'relative',
                  }}
                >
                  <div
                    style={{
                      position: 'absolute',
                      width: isMobile ? '100%' : '405px',
                      height: isMobile ? '100%' : '171px',
                      left: '0px',
                      top: '0px',
                      background: '#191D29',
                      borderRadius: '15px',
                    }}
                  />
                  <div
                    style={{
                      position: 'absolute',
                      width: isMobile ? '50px' : '67px',
                      height: isMobile ? '50px' : '67px',
                      left: isMobile ? '15px' : '28px',
                      top: isMobile ? '15px' : '20px',
                      background: 'url(/assets/images/auth/PFPJAKEP.png)',
                      backgroundSize: 'cover',
                      borderRadius: '111px',
                    }}
                  />
                  <span
                    style={{
                      position: 'absolute',
                      width: isMobile ? 'calc(100% - 80px)' : '123px',
                      height: isMobile ? 'auto' : '30px',
                      left: isMobile ? '75px' : '113px',
                      top: isMobile ? '20px' : '27px',
                      fontFamily: 'Poppins',
                      fontStyle: 'normal',
                      fontWeight: 600,
                      fontSize: isMobile ? '16px' : '20px',
                      lineHeight: isMobile ? '24px' : '30px',
                      color: '#FFFFFF',
                    }}
                  >
                    esed9hjdeis
                  </span>
                  <span
                    style={{
                      position: 'absolute',
                      width: isMobile ? 'auto' : '55px',
                      height: isMobile ? 'auto' : '24px',
                      left: isMobile ? '75px' : '113px',
                      top: isMobile ? '45px' : '56px',
                      fontFamily: 'Poppins',
                      fontStyle: 'normal',
                      fontWeight: 600,
                      fontSize: isMobile ? '14px' : '16px',
                      lineHeight: isMobile ? '21px' : '24px',
                      color: '#606679',
                    }}
                  >
                    Roblox
                  </span>
                  <div
                    style={{
                      position: 'absolute',
                      width: isMobile ? 'calc(100% - 30px)' : '358px',
                      height: isMobile ? '35px' : '44px',
                      left: isMobile ? '15px' : '27px',
                      top: isMobile ? '100px' : '104px',
                      background: '#1E222F',
                      borderRadius: '15px',
                    }}
                  >
                    <span
                      style={{
                        position: 'absolute',
                        width: isMobile ? 'auto' : '53px',
                        height: isMobile ? '100%' : '24px',
                        left: isMobile ? '50%' : '152px',
                        top: isMobile ? '50%' : '10px',
                        transform: isMobile ? 'translate(-50%, -50%)' : 'none',
                        fontFamily: 'Poppins',
                        fontStyle: 'normal',
                        fontWeight: 600,
                        fontSize: isMobile ? '14px' : '16px',
                        lineHeight: isMobile ? '21px' : '24px',
                        color: '#FFFFFF',
                        textAlign: 'center',
                      }}
                    >
                      Linked
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        
        {activeTab === 'account' && (
          <div style={{ position: 'relative', display: 'flex', flexDirection: isMobile ? 'column' : 'row', gap: isMobile ? '20px' : '0' }}>
          
          <div
            style={{
              position: isMobile ? 'relative' : 'absolute',
              width: isMobile ? '100%' : '647px',
              height: isMobile ? 'auto' : '220px',
              left: isMobile ? '0' : '1297px',
              top: isMobile ? '0' : '224px',
              marginBottom: isMobile ? '20px' : '0',
            }}
          >
            <div
              style={{
                position: isMobile ? 'relative' : 'absolute',
                width: isMobile ? '100%' : '596px',
                height: isMobile ? 'auto' : '220px',
                left: '0px',
                top: '0px',
                background: '#191D29',
                borderRadius: '15px',
                padding: isMobile ? '20px' : '0',
              }}
            />
            <span
              style={{
                position: isMobile ? 'relative' : 'absolute',
                width: isMobile ? '100%' : '143px',
                height: isMobile ? 'auto' : '33px',
                left: isMobile ? '0' : '29px',
                top: isMobile ? '0' : '22px',
                fontFamily: 'Poppins',
                fontStyle: 'normal',
                fontWeight: 600,
                fontSize: isMobile ? '20px' : '22px',
                lineHeight: isMobile ? '30px' : '33px',
                color: '#FFFFFF',
                marginBottom: isMobile ? '10px' : '0',
              }}
            >
              Connections
            </span>
            <span
              style={{
                position: isMobile ? 'relative' : 'absolute',
                width: isMobile ? '100%' : '549px',
                height: isMobile ? 'auto' : '46px',
                left: isMobile ? '0' : '29px',
                top: isMobile ? '0' : '60px',
                fontFamily: 'Poppins',
                fontStyle: 'normal',
                fontWeight: 500,
                fontSize: isMobile ? '14px' : '15px',
                lineHeight: isMobile ? '21px' : '22px',
                color: '#4C5468',
                marginBottom: isMobile ? '15px' : '0',
              }}
            >
              Connect your account to various platforms to unlock perks like discord, and roblox.
            </span>
            <div
              style={{
                position: isMobile ? 'relative' : 'absolute',
                width: isMobile ? '100%' : '537px',
                height: isMobile ? '50px' : '57px',
                left: isMobile ? '0' : '28px',
                top: isMobile ? '0' : '129px',
                background: '#C77DFF',
                borderRadius: '15px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <span
                style={{
                  fontFamily: 'Poppins',
                  fontStyle: 'normal',
                  fontWeight: 600,
                  fontSize: isMobile ? '16px' : '17px',
                  lineHeight: isMobile ? '24px' : '26px',
                  color: '#FFFFFF',
                }}
              >
                Go-to Linking
              </span>
            </div>
          </div>

          
          <div
            style={{
              position: isMobile ? 'relative' : 'absolute',
              width: isMobile ? '100%' : '648px',
              height: isMobile ? 'auto' : '492px',
              left: isMobile ? '0' : '1295px',
              top: isMobile ? '0' : '466px',
              marginBottom: isMobile ? '20px' : '0',
            }}
          >
            <div
              style={{
                position: isMobile ? 'relative' : 'absolute',
                width: isMobile ? '100%' : '596px',
                height: isMobile ? 'auto' : '492px',
                left: '0px',
                top: '0px',
                background: '#191D29',
                borderRadius: '15px',
                padding: isMobile ? '20px' : '0',
              }}
            />
            <span
              style={{
                position: isMobile ? 'relative' : 'absolute',
                width: isMobile ? '100%' : '295px',
                height: isMobile ? 'auto' : '33px',
                left: isMobile ? '0' : '30px',
                top: isMobile ? '0' : '33px',
                fontFamily: 'Poppins',
                fontStyle: 'normal',
                fontWeight: 600,
                fontSize: isMobile ? '20px' : '22px',
                lineHeight: isMobile ? '30px' : '33px',
                color: '#FFFFFF',
                marginBottom: isMobile ? '15px' : '0',
              }}
            >
              Two Factor Authentication
            </span>
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: isMobile ? 'flex-start' : 'flex-end',
                padding: '0px',
                gap: isMobile ? '15px' : '68px',
                position: isMobile ? 'relative' : 'absolute',
                width: isMobile ? '100%' : '542px',
                height: isMobile ? 'auto' : '292px',
                left: isMobile ? '0' : '29px',
                top: isMobile ? '0' : '92px',
                marginBottom: isMobile ? '15px' : '0',
              }}
            >
              <span
                style={{
                  width: isMobile ? '100%' : '542px',
                  height: isMobile ? 'auto' : '52px',
                  fontFamily: 'Poppins',
                  fontStyle: 'normal',
                  fontWeight: 500,
                  fontSize: isMobile ? '14px' : '17px',
                  lineHeight: isMobile ? '21px' : '26px',
                  color: '#4C5468',
                }}
              >
                Enable two-factor authentication and add an extra level of security to your bloxshop account.
              </span>
              <span
                style={{
                  width: isMobile ? '100%' : '542px',
                  height: isMobile ? 'auto' : '52px',
                  fontFamily: 'Poppins',
                  fontStyle: 'normal',
                  fontWeight: 500,
                  fontSize: isMobile ? '14px' : '17px',
                  lineHeight: isMobile ? '21px' : '26px',
                  color: '#4C5468',
                }}
              >
                By enabling this feature you are responsible for keeping backup codes in-case of loss of access to the application.
              </span>
              <span
                style={{
                  width: isMobile ? '100%' : '542px',
                  height: isMobile ? 'auto' : '52px',
                  fontFamily: 'Poppins',
                  fontStyle: 'normal',
                  fontWeight: 500,
                  fontSize: isMobile ? '14px' : '17px',
                  lineHeight: isMobile ? '21px' : '26px',
                  color: '#4C5468',
                }}
              >
                Two Factor can be setup using any authenticator app with ease, simply click the enable 2fa button to start the process.
              </span>
            </div>
            <div
              style={{
                position: isMobile ? 'relative' : 'absolute',
                width: isMobile ? '100%' : '537px',
                height: isMobile ? '50px' : '57px',
                left: isMobile ? '0' : '29px',
                top: isMobile ? '0' : '421px',
                background: '#252B3C',
                borderRadius: '15px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <span
                style={{
                  fontFamily: 'Poppins',
                  fontStyle: 'normal',
                  fontWeight: 600,
                  fontSize: isMobile ? '16px' : '16px',
                  lineHeight: isMobile ? '24px' : '24px',
                  color: '#5F687E',
                }}
              >
                Coming Soon
              </span>
            </div>
          </div>

          
          <div
            style={{
              position: isMobile ? 'relative' : 'absolute',
              width: isMobile ? '100%' : '745px',
              height: isMobile ? 'auto' : '734px',
              left: isMobile ? '0' : '622px',
              top: isMobile ? '0' : '224px',
              marginBottom: isMobile ? '20px' : '0',
            }}
          >
            <div
              style={{
                position: isMobile ? 'relative' : 'absolute',
                width: isMobile ? '100%' : '649px',
                height: isMobile ? 'auto' : '734px',
                left: '0px',
                top: '0px',
                background: '#191D29',
                borderRadius: '15px',
                padding: isMobile ? '20px' : '0',
              }}
            />
            <span
              style={{
                position: isMobile ? 'relative' : 'absolute',
                width: isMobile ? '100%' : '70px',
                height: isMobile ? 'auto' : '33px',
                left: isMobile ? '0' : '25px',
                top: isMobile ? '0' : '22px',
                fontFamily: 'Poppins',
                fontStyle: 'normal',
                fontWeight: 600,
                fontSize: isMobile ? '20px' : '22px',
                lineHeight: isMobile ? '30px' : '33px',
                color: '#FFFFFF',
                marginBottom: isMobile ? '15px' : '0',
              }}
            >
              Profile
            </span>

            
            <div
              style={{
                position: isMobile ? 'relative' : 'absolute',
                width: isMobile ? '80px' : '94px',
                height: isMobile ? '80px' : '94px',
                left: isMobile ? '0' : '25px',
                top: isMobile ? '0' : '69px',
                background: 'url(/assets/images/auth/PFPJAKEP.png)',
                backgroundSize: 'cover',
                borderRadius: '69px',
                marginBottom: isMobile ? '10px' : '0',
              }}
            />

            
            <span
              style={{
                position: isMobile ? 'relative' : 'absolute',
                width: isMobile ? '100%' : '124px',
                height: isMobile ? 'auto' : '33px',
                left: isMobile ? '0' : '139px',
                top: isMobile ? '0' : '92px',
                fontFamily: 'Poppins',
                fontStyle: 'normal',
                fontWeight: 500,
                fontSize: isMobile ? '18px' : '22px',
                lineHeight: isMobile ? '27px' : '33px',
                color: '#FFFFFF',
                marginBottom: isMobile ? '10px' : '0',
              }}
            >
              @justjakep
            </span>

            
            <div
              style={{
                position: isMobile ? 'absolute' : 'absolute',
                width: '20px',
                height: '20px',
                left: isMobile ? 'calc(50% + 30px)' : '99px',
                top: isMobile ? '30px' : '74px',
              }}
            >
              <div
                style={{
                  position: 'absolute',
                  width: '20px',
                  height: '20px',
                  left: '0px',
                  top: '0px',
                  background: '#3E4456',
                  borderRadius: '51px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <svg width="9" height="9" viewBox="0 0 9 9" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M0 7.16676V9H1.83324L7.24009 3.59316L5.40684 1.75991L0 7.16676ZM9 1.83324L7.16676 0L5.92993 1.24172L7.76317 3.07496L9 1.83324Z" fill="#A7ABB6"/>
                </svg>
              </div>
            </div>

            
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'flex-start',
                padding: '0px',
                gap: '15px',
                position: isMobile ? 'relative' : 'absolute',
                width: isMobile ? '100%' : '607px',
                height: isMobile ? 'auto' : '472px',
                left: isMobile ? '0' : '25px',
                top: isMobile ? '0' : '176px',
                marginBottom: isMobile ? '20px' : '0',
              }}
            >
              
              <div
                style={{
                  width: isMobile ? '100%' : '607px',
                  height: isMobile ? 'auto' : '114px',
                  position: 'relative',
                }}
              >
                <span
                  style={{
                    position: isMobile ? 'relative' : 'absolute',
                    width: isMobile ? '100%' : '80px',
                    height: isMobile ? 'auto' : '23px',
                    left: '0px',
                    top: isMobile ? '0' : '5px',
                    fontFamily: 'Poppins',
                    fontStyle: 'normal',
                    fontWeight: 600,
                    fontSize: isMobile ? '14px' : '15px',
                    lineHeight: isMobile ? '21px' : '22px',
                    color: '#FFFFFF',
                    marginBottom: isMobile ? '5px' : '0',
                  }}
                >
                  Username
                </span>
                <div
                  style={{
                    boxSizing: 'border-box',
                    position: isMobile ? 'relative' : 'absolute',
                    width: isMobile ? '100%' : '600px',
                    height: '50px',
                    left: isMobile ? '0' : '4px',
                    top: isMobile ? '0' : '36px',
                    border: '1px solid #333845',
                    borderRadius: '15px',
                    marginBottom: isMobile ? '5px' : '0',
                  }}
                />
                <span
                  style={{
                    position: isMobile ? 'absolute' : 'absolute',
                    width: isMobile ? 'auto' : '43px',
                    height: isMobile ? '100%' : '23px',
                    left: isMobile ? '20px' : '22px',
                    top: isMobile ? '50%' : '49px',
                    transform: isMobile ? 'translateY(-50%)' : 'none',
                    fontFamily: 'Poppins',
                    fontStyle: 'normal',
                    fontWeight: 600,
                    fontSize: isMobile ? '14px' : '15px',
                    lineHeight: isMobile ? '21px' : '22px',
                    color: '#717991',
                  }}
                >
                  jakep
                </span>
                <span
                  style={{
                    position: isMobile ? 'relative' : 'absolute',
                    width: isMobile ? '100%' : '403px',
                    height: isMobile ? 'auto' : '20px',
                    left: '0px',
                    top: isMobile ? '0' : '94px',
                    fontFamily: 'Poppins',
                    fontStyle: 'normal',
                    fontWeight: 500,
                    fontSize: isMobile ? '12px' : '13px',
                    lineHeight: isMobile ? '18px' : '20px',
                    color: '#5B6172',
                    marginBottom: isMobile ? '5px' : '0',
                  }}
                >
                  Access your profile at https://MM2Stake.com/profile/justjakep
                </span>
                <div
                  style={{
                    position: isMobile ? 'relative' : 'absolute',
                    width: isMobile ? '100%' : '73px',
                    height: isMobile ? '40px' : '34px',
                    left: isMobile ? '0' : '523px',
                    top: isMobile ? '0' : '44px',
                    background: '#C77DFF',
                    borderRadius: '15px',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <span
                    style={{
                      fontFamily: 'Poppins',
                      fontStyle: 'normal',
                      fontWeight: 600,
                      fontSize: isMobile ? '14px' : '15px',
                      lineHeight: isMobile ? '21px' : '22px',
                      color: '#FFFFFF',
                    }}
                  >
                    Save
                  </span>
                </div>
              </div>

              
              <div
                style={{
                  width: isMobile ? '100%' : '607px',
                  height: isMobile ? 'auto' : '114px',
                  position: 'relative',
                }}
              >
                <span
                  style={{
                    position: isMobile ? 'relative' : 'absolute',
                    width: isMobile ? '100%' : '43px',
                    height: isMobile ? 'auto' : '23px',
                    left: '0px',
                    top: isMobile ? '0' : '0px',
                    fontFamily: 'Poppins',
                    fontStyle: 'normal',
                    fontWeight: 600,
                    fontSize: isMobile ? '14px' : '15px',
                    lineHeight: isMobile ? '21px' : '22px',
                    color: '#FFFFFF',
                    marginBottom: isMobile ? '5px' : '0',
                  }}
                >
                  Email
                </span>
                <div
                  style={{
                    boxSizing: 'border-box',
                    position: isMobile ? 'relative' : 'absolute',
                    width: isMobile ? '100%' : '600px',
                    height: '50px',
                    left: isMobile ? '0' : '4px',
                    top: isMobile ? '0' : '36px',
                    border: '1px solid #333845',
                    borderRadius: '15px',
                    marginBottom: isMobile ? '5px' : '0',
                  }}
                />
                <span
                  style={{
                    position: isMobile ? 'absolute' : 'absolute',
                    width: isMobile ? 'auto' : '170px',
                    height: isMobile ? '100%' : '24px',
                    left: isMobile ? '20px' : '20px',
                    top: isMobile ? '50%' : '48px',
                    transform: isMobile ? 'translateY(-50%)' : 'none',
                    fontFamily: 'Poppins',
                    fontStyle: 'normal',
                    fontWeight: 500,
                    fontSize: isMobile ? '14px' : '16px',
                    lineHeight: isMobile ? '21px' : '24px',
                    color: '#717991',
                  }}
                >
                  j***p@MM2Stake.com
                </span>
                <span
                  style={{
                    position: isMobile ? 'relative' : 'absolute',
                    width: isMobile ? '100%' : '275px',
                    height: isMobile ? 'auto' : '20px',
                    left: '0px',
                    top: isMobile ? '0' : '98px',
                    fontFamily: 'Poppins',
                    fontStyle: 'normal',
                    fontWeight: 500,
                    fontSize: isMobile ? '12px' : '13px',
                    lineHeight: isMobile ? '18px' : '20px',
                    color: '#5B6172',
                  }}
                >
                  Once your email is set you cant change it.
                </span>
              </div>

              
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'flex-start',
                  padding: '0px',
                  gap: '10px',
                  width: isMobile ? '100%' : '607px',
                  height: isMobile ? 'auto' : '214px',
                }}
              >
                <span
                  style={{
                    width: isMobile ? '100%' : '607px',
                    height: isMobile ? 'auto' : '33px',
                    fontFamily: 'Poppins',
                    fontStyle: 'normal',
                    fontWeight: 600,
                    fontSize: isMobile ? '18px' : '22px',
                    lineHeight: isMobile ? '27px' : '33px',
                    color: '#FFFFFF',
                  }}
                >
                  Change Password
                </span>

                
                <div
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'flex-start',
                    padding: '0px',
                    gap: '6px',
                    width: isMobile ? '100%' : '607px',
                    height: isMobile ? 'auto' : '79px',
                  }}
                >
                  <span
                    style={{
                      width: isMobile ? '100%' : '607px',
                      height: isMobile ? 'auto' : '23px',
                      fontFamily: 'Poppins',
                      fontStyle: 'normal',
                      fontWeight: 600,
                      fontSize: isMobile ? '14px' : '15px',
                      lineHeight: isMobile ? '21px' : '22px',
                      color: '#FFFFFF',
                    }}
                  >
                    New Password
                  </span>
                  <div
                    style={{
                      width: isMobile ? '100%' : '607px',
                      height: '50px',
                      position: 'relative',
                    }}
                  >
                    <div
                      style={{
                        boxSizing: 'border-box',
                        position: 'absolute',
                        width: isMobile ? '100%' : '600px',
                        height: '50px',
                        left: isMobile ? '0' : '4px',
                        top: '0px',
                        border: '1px solid #333845',
                        borderRadius: '15px',
                      }}
                    />
                    <span
                      style={{
                        position: isMobile ? 'absolute' : 'absolute',
                        width: isMobile ? 'auto' : '117px',
                        height: isMobile ? '100%' : '24px',
                        left: isMobile ? '20px' : '20px',
                        top: isMobile ? '50%' : '12px',
                        transform: isMobile ? 'translateY(-50%)' : 'none',
                        fontFamily: 'Poppins',
                        fontStyle: 'normal',
                        fontWeight: 500,
                        fontSize: isMobile ? '14px' : '16px',
                        lineHeight: isMobile ? '21px' : '24px',
                        color: '#555F76',
                      }}
                    >
                      New Password
                    </span>
                  </div>
                </div>

                
                <div
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'flex-start',
                    padding: '0px',
                    gap: '9px',
                    width: isMobile ? '100%' : '607px',
                    height: isMobile ? 'auto' : '82px',
                  }}
                >
                  <span
                    style={{
                      width: isMobile ? '100%' : '607px',
                      height: isMobile ? 'auto' : '23px',
                      fontFamily: 'Poppins',
                      fontStyle: 'normal',
                      fontWeight: 600,
                      fontSize: isMobile ? '14px' : '15px',
                      lineHeight: isMobile ? '21px' : '22px',
                      color: '#FFFFFF',
                    }}
                  >
                    Confirm Password
                  </span>
                  <div
                    style={{
                      width: isMobile ? '100%' : '607px',
                      height: '50px',
                      position: 'relative',
                    }}
                  >
                    <div
                      style={{
                        boxSizing: 'border-box',
                        position: 'absolute',
                        width: isMobile ? '100%' : '600px',
                        height: '50px',
                        left: isMobile ? '0' : '4px',
                        top: '0px',
                        border: '1px solid #333845',
                        borderRadius: '15px',
                      }}
                    />
                    <span
                      style={{
                        position: isMobile ? 'absolute' : 'absolute',
                        width: isMobile ? 'auto' : '148px',
                        height: isMobile ? '100%' : '24px',
                        left: isMobile ? '20px' : '20px',
                        top: isMobile ? '50%' : '12px',
                        transform: isMobile ? 'translateY(-50%)' : 'none',
                        fontFamily: 'Poppins',
                        fontStyle: 'normal',
                        fontWeight: 500,
                        fontSize: isMobile ? '14px' : '16px',
                        lineHeight: isMobile ? '21px' : '24px',
                        color: '#555F76',
                      }}
                    >
                      Confirm Password
                    </span>
                  </div>
                </div>
              </div>
            </div>

            
            <div
              style={{
                position: isMobile ? 'relative' : 'absolute',
                width: isMobile ? '100%' : '607px',
                height: isMobile ? '50px' : '57px',
                left: isMobile ? '0' : '22px',
                top: isMobile ? '0' : '663px',
                background: '#C77DFF',
                borderRadius: '15px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <span
                style={{
                  fontFamily: 'Poppins',
                  fontStyle: 'normal',
                  fontWeight: 600,
                  fontSize: isMobile ? '16px' : '17px',
                  lineHeight: isMobile ? '24px' : '26px',
                  color: '#FFFFFF',
                }}
              >
                Save
              </span>
            </div>
          </div>
          </div>
        )}
      </div>

      <SignUpModal
        isOpen={isSignUpModalOpen}
        onClose={() => setIsSignUpModalOpen(false)}
      />
      <ValidateFairnessModal
        isOpen={isValidateFairnessOpen}
        onClose={() => setIsValidateFairnessOpen(false)}
      />
      <MyListingsModal
        isOpen={isMyListingsOpen}
        onClose={() => setIsMyListingsOpen(false)}
      />
      <CreateGiveawayModal
        isOpen={isCreateGiveawayOpen}
        onClose={() => setIsCreateGiveawayOpen(false)}
      />
      <PrivacyModal
        isOpen={isPrivacyModalOpen}
        onClose={() => setIsPrivacyModalOpen(false)}
      />
      <RulesModal
        isOpen={isRulesModalOpen}
        onClose={() => setIsRulesModalOpen(false)}
      />
      <FaqModal
        isOpen={isFaqModalOpen}
        onClose={() => setIsFaqModalOpen(false)}
      />
    </div>
  );
}

