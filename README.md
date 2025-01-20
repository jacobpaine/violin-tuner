# Violin Tuner App

A web-based tuner intended for a violin.  The app detects the frequency of sounds in real-time, identifies the closest musical note, and provides feedback on how sharp or flat the pitch is.

Musical tuners can be especially finicky. This one is optimized for a violin, not necessarily other tones, like the human voice, whistling, or a otherwise. Plucking the strings can be accurate, but for best results use your bow.

This particular tuner is intended for our local community music center here in Nashville, the [Fiddle and Pick](https://fiddleandpick.com/).

Deployed on my site, [Fine Tuned Functions](https://finetunedfunctions.com/tuner)
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

## Demo

Include a screenshot or link to a live demo (if hosted).

---

## Installation

1. **Clone the repository**:
   ```bash
   git clone https://github.com/your-username/your-repository-name.git
   cd your-repository-name
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Start the development server**:
   ```bash
   npm run dev
   ```

4. Open your browser and navigate to `http://localhost:3000`.

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

---

## Acknowledgments

- Inspired by the need for an intuitive and visually pleasing musical tuner.
- Special thanks to the React and Web Audio API communities for their excellent resources and support.

