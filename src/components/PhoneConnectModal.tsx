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
    <div className="fixed inset-0 z-50 bg-zinc-950/85 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-zinc-900 border border-zinc-700 rounded-3xl max-w-2xl w-full p-6 shadow-2xl flex flex-col max-h-[92vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-zinc-800">
          <div className="flex items-center space-x-2.5">
            <div className="w-9 h-9 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center border border-emerald-500/30">
              <Smartphone className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-white">Run as an Android App</h3>
              <p className="text-xs text-zinc-400">Install directly to your Android Home Screen & App Drawer</p>
            </div>
          </div>
          <button onClick={onClose} className="text-zinc-400 hover:text-white p-1 rounded-lg">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab switch: 1-Click PWA vs Native APK */}
        <div className="flex space-x-2 pt-4">
          <button
            onClick={() => setActiveGuideTab('pwa')}
            className={`flex-1 py-2.5 rounded-xl text-xs font-bold transition flex items-center justify-center space-x-1.5 ${
              activeGuideTab === 'pwa'
                ? 'bg-emerald-500 text-zinc-950 shadow-md shadow-emerald-500/25'
                : 'bg-zinc-950 text-zinc-400 hover:text-white border border-zinc-800'
            }`}
          >
            <span>Option 1: 1-Click Install App (Recommended)</span>
          </button>
          <button
            onClick={() => setActiveGuideTab('apk')}
            className={`flex-1 py-2.5 rounded-xl text-xs font-bold transition flex items-center justify-center space-x-1.5 ${
              activeGuideTab === 'apk'
                ? 'bg-emerald-500 text-zinc-950 shadow-md shadow-emerald-500/25'
                : 'bg-zinc-950 text-zinc-400 hover:text-white border border-zinc-800'
            }`}
          >
            <span>Option 2: Native APK (Android Studio / Gradle)</span>
          </button>
        </div>

        {activeGuideTab === 'pwa' && (
          <div className="py-5 space-y-6">
            {/* QR Code and Local URL */}
            <div className="bg-zinc-950 border border-zinc-800 rounded-2xl p-5 flex flex-col sm:flex-row items-center gap-6">
              {/* QR Code Box */}
              <div className="bg-white p-3 rounded-2xl shadow-xl shrink-0 flex items-center justify-center">
                {qrDataUrl ? (
                  <img src={qrDataUrl} alt="Scan QR Code" className="w-44 h-44 rounded-xl" />
                ) : (
                  <div className="w-44 h-44 bg-zinc-200 animate-pulse rounded-xl" />
                )}
              </div>

              {/* Instructions */}
              <div className="space-y-3 text-center sm:text-left flex-1">
                <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 text-[11px] font-bold">
                  <Wifi className="w-3.5 h-3.5" />
                  <span>Same Wi-Fi Network</span>
                </div>
                <h4 className="text-base font-bold text-white">Scan with your phone&apos;s Camera</h4>
                <p className="text-xs text-zinc-300 leading-relaxed">
                  Open your Android phone camera or QR scanner and point it at the QR code, or type this URL into Chrome:
                </p>

                {/* Copyable link */}
                <div className="flex items-center space-x-2 bg-zinc-900 border border-zinc-700/80 rounded-xl p-2 px-3">
                  <span className="font-mono text-xs text-emerald-400 font-bold truncate flex-1">{localUrl}</span>
                  <button
                    onClick={handleCopy}
                    className="flex items-center space-x-1 px-2.5 py-1 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-xs font-semibold transition"
                  >
                    {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copied ? 'Copied' : 'Copy'}</span>
                  </button>
                </div>
              </div>
            </div>

            {/* 3 Step Android Install Walkthrough */}
            <div>
              <h4 className="text-xs font-bold text-zinc-400 uppercase tracking-wider mb-3">
                How to install onto your Android phone:
              </h4>

              <div className="space-y-2.5 text-xs">
                <div className="p-3.5 bg-zinc-950/70 border border-zinc-800 rounded-xl flex items-start space-x-3">
                  <div className="w-6 h-6 rounded-lg bg-emerald-500/20 text-emerald-400 font-bold flex items-center justify-center shrink-0 mt-0.5">
                    1
                  </div>
                  <div>
                    <strong className="text-white">Open in Google Chrome on your phone:</strong>
                    <p className="text-zinc-400 mt-0.5">Scan the QR code above or enter <code className="text-emerald-400 bg-zinc-900 px-1 py-0.5 rounded">{localUrl}</code>.</p>
                  </div>
                </div>

                <div className="p-3.5 bg-zinc-950/70 border border-zinc-800 rounded-xl flex items-start space-x-3">
                  <div className="w-6 h-6 rounded-lg bg-emerald-500/20 text-emerald-400 font-bold flex items-center justify-center shrink-0 mt-0.5">
                    2
                  </div>
                  <div>
                    <strong className="text-white">Tap the Chrome menu (⋮) at top right:</strong>
                    <p className="text-zinc-400 mt-0.5">Select <strong className="text-emerald-400">&quot;Add to Home screen&quot;</strong> or <strong className="text-emerald-400">&quot;Install app&quot;</strong>.</p>
                  </div>
                </div>

                <div className="p-3.5 bg-zinc-950/70 border border-zinc-800 rounded-xl flex items-start space-x-3">
                  <div className="w-6 h-6 rounded-lg bg-emerald-500/20 text-emerald-400 font-bold flex items-center justify-center shrink-0 mt-0.5">
                    3
                  </div>
                  <div>
                    <strong className="text-white">Tap &quot;Install&quot;:</strong>
                    <p className="text-zinc-400 mt-0.5">
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
            <div className="bg-zinc-950 border border-zinc-800 rounded-2xl p-4 space-y-2">
              <div className="flex items-center space-x-2 text-emerald-400 font-bold">
                <ShieldCheck className="w-4 h-4" />
                <span>Capacitor Native Android Project Ready</span>
              </div>
              <p className="text-zinc-300 leading-relaxed">
                We have generated the full native Android Gradle project inside the <code className="text-white bg-zinc-900 px-1.5 py-0.5 rounded">android/</code> directory with package id <code className="text-emerald-400">com.vitaltrack.app</code>.
              </p>
            </div>

            <div className="space-y-3">
              <h4 className="text-xs font-bold text-zinc-400 uppercase tracking-wider">
                To build the APK package:
              </h4>

              <div className="p-3.5 bg-zinc-950/70 border border-zinc-800 rounded-xl space-y-1.5">
                <strong className="text-white">Method A — Open in Android Studio:</strong>
                <p className="text-zinc-400">Run this command in the terminal to open the project in Android Studio:</p>
                <div className="bg-zinc-900 p-2 rounded-lg font-mono text-emerald-400 text-[11px]">
                  npx cap open android
                </div>
                <p className="text-zinc-500 text-[11px]">Then click <strong>Build &gt; Build Bundle(s) / APK(s) &gt; Build APK(s)</strong>.</p>
              </div>

              <div className="p-3.5 bg-zinc-950/70 border border-zinc-800 rounded-xl space-y-1.5">
                <strong className="text-white">Method B — Command Line Build:</strong>
                <p className="text-zinc-400">If you have Android SDK installed, run Gradle wrapper inside the project:</p>
                <div className="bg-zinc-900 p-2 rounded-lg font-mono text-emerald-400 text-[11px]">
                  cd android ; .\gradlew assembleDebug
                </div>
                <p className="text-zinc-500 text-[11px]">The output APK will be at: <code className="text-zinc-300">android/app/build/outputs/apk/debug/app-debug.apk</code></p>
              </div>
            </div>
          </div>
        )}

        <div className="pt-4 border-t border-zinc-800 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2.5 bg-zinc-800 hover:bg-zinc-700 text-zinc-200 font-semibold rounded-xl text-xs transition"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
