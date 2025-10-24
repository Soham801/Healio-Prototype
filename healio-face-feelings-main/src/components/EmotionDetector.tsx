import { useEffect, useRef, useState } from 'react';
import * as faceapi from 'face-api.js';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Loader2, Camera, CameraOff, AlertCircle, Sun, Moon } from 'lucide-react';
import { useTheme } from 'next-themes';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from 'recharts';

interface EmotionData {
  emotion: string;
  confidence: number;
  color: string;
}

interface EmotionHistoryPoint {
  timestamp: number;
  emotion: string;
  value: number;
  time: string;
}

const emotionColors: Record<string, string> = {
  angry: '#ef4444',
  disgusted: '#84cc16',
  fearful: '#a855f7',
  happy: '#fbbf24',
  neutral: '#6b7280',
  sad: '#3b82f6',
  surprised: '#ec4899',
};

// Map emotions to positive/negative values for graph
const emotionValues: Record<string, number> = {
  happy: 80,
  surprised: 60,
  neutral: 0,
  disgusted: -40,
  fearful: -60,
  sad: -70,
  angry: -80,
};

export const EmotionDetector = () => {
  const { theme, setTheme } = useTheme();
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isModelLoaded, setIsModelLoaded] = useState(false);
  const [isWebcamActive, setIsWebcamActive] = useState(false);
  const [currentEmotion, setCurrentEmotion] = useState<EmotionData | null>(null);
  const [allEmotions, setAllEmotions] = useState<EmotionData[]>([]);
  const [error, setError] = useState<string>('');
  const [emotionHistory, setEmotionHistory] = useState<EmotionHistoryPoint[]>([]);
  const detectionIntervalRef = useRef<number>();
  const lastRecordedTime = useRef<number>(0);

  useEffect(() => {
    loadModels();
    return () => {
      stopWebcam();
    };
  }, []);

  const loadModels = async () => {
    try {
      // Load models from CDN - using SSD MobileNet for better accuracy
      const MODEL_URL = 'https://cdn.jsdelivr.net/npm/@vladmandic/face-api/model';
      await Promise.all([
        faceapi.nets.ssdMobilenetv1.loadFromUri(MODEL_URL),
        faceapi.nets.faceExpressionNet.loadFromUri(MODEL_URL),
        faceapi.nets.faceLandmark68Net.loadFromUri(MODEL_URL),
      ]);
      setIsModelLoaded(true);
    } catch (err) {
      setError('Failed to load AI models. Please check your internet connection and refresh.');
      console.error('Model loading error:', err);
    }
  };

  const startWebcam = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { 
          width: { ideal: 1280 },
          height: { ideal: 720 },
          facingMode: 'user'
        },
      });
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        setIsWebcamActive(true);
        setError('');
        
        // Wait for video to be ready with proper dimensions
        videoRef.current.onloadedmetadata = () => {
          if (videoRef.current) {
            videoRef.current.play();
            // Small delay to ensure dimensions are set
            setTimeout(() => {
              startDetection();
            }, 100);
          }
        };
      }
    } catch (err) {
      setError('Could not access webcam. Please check permissions.');
      console.error('Webcam error:', err);
    }
  };

  const stopWebcam = () => {
    if (videoRef.current?.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      stream.getTracks().forEach(track => track.stop());
      videoRef.current.srcObject = null;
    }
    if (detectionIntervalRef.current) {
      clearInterval(detectionIntervalRef.current);
    }
    setIsWebcamActive(false);
    setCurrentEmotion(null);
    setAllEmotions([]);
    setEmotionHistory([]);
    lastRecordedTime.current = 0;
  };

  const startDetection = () => {
    if (!videoRef.current || !canvasRef.current) return;

    const video = videoRef.current;
    const canvas = canvasRef.current;
    
    // Use video element dimensions instead of width/height attributes
    const displaySize = { 
      width: video.videoWidth || video.offsetWidth, 
      height: video.videoHeight || video.offsetHeight 
    };
    
    // Don't start if dimensions are invalid
    if (displaySize.width === 0 || displaySize.height === 0) {
      console.error('Invalid video dimensions');
      return;
    }
    
    faceapi.matchDimensions(canvas, displaySize);

    detectionIntervalRef.current = window.setInterval(async () => {
      if (!video || !canvas) return;

      // Use SSD MobileNet for better accuracy with higher confidence threshold
      const detections = await faceapi
        .detectAllFaces(video, new faceapi.SsdMobilenetv1Options({ minConfidence: 0.5 }))
        .withFaceLandmarks()
        .withFaceExpressions();

      const resizedDetections = faceapi.resizeResults(detections, displaySize);
      
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        resizedDetections.forEach((detection) => {
          const { box } = detection.detection;
          const expressions = detection.expressions;
          
          // Draw box around face
          ctx.strokeStyle = '#06b6d4';
          ctx.lineWidth = 3;
          ctx.strokeRect(box.x, box.y, box.width, box.height);
          
          // Find dominant emotion
          const emotionArray = Object.entries(expressions).map(([emotion, confidence]) => ({
            emotion,
            confidence,
            color: emotionColors[emotion] || '#6b7280',
          }));
          
          emotionArray.sort((a, b) => b.confidence - a.confidence);
          
          if (emotionArray.length > 0) {
            const topEmotion = emotionArray[0];
            setCurrentEmotion(topEmotion);
            setAllEmotions(emotionArray);
            
            // Record emotion to history every 2 seconds
            const now = Date.now();
            if (now - lastRecordedTime.current >= 2000) {
              const timeStr = new Date(now).toLocaleTimeString();
              setEmotionHistory(prev => {
                const newPoint: EmotionHistoryPoint = {
                  timestamp: now,
                  emotion: topEmotion.emotion,
                  value: emotionValues[topEmotion.emotion] || 0,
                  time: timeStr,
                };
                // Keep last 30 points (1 minute of data)
                const updated = [...prev, newPoint];
                return updated.slice(-30);
              });
              lastRecordedTime.current = now;
            }
            
            // Draw emotion label
            ctx.fillStyle = topEmotion.color;
            ctx.font = 'bold 20px sans-serif';
            ctx.fillText(
              `${topEmotion.emotion.toUpperCase()} (${(topEmotion.confidence * 100).toFixed(0)}%)`,
              box.x,
              box.y > 30 ? box.y - 10 : box.y + box.height + 25
            );
          }
        });
      }
    }, 100);
  };

  return (
    <div className="min-h-screen bg-background p-4 md:p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="flex items-center justify-center gap-4 mb-4">
            <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
              Healio Emotion Detector
            </h1>
            <Button
              variant="outline"
              size="icon"
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
              className="rounded-full"
            >
              {theme === 'dark' ? (
                <Sun className="h-5 w-5" />
              ) : (
                <Moon className="h-5 w-5" />
              )}
            </Button>
          </div>
          <p className="text-muted-foreground text-lg">
            Real-time facial emotion recognition powered by AI
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Video Feed */}
          <Card className="lg:col-span-2 p-6 space-y-4 bg-card border-border">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold">Live Camera Feed</h2>
              <div className="flex gap-2">
                {!isWebcamActive ? (
                  <Button
                    onClick={startWebcam}
                    disabled={!isModelLoaded}
                    className="bg-gradient-to-r from-primary to-accent hover:opacity-90 text-primary-foreground"
                  >
                    {!isModelLoaded ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Loading AI Models...
                      </>
                    ) : (
                      <>
                        <Camera className="mr-2 h-4 w-4" />
                        Start Camera
                      </>
                    )}
                  </Button>
                ) : (
                  <Button
                    onClick={stopWebcam}
                    variant="destructive"
                  >
                    <CameraOff className="mr-2 h-4 w-4" />
                    Stop Camera
                  </Button>
                )}
              </div>
            </div>

            {error && (
              <div className="flex items-center gap-2 p-4 bg-destructive/10 border border-destructive rounded-lg">
                <AlertCircle className="h-5 w-5 text-destructive" />
                <p className="text-sm text-destructive">{error}</p>
              </div>
            )}

            <div className="relative bg-muted rounded-lg overflow-hidden aspect-video">
              <video
                ref={videoRef}
                autoPlay
                muted
                playsInline
                className="w-full h-full object-cover"
              />
              <canvas
                ref={canvasRef}
                className="absolute top-0 left-0 w-full h-full"
              />
              {!isWebcamActive && (
                <div className="absolute inset-0 flex items-center justify-center bg-muted">
                  <Camera className="h-16 w-16 text-muted-foreground opacity-50" />
                </div>
              )}
            </div>
          </Card>

          {/* Emotion Analysis Panel */}
          <div className="space-y-6">
            {/* Current Dominant Emotion */}
            <Card className="p-6 space-y-4 bg-card border-border">
              <h2 className="text-xl font-semibold">Current Emotion</h2>
              {currentEmotion ? (
                <div className="space-y-3">
                  <div
                    className="text-center p-6 rounded-lg transition-all duration-300"
                    style={{
                      backgroundColor: `${currentEmotion.color}20`,
                      borderLeft: `4px solid ${currentEmotion.color}`,
                    }}
                  >
                    <p className="text-3xl font-bold capitalize" style={{ color: currentEmotion.color }}>
                      {currentEmotion.emotion}
                    </p>
                    <p className="text-sm text-muted-foreground mt-2">
                      Confidence: {(currentEmotion.confidence * 100).toFixed(1)}%
                    </p>
                  </div>
                </div>
              ) : (
                <div className="text-center p-8 text-muted-foreground">
                  <p>No face detected</p>
                  <p className="text-sm mt-2">Start the camera to begin detection</p>
                </div>
              )}
            </Card>

            {/* All Emotions Breakdown */}
            <Card className="p-6 space-y-4 bg-card border-border">
              <h2 className="text-xl font-semibold">Emotion Analysis</h2>
              {allEmotions.length > 0 ? (
                <div className="space-y-3">
                  {allEmotions.map((emotion, index) => (
                    <div key={index} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium capitalize">{emotion.emotion}</span>
                        <Badge
                          variant="outline"
                          style={{
                            borderColor: emotion.color,
                            color: emotion.color,
                          }}
                        >
                          {(emotion.confidence * 100).toFixed(0)}%
                        </Badge>
                      </div>
                      <div className="h-2 bg-muted rounded-full overflow-hidden">
                        <div
                          className="h-full rounded-full transition-all duration-300"
                          style={{
                            width: `${emotion.confidence * 100}%`,
                            backgroundColor: emotion.color,
                          }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center p-8 text-muted-foreground">
                  <p className="text-sm">Waiting for analysis...</p>
                </div>
              )}
            </Card>
          </div>
        </div>

        {/* Emotion Trend Graph */}
        {emotionHistory.length > 0 && (
          <Card className="p-6 space-y-4 bg-card border-border">
            <h2 className="text-xl font-semibold">Emotion Trend</h2>
            <p className="text-sm text-muted-foreground">
              Positive emotions (happy, surprised) trend upward in green, negative emotions (sad, angry) trend downward in red
            </p>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={emotionHistory}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                  <XAxis 
                    dataKey="time" 
                    className="text-muted-foreground text-xs"
                    tick={{ fill: 'hsl(var(--muted-foreground))' }}
                  />
                  <YAxis 
                    domain={[-100, 100]}
                    className="text-muted-foreground text-xs"
                    tick={{ fill: 'hsl(var(--muted-foreground))' }}
                    label={{ value: 'Mood', angle: -90, position: 'insideLeft', fill: 'hsl(var(--muted-foreground))' }}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'hsl(var(--card))',
                      border: '1px solid hsl(var(--border))',
                      borderRadius: '8px',
                      color: 'hsl(var(--foreground))',
                    }}
                    formatter={(value: number, name: string, props: any) => [
                      `${props.payload.emotion} (${value > 0 ? '+' : ''}${value})`,
                      'Mood'
                    ]}
                  />
                  <ReferenceLine y={0} stroke="hsl(var(--muted-foreground))" strokeDasharray="3 3" />
                  <Line
                    type="monotone"
                    dataKey="value"
                    stroke="url(#colorGradient)"
                    strokeWidth={3}
                    dot={{ fill: 'hsl(var(--primary))', r: 4 }}
                    activeDot={{ r: 6 }}
                  />
                  <defs>
                    <linearGradient id="colorGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#22c55e" stopOpacity={1} />
                      <stop offset="50%" stopColor="#6b7280" stopOpacity={1} />
                      <stop offset="100%" stopColor="#ef4444" stopOpacity={1} />
                    </linearGradient>
                  </defs>
                </LineChart>
              </ResponsiveContainer>
            </div>
          </Card>
        )}

        {/* Info Card */}
        <Card className="p-6 bg-card border-border">
          <h3 className="text-lg font-semibold mb-3">How it works</h3>
          <div className="grid md:grid-cols-3 gap-4 text-sm text-muted-foreground">
            <div>
              <p className="font-medium text-foreground mb-1">1. Face Detection</p>
              <p>AI identifies faces in real-time using advanced neural networks</p>
            </div>
            <div>
              <p className="font-medium text-foreground mb-1">2. Emotion Analysis</p>
              <p>Deep learning model analyzes facial expressions across 7 emotions</p>
            </div>
            <div>
              <p className="font-medium text-foreground mb-1">3. Real-time Results</p>
              <p>See instant emotion detection with confidence scores</p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};
