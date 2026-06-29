import React, { useState, useEffect } from "react";
import { soundManager } from "@/lib/audio";
import { reconnectMqtt, getMqttSettings } from "@/features/iot/services/mqttService";
import { Radio, RefreshCw, Save } from "lucide-react";

export default function MqttSection() {
  const [brokerUrl, setBrokerUrl] = useState("");
  const [baseTopic, setBaseTopic] = useState("");
  const [qos, setQos] = useState<0 | 1 | 2>(1);
  const [isSaved, setIsSaved] = useState(false);

  useEffect(() => {
    const settings = getMqttSettings();
    setBrokerUrl(settings.brokerUrl);
    setBaseTopic(settings.baseTopic);
    setQos(settings.qos);
  }, []);

  const handleSaveAndReconnect = () => {
    soundManager.playClick();
    localStorage.setItem("mqtt_broker_url", brokerUrl);
    localStorage.setItem("mqtt_base_topic", baseTopic);
    localStorage.setItem("mqtt_qos", qos.toString());
    
    reconnectMqtt();
    
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 2000);
  };

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <p className="text-[10px] text-[var(--text-tertiary)] leading-relaxed text-right">
          تنظیمات ارتباطی داشبورد با ماژول‌های ESP را مدیریت کنید. پس از ذخیره، اتصال مجدداً برقرار می‌شود.
        </p>
      </div>

      <div className="space-y-4">
        {/* Broker URL */}
        <div className="space-y-2 text-right">
          <label className="text-xs font-bold text-[var(--text-primary)] px-1">
            آدرس سرور MQTT (Broker URL)
          </label>
          <input
            type="text"
            dir="ltr"
            value={brokerUrl}
            onChange={(e) => setBrokerUrl(e.target.value)}
            className="w-full bg-[var(--card-bg-solid)] border border-[var(--border-color)] text-[var(--text-secondary)] text-xs rounded-xl px-4 py-3 focus:outline-none focus:border-indigo-500/50 transition-colors"
            placeholder="wss://broker.emqx.io:8084/mqtt"
          />
        </div>

        {/* Base Topic */}
        <div className="space-y-2 text-right">
          <label className="text-xs font-bold text-[var(--text-primary)] px-1">
            موضوع پایه (Base Topic)
          </label>
          <input
            type="text"
            dir="ltr"
            value={baseTopic}
            onChange={(e) => setBaseTopic(e.target.value)}
            className="w-full bg-[var(--card-bg-solid)] border border-[var(--border-color)] text-[var(--text-secondary)] text-xs rounded-xl px-4 py-3 focus:outline-none focus:border-indigo-500/50 transition-colors"
            placeholder="KamyarIoT/Achaemenid"
          />
        </div>

        {/* QoS */}
        <div className="space-y-2 text-right pt-2">
          <label className="text-xs font-bold text-[var(--text-primary)] px-1">
            کیفیت سرویس (QoS)
          </label>
          <div className="grid grid-cols-3 gap-2">
            {[0, 1, 2].map((q) => (
              <button
                key={q}
                onClick={() => {
                  soundManager.playClick();
                  setQos(q as 0 | 1 | 2);
                }}
                className={`py-2 px-3 rounded-xl border text-xs font-mono transition-all duration-300 ${
                  qos === q
                    ? "bg-indigo-500/20 border-indigo-500/50 text-indigo-400"
                    : "bg-[var(--card-bg-solid)] border-[var(--border-color)] text-[var(--text-secondary)] hover:bg-[var(--card-hover-bg)]"
                }`}
              >
                QoS {q}
              </button>
            ))}
          </div>
          <p className="text-[9px] text-[var(--text-muted)] pt-1 px-1">
            {qos === 0 && "ارسال حداکثر یکبار. بدون تضمین تحویل."}
            {qos === 1 && "ارسال حداقل یکبار. تضمین تحویل با احتمال تکرار."}
            {qos === 2 && "ارسال دقیقا یکبار. امن‌ترین و کندترین حالت."}
          </p>
        </div>
      </div>

      <button
        onClick={handleSaveAndReconnect}
        className={`w-full py-3.5 px-4 rounded-xl flex items-center justify-center gap-2 transition-all duration-300 text-sm font-bold ${
          isSaved
            ? "bg-emerald-500/20 text-emerald-500 border border-emerald-500/30"
            : "bg-indigo-600 hover:bg-indigo-700 text-white shadow-lg shadow-indigo-500/20"
        }`}
      >
        {isSaved ? (
          <>
            <Save className="w-4 h-4" />
            ذخیره شد
          </>
        ) : (
          <>
            <RefreshCw className="w-4 h-4" />
            ذخیره و اتصال مجدد
          </>
        )}
      </button>
    </div>
  );
}
