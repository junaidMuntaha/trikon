import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../lib/supabaseClient';

const Classes = () => {
  const [classes, setClasses] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeFilter, setActiveFilter] = useState('all');
  const [loading, setLoading] = useState(true);

  const filters = [
    { label: 'সকল ক্লাস', value: 'all' },
    { label: 'একাডেমিক', value: 'academic' },
    { label: 'এডমিশন', value: 'admission' },
    { label: 'ফ্রি ক্লাস', value: 'free' },
  ];

  const fetchClasses = async () => {
    setLoading(true);

    const { data, error } = await supabase
      .from('classes')
      .select('*, chapters(count)')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching classes:', error);
    } else {
      setClasses(
        data.map((item) => ({
          ...item,
          chapterCount: item.chapters?.[0]?.count || 0,
        }))
      );
    }

    setLoading(false);
  };

  useEffect(() => {
    fetchClasses();
    document.title = 'আমাদের ক্লাসরুম';
  }, []);

  const filteredClasses = classes.filter(item => {
    const categoryMatch =
      activeFilter === 'all' ||
      item.category === activeFilter ||
      (activeFilter === 'free' && item.tags?.includes('free'));

    const searchMatch =
      item.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.instructor?.toLowerCase().includes(searchTerm.toLowerCase());

    return categoryMatch && searchMatch;
  });

  const ClassCard = ({ item }) => {
    const categoryBadgeColor = item.category === 'admission' ? 'bg-pink-600' : 'bg-blue-600';

    return (
      <div className="class-card bg-white rounded-xl overflow-hidden flex flex-col border border-slate-200 transition-all duration-300 hover:-translate-y-2 hover:shadow-xl">
        <div className="relative">
          <Link to={`/course/${item.id}`}>
            <img src={item.image} alt={item.title} className="w-full h-48 object-cover" />
          </Link>
          <span className={`absolute top-4 left-4 text-xs font-semibold uppercase tracking-wider text-white px-3 py-1 rounded-full ${categoryBadgeColor}`}>
            {item.category}
          </span>
          {item.tags?.includes('free') && (
            <span className="absolute top-4 right-4 text-xs font-bold uppercase tracking-wider bg-green-500 text-white px-3 py-1 rounded-full">
              Free
            </span>
          )}
        </div>
        <div className="p-5 flex flex-col flex-grow">
          <h3 className="text-lg font-bold text-gray-800 flex-grow">
            <Link to={`/course/${item.id}`} className="hover:text-blue-600 transition-colors">{item.title}</Link>
          </h3>
          <p className="text-sm text-gray-500 mt-2">ইন্সট্রাক্টর: {item.instructor || 'N/A'}</p>
          <div className="text-sm text-gray-600 mt-4 pt-4 border-t space-y-1">
            <div><i className="fas fa-video mr-2 text-gray-400"></i>মোট ক্লাস: {item.lectures || 0}</div>
            <div><i className="fas fa-layer-group mr-2 text-gray-400"></i>চ্যাপ্টার: {item.chapterCount}</div>
          </div>
        </div>
        <div className="px-5 pb-5 bg-white">
          <Link to={`/course/${item.id}`} className="w-full block text-center bg-blue-700 text-white py-2.5 rounded-lg font-semibold hover:bg-blue-800 transition-colors">
            প্রবেশ করুন <i className="fas fa-arrow-right ml-1"></i>
          </Link>
        </div>
      </div>
    );
  };

  return (
    <div className="bg-slate-50 min-h-screen font-['Inter','Hind Siliguri',sans-serif]">
      <div className="container mx-auto p-4 md:p-8">
        <header className="text-center mb-10 md:mb-12">
          <h1 className="text-3xl md:text-5xl font-bold text-gray-900 tracking-tight">আমাদের ক্লাসরুম</h1>
          <p className="mt-3 text-lg text-gray-600 max-w-2xl mx-auto">
            আপনার শেখার সবকিছু, এক জায়গায়। একাডেমিক, এডমিশন বা ফ্রি ক্লাস থেকে বেছে নিন।
          </p>
        </header>

        <div className="mb-10 max-w-3xl mx-auto">
          <div className="relative mb-6">
            <input
              type="search"
              placeholder="আপনার পছন্দের বিষয় খুঁজুন (e.g., Physics, Admission...)"
              className="w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-full focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <i className="fas fa-search text-gray-400"></i>
            </div>
          </div>

          <div className="flex flex-wrap justify-center items-center gap-3">
            {filters.map(filter => (
              <button
                key={filter.value}
                className={`filter-btn px-5 py-2 text-sm font-semibold rounded-full border border-gray-200 bg-white text-gray-700 hover:bg-gray-100 transition ${
                  activeFilter === filter.value ? 'bg-blue-800 text-white shadow-md' : ''
                }`}
                onClick={() => setActiveFilter(filter.value)}
              >
                {filter.label}
              </button>
            ))}
          </div>
        </div>

        <main>
          {loading ? (
            <div className="text-center text-gray-500 py-10">লোড হচ্ছে...</div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
              {filteredClasses.length > 0 ? (
                filteredClasses.map(item => <ClassCard key={item.id} item={item} />)
              ) : (
                <div className="col-span-full text-center py-16">
                  <i className="fas fa-folder-open fa-4x text-gray-300 mb-4"></i>
                  <h3 className="text-2xl font-semibold text-gray-600">দুঃখিত, কোনো ক্লাস খুঁজে পাওয়া যায়নি।</h3>
                  <p className="text-gray-500 mt-2">অনুগ্রহ করে অন্য কোনো কীওয়ার্ড বা ফিল্টার দিয়ে চেষ্টা করুন।</p>
                </div>
              )}
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default Classes;
