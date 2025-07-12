# OpenAI Image Background App

This project is a simple web application that allows users to upload PNG images and add backgrounds to them using the OpenAI API. The application is structured into a server-side component and a client-side component.

## Project Structure

```
openai-image-background-app
├── server
│   ├── index.js                # Entry point for the server application
│   ├── routes
│   │   └── api.js              # API routes for image processing
│   ├── controllers
│   │   └── imageController.js   # Logic for handling image uploads and processing
│   ├── services
│   │   └── openaiService.js     # Functions to interact with the OpenAI API
│   ├── middleware
│   │   └── fileUpload.js        # Middleware for handling file uploads
│   └── config
│       ├── default.json         # Default configuration settings
│       └── secrets.env          # Sensitive information like API keys
├── client
│   ├── public
│   │   └── index.html           # Main HTML file for the client application
│   └── src
│       ├── App.js               # Main component of the React application
│       ├── components
│       │   ├── ImageUploader.js  # Component for uploading images
│       │   └── BackgroundPreview.js # Component for displaying processed images
│       ├── styles
│       │   └── app.css          # CSS styles for the application
│       └── utils
│           └── api.js           # Functions for making API calls to the server
├── .gitignore                   # Files and directories to ignore by Git
├── package.json                 # Configuration file for npm
└── README.md                    # Documentation for the project
```

## Setup Instructions

1. **Clone the repository:**
   ```
   git clone <repository-url>
   cd openai-image-background-app
   ```

2. **Install server dependencies:**
   Navigate to the `server` directory and run:
   ```
   npm install
   ```

3. **Install client dependencies:**
   Navigate to the `client` directory and run:
   ```
   npm install
   ```

4. **Configure environment variables:**
   Create a `.env` file in the `server/config` directory and add your API keys and database credentials.

5. **Run the server:**
   From the `server` directory, run:
   ```
   node index.js
   ```

6. **Run the client:**
   From the `client` directory, run:
   ```
   npm start
   ```

## Usage

- Open your browser and navigate to `http://localhost:3000`.
- Use the image uploader to select and upload a PNG image.
- The application will process the image and display it with the new background.

## Contributing

Feel free to submit issues or pull requests to improve the application.