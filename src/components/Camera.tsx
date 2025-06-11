import React, { useRef, useState, useEffect } from 'react'
import { analyzeMealImage, estimateNutritionFromImage } from '@/lib/vision'

interface CameraProps {
  onCapture: (imageFile: File, analysis: any) => void
  onError: (error: string) => void
}

export const Camera: React.FC<CameraProps> = ({ onCapture, onError }) => {
  const videoRef = useRef<HTMLVideoElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [isStreaming, setIsStreaming] = useState(false)
  const [isProcessing, setIsProcessing] = useState(false)
  const [facingMode, setFacingMode] = useState<'user' | 'environment'>('environment')

  useEffect(() => {
    let stream: MediaStream | null = null

    const startCamera = async () => {
      try {
        stream = await navigator.mediaDevices.getUserMedia({
          video: {
            facingMode,
            width: { ideal: 1920 },
            height: { ideal: 1080 }
          }
        })

        if (videoRef.current) {
          videoRef.current.srcObject = stream
          setIsStreaming(true)
        }
      } catch (error) {
        console.error('Error accessing camera:', error)
        onError('Unable to access camera. Please ensure you have granted camera permissions.')
      }
    }

    startCamera()

    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop())
      }
    }
  }, [facingMode, onError])

  const captureImage = async () => {
    if (!videoRef.current || !canvasRef.current || isProcessing) return

    try {
      setIsProcessing(true)

      // Get the video dimensions
      const video = videoRef.current
      const canvas = canvasRef.current
      canvas.width = video.videoWidth
      canvas.height = video.videoHeight

      // Draw the current video frame to the canvas
      const context = canvas.getContext('2d')
      if (!context) throw new Error('Could not get canvas context')
      context.drawImage(video, 0, 0, canvas.width, canvas.height)

      // Convert canvas to blob
      const blob = await new Promise<Blob>((resolve) => {
        canvas.toBlob((blob) => {
          if (blob) resolve(blob)
          else throw new Error('Could not create image blob')
        }, 'image/jpeg', 0.95)
      })

      // Create a File object
      const imageFile = new File([blob], `meal-${Date.now()}.jpg`, {
        type: 'image/jpeg'
      })

      // Analyze the image
      const analysisResult = await analyzeMealImage(imageFile)
      const nutrition = estimateNutritionFromImage(analysisResult)

      // Pass the results back
      onCapture(imageFile, nutrition)
    } catch (error) {
      console.error('Error capturing image:', error)
      onError('Failed to capture image. Please try again.')
    } finally {
      setIsProcessing(false)
    }
  }

  const toggleCamera = () => {
    setFacingMode(prev => prev === 'user' ? 'environment' : 'user')
  }

  return (
    <div className="relative w-full max-w-2xl mx-auto">
      {/* Video preview */}
      <div className="relative aspect-video bg-black rounded-lg overflow-hidden">
        <video
          ref={videoRef}
          autoPlay
          playsInline
          muted
          className="w-full h-full object-cover"
        />
        
        {/* Overlay grid for composition */}
        <div className="absolute inset-0 grid grid-cols-3 grid-rows-3 pointer-events-none">
          {Array.from({ length: 9 }).map((_, i) => (
            <div key={i} className="border border-white/20" />
          ))}
        </div>
      </div>

      {/* Camera controls */}
      <div className="absolute bottom-4 left-0 right-0 flex justify-center items-center gap-4">
        <button
          onClick={toggleCamera}
          className="p-3 rounded-full bg-white/20 hover:bg-white/30 transition-colors"
          disabled={isProcessing}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6 text-white"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
            />
          </svg>
        </button>

        <button
          onClick={captureImage}
          disabled={!isStreaming || isProcessing}
          className={`p-4 rounded-full ${
            isProcessing
              ? 'bg-gray-500'
              : 'bg-white hover:bg-gray-100 active:bg-gray-200'
          } transition-colors`}
        >
          <div className="w-12 h-12 rounded-full border-4 border-gray-800" />
        </button>
      </div>

      {/* Hidden canvas for image capture */}
      <canvas ref={canvasRef} className="hidden" />

      {/* Processing indicator */}
      {isProcessing && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-lg">
          <div className="text-white text-lg font-medium">
            Processing image...
          </div>
        </div>
      )}
    </div>
  )
} 