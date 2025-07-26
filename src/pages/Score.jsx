import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient'; // Assuming your Supabase client is here
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faStar,
  faAward,
  faTrophy,
  faFire,
  faCheckCircle,
  faGem,
  faBolt,
  faMedal
} from '@fortawesome/free-solid-svg-icons';

const Score = () => {
  const [userProfile, setUserProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Placeholder for achievements data (you would fetch this from Supabase)
  // Assuming a structure where each achievement has an id, name, description, and points
  const [achievements, setAchievements] = useState([
    { id: 1, name: 'প্রথম পরীক্ষা', description: 'প্রথম মডেল টেস্ট সফলভাবে সম্পন্ন করেছেন।', points: 50, icon: faStar, achieved: true },
    { id: 2, name: 'সাপ্তাহিক স্ট্রিক', description: 'টানা ৭ দিন প্র্যাকটিস করেছেন।', points: 100, icon: faFire, achieved: true },
    { id: 3, name: 'রসায়ন মাস্টার', description: 'রসায়নের সকল অধ্যায় সম্পন্ন করেছেন।', points: 200, icon: faAward, achieved: false },
    { id: 4, name: 'শীর্ষস্থান অর্জনকারী', description: 'মাসিক লিডারবোর্ডে শীর্ষ ১০-এ এসেছেন।', points: 500, icon: faTrophy, achieved: false },
    { id: 5, name: '৫০ পরীক্ষা', description: '৫০টি মডেল টেস্ট সম্পন্ন করেছেন।', points: 250, icon: faCheckCircle, achieved: true },
    { id: 6, name: 'গোল্ড মেম্বার', description: 'প্রিমিয়াম সাবস্ক্রিপশন অর্জন করেছেন।', points: 300, icon: faGem, achieved: true },
    { id: 7, name: 'দ্রুত সমাধান', description: 'একটি পরীক্ষায় দ্রুততম সময়ে উত্তর দিয়েছেন।', points: 75, icon: faBolt, achieved: false },
    { id: 8, name: 'সুপার স্টুডেন্ট', description: 'মোট ৫০০০০ পয়েন্ট অর্জন করেছেন।', points: 1000, icon: faMedal, achieved: false },
  ]);

  useEffect(() => {
    const fetchUserProfileAndAchievements = async () => {
      setLoading(true);
      setError(null);
      try {
        const { data: { user } } = await supabase.auth.getUser();

        if (!user) {
          setError("User not authenticated.");
          setLoading(false);
          return;
        }

        // Fetch user profile (to get total_score)
        const { data: profileData, error: profileError } = await supabase
          .from('profiles')
          .select('full_name, total_score') // Assuming total_score is in profiles table
          .eq('id', user.id)
          .single();

        if (profileError && profileError.code !== 'PGRST116') { // PGRST116 means no rows found
          throw profileError;
        }
        setUserProfile(profileData);

        // In a real application, you would fetch user-specific achievements here.
        // For now, we're using the static 'achievements' array.
        // If you had a 'user_achievements' table, it might look like this:
        /*
        const { data: userAchievementsData, error: userAchievementsError } = await supabase
          .from('user_achievements')
          .select('*')
          .eq('user_id', user.id);

        if (userAchievementsError) throw userAchievementsError;
        // Merge fetched achievements with your static list, or just use fetched data
        // setAchievements(userAchievementsData.map(ua => ({ ...ua, achieved: true })));
        */

      } catch (err) {
        console.error("Error fetching user data or achievements:", err.message);
        setError("Failed to load score and achievements.");
      } finally {
        setLoading(false);
      }
    };

    fetchUserProfileAndAchievements();

    // Listen for auth changes to re-fetch data if user logs in/out
    const { data: authListener } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        fetchUserProfileAndAchievements(); // Re-fetch if user logs in
      } else {
        setUserProfile(null);
        setLoading(false);
      }
    });

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen pt-16">
        <p className="text-xl text-gray-600">স্কোর এবং অ্যাচিভমেন্ট লোড হচ্ছে...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-screen pt-16 text-red-600">
        <p className="text-xl">এরর: {error}</p>
      </div>
    );
  }

  const totalPoints = userProfile?.total_score || 0;
  const userName = userProfile?.full_name || 'প্রিয় শিক্ষার্থী';

  return (
    <div className="max-w-4xl mx-auto p-4 sm:p-6 lg:p-8 pt-16"> {/* Added pt-16 for navbar spacing */}
      <header className="text-center mb-10">
        <h1 className="text-4xl font-bold text-gray-800 mb-2">আপনার স্কোরবোর্ড</h1>
        <p className="text-lg text-gray-600">
          {userName}, আপনার অর্জিত পয়েন্ট এবং ব্যাজসমূহ দেখুন!
        </p>
      </header>

      {/* Total Score Card */}
      <div className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-2xl shadow-lg p-8 mb-10 text-center transform transition-all duration-300 hover:scale-[1.01] hover:shadow-xl">
        <FontAwesomeIcon icon={faStar} className="text-5xl mb-4 text-yellow-300 animate-pulse" />
        <p className="text-xl font-semibold mb-2">মোট অর্জিত পয়েন্ট:</p>
        <p className="text-6xl font-extrabold">{totalPoints.toLocaleString('bn-BD')}</p>
      </div>

      {/* Achievements Section */}
      <section className="mb-10">
        <h2 className="text-3xl font-bold text-gray-800 mb-6 text-center">আপনার অ্যাচিভমেন্টস</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {achievements.map((achievement) => (
            <div
              key={achievement.id}
              className={`bg-white rounded-xl shadow-md p-6 flex items-center space-x-4 transition-all duration-200
                ${achievement.achieved ? 'border-2 border-green-400 hover:shadow-lg' : 'opacity-60 border border-gray-200'}
                transform hover:-translate-y-1`}
            >
              <div className={`flex-shrink-0 w-12 h-12 rounded-full flex items-center justify-center text-xl
                ${achievement.achieved ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-400'}`}>
                <FontAwesomeIcon icon={achievement.icon} />
              </div>
              <div className="flex-grow">
                <h3 className={`font-semibold text-lg ${achievement.achieved ? 'text-gray-800' : 'text-gray-500'}`}>
                  {achievement.name}
                </h3>
                <p className={`text-sm ${achievement.achieved ? 'text-gray-600' : 'text-gray-400'}`}>
                  {achievement.description}
                </p>
                {achievement.achieved && (
                  <p className="text-xs font-bold text-green-500 mt-1">
                    +{achievement.points} পয়েন্ট
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Call to Action for more achievements */}
      <div className="bg-indigo-50 rounded-2xl p-8 text-center shadow-md">
        <h2 className="text-2xl font-bold text-indigo-800 mb-4">আরও পয়েন্ট অর্জন করুন!</h2>
        <p className="text-indigo-700 mb-6">
          নিয়মিত পরীক্ষা দিন, লেকচার দেখুন এবং অ্যাসাইনমেন্ট সম্পন্ন করে নতুন নতুন অ্যাচিভমেন্ট আনলক করুন!
        </p>
        <button
          onClick={() => alert('Take me to Exams!')} // Replace with actual navigation
          className="bg-indigo-600 text-white px-6 py-3 rounded-full font-semibold hover:bg-indigo-700 transition-colors shadow-lg hover:shadow-xl transform hover:-translate-y-1"
        >
          এখনই পরীক্ষা দিন
        </button>
      </div>
    </div>
  );
};

export default Score;
