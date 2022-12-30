import AnalyticsHelper from './AnalyticsHelper';
import DashboardAudioNotificationHelper from './AudioAlerts/DashboardAudioNotificationHelper';

export const CHATWOOT_SET_USER = 'CHATWOOT_SET_USER';
export const CHATWOOT_RESET = 'CHATWOOT_RESET';

export const ANALYTICS_IDENTITY = 'ANALYTICS_IDENTITY';
export const ANALYTICS_RESET = 'ANALYTICS_RESET';

export const initializeAnalyticsEvents = () => {
  window.bus.$on(ANALYTICS_IDENTITY, ({ user }) => {
    AnalyticsHelper.identify(user);
  });
  window.bus.$on(ANALYTICS_RESET, () => {});
};

const initializeAudioAlerts = user => {
  // InitializeAudioNotifications
  const { ui_settings: uiSettings } = user || {};
  const {
    always_play_audio_alert: alwaysPlayAudioAlert,
    enable_audio_alerts: audioAlertType,
    notification_tone: audioAlertTone,
  } = uiSettings;

  DashboardAudioNotificationHelper.setInstanceValues({
    currentUserId: user.id,
    audioAlertType: audioAlertType || 'none',
    audioAlertTone: audioAlertTone || 'ding',
    alwaysPlayAudioAlert: alwaysPlayAudioAlert || false,
  });
};

export const initializeChatwootEvents = () => {
  window.bus.$on(CHATWOOT_RESET, () => {
    if (window.$chatwoot) {
      window.$chatwoot.reset();
    }
  });
  window.bus.$on(CHATWOOT_SET_USER, ({ user }) => {
    if (window.$chatwoot) {
      window.$chatwoot.setUser(user.email, {
        avatar_url: user.avatar_url,
        email: user.email,
        identifier_hash: user.hmac_identifier,
        name: user.name,
      });
      window.$chatwoot.setCustomAttributes({
        signedUpAt: user.created_at,
        cloudCustomer: 'true',
      });
    }

    initializeAudioAlerts(user);
  });
};