import { NextRequest, NextResponse } from "next/server";

export const dynamic = "force-dynamic";

// Define the IoT State structure
export interface IoTState {
  ledState: boolean;
  ledPwm: number;
  relayState: boolean;
  lastSeen: string | null;
  sensors: {
    atarTemp: number;         // Temperature (Atar - Fire)
    anahitaMoisture: number;  // Soil Moisture (Anahita - Water)
    vayuAirQuality: number;   // Air Quality (Vayu - Air)
    mithraLight: number;      // Ambient Light (Mithra - Sun/Light)
  };
  pins: Record<string, boolean>; // Dynamic GPIO pins state: e.g. {"2": false, "4": true}
  logs: Array<{ timestamp: string; message: string; type: "info" | "success" | "warning" }>;
}

// Default initial state
const defaultState: IoTState = {
  ledState: false,
  ledPwm: 128,
  relayState: false,
  lastSeen: null,
  sensors: {
    atarTemp: 26.4,
    anahitaMoisture: 42,
    vayuAirQuality: 110,
    mithraLight: 680,
  },
  pins: {
    "2": false,
    "5": false,
  },
  logs: [
    { timestamp: new Date().toISOString(), message: "لوگ به روز رسانی شد: داشبورد هخامنشی آماده اتصال به ESP32", type: "info" }
  ],
};

// Use globalThis to persist state in serverless/worker runtime (e.g. Cloudflare)
const globalForState = globalThis as unknown as {
  inMemoryIoTState?: IoTState;
};

// Helper to load state with dynamic import of fs/path for Node environments, falling back to in-memory on Cloudflare Edge Runtime
async function getIoTState(): Promise<IoTState> {
  if (globalForState.inMemoryIoTState) {
    return globalForState.inMemoryIoTState;
  }

  try {
    const fs = await import("fs");
    const path = await import("path");
    const stateFilePath = path.join(process.cwd(), "iot_state.json");

    const fileContent = await fs.promises.readFile(stateFilePath, "utf-8");
    const parsed = JSON.parse(fileContent);
    // Sanitize to make sure essential objects exist
    if (!parsed.sensors) parsed.sensors = { ...defaultState.sensors };
    if (!parsed.pins) parsed.pins = { ...defaultState.pins };
    if (!Array.isArray(parsed.logs)) parsed.logs = [ ...defaultState.logs ];
    
    globalForState.inMemoryIoTState = parsed;
    return parsed;
  } catch (err) {
    // Falls back to in-memory state on error or serverless V8 runtime (Cloudflare)
    if (!globalForState.inMemoryIoTState) {
      globalForState.inMemoryIoTState = { ...defaultState };
    }
    return globalForState.inMemoryIoTState;
  }
}

// Helper to save state with fallback
async function saveIoTState(state: IoTState) {
  globalForState.inMemoryIoTState = state;
  try {
    const fs = await import("fs");
    const path = await import("path");
    const stateFilePath = path.join(process.cwd(), "iot_state.json");

    await fs.promises.writeFile(stateFilePath, JSON.stringify(state, null, 2), "utf-8");
  } catch (err) {
    // File storage is not writable/supported on Cloudflare Edge Runtime
    console.warn("[Cloudflare/Serverless Context] State updated in-memory only. Disk persistence is skipped.");
  }
}

// Helper to add a log to the loaded state
function addLog(state: IoTState, message: string, type: "info" | "success" | "warning" = "info") {
  state.logs.unshift({
    timestamp: new Date().toISOString(),
    message,
    type,
  });
  // Keep last 40 logs for complete history
  if (state.logs.length > 40) {
    state.logs.pop();
  }
}

// GET - Allows dashboard client or ESP32 to query the current state
export async function GET() {
  const currentState = await getIoTState();
  return NextResponse.json(currentState);
}

// POST - Updates the state. Can be called by:
// 1. Dashboard UI to update control outputs (LED, PWM, relay, or dynamically added pins)
// 2. ESP32 to upload sensor telemetry and update lastSeen ping
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { source, ledState, ledPwm, relayState, sensors, pins, pin, pinState } = body;

    // Load contemporary persisted state
    const currentState = await getIoTState();
    const now = new Date().toISOString();

    if (source === "esp32") {
      // Incoming request from the ESP32 microcontroller
      currentState.lastSeen = now;
      
      if (sensors) {
        if (typeof sensors.atarTemp === "number") currentState.sensors.atarTemp = Number(sensors.atarTemp.toFixed(1));
        if (typeof sensors.anahitaMoisture === "number") currentState.sensors.anahitaMoisture = Math.round(sensors.anahitaMoisture);
        if (typeof sensors.vayuAirQuality === "number") currentState.sensors.vayuAirQuality = Math.round(sensors.vayuAirQuality);
        if (typeof sensors.mithraLight === "number") currentState.sensors.mithraLight = Math.round(sensors.mithraLight);
      }
      
      // ESP32 can also report status of its pins
      if (pins && typeof pins === "object") {
        Object.entries(pins).forEach(([pKey, pVal]) => {
          if (typeof pVal === "boolean") {
            currentState.pins[pKey] = pVal;
          }
        });
      }
      
      addLog(currentState, `داده‌های تلمتری از ESP32 دریافت شد [ثبت سنسورها]`, "success");
    } else {
      // Incoming request from Dashboard user interface
      if (typeof ledState === "boolean") {
        if (currentState.ledState !== ledState) {
          currentState.ledState = ledState;
          addLog(currentState, `وضعیت ال‌ام‌دی تغییر کرد: ${ledState ? "روشن (فرمان صادر شد)" : "خاموش"}`, "info");
        }
      }
      
      if (typeof ledPwm === "number") {
        const clampedPwm = Math.max(0, Math.min(255, ledPwm));
        if (currentState.ledPwm !== clampedPwm) {
          currentState.ledPwm = clampedPwm;
          addLog(currentState, `شدت نور PWM تنظیم شد به: ${clampedPwm}`, "info");
        }
      }

      if (typeof relayState === "boolean") {
        if (currentState.relayState !== relayState) {
          currentState.relayState = relayState;
          addLog(currentState, `وضعیت رله تغییر کرد: ${relayState ? "فعال" : "غیرفعال"}`, "info");
        }
      }

      // Handle dynamic pins update
      if (pins && typeof pins === "object") {
        Object.entries(pins).forEach(([pKey, pVal]) => {
          if (typeof pVal === "boolean") {
            if (currentState.pins[pKey] !== pVal) {
              currentState.pins[pKey] = pVal;
              addLog(currentState, `وضعیت پایه ${pKey} تغییر کرد به: ${pVal ? "روشن" : "خاموش"}`, "info");
            }
          }
        });
      }

      if (typeof pin === "string" && typeof pinState === "boolean") {
        if (currentState.pins[pin] !== pinState) {
          currentState.pins[pin] = pinState;
          addLog(currentState, `وضعیت پایه ${pin} تغییر کرد به: ${pinState ? "روشن" : "خاموش"}`, "info");
        }
      }
    }

    // Save final updated state to durable disk file
    await saveIoTState(currentState);

    return NextResponse.json({ success: true, state: currentState });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message }, { status: 400 });
  }
}
