import React, { useEffect, useState, useRef } from 'react';

// Exam component
const Exam = () => {
    // State to manage the current banner index
    const [currentBanner, setCurrentBanner] = useState(0);
    // Ref to store banner elements (DOM nodes) for direct manipulation
    const bannerRefs = useRef([]);
    // Ref to store the interval ID for auto-sliding
    const slideIntervalRef = useRef(null);

    // Effect to initialize the banner slider elements on component mount
    useEffect(() => {
        const slider = document.getElementById('banner-slider');
        if (slider) {
            // Store actual DOM nodes of banners in a ref
            bannerRefs.current = Array.from(slider.querySelectorAll('.banner-slide'));
        }
    }, []); // Empty dependency array means this runs once on mount

    // Effect to handle auto-sliding and initial banner display
    useEffect(() => {
        if (bannerRefs.current.length > 0) {
            showBanner(currentBanner); // Show the initial banner
            startInterval(); // Start auto-sliding

            // Cleanup function to clear the interval when the component unmounts
            return () => clearInterval(slideIntervalRef.current);
        }
    }, [currentBanner, bannerRefs.current.length]); // Re-run if currentBanner or banner count changes

    /**
     * Displays the banner at the given index and updates the pagination dots.
     * @param {number} index - The index of the banner to show.
     */
    const showBanner = (index) => {
        const banners = bannerRefs.current;
        if (index >= banners.length || index < 0) {
            return;
        }

        // Hide all banners and reset all dots to inactive state
        banners.forEach((banner) => {
            banner.classList.add('hidden', 'opacity-0'); // Hide and set opacity to 0 for transition
        });

        // Show the target banner and apply fade-in effect
        const bannerToShow = banners[index];
        if (bannerToShow) {
            bannerToShow.classList.remove('hidden'); // Make the banner visible
            // A small timeout is used to ensure the 'hidden' class is removed
            // before the opacity transition starts, allowing for smooth animation.
            setTimeout(() => {
                bannerToShow.classList.remove('opacity-0'); // Fade in the banner
            }, 20);
        }

        setCurrentBanner(index); // Update the state, which will re-render dots
    };

    /**
     * Advances the slider to the next banner.
     * Loops back to the first banner after the last one.
     */
    const nextBanner = () => {
        showBanner((currentBanner + 1) % bannerRefs.current.length);
    };

    /**
     * Starts the auto-slide interval. Clears any existing interval first.
     */
    const startInterval = () => {
        clearInterval(slideIntervalRef.current); // Clear any previous interval to prevent multiple timers
        slideIntervalRef.current = setInterval(nextBanner, 5000); // Set new interval: change banner every 5 seconds
    };

    /**
     * Resets the auto-slide interval. Useful when a user manually navigates.
     */
    const resetInterval = () => {
        startInterval(); // Simply restarts the interval
    };

    return (
        <div className="p-4 sm:p-6 lg:p-8">
            <style>
                {`
                /* Applying the Bengali font to the entire body */
                body {
                    font-family: 'Hind Siliguri', sans-serif;
                    background-color: #f0f2f5; /* A light gray background for the page */
                }
                /* CSS for smooth banner slide transition */
                .banner-slide {
                    transition: opacity 0.5s ease-in-out; /* Smooth fade-in/out effect */
                }
                /* Custom button style for a more polished look */
                .btn-primary {
                    background-color: #ffffff;
                    font-weight: 700; /* font-bold */
                    padding: 0.75rem 2rem; /* py-3 px-8 */
                    border-radius: 0.5rem; /* rounded-lg */
                    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06); /* shadow-md */
                    transition: all 0.3s ease; /* transition-transform transform hover:scale-105 */
                    max-width: 280px; /* Limit max width for buttons */
                    margin: 0 auto; /* Center the button */
                }
                .btn-primary:hover {
                    background-color: #f3f4f6; /* hover:bg-gray-100 */
                    transform: scale(1.05); /* hover:scale-105 */
                }
                /* Specific text colors for primary buttons based on banner background */
                .btn-blue { color: #2563eb; } /* text-blue-600 */
                .btn-indigo { color: #4f46e5; } /* text-indigo-600 */
                .btn-green { color: #16a34a; } /* text-green-600 */
                .btn-red { color: #dc2626; } /* text-red-600 */
                .btn-amber { color: #d97706; } /* text-amber-600 */
                .btn-teal { color: #0d9488; } /* text-teal-600 */
                .btn-pink { color: #ec4899; } /* text-pink-600 */
                `}
            </style>
            <div className="max-w-7xl mx-auto">
                {/* Header Section - Now acting as a navigation bar with improved styling */}
                <header className="mb-10 flex flex-col sm:flex-row justify-between items-center gap-6 p-4 bg-white rounded-2xl shadow-lg">
                    {/* Left side: Title and Tagline */}
                    <div className="flex-shrink-0 text-center sm:text-left">
                        <h1 className="text-3xl md:text-4xl font-bold text-gray-800">এক্সাম সেন্টার</h1>
                        <p className="text-gray-600 mt-1">আপনার পরীক্ষার প্রস্তুতিকে আরও শক্তিশালী করুন।</p>
                    </div>
                    {/* Middle: Statistics Cards (flex-grow to push profile icon to the right) */}
                    <div className="flex flex-wrap justify-center sm:justify-end items-center gap-4 mt-4 sm:mt-0 flex-grow">
                        {/* Total Exams Statistics Card */}
                        <div className="bg-white py-2 px-3 rounded-xl shadow-md flex items-center gap-3 border border-gray-100">
                            <div className="bg-blue-100 text-blue-600 rounded-full p-2">
                                <i className="fa-solid fa-file-alt text-xl"></i>
                            </div>
                            <div>
                                <p className="text-sm text-gray-500">মোট পরীক্ষা</p>
                                <p className="text-lg font-bold text-gray-800">125</p>
                            </div>
                        </div>
                        {/* Total Score Statistics Card */}
                        <div className="bg-white py-2 px-3 rounded-xl shadow-md flex items-center gap-3 border border-gray-100">
                            <div className="bg-amber-100 text-amber-600 rounded-full p-2">
                                <i className="fa-solid fa-star text-xl"></i>
                            </div>
                            <div>
                                <p className="text-sm text-gray-500">মোট স্কোর</p>
                                <p className="text-lg font-bold text-gray-800">10,500</p>
                            </div>
                        </div>
                    </div>
                    {/* Rightmost: Profile Icon */}
                    <a href="#" className="flex-shrink-0 bg-white p-3 rounded-full shadow-lg hover:bg-gray-100 transition-colors transform hover:scale-110 ml-4 sm:ml-0">
                        <i className="fa-solid fa-user-circle text-3xl text-gray-700"></i>
                    </a>
                </header>

                {/* Main Content Grid Layout (2 columns on large screens, 1 column on smaller) */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                    {/* Left/Main Column for banners and features */}
                    <div className="lg:col-span-2 space-y-8">

                        {/* Banner Slider Section */}
                        <div id="banner-slider" className="relative rounded-2xl shadow-xl overflow-hidden h-56 md:h-64">
                            {/* Banner 1: Upcoming Exam Notification */}
                            <div className="banner-slide bg-gradient-to-r from-blue-600 to-sky-500 text-white p-6 pb-12 h-full flex flex-col justify-between">
                                <div className="flex flex-col md:flex-row justify-between items-start">
                                    <div>
                                        <h2 className="text-xl md:text-2xl font-bold">আমার পরীক্ষা: নোটিশ বোর্ড</h2>
                                        <p className="opacity-90 mt-1 text-sm md:text-base">পরবর্তী পরীক্ষা: <span className="font-semibold">পদার্থবিজ্ঞান ফাইনাল মডেল টেস্ট</span></p>
                                    </div>
                                    <div className="mt-4 md:mt-0 text-center shrink-0">
                                        <div className="text-sm opacity-90">পরীক্ষা শুরু হবে</div>
                                        <div className="text-2xl md:text-3xl font-bold">আজ রাত ৮:০০ টায়</div>
                                    </div>
                                </div>
                                <div className="mt-6 text-center">
                                    <button className="btn-primary btn-blue">
                                        পরীক্ষায় প্রবেশ করুন
                                    </button>
                                </div>
                            </div>
                            {/* Banner 2: New Course Announcement */}
                            <div className="banner-slide hidden absolute inset-0 bg-gradient-to-r from-indigo-500 to-purple-500 text-white p-6 pb-12 h-full flex flex-col justify-between">
                                <div className="flex flex-col md:flex-row justify-between items-start">
                                    <div>
                                        <h2 className="text-xl md:text-2xl font-bold">নতুন কোর্স চালু হয়েছে!</h2>
                                        <p className="opacity-90 mt-1 text-sm md:text-base">কোর্স: <span className="font-semibold">ভার্সিটি 'ক' ইউনিট প্রস্তুতি</span></p>
                                    </div>
                                    <div className="mt-4 md:mt-0 text-center shrink-0">
                                        <div className="text-sm opacity-90">ভর্তি চলছে...</div>
                                        <div className="text-2xl md:text-3xl font-bold">সীমিত সংখ্যক আসন</div>
                                    </div>
                                </div>
                                <div className="mt-6 text-center">
                                    <button className="btn-primary btn-indigo">
                                        বিস্তারিত দেখুন
                                    </button>
                                </div>
                            </div>
                            {/* Banner 3: Doubt Solving Session */}
                            <div className="banner-slide hidden absolute inset-0 bg-gradient-to-r from-green-500 to-emerald-500 text-white p-6 pb-12 h-full flex flex-col justify-between">
                                <div className="flex flex-col md:flex-row justify-between items-start">
                                    <div>
                                        <h2 className="text-xl md:text-2xl font-bold">সন্দেহ সমাধান সেশন</h2>
                                        <p className="opacity-90 mt-1 text-sm md:text-base">বিষয়: <span className="font-semibold">ভৌত রসায়ন</span></p>
                                    </div>
                                    <div className="mt-4 md:mt-0 text-center shrink-0">
                                        <div className="text-sm opacity-90">এই শুক্রবার</div>
                                        <div className="text-2xl md:text-3xl font-bold">দুপুর ৩:০০ টায়</div>
                                    </div>
                                </div>
                                <div className="mt-6 text-center">
                                    <button className="btn-primary btn-green">
                                        জয়েন করুন
                                    </button>
                                </div>
                            </div>
                            {/* Banner 4: Special Discount Offer */}
                            <div className="banner-slide hidden absolute inset-0 bg-gradient-to-r from-red-500 to-rose-500 text-white p-6 pb-12 h-full flex flex-col justify-between">
                                <div className="flex flex-col md:flex-row justify-between items-start">
                                    <div>
                                        <h2 className="text-xl md:text-2xl font-bold">বিশেষ ছাড়!</h2>
                                        <p className="opacity-90 mt-1 text-sm md:text-base">সকল এক্সাম ব্যাচে ২০% ছাড়। কোড: <span className="font-semibold">EXAM20</span></p>
                                    </div>
                                    <div className="mt-4 md:mt-0 text-center shrink-0">
                                        <div className="text-sm opacity-90">অফারটি সীমিত সময়ের জন্য</div>
                                        <div className="text-2xl md:text-3xl font-bold">দ্রুত করুন!</div>
                                    </div>
                                </div>
                                <div className="mt-6 text-center">
                                    <button className="btn-primary btn-red">
                                        এখনই এনরোল করুন
                                    </button>
                                </div>
                            </div>
                            {/* Banner 5: Question Bank Update */}
                            <div className="banner-slide hidden absolute inset-0 bg-gradient-to-r from-amber-500 to-orange-500 text-white p-6 pb-12 h-full flex flex-col justify-between">
                                <div className="flex flex-col md:flex-row justify-between items-start">
                                    <div>
                                        <h2 className="text-xl md:text-2xl font-bold">প্রশ্ন ব্যাংক আপডেট</h2>
                                        <p className="opacity-90 mt-1 text-sm md:text-base">নতুন <span className="font-semibold">৫০০+ প্রশ্ন</span> যোগ করা হয়েছে</p>
                                    </div>
                                    <div className="mt-4 md:mt-0 text-center shrink-0">
                                        <div className="text-sm opacity-90">এখনই অনুশীলন করুন</div>
                                        <div className="text-2xl md:text-3xl font-bold">সকল বিষয়ের উপর</div>
                                    </div>
                                </div>
                                <div className="mt-6 text-center">
                                    <button className="btn-primary btn-amber">
                                        প্রশ্ন ব্যাংক দেখুন
                                    </button>
                                </div>
                            </div>
                            {/* Banner 6: Result Published */}
                            <div className="banner-slide hidden absolute inset-0 bg-gradient-to-r from-teal-500 to-cyan-500 text-white p-6 pb-12 h-full flex flex-col justify-between">
                                <div className="flex flex-col md:flex-row justify-between items-start">
                                    <div>
                                        <h2 className="text-xl md:text-2xl font-bold">ফলাফল প্রকাশিত হয়েছে!</h2>
                                        <p className="opacity-90 mt-1 text-sm md:text-base">পরীক্ষা: <span className="font-semibold">রসায়ন পেপার ফাইনাল</span></p>
                                    </div>
                                    <div className="mt-4 md:mt-0 text-center shrink-0">
                                        <div className="text-sm opacity-90">আপনার অবস্থান দেখুন</div>
                                        <div className="text-2xl md:text-3xl font-bold">লিডারবোর্ডে</div>
                                    </div>
                                </div>
                                <div className="mt-6 text-center">
                                    <button className="btn-primary btn-teal">
                                        ফলাফল দেখুন
                                    </button>
                                </div>
                            </div>
                            {/* Banner 7: Monthly Leaderboard Prize */}
                            <div className="banner-slide hidden absolute inset-0 bg-gradient-to-r from-pink-500 to-violet-500 text-white p-6 pb-12 h-full flex flex-col justify-between">
                                <div className="flex flex-col md:flex-row justify-between items-start">
                                    <div>
                                        <h2 className="text-xl md:text-2xl font-bold">মাসিক লিডারবোর্ড পুরস্কার</h2>
                                        <p className="opacity-90 mt-1 text-sm md:text-base">জুলাই মাসের টপারদের জন্য <span className="font-semibold">বিশেষ পুরস্কার</span></p>
                                    </div>
                                    <div className="mt-4 md:mt-0 text-center shrink-0">
                                        <div className="text-sm opacity-90">আপনার সেরাটা দিন!</div>
                                        <div className="text-2xl md:text-3xl font-bold">মেধাবী হোন</div>
                                    </div>
                                </div>
                                <div className="mt-6 text-center">
                                    <button className="btn-primary btn-pink">
                                        নিয়মাবলী দেখুন
                                    </button>
                                </div>
                            </div>

                            {/* Pagination Dots for the banner slider */}
                            <div id="banner-dots" className="absolute bottom-4 left-1/2 -translate-x-1/2 flex space-x-2">
                                {Array.from({ length: bannerRefs.current.length }).map((_, index) => (
                                    <button
                                        key={index}
                                        aria-label={`Go to slide ${index + 1}`}
                                        className={`w-3 h-3 rounded-full bg-white transition-opacity duration-300 ${
                                            currentBanner === index ? 'opacity-100' : 'opacity-50'
                                        }`}
                                        onClick={() => {
                                            showBanner(index);
                                            resetInterval();
                                        }}
                                    ></button>
                                ))}
                            </div>
                        </div>

                        {/* 1. Exam Batch Section */}
                        <section>
                            <h2 className="text-2xl font-bold text-gray-800 mb-4">এক্সাম ব্যাচ</h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {/* Enrolled Batch Card */}
                                <div className="bg-white p-6 rounded-2xl shadow-lg border-l-4 border-green-500 hover:shadow-xl transition-shadow duration-300">
                                    <h3 className="font-bold text-lg text-gray-800 mb-1">HSC 2025 ফাইনাল রিভিশন</h3>
                                    <p className="text-sm text-gray-500 mb-4">বিজ্ঞান বিভাগ</p>
                                    <div className="flex justify-between items-center">
                                        <span className="text-green-600 font-semibold text-sm flex items-center gap-2">
                                            <i className="fa-solid fa-circle-check"></i> এনরোল করা হয়েছে
                                        </span>
                                        <a href="#" className="text-indigo-600 font-semibold text-sm hover:underline hover:text-indigo-800 transition-colors">প্রবেশ করুন &rarr;</a>
                                    </div>
                                </div>
                                {/* Available Batch Card */}
                                <div className="bg-white p-6 rounded-2xl shadow-lg border-l-4 border-blue-500 hover:shadow-xl transition-shadow duration-300">
                                    <h3 className="font-bold text-lg text-gray-800 mb-1">মেডিকেল অ্যাডমিশন ২০২৫</h3>
                                    <p className="text-sm text-gray-500 mb-4">পূর্ণাঙ্গ প্রস্তুতি কোর্স</p>
                                    <div className="flex justify-between items-center">
                                        <span className="text-gray-800 font-bold">৳৪৫০০</span>
                                        <a href="#" className="text-indigo-600 font-semibold text-sm hover:underline hover:text-indigo-800 transition-colors">বিস্তারিত দেখুন &rarr;</a>
                                    </div>
                                </div>
                            </div>
                        </section>

                        {/* 2. Main Features Grid Section */}
                        <section>
                            <h2 className="text-2xl font-bold text-gray-800 mb-4">এক্সাম ফিচারস</h2>
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                                {/* Live Exam Card */}
                                <div className="bg-white p-6 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 flex flex-col items-start">
                                    <div className="flex items-center space-x-4 mb-4">
                                        <div className="bg-red-100 p-3 rounded-full">
                                            <i className="fa-solid fa-tower-broadcast text-xl text-red-600"></i>
                                        </div>
                                        <div>
                                            <h3 className="text-xl font-bold text-gray-800">লাইভ এক্সাম</h3>
                                            <p className="text-gray-500 text-sm">চলমান পরীক্ষাগুলো দিন</p>
                                        </div>
                                    </div>
                                    <a href="#" className="mt-auto text-indigo-600 font-semibold text-left hover:text-indigo-800 transition-colors">তালিকা দেখুন &rarr;</a>
                                </div>
                                
                                {/* Practice Exam Card */}
                                <div className="bg-white p-6 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 flex flex-col items-start">
                                    <div className="flex items-center space-x-4 mb-4">
                                        <div className="bg-green-100 p-3 rounded-full">
                                            <i className="fa-solid fa-laptop-code text-xl text-green-600"></i>
                                        </div>
                                        <div>
                                            <h3 className="text-xl font-bold text-gray-800">প্র্যাকটিস এক্সাম</h3>
                                            <p className="text-gray-500 text-sm">বিগত পরীক্ষা অনুশীলন করুন</p>
                                        </div>
                                    </div>
                                    <a href="#" className="mt-auto text-indigo-600 font-semibold text-left hover:text-indigo-800 transition-colors">অনুশীলন শুরু করুন &rarr;</a>
                                </div>
                                
                                {/* My Results Card */}
                                <div className="bg-white p-6 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 flex flex-col items-start">
                                    <div className="flex items-center space-x-4 mb-4">
                                        <div className="bg-purple-100 p-3 rounded-full">
                                            <i className="fa-solid fa-chart-pie text-xl text-purple-600"></i>
                                        </div>
                                        <div>
                                            <h3 className="text-xl font-bold text-gray-800">আমার ফলাফল</h3>
                                            <p className="text-gray-500 text-sm">পারফর্মেন্স অ্যানালাইসিস</p>
                                        </div>
                                    </div>
                                    <a href="#" className="mt-auto text-indigo-600 font-semibold text-left hover:text-indigo-800 transition-colors">রিপোর্ট কার্ড দেখুন &rarr;</a>
                                </div>
                            </div>
                        </section>
                    </div>

                    {/* Right/Sidebar Column for upcoming exams and leaderboard */}
                    <div className="lg:col-span-1 space-y-8">
                        
                        {/* Upcoming Exams Section */}
                        <div>
                            <h2 className="text-2xl font-bold text-gray-800 mb-4">আসন্ন পরীক্ষাসমূহ</h2>
                            <div className="bg-white p-6 rounded-2xl shadow-lg space-y-4">
                                {/* Upcoming Exam Item 1 */}
                                <div className="flex items-center gap-4">
                                    <div className="bg-blue-100 text-blue-600 p-3 rounded-lg flex-shrink-0"><i className="fa-solid fa-atom text-lg"></i></div>
                                    <div>
                                        <p className="font-semibold text-gray-700">পদার্থবিজ্ঞান ফাইনাল মডেল টেস্ট</p>
                                        <p className="text-sm text-gray-500">২৩ জুলাই, ২০২৫ - রাত ৮:০০</p>
                                    </div>
                                </div>
                                {/* Upcoming Exam Item 2 */}
                                <div className="flex items-center gap-4 border-t pt-4 mt-4 border-gray-100">
                                    <div className="bg-green-100 text-green-600 p-3 rounded-lg flex-shrink-0"><i className="fa-solid fa-flask-vial text-lg"></i></div>
                                    <div>
                                        <p className="font-semibold text-gray-700">রসায়ন পেপার ফাইনাল</p>
                                        <p className="text-sm text-gray-500">২৭ জুলাই, ২০২৫ - রাত ৮:০০</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Leaderboard Section */}
                        <div>
                            <h2 className="text-2xl font-bold text-gray-800 mb-4">লিডারবোর্ড</h2>
                            <div className="bg-white p-6 rounded-2xl shadow-lg">
                                <ul className="space-y-4">
                                    {/* Leaderboard Item 1 (Gold) */}
                                    <li className="flex items-center space-x-4">
                                        <span className="font-bold text-lg text-yellow-500 w-6 text-center flex-shrink-0">1</span>
                                        <img className="w-10 h-10 rounded-full object-cover" src="https://placehold.co/100x100/f0ad4e/ffffff?text=A" alt="User Avatar" onError={(e) => {e.target.onerror = null; e.target.src='https://placehold.co/100x100/cccccc/ffffff?text=U';}} />
                                        <div className="flex-grow">
                                            <p className="font-semibold text-gray-800">আরিফ হোসেন</p>
                                            <p className="text-sm text-gray-500">স্কোর: ৯৮০</p>
                                        </div>
                                    </li>
                                    {/* Leaderboard Item 2 (Silver) */}
                                    <li className="flex items-center space-x-4">
                                        <span className="font-bold text-lg text-gray-400 w-6 text-center flex-shrink-0">2</span>
                                        <img className="w-10 h-10 rounded-full object-cover" src="https://placehold.co/100x100/5bc0de/ffffff?text=S" alt="User Avatar" onError={(e) => {e.target.onerror = null; e.target.src='https://placehold.co/100x100/cccccc/ffffff?text=U';}} />
                                        <div className="flex-grow">
                                            <p className="font-semibold text-gray-800">সুমি আক্তার</p>
                                            <p className="text-sm text-gray-500">স্কোর: ৯৫০</p>
                                        </div>
                                    </li>
                                    {/* Leaderboard Item 3 (Bronze) */}
                                    <li className="flex items-center space-x-4">
                                        <span className="font-bold text-lg text-yellow-600 w-6 text-center flex-shrink-0">3</span>
                                        <img className="w-10 h-10 rounded-full object-cover" src="https://placehold.co/100x100/5cb85c/ffffff?text=R" alt="User Avatar" onError={(e) => {e.target.onerror = null; e.target.src='https://placehold.co/100x100/cccccc/ffffff?text=U';}} />
                                        <div className="flex-grow">
                                            <p className="font-semibold text-gray-800">রাকিবুল ইসলাম</p>
                                            <p className="text-sm text-gray-500">স্কোর: ৯২০</p>
                                        </div>
                                    </li>
                                    {/* Your Rank (Highlighted) */}
                                    <li className="flex items-center space-x-4 border-t pt-4 mt-4 border-indigo-100">
                                        <span className="font-bold text-lg text-indigo-600 w-6 text-center flex-shrink-0">35</span>
                                        <img className="w-10 h-10 rounded-full border-2 border-indigo-500 object-cover" src="https://placehold.co/100x100/d9534f/ffffff?text=Y" alt="User Avatar" onError={(e) => {e.target.onerror = null; e.target.src='https://placehold.co/100x100/cccccc/ffffff?text=U';}} />
                                        <div className="flex-grow">
                                            <p className="font-semibold text-indigo-700">আপনি</p>
                                            <p className="text-sm text-gray-500">স্কোর: ৭৫০</p>
                                        </div>
                                    </li>
                                </ul>
                            </div>
                        </div>

                    </div>
                </div>
            </div>
        </div>
    );
};

export default Exam;
