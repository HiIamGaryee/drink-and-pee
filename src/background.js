// background.js  (dist/background.js)
const ALARM_NAME = "drink-pee-global";

function setAlarm(min, period) {
  chrome.alarms.create(ALARM_NAME, {
    delayInMinutes: min,
    periodInMinutes: period ?? undefined,
  });
  chrome.storage.local.set({ reminderMinutes: min });
}
function stopAlarm() {
  chrome.alarms.clear(ALARM_NAME);
  chrome.storage.local.remove(["reminderMinutes"]);
}

chrome.runtime.onMessage.addListener((req, _s, res) => {
  if (req.type === "start-custom") setAlarm(req.minutes);
  if (req.type === "start-recurring") setAlarm(req.minutes, req.minutes);
  if (req.type === "stop") stopAlarm();
  res();
});

chrome.alarms.onAlarm.addListener((a) => {
  if (a.name !== ALARM_NAME) return;
  chrome.runtime.sendMessage({ type: "hydrate-now" }); // popup & tabs
});
