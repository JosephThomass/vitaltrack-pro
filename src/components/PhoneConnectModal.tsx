import React, { useState, useEffect } from 'react';
import { Smartphone, X, QrCode, Check, Copy, ExternalLink, Wifi, Download, ShieldCheck } from 'lucide-react';
import QRCode from 'qrcode';

interface PhoneConnectModalProps {
  onClose: () => void;
}

export const PhoneConnectModal: React.FC<PhoneConnectModalProps> = ({ onClose }) => {
  const [qrDataUrl, setQrDataUrl] = useState<string>('');
  const [copied, setCopied] = useState<boolean>(false);
  const [activeGuideTab, setActiveGuideTab] = useState<'pwa' | 'apk'>('pwa');

  // Local network IP address detected
  const localUrl = 'http://192.168.1.34:5173';

  useEffect(() => {
    QRCode.toDataURL(localUrl, {
      width: 260,
      margin: 2,
      color: {
        dark: '#020617',
        light: '#ffffff',
      },
    })
      .then((url) => setQrDataUrl(url))
      .catch(() => {});
  }, [localUrl]);

  const handleCopy = () => {
    navigator.clipboard.writeText(localUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-white dark:bg-[#0d221a] text-slate-900 dark:text-emerald-50 border border-emerald-100 dark:border-emerald-900/50 rounded-3xl max-w-2xl w-full p-6 shadow-2xl flex flex-col max-h-[92vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-emerald-900/40">
          <div className="flex items-center space-x-2.5">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 flex items-center justify-center border border-emerald-200 dark:border-emerald-800">
              <Smartphone className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-xl font-black text-slate-900 dark:text-emerald-50">Run as an Android App</h3>
              <p className="text-xs text-slate-500 dark:text-emerald-300/70">Install directly to your Android Home Screen & App Drawer</p>
            </div>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-700 dark:hover:text-white p-1 rounded-xl">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab switch: 1-Click PWA vs Native APK */}
        <div className="flex space-x-2 pt-4">
          <button
            onClick={() => setActiveGuideTab('pwa')}
            className={`flex-1 py-2.5 rounded-xl text-xs font-bold transition flex items-center justify-center space-x-1.5 ${
              activeGuideTab === 'pwa'
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'bg-slate-100 dark:bg-[#071510] text-slate-600 dark:text-emerald-300 hover:bg-slate-200 border border-slate-200 dark:border-emerald-900/40'
            }`}
          >
            <span>Option 1: 1-Click Install App (Recommended)</span>
          </button>
          <button
            onClick={() => setActiveGuideTab('apk')}
            className={`flex-1 py-2.5 rounded-xl text-xs font-bold transition flex items-center justify-center space-x-1.5 ${
              activeGuideTab === 'apk'
                ? 'bg-emerald-600 text-white shadow-xs'
                : 'bg-slate-100 dark:bg-[#071510] text-slate-600 dark:text-emerald-300 hover:bg-slate-200 border border-slate-200 dark:border-emerald-900/40'
            }`}
          >
            <span>Option 2: Native APK (Android Studio / Gradle)</span>
          </button>
        </div>

        {activeGuideTab === 'pwa' && (
          <div className="py-5 space-y-6">
            {/* QR Code and Local URL */}
            <div className="bg-slate-50 dark:bg-[#071510] border border-slate-200 dark:border-emerald-900/50 rounded-2xl p-5 flex flex-col sm:flex-row items-center gap-6">
              {/* QR Code Box */}
              <div className="bg-white p-3 rounded-2xl shadow-md border border-slate-200 shrink-0 flex items-center justify-center">
                {qrDataUrl ? (
                  <img src={qrDataUrl} alt="Scan QR Code" className="w-44 h-44 rounded-xl" />
                ) : (
                  <div className="w-44 h-44 bg-slate-200 animate-pulse rounded-xl" />
                )}
              </div>

              {/* Instructions */}
              <div className="space-y-3 text-center sm:text-left flex-1">
                <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 text-[11px] font-bold">
                  <Wifi className="w-3.5 h-3.5" />
                  <span>Same Wi-Fi Network</span>
                </div>
                <h4 className="text-base font-black text-slate-900 dark:text-white">Scan with your phone&apos;s Camera</h4>
                <p className="text-xs text-slate-600 dark:text-emerald-200/80 leading-relaxed font-medium">
                  Open your Android phone camera or QR scanner and point it at the QR code, or type this URL into Chrome:
                </p>

                {/* Copyable link */}
                <div className="flex items-center space-x-2 bg-white dark:bg-[#0d221a] border border-slate-200 dark:border-emerald-800 rounded-xl p-2 px-3 shadow-xs">
                  <span className="font-mono text-xs text-emerald-700 dark:text-emerald-400 font-bold truncate flex-1">{localUrl}</span>
                  <button
                    onClick={handleCopy}
                    className="flex items-center space-x-1 px-2.5 py-1 rounded-lg bg-emerald-50 dark:bg-emerald-950 hover:bg-emerald-100 text-emerald-800 dark:text-emerald-300 text-xs font-bold transition border border-emerald-200 dark:border-emerald-800"
                  >
                    {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copied ? 'Copied' : 'Copy'}</span>
                  </button>
                </div>
              </div>
            </div>

            {/* 3 Step Android Install Walkthrough */}
            <div>
              <h4 className="text-xs font-bold text-slate-500 dark:text-emerald-300/70 uppercase tracking-wider mb-3">
                How to install onto your Android phone:
              </h4>

              <div className="space-y-2.5 text-xs">
                <div className="p-3.5 bg-slate-50 dark:bg-[#071510] border border-slate-200 dark:border-emerald-900/40 rounded-2xl flex items-start space-x-3">
                  <div className="w-6 h-6 rounded-lg bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-400 font-black flex items-center justify-center shrink-0 mt-0.5 border border-emerald-200 dark:border-emerald-800">
                    1
                  </div>
                  <div>
                    <strong className="text-slate-900 dark:text-white font-bold">Open in Google Chrome on your phone:</strong>
                    <p className="text-slate-600 dark:text-emerald-300/70 mt-0.5">Scan the QR code above or enter <code className="text-emerald-700 dark:text-emerald-400 bg-white dark:bg-[#0d221a] px-1 py-0.5 rounded border border-slate-200 dark:border-emerald-900/50">{localUrl}</code>.</p>
                  </div>
                </div>

                <div className="p-3.5 bg-slate-50 dark:bg-[#071510] border border-slate-200 dark:border-emerald-900/40 rounded-2xl flex items-start space-x-3">
                  <div className="w-6 h-6 rounded-lg bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-400 font-black flex items-center justify-center shrink-0 mt-0.5 border border-emerald-200 dark:border-emerald-800">
                    2
                  </div>
                  <div>
                    <strong className="text-slate-900 dark:text-white font-bold">Tap the Chrome menu (⋮) at top right:</strong>
                    <p className="text-slate-600 dark:text-emerald-300/70 mt-0.5">Select <strong className="text-emerald-700 dark:text-emerald-400">&quot;Add to Home screen&quot;</strong> or <strong className="text-emerald-700 dark:text-emerald-400">&quot;Install app&quot;</strong>.</p>
                  </div>
                </div>

                <div className="p-3.5 bg-slate-50 dark:bg-[#071510] border border-slate-200 dark:border-emerald-900/40 rounded-2xl flex items-start space-x-3">
                  <div className="w-6 h-6 rounded-lg bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-400 font-black flex items-center justify-center shrink-0 mt-0.5 border border-emerald-200 dark:border-emerald-800">
                    3
                  </div>
                  <div>
                    <strong className="text-slate-900 dark:text-white font-bold">Tap &quot;Install&quot;:</strong>
                    <p className="text-slate-600 dark:text-emerald-300/70 mt-0.5">
                      VitalTrack Pro will install directly onto your Android device with its own icon in your app drawer. It launches in <strong>standalone fullscreen</strong> mode with native sounds, vibration, and offline storage!
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeGuideTab === 'apk' && (
          <div className="py-5 space-y-4 text-xs">
            <div className="bg-slate-50 dark:bg-[#071510] border border-slate-200 dark:border-emerald-900/50 rounded-2xl p-4 space-y-2">
              <div className="flex items-center space-x-2 text-emerald-600 dark:text-emerald-400 font-black">
                <ShieldCheck className="w-4 h-4" />
                <span>Capacitor Native Android Project Ready</span>
              </div>
              <p className="text-slate-600 dark:text-emerald-200/80 leading-relaxed font-medium">
                We have generated the full native Android Gradle project inside the <code className="text-slate-900 dark:text-white bg-white dark:bg-[#0d221a] px-1.5 py-0.5 rounded border border-slate-200 dark:border-emerald-800">android/</code> directory with package id <code className="text-emerald-700 dark:text-emerald-400 font-bold">com.vitaltrack.app</code>.
              </p>
            </div>

            <div className="space-y-3">
              <h4 className="text-xs font-bold text-slate-500 dark:text-emerald-300/70 uppercase tracking-wider">
                To build the APK package:
              </h4>

              <div className="p-3.5 bg-slate-50 dark:bg-[#071510] border border-slate-200 dark:border-emerald-900/40 rounded-2xl space-y-1.5">
                <strong className="text-slate-900 dark:text-white font-bold">Method A — Open in Android Studio:</strong>
                <p className="text-slate-600 dark:text-emerald-300/70">Run this command in the terminal to open the project in Android Studio:</p>
                <div className="bg-white dark:bg-[#0d221a] p-2 rounded-xl font-mono text-emerald-700 dark:text-emerald-400 text-[11px] font-bold border border-slate-200 dark:border-emerald-800">
                  npx cap open android
                </div>
                <p className="text-slate-500 dark:text-emerald-300/60 text-[11px]">Then click <strong>Build &gt; Build Bundle(s) / APK(s) &gt; Build APK(s)</strong>.</p>
              </div>

              <div className="p-3.5 bg-slate-50 dark:bg-[#071510] border border-slate-200 dark:border-emerald-900/40 rounded-2xl space-y-1.5">
                <strong className="text-slate-900 dark:text-white font-bold">Method B — Command Line Build:</strong>
                <p className="text-slate-600 dark:text-emerald-300/70">If you have Android SDK installed, run Gradle wrapper inside the project:</p>
                <div className="bg-white dark:bg-[#0d221a] p-2 rounded-xl font-mono text-emerald-700 dark:text-emerald-400 text-[11px] font-bold border border-slate-200 dark:border-emerald-800">
                  cd android ; .\gradlew assembleDebug
                </div>
                <p className="text-slate-500 dark:text-emerald-300/60 text-[11px]">The output APK will be at: <code className="text-slate-700 dark:text-emerald-200">android/app/build/outputs/apk/debug/app-debug.apk</code></p>
              </div>
            </div>
          </div>
        )}

        <div className="pt-4 border-t border-slate-100 dark:border-emerald-900/40 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2.5 bg-slate-100 dark:bg-emerald-950 hover:bg-slate-200 dark:hover:bg-emerald-900 text-slate-700 dark:text-emerald-200 font-bold rounded-xl text-xs transition"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
