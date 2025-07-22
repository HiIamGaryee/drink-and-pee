/// <reference types="chrome" />
import React, { useCallback, useEffect, useState } from "react";

const ALARM_NAME = "drink-pee-global";

type ButtonProps = {
  label: string;
  onClick: () => void;
  className?: string;
  style?: React.CSSProperties;
};
const Button = ({ label, onClick, className, style }: ButtonProps) => (
  <button
    onClick={onClick}
    className={`px-3 py-1 rounded themed-btn ${className || ""}`}
    style={style}
  >
    {label}
  </button>
);

type ReminderPageProps = {
  primaryColor: string;
  isGradient?: boolean;
};

const ReminderPage: React.FC<ReminderPageProps> = ({
  primaryColor,
  isGradient,
}) => {
  const [minutes, setMinutes] = useState(30);
  const [remaining, setRemaining] = useState<number | null>(null);
  const [notification, setNotification] = useState<string | null>(null);
  const [showBanner, setShowBanner] = useState(false);

  /* hydrated on load */
  useEffect(() => {
    chrome.storage.local.get(["reminderMinutes"], (r) => {
      if (typeof r.reminderMinutes === "number") setMinutes(r.reminderMinutes);
    });
    chrome.alarms.get(ALARM_NAME, (a) => {
      if (a && a.scheduledTime) {
        const m = Math.ceil((a.scheduledTime - Date.now()) / 60000);
        setRemaining(m);
        // If alarm is overdue, show banner and clear alarm
        if (a.scheduledTime < Date.now()) {
          console.log(
            "[ReminderPage] Alarm overdue on popup open, showing banner and clearing alarm."
          );
          setShowBanner(true);
          setTimeout(() => setShowBanner(false), 5000);
          chrome.alarms.clear(ALARM_NAME, () => {
            console.log("[ReminderPage] Alarm cleared after overdue banner.");
            chrome.storage.local.remove(["reminderMinutes"], () => {
              console.log(
                "[ReminderPage] reminderMinutes removed from storage after overdue banner."
              );
            });
          });
          setRemaining(null);
        }
      } else {
        console.log("[ReminderPage] No alarm found on popup open.");
      }
    });

    const msgListener = (m: { type?: string }) => {
      if (m?.type === "hydrate-now") {
        console.log(
          "[ReminderPage] Received hydrate-now message, showing banner and clearing alarm."
        );
        setShowBanner(true);
        setTimeout(() => setShowBanner(false), 5000);
        chrome.alarms.clear(ALARM_NAME, () => {
          console.log("[ReminderPage] Alarm cleared after hydrate-now.");
          chrome.storage.local.remove(["reminderMinutes"], () => {
            console.log(
              "[ReminderPage] reminderMinutes removed from storage after hydrate-now."
            );
          });
        });
        setRemaining(null);
      }
    };
    chrome.runtime.onMessage.addListener(msgListener);
    return () => chrome.runtime.onMessage.removeListener(msgListener);
  }, []);

  /* poll */
  useEffect(() => {
    const id = setInterval(() => {
      chrome.alarms.get(ALARM_NAME, (a) => {
        if (!a) return setRemaining(null);
        const m = Math.ceil((a.scheduledTime - Date.now()) / 60000);
        setRemaining(Math.max(0, m));
      });
    }, 10_000);
    return () => clearInterval(id);
  }, []);

  /* helpers */
  const toast = (txt: string) => {
    setNotification(txt);
    setTimeout(() => setNotification(null), 1500);
  };

  const sendOnce = useCallback(
    () =>
      chrome.runtime.sendMessage({ type: "start-custom", minutes }, () =>
        toast("Set once!")
      ),
    [minutes]
  );

  const sendRecurring = useCallback(
    () =>
      chrome.runtime.sendMessage({ type: "start-recurring", minutes }, () =>
        toast("Set loop!")
      ),
    [minutes]
  );

  const stopReminder = useCallback(
    () =>
      chrome.runtime.sendMessage({ type: "stop" }, () => {
        setRemaining(null);
        toast("Stopped");
      }),
    []
  );

  /* styles */
  const txtStyle = isGradient
    ? {
        backgroundImage: primaryColor,
        WebkitBackgroundClip: "text" as const,
        WebkitTextFillColor: "transparent" as const,
      }
    : { color: primaryColor };

  const btnStyle = isGradient
    ? { backgroundImage: primaryColor, color: "#fff", border: "none" }
    : { background: primaryColor, color: "#fff", border: "none" };

  return (
    <div className="relative">
      {remaining !== null && (
        <span
          className="absolute top-0 right-0 font-bold text-xs"
          style={txtStyle}
        >
          (running)
        </span>
      )}

      <div className="mb-4">
        <input
          type="number"
          min={1}
          value={minutes}
          onChange={(e) => setMinutes(Math.max(1, Number(e.target.value)))}
          className="border rounded px-2 py-1 mr-2"
          style={txtStyle}
        />

        <Button
          label={`Once in ${minutes} m`}
          onClick={sendOnce}
          style={btnStyle}
        />
        <Button
          label={`Every ${minutes} m`}
          onClick={sendRecurring}
          className="ml-2"
          style={btnStyle}
        />
        <Button
          label="Stop"
          onClick={stopReminder}
          className="ml-2"
          style={{ background: "#aaa", color: "#fff", border: "none" }}
        />
      </div>

      {remaining !== null && (
        <div className="mt-2 text-sm" style={txtStyle}>
          Next reminder in: {remaining} min
        </div>
      )}

      {notification && (
        <div className="fixed bottom-4 left-1/2 -translate-x-1/2 bg-black text-white px-4 py-2 rounded">
          {notification}
        </div>
      )}

      {showBanner && (
        <div
          className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 bg-white border-4 rounded shadow-lg flex flex-col items-center justify-center"
          style={{
            borderColor: isGradient ? undefined : primaryColor,
            width: 300,
            height: 300,
          }}
        >
          <img
            src={chrome.runtime.getURL("banner.jpg")}
            alt="Banner"
            style={{ width: 250, height: 250, objectFit: "cover" }}
          />
          <span className="mt-2 font-bold" style={txtStyle}>
            Time to drink!
          </span>
        </div>
      )}
    </div>
  );
};

export default ReminderPage;
