'use client';
import React, { useState } from 'react';
import { toast } from 'react-toastify';

interface AudioUploaderProps {
  onAudioUploaded: (audioUrl: string, publicId: string) => void;
  label?: string;
  className?: string;
}

const AudioUploader: React.FC<AudioUploaderProps> = ({ 
  onAudioUploaded, 
  label = "Upload Audio File",
  className = ""
}) => {
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('audio/')) {
      toast.error('Please select a valid audio file');
      return;
    }

    // Validate file size (max 50MB for listening tests)
    const maxSize = 50 * 1024 * 1024; // 50MB
    if (file.size > maxSize) {
      toast.error('Audio file size must be less than 50MB');
      return;
    }

    setIsUploading(true);
    setUploadProgress(0);

    try {
      const formData = new FormData();
      formData.append('audio', file);

      const response = await fetch('/api/upload/listening-audio', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Upload failed');
      }

      const result = await response.json();

      if (result.success) {
        onAudioUploaded(result.audioUrl, result.publicId);
        toast.success('Audio uploaded successfully!');
        setUploadProgress(100);
      } else {
        throw new Error(result.error || 'Upload failed');
      }
    } catch (error) {
      console.error('Upload error:', error);
      toast.error('Failed to upload audio file. Please try again.');
    } finally {
      setIsUploading(false);
      setUploadProgress(0);
    }
  };

  return (
    <div className={`form-control ${className}`}>
      <label className="label">
        <span className="label-text font-semibold text-black">{label}</span>
      </label>
      
      <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-blue-400 transition-colors">
        <input
          type="file"
          accept="audio/*"
          onChange={handleFileChange}
          disabled={isUploading}
          className="hidden"
          id="audio-upload"
        />
        <label 
          htmlFor="audio-upload" 
          className={`cursor-pointer block ${isUploading ? 'opacity-50' : ''}`}
        >
          <div className="flex flex-col items-center space-y-2">
            <svg 
              className="w-12 h-12 text-gray-400" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15.536a5 5 0 001.414 1.414m0-11.314a5 5 0 00-1.414 1.414" 
              />
            </svg>
            <div className="text-sm text-gray-600">
              {isUploading ? (
                <div className="space-y-2">
                  <div className="text-blue-600">Uploading...</div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-blue-600 h-2 rounded-full transition-all duration-300" 
                      style={{ width: `${uploadProgress}%` }}
                    ></div>
                  </div>
                </div>
              ) : (
                <>
                  <div className="font-medium text-gray-700">
                    Click to upload audio file
                  </div>
                  <div className="text-xs text-gray-500">
                    MP3, WAV, M4A up to 50MB
                  </div>
                </>
              )}
            </div>
          </div>
        </label>
      </div>
    </div>
  );
};

export default AudioUploader; 