import React, { useState, useRef } from 'react';
import { Camera, Upload, Loader2 } from 'lucide-react';
import { useDropzone } from 'react-dropzone';
import { analyzeFoodImage } from '../../services/logmealService';
import { transformLogmealResponse } from '../../utils/logmealUtils';
import { AnalysisResult } from '../../types';

interface CameraCaptureProps {
  onAnalysisComplete: (result: AnalysisResult) => void;
}

const CameraCapture: React.FC<CameraCaptureProps> = ({ onAnalysisComplete }) => {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageCapture = async (file: File) => {
    if (!file.type.startsWith('image/')) {
      alert('Please select a valid image file');
      return;
    }

    const previewUrl = URL.createObjectURL(file);
    setPreviewImage(previewUrl);
    setIsAnalyzing(true);

    try {
      const logmealResult = await analyzeFoodImage(file);
      console.log('Logmeal API Raw Response:', logmealResult);
      const result = transformLogmealResponse(logmealResult, previewUrl);
      console.log('Transformed Analysis Result:', result);
      onAnalysisComplete(result);
    } catch (error) {
      console.error('Analysis failed:', error);
      alert('Failed to analyze image. Please try again.');
    } finally {
      setIsAnalyzing(false);
      setPreviewImage(null);
    }
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png']
    },
    multiple: false,
    onDrop: (acceptedFiles) => {
      if (acceptedFiles.length > 0) {
        handleImageCapture(acceptedFiles[0]);
      }
    }
  });

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      handleImageCapture(file);
    }
  };

  if (isAnalyzing) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] space-y-4">
        {previewImage && (
          <div className="relative">
            <img
              src={previewImage}
              alt="Analyzing..."
              className="w-48 h-48 object-cover rounded-lg shadow-lg"
            />
            <div className="absolute inset-0 bg-black bg-opacity-50 rounded-lg flex items-center justify-center">
              <Loader2 className="w-8 h-8 text-white animate-spin" />
            </div>
          </div>
        )}
        <div className="text-center">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Analyzing your meal...</h3>
          <p className="text-gray-600">Our AI is identifying foods and calculating nutrients</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Snap Your Meal</h2>
        <p className="text-gray-600">Take a photo or upload an image to analyze its nutritional content</p>
      </div>

      <div
        {...getRootProps()}
        className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-colors ${
          isDragActive
            ? 'border-primary-500 bg-primary-50'
            : 'border-gray-300 hover:border-primary-400 hover:bg-gray-50'
        }`}
      >
        <input {...getInputProps()} />
        <div className="space-y-4">
          <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto">
            <Upload className="w-8 h-8 text-primary-600" />
          </div>
          <div>
            <p className="text-lg font-medium text-gray-900">
              {isDragActive ? 'Drop your image here' : 'Drag & drop your meal photo'}
            </p>
            <p className="text-gray-500 mt-1">or click to browse files</p>
          </div>
        </div>
      </div>

      <div className="flex space-x-4">
        <button
          onClick={() => fileInputRef.current?.click()}
          className="flex-1 bg-primary-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-primary-700 transition-colors flex items-center justify-center space-x-2"
        >
          <Camera size={20} />
          <span>Choose Photo</span>
        </button>
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileSelect}
        className="hidden"
      />

      <div className="bg-accent-50 border border-accent-200 rounded-lg p-4">
        <h4 className="font-medium text-accent-800 mb-2">Tips for better analysis:</h4>
        <ul className="text-sm text-accent-700 space-y-1">
          <li>• Ensure good lighting and clear visibility of all foods</li>
          <li>• Include the entire plate or meal in the frame</li>
          <li>• Avoid shadows or reflections on the food</li>
          <li>• Take the photo from directly above when possible</li>
        </ul>
      </div>
    </div>
  );
};

export default CameraCapture;