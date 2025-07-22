import React, { useCallback, useState, useEffect } from "react";

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

  // On mount, read last set minutes from storage and alarm
  useEffect(() => {
    chrome.storage.local.get(["reminderMinutes"], (result) => {
      if (typeof result.reminderMinutes === "number") {
        setMinutes(result.reminderMinutes);
      }
    });
    chrome.alarms.get("custom", (alarm) => {
      if (alarm && alarm.scheduledTime) {
        const now = Date.now();
        setRemaining(Math.ceil((alarm.scheduledTime - now) / 60000));
      } else {
        setRemaining(null);
      }
    });
    // Listen for show-banner message from background
    const messageListener = (msg: { type?: string }) => {
      if (msg && msg.type === "show-banner") {
        setShowBanner(true);
        setTimeout(() => setShowBanner(false), 5000);
      }
    };
    chrome.runtime.onMessage.addListener(messageListener);
    return () => {
      chrome.runtime.onMessage.removeListener(messageListener);
    };
  }, []);

  // Poll remaining time every 10s
  useEffect(() => {
    const interval = setInterval(() => {
      chrome.alarms.get("custom", (alarm) => {
        if (alarm && alarm.scheduledTime) {
          const now = Date.now();
          setRemaining(Math.ceil((alarm.scheduledTime - now) / 60000));
        } else {
          setRemaining(null);
        }
      });
    }, 10000);
    return () => clearInterval(interval);
  }, []);

  // Add stop/cancel logic
  const stopReminder = useCallback(() => {
    chrome.alarms.clearAll(() => {
      setRemaining(null);
      setNotification("Reminder stopped");
      setTimeout(() => setNotification(null), 1500);
    });
  }, []);

  // Update sendOnce and sendRecurring to show notification
  const sendOnce = useCallback((minutes: number) => {
    chrome.runtime.sendMessage({ type: "start-custom", minutes }, () => {
      setNotification("Set reminder success");
      setTimeout(() => setNotification(null), 1500);
      setShowBanner(false);
    });
  }, []);
  const sendRecurring = useCallback((minutes: number) => {
    chrome.runtime.sendMessage({ type: "start-recurring", minutes }, () => {
      setNotification("Set reminder success");
      setTimeout(() => setNotification(null), 1500);
      setShowBanner(false);
    });
  }, []);

  return (
    <div className="relative">
      {/* Running label */}
      {remaining !== null && (
        <span
          style={{
            position: "absolute",
            top: 0,
            right: 0,
            color: isGradient ? undefined : primaryColor,
            fontWeight: 700,
            background: isGradient ? primaryColor : undefined,
            WebkitBackgroundClip: isGradient ? "text" : undefined,
            WebkitTextFillColor: isGradient ? "transparent" : undefined,
          }}
        >
          (running)
        </span>
      )}
      <div className="mb-4">
        <input
          type="number"
          min={1}
          value={minutes}
          onChange={(e) => setMinutes(Number(e.target.value))}
          className="border rounded px-2 py-1 mr-2"
          style={
            isGradient
              ? { borderImage: primaryColor + " 1" }
              : { borderColor: primaryColor }
          }
        />
        <Button
          label={`Remind me once in ${minutes} min`}
          onClick={() => sendOnce(minutes)}
          style={
            isGradient
              ? { backgroundImage: primaryColor, color: "#fff", border: "none" }
              : { background: primaryColor, color: "#fff", border: "none" }
          }
        />
        <Button
          label={`Remind me every ${minutes} min (recurring)`}
          onClick={() => sendRecurring(minutes)}
          style={
            isGradient
              ? {
                  backgroundImage: primaryColor,
                  color: "#fff",
                  border: "none",
                  marginLeft: 8,
                }
              : {
                  background: primaryColor,
                  color: "#fff",
                  border: "none",
                  marginLeft: 8,
                }
          }
        />
        <Button
          label="Stop"
          onClick={stopReminder}
          style={{ background: "#aaa", color: "#fff", marginLeft: 8 }}
        />
      </div>
      {remaining !== null && (
        <div
          className="mt-2 text-sm"
          style={
            isGradient
              ? {
                  backgroundImage: primaryColor,
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                }
              : { color: primaryColor }
          }
        >
          Next reminder in: {remaining} min
        </div>
      )}
      {notification && (
        <div className="fixed bottom-4 left-1/2 -translate-x-1/2 bg-black text-white px-4 py-2 rounded animate-fade-in">
          {notification}
        </div>
      )}
      {/* Banner only pops up when timer triggers */}
      {showBanner && (
        <div
          className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 bg-white border-4 rounded shadow-lg flex flex-col items-center justify-center"
          style={
            isGradient
              ? { borderImage: primaryColor + " 1", width: 300, height: 300 }
              : { borderColor: primaryColor, width: 300, height: 300 }
          }
        >
          <img
            src={chrome.runtime.getURL("banner.jpg")}
            alt="Banner"
            style={{ width: 250, height: 250, objectFit: "cover" }}
          />
          <span
            className="mt-2 font-bold"
            style={
              isGradient
                ? {
                    backgroundImage: primaryColor,
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                  }
                : { color: primaryColor }
            }
          >
            Time to drink!
          </span>
        </div>
      )}
    </div>
  );
};

export default ReminderPage;
