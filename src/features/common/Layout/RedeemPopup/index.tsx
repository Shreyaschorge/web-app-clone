import React, { useState } from 'react';
import CloseIcon from '../../../../../public/assets/images/icons/CloseIcon';
import styles from './RedeemPopup.module.scss';
import { useTranslation } from 'next-i18next';
import tenantConfig from '../../../../../tenant.config';
import { useUserProps } from '../UserPropsContext';

export default function RedeemPopup() {
  const { t, ready } = useTranslation(['leaderboard']);

  // Can be handled through context
  const config = tenantConfig();

  const [showRedeemPopup, setShowRedeemPopup] = useState(false);

  const { user, contextLoaded, loginWithRedirect } = useUserProps();

  const sendUserToLogin = () => {
    loginWithRedirect({
      redirectUri: `${window.location.origin}/login`,
      ui_locales: localStorage.getItem('language') || 'en',
    });
  };

  React.useEffect(() => {
    if (contextLoaded && user) {
      setShowRedeemPopup(false);
    }
  }, [contextLoaded && user]);

  React.useEffect(() => {
    if (config.showRedeemHint) {
      const prev = localStorage.getItem('redeemPopup');
      if (!prev) {
        setShowRedeemPopup(true);
      } else {
        setShowRedeemPopup(prev === 'true');
      }
    }
  }, []);

  React.useEffect(() => {
    localStorage.setItem('redeemPopup', showRedeemPopup);
  }, [showRedeemPopup]);

  return ready && showRedeemPopup ? (
    <div className={styles.cookieContainer}>
      <button
        id={'redeemCloseButton'}
        className={styles.closeButton}
        onClick={() => setShowRedeemPopup(false)}
      >
        <CloseIcon color={styles.primaryColor} />
      </button>
      <div className={styles.cookieContent}>
        {t('common:redeemPopup')}{' '}
        <a onClick={sendUserToLogin}>{t('common:login')}</a>
      </div>
    </div>
  ) : null;
}
