import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabaseClient';
import { ArrowLeft } from 'lucide-react';

const ChapterDetail = () => {
  const { id } = useParams(); // chapter_id
  const navigate = useNavigate();
  const videoRef = useRef(null);

  const [chapter, setChapter] = useState(null);
  const [activeTab, setActiveTab] = useState("lectures");
  const [selectedVideoIndex, setSelectedVideoIndex] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchChapter = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from('chapters')
        .select(`
          id,
          title,
          description,
          videos(id, title, url),
          resources(id, title, file_url),
          guideline
        `)
        .eq('id', id)
        .single();

      if (error) console.error('Error fetching chapter:', error);
      else setChapter(data);

      setLoading(false);
    };

    fetchChapter();
  }, [id]);

  const scrollToVideo = () => {
    if (videoRef.current) {
      videoRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleTabClick = (tab) => {
    setActiveTab(tab);
    scrollToVideo();
  };

  const handleVideoSelect = (index) => {
    setSelectedVideoIndex(index);
    scrollToVideo();
  };

  const handleStartExam = () => {
    navigate(`/exam/${id}`); // assumes you’ll create an Exam page per chapter
  };

  if (loading) {
    return <div className="text-center text-lg py-10">Loading chapter...</div>;
  }

  if (!chapter) {
    return <div className="text-center text-lg py-10 text-red-500">Chapter not found</div>;
  }

  const selectedVideo = chapter.videos?.[selectedVideoIndex];

  return (
    <div className="relative max-w-5xl mx-auto px-4 pb-28">
      {/* 🔙 Back Button */}
      <button
        onClick={() => navigate(-1)}
        className="flex items-center text-sm text-blue-600 mb-4 hover:underline"
      >
        <ArrowLeft className="w-4 h-4 mr-1" /> Back
      </button>

      {/* 🎬 Main Video Player */}
      <div ref={videoRef}>
        {selectedVideo ? (
          <div className="aspect-video w-full rounded-xl overflow-hidden shadow">
            <iframe
              src={selectedVideo.url}
              title={selectedVideo.title}
              className="w-full h-full"
              allowFullScreen
            ></iframe>
          </div>
        ) : (
          <div className="text-gray-500 italic">No video available</div>
        )}
      </div>

      {/* 📑 Tabs */}
      <div className="flex mt-6 space-x-4">
        {["lectures", "guideline", "resources"].map((tab) => (
          <button
            key={tab}
            onClick={() => handleTabClick(tab)}
            className={`px-4 py-2 rounded-full border ${
              activeTab === tab
                ? 'bg-blue-600 text-white'
                : 'bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 border-gray-300'
            }`}
          >
            {tab.charAt(0).toUpperCase() + tab.slice(1)}
          </button>
        ))}
      </div>

      {/* 📚 Tab Content */}
      <div className="mt-4 space-y-4">
        {activeTab === "lectures" && (
          <div>
            <h2 className="text-lg font-semibold mb-2">Lecture Playlist</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {chapter.videos.map((vid, i) => {
                const match = vid.url.match(/(?:\/embed\/|v=)([a-zA-Z0-9_-]+)/);
                const youtubeId = match?.[1];
                const thumbnail = youtubeId
                  ? `https://img.youtube.com/vi/${youtubeId}/default.jpg`
                  : null;

                return (
                  <button
                    key={vid.id}
                    onClick={() => handleVideoSelect(i)}
                    className={`flex items-center space-x-3 p-2 rounded shadow w-full text-left ${
                      i === selectedVideoIndex
                        ? 'bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200'
                        : 'bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100'
                    }`}
                  >
                    {thumbnail && (
                      <img
                        src={thumbnail}
                        alt={`Thumbnail for ${vid.title}`}
                        className="w-16 h-10 rounded object-cover"
                      />
                    )}
                    <div>
                      <div className="font-medium truncate">{vid.title}</div>
                      <div className="text-sm text-gray-500">Video {i + 1}</div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {activeTab === "guideline" && (
          <div>
            <h2 className="text-lg font-semibold mb-2">Guideline</h2>
            <div className="overflow-x-auto">
              <table className="min-w-full text-left border">
                <tbody>
                  {chapter.guideline
                    ?.split('\n')
                    .filter(Boolean)
                    .map((line, idx) => (
                      <tr key={idx} className="border-b">
                        <td className="px-4 py-2 whitespace-pre-wrap text-gray-800 dark:text-gray-200">
                          {line}
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === "resources" && (
          <div>
            <h2 className="text-lg font-semibold mb-2">Resources</h2>
            {chapter.resources.length > 0 ? (
              <ul className="space-y-2">
                {chapter.resources.map((res) => (
                  <li key={res.id}>
                    <a
                      href={res.file_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:underline"
                    >
                      📄 {res.title}
                    </a>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-500 italic">No resources available.</p>
            )}
          </div>
        )}
      </div>

      {/* 📝 Sticky Exam Card with Gradient */}
      <div className="sticky bottom-4 mt-12">
        <div className="bg-gradient-to-r from-purple-600 to-sky-400 text-white p-4 rounded-lg shadow flex justify-between items-center">
          <div>
            <div className="text-lg font-bold">Ready for the Quiz?</div>
            <p className="text-sm opacity-90">Test your knowledge from this chapter.</p>
          </div>
          <button
            onClick={handleStartExam}
            className="bg-white text-purple-700 font-semibold px-4 py-2 rounded hover:bg-purple-100"
          >
            Start Exam
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChapterDetail;
