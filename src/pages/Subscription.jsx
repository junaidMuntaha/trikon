import React, { useState, useMemo } from 'react';
// Import Font Awesome icons
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    faCheck, // For CheckIcon and general checkmarks
    faCog, // For settings/cogs in benefits
    faCircleCheck, // Another option for checkmarks if faCheck is too simple
    faBoxOpen, // For exam batches/courses
    faChartLine, // For performance analysis
    faStarHalfStroke, // For expert support (half star for support)
    faMoneyBillTransfer, // For money-back guarantee
    faChevronDown // For FAQ arrow
} from '@fortawesome/free-solid-svg-icons';

// Reusable component for list checkmarks
const CheckIcon = () => <FontAwesomeIcon icon={faCheck} className="w-4 h-4 mr-2 text-green-500" />;

// Pricing Card Component - Simplified for monthly view only
const PricingCard = ({ plan, onBuyClick }) => {
    const { name, price, duration, popular, bestValue, icon } = plan;

    // useMemo helps to avoid recalculating classes on every render
    const cardClass = useMemo(() => {
        if (popular) {
            return 'h-full bg-white p-6 rounded-2xl text-center flex flex-col transition-all duration-300 hover:-translate-y-2 shadow-lg hover:shadow-xl border-2 border-indigo-400';
        }
        if (bestValue) {
            return 'h-full bg-white p-6 rounded-2xl text-center flex flex-col transition-all duration-300 md:scale-105 hover:md:scale-110 border-2 border-purple-500 best-value-card';
        }
        return 'h-full bg-white p-6 rounded-2xl text-center flex flex-col transition-all duration-300 hover:-translate-y-2 shadow-md hover:shadow-xl border border-slate-200';
    }, [popular, bestValue]);

    const buttonClass = useMemo(() => {
        if (popular) {
            return 'bg-indigo-500 text-white font-semibold py-3 rounded-lg hover:bg-indigo-600 transition-colors';
        }
        if (bestValue) {
            return 'bg-gradient-to-r from-purple-500 to-pink-500 text-white font-bold py-3 rounded-lg hover:opacity-90 transition-opacity';
        }
        return 'bg-slate-200 text-slate-800 font-semibold py-3 rounded-lg hover:bg-slate-300 transition-colors';
    }, [popular, bestValue]);

    return (
        <div className={`${cardClass} mt-auto w-full`}> {/* Corrected className interpolation */}
            <div className="mb-4 text-4xl">{icon}</div>
            <h3 className="text-2xl font-bold mb-2 text-slate-800">{name}</h3>
            <p className="mb-6 text-slate-500">{duration}</p>
            
            <div className="my-4">
                <span className="text-5xl font-extrabold text-slate-900">৳ {price.toLocaleString('bn-BD')}</span>
                <span className="text-slate-500">/ মাস</span>
            </div>
            
            <ul className="text-left space-y-2 text-slate-600 mb-8 flex-grow">
                <li className="flex items-center"><CheckIcon />আনলিমিটেড প্র্যাকটিস</li>
                <li className="flex items-center"><CheckIcon />সকল এক্সাম ব্যাচ</li>
                <li className="flex items-center"><CheckIcon />বিশেষজ্ঞ সাপোর্ট</li>
            </ul>
            
            <button className={`${buttonClass} mt-auto w-full`} onClick={() => onBuyClick(plan)}> {/* Corrected className interpolation */}
                প্যাকেজটি কিনুন
            </button>
        </div>
    );
};

// FAQ Item Component
const FaqItem = ({ question, answer }) => (
    <details className="bg-white p-5 rounded-lg shadow-sm border border-slate-200 cursor-pointer group">
        <summary className="font-semibold text-lg flex justify-between items-center text-slate-800">
            {question}
            <span className="arrow-down transition-transform duration-300 transform group-open:rotate-180">
                <FontAwesomeIcon icon={faChevronDown} className="h-5 w-5" /> {/* Using FontAwesomeIcon */}
            </span>
        </summary>
        <p className="mt-4 text-slate-600">{answer}</p>
    </details>
);

// Main App Component
export default function Subscription() { // Renamed to Subscription for clarity, assuming it's a page component
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedPackage, setSelectedPackage] = useState(null);

    // Data for subscription plans - only monthly plans are needed now
    const monthlyPlans = [
        { name: 'মাসিক প্যাক', price: 250, duration: '৩০ দিন', popular: false, bestValue: false, icon: '🚀' },
        { name: 'ত্রৈমাসিক প্যাক', price: 650, duration: '৯০ দিন', popular: true, bestValue: false, icon: '⭐' },
        { name: 'ষান্মাসিক প্যাক', price: 1100, duration: '১৮০ দিন', popular: false, bestValue: false, icon: '💎' },
        { name: 'বার্ষিক প্যাক', price: 2000, duration: '৩৬৫ দিন', popular: false, bestValue: true, icon: '👑' }
    ];

    const handleBuyClick = (plan) => {
        setSelectedPackage(plan);
        setIsModalOpen(true);
    };
    
    const closeModal = () => {
        setIsModalOpen(false);
        setTimeout(() => setSelectedPackage(null), 300); // Delay for animation
    };

    return (
        <>
            {/* These head elements ensure the correct font is loaded, just like the original HTML */}
            <link rel="preconnect" href="https://fonts.googleapis.com" />
            <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="true" />
            <link href="https://fonts.googleapis.com/css2?family=Hind+Siliguri:wght@400;500;600;700&display=swap" rel="stylesheet" />
            
            {/* All styles are copied exactly from the original HTML to ensure a perfect match */}
            <style>{`
                body {
                    font-family: 'Hind Siliguri', sans-serif;
                    background-color: #f8fafc; /* Slate 50 */
                }
                .premium-gradient-text {
                    background: linear-gradient(to right, #9333ea, #4f46e5, #0ea5e9);
                    -webkit-background-clip: text;
                    -webkit-text-fill-color: transparent;
                }
                details > summary { list-style: none; }
                details > summary::-webkit-details-marker { display: none; }
                details[open] summary .arrow-down { transform: rotate(180deg); }
                
                /* Card Glow Effect for Light Theme */
                .best-value-card {
                    box-shadow: 0 0 30px 0 rgba(168, 85, 247, 0.3);
                }
                
                /* Modal animation classes */
                .modal-backdrop.entering, .modal-backdrop.entered { opacity: 1; }
                .modal-backdrop.exiting, .modal-backdrop.exited { opacity: 0; }
                .modal-content.entering, .modal-content.entered { transform: scale(1); }
                .modal-content.exiting, .modal-content.exited { transform: scale(0.95); }
            `}</style>
            
            <div className="container mx-auto p-4 sm:p-6 lg:p-8">

                {/* 1. Banner Section */}
                <header className="text-center mb-16">
                    <div className="inline-block bg-purple-100 text-purple-600 text-sm font-semibold px-4 py-1 rounded-full mb-4">
                        আমাদের এক্সক্লুসিভ মেম্বারশিপ
                    </div>
                    <h1 className="text-4xl md:text-6xl font-bold mb-4 premium-gradient-text">আপনার সফলতার নতুন দিগন্ত</h1>
                    <p className="text-lg md:text-xl text-slate-500 max-w-3xl mx-auto">এক সাবস্ক্রিপশনেই আনলিমিটেড প্র্যাকটিস, এক্সাম ব্যাচ ও সলিউশন—সবকিছু এখন আপনার হাতের মুঠোয়।</p>
                </header>

                {/* 2. Subscription Packages Section */}
                <section className="mb-20">
                    {/* Billing Cycle Toggle has been removed */}
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 items-stretch mt-10">
                        {monthlyPlans.map(plan => (
                            <PricingCard key={plan.name} plan={plan} onBuyClick={handleBuyClick} />
                        ))}
                    </div>
                </section>
                
                {/* 3. Comparison Table Section */}
                <section className="mb-20">
                    <h2 className="text-3xl md:text-4xl font-bold text-center text-slate-800 mb-12">ফ্রি এবং প্রিমিয়ামের মধ্যে পার্থক্য</h2>
                    <div className="max-w-4xl mx-auto bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">
                        <table className="w-full text-center">
                            <thead className="bg-slate-50">
                                <tr>
                                    <th className="p-4 font-semibold text-left text-slate-800">ফিচার</th>
                                    <th className="p-4 font-semibold text-slate-600">ফ্রি ইউজার</th>
                                    <th className="p-4 font-semibold premium-gradient-text">Premium ইউজার</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-200">
                                <tr>
                                    <td className="p-4 text-left text-slate-600">বিগত বছরের প্রশ্ন প্র্যাকটিস</td>
                                    <td className="p-4 text-slate-500">সীমাবদ্ধ</td>
                                    <td className="p-4 font-medium text-green-500">আনলিমিটেড</td>
                                </tr>
                                <tr className="bg-slate-50/50">
                                    <td className="p-4 text-left text-slate-600">প্রশ্নের সলিউশন দেখা</td>
                                    <td className="p-4 text-2xl text-red-500">❌</td>
                                    <td className="p-4 text-2xl text-green-500">✅</td>
                                </tr>
                                <tr>
                                    <td className="p-4 text-left text-slate-600">সকল এক্সাম ব্যাচে অ্যাক্সেস</td>
                                    <td className="p-4 text-2xl text-red-500">❌</td>
                                    <td className="p-4 text-2xl text-green-500">✅</td>
                                </tr>
                                   <tr className="bg-slate-50/50">
                                    <td className="p-4 text-left text-slate-600">পারফর্মেন্স অ্যানালাইসিস</td>
                                    <td className="p-4 text-slate-500">বেসিক</td>
                                    <td className="p-4 font-medium text-green-500">অ্যাডভান্সড</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </section>

                {/* 4. Key Benefits Section */}
                <section className="mb-20">
                    <h2 className="text-3xl md:text-4xl font-bold text-center text-slate-800 mb-12">সকল প্যাকেজের সাথে যা যা পাচ্ছেন</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg hover:-translate-y-1 transition-all duration-300 border border-slate-200">
                            <div className="flex items-center space-x-4">
                                <div className="bg-purple-100 text-purple-600 p-3 rounded-lg">
                                    <FontAwesomeIcon icon={faCog} className="h-8 w-8" /> {/* Replaced SVG with FontAwesomeIcon (faCog as placeholder) */}
                                </div>
                                <div>
                                    <h3 className="font-bold text-lg text-slate-800">আনলিমিটেড প্র্যাকটিস</h3>
                                    <p className="text-slate-500">সীমাহীন মডেল টেস্ট ও প্রশ্ন সলভ।</p>
                                </div>
                            </div>
                        </div>
                        <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg hover:-translate-y-1 transition-all duration-300 border border-slate-200">
                            <div className="flex items-center space-x-4">
                                <div className="bg-purple-100 text-purple-600 p-3 rounded-lg">
                                    <FontAwesomeIcon icon={faCircleCheck} className="h-8 w-8" /> {/* Replaced SVG with FontAwesomeIcon */}
                                </div>
                                <div>
                                    <h3 className="font-bold text-lg text-slate-800">বিস্তারিত সলিউশন</h3>
                                    <p className="text-slate-500">প্রতিটি প্রশ্নের সহজবোধ্য ব্যাখ্যা।</p>
                                </div>
                            </div>
                        </div>
                        <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg hover:-translate-y-1 transition-all duration-300 border border-slate-200">
                            <div className="flex items-center space-x-4">
                                <div className="bg-purple-100 text-purple-600 p-3 rounded-lg">
                                    <FontAwesomeIcon icon={faBoxOpen} className="h-8 w-8" /> {/* Replaced SVG with FontAwesomeIcon */}
                                </div>
                                <div>
                                    <h3 className="font-bold text-lg text-slate-800">সকল এক্সাম ব্যাচ</h3>
                                    <p className="text-slate-500">সব ব্যাচে অটোম্যাটিক অ্যাক্সেস।</p>
                                </div>
                            </div>
                        </div>
                        <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg hover:-translate-y-1 transition-all duration-300 border border-slate-200">
                            <div className="flex items-center space-x-4">
                                <div className="bg-purple-100 text-purple-600 p-3 rounded-lg">
                                    <FontAwesomeIcon icon={faChartLine} className="h-8 w-8" /> {/* Replaced SVG with FontAwesomeIcon */}
                                </div>
                                <div>
                                    <h3 className="font-bold text-lg text-slate-800">পারফর্মেন্স অ্যানালাইসিস</h3>
                                    <p className="text-slate-500">আপনার অগ্রগতির বিস্তারিত রিপোর্ট।</p>
                                </div>
                            </div>
                        </div>
                        <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg hover:-translate-y-1 transition-all duration-300 border border-slate-200">
                            <div className="flex items-center space-x-4">
                                <div className="bg-purple-100 text-purple-600 p-3 rounded-lg">
                                    <FontAwesomeIcon icon={faStarHalfStroke} className="h-8 w-8" /> {/* Replaced SVG with FontAwesomeIcon */}
                                </div>
                                <div>
                                    <h3 className="font-bold text-lg text-slate-800">বিশেষজ্ঞ সাপোর্ট</h3>
                                    <p className="text-slate-500">যেকোনো সমস্যায় দ্রুত সমাধান।</p>
                                </div>
                            </div>
                        </div>
                        <div className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg hover:-translate-y-1 transition-all duration-300 border border-slate-200">
                            <div className="flex items-center space-x-4">
                                <div className="bg-purple-100 text-purple-600 p-3 rounded-lg">
                                    <FontAwesomeIcon icon={faMoneyBillTransfer} className="h-8 w-8" /> {/* Replaced SVG with FontAwesomeIcon */}
                                </div>
                                <div>
                                    <h3 className="font-bold text-lg text-slate-800">মানি-ব্যাক গ্যারান্টি</h3>
                                    <p className="text-slate-500">৭ দিনের মধ্যে টাকা ফেরত পাওয়ার নিশ্চয়তা।</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* 5. Testimonials Section */}
                <section className="mb-20">
                    <h2 className="text-3xl md:text-4xl font-bold text-center text-slate-800 mb-12">আমাদের শিক্ষার্থীরা যা বলছে</h2>
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                            <p className="text-slate-600 mb-4">"এই অ্যাপের প্রিমিয়াম প্যাকেজটি আমার প্রস্তুতির মোড় ঘুরিয়ে দিয়েছে। আনলিমিটেড প্র্যাকটিস ফিচারটা অসাধারণ!"</p>
                            <div className="flex items-center">
                                <img className="w-12 h-12 rounded-full mr-4" src="https://placehold.co/100x100/e2e8f0/4a5568?text=S" alt="শিক্ষার্থীর ছবি" />
                                <div>
                                    <p className="font-semibold text-slate-800">সুমন আহমেদ</p>
                                    <p className="text-sm text-slate-500">ঢাকা বিশ্ববিদ্যালয়</p>
                                </div>
                            </div>
                        </div>
                        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                            <p className="text-slate-600 mb-4">"আগে অনেকগুলো এক্সাম ব্যাচে আলাদা করে ভর্তি হতে হতো। এখন এক সাবস্ক্রিপশনেই সব পেয়ে যাচ্ছি। অনেক টাকা বেঁচে গেছে।"</p>
                            <div className="flex items-center">
                                <img className="w-12 h-12 rounded-full mr-4" src="https://placehold.co/100x100/e2e8f0/4a5568?text=F" alt="শিক্ষার্থীর ছবি" />
                                <div>
                                    <p className="font-semibold text-slate-800">ফারিয়া ইসলাম</p>
                                    <p className="text-sm text-slate-500">মেডিকেল ভর্তি পরীক্ষার্থী</p>
                                </div>
                            </div>
                        </div>
                        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
                            <p className="text-slate-600 mb-4">"প্রতিটি প্রশ্নের বিস্তারিত ব্যাখ্যা থাকায় আমার কনসেপ্ট ক্লিয়ার করতে অনেক সুবিধা হয়েছে। সাপোর্ট টিমও খুব হেল্পফুল।"</p>
                            <div className="flex items-center">
                                <img className="w-12 h-12 rounded-full mr-4" src="https://placehold.co/100x100/e2e8f0/4a5568?text=R" alt="শিক্ষার্থীর ছবি" />
                                <div>
                                    <p className="font-semibold text-slate-800">রাকিব হাসান</p>
                                    <p className="text-sm text-slate-500">বুয়েট ভর্তি পরীক্ষার্থী</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* 6. FAQ Section */}
                <section>
                    <h2 className="text-3xl md:text-4xl font-bold text-center text-slate-800 mb-12">সাধারণ জিজ্ঞাসা (FAQ)</h2>
                    <div className="max-w-3xl mx-auto space-y-4">
                        <FaqItem question="পেমেন্ট কীভাবে করবো?" answer="আপনি বিকাশ, রকেট, নগদ, বা যেকোনো ডেবিট/ক্রেডিট কার্ডের মাধ্যমে নিরাপদে পেমেন্ট করতে পারবেন।" />
                        <FaqItem question="মানি-ব্যাক গ্যারান্টি কীভাবে কাজ করে?" answer="প্যাকেজ কেনার ৭ দিনের মধ্যে আপনি যদি সন্তুষ্ট না হন, তাহলে আমাদের সাপোর্টে যোগাযোগ করলে আমরা আপনার সম্পূর্ণ টাকা ফেরত দিয়ে দেবো।" />
                        <FaqItem question="সাবস্ক্রিপশনের মেয়াদ শেষ হলে কী হবে?" answer="মেয়াদ শেষ হলে আপনার অ্যাকাউন্ট আবার ফ্রি প্ল্যানে ফিরে আসবে। আপনার কোনো ডেটা মুছে যাবে না, তবে প্রিমিয়াম সুবিধাগুলো বন্ধ হয়ে যাবে।" />
                    </div>
                </section>
            </div>
            
            <footer className="text-center p-8 text-slate-500 mt-8">
                <p>&copy; ২০২৫ আপনার অ্যাপের নাম। সর্বস্বত্ব সংরক্ষিত।</p>
            </footer>

            {/* Payment Modal */}
            <div 
                className={`fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50 transition-opacity duration-300 ${isModalOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
                onClick={closeModal}
            >
                <div 
                    className={`bg-white rounded-xl shadow-2xl w-full max-w-md p-8 text-center transition-transform duration-300 ${isModalOpen ? 'scale-100' : 'scale-95'}`}
                    onClick={e => e.stopPropagation()}
                >
                    {selectedPackage && (
                        <>
                            <h2 className="text-2xl font-bold text-slate-800 mb-2">প্যাকেজটি নিশ্চিত করুন</h2>
                            <p className="text-slate-600 mb-6">আপনি <strong className="text-purple-600">{selectedPackage.name}</strong> প্যাকেজটি কিনছেন।</p>
                            <div className="bg-slate-100 p-4 rounded-lg mb-6 border border-slate-200">
                                <p className="text-lg text-slate-600">সর্বমোট পরিশোধ করতে হবে:</p>
                                <p className="text-4xl font-bold premium-gradient-text">৳ {selectedPackage.price.toLocaleString('bn-BD')}</p>
                            </div>
                            <button className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-bold py-3 rounded-lg hover:from-purple-700 hover:to-indigo-700 transition-all duration-300 transform hover:scale-105">পেমেন্ট করুন</button>
                            <button onClick={closeModal} className="w-full bg-transparent text-slate-500 font-semibold py-3 rounded-lg mt-2 hover:bg-slate-100 transition-colors">বাতিল করুন</button>
                        </>
                    )}
                </div>
            </div>
        </>
    );
}
