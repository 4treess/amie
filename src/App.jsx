import React, { useState } from 'react';
import { Calendar, Heart, ArrowLeft } from 'lucide-react';

const App = () => {
  const [selectedEvent, setSelectedEvent] = useState(null);

  // Your relationship milestones
  const events = [
    {
      id: 1,
      date: "Oct 12",
      year: "2024",
      shortDesc: "The First Date",
      fullTitle: "Where It All Began",
      story: "The first time I saw you, I knew this was going to be special. That coffee shop date turned into hours of talking that I never wanted to end.",
      image: "https://images.unsplash.com/photo-1517048676732-d65bc937f952?w=800"
    },
    {
      id: 2,
      date: "Dec 25",
      year: "2024",
      shortDesc: "First Holidays",
      fullTitle: "Our First Christmas",
      story: "Spending the holidays with you was the best gift I could have asked for. The city lights were nothing compared to your smile.",
      image: "https://images.unsplash.com/photo-1512389142860-9c449e58a543?w=800"
    },
    {
      id: 3,
      date: "Feb 14",
      year: "2025",
      shortDesc: "Valentine's Day",
      fullTitle: "A Romantic Evening",
      story: "A night filled with love and quiet moments. Just being with you is all I ever need to feel at home.",
      image: "https://images.unsplash.com/photo-1518199266791-5375a83190b7?w=800"
    },
    {
      id: 4,
      date: "Mar 20",
      year: "2025",
      shortDesc: "Weekend Getaway",
      fullTitle: "Our First Road Trip",
      story: "The open road, the music, and you by my side. Every mile was a new memory I'll cherish forever.",
      image: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=800"
    }
  ];

  return (
    <div className="min-h-screen bg-[#fffafa] text-slate-800 font-sans">
      {/* Navigation Bar */}
      <nav className="bg-white/80 backdrop-blur-md px-6 py-4 flex justify-between items-center shadow-sm sticky top-0 z-50">
        <div className="flex items-center gap-2 text-rose-500 font-bold text-xl font-serif">
          <Heart size={22} fill="currentColor" />
          <span>Amie & Me</span>
        </div>
        <div className="text-xs font-bold uppercase tracking-widest text-rose-300 border-b-2 border-rose-200">
          Timeline
        </div>
      </nav>

      <main className="max-w-md mx-auto p-4 md:max-w-2xl">
        {!selectedEvent ? (
          <div className="animate-in fade-in duration-700">
            <header className="py-10 text-center">
              <h2 className="text-3xl font-serif text-slate-700 italic">Our Love Story</h2>
              <p className="text-rose-300 text-sm mt-2">Every moment is a treasure</p>
            </header>

            {/* Horizontal Scroll Timeline */}
            <div className="relative pt-12 pb-8">
              {/* Timeline Track Line */}
              <div className="absolute top-[84px] left-0 w-full h-0.5 bg-rose-100"></div>
              
              <div className="flex overflow-x-auto gap-12 px-8 no-scrollbar snap-x relative">
                {events.map((event) => (
                  <div 
                    key={event.id}
                    onClick={() => setSelectedEvent(event)}
                    className="flex-shrink-0 flex flex-col items-center snap-center cursor-pointer group"
                  >
                    {/* Calendar Icon Design */}
                    <div className="w-24 h-28 bg-white rounded-2xl shadow-lg border-t-[12px] border-rose-400 overflow-hidden flex flex-col items-center justify-center transition-transform group-hover:scale-105 active:scale-95">
                      <span className="text-[10px] font-black text-rose-300 uppercase tracking-tighter">{event.date.split(' ')[0]}</span>
                      <span className="text-3xl font-black text-slate-700 leading-none">{event.date.split(' ')[1]}</span>
                      <span className="text-[10px] text-slate-300 font-medium mt-1">{event.year}</span>
                    </div>
                    
                    <p className="mt-4 text-center text-[10px] font-bold text-slate-400 w-24 uppercase tracking-widest leading-tight">
                      {event.shortDesc}
                    </p>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="flex justify-center mt-6">
              <div className="w-1 h-1 rounded-full bg-rose-200 mx-1"></div>
              <div className="w-1 h-1 rounded-full bg-rose-200 mx-1"></div>
              <div className="w-1 h-1 rounded-full bg-rose-200 mx-1"></div>
            </div>
          </div>
        ) : (
          /* Blog Style Detail View */
          <div className="bg-white rounded-[2rem] shadow-2xl overflow-hidden animate-in slide-in-from-bottom-8 duration-500">
            <div className="relative h-80">
              <img src={selectedEvent.image} alt="Our Memory" className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
              <button 
                onClick={() => setSelectedEvent(null)}
                className="absolute top-6 left-6 bg-white/90 backdrop-blur-sm p-3 rounded-full text-rose-500 shadow-lg hover:bg-white transition-colors"
              >
                <ArrowLeft size={24} />
              </button>
            </div>
            
            <div className="p-8 md:p-12">
              <div className="flex items-center gap-2 text-rose-400 text-xs font-black mb-3 uppercase tracking-widest">
                <Calendar size={14} /> {selectedEvent.date}, {selectedEvent.year}
              </div>
              <h3 className="text-4xl font-serif text-slate-800 mb-6 leading-tight">{selectedEvent.fullTitle}</h3>
              <p className="text-slate-600 leading-relaxed text-lg font-light italic border-l-4 border-rose-50 pl-6 py-2">
                {selectedEvent.story}
              </p>
              
              <div className="mt-12 flex items-center justify-center gap-4">
                <div className="h-px bg-rose-50 flex-grow"></div>
                <Heart size={28} className="text-rose-100" />
                <div className="h-px bg-rose-50 flex-grow"></div>
              </div>
            </div>
          </div>
        )}
      </main>

      <style>{`
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
    </div>
  );
};

export default App;