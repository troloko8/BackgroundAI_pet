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

        if (!backgroundPrompt.trim()) {
            setError('Please enter a background description.');
            return;
        }

        const formData = new FormData();
        formData.append('image', selectedFile);
        formData.append('prompt', backgroundPrompt);

        setLoading(true);
        setError(null);

        try {
            const response = await axios.post('/api/generate-background', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
                timeout: 60000, // 60 секунд таймаут для OpenAI API
            });
            
            setGeneratedImage(response.data.imageUrl);
            console.log('Background generation successful:', response.data);
        } catch (err) {
            console.error('Error generating background:', err);
            if (err.response?.data?.error) {
                setError(err.response.data.error);
            } else if (err.code === 'ECONNABORTED') {
                setError('Request timed out. Please try again.');
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
                disabled={loading || !selectedFile || !backgroundPrompt.trim()}
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

            {error && <p className="error" style={{ color: 'red', marginTop: '10px' }}>{error}</p>}

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