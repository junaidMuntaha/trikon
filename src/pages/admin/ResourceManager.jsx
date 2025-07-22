import { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabaseClient';

const ResourceManager = () => {
  const [chapters, setChapters] = useState([]);
  const [selectedChapter, setSelectedChapter] = useState('');
  const [videos, setVideos] = useState([]);
  const [notes, setNotes] = useState([]);

  const [videoTitle, setVideoTitle] = useState('');
  const [videoUrl, setVideoUrl] = useState('');

  const [noteTitle, setNoteTitle] = useState('');
  const [noteFile, setNoteFile] = useState(null);

  // Fetch chapters
  useEffect(() => {
    const fetchChapters = async () => {
      const { data, error } = await supabase.from('chapters').select();
      if (error) {
        console.error('Error fetching chapters:', error.message);
      } else {
        setChapters(data || []);
      }
    };
    fetchChapters();
  }, []);

  // Fetch videos and notes when chapter is selected
  useEffect(() => {
    if (!selectedChapter) return;
    const fetchResources = async () => {
      const { data: videoData } = await supabase
        .from('videos')
        .select()
        .eq('chapter_id', selectedChapter);

      const { data: noteData } = await supabase
        .from('notes')
        .select()
        .eq('chapter_id', selectedChapter);

      setVideos(videoData || []);
      setNotes(noteData || []);
    };
    fetchResources();
  }, [selectedChapter]);

  // Upload note file to Supabase Storage
  const uploadNoteFile = async (file) => {
    const fileExt = file.name.split('.').pop();
    const filePath = `${Date.now()}.${fileExt}`;

    const { error } = await supabase.storage.from('notes').upload(filePath, file);
    if (error) {
      alert('File upload failed.');
      return null;
    }

    const { data: urlData } = supabase.storage.from('notes').getPublicUrl(filePath);
    return urlData.publicUrl;
  };

  // Add video to Supabase
  const handleAddVideo = async () => {
    if (!videoTitle || !videoUrl || !selectedChapter) return;

    const { error } = await supabase.from('videos').insert({
      chapter_id: selectedChapter,
      title: videoTitle,
      video_url: videoUrl,
    });

    if (error) {
      alert('Failed to add video.');
      return;
    }

    setVideoTitle('');
    setVideoUrl('');

    const { data } = await supabase.from('videos').select().eq('chapter_id', selectedChapter);
    setVideos(data);
  };

  // Add note to Supabase
  const handleAddNote = async () => {
    if (!noteTitle || !noteFile || !selectedChapter) return;

    const fileUrl = await uploadNoteFile(noteFile);
    if (!fileUrl) return;

    const { error } = await supabase.from('notes').insert({
      chapter_id: selectedChapter,
      title: noteTitle,
      file_url: fileUrl,
    });

    if (error) {
      alert('Failed to add note.');
      return;
    }

    setNoteTitle('');
    setNoteFile(null);

    const { data } = await supabase.from('notes').select().eq('chapter_id', selectedChapter);
    setNotes(data);
  };

  const handleDeleteVideo = async (id) => {
    await supabase.from('videos').delete().eq('id', id);
    setVideos((prev) => prev.filter((v) => v.id !== id));
  };

  const handleDeleteNote = async (id) => {
    await supabase.from('notes').delete().eq('id', id);
    setNotes((prev) => prev.filter((n) => n.id !== id));
  };

  return (
    <div className="p-6 space-y-8">
      <h2 className="text-2xl font-bold">🎓 Manage Resources</h2>

      <select
        className="p-3 bg-gradient-to-br from-zinc-800 to-zinc-700 text-white rounded w-full"
        value={selectedChapter}
        onChange={(e) => setSelectedChapter(e.target.value)}
      >
        <option value="">Select a chapter</option>
        {chapters.map((c) => (
          <option key={c.id} value={c.id}>
            {c.title}
          </option>
        ))}
      </select>

      {selectedChapter && (
        <>
          {/* Add Video */}
          <div className="space-y-3">
            <h3 className="text-xl font-semibold">🎥 Add Video</h3>
            <input
              className="p-2 bg-zinc-800 text-white rounded w-full"
              placeholder="Video Title"
              value={videoTitle}
              onChange={(e) => setVideoTitle(e.target.value)}
            />
            <input
              className="p-2 bg-zinc-800 text-white rounded w-full"
              placeholder="Video URL"
              value={videoUrl}
              onChange={(e) => setVideoUrl(e.target.value)}
            />
            <button
              onClick={handleAddVideo}
              className="bg-blue-600 px-4 py-2 rounded hover:bg-blue-500 text-white transition"
            >
              Upload Video
            </button>
          </div>

          {/* Add Note */}
          <div className="space-y-3 pt-6">
            <h3 className="text-xl font-semibold">📄 Add Note</h3>
            <input
              className="p-2 bg-zinc-800 text-white rounded w-full"
              placeholder="Note Title"
              value={noteTitle}
              onChange={(e) => setNoteTitle(e.target.value)}
            />
            <input
              type="file"
              accept=".pdf"
              onChange={(e) => setNoteFile(e.target.files[0])}
              className="w-full text-white"
            />
            <button
              onClick={handleAddNote}
              className="bg-green-600 px-4 py-2 rounded hover:bg-green-500 text-white transition"
            >
              Upload Note
            </button>
          </div>

          {/* List of Videos */}
          <div className="space-y-2 pt-6">
            <h3 className="text-lg font-semibold">📼 Videos</h3>
            <ul className="space-y-2">
              {videos.map((video) => (
                <li
                  key={video.id}
                  className="p-3 rounded bg-gradient-to-r from-blue-900 to-indigo-700 text-white flex justify-between items-center"
                >
                  <a
                    href={video.video_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:underline"
                  >
                    {video.title}
                  </a>
                  <button
                    onClick={() => handleDeleteVideo(video.id)}
                    className="text-red-300 hover:text-red-500"
                  >
                    Delete
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* List of Notes */}
          <div className="space-y-2 pt-6">
            <h3 className="text-lg font-semibold">📝 Notes</h3>
            <ul className="space-y-2">
              {notes.map((note) => (
                <li
                  key={note.id}
                  className="p-3 rounded bg-gradient-to-r from-green-800 to-lime-700 text-white flex justify-between items-center"
                >
                  <a
                    href={note.file_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:underline"
                  >
                    {note.title}
                  </a>
                  <button
                    onClick={() => handleDeleteNote(note.id)}
                    className="text-red-300 hover:text-red-500"
                  >
                    Delete
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </>
      )}
    </div>
  );
};

export default ResourceManager;
