import React, { useState, useEffect } from "react";
import { soundManager } from "@/lib/audio";
import { reconnectMqtt, getMqttSettings } from "@/features/iot/services/mqttService";
import { Radio, RefreshCw, Save } from "lucide-react";
import { fetchConfigFromCloudflare, saveConfigToCloudflare } from "@/features/iot/services/cloudflare/api";
import { DEFAULT_ESP_CONFIG } from "@/features/iot/services/esp32Config";
import { useIoTStore } from "@/features/iot/hooks/useIoTStore";

export default function MqttSection() {
  const [brokerWsUrl, setBrokerWsUrl] = useState("");
  const [brokerHost, setBrokerHost] = useState("");
  const [brokerPort, setBrokerPort] = useState(1883);
  const [baseTopic, setBaseTopic] = useState("");
  const [qos, setQos] = useState<0 | 1 | 2>(1);
  const [isSaved, setIsSaved] = useState(false);
  const setMqttConfig = useIoTStore((state) => state.setMqttConfig);
  const showToast = useIoTStore((state) => state.showToast);

  useEffect(() => {
    // Load initially from local
    const settings = getMqttSettings();
    setBrokerWsUrl(settings.brokerUrl);
    setBrokerHost("broker.emqx.io");
    setBrokerPort(1883);
    setBaseTopic(settings.baseTopic);
    setQos(settings.qos);

    // Fetch from Cloudflare to sync
    fetchConfigFromCloudflare().then(config => {
      if (config && config.mqtt) {
        setBrokerWsUrl(config.mqtt.broker_ws_url);
        setBrokerHost(config.mqtt.broker_host);
        setBrokerPort(config.mqtt.broker_port);
        setBaseTopic(config.mqtt.base_topic);
        setQos(config.mqtt.qos);
      }
    });
  }, []);

  const handleSaveAndReconnect = async () => {
    soundManager.playClick();
    
    // Save locally for dashboard fast reconnect
    localStorage.setItem("mqtt_broker_url", brokerWsUrl);
    localStorage.setItem("mqtt_base_topic", baseTopic);
    localStorage.setItem("mqtt_qos", qos.toString());

    const newMqttConfig = {
      broker_ws_url: brokerWsUrl,
      broker_host: brokerHost,
      broker_port: brokerPort,
      base_topic: baseTopic,
      qos: qos
    };
    setMqttConfig(newMqttConfig);
    
    // Save to Cloudflare for Worker & ESP32
    try {
      const config = await fetchConfigFromCloudflare() || DEFAULT_ESP_CONFIG;
      config.mqtt = newMqttConfig;
      const res = await saveConfigToCloudflare(config);
      if (res.success) {
        showToast(res.message, "success");
        setIsSaved(true);
        setTimeout(() => setIsSaved(false), 2000);
      } else {
        showToast(res.message, "error");
      }
    } catch (e) {
      console.error("Failed to save MQTT settings to cloud", e);
      showToast("خطا در ارتباط با سرور کلودفلر", "error");
    }

    reconnectMqtt();
  };

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <p className="text-[10px] text-[var(--text-tertiary)] leading-relaxed text-right">
          تنظیمات ارتباطی داشبورد با ماژول‌های ESP را مدیریت کنید. پس از ذخیره، اتصال مجدداً برقرار می‌شود.
        </p>
      </div>

      <div className="space-y-4">
        {/* Broker WebSocket URL (Dashboard) */}
        <div className="space-y-2 text-right">
          <label className="text-xs font-bold text-[var(--text-primary)] px-1">
            آدرس سرور داشبورد (WebSocket URL)
          </label>
          <input
            type="text"
            dir="ltr"
            value={brokerWsUrl}
            onChange={(e) => setBrokerWsUrl(e.target.value)}
            className="w-full bg-[var(--card-bg-solid)] border border-[var(--border-color)] text-[var(--text-secondary)] text-xs rounded-xl px-4 py-3 focus:outline-none focus:border-[var(--accent3)] focus:ring-1 focus:ring-[var(--accent3)] transition-all"
            placeholder="wss://broker.emqx.io:8084/mqtt"
          />
        </div>

        {/* Broker TCP Host & Port (ESP32) */}
        <div className="grid grid-cols-3 gap-2">
          <div className="col-span-2 space-y-2 text-right">
            <label className="text-xs font-bold text-[var(--text-primary)] px-1">
              آدرس سرور سخت‌افزار (TCP Host)
            </label>
            <input
              type="text"
              dir="ltr"
              value={brokerHost}
              onChange={(e) => setBrokerHost(e.target.value)}
              className="w-full bg-[var(--card-bg-solid)] border border-[var(--border-color)] text-[var(--text-secondary)] text-xs rounded-xl px-4 py-3 focus:outline-none focus:border-[var(--accent3)] focus:ring-1 focus:ring-[var(--accent3)] transition-all"
              placeholder="broker.emqx.io"
            />
          </div>
          <div className="col-span-1 space-y-2 text-right">
            <label className="text-xs font-bold text-[var(--text-primary)] px-1">
              پورت (Port)
            </label>
            <input
              type="number"
              dir="ltr"
              value={brokerPort}
              onChange={(e) => setBrokerPort(parseInt(e.target.value) || 1883)}
              className="w-full bg-[var(--card-bg-solid)] border border-[var(--border-color)] text-[var(--text-secondary)] text-xs rounded-xl px-4 py-3 focus:outline-none focus:border-[var(--accent3)] focus:ring-1 focus:ring-[var(--accent3)] transition-all"
              placeholder="1883"
            />
          </div>
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
            className="w-full bg-[var(--card-bg-solid)] border border-[var(--border-color)] text-[var(--text-secondary)] text-xs rounded-xl px-4 py-3 focus:outline-none focus:border-[var(--accent3)] focus:ring-1 focus:ring-[var(--accent3)] transition-all"
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
                    ? "bg-[var(--accent3-transparent)] border-[var(--accent3)] text-[var(--accent3)]"
                    : "bg-[var(--card-bg-solid)] border-[var(--border-color)] text-[var(--text-secondary)] hover:bg-[var(--card-hover-bg)] hover:border-[var(--accent4)]"
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
            ? "bg-[var(--accent4-transparent)] text-[var(--accent4)] border border-[var(--accent4)]"
            : "bg-[var(--accent3)] hover:bg-[var(--accent3-dark)] text-white shadow-lg shadow-[var(--accent3-transparent)]"
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
