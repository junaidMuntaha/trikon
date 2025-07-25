import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faBell,
  faAtom,
  faFlaskVial,
  faCalculator,
  faDna,
  faLaptopCode,
  faBookOpenReader,
  faSpellCheck,
  faSquarePollVertical,
  faStar,
  faAward,
  faTrophy,
  faLayerGroup,
  faClock,
  faTags,
  faGear,
  faCheck,
  faTimesCircle
} from '@fortawesome/free-solid-svg-icons';
// import { supabase } from '../lib/supabaseClient'; // Uncomment if using Supabase

// --- External Fonts & CSS Loader (Optional but included here) ---
const StyleLoader = () => {
  useEffect(() => {
    const loadStylesheet = (id, href) => {
      if (document.getElementById(id)) return;
      const link = document.createElement('link');
      link.id = id;
      link.rel = 'stylesheet';
      link.href = href;
      document.head.appendChild(link);
    };

    if (!document.getElementById('google-fonts-preconnect-1')) {
      const preconnect1 = document.createElement('link');
      preconnect1.id = 'google-fonts-preconnect-1';
      preconnect1.rel = 'preconnect';
      preconnect1.href = 'https://fonts.googleapis.com';
      document.head.appendChild(preconnect1);
    }
    if (!document.getElementById('google-fonts-preconnect-2')) {
      const preconnect2 = document.createElement('link');
      preconnect2.id = 'google-fonts-preconnect-2';
      preconnect2.rel = 'preconnect';
      preconnect2.href = 'https://fonts.gstatic.com';
      preconnect2.crossOrigin = 'true';
      document.head.appendChild(preconnect2);
    }

    loadStylesheet(
      'google-fonts-css',
      'https://fonts.googleapis.com/css2?family=Hind+Siliguri:wght@400;500;600;700&display=swap'
    );

    loadStylesheet(
      'font-awesome-css',
      'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css'
    );
  }, []);

  return null;
};

// --- Icon and Color Configuration ---
const iconMap = {
  physics: { icon: faAtom, color: 'bg-sky-100 text-sky-600' },
  chemistry: { icon: faFlaskVial, color: 'bg-emerald-100 text-emerald-600' },
  math: { icon: faCalculator, color: 'bg-orange-100 text-orange-600' },
  biology: { icon: faDna, color: 'bg-lime-100 text-lime-600' },
  ict: { icon: faLaptopCode, color: 'bg-slate-100 text-slate-600' },
  bangla: { icon: faBookOpenReader, color: 'bg-rose-100 text-rose-600' },
  english: { icon: faSpellCheck, color: 'bg-blue-100 text-blue-600' },
  result: { icon: faSquarePollVertical, color: 'bg-green-100 text-green-600' },
  score: { icon: faStar, color: 'bg-yellow-100 text-yellow-600' },
  achieve: { icon: faAward, color: 'bg-amber-100 text-amber-600' },
  leaderboard: { icon: faTrophy, color: 'bg-purple-100 text-purple-600' },
  new_batch: { icon: faLayerGroup, color: 'bg-indigo-100 text-indigo-600' },
  reminder: { icon: faClock, color: 'bg-cyan-100 text-cyan-600' },
  offer: { icon: faTags, color: 'bg-pink-100 text-pink-600' },
  setting: { icon: faGear, color: 'bg-gray-200 text-gray-700' },
  default: { icon: faBell, color: 'bg-gray-100 text-gray-600' }
};

// --- Single Notification Item ---
const NotificationItem = ({ notification, onMarkAsRead }) => {
  const config = iconMap[notification.type] || iconMap['default'];
  const readClass = notification.read ? 'opacity-60' : '';

  const formatTime = (timestamp) => {
    if (!timestamp) return '';
    try {
      const date = new Date(timestamp);
      const now = new Date();
      const diffMs = now.getTime() - date.getTime();
      const diffMinutes = Math.round(diffMs / (1000 * 60));
      const diffHours = Math.round(diffMs / (1000 * 60 * 60));
      const diffDays = Math.round(diffMs / (1000 * 60 * 60 * 24));

      if (diffMinutes < 60) return `${diffMinutes} মিনিট আগে`;
      if (diffHours < 24) return `${diffHours} ঘন্টা আগে`;
      if (diffDays < 7) return `${diffDays} দিন আগে`;
      return date.toLocaleDateString('bn-BD', {
        day: 'numeric',
        month: 'long',
        year: 'numeric'
      });
    } catch (e) {
      console.error('Error formatting time:', e);
      return String(timestamp);
    }
  };

  return (
    <a
      href={notification.url}
      className={`animate-fadeInUp block bg-white/70 backdrop-blur-sm p-4 rounded-xl shadow-md hover:shadow-lg hover:scale-[1.02] transition-all duration-300 flex items-center gap-4 ${readClass}`}
      onClick={() => onMarkAsRead(notification.id)}
    >
      <div className={`${config.color} h-12 w-12 rounded-full flex items-center justify-center text-xl`}>
        <FontAwesomeIcon icon={config.icon} />
      </div>
      <div className="flex-grow">
        <p className="font-bold text-gray-800">{notification.title}</p>
        <p className="text-sm text-gray-600 mt-1">{notification.message}</p>
      </div>
      <div className="text-right flex-shrink-0 w-24">
        <p className="text-xs text-gray-500 font-medium">{formatTime(notification.time)}</p>
        {!notification.read && (
          <div className="h-2.5 w-2.5 bg-indigo-500 rounded-full mt-2 ml-auto"></div>
        )}
      </div>
    </a>
  );
};

// --- Main Component ---
const Notifications = () => {
  const [notifications, setNotifications] = useState([
    { id: 1, type: 'result', title: 'ফলাফল প্রকাশিত হয়েছে!', message: 'আপনার "রসায়ন পেপার ফাইনাল" পরীক্ষার ফলাফল প্রকাশিত হয়েছে।', time: '2025-07-25T23:10:00Z', read: false, url: '#/results/exam/123' },
    { id: 2, type: 'new_batch', title: 'নতুন এক্সাম ব্যাচ চালু হয়েছে', message: '"HSC 2026 Mission 100" ব্যাচে ভর্তি চলছে।', time: '2025-07-25T21:00:00Z', read: false, url: '#/batches/hsc-2026' },
    { id: 3, type: 'physics', title: 'নতুন পদার্থবিজ্ঞান লেকচার', message: '"ভেক্টর" অধ্যায়ের উপর নতুন লেকচার যোগ করা হয়েছে।', time: '2025-07-25T19:00:00Z', read: false, url: '#/lectures/physics/vector' },
    { id: 4, type: 'ict', title: 'আইসিটি এসাইনমেন্ট', message: '"ডেটাবেস ম্যানেজমেন্ট" এর উপর নতুন এসাইনমেন্ট দেওয়া হয়েছে।', time: '2025-07-25T15:00:00Z', read: false, url: '#/assignments/ict/dbms' },
    { id: 5, type: 'reminder', title: 'আসন্ন পরীক্ষার রিমাইন্ডার', message: 'আপনার "গণিত ফাইনাল মডেল টেস্ট" আজ রাত ৮:০০ টায় অনুষ্ঠিত হবে।', time: '2025-07-24T20:00:00Z', read: true, url: '#/exams/math-final' },
    { id: 6, type: 'offer', title: 'বিশেষ ছাড়!', message: 'সকল এক্সাম ব্যাচে ২০% ছাড় চলছে! প্রোমো কোড: EXAM20।', time: '2025-07-22T10:00:00Z', read: true, url: '#/offers' },
    { id: 7, type: 'leaderboard', title: 'লিডারবোর্ড আপডেট', message: 'গত সপ্তাহের পরীক্ষার লিডারবোর্ড আপডেট করা হয়েছে।', time: '2025-07-20T12:00:00Z', read: true, url: '#/leaderboard/weekly' },
    { id: 8, type: 'achieve', title: 'নতুন অ্যাচিভমেন্ট আনলক!', message: 'আপনি "টপ স্কোরার - জীববিজ্ঞান" ব্যাজটি অর্জন করেছেন।', time: '2025-07-19T09:00:00Z', read: true, url: '#/profile/achievements' },
    { id: 9, type: 'bangla', title: 'বাংলা ব্যাকরণ কুইজ', message: '"সমাস" এর উপর একটি নতুন কুইজ যোগ করা হয়েছে।', time: '2025-07-18T14:00:00Z', read: true, url: '#/quizzes/bangla/shomash' }
  ]);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const markNotificationAsRead = (id) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  };

  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const newNotifications = notifications.filter((n) => !n.read);
  const earlierNotifications = notifications.filter((n) => n.read);

  return (
    <>
      <StyleLoader />
      <div className="max-w-3xl mx-auto p-4 sm:p-6 lg:p-8 min-h-screen" style={{ fontFamily: "'Hind Siliguri', sans-serif" }}>
        <header className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 flex items-center gap-3">
            <FontAwesomeIcon icon={faBell} className="text-indigo-500" />
            নোটিফিকেশন
          </h1>
          {newNotifications.length > 0 && (
            <button
              onClick={markAllAsRead}
              className="text-sm font-semibold text-indigo-600 hover:text-indigo-800 transition-colors"
            >
              সবগুলো পড়া হয়েছে
            </button>
          )}
        </header>

        <div className="space-y-6">
          {newNotifications.length > 0 && (
            <div>
              <h2 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-4 px-2">নতুন</h2>
              <div className="space-y-4">
                {newNotifications.map((n) => (
                  <NotificationItem key={n.id} notification={n} onMarkAsRead={markNotificationAsRead} />
                ))}
              </div>
            </div>
          )}

          {earlierNotifications.length > 0 && (
            <div>
              {newNotifications.length > 0 && (
                <h2 className="text-sm font-bold text-gray-500 uppercase tracking-wider my-4 px-2">পুরানো</h2>
              )}
              <div className="space-y-4">
                {earlierNotifications.map((n) => (
                  <NotificationItem key={n.id} notification={n} onMarkAsRead={markNotificationAsRead} />
                ))}
              </div>
            </div>
          )}

          {notifications.length === 0 && !loading && !error && (
            <p className="text-gray-500 text-center py-10">কোনো নোটিফিকেশন নেই।</p>
          )}
        </div>
      </div>
    </>
  );
};

export default Notifications;
