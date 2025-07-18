import React, { useState } from 'react';
import axios from 'axios';

const ImageUploader = () => {
    const [selectedFile, setSelectedFile] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [previewUrl, setPreviewUrl] = useState(null);
    const [generatedImage, setGeneratedImage] = useState(null);
    const [backgroundPrompt, setBackgroundPrompt] = useState('');

    const handleFileChange = (event) => {
        const file = event.target.files[0];
        setSelectedFile(file);
        
        // Создаем URL для предварительного просмотра
        if (file) {
            const url = URL.createObjectURL(file);
            setPreviewUrl(url);
        } else {
            setPreviewUrl(null);
        }
        
        // Сбрасываем предыдущий результат
        setGeneratedImage(null);
        setError(null);
    };

    const handleGenerateBackground = async () => {
        if (!selectedFile) {
            setError('Please select an image file first.');
            return;
        }

        // if (!backgroundPrompt.trim()) {
        //     setError('Please enter a background description.');
        //     return;
        // }

        const formData = new FormData();
        formData.append('image', selectedFile);
        // formData.append('prompt', backgroundPrompt);

        setLoading(true);
        setError(null);

        console.log('Selected file:', selectedFile);
        console.log('FormData:', formData.get('image'));

        try {
            // const response = await axios.post('/api/generate-background', formData, {
                // const response = await axios.post('http://localhost:5050/api/generate-background', formData, {
            // const response = await axios.post('http://localhost:5050/api/process', formData, {
            //     headers: {
            //         'Content-Type': 'multipart/form-data',
            //     },
            //     // timeout: 60000, // 60 секунд таймаут для OpenAI API
            // });
            const response = await axios.post('http://localhost:5050/api/process', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            
            const b64 = response.data?.result;
            if (b64) {
                setGeneratedImage(`data:image/png;base64,${b64}`);
            } else {
                setError('No image data received from server.');
            }
            console.log('Background generation successful:', response.data);
        } catch (err) {
            // debugger
            console.error('Error generating background:', err);
            if (err.response?.data?.error.message) {
                setError(err.response?.data?.error.message || 'Error generating background. Please try again.');
            } else if (err.code === 'ECONNABORTED') {
                setError('Request timed out. Please try again.');
            } else if (err.response?.status === 413) {
                setError('File too large. Please upload a smaller image (max 4 MB).');
            } else if (err.response?.status === 400) {
                setError('Bad request. Please check the uploaded file and try again.');
            } else {
                setError('Error generating background. Please try again.');
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="image-uploader">
            <div className="upload-section">
                <h3>Upload Image</h3>
                <input 
                    type="file" 
                    accept="image/png,image/jpeg,image/jpg" 
                    onChange={handleFileChange}
                    disabled={loading}
                />
                
                {/* Предварительный просмотр */}
                {previewUrl && (
                    <div className="image-preview">
                        <img 
                            src={previewUrl} 
                            alt="Original" 
                            style={{
                                width: '150px',
                                height: '150px',
                                border: '2px solid #FFD700',
                                borderRadius: '20px',
                                objectFit: 'cover',
                                marginTop: '10px',
                                display: 'block'
                            }}
                        />
                        <p>Original Image</p>
                    </div>
                )}
            </div>

            <div className="prompt-section">
                <h3>Background Description</h3>
                <textarea
                    value={backgroundPrompt}
                    onChange={(e) => setBackgroundPrompt(e.target.value)}
                    placeholder="Describe the background you want (e.g., 'beautiful sunset over mountains', 'modern office space', 'tropical beach')"
                    style={{
                        width: '100%',
                        height: '100px',
                        padding: '10px',
                        borderRadius: '10px',
                        border: '1px solid #ddd',
                        fontSize: '14px',
                        resize: 'vertical'
                    }}
                    disabled={loading}
                />
            </div>

            <button 
                onClick={handleGenerateBackground} 
                // disabled={loading || !selectedFile || !backgroundPrompt.trim()}
                disabled={loading || !selectedFile}
                style={{
                    backgroundColor: loading ? '#ccc' : '#007bff',
                    color: 'white',
                    padding: '12px 24px',
                    border: 'none',
                    borderRadius: '10px',
                    fontSize: '16px',
                    cursor: loading ? 'not-allowed' : 'pointer',
                    marginTop: '15px'
                }}
            >
                {loading ? 'Generating Background...' : 'Generate New Background'}
            </button>

            {error && (
                <p 
                    className="error" 
                    style={{ 
                        color: 'white', 
                        backgroundColor: '#ff4d4f', 
                        padding: '10px', 
                        borderRadius: '8px', 
                        marginTop: '10px', 
                        textAlign: 'center',
                        fontWeight: 'bold',
                        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
                    }}
                >
                    {error}
                </p>
            )}

            {/* Результат генерации */}
            {generatedImage && (
                <div className="generated-result">
                    <h3>Generated Result</h3>
                    <div className="image-comparison">
                        <div className="image-container">
                            <img 
                                src={previewUrl} 
                                alt="Original" 
                                style={{
                                    width: '200px',
                                    height: '200px',
                                    border: '2px solid #FFD700',
                                    borderRadius: '20px',
                                    objectFit: 'cover',
                                    margin: '10px'
                                }}
                            />
                            <p>Original</p>
                        </div>
                        <div className="arrow">→</div>
                        <div className="image-container">
                            <img 
                                src={generatedImage} 
                                alt="Generated" 
                                style={{
                                    width: '200px',
                                    height: '200px',
                                    border: '2px solid #00FF00',
                                    borderRadius: '20px',
                                    objectFit: 'cover',
                                    margin: '10px'
                                }}
                            />
                            <p>Generated</p>
                        </div>
                    </div>
                    <button 
                        onClick={() => {
                            const link = document.createElement('a');
                            link.href = generatedImage;
                            link.download = 'generated-background.png';
                            link.click();
                        }}
                        style={{
                            backgroundColor: '#28a745',
                            color: 'white',
                            padding: '10px 20px',
                            border: 'none',
                            borderRadius: '8px',
                            cursor: 'pointer',
                            marginTop: '10px'
                        }}
                    >
                        Download Result
                    </button>
                </div>
            )}
        </div>
    );
};

export default ImageUploader;