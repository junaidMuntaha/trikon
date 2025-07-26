import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { supabase } from '../lib/supabaseClient';

// Icon and color mappings
const iconList = [
  'fa-ruler-combined', 'fa-compass-drafting', 'fa-person-running', 'fa-apple-whole',
  'fa-bolt', 'fa-earth-americas', 'fa-water', 'fa-wave-square',
  'fa-soundcloud', 'fa-wind'
];
const colorList = [
  'text-sky-500', 'text-blue-500', 'text-indigo-500', 'text-red-500',
  'text-amber-500', 'text-green-500', 'text-cyan-500', 'text-purple-500',
  'text-orange-500', 'text-teal-500'
];

// Individual Chapter Card
const ChapterCard = ({ chapter, index }) => {
  const icon = iconList[index % iconList.length];
  const color = colorList[index % colorList.length];

  return (
    <div className="chapter-card bg-white rounded-xl p-6 flex flex-col text-center items-center border border-slate-200 hover:shadow-xl hover:-translate-y-2 transition-all cursor-pointer">
      <div className="w-20 h-20 rounded-full bg-slate-100 flex items-center justify-center mb-4 chapter-card-icon transition-transform">
        <i className={`fas ${icon} fa-3x ${color}`}></i>
      </div>
      <p className="text-sm font-semibold text-slate-500">অধ্যায় {chapter.number || index + 1}</p>
      <h3 className="text-xl font-bold text-slate-800 mt-1 mb-2">{chapter.title || 'শিরোনাম নেই'}</h3>
      <p className="text-slate-500 text-sm flex-grow">{chapter.description || 'বর্ণনা নেই।'}</p>
      <div className="w-full border-t border-slate-100 my-4"></div>
      <div className="flex justify-between w-full text-sm text-slate-600">
        <span className="flex items-center">
          <i className="fas fa-video mr-2 text-slate-400"></i> {chapter.lectures ?? 0} লেকচার
        </span>
        <span className="flex items-center">
          <i className="fas fa-clock mr-2 text-slate-400"></i> {chapter.duration || 'সময় নেই'}
        </span>
      </div>
      <Link
        to={`/chapter/${chapter.id}`}
        className="w-full mt-5 bg-blue-500 text-white py-2.5 rounded-lg font-semibold hover:bg-blue-600 transition-colors text-center"
      >
        অধ্যায়টি দেখুন
      </Link>
    </div>
  );
};

const CourseDetail = () => {
  const { id: classId } = useParams(); // ✅ FIXED: get `id` param and rename to `classId`
  const [classInfo, setClassInfo] = useState(null);
  const [chapters, setChapters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setErrorMsg(null);

      const [
        { data: classData, error: classError },
        { data: chapterData, error: chapterError }
      ] = await Promise.all([
        supabase.from('classes').select('*').eq('id', classId).single(),
        supabase.from('chapters').select('*').eq('class_id', classId).order('id', { ascending: true }),
      ]);

      if (classError || chapterError) {
        console.error('Fetch error:', classError || chapterError);
        setErrorMsg("তথ্য আনতে সমস্যা হয়েছে। দয়া করে পরে আবার চেষ্টা করুন।");
      } else {
        setClassInfo(classData);
        setChapters(chapterData);
      }

      setLoading(false);
    };

    fetchData();
    window.scrollTo(0, 0);
  }, [classId]);

  return (
    <div className="bg-slate-50 min-h-screen font-['Inter','Hind Siliguri',sans-serif]">
      <div className="container mx-auto p-4 md:p-8">
        {/* Header */}
        <header className="text-center mb-10 md:mb-12">
          <Link to="/classes" className="text-blue-600 hover:underline text-sm inline-block mb-4">
            <i className="fas fa-arrow-left mr-1"></i> সকল কোর্সে ফিরে যান
          </Link>
          {classInfo && (
            <>
              <h1 className="text-3xl md:text-4xl font-bold text-slate-900">{classInfo.title}</h1>
              <p className="mt-2 text-lg text-slate-500">আপনার পছন্দের অধ্যায় নির্বাচন করে শেখা শুরু করুন।</p>
            </>
          )}
        </header>

        {/* Main content */}
        <main>
          {loading ? (
            <div className="text-center text-slate-500 py-20">লোড হচ্ছে...</div>
          ) : errorMsg ? (
            <div className="text-center text-red-500 py-20">{errorMsg}</div>
          ) : chapters.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 md:gap-8">
              {chapters.map((chapter, index) => (
                <ChapterCard key={chapter.id} chapter={chapter} index={index} />
              ))}
            </div>
          ) : (
            <div className="text-center text-slate-500 py-20">এই কোর্সে কোনো অধ্যায় যোগ করা হয়নি।</div>
          )}
        </main>
      </div>
    </div>
  );
};

export default CourseDetail;
