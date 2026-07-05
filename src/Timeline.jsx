import React, { useState } from 'react';
import { Calendar, Heart, ArrowLeft, Image as ImageIcon } from 'lucide-react';
import { Menu, MenuItem, MenuButton, MenuItems } from "@headlessui/react";
import ReactMarkdown from 'react-markdown';

const RelationshipTimeline = () => {
  const [selectedEvent, setSelectedEvent] = useState(null);

  const events = [
    {
      id: 1,
      date: "Jan 1",
      year: "2026",
      shortDesc: "string",
      fullTitle: "string",
      story: "string",
    }
  ];
  const [showForm, setShowForm] = useState(false);
  const [newEvent, setNewEvent] = useState({
    date: '', year: '2026', shortDesc: '', fullTitle: '', story: '', image: ''
  });

  // This function sends the data to your MongoDB endpoint
  const handleAddEvent = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('https://your-api-endpoint.com/api/events', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newEvent),
      });

      if (response.ok) {
        alert("Memory Saved! ❤️");
        setShowForm(false);
      }
    } catch (err) {
      console.error("Error saving event:", err);
    }
  };

  return (
    <div className="min-h-screen bg-rose-50 font-sans text-slate-800">
      {/* Navigation Bar */}
      <nav className="bg-white shadow-sm px-6 py-4 flex justify-between items-center sticky top-0 z-50">
        <h1 className="text-rose-500 font-serif text-xl font-bold flex items-center gap-2">
          <Heart size={20} className="text-blue-400 fill-blue-400" /> Amie + Trevor <Heart size={20} className="text-green-400 fill-green-400" />
        </h1>
        <div className="flex gap-6 text-slate-500 font-medium">
          <Menu className="text-rose-500 border-b-2 border-rose-500 cursor-pointer text-center relative -translate-x-2" as="div">
            <MenuButton>Timeline</MenuButton>
            <MenuItems className="absolute w-30 right-1/2 translate-x-1/2 bg-white border divide-y-2 divide-rose-500" as="div">
              <MenuItem className="hover:bg-rose-100">
                <a className="block" href='#'>More To Come on our future Amieverseries!</a>
              </MenuItem>
              {/* <MenuItem className="hover:bg-rose-100">
                <a className="block" href='#'>More To Come on our future Amieverseries!</a>
              </MenuItem> */}
            </MenuItems>
          </Menu>
        </div>
      </nav>

      {/* Main Content */}
      <main className="p-4 max-w-4xl mx-auto">
        
        {!selectedEvent ? (
          <div className="animate-fade-in">
            <header className="py-8 text-center">
              <h2 className="text-3xl font-serif text-slate-700 italic">Our Shared Memories</h2>
              <p className="text-slate-400 mt-2">Scroll to explore our journey<br/>Events are in reverse chronological order</p>
            </header>

            {/* Horizontal Timeline Container */}
            <div className="relative mt-10">
              {/* Connecting Line */}
              <div className="absolute top-12 left-0 w-full h-1 bg-rose-200 z-0"></div>
              
              <div className="flex overflow-x-auto pb-12 pt-4 snap-x hide-scrollbar relative z-10 gap-12 px-8">
                {events.map((event) => (
                  <div 
                    key={event.id}
                    onClick={() => setSelectedEvent(event)}
                    className="flex-shrink-0 snap-center flex flex-col items-center cursor-pointer transition-transform hover:scale-105"
                  >
                    {/* Calendar Icon Design */}
                    <div className="w-24 h-28 bg-white rounded-xl shadow-lg border-2 border-rose-100 overflow-hidden relative">
                      <div className="bg-rose-500 h-8 flex items-center justify-center text-white text-xs font-bold uppercase tracking-widest">
                        {event.year}
                      </div>
                      <div className="flex flex-col items-center justify-center h-20">
                        <span className="text-2xl font-bold text-slate-700">{event.date.split(' ')[1]}</span>
                        <span className="text-xs text-rose-400 font-medium">{event.date.split(' ')[0]}</span>
                      </div>
                    </div>
                    
                    {/* Brief Description (Max 25 chars design) */}
                    <p className="mt-4 text-center text-sm font-semibold text-slate-600 w-24 leading-tight">
                      {event.shortDesc}
                    </p>
                  </div>
                ))}
              </div>
              <div className="flex justify-center pb-12">
                <button 
                  onClick={() => setShowForm(true)}
                  className="flex items-center gap-2 bg-white text-rose-400 px-6 py-3 rounded-full shadow-md border border-rose-100 font-bold hover:bg-rose-50 transition-all active:scale-95"
                >
                  <span className="text-xl">+</span> Add New Memory
                </button>
              </div>
            </div>
          </div>
        ) : (
          /* Blog Style Detail View */
          <div className="animate-slide-up bg-white rounded-3xl shadow-xl overflow-hidden min-h-[70vh]">
            <div className="relative h-64 bg-slate-200">
              <img 
                src={selectedEvent.image} 
                alt="Memory" 
                className="w-full h-full object-cover"
              />
              <button 
                onClick={() => setSelectedEvent(null)}
                className="absolute top-4 left-4 bg-white/90 p-2 rounded-full shadow-md text-rose-500 hover:bg-white"
              >
                <ArrowLeft size={24} />
              </button>
            </div>

            <div className="p-8">
              <div className="flex items-center gap-2 text-rose-400 text-sm font-bold uppercase tracking-widest mb-2">
                <Calendar size={14} />
                {selectedEvent.date}, {selectedEvent.year}
              </div>
              <h3 className="text-3xl font-serif text-slate-800 mb-6">{selectedEvent.fullTitle}</h3>
              
              <div className="prose prose-rose">
                <p className="text-slate-600 leading-relaxed first-letter:text-5xl first-letter:font-serif first-letter:text-rose-500 first-letter:mr-3 first-letter:float-left">
                  <ReactMarkdown>
                    {selectedEvent.story}
                  </ReactMarkdown>
                </p>
              </div>

              <div className="mt-12 pt-8 border-t border-rose-50 flex justify-center">
                <Heart className="text-rose-200" size={32} />
              </div>
            </div>
          </div>
        )}
      </main>
      {showForm && (
        <div className="fixed inset-0 bg-rose-900/20 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
          <form 
            onSubmit={handleAddEvent}
            className="bg-white w-full max-w-md rounded-[2rem] p-8 shadow-2xl animate-in zoom-in-95 duration-300"
          >
            <h3 className="text-2xl font-serif text-slate-700 mb-6 text-center">New Milestone</h3>
            
            <div className="space-y-4">
              <input 
                placeholder="Date (e.g. Apr 26)" 
                className="w-full p-3 rounded-xl bg-rose-50 border-none focus:ring-2 focus:ring-rose-200 outline-none"
                onChange={(e) => setNewEvent({...newEvent, date: e.target.value})}
                required
              />
              <input 
                placeholder="Short Description" 
                className="w-full p-3 rounded-xl bg-rose-50 border-none focus:ring-2 focus:ring-rose-200 outline-none"
                onChange={(e) => setNewEvent({...newEvent, shortDesc: e.target.value})}
                required
              />
              <textarea 
                placeholder="The Story (Markdown supported!)" 
                rows="4"
                className="w-full p-3 rounded-xl bg-rose-50 border-none focus:ring-2 focus:ring-rose-200 outline-none"
                onChange={(e) => setNewEvent({...newEvent, story: e.target.value})}
                required
              />
              <input 
                placeholder="Image Filename (e.g. /beach.jpg)" 
                className="w-full p-3 rounded-xl bg-rose-50 border-none focus:ring-2 focus:ring-rose-200 outline-none"
                onChange={(e) => setNewEvent({...newEvent, image: e.target.value})}
              />
            </div>

            <div className="mt-8 flex gap-3">
              <button 
                type="button"
                onClick={() => setShowForm(false)}
                className="flex-1 py-3 text-slate-400 font-bold"
              >
                Cancel
              </button>
              <button 
                type="submit"
                className="flex-1 py-3 bg-rose-400 text-white rounded-xl font-bold shadow-lg shadow-rose-200 hover:bg-rose-500 transition-colors"
              >
                Save Memory
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Global CSS for hiding scrollbars and animations */}
      <style dangerouslySetInnerHTML={{ __html: `
        
        @keyframes fade-in {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes slide-up {
          from { transform: translateY(20px); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
        .animate-fade-in { animation: fade-in 0.5s ease-out; }
        .animate-slide-up { animation: slide-up 0.4s ease-out; }
      `}} />
    </div>
  );
};

export default RelationshipTimeline;