"use client";

import React, { useState } from "react";
import { Check, Copy, Cpu, BookOpen, Terminal } from "lucide-react";
import { CLIP_PEDESTAL, BUTTON_CLIP } from "@/lib/presets";

interface ESP32CodeExporterProps {
  appUrl: string;
}

export const ESP32CodeExporter: React.FC<ESP32CodeExporterProps> = ({ appUrl }) => {
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState<"code" | "schema" | "guide">("code");

  const cleanUrl = appUrl ? appUrl.replace(/\/$/, "") : "https://your-dashboard-url.com";

  const cppCode = `/*
  داشبورد اینترنت اشیا هخامنشی (Achaemenid IoT Dashboard)
  کد بیس ESP32 جهت اتصال به پنل مدیریت هوشمند و تبادل داده
  گروه مهندسی و توسعه سخت‌افزار هخامنشیان
*/

#include <WiFi.h>
#include <HTTPClient.h>
#include <ArduinoJson.h>

// تنظیمات شبکه وای‌فای
const char* ssid = "YOUR_WIFI_SSID";
const char* password = "YOUR_WIFI_PASSWORD";

// آدرس سرور مرکزی داشبورد هخامنشی
const char* serverUrl = "${cleanUrl}/api/iot";

// تعریف پین‌های آردوینو / ESP32
const int PIN_LED = 2;       // ال‌ام‌دی ریل یا رله شماره ۱ (خاموش و روشن)
const int PIN_PWM_LED = 4;   // خروجی PWM کنترل شدت نور
const int PIN_RELAY = 5;     // کنترل رله صنعتی

// سنسورها (شبیه‌سازی یا متصل به پایه‌ها)
const int ATAR_TEMP_PIN = 34;      // سنسور حرارت آذر (مثلا DHT11 یا LM35)
const int ANAHITA_WATER_PIN = 35;  // سنسور رطوبت آناهیتا (خاک یا سطح آب)
const int MITHRA_LIGHT_PIN = 32;   // فتورزیستور مهر (LDR)

unsigned long lastMillis = 0;
const long interval = 5000; // ارسال داده‌ها هر ۵ ثانیه یکبار

void setup() {
  Serial.begin(115200);
  
  // تنظیم پین‌ها به عنوان خروجی
  pinMode(PIN_LED, OUTPUT);
  pinMode(PIN_RELAY, OUTPUT);
  
  // راه‌اندازی کانال PWM برای شدت نور ال‌دی
  ledcAttach(PIN_PWM_LED, 5000, 8); // رزولوشن ۸ بیتی (0-255)، فرکانس ۵ کیلوهرتز

  // اتصال به شبکه بی‌سیم
  WiFi.begin(ssid, password);
  Serial.print("Connecting to WiFi");
  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  }
  Serial.println("\\nWiFi connected!");
  Serial.print("IP Address: ");
  Serial.println(WiFi.localIP());
}

void loop() {
  // هر ۵ ثانیه اطلاعات را ارسال و فرامین جدید را دریافت کن
  if (millis() - lastMillis >= interval) {
    lastMillis = millis();
    
    if (WiFi.status() == WL_CONNECTED) {
      // شبیه‌سازی یا خوانش سنسورهای واقعی
      float atarTemp = readAtarTemperature();
      float anahitaMoisture = readAnahitaMoisture();
      float vayuAir = readVayuAirQuality();
      float mithraLight = readMithraLight();

      syncWithPersianDashboard(atarTemp, anahitaMoisture, vayuAir, mithraLight);
    } else {
      Serial.println("WiFi Disconnected. Reconnecting...");
      WiFi.begin(ssid, password);
    }
  }
}

// توابع نمونه خواندن سنسورها (برای تست به صورت شبیه‌سازی شده مقادیر ارسال میگردد)
float readAtarTemperature() {
  // خواندن از پایه آنالوگ یا سنسور دیجیتال
  // return analogRead(ATAR_TEMP_PIN) * (3.3 / 4095.0) * 100.0;
  return 24.0 + random(-20, 20) / 10.0; // پیش‌فرض تست
}

float readAnahitaMoisture() {
  // return map(analogRead(ANAHITA_WATER_PIN), 0, 4095, 0, 100);
  return 45 + random(-5, 5); // پیش‌فرض تست
}

float readVayuAirQuality() {
  return 90 + random(-10, 20); // پیش‌فرض تست
}

float readMithraLight() {
  // return analogRead(MITHRA_LIGHT_PIN);
  return 600 + random(-50, 50); // پیش‌فرض تست
}

// تابع اصلی سنکرون‌سازی و ارسال فرانت و دریافت فرامین
void syncWithPersianDashboard(float temp, float moisture, float air, float light) {
  HTTPClient http;
  http.begin(serverUrl);
  http.addHeader("Content-Type", "application/json");

  // ساخت سند JSON
  JsonDocument doc;
  doc["source"] = "esp32";
  
  JsonObject sensors = doc.createNestedObject("sensors");
  sensors["atarTemp"] = temp;
  sensors["anahitaMoisture"] = moisture;
  sensors["vayuAirQuality"] = air;
  sensors["mithraLight"] = light;

  String requestBody;
  serializeJson(doc, requestBody);

  Serial.println("Sending state to Achaemenid Dashboard...");
  int httpResponseCode = http.POST(requestBody);

  if (httpResponseCode > 0) {
    String response = http.getString();
    Serial.print("HTTP Response code: ");
    Serial.println(httpResponseCode);

    // پارس پاسخ دریافتی جهت اجرای فرامین داشبورد (خاموش/روشن ال‌ام‌دی، نور و رله)
    JsonDocument responseDoc;
    DeserializationError error = deserializeJson(responseDoc, response);
    
    if (!error) {
      // دریافت مقادیر خروجی صادر شده از فرانتِ هخامنشی
      bool ledState = responseDoc["state"]["ledState"];
      int ledPwm = responseDoc["state"]["ledPwm"];
      bool relayState = responseDoc["state"]["relayState"];

      // ۱. کنترل ال‌ام‌دی اصلی (دیجیتال کامند)
      digitalWrite(PIN_LED, ledState ? HIGH : LOW);
      
      // ۲. کنترل رله صنعتی
      digitalWrite(PIN_RELAY, relayState ? HIGH : LOW);

      // ۳. کنترل دیمر یا نورپردازی PWM
      ledcWrite(PIN_PWM_LED, ledPwm);

      Serial.print("Execution -> LED: ");
      Serial.print(ledState ? "ON" : "OFF");
      Serial.print(" | PWM: ");
      Serial.print(ledPwm);
      Serial.print(" | Relay: ");
      Serial.println(relayState ? "ACTIVE" : "INACTIVE");
    } else {
      Serial.print("JSON Deserialization failed: ");
      Serial.println(error.c_str());
    }
  } else {
    Serial.print("Error on sending POST: ");
    Serial.println(httpResponseCode);
  }

  http.end();
}
`;

  const jsonSchema = `{
  "source": "esp32",
  "sensors": {
    "atarTemp": 25.4,
    "anahitaMoisture": 45,
    "vayuAirQuality": 115,
    "mithraLight": 620
  }
}`;

  const handleCopy = () => {
    navigator.clipboard.writeText(cppCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 3000);
  };

  return (
    <div 
      className="bg-[var(--card-bg)] border border-[var(--accent3-medium)] overflow-hidden shadow-2xl hover:border-[var(--accent3)] transition-all duration-300"
      style={{ clipPath: CLIP_PEDESTAL }}
    >
      {/* Header */}
      <div className="px-6 py-4 bg-gradient-to-r from-[var(--card-bg-solid)] to-[var(--card-bg)] border-b border-[var(--border-color)] flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Cpu className="w-5 h-5 text-accent3 animate-pulse" style={{ color: "var(--accent3)" }} />
          <h3 className="font-sans font-medium text-accent3 text-sm tracking-wide" style={{ color: "var(--accent3)" }}>
            راه‌اندازی میکروکنترلر ESP32
          </h3>
        </div>
        <div 
          className="flex bg-[var(--card-bg-solid)] p-1 border border-[var(--border-color)] text-xs"
          style={{ clipPath: BUTTON_CLIP }}
        >
          <button
            onClick={() => setActiveTab("code")}
            className={`px-3 py-1.5 transition-all cursor-pointer ${
              activeTab === "code"
                ? "bg-accent3 text-black font-semibold"
                : "theme-text-muted hover:theme-text-primary"
            }`}
            style={{ 
              clipPath: BUTTON_CLIP,
              backgroundColor: activeTab === "code" ? "var(--accent3)" : "transparent"
            }}
          >
            کد C++ آردوینو
          </button>
          <button
            onClick={() => setActiveTab("schema")}
            className={`px-3 py-1.5 transition-all cursor-pointer ${
              activeTab === "schema"
                ? "bg-accent3 text-black font-semibold"
                : "theme-text-muted hover:theme-text-primary"
            }`}
            style={{ 
              clipPath: BUTTON_CLIP,
              backgroundColor: activeTab === "schema" ? "var(--accent3)" : "transparent"
            }}
          >
            ساختار JSON API
          </button>
          <button
            onClick={() => setActiveTab("guide")}
            className={`px-3 py-1.5 transition-all cursor-pointer ${
              activeTab === "guide"
                ? "bg-accent3 text-black font-semibold"
                : "theme-text-muted hover:theme-text-primary"
            }`}
            style={{ 
              clipPath: BUTTON_CLIP,
              backgroundColor: activeTab === "guide" ? "var(--accent3)" : "transparent"
            }}
          >
            راهنمای نقشه شیما
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        {activeTab === "code" && (
          <div className="space-y-4">
            <div className="flex items-center justify-between text-xs text-gray-400">
              <span className="flex items-center gap-1">
                <Terminal className="w-3.5 h-3.5 text-accent3" style={{ color: "var(--accent3)" }} />
                آدرس هدر اندپوینت: <code className="text-accent3 font-mono bg-[var(--card-bg-solid)] px-2 py-0.5 border border-[var(--border-color)]" style={{ color: "var(--accent3)", clipPath: BUTTON_CLIP }}>{cleanUrl}/api/iot</code>
              </span>
              <button
                onClick={handleCopy}
                className="flex items-center gap-1 px-3 py-1.5 bg-[var(--card-bg-solid)] hover:bg-accent3 hover:text-black text-gray-300 transition-all border border-[var(--border-color)] text-xs cursor-pointer"
                style={{ clipPath: BUTTON_CLIP }}
              >
                {copied ? (
                  <>
                    <Check className="w-3.5 h-3.5" /> کپی شد!
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" /> کپی کد آردوینو
                  </>
                )}
              </button>
            </div>
            <div className="relative">
              <pre 
                className="text-left font-mono text-[11px] leading-relaxed bg-[var(--card-bg-solid)] p-4 border border-[var(--border-color)] text-emerald-400/90 overflow-x-auto max-h-[420px] scrollbar-thin"
                style={{ clipPath: BUTTON_CLIP }}
              >
                <code>{cppCode}</code>
              </pre>
            </div>
          </div>
        )}

        {activeTab === "schema" && (
          <div className="space-y-4">
            <div className="text-xs text-right theme-text-muted leading-relaxed font-sans">
              بدنه درخواست ارسالی توسط ESP32 با قالب استاندارد JSON به صورت زیر است. شما می‌توانید سنسورهای واقعی را به این فیلدها متصل سازید و به صورت بلادرنگ به داشبورد ارسال نمایید.
            </div>
            <pre 
              className="text-left font-mono text-xs bg-[var(--card-bg-solid)] p-4 border border-[var(--border-color)] text-accent3 overflow-x-auto"
              style={{ color: "var(--accent3)", clipPath: BUTTON_CLIP }}
            >
              <code>{jsonSchema}</code>
            </pre>
          </div>
        )}

        {activeTab === "guide" && (
          <div className="space-y-5 text-right font-sans text-xs leading-relaxed text-gray-300">
            <div className="flex items-start gap-3 mt-1">
              <div 
                className="p-2 bg-[var(--accent3-transparent)] text-accent3 mt-1 shrink-0"
                style={{ clipPath: BUTTON_CLIP }}
              >
                <BookOpen className="w-4 h-4 text-accent3" style={{ color: "var(--accent3)" }} />
              </div>
              <div className="space-y-1">
                <h4 className="font-semibold text-accent3" style={{ color: "var(--accent3)" }}>سنسور طاق آذر (Atar Fire/Temp Sensor)</h4>
                <p className="theme-text-muted font-sans font-medium">نماد نگهبان روشنایی و گرما. دمای محیطی را در قالب فیلد <code className="text-accent4 font-mono" style={{ color: "var(--accent4)" }}>atarTemp</code> اندازه‌گیری و مخابره می‌کند (پیش‌فرض DHT11 یا Dallas DS18B20).</p>
              </div>
            </div>

            <div className="flex items-start gap-3 mt-1">
              <div 
                className="p-2 bg-[var(--accent3-transparent)] text-accent3 mt-1 shrink-0"
                style={{ clipPath: BUTTON_CLIP }}
              >
                <BookOpen className="w-4 h-4 text-accent3" style={{ color: "var(--accent3)" }} />
              </div>
              <div className="space-y-1">
                <h4 className="font-semibold text-accent3" style={{ color: "var(--accent3)" }}>سنسور آب آناهیتا (Anahita Moisture Sensor)</h4>
                <p className="theme-text-muted font-sans font-medium">نماد تطهیر و زایش آب‌ها. درصد رطوبت خاک یا مخزن آب کارگاه را با فیلد <code className="text-accent4 font-mono" style={{ color: "var(--accent4)" }}>anahitaMoisture</code> گزارش می‌دهد.</p>
              </div>
            </div>

            <div className="flex items-start gap-3 mt-1">
              <div 
                className="p-2 bg-[var(--accent3-transparent)] text-accent3 mt-1 shrink-0"
                style={{ clipPath: BUTTON_CLIP }}
              >
                <BookOpen className="w-4 h-4 text-accent3" style={{ color: "var(--accent3)" }} />
              </div>
              <div className="space-y-1">
                <h4 className="font-semibold text-accent3" style={{ color: "var(--accent3)" }}>سنسور باد وایو (Vayu Air Quality Node)</h4>
                <p className="theme-text-muted font-sans font-medium">نماد جریان جوی و بادهای توفنده. سنجش شاخص پاکی هوا با فیلد <code className="text-accent4 font-mono" style={{ color: "var(--accent4)" }}>vayuAirQuality</code> با سنسورهای سری MQ (مانند MQ135).</p>
              </div>
            </div>

            <div className="flex items-start gap-3 mt-1">
              <div 
                className="p-2 bg-[var(--accent3-transparent)] text-accent3 mt-1 shrink-0"
                style={{ clipPath: BUTTON_CLIP }}
              >
                <BookOpen className="w-4 h-4 text-accent3" style={{ color: "var(--accent3)" }} />
              </div>
              <div className="space-y-1">
                <h4 className="font-semibold text-accent3" style={{ color: "var(--accent3)" }}>سنجش نور مهر (Mithra Light LDR)</h4>
                <p className="theme-text-muted font-sans font-medium">شاه پیروز روشنایی خورشید. میزان درخشش محیط و روز/شب را با فیلد <code className="text-accent4 font-mono" style={{ color: "var(--accent4)" }}>mithraLight</code> توسط فتورزیستور محاسبه می‌نماید.</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
