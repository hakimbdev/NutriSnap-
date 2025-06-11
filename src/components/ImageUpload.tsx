import React, { useRef, useState } from 'react'
import { Camera } from './Camera'

interface ImageUploadProps {
  onImageSelect: (file: File) => void
  onError: (error: string) => void
}

export const ImageUpload: React.FC<ImageUploadProps> = ({ onImageSelect, onError }) => {
  const [isCapturing, setIsCapturing] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    // Validate file type
    if (!file.type.startsWith('image/')) {
      onError('Please select an image file')
      return
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      onError('Image size should be less than 5MB')
      return
    }

    onImageSelect(file)
  }

  const handleCapture = (imageFile: File) => {
    onImageSelect(imageFile)
    setIsCapturing(false)
  }

  return (
    <div className="w-full max-w-2xl mx-auto">
      {!isCapturing ? (
        <div className="text-center space-y-6">
          <div className="space-y-2">
            <h2 className="text-2xl font-bold">Add Meal Image</h2>
            <p className="text-gray-600">Take a photo or upload an existing image</p>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <button
              onClick={() => setIsCapturing(true)}
              className="p-6 bg-white rounded-lg shadow hover:shadow-md transition-shadow flex flex-col items-center"
            >
              <div className="text-4xl mb-3">📸</div>
              <div className="font-medium">Take Photo</div>
            </button>
            
            <button
              onClick={() => fileInputRef.current?.click()}
              className="p-6 bg-white rounded-lg shadow hover:shadow-md transition-shadow flex flex-col items-center"
            >
              <div className="text-4xl mb-3">📁</div>
              <div className="font-medium">Upload Image</div>
            </button>
          </div>

          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileSelect}
            className="hidden"
          />
        </div>
      ) : (
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold">Take Photo</h2>
            <button
              onClick={() => setIsCapturing(false)}
              className="text-gray-600 hover:text-gray-800 transition-colors"
            >
              Cancel
            </button>
          </div>

          <Camera onCapture={handleCapture} onError={onError} />
        </div>
      )}
    </div>
  )
} 