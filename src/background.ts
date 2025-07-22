/// <reference types="chrome" />

chrome.runtime.onMessage.addListener(({ type, minutes }: { type: string; minutes: number }) => {
  chrome.alarms.clearAll();

  if (type === 'start-custom' && typeof minutes === 'number' && minutes > 0) {
    chrome.alarms.create('custom', { delayInMinutes: minutes });
  }
  if (type === 'start-recurring' && typeof minutes === 'number' && minutes > 0) {
    chrome.alarms.create('custom', { delayInMinutes: minutes, periodInMinutes: minutes });
  }
});

chrome.alarms.onAlarm.addListener(() => {
  // Send a message to all extension views/popups to show the banner
  chrome.runtime.sendMessage({ type: 'show-banner' });
});
