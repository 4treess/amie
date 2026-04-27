import React, { useState } from 'react';
import { Calendar, Heart, ArrowLeft, Image as ImageIcon } from 'lucide-react';
import { Menu, MenuItem, MenuButton, MenuItems } from "@headlessui/react";
import ReactMarkdown from 'react-markdown';

const RelationshipTimeline = () => {
  const [selectedEvent, setSelectedEvent] = useState(null);

  const events = [
    {
      id: 25,
      date: "Apr 24",
      year: "2026",
      shortDesc: "Clark Wrote Amie a love letter",
      fullTitle: "Clark wrote Amie a love letter as a thanks for her love letter to him",
      story: "Clark wrote Amie a love letter back to her, as a thanks for the first one, but clark handwrote it to be different from Amie's love letter so it doesnt look like he copied her. Since his handwriting is hard to read, this is what it says: \n\n'Dear My Amie Babie, \n\nThank you so much for your love letter this morning babe! It filled my heart with both love and joy! I appreciate you so much babe, and to show my appreciation I decided to hand write you a love letter! <3 I hope this letter has the same effect on you as what yours did on me. \n\nWhen I think back to the over 6 months that I have known you, I remember every little event, good or bad, from the first time you were sulky around me, when I mentioned that I wasnt sure if I would have the time in my second semester to date you, and the first timw you showed your vulnerable side whne you confided in me about your situationship, to when I asked you to be my gf in the crossword puzzle, and that valentines day letter that Xykamia read. Its only a matter of time before they know more about me as I highly doubt you mom will keep it a secret from them for long. \n\nIn May, when you tell your mom about me, Id like to know what she says about you dating someone not from the philippines, especially as you are her first child. But hopefully after meeting her, and talking to her for awhile, I will hopefully get along nicelywith her. Its a shame that I cant see your father in person too babe, but I will do my best to learn more about himto make sure I can win his approval however I can. I am looking forward to spending my entire life with you babe! I cant wait to experience what life has to offer with you, such as beautiful places all over the world via our travels, and our future house and kids, and all of the unforgetable memories we have yet to make! I cant wait for our first official date babe! I will do my best to plan a few dates when we meet up for the first time. Since we cant see each other too often because of the distance, I will do my best to make every visit memorable somehow. I have a cool idea for our 3rd month anniversary which I just thought of while writing this. You will have to wait until then to figure out what it is. I love you so much my future! \n\n-Your Clarkie Babie'",
      image: "/ClarkLoveLetter.jpg"
    },
    {
      id: 24,
      date: "Apr 23",
      year: "2026",
      shortDesc: "Amie Wrote Clark a love letter",
      fullTitle: "Amie went above and beyond and wrote Clark a love letter",
      story: "Out of the blue, for no reason at all Amie wrote Clark a love letter, which melted clarks heart when he read it. Amie wrote it on her way to her work as she didnt have her coworker to talk to, and when clark got up and read it, It melted clarks heart so much that he just wanted to hug Amie really badly and say thank you to her, But unfortunately Amie and clark are long distance and he couldnt do it. I love you so much Amie for going above and beyond as always",
      image: "/AmieLoveLetter.jpg"
    },
    {
      id: 23,
      date: "Apr 19",
      year: "2026",
      shortDesc: "Cryptogram Activity",
      fullTitle: "Can Amie decypher the cryptogram?",
      story: "I keep seeing ads all the time about cryptograms saying 99.9% of people can't solve this puzzle! So is Amie a part of the 0.1% that can? Spoiler Alert, Yes she was \n\nLink: [https://puzzel.org/en/cryptogram/play?p=-OqZWICBZanLx3yQJ731](https://puzzel.org/en/cryptogram/play?p=-OqZWICBZanLx3yQJ731)",
      image: "/Cryptogram.png"
    },
    {
      id: 22,
      date: "Apr 11",
      year: "2026",
      shortDesc: "Acrostic Activity",
      fullTitle: "An Acrostic I made for Amie",
      story: "An acrostic is a better version of the word search that I tried to do earlier, where the hidden message is more obvious than before, as for the crossword, I had to get creative with how Id hide the solution, here it is built in. \n\nLink: [https://puzzel.org/en/acrostic/play?p=-OpvKTSJKcCqK0hZN2yi](https://puzzel.org/en/acrostic/play?p=-OpvKTSJKcCqK0hZN2yi)",
      image: "/acrostic.png"
    },
    {
      id: 21,
      date: "Apr 4",
      year: "2026",
      shortDesc: "Wordsearch #2",
      fullTitle: "Wordsearch #2, Things I want to do with Amie",
      story: "You finished the word search so fast last time, so I wanted to give you a harder one, but unfortunately for me, detective Polly was too fast and skilled, so this word search didnt take her long at all. Maybe in the future I will do an even harder one... \n\nLink: [https://puzzel.org/en/wordseeker/play?p=-OpML8x4iLzF387Zc48n](https://puzzel.org/en/wordseeker/play?p=-OpML8x4iLzF387Zc48n)",
      image: "/Word-search-2.png"
    },
    {
      id: 20,
      date: "Apr 1",
      year: "2026",
      shortDesc: "Second Month Amieversary",
      fullTitle: "Amie and Clark's Second Month Anniversary!",
      story: "On their second anniversary, Clark was really busy as he had a test and a presentation that day, so Amie sent clark a video motivating him and wishing him a lot of luck on his test, and also sent a long text message. Clark tried to make a cake to celebrate it much later, but unfortunately the fondant didnt turn out so that ruined his plans :( So clark went all out for their 3rd month Amieversary",
      image: "/2-months-with-the-loml.jpeg"
    },
    {
      id: 19,
      date: "Mar 22",
      year: "2026",
      shortDesc: "Online Jigsaw Puzzle",
      fullTitle: "An Online Jigsaw Puzzle with a secret message",
      story: "I wanted to give you another activity and I dodnt have a lot of time so I decided to create one by going to ChatGPT, asking it to generate me an image with a secret message written in it, and made that a jisgaw puzzle with 3 clicks of a button <3 In fact most of these activities are like that. I dont want you to think I dumped hours into it, the only time I did was making this website. \n\nLink: [https://puzzel.org/en/jigsaw/play?p=-OoJkXlgwbzZu34t2OHZ](https://puzzel.org/en/jigsaw/play?p=-OoJkXlgwbzZu34t2OHZ)",
      image: "/Puzzle.png"
    },
    {
      id: 18,
      date: "Mar 21",
      year: "2026",
      shortDesc: "WordSearch Activity #1",
      fullTitle: "Word Search #1, Ways to describe Amie",
      story: "Amie told Clark she liked doing word puzzles, and what type of word puzzle is more iconic than a word search? Clark also wanted to make amie feel happy while doing the word search, so he decided to list all of the words that you deserve to hear as you are all these qualities, but nobody probably tells you that, so I made a word search to do it for you \n\nLink: [https://puzzel.org/en/wordseeker/play?p=-OoEDVgyN3D1q22LQ0cD](https://puzzel.org/en/wordseeker/play?p=-OoEDVgyN3D1q22LQ0cD)", 
      image: "/Word-search.png"
    },
    {
      id: 17,
      date: "Mar 12",
      year: "2026",
      shortDesc: "Wordle Activity",
      fullTitle: "For an Activity Time, Clark gave Amie a series of wordles",
      story: "Clark was playing worlde a lot with his online friend and he didnt want to introduce amie to them yet, so he made Amie join in on the daily wordle, by making her do this activity <3 \n\nThe activity link: [https://puzzel.org/en/wordle/play?p=-OnVZp8T0XCOeJqUQrbu](https://puzzel.org/en/wordle/play?p=-OnVZp8T0XCOeJqUQrbu)",
      image: "/Wordle.png"
    },
    {
      id: 16,
      date: "Mar 6",
      year: "2026",
      shortDesc: "Xykamia Read Amie's Love Letter",
      fullTitle: "A 23 year old Girl in Manilla Died of embarrasment after her sister found the love letter she wrote in the notes app of her phone",
      story: "On Amie's March 6th, Xykamia read through Amie's Notes app and saw the love letter she made for me, Xykamia couldnt keep it a secret for long, So then on clarks March 6th she eventually confessed to Amie that she had read it, and she felt bad. After that interaction Amie said she was about to die of embarassment, which I felt the same way",
      image: "/Embarrassment.jpg"
    },
    {
      id: 15,
      date: "March 1",
      year: "2026",
      shortDesc: "Our One Month Amieversary",
      fullTitle: "Amie and Clark Celebrated the first month of their relationship",
      story: "For the first month celebration Clark created a reorder puzzle for Amie to solve of all the major events that happened in the relationship, which Im glad I did as it made making this webiste a bit easier. While Amie made me a video of everything she loves about me <3 Every time I watch it it melts my heart and makes me really really happy! \n\nLink to the ordering game: [https://puzzel.org/en/reorder/play?p=-OmSx7E4WkGueeKWmCBI](https://puzzel.org/en/reorder/play?p=-OmSx7E4WkGueeKWmCBI)",
      image: "/FirstMonth.jpg"
    },
    {
      id: 14,
      date: "Feb 22",
      year: "2026",
      shortDesc: "Hangman Activity",
      fullTitle: "Clark made Amie a Hangman puzzle to solve",
      story: "Amie was bored one day at work (On a sunday) so clark sent her a hangman puzzle to pass the time. Of course all the letters had to do with their relationship, so it made them feel even closer when she did it \n\nLink to the hangman activity: [https://puzzel.org/en/hangman/play?p=-Om3JaV6CkaZjYTpSsFK](https://puzzel.org/en/hangman/play?p=-Om3JaV6CkaZjYTpSsFK) ",
      image: "/hangman.png"
    },
    {
      id: 13,
      date: "Feb 14",
      year: "2026",
      shortDesc: "Our First Valentines Day",
      fullTitle: "Amie and Clark Celebrated their first valentines day together",
      story: "Amie handwrote a love letter for clark which was very kind and sweet of her, while clark made a board game for Amie to play using a board game creation website. Clark was evil and made it so Amie had to get a question wrong in order to finish the board game which annoyed Amie a lot as she wants to get every question right \n\nLink to the board game: [https://puzzel.org/en/board-game/play?p=-OkuT2O3AYz3s3BDMMp4](https://puzzel.org/en/board-game/play?p=-OkuT2O3AYz3s3BDMMp4)",
      image: "/loveLetter1.jpg"
    },
    {
      id: 12,
      date: "Feb 11",
      year: "2026",
      shortDesc: "The First Activity Time!",
      fullTitle: "Clark gave Amie an activity to do for the first time while he was asleep",
      story: "The fist ever activity that clark gave to Amie was sending a gif representing what you are currently doing, and I had to guess what the activity was that she was doing. The same night clark gave her 2 more activities, which were two truths and a lie, and to explain a childhood memory from a school trip. The following day Amie had to take photos of items that started with a certain letter, and then she had to take a photo of something that she finds cute",
      image: "/ActivityTime!.webp"
    },
    {
      id: 11,
      date: "Feb 7",
      year: "2026",
      shortDesc: "Royal Match Knockoff",
      fullTitle: "Clark got bored so he thought it would be funny to make a royal match knockoff",
      story: "Clark learned from Amie the day before that the drink he knows as fanta was named royal in the philippines, so he thought it would be funny to make a knockoff version of the game that him and Amie both play called 'Royal Match' so he made a game where you match the flavors of royal with their images. \n\nHere is the link to the game: [https://puzzel.org/en/matching-pairs/play?p=-OkuQdn6E-pXp-Kh5FLD](https://puzzel.org/en/matching-pairs/play?p=-OkuQdn6E-pXp-Kh5FLD)",
      image: "/Knockoff.png"
    },
    {
      id: 10,
      date: "Feb 1",
      year: "2026",
      shortDesc: "Amie's First Uno Game",
      fullTitle: "Amie Played Uno for the first time with clark and his online friend",
      story: "Clark got invited to play Uno with his online friends but they needed an extra person, so he invited Amie to play Uno with him. Amie downloaded the app, played the game, then got hooked. Clark and Amie have played 2 player uno occasionally ever since",
      image: "/Uno.png"
    },
    {
      id: 9,
      date: "Feb 1",
      year: "2026",
      shortDesc: "Clark and Amie became bf/gf",
      fullTitle: "Clark and Amie became officially a couple and they are now boyfriend and girlfriend",
      story: "Before clark asked amie to be his gf, He made sure that she loved him first as he didnt want her to say no and this be awkward, then he gave her a crossword puzzle to do, and made the first letter of each of the puzzle spell 'Pwede tika mahimong uyab' Once Amie saw what it spelt she was extremely happy and said 'Musugot ko nga mahimong imong uyab' which google translate falsely translated to 'Im trying to be your friend' which gave poor clark a heart attack thinking the answer was a no",
      image: "/IMTRYINGTOBEYOURFRIEND.jpg"
    },
    {
      id: 8,
      date: "Jan 28",
      year: "2026",
      shortDesc: "The first video call",
      fullTitle: "Amie and Clark had their first video call",
      story: "Amie seemed too perfect for clark, so he wanted to make sure that he was actually talking to Amie rather than someone pretending to be Amie, as they got along almost too well, so Amie started a video call on her way home from work to help comfort clark, which ended up waking him up . Which I still appriciate and think about even now, Thank you so much Amie for all the effort and care you put into our relationship, It means more than the world to me ",
      image: "/Video.jpeg"
    },
    {
      id: 7,
      date: "Jan 27",
      year: "2026",
      shortDesc: "Amie sent Clark MyComfort",
      fullTitle: "Amie sent clark her playlist of her favorite songs",
      story: "Amie sent Clark her playlist of her favorite songs, which clark uses as his go to playlist now, as he wants to feel connected to her whenever he listens to music. They have a very similar music taste, so all the songs he likes are on there, and she adds all the songs clark says he likes, without him even asking. Amie is the best gf ever <3",
      image: "/Spotify.png"
    },
    {
      id: 6,
      date: "Jan 21",
      year: "2026",
      shortDesc: "Mirrors became Our Theme Song",
      fullTitle: "Amie and Clark made Mirrors by Justin Timberlake their theme song",
      story: "Amie shared the song Mirrors with clark, which reminded him of when he was young, but when he looked deeper at the lyrics he realized it described his relationship with Amie very very well, as they always joked that their intrests and personalities were so similar to each other, that they were practically mirror images to eachother, hense why they chose this song to be their theme song",
      image: "/Mirror.jpg"
    },
    {
      id: 5,
      date: "Jan 19",
      year: "2026",
      shortDesc: "The First 'Babe' and 'I Love You'",
      fullTitle: "Two young lovers said I love you to each other for the first time",
      story: "Amie was way bolder than Clark was early on in the relationship, where she called clark 'Babe' for the first time that day, which lead Clark to say 'babe' in a voice message, which then lead to Amie besting Clark by saying 'I love you' first to Clark as he was too shy to say it. They both didnt know it at the time, but they would become bf/gf in less than a month from then. While things felt like they were going way slower than they were at the time, they just clicked so well that their relationship progressed quickly. This same day was also the day Amie and clark became exclusive and had a video call",
      image: "/I-Love-You.jpg"
    },
    {
      id: 4,
      date: "Jan 11",
      year: "2026",
      shortDesc: "Clark and Amie played chess",
      fullTitle: "Clark and Amie played their first game of chess",
      story: "Clark and Amie played a game of chess on the chess.com app together, Amie was beating clark at first, but then Amie made afatal mistake halfway through the game, then clark was able to win from there, However their chess skills, like everything else between them, were about equal. When they play chess next, it will be hard to tell who will win",
      image: "/chess.jpeg"
    },
    {
      id: 3,
      date: "Jan 9",
      year: "2026",
      shortDesc: "Clark and Amie started dating",
      fullTitle: "Clark and Amie started dating eachother rather than just being friends",
      story: "Before this date, while they did meet on a dating app, they acted more as friends who had crushes on each other, so awkward shy, and doing their best to impress the other person. They acted this way as Clark didnt know if he could manage a relationship and school at the same time. He didnt want to commit to a relationship, then have to end it because it was too overwhelming for him. Thankfully Amie was very kind, so when it did become overwhelming, he was able to talk to Amie less, while the relationship stayed intact",
      image: "/Ldr.jpg"
    },
    {
      id: 2,
      date: "Jan 8",
      year: "2026",
      shortDesc: "Amie Nicknamed Trevor Clark",
      fullTitle: "Amie Nicknamed Trevor Clark",
      story: "Amie didnt like Trevors first name, so she opted to call him 'Clark' instead. 'Clark' hated this at first, as he thought the name sounded clunky, but he didnt want to upset Amie about this so he let her call him Clark. However after a month of enduring the nickname, he found it cute, and now he actually likes the nickname Clark, It just took awhile to grow on him. Now when he hears Amie call him Trevor, he thinks she is mad at him for something",
      image: "/nickname.jpeg"
    },
    {
      id: 1,
      date: "Dec 10",
      year: "2025",
      shortDesc: "When We Met",
      fullTitle: "The day when we first matched on the dating app",
      story: "21 year old Clark and 22 year old Amie were both on OkCupid when they both thought to themselves 'I think that person looks really cute'. This is the day that they matched with each other, however no message was sent until the following day (For Amie) or later on that day (for Clark)",
      image: "/okcupid.png"
    }
  ];

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