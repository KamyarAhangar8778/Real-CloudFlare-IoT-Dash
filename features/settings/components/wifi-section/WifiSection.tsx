import React, { useState } from "react";
import { Plus, Trash2, Wifi, Check, X } from "lucide-react";
import { useIoTStore } from "@/features/iot/hooks/useIoTStore";
import { motion, AnimatePresence } from "motion/react";

export default function WifiSection() {
  const { wifiNetworks, setWifiNetworks } = useIoTStore();
  
  const [editingId, setEditingId] = useState<string | null>(null);
  const [tempSsid, setTempSsid] = useState("");
  const [tempPassword, setTempPassword] = useState("");

  const handleAddNetwork = () => {
    const newId = `wifi_${Date.now()}`;
    setWifiNetworks((prev) => [
      ...prev,
      { id: newId, ssid: "شبکه جدید", password: "" },
    ]);
    setEditingId(newId);
    setTempSsid("شبکه جدید");
    setTempPassword("");
  };

  const handleEditNetwork = (id: string, ssid: string, password?: string) => {
    setEditingId(id);
    setTempSsid(ssid);
    setTempPassword(password || "");
  };

  const handleSaveNetwork = (id: string) => {
    if (!tempSsid.trim()) return;
    setWifiNetworks((prev) =>
      prev.map((net) =>
        net.id === id
          ? { ...net, ssid: tempSsid, password: tempPassword }
          : net
      )
    );
    setEditingId(null);
  };

  const handleRemoveNetwork = (id: string) => {
    setWifiNetworks((prev) => prev.filter((net) => net.id !== id));
    if (editingId === id) {
      setEditingId(null);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-bold text-[var(--text-primary)] flex items-center gap-2">
          <Wifi className="w-5 h-5 text-[var(--accent3)]" />
          تنظیمات شبکه‌های وای‌فای
        </h3>
        <button
          onClick={handleAddNetwork}
          className="bg-[var(--accent3)] text-white p-2 rounded-xl hover:bg-[var(--accent3-dark)] transition-colors shadow-md"
          title="افزودن شبکه جدید"
          type="button"
        >
          <Plus className="w-4 h-4" />
        </button>
      </div>
      
      <p className="text-sm text-[var(--text-secondary)] mb-4 leading-relaxed">
        در این بخش می‌توانید اطلاعات شبکه‌های وای‌فای (SSID و رمز عبور) را برای تراشه ESP32 تعریف کنید. تراشه به هنگام راه‌اندازی به ترتیب به این شبکه‌ها متصل خواهد شد.
      </p>

      <div className="space-y-4">
        <AnimatePresence>
          {wifiNetworks.map((net) => (
            <motion.div
              key={net.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="p-4 bg-[var(--card-bg-solid)] border border-[var(--border-color)] rounded-2xl shadow-sm relative overflow-hidden"
            >
              {editingId === net.id ? (
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs text-[var(--text-secondary)] mb-1">نام شبکه (SSID)</label>
                    <input
                      type="text"
                      value={tempSsid}
                      onChange={(e) => setTempSsid(e.target.value)}
                      placeholder="SSID..."
                      className="w-full bg-[var(--card-bg-solid)] border border-[var(--border-color)] rounded-xl px-4 py-2.5 text-sm text-[var(--text-primary)] outline-none focus:border-[var(--accent3)] focus:ring-1 focus:ring-[var(--accent3)] transition-all"
                      dir="ltr"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-[var(--text-secondary)] mb-1">رمز عبور (اختیاری)</label>
                    <input
                      type="text"
                      value={tempPassword}
                      onChange={(e) => setTempPassword(e.target.value)}
                      placeholder="Password..."
                      className="w-full bg-[var(--card-bg-solid)] border border-[var(--border-color)] rounded-xl px-4 py-2.5 text-sm text-[var(--text-primary)] outline-none focus:border-[var(--accent3)] focus:ring-1 focus:ring-[var(--accent3)] transition-all"
                      dir="ltr"
                    />
                  </div>
                  <div className="flex items-center gap-2 pt-2">
                    <button
                      onClick={() => handleSaveNetwork(net.id)}
                      className="flex-1 p-2.5 bg-[var(--accent3)] text-white rounded-xl hover:bg-[var(--accent3-dark)] transition-colors flex items-center justify-center gap-2 shadow-md shadow-[var(--accent3-transparent)]"
                      type="button"
                    >
                      <Check className="w-4 h-4" />
                      <span className="text-sm font-bold">ذخیره</span>
                    </button>
                    <button
                      onClick={() => setEditingId(null)}
                      className="p-2.5 border border-[var(--border-color)] text-[var(--text-secondary)] rounded-xl hover:border-[var(--accent4)] hover:text-[var(--accent4)] transition-colors flex items-center justify-center bg-[var(--card-bg-solid)]"
                      type="button"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ) : (
                <div className="flex items-center justify-between">
                  <div 
                    className="flex-1 cursor-pointer"
                    onClick={() => handleEditNetwork(net.id, net.ssid, net.password)}
                  >
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-bold text-sm text-[var(--text-primary)]">{net.ssid}</span>
                    </div>
                    <div className="text-xs text-[var(--text-secondary)] opacity-70">
                      {net.password ? "رمز عبور تنظیم شده" : "بدون رمز عبور"}
                    </div>
                  </div>
                    <button
                      onClick={() => handleRemoveNetwork(net.id)}
                      className="p-2 text-[var(--accent4)] hover:bg-[var(--accent4-transparent)] border border-transparent hover:border-[var(--accent4)] rounded-xl transition-colors ml-2"
                      type="button"
                      title="حذف شبکه"
                    >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              )}
            </motion.div>
          ))}
        </AnimatePresence>
        
        {wifiNetworks.length === 0 && (
          <div className="text-center p-6 bg-[var(--card-bg-solid)] rounded-2xl border border-dashed border-[var(--border-color)]">
            <Wifi className="w-8 h-8 mx-auto mb-2 text-[var(--text-secondary)] opacity-50" />
            <p className="text-sm text-[var(--text-secondary)]">هیچ شبکه وای‌فای تعریف نشده است.</p>
          </div>
        )}
      </div>
    </div>
  );
}
