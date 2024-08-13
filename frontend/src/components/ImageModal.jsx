import React, { useCallback } from "react";

function ImageModal({ imageUrl, onClose }) {
  const handleBackgroundClick = useCallback(
    (e) => {
      if (e.target === e.currentTarget) {
        e.stopPropagation();
        onClose();
      }
    },
    [onClose]
  );

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50"
      onClick={handleBackgroundClick}
    >
      <div
        className="max-w-4xl w-full p-4 relative"
        onClick={(e) => e.stopPropagation()}
      >
        <img
          src={imageUrl}
          alt="Full size"
          className="w-full h-auto object-contain rounded-lg"
        />
        <button
          onClick={(e) => {
            e.stopPropagation();
            onClose();
          }}
          className="absolute top-6 right-6 text-white bg-black bg-opacity-50 hover:bg-opacity-75 rounded-full w-8 h-8 flex items-center justify-center transition-all duration-200 ease-in-out"
        >
          &times;
        </button>
      </div>
    </div>
  );
}

export default ImageModal;
