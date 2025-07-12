import React from 'react';

const BackgroundPreview = ({ imageUrl }) => {
    return (
        <div className="background-preview">
            {imageUrl ? (
                <img src={imageUrl} alt="Processed with new background" />
            ) : (
                <p>No image available. Please upload an image to see the preview.</p>
            )}
        </div>
    );
};

export default BackgroundPreview;