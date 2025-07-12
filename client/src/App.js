import React from 'react';
import ImageUploader from './components/ImageUploader.js';
import BackgroundPreview from './components/BackgroundPreview.js';

function App() {
  return (
    <div className="App">
      <h1 style={{color: 'red'}}>Image Background Changer</h1>
      <p>Welcome to the Image Background Changer!</p>
      <ImageUploader />
      <BackgroundPreview />
    </div>
  );
}

export default App;