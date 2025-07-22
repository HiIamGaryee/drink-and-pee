/// <reference types="chrome" />

chrome.runtime.onMessage.addListener(({ type, minutes }) => {
  chrome.alarms.clearAll();

  if (type === 'start-custom' && typeof minutes === 'number' && minutes > 0) {
    chrome.alarms.create('custom', { delayInMinutes: minutes });
  }
  if (type === 'start-recurring' && typeof minutes === 'number' && minutes > 0) {
    chrome.alarms.create('custom', { delayInMinutes: minutes, periodInMinutes: minutes });
  }
});

chrome.alarms.onAlarm.addListener(() => {
  chrome.tabs.query({ active: true, currentWindow: true }, ([tab]) => {
    if (tab?.id) {
      chrome.scripting.executeScript({
        target: { tabId: tab.id },
        files: ['content.ts'],
      });
    }
  });
});
