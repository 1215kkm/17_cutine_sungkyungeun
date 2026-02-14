import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import BannerAd from '../../components/Ad/BannerAd';
import type { Salon } from '../../types';
import styles from './SalonPage.module.css';

// 데모 데이터 (실제 배포 시 카카오 로컬 API + Firestore 제휴 데이터로 교체)
const demoSalons: Salon[] = [
  {
    id: 's1',
    name: '블루클럽 강남점',
    address: '서울 강남구 역삼동 123-45',
    phone: '02-1234-5678',
    lat: 37.4979,
    lng: 127.0276,
    distance: 350,
    rating: 4.5,
    bookingUrl: '#',
    isPartner: true,
  },
  {
    id: 's2',
    name: '리안헤어 선릉점',
    address: '서울 강남구 선릉로 67길 12',
    phone: '02-9876-5432',
    lat: 37.5045,
    lng: 127.0489,
    distance: 820,
    rating: 4.2,
    isPartner: false,
  },
  {
    id: 's3',
    name: '준오헤어 역삼점',
    address: '서울 강남구 테헤란로 152',
    phone: '02-5555-1234',
    lat: 37.5012,
    lng: 127.0396,
    distance: 1200,
    rating: 4.7,
    bookingUrl: '#',
    isPartner: true,
  },
  {
    id: 's4',
    name: '이철헤어커커 삼성점',
    address: '서울 강남구 삼성로 321',
    phone: '02-3333-4444',
    lat: 37.5089,
    lng: 127.0620,
    distance: 1500,
    rating: 4.0,
    isPartner: false,
  },
];

export default function SalonPage() {
  const navigate = useNavigate();
  const [salons] = useState<Salon[]>(
    // 제휴 미용실 우선 정렬
    [...demoSalons].sort((a, b) => {
      if (a.isPartner && !b.isPartner) return -1;
      if (!a.isPartner && b.isPartner) return 1;
      return (a.distance || 0) - (b.distance || 0);
    })
  );

  const handleCall = (phone: string) => {
    window.open(`tel:${phone}`, '_self');
  };

  const handleBook = (salon: Salon) => {
    // 제휴 트래킹
    const clicks = JSON.parse(localStorage.getItem('affiliate_clicks') || '[]');
    clicks.push({
      type: 'salon',
      itemId: salon.id,
      timestamp: new Date().toISOString(),
    });
    localStorage.setItem('affiliate_clicks', JSON.stringify(clicks));

    if (salon.bookingUrl && salon.bookingUrl !== '#') {
      window.open(salon.bookingUrl, '_blank', 'noopener');
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.pageTitle}>&#128136; 주변 미용실</h1>
      </div>

      <div className={styles.partnerBanner} onClick={() => navigate('/salon/partner')}>
        <span className={styles.partnerBannerText}>
          미용실 사장님이신가요? 제휴 신청하기
        </span>
        <span className={styles.partnerBannerArrow}>&rarr;</span>
      </div>

      <div className={styles.mapPlaceholder}>
        {/* 실제 배포 시 카카오맵 SDK로 교체 */}
        &#128506; 카카오맵 영역 (API 키 설정 필요)
      </div>

      <BannerAd />

      <div className={styles.salonList}>
        {salons.map(salon => (
          <div key={salon.id} className={styles.salonCard}>
            {salon.isPartner && <span className={styles.partnerBadge}>제휴</span>}
            <div className={styles.salonName}>{salon.name}</div>
            <div className={styles.salonAddress}>{salon.address}</div>
            <div className={styles.salonMeta}>
              {salon.distance && <span>&#128205; {salon.distance >= 1000 ? `${(salon.distance / 1000).toFixed(1)}km` : `${salon.distance}m`}</span>}
              {salon.rating && <span>&#11088; {salon.rating}</span>}
            </div>
            <div className={styles.salonActions}>
              <button className={styles.btnCall} onClick={() => handleCall(salon.phone)}>
                &#128222; 전화
              </button>
              {salon.bookingUrl && (
                <button className={styles.btnBook} onClick={() => handleBook(salon)}>
                  예약하기
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
