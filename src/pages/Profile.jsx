import React, { useState, useEffect } from 'react';
import './Profile.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faCamera,
  faCopy,
  faPenToSquare,
  faFileAlt,
  faStar,
  faTrophy,
  faFire,
  faCheck,
  faCheckSquare,
  faSquare,
  faBullseye,
  faAtom,
  faFlaskVial,
  faCog,
  faHeadset,
  faFileContract,
  faShieldHalved,
  faRightFromBracket,
  faChevronRight,
  faLock,
  faUsers, // Corrected: Added faUsers import
  faPlus, // Added for "Add Friend" button
  faUserPlus // Another option for "Add Friend"
} from '@fortawesome/free-solid-svg-icons';
import { supabase } from '../lib/supabaseClient'; // Import your Supabase client

const Profile = () => {
  const [activeTab, setActiveTab] = useState('batches');
  const [goalModalOpen, setGoalModalOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  // State for profile data
  const [profile, setProfile] = useState(null);
  const [loadingProfile, setLoadingProfile] = useState(true);
  const [profileError, setProfileError] = useState(null);

  // State for goals
  const [goals, setGoals] = useState([]);
  const [loadingGoals, setLoadingGoals] = useState(true);
  const [goalsError, setGoalsError] = useState(null);

  // State for exam history (now from user_exam_results)
  const [examHistory, setExamHistory] = useState([]);
  const [loadingExamHistory, setLoadingExamHistory] = useState(true);
  const [examHistoryError, setExamHistoryError] = useState(null);

  // State for friends
  const [friends, setFriends] = useState([]);
  const [loadingFriends, setLoadingFriends] = useState(true);
  const [friendsError, setFriendsError] = useState(null);

  // State for adding a friend
  const [addFriendModalOpen, setAddFriendModalOpen] = useState(false);
  const [friendStudentIdInput, setFriendStudentIdInput] = useState('');
  const [addFriendMessage, setAddFriendMessage] = useState(''); // Message for add friend result

  // User state
  const [user, setUser] = useState(null);

  // Effect to get the user session on component mount
  useEffect(() => {
    const getSession = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
    };
    getSession();

    // Listen for auth state changes to re-fetch if user logs in/out
    const { data: authListener } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        setUser(session.user);
      } else {
        setUser(null);
        // Clear all states if user logs out
        setProfile(null);
        setGoals([]);
        setExamHistory([]);
        setFriends([]);
      }
    });

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  // Effect to fetch data when user state changes (i.e., when user logs in/out)
  useEffect(() => {
    if (!user) {
      setLoadingProfile(false);
      setLoadingGoals(false);
      setLoadingExamHistory(false);
      setLoadingFriends(false);
      return; // Do not proceed if no user is logged in
    }

    const fetchProfile = async () => {
      setLoadingProfile(true);
      setProfileError(null);
      try {
        const { data, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single();

        if (error && error.code !== 'PGRST116') { // PGRST116 means no rows found, which is fine for new users
          throw error;
        }
        setProfile(data);
      } catch (error) {
        console.error('Error fetching profile:', error.message);
        setProfileError('Failed to load profile.');
      } finally {
        setLoadingProfile(false);
      }
    };

    const fetchGoals = async () => {
      setLoadingGoals(true);
      setGoalsError(null);
      try {
        const { data, error } = await supabase
          .from('goals')
          .select('*')
          .eq('user_id', user.id)
          .order('created_at', { ascending: true }); // Order goals for consistent display

        if (error) throw error;
        setGoals(data);
      } catch (error) {
        console.error('Error fetching goals:', error.message);
        setGoalsError('Failed to load goals.');
      } finally {
        setLoadingGoals(false);
      }
    };

    const fetchExamHistory = async () => {
      setLoadingExamHistory(true);
      setExamHistoryError(null);
      try {
        const { data, error } = await supabase
          .from('user_exam_results')
          .select(`
            *,
            exams (title, category_id)
          `)
          .eq('user_id', user.id)
          .order('exam_date', { ascending: false });

        if (error) throw error;
        setExamHistory(data);
      } catch (error) {
        console.error('Error fetching exam history:', error.message);
        setExamHistoryError('Failed to load exam history.');
      } finally {
        setLoadingExamHistory(false);
      }
    };

    const fetchFriends = async () => {
      setLoadingFriends(true);
      setFriendsError(null);
      try {
        const { data, error } = await supabase
          .from('friends')
          .select(`
            user_id,
            friend_id,
            profiles_user:profiles!user_id (
                id,
                full_name,
                daily_streak,
                leaderboard_rank,
                avatar_url
            ),
            profiles_friend:profiles!friend_id (
                id,
                full_name,
                daily_streak,
                leaderboard_rank,
                avatar_url
            )
          `)
          .or(`user_id.eq.${user.id},friend_id.eq.${user.id}`); // Fetch friends where current user is either user_id or friend_id

        if (error) throw error;

        // Process friends data to get a flat list of friend profiles
        const friendList = data.map(relation => {
          if (relation.user_id === user.id) {
            return relation.profiles_friend; // Current user is user_id, so the friend is profiles_friend
          } else {
            return relation.profiles_user; // Current user is friend_id, so the friend is profiles_user
          }
        });

        setFriends(friendList.filter(f => f !== null)); // Filter out nulls if any (shouldn't happen with good data)

      } catch (error) {
        console.error('Error fetching friends:', error.message);
        setFriendsError('Failed to load friends.'); //
      } finally {
        setLoadingFriends(false);
      }
    };

    // Call all fetch functions
    fetchProfile();
    fetchGoals();
    fetchExamHistory();
    fetchFriends(); // Call fetchFriends
  }, [user]); // Re-run when user changes (i.e., when session is loaded)

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true);
      setTimeout(() => {
        setCopied(false);
      }, 2000);
    });
  };

  const openModal = (setter) => {
    setter(true);
  };

  const closeModal = (setter) => {
    setter(false);
  };

  const updateGoals = async (updatedGoals) => {
    setLoadingGoals(true);
    setGoalsError(null);
    try {
      const { error: deleteError } = await supabase
        .from('goals')
        .delete()
        .eq('user_id', user.id);

      if (deleteError) throw deleteError;

      const goalsToInsert = updatedGoals.map((goal) => ({
        user_id: user.id,
        description: goal.description,
        is_completed: goal.is_completed,
      })).filter(goal => goal.description.trim() !== '');

      const { data, error: insertError } = await supabase
        .from('goals')
        .insert(goalsToInsert)
        .select();

      if (insertError) throw insertError;
      setGoals(data);
      closeModal(setGoalModalOpen);
    } catch (error) {
      console.error('Error updating goals:', error.message);
      setGoalsError('Failed to update goals.');
    } finally {
      setLoadingGoals(false);
    }
  };

  const handleGoalChange = (index, field, value) => {
    const newGoals = [...goals];
    if (newGoals[index]) {
      newGoals[index] = { ...newGoals[index], [field]: value };
    }
    setGoals(newGoals);
  };

  const calculateGoalProgress = () => {
    if (!goals || goals.length === 0) return 0;
    const completedGoals = goals.filter(goal => goal.is_completed).length;
    return (completedGoals / goals.length) * 100;
  };

  const handleAddFriend = async (e) => {
    e.preventDefault();
    setAddFriendMessage('');
    if (!friendStudentIdInput) {
      setAddFriendMessage('Please enter a student ID.');
      return;
    }
    if (!user) {
      setAddFriendMessage('You must be logged in to add friends.');
      return;
    }

    try {
      // 1. Find the profile of the friend using student_id
      const { data: friendProfile, error: friendProfileError } = await supabase
        .from('profiles')
        .select('id')
        .eq('student_id', friendStudentIdInput)
        .single();

      if (friendProfileError || !friendProfile) {
        if (friendProfileError && friendProfileError.code === 'PGRST116') {
          setAddFriendMessage('No user found with that student ID.');
        } else {
          throw friendProfileError;
        }
        return;
      }

      const friendId = friendProfile.id;

      if (friendId === user.id) {
        setAddFriendMessage('You cannot add yourself as a friend.');
        return;
      }

      // 2. Check if already friends (bidirectional)
      const { data: existingFriendship, error: existingError } = await supabase
        .from('friends')
        .select('*')
        .or(`and(user_id.eq.${user.id},friend_id.eq.${friendId}),and(user_id.eq.${friendId},friend_id.eq.${user.id})`);

      if (existingError) throw existingError;

      if (existingFriendship && existingFriendship.length > 0) {
        setAddFriendMessage('You are already friends with this person.');
        return;
      }

      // 3. Add friendship (create two entries for simplicity of querying from either side)
      const { error: insertError } = await supabase
        .from('friends')
        .insert([
          { user_id: user.id, friend_id: friendId },
          { user_id: friendId, friend_id: user.id } // Add reverse entry for easier querying
        ]);

      if (insertError) throw insertError;

      setAddFriendMessage('Friend added successfully!');
      setFriendStudentIdInput(''); // Clear input
      closeModal(setAddFriendModalOpen);
      // Re-fetch friends list to update UI
      const { data: updatedFriends, error: fetchError } = await supabase
          .from('friends')
          .select(`
            user_id,
            friend_id,
            profiles_user:profiles!user_id (
                id,
                full_name,
                daily_streak,
                leaderboard_rank,
                avatar_url
            ),
            profiles_friend:profiles!friend_id (
                id,
                full_name,
                daily_streak,
                leaderboard_rank,
                avatar_url
            )
          `)
          .or(`user_id.eq.${user.id},friend_id.eq.${user.id}`);

        if (fetchError) throw fetchError;

        const updatedFriendList = updatedFriends.map(relation => {
          if (relation.user_id === user.id) {
            return relation.profiles_friend;
          } else {
            return relation.profiles_user;
          }
        });
        setFriends(updatedFriendList.filter(f => f !== null));

    } catch (error) {
      console.error('Error adding friend:', error.message);
      setAddFriendMessage(`Error adding friend: ${error.message}`);
    }
  };


  if (loadingProfile || loadingGoals || loadingExamHistory || loadingFriends) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <p className="text-xl text-gray-600">Loading profile data...</p>
      </div>
    );
  }

  if (profileError || goalsError || examHistoryError || friendsError) {
    return (
      <div className="flex justify-center items-center min-h-screen text-red-600">
        <p className="text-xl">Error: {profileError || goalsError || examHistoryError || friendsError}</p>
      </div>
    );
  }

  // Fallback for profile data if not found
  const displayProfile = profile || {
    full_name: 'আপনার নাম',
    college: 'নটর ডেম কলেজ',
    class: 'দ্বাদশ শ্রেণি',
    student_id: 'N/A',
    avatar_url: 'https://placehold.co/100x100/cccccc/ffffff?text=U',
    total_exams: 0,
    highest_score: 0,
    leaderboard_rank: '#N/A',
    daily_streak: 0,
  };

  const streakDaysRemaining = 20 - (displayProfile.daily_streak || 0); // Assuming 20 days for "বিশ দিনে" badge

  return (
    <div className="max-w-4xl mx-auto p-4 sm:p-6 lg:p-8">
      {/* Profile Header */}
      <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
        <div className="flex flex-col sm:flex-row items-center gap-6">
          <div className="relative">
            <img
              className="w-24 h-24 rounded-full border-4 border-indigo-200 shadow-md"
              src={displayProfile.avatar_url || 'https://placehold.co/100x100/d9534f/ffffff?text=Y'}
              alt="Your Avatar"
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = 'https://placehold.co/100x100/cccccc/ffffff?text=U';
              }}
            />
            <button className="absolute -bottom-1 -right-1 bg-indigo-600 text-white h-8 w-8 rounded-full flex items-center justify-center border-2 border-white hover:bg-indigo-700 transition">
              <FontAwesomeIcon icon={faCamera} />
            </button>
          </div>
          <div className="text-center sm:text-left flex-grow">
            <h1 className="text-3xl font-bold text-gray-800">{displayProfile.full_name}</h1>
            <p className="text-gray-500 mt-1">{displayProfile.college}, {displayProfile.class}</p>
            <div className="mt-2 inline-flex items-center gap-2 bg-gray-100 text-gray-600 font-mono text-sm px-3 py-1 rounded-full">
              <span id="studentId">{displayProfile.student_id}</span>
              <button onClick={() => copyToClipboard(displayProfile.student_id)} id="copyButton" className="text-gray-400 hover:text-indigo-600">
                <FontAwesomeIcon icon={copied ? faCheck : faCopy} className={copied ? 'text-green-500' : ''} />
              </button>
            </div>
          </div>
          <button className="bg-indigo-50 text-indigo-600 font-semibold py-2 px-5 rounded-full hover:bg-indigo-100 transition-all">
            <FontAwesomeIcon icon={faPenToSquare} className="mr-2" />
            প্রোফাইল এডিট
          </button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="bg-white rounded-2xl shadow-lg p-4 mb-8">
        <div className="flex justify-around items-center text-center">
          {/* Stat 1 */}
          <div className="w-1/3">
            <FontAwesomeIcon icon={faFileAlt} className="text-2xl sm:text-3xl text-blue-500 mb-2" />
            <p className="text-2xl sm:text-3xl font-bold text-gray-800">{displayProfile.total_exams}</p>
            <p className="text-xs sm:text-base text-gray-500">মোট পরীক্ষা</p>
          </div>
          {/* Divider */}
          <div className="h-16 w-px bg-gray-200"></div>
          {/* Stat 2 */}
          <div className="w-1/3">
            <FontAwesomeIcon icon={faStar} className="text-2xl sm:text-3xl text-amber-500 mb-2" />
            <p className="text-2xl sm:text-3xl font-bold text-gray-800">{displayProfile.highest_score}</p>
            <p className="text-xs sm:text-base text-gray-500">সর্বোচ্চ স্কোর</p>
          </div>
          {/* Divider */}
          <div className="h-16 w-px bg-gray-200"></div>
          {/* Stat 3 */}
          <div className="w-1/3">
            <FontAwesomeIcon icon={faTrophy} className="text-2xl sm:text-3xl text-green-500 mb-2" />
            <p className="text-2xl sm:text-3xl font-bold text-gray-800">#{displayProfile.leaderboard_rank}</p>
            <p className="text-xs sm:text-base text-gray-500">লিডারবোর্ড র‍্যাঙ্ক</p>
          </div>
        </div>
      </div>

      {/* Daily Streak Section */}
      <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
        <h2 className="text-xl font-bold text-gray-800 mb-1 flex items-center gap-3">
          <FontAwesomeIcon icon={faFire} className="text-orange-500" />
          দৈনিক স্ট্রিক: {displayProfile.daily_streak} দিন
        </h2>
        <p className="text-sm text-gray-500 mb-6">
          "বিশ দিনে" ব্যাজটি পেতে আর {streakDaysRemaining > 0 ? `${streakDaysRemaining} দিন` : '০ দিন'} স্ট্রিক বজায় রাখুন।
        </p>
        <div className="w-full mb-8">
          <div className="relative">
            <div className="absolute top-4 left-0 w-full h-0.5 bg-gray-200"></div>
            <div className="absolute top-4 left-0 h-0.5 bg-green-500" style={{ width: `${Math.min((displayProfile.daily_streak / 20) * 100, 100)}%` }}></div>
            <div className="relative flex justify-between">
              {Array.from({ length: 7 }).map((_, i) => {
                const day = (displayProfile.daily_streak - 3) + i; // Adjust to show around current streak
                const isCurrent = day === displayProfile.daily_streak;
                const isCompleted = day < displayProfile.daily_streak;
                // const isFuture = day > displayProfile.daily_streak; // Not directly used in styling here

                return (
                  <div key={i} className="text-center w-1/7">
                    <div className={`
                        w-8 h-8 mx-auto rounded-full border-2 border-white flex items-center justify-center
                        ${isCurrent ? 'w-9 h-9 bg-orange-500 ring-2 ring-orange-200 text-white' :
                          isCompleted ? 'bg-green-500 text-white' :
                          'bg-gray-300'}
                    `}>
                      {isCurrent && <FontAwesomeIcon icon={faFire} />}
                      {isCompleted && <FontAwesomeIcon icon={faCheck} />}
                    </div>
                    <p className={`text-xs mt-2 ${isCurrent ? 'font-bold text-orange-600' : isCompleted ? 'text-gray-500' : 'text-gray-400'}`}>
                      {day > 0 ? `দিন ${day}` : ''}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
        <div>
          <h3 className="text-base font-bold text-gray-700 mb-3">আপনার ব্যাজসমূহ</h3>
          <div className="grid grid-cols-4 sm:grid-cols-7 gap-x-2 gap-y-4 text-center">
            <div className="flex flex-col items-center">
              <div className="w-16 h-16 rounded-xl bg-red-500/20 flex items-center justify-center p-1">
                <div className="w-full h-full rounded-lg bg-red-500 text-white font-bold flex items-center justify-center text-xl shadow-inner">
                  ১০
                </div>
              </div>
              <p className="text-xs font-semibold mt-2">দশ দিনে</p>
            </div>
            <div className="flex flex-col items-center">
              <div className="w-16 h-16 rounded-xl bg-indigo-500/20 flex items-center justify-center p-1">
                <div className="w-full h-full rounded-lg bg-indigo-500 text-white flex items-center justify-center shadow-inner">
                  <FontAwesomeIcon icon={faShieldHalved} className="text-3xl" />
                </div>
              </div>
              <p className="text-xs font-semibold mt-2">বিশ দিনে</p>
            </div>
            <div className="flex flex-col items-center opacity-60">
              <div className="w-16 h-16 rounded-xl bg-gray-500/20 flex items-center justify-center p-1">
                <div className="w-full h-full rounded-lg bg-gray-400 text-white flex items-center justify-center shadow-inner">
                  <FontAwesomeIcon icon={faLock} className="text-2xl" />
                </div>
              </div>
              <p className="text-xs font-semibold text-gray-500 mt-2">পঁচিশ দিনে</p>
            </div>
            <div className="flex flex-col items-center opacity-60">
              <div className="w-16 h-16 rounded-xl bg-gray-500/20 flex items-center justify-center p-1">
                <div className="w-full h-full rounded-lg bg-gray-400 text-white flex items-center justify-center shadow-inner">
                  <FontAwesomeIcon icon={faLock} className="text-2xl" />
                </div>
              </div>
              <p className="text-xs font-semibold text-gray-500 mt-2">অর্ধ শতক</p>
            </div>
            <div className="flex flex-col items-center opacity-60">
              <div className="w-16 h-16 rounded-xl bg-gray-500/20 flex items-center justify-center p-1">
                <div className="w-full h-full rounded-lg bg-gray-400 text-white flex items-center justify-center shadow-inner">
                  <FontAwesomeIcon icon={faLock} className="text-2xl" />
                </div>
              </div>
              <p className="text-xs font-semibold text-gray-500 mt-2">পঁচাত্তর দিনে</p>
            </div>
            <div className="flex flex-col items-center opacity-60">
              <div className="w-16 h-16 rounded-xl bg-gray-500/20 flex items-center justify-center p-1">
                <div className="w-full h-full rounded-lg bg-gray-400 text-white flex items-center justify-center shadow-inner">
                  <FontAwesomeIcon icon={faLock} className="text-2xl" />
                </div>
              </div>
              <p className="text-xs font-semibold text-gray-500 mt-2">শতক</p>
            </div>
            <div className="flex flex-col items-center opacity-60">
              <div className="w-16 h-16 rounded-xl bg-gray-500/20 flex items-center justify-center p-1">
                <div className="w-full h-full rounded-lg bg-gray-400 text-white flex items-center justify-center shadow-inner">
                  <FontAwesomeIcon icon={faLock} className="text-2xl" />
                </div>
              </div>
              <p className="text-xs font-semibold text-gray-500 mt-2">সময় বিজয়ী</p>
            </div>
          </div>
        </div>
      </div>

      {/* New Informative Cards Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        {/* Goal Setting Card */}
        <div className="bg-white rounded-2xl shadow-lg p-6 flex flex-col">
          <div className="flex justify-between items-start mb-4">
            <div>
              <h2 className="text-xl font-bold text-gray-800 flex items-center gap-3">
                <FontAwesomeIcon icon={faBullseye} className="text-green-500" />
                সাপ্তাহিক লক্ষ্য
              </h2>
              <p className="text-sm text-gray-500 mt-1">আপনার লক্ষ্যের দিকে এগিয়ে যান।</p>
            </div>
            <button onClick={() => openModal(setGoalModalOpen)} className="text-sm font-semibold text-indigo-600 hover:underline flex-shrink-0">
              এডিট
            </button>
          </div>
          <div className="flex-grow h-32 overflow-y-auto custom-scrollbar pr-2 mb-4">
            <div className="space-y-3">
              {goals.map((goal, index) => (
                <div key={goal.id || `goal-${index}`} className="flex items-center gap-3">
                  {goal.is_completed ? (
                    <FontAwesomeIcon icon={faCheckSquare} className="text-green-500 text-xl" />
                  ) : (
                    <FontAwesomeIcon icon={faSquare} className="text-gray-400 text-xl" />
                  )}
                  <p className={`${goal.is_completed ? 'text-gray-700' : 'text-gray-500'} flex-grow`}>{goal.description}</p>
                </div>
              ))}
              {goals.length === 0 && <p className="text-gray-500">কোনো লক্ষ্য সেট করা হয়নি।</p>}
            </div>
          </div>
          <div>
            <div className="flex justify-between items-center mb-1">
              <p className="text-sm font-semibold text-gray-600">অগ্রগতি</p>
              <p className="text-sm font-bold text-green-600">{calculateGoalProgress().toFixed(0)}%</p>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2.5">
              <div className="bg-green-500 h-2.5 rounded-full" style={{ width: `${calculateGoalProgress()}%` }}></div>
            </div>
          </div>
        </div>
        {/* Study Group / Friends Card */}
        <div className="bg-white rounded-2xl shadow-lg p-6 flex flex-col">
          <div className="flex justify-between items-start mb-4">
            <div>
              <h2 className="text-xl font-bold text-gray-800 flex items-center gap-3">
                <FontAwesomeIcon icon={faUsers} className="text-blue-500" /> {/* Corrected: Using faUsers */}
                স্টাডি গ্রুপ
              </h2>
              <p className="text-sm text-gray-500 mt-1">আপনার বন্ধুদের তালিকা।</p>
            </div>
            <button
              onClick={() => openModal(setAddFriendModalOpen)}
              className="text-sm font-semibold text-indigo-600 hover:underline flex-shrink-0 flex items-center gap-1"
            >
              <FontAwesomeIcon icon={faUserPlus} /> বন্ধু যোগ করুন
            </button>
          </div>
          <div className="flex-grow h-40 overflow-y-auto custom-scrollbar pr-2">
            {friends.length > 0 ? (
              <div className="space-y-3">
                {friends.map((friend) => (
                  <div key={friend.id} className="flex items-center gap-3">
                    <img
                      className="w-8 h-8 rounded-full border border-gray-200"
                      src={friend.avatar_url || 'https://placehold.co/32x32/cccccc/ffffff?text=F'}
                      alt={friend.full_name}
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = 'https://placehold.co/32x32/cccccc/ffffff?text=F';
                      }}
                    />
                    <div className="flex-grow">
                      <p className="font-semibold text-gray-800">{friend.full_name}</p>
                      <p className="text-xs text-gray-500">স্ট্রিক: {friend.daily_streak || 0} দিন</p>
                    </div>
                    <span className="text-sm text-gray-600">#{friend.leaderboard_rank || 'N/A'}</span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500">আপনার কোনো বন্ধু নেই। একটি নতুন বন্ধু যোগ করুন!</p>
            )}
          </div>
        </div>
      </div>

      {/* Tab Section */}
      <div className="mb-8">
        <div className="border-b border-gray-200 mb-6">
          <nav className="flex space-x-4 sm:space-x-6" aria-label="Tabs">
            <button
              id="tab-batches"
              onClick={() => setActiveTab('batches')}
              className={`whitespace-nowrap pb-4 px-1 border-b-2 font-bold text-lg ${
                activeTab === 'batches' ? 'tab-active text-indigo-600' : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
              }`}
            >
              আমার ব্যাচসমূহ
            </button>
            <button
              id="tab-history"
              onClick={() => setActiveTab('history')}
              className={`whitespace-nowrap pb-4 px-1 border-b-2 font-bold text-lg ${
                activeTab === 'history' ? 'tab-active text-indigo-600' : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
              }`}
            >
              পরীক্ষার ইতিহাস
            </button>
          </nav>
        </div>
        {/* Tab Content */}
        <div id="content-batches" className={`${activeTab === 'batches' ? 'block' : 'hidden'} space-y-4`}>
          <div className="bg-white p-5 rounded-xl shadow-lg flex items-center gap-4 hover:shadow-xl transition-shadow">
            <div className="bg-green-100 text-green-600 h-12 w-12 rounded-lg flex-shrink-0 flex items-center justify-center">
              <FontAwesomeIcon icon={faCheck} className="fa-lg" />
            </div>
            <div className="flex-grow">
              <h3 className="font-bold text-lg text-gray-800">HSC 2025 ফাইনাল রিভিশন</h3>
              <p className="text-sm text-gray-500">বিজ্ঞান বিভাগ</p>
            </div>
            <a href="#" className="text-indigo-600 font-semibold text-sm hover:underline">
              প্রবেশ করুন &rarr;
            </a>
          </div>
          <div className="bg-white p-5 rounded-xl shadow-lg flex items-center gap-4 hover:shadow-xl transition-shadow">
            <div className="bg-blue-100 text-blue-600 h-12 w-12 rounded-lg flex-shrink-0 flex items-center justify-center">
              <FontAwesomeIcon icon={faUsers} className="fa-lg" />
            </div>
            <div className="flex-grow">
              <h3 className="font-bold text-lg text-gray-800">মেডিকেল অ্যাডমিশন ২০২৫</h3>
              <p className="text-sm text-gray-500">পূর্ণাঙ্গ প্রস্তুতি কোর্স</p>
            </div>
            <a href="#" className="text-indigo-600 font-semibold text-sm hover:underline">
              প্রবেশ করুন &rarr;
            </a>
          </div>
        </div>
        <div id="content-history" className={`${activeTab === 'history' ? 'block' : 'hidden'} space-y-4`}>
          {loadingExamHistory ? (
            <p>Loading exam history...</p>
          ) : examHistoryError ? (
            <p className="text-red-500">{examHistoryError}</p>
          ) : examHistory.length > 0 ? (
            examHistory.map((exam) => (
              <div key={exam.id} className="bg-white p-5 rounded-xl shadow-lg flex items-center gap-4 hover:shadow-xl transition-shadow">
                <div className="bg-blue-100 text-blue-600 h-12 w-12 rounded-lg flex-shrink-0 flex items-center justify-center">
                  {/* Choose icon based on category_id or exam title */}
                  <FontAwesomeIcon icon={
                    exam.exams?.category_id === 'Admission' ? faFlaskVial :
                    exam.exams?.category_id === 'BCS' ? faFileAlt :
                    faAtom // Default or another specific icon
                  } className="fa-lg" />
                </div>
                <div className="flex-grow">
                  <h3 className="font-semibold text-lg text-gray-800">{exam.exams?.title || 'Unknown Exam'}</h3>
                  <p className="text-sm text-gray-500">তারিখ: {new Date(exam.exam_date).toLocaleDateString('bn-BD', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
                </div>
                <div className="text-right">
                  <p className="font-bold text-xl text-green-600">{exam.score}/{exam.total_score}</p>
                  <a href="#" className="text-indigo-600 font-semibold text-sm hover:underline">
                    বিস্তারিত দেখুন &rarr;
                  </a>
                </div>
              </div>
            ))
          ) : (
            <p className="text-gray-500">কোনো পরীক্ষার ইতিহাস নেই।</p>
          )}
        </div>
      </div>

      {/* Account Settings Section */}
      <div className="bg-white rounded-2xl shadow-lg p-6">
        <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-3">
          <FontAwesomeIcon icon={faCog} className="text-indigo-500" />
          অ্যাকাউন্ট
        </h2>
        <div className="divide-y divide-gray-100">
          <a href="#" className="flex items-center justify-between p-3 hover:bg-gray-50/80 transition-colors rounded-lg">
            <div className="flex items-center gap-4">
              <FontAwesomeIcon icon={faCog} className="text-gray-500 w-5 text-center" />
              <span>সেটিংস</span>
            </div>
            <FontAwesomeIcon icon={faChevronRight} className="text-gray-400" />
          </a>
          <a href="#" className="flex items-center justify-between p-3 hover:bg-gray-50/80 transition-colors rounded-lg">
            <div className="flex items-center gap-4">
              <FontAwesomeIcon icon={faHeadset} className="text-gray-500 w-5 text-center" />
              <span>সহায়তা</span>
            </div>
            <FontAwesomeIcon icon={faChevronRight} className="text-gray-400" />
          </a>
          <a href="#" className="flex items-center justify-between p-3 hover:bg-gray-50/80 transition-colors rounded-lg">
            <div className="flex items-center gap-4">
              <FontAwesomeIcon icon={faFileContract} className="text-gray-500 w-5 text-center" />
              <span>নীতিমালা</span>
            </div>
            <FontAwesomeIcon icon={faChevronRight} className="text-gray-400" />
          </a>
          <a href="#" className="flex items-center justify-between p-3 text-red-600 hover:bg-red-50/80 transition-colors rounded-lg">
            <div className="flex items-center gap-4">
              <FontAwesomeIcon icon={faRightFromBracket} className="w-5 text-center" />
              <span>লগ আউট</span>
            </div>
            <FontAwesomeIcon icon={faChevronRight} className="text-red-400" />
          </a>
        </div>
      </div>

      {/* Goal Setting Modal */}
      {goalModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md shadow-xl animate-fade-in-up">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">সাপ্তাহিক লক্ষ্য সেট করুন</h2>
            <div className="space-y-4 max-h-80 overflow-y-auto custom-scrollbar pr-2">
              {goals.map((goal, index) => (
                <div key={goal.id || `edit-goal-${index}`} className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    checked={goal.is_completed || false}
                    onChange={(e) => handleGoalChange(index, 'is_completed', e.target.checked)}
                    className="h-5 w-5 text-indigo-600 rounded focus:ring-indigo-500"
                  />
                  <input
                    type="text"
                    value={goal.description || ''}
                    onChange={(e) => handleGoalChange(index, 'description', e.target.value)}
                    className="flex-grow border border-gray-300 rounded-md px-3 py-2 focus:ring-indigo-500 focus:border-indigo-500 text-gray-800"
                    placeholder="আপনার লক্ষ্য লিখুন..."
                  />
                  {/* Option to remove a goal */}
                  {index > 0 && (
                    <button
                      onClick={() => setGoals(goals.filter((_, i) => i !== index))}
                      className="text-red-500 hover:text-red-700"
                      title="Remove Goal"
                    >
                      <FontAwesomeIcon icon={faTimesCircle} /> {/* Using a suitable icon like faTimesCircle */}
                    </button>
                  )}
                </div>
              ))}
              <button
                onClick={() => setGoals([...goals, { description: '', is_completed: false }])}
                className="w-full bg-indigo-100 text-indigo-700 font-semibold py-2 rounded-md hover:bg-indigo-200 transition"
              >
                আরেকটি লক্ষ্য যোগ করুন
              </button>
            </div>
            <div className="mt-6 flex justify-end gap-3">
              <button
                onClick={() => closeModal(setGoalModalOpen)}
                className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 transition"
              >
                বাতিল করুন
              </button>
              <button
                onClick={() => updateGoals(goals)}
                className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition"
              >
                সেভ করুন
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add Friend Modal */}
      {addFriendModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md shadow-xl animate-fade-in-up">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">বন্ধু যোগ করুন</h2>
            <form onSubmit={handleAddFriend}>
              <div className="mb-4">
                <label htmlFor="friendStudentId" className="block text-gray-700 text-sm font-bold mb-2">
                  বন্ধুর স্টুডেন্ট আইডি:
                </label>
                <input
                  type="text"
                  id="friendStudentId"
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                  placeholder="যেমন: ND-2025-A001"
                  value={friendStudentIdInput}
                  onChange={(e) => setFriendStudentIdInput(e.target.value)}
                />
              </div>
              {addFriendMessage && (
                <p className={`mb-4 text-sm ${addFriendMessage.includes('Error') ? 'text-red-500' : 'text-green-500'}`}>
                  {addFriendMessage}
                </p>
              )}
              <div className="flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => closeModal(setAddFriendModalOpen)}
                  className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 transition"
                >
                  বাতিল করুন
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition"
                >
                  যোগ করুন
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Profile;