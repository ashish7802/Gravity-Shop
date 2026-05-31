"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Settings as SettingsIcon, Save, Store, CreditCard, Image as ImageIcon, Mail } from "lucide-react";

export default function SettingsPage() {
  const [settings, setSettings] = useState<Record<string, string>>({
    storeName: "Gravity Shop",
    storeCurrency: "USD",
    storeEmail: "contact@gravityshop.com",
    stripeTestMode: "true",
    cloudinaryFolder: "gravity_shop_assets",
    smtpHost: "smtp.example.com",
    smtpPort: "587"
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState("store");

  useEffect(() => {
    fetch("/api/admin/settings")
      .then(res => res.json())
      .then(data => {
        // Merge fetched data with defaults
        setSettings(prev => ({ ...prev, ...data }));
        setLoading(false);
      });
  }, []);

  const handleSave = async () => {
    setSaving(true);
    try {
      await fetch("/api/admin/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(settings)
      });
    } catch (err) {
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setSettings(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[500px]">
        <div className="text-neon-cyan font-mono animate-pulse">LOADING CONFIGURATION...</div>
      </div>
    );
  }

  const tabs = [
    { id: "store", icon: Store, label: "Store Identity" },
    { id: "payment", icon: CreditCard, label: "Payment Gateway" },
    { id: "media", icon: ImageIcon, label: "Media CDN" },
    { id: "email", icon: Mail, label: "Email SMTP" },
  ];

  return (
    <div className="max-w-7xl mx-auto space-y-8">
      <div className="flex justify-between items-end">
        <div>
          <motion.h1 
            initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}
            className="font-display font-bold text-4xl tracking-wider text-white uppercase flex items-center gap-4"
          >
            <SettingsIcon className="w-8 h-8 text-neon-magenta" />
            System Config
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 }}
            className="text-gray-400 font-mono mt-2"
          >
            Manage business logic and operational parameters.
          </motion.p>
        </div>
        
        <motion.button 
          initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.2 }}
          onClick={handleSave}
          disabled={saving}
          className="flex items-center gap-2 px-6 py-3 bg-neon-cyan text-space-900 font-bold tracking-widest rounded-lg hover:bg-white transition-colors disabled:opacity-50"
        >
          <Save className="w-5 h-5" />
          {saving ? "SAVING..." : "COMMIT CHANGES"}
        </motion.button>
      </div>

      <div className="flex flex-col md:flex-row gap-8">
        {/* Sidebar Tabs */}
        <div className="w-full md:w-64 space-y-2">
          {tabs.map((tab, idx) => {
            const Icon = tab.icon;
            return (
              <motion.button
                key={tab.id}
                initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 * idx }}
                onClick={() => setActiveTab(tab.id)}
                className={`w-full flex items-center gap-3 px-4 py-4 rounded-xl transition-all font-mono text-sm tracking-wide ${
                  activeTab === tab.id 
                    ? "bg-white/10 text-white border border-white/20 shadow-[0_0_15px_rgba(255,255,255,0.1)]" 
                    : "bg-transparent text-gray-500 hover:text-gray-300 hover:bg-white/5"
                }`}
              >
                <Icon className={`w-5 h-5 ${activeTab === tab.id ? "text-neon-cyan" : ""}`} />
                {tab.label}
              </motion.button>
            )
          })}
        </div>

        {/* Form Area */}
        <motion.div 
          key={activeTab}
          initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.2 }}
          className="flex-1 glass-panel p-8 rounded-2xl border border-white/10"
        >
          {activeTab === "store" && (
            <div className="space-y-6">
              <h2 className="text-xl font-bold text-white mb-6">Store Identity Configuration</h2>
              
              <div className="space-y-2">
                <label className="text-sm font-mono text-gray-400">Store Name</label>
                <input name="storeName" value={settings.storeName} onChange={handleChange} className="w-full bg-black/50 border border-white/10 rounded-lg p-3 text-white focus:border-neon-cyan focus:ring-1 focus:outline-none" />
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-mono text-gray-400">Base Currency</label>
                <select name="storeCurrency" value={settings.storeCurrency} onChange={handleChange} className="w-full bg-black/50 border border-white/10 rounded-lg p-3 text-white focus:border-neon-cyan focus:ring-1 focus:outline-none appearance-none">
                  <option value="USD">USD ($)</option>
                  <option value="EUR">EUR (€)</option>
                  <option value="GBP">GBP (£)</option>
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-mono text-gray-400">Support Email</label>
                <input name="storeEmail" value={settings.storeEmail} onChange={handleChange} className="w-full bg-black/50 border border-white/10 rounded-lg p-3 text-white focus:border-neon-cyan focus:ring-1 focus:outline-none" />
              </div>
            </div>
          )}

          {activeTab === "payment" && (
            <div className="space-y-6">
              <h2 className="text-xl font-bold text-white mb-6">Payment Gateway Configuration</h2>
              <div className="p-4 bg-yellow-500/10 border border-yellow-500/20 rounded-lg mb-6 text-sm text-yellow-500 flex gap-3 items-start">
                <span>⚠️</span>
                <p>Sensitive payment credentials (Stripe Secret Key, Webhook Secret) are strictly managed via environment variables and cannot be altered here.</p>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-mono text-gray-400">Gateway Mode</label>
                <select name="stripeTestMode" value={settings.stripeTestMode} onChange={handleChange} className="w-full bg-black/50 border border-white/10 rounded-lg p-3 text-white focus:border-neon-cyan focus:ring-1 focus:outline-none appearance-none">
                  <option value="true">Test Mode (Mock Transactions)</option>
                  <option value="false">Live Mode (Real Money)</option>
                </select>
              </div>
            </div>
          )}

          {activeTab === "media" && (
            <div className="space-y-6">
              <h2 className="text-xl font-bold text-white mb-6">Media CDN Configuration</h2>
              <div className="p-4 bg-yellow-500/10 border border-yellow-500/20 rounded-lg mb-6 text-sm text-yellow-500 flex gap-3 items-start">
                <span>⚠️</span>
                <p>Cloudinary API Secrets and Cloud Names are managed via environment variables.</p>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-mono text-gray-400">Asset Upload Directory</label>
                <input name="cloudinaryFolder" value={settings.cloudinaryFolder} onChange={handleChange} className="w-full bg-black/50 border border-white/10 rounded-lg p-3 text-white focus:border-neon-cyan focus:ring-1 focus:outline-none" />
              </div>
            </div>
          )}

          {activeTab === "email" && (
            <div className="space-y-6">
              <h2 className="text-xl font-bold text-white mb-6">Email SMTP Configuration</h2>
              
              <div className="space-y-2">
                <label className="text-sm font-mono text-gray-400">SMTP Host</label>
                <input name="smtpHost" value={settings.smtpHost} onChange={handleChange} className="w-full bg-black/50 border border-white/10 rounded-lg p-3 text-white focus:border-neon-cyan focus:ring-1 focus:outline-none" />
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-mono text-gray-400">SMTP Port</label>
                <input name="smtpPort" value={settings.smtpPort} onChange={handleChange} className="w-full bg-black/50 border border-white/10 rounded-lg p-3 text-white focus:border-neon-cyan focus:ring-1 focus:outline-none" />
              </div>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}
