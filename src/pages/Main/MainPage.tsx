import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../../context/UserContext';
import { useCut } from '../../context/CutContext';
import { calculateDday, getDdayStatus, formatDate, toDateString } from '../../utils/date';
import BannerAd from '../../components/Ad/BannerAd';
import styles from './MainPage.module.css';

export default function MainPage() {
  const navigate = useNavigate();
  const { profile } = useUser();
  const { lastCutDate, addRecord, averageCycle, records } = useCut();
  const [showDateModal, setShowDateModal] = useState(false);
  const [selectedDate, setSelectedDate] = useState(toDateString(new Date()));

  if (!profile || !lastCutDate) return null;

  const dday = calculateDday(lastCutDate, profile.cutCycleDays);
  const status = getDdayStatus(dday);

  const characterMap = {
    short: '🧑',
    medium: '🧑‍🦱',
    long: '👩‍🦱',
  };

  const handleTodayCut = () => {
    const today = toDateString(new Date());
    addRecord(today);
  };

  const handleDateCut = () => {
    addRecord(selectedDate);
    setShowDateModal(false);
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div>
          <div className={styles.greeting}>{profile.nickname}님</div>
          <div className={styles.greetingSub}>오늘도 좋은 하루 되세요</div>
        </div>
      </div>

      <div className={styles.ddayCard}>
        <div className={styles.ddayNumber} style={{ color: status.color }}>
          {status.label}
        </div>
        <div className={styles.ddayMessage}>{status.message}</div>
        <div className={styles.character}>{characterMap[profile.hairLength]}</div>
      </div>

      {dday <= 0 && (
        <button className={styles.salonCta} onClick={() => navigate('/salon')}>
          &#128136; 주변 미용실 찾기
        </button>
      )}

      <button className={styles.cutButton} onClick={handleTodayCut}>
        &#9986; 오늘 커트했어요
      </button>

      <button className={styles.otherDateBtn} onClick={() => setShowDateModal(true)}>
        다른 날짜에 했어요
      </button>

      <div className={styles.infoCard}>
        <span className={styles.infoIcon}>&#128197;</span>
        <div>
          <div className={styles.infoText}>마지막 커트</div>
          <div className={styles.infoValue}>{formatDate(lastCutDate)}</div>
        </div>
      </div>

      {averageCycle && (
        <div className={styles.infoCard}>
          <span className={styles.infoIcon}>&#128200;</span>
          <div>
            <div className={styles.infoText}>평균 커트 주기</div>
            <div className={styles.infoValue}>{averageCycle}일 (총 {records.length}회)</div>
          </div>
        </div>
      )}

      <BannerAd />

      {showDateModal && (
        <div className={styles.modal} onClick={() => setShowDateModal(false)}>
          <div className={styles.modalContent} onClick={e => e.stopPropagation()}>
            <h3 className={styles.modalTitle}>커트한 날짜 선택</h3>
            <input
              className={styles.modalDateInput}
              type="date"
              value={selectedDate}
              onChange={e => setSelectedDate(e.target.value)}
              max={toDateString(new Date())}
            />
            <div className={styles.modalActions}>
              <button className={styles.modalCancel} onClick={() => setShowDateModal(false)}>
                취소
              </button>
              <button className={styles.modalConfirm} onClick={handleDateCut}>
                기록하기
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
