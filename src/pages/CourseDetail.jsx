import { Link } from 'react-router-dom'

const CourseDetail = () => {
  return (
    <div className="min-h-screen bg-gray-50 px-4 py-10 font-['Hind Siliguri',sans-serif] text-gray-900">
      <div className="max-w-3xl mx-auto bg-white rounded-2xl shadow-md p-6 space-y-6">
        <h1 className="text-2xl md:text-3xl font-bold text-center text-indigo-700">
          পরীক্ষা ব্যাচ: চূড়ান্ত প্রস্তুতি
        </h1>

        <p className="text-center text-gray-600">
          আপনার পরীক্ষার প্রস্তুতিকে আরও সুসংগঠিত করতে এবং সেরা ফলাফল নিশ্চিত করতে আমাদের চূড়ান্ত প্রস্তুতি পরীক্ষা ব্যাচ।
        </p>

        <div className="space-y-4">
          <h2 className="text-xl font-semibold text-indigo-600">কেন এই ব্যাচ?</h2>
          <ul className="list-disc list-inside space-y-2 text-gray-700">
            <li><strong>লক্ষ্য অর্জন:</strong> সুনির্দিষ্ট এবং কার্যকর প্রস্তুতির মাধ্যমে আপনার সাফল্যের পথ সুগম করবে।</li>
            <li><strong>আত্মবিশ্বাস বৃদ্ধি:</strong> নিয়মিত পরীক্ষা ও অনুশীলনের মাধ্যমে আপনার আত্মবিশ্বাস বাড়বে।</li>
            <li><strong>দক্ষতা উন্নয়ন:</strong> সময় ব্যবস্থাপনা এবং প্রশ্ন সমাধানের দক্ষতা উন্নত হবে।</li>
          </ul>
        </div>

        <div className="space-y-4">
          <h2 className="text-xl font-semibold text-indigo-600">কী লাভ হবে?</h2>
          <ul className="list-disc list-inside space-y-2 text-gray-700">
            <li><strong>ব্যাপক প্রস্তুতি:</strong> ১২০+ পরীক্ষার মাধ্যমে সম্পূর্ণ সিলেবাস কভার হবে।</li>
            <li><strong>দুর্বলতা চিহ্নিতকরণ:</strong> বিস্তারিত ফলাফলের মাধ্যমে আপনার দুর্বল বিষয়গুলো সহজে চিহ্নিত করতে পারবেন।</li>
            <li><strong>সীমাহীন অনুশীলন:</strong> বিগত সালের প্রশ্নপত্রে আনলিমিটেড অ্যাক্সেস আপনাকে নিখুঁত অনুশীলনের সুযোগ দেবে।</li>
          </ul>
        </div>

        <div className="space-y-4">
          <h2 className="text-xl font-semibold text-indigo-600">কী কী থাকছে?</h2>
          <ul className="list-disc list-inside space-y-2 text-gray-700">
            <li>১২০+ মডেল টেস্ট: বিষয়ভিত্তিক ও পূর্ণাঙ্গ মডেল টেস্ট।</li>
            <li>বিগত সালের প্রশ্নপত্র: সীমাহীন অ্যাক্সেস সহ সকল গুরুত্বপূর্ণ প্রশ্নপত্র।</li>
            <li>ইচ্ছামতো পরীক্ষা: আপনার সুবিধামতো সময়ে যতবার খুশি পরীক্ষা দেওয়ার সুযোগ।</li>
            <li>বিস্তারিত সমাধান: প্রতিটি প্রশ্নের সঠিক উত্তর ও ব্যাখ্যা।</li>
            <li>অগ্রগতি ট্র্যাকিং: আপনার পারফরম্যান্সের বিস্তারিত রিপোর্ট ও গ্রাফ।</li>
          </ul>
        </div>

        <div className="text-center mt-6">
          <button className="bg-indigo-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-indigo-700 transition">
            আজই এনরোল করুন
          </button>
        </div>

        <div className="text-center mt-4">
          <Link to="/" className="text-indigo-500 hover:underline">← সকল কোর্সে ফিরে যান</Link>
        </div>
      </div>
    </div>
  )
}

export default CourseDetail
