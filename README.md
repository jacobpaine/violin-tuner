# finetunedfunctions.com

This is project deployment repo for some of the productivity tools I enjoy using on the daily. Currently it holds:

#### Timer
#### Journal
#### Violin Tuner

I'll try to maintain separate repos for new tools. I build these tools primarily for my own use and as portfolio fodder. Feedback is encouraged. 

Additional tools forthcoming. 


# 📓 Journal

A personal journaling and productivity tracker that links entries to goals, tracks hours and money spent, and gives you insight into your progress over time.

Built with **React**, **TypeScript**, and **IndexedDB** for offline-first persistence.

---

## 🧠 Features

- 🧱 **Three-Column Layout**: 
  - Topics (Projects/Areas)
  - Journal Entries (organized by date)
  - Goals (taggable, editable, and tracked)

- 📝 **Journal Entries**:
  - Linked to a selected topic
  - Automatically tagged with goals associated to that topic
  - Track `hours` and `money` spent per goal
  - Collapsible for a clean writing flow

- 🎯 **Goals**:
  - Editable name, description, and time/cost targets
  - Tag goals to multiple topics
  - Automatically appear in entries with matching topics
  - Displays real-time progress (`e.g. 18.5 / 100 hrs`)

- 📈 **Breakdown View**:
  - Toggle to a summary page showing time/money spent per goal
  - Filter by recent days (e.g. last 7, 30, 90 days)

- 💾 **Offline-First & Persistent**:
  - Uses **IndexedDB** to store everything in your browser
  - Works without a backend

- 🧳 **Import / Export**:
  - Download your entire journal as a JSON backup
  - Upload it again to restore

---


# ⏳ Pomodoro Timer App

A powerful and customizable Pomodoro timer built with **React + TypeScript**, designed to help you stay focused and track your productivity goals over time. Includes editable session tracking, goal linking, and persistent storage using localStorage.

---

## 🚀 Features

- 🎯 **Multiple Timers**: Create and manage as many independent timers as you like.
- 🔁 **Focus & Break Modes**: Switch between focus and short break intervals.
- 📊 **Total Tracking**: View and edit cumulative focus and break times.
- 📌 **Goal System**: Create goals linked to timers with progress indicators.
- 💾 **Persistent State**: All data (timers, goals, elapsed time) is saved in localStorage and restored on reload.
- ✏️ **Editable Durations**: Set custom durations per timer.
- 🎼 **End-of-Session Sound**: Optional audio melody plays at the end of a focus session.

---

## 🧱 Built With

- [React](https://reactjs.org/)
- [TypeScript](https://www.typescriptlang.org/)
- [Vite](https://vitejs.dev/) (recommended for development)
- CSS Modules (can be swapped out for Tailwind or SCSS)
- React Context for global timer state



# Violin Tuner

A web-based tuner intended for a violin.  The app detects the frequency of sounds in real-time, identifies the closest musical note, and provides feedback on how sharp or flat the pitch is.

Musical tuners can be especially finicky. This one is optimized for a violin, not necessarily other tones, like the human voice, whistling, or a otherwise. Plucking the strings can be accurate, but for best results use your bow.

This particular tuner is intended for our local community music center here in Nashville, the [Fiddle and Pick](https://fiddleandpick.com/).

---

## Features

- **Real-Time Pitch Detection**: Detects audio frequency from the user's microphone.
- **Chromatic Scale**: Displays all notes from G3 to D7 in a semi-circle layout.
- **Feedback System**:
  - Indicates how sharp or flat the detected note is.
  - Highlights the active note with smooth transitions.
- **Open Note Buttons**: Play predefined tones for G3, D4, A4, and E5.
- **Responsive Design**: Optimized for desktop and mobile devices.
- **Dynamic Styling**: Visually appealing gradient backgrounds, note highlights, and feedback text.

---

## Usage

### Start Listening
Click the **Start Listening** button to enable microphone input and start detecting pitches.

### Open Notes
Press the buttons for G, D, A, and E to hear their corresponding tones.

### Feedback
- The app shows whether the detected pitch is sharp or flat.
- The active note is highlighted dynamically in the semi-circle.

---

## Technologies Used

- **Frontend**:
  - React
  - TypeScript
- **Audio Analysis**:
  - Web Audio API
- **Styling**:
  - CSS3 with responsive design techniques

---

## License

This project is available for non-commericial uses.

