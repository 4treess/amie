import React, { useState, useEffect } from 'react';
import { Calendar, Heart, ArrowLeft, Image as ImageIcon, Loader2 } from 'lucide-react';
import { Menu, MenuItem, MenuButton, MenuItems } from "@headlessui/react";
import ReactMarkdown from 'react-markdown';

const RelationshipTimeline = () => {
  const [events, setEvents] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [heartClicked, setHeartClicked] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedFile, setSelectedFile] = useState(null);
  const [newEvent, setNewEvent] = useState({
    date: '', year: '2026', shortDesc: '', fullTitle: '', story: '', image: ''
  });

  // --- MONGODB CONFIG ---
  const MONGO_CONFIG = {
    dataSource: "Cluster0", 
    database: "amie_babie",
    collection: "milestones",
  };

  // 1. PULL EVENTS FROM MONGODB
const fetchEvents = async () => {
  setIsLoading(true);
  try {
    const response = await fetch('https://amie-server-mdhz.onrender.com/api/events');
    
    // This part is the "truth teller"
    if (!response.ok) {
      const text = await response.text(); 
      console.error("SERVER ERROR HTML:", text); // Look at this in your browser console!
      return;
    }

    const data = await response.json();
    setEvents(data);
  } catch (err) {
    console.error("Fetch error:", err);
  } finally {
    setIsLoading(false);
  }
};

  useEffect(() => { fetchEvents(); }, []);

  // 2. HELPER: CONVERT FILE TO BASE64
  const toBase64 = (file) => new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result.split(',')[1]);
    reader.onerror = error => reject(error);
  });

  // 3. HANDLE SUBMIT (GITHUB THEN MONGO)
  const handleAddEvent = async (e) => {
    e.preventDefault();
    try {
      let finalImagePath = newEvent.image;

      // Phase A: GitHub Upload
      if (selectedFile) {
        const base64 = await toBase64(selectedFile);
        const fileName = `memory-${Date.now()}.jpg`;
        const ghResponse = await fetch(
          `https://api.github.com/repos/4treess/amie/contents/public/images/${fileName}`,
          {
            method: 'PUT',
            headers: {
              'Authorization': `token ${import.meta.env.VITE_GITHUB_TOKEN}`,
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              message: `${newEvent.shortDesc}`,
              content: base64,
            }),
          }
        );
        if (!ghResponse.ok) throw new Error("GitHub Upload Failed");
        // Using the Raw URL so it works instantly without waiting for a Vercel build
        finalImagePath = `https://raw.githubusercontent.com/4treess/amie/main/public/images/${fileName}`;
      }

      // Phase B: MongoDB Save
      const mongoResponse = await fetch('https://amie-server-mdhz.onrender.com/api/events', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...newEvent, image: finalImagePath }),
      });

      if (mongoResponse.ok) {
        alert("Memory Saved! ❤️");
        setShowForm(false);
        fetchEvents(); // Refresh the list
      }
    } catch (err) {
      console.error("Error saving event:", err);
      alert("Check console for error details.");
    }
  };

  return (
    <div className="min-h-screen bg-rose-50 font-sans text-slate-800">
      <nav className="bg-white shadow-sm px-6 py-4 flex justify-between items-center sticky top-0 z-50">
        <h1 className="text-rose-500 font-serif text-xl font-bold flex items-center gap-2">
          <Heart size={20} className="text-blue-400 fill-blue-400" /> Amie + Trevor <Heart size={20} className="text-green-400 fill-green-400" />
        </h1>
        <Menu as="div" className="relative">
          <MenuButton className="text-rose-500 border-b-2 border-rose-500">Timeline</MenuButton>
          <MenuItems className="absolute right-0 mt-2 w-48 bg-white border border-rose-100 shadow-xl rounded-xl overflow-hidden z-50">
            <MenuItem>
              {({ active }) => (
                <span className={`block px-4 py-3 text-xs ${active ? 'bg-rose-50' : ''}`}>
                  Future Amieverseries Coming Soon!
                </span>
              )}
            </MenuItem>
          </MenuItems>
        </Menu>
      </nav>

      <main className="p-4 max-w-4xl mx-auto">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-20 text-rose-300">
            <Loader2 className="animate-spin mb-2" size={40} />
            <p>Loading our memories...</p>
          </div>
        ) : !selectedEvent ? (
          <div className="animate-fade-in">
            <header className="py-8 text-center">
              <h2 className="text-3xl font-serif text-slate-700 italic">Our Shared Memories</h2>
              <p className="text-slate-400 mt-2">Events are in reverse chronological order</p>
            </header>

            <div className="relative mt-10">
              <div className="absolute top-12 left-0 w-full h-1 bg-rose-200 z-0"></div>
              <div className="flex overflow-x-auto pb-12 pt-4 snap-x relative z-10 gap-12 px-8">
                {events.map((event) => (
                  <div 
                    key={event._id} 
                    onClick={() => setSelectedEvent(event)}
                    className="flex-shrink-0 snap-center flex flex-col items-center cursor-pointer transition-transform hover:scale-105"
                  >
                    <div className="w-24 h-28 bg-white rounded-xl shadow-lg border-2 border-rose-100 overflow-hidden relative">
                      <div className="bg-rose-500 h-8 flex items-center justify-center text-white text-xs font-bold uppercase tracking-widest">
                        {event.year}
                      </div>
                      <div className="flex flex-col items-center justify-center h-20 px-1">
                        <span className="text-xl font-bold text-slate-700">{event.date.split(' ')[1]}</span>
                        <span className="text-[10px] text-rose-400 font-medium uppercase">{event.date.split(' ')[0]}</span>
                      </div>
                    </div>
                    <p className="mt-4 text-center text-[14px] font-bold text-slate-500 w-24 leading-tight tracking-tighter">
                      {event.shortDesc}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <div className="animate-slide-up bg-white rounded-3xl shadow-xl overflow-hidden min-h-[70vh]">
            <div className="relative h-64 bg-slate-100">
              <img src={selectedEvent.image} alt="Memory" className="w-full h-full object-cover" />
              <button onClick={() => setSelectedEvent(null)} className="absolute top-4 left-4 bg-white/90 p-2 rounded-full shadow-md text-rose-500">
                <ArrowLeft size={24} />
              </button>
            </div>
            <div className="p-8">
              <div className="flex items-center gap-2 text-rose-400 text-sm font-bold uppercase mb-2">
                <Calendar size={14} /> {selectedEvent.date}, {selectedEvent.year}
              </div>
              <h3 className="text-3xl font-serif text-slate-800 mb-6">{selectedEvent.fullTitle}</h3>
              <div className="prose prose-rose text-slate-600 leading-relaxed text-lg italic border-l-4 border-rose-50 pl-6">
                <ReactMarkdown>{selectedEvent.story}</ReactMarkdown>
              </div>
              <div className="mt-12 pt-8 border-t border-rose-50 flex justify-center">
                <Heart className={heartClicked ? "text-rose-100" : "text-rose-200 fill-rose-200"} size={32} onClick={() => setHeartClicked(!heartClicked)} />
              </div>
            </div>
          </div>
        )}
      </main>

      {!showForm && (
        <div className="flex justify-center pb-12">
          <button onClick={() => setShowForm(true)} className="flex items-center gap-2 bg-white text-rose-400 px-6 py-3 rounded-full shadow-md border border-rose-100 font-bold hover:bg-rose-50 transition-all">
            <span className="text-xl">+</span> Add New Memory
          </button>
        </div>
      )}

      {showForm && (
        <div className="fixed inset-0 bg-rose-900/20 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
          <form onSubmit={handleAddEvent} className="bg-white w-full max-w-md rounded-[2rem] p-8 shadow-2xl animate-in zoom-in-95">
            <h3 className="text-2xl font-serif text-slate-700 mb-6 text-center">New Memory</h3>
            <div className="space-y-4">
              <div className="flex gap-2">
                <input placeholder="Date (Oct 12)" className="flex-1 p-3 rounded-xl bg-rose-50 outline-none" onChange={(e) => setNewEvent({...newEvent, date: e.target.value})} required />
                <input placeholder="Year" className="w-24 p-3 rounded-xl bg-rose-50 outline-none" defaultValue="2026" onChange={(e) => setNewEvent({...newEvent, year: e.target.value})} required />
              </div>
              <input placeholder="Short Description" className="w-full p-3 rounded-xl bg-rose-50 outline-none" onChange={(e) => setNewEvent({...newEvent, shortDesc: e.target.value})} required />
              <input placeholder="Full Title" className="w-full p-3 rounded-xl bg-rose-50 outline-none" onChange={(e) => setNewEvent({...newEvent, fullTitle: e.target.value})} required />
              <textarea placeholder="The Story..." rows="4" className="w-full p-3 rounded-xl bg-rose-50 outline-none" onChange={(e) => setNewEvent({...newEvent, story: e.target.value})} required />
              <div className="relative">
                <input type="file" accept="image/*" onChange={(e) => setSelectedFile(e.target.files[0])} className="hidden" id="file-upload" />
                <label htmlFor="file-upload" className="flex items-center justify-center gap-2 w-full p-3 rounded-xl bg-rose-100 text-rose-600 cursor-pointer hover:bg-rose-200 transition-colors">
                  <ImageIcon size={18} /> {selectedFile ? selectedFile.name : "Upload Photo"}
                </label>
              </div>
            </div>
            <div className="mt-8 flex gap-3">
              <button type="button" onClick={() => setShowForm(false)} className="flex-1 py-3 text-slate-400 font-bold">Cancel</button>
              <button type="submit" className="flex-1 py-3 bg-rose-400 text-white rounded-xl font-bold shadow-lg shadow-rose-200 hover:bg-rose-500">Save Memory</button>
            </div>
          </form>
        </div>
      )}

      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes fade-in { from { opacity: 0; } to { opacity: 1; } }
        @keyframes slide-up { from { transform: translateY(20px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }
        .animate-fade-in { animation: fade-in 0.5s ease-out; }
        .animate-slide-up { animation: slide-up 0.4s ease-out; }
      `}} />
    </div>
  );
};

export default RelationshipTimeline;