import React, { useRef, useEffect, useState, useCallback } from 'react';

// Props are currently unused but defined for future extensibility
type DrawingCanvasProps = Record<string, never>;

const DrawingCanvas: React.FC<DrawingCanvasProps> = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [currentColor, setCurrentColor] = useState('#ffffff');
  const [brushSize, setBrushSize] = useState(3);
  const [lastPos, setLastPos] = useState({ x: 0, y: 0 });

  const colors = [
    '#ffffff', '#ff0000', '#00ff00', '#0000ff', 
    '#ffff00', '#ff00ff', '#00ffff', '#ffa500',
    '#800080', '#ffc0cb'
  ];

  const getMousePos = useCallback((e: MouseEvent | TouchEvent) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };

    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;

    if ('touches' in e && e.touches.length > 0) {
      return {
        x: (e.touches[0].clientX - rect.left) * scaleX,
        y: (e.touches[0].clientY - rect.top) * scaleY
      };
    } else if ('clientX' in e) {
      return {
        x: (e.clientX - rect.left) * scaleX,
        y: (e.clientY - rect.top) * scaleY
      };
    }
    return { x: 0, y: 0 };
  }, []);

  const startDrawing = useCallback((e: MouseEvent | TouchEvent) => {
    e.preventDefault();
    setIsDrawing(true);
    const pos = getMousePos(e);
    setLastPos(pos);
  }, [getMousePos]);

  const draw = useCallback((e: MouseEvent | TouchEvent) => {
    e.preventDefault();
    if (!isDrawing || !canvasRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const currentPos = getMousePos(e);

    ctx.strokeStyle = currentColor;
    ctx.lineWidth = brushSize;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';

    ctx.beginPath();
    ctx.moveTo(lastPos.x, lastPos.y);
    ctx.lineTo(currentPos.x, currentPos.y);
    ctx.stroke();

    setLastPos(currentPos);
  }, [isDrawing, lastPos, currentColor, brushSize, getMousePos]);

  const stopDrawing = useCallback((e: MouseEvent | TouchEvent) => {
    e.preventDefault();
    setIsDrawing(false);
  }, []);

  const clearCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.fillStyle = '#1a1a2e';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    // Initialize canvas
    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.fillStyle = '#1a1a2e';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
    }

    // Mouse events
    const handleMouseDown = (e: MouseEvent) => startDrawing(e);
    const handleMouseMove = (e: MouseEvent) => draw(e);
    const handleMouseUp = (e: MouseEvent) => stopDrawing(e);

    // Touch events
    const handleTouchStart = (e: TouchEvent) => startDrawing(e);
    const handleTouchMove = (e: TouchEvent) => draw(e);
    const handleTouchEnd = (e: TouchEvent) => stopDrawing(e);

    canvas.addEventListener('mousedown', handleMouseDown);
    canvas.addEventListener('mousemove', handleMouseMove);
    canvas.addEventListener('mouseup', handleMouseUp);
    canvas.addEventListener('mouseleave', handleMouseUp);

    canvas.addEventListener('touchstart', handleTouchStart);
    canvas.addEventListener('touchmove', handleTouchMove);
    canvas.addEventListener('touchend', handleTouchEnd);

    return () => {
      canvas.removeEventListener('mousedown', handleMouseDown);
      canvas.removeEventListener('mousemove', handleMouseMove);
      canvas.removeEventListener('mouseup', handleMouseUp);
      canvas.removeEventListener('mouseleave', handleMouseUp);

      canvas.removeEventListener('touchstart', handleTouchStart);
      canvas.removeEventListener('touchmove', handleTouchMove);
      canvas.removeEventListener('touchend', handleTouchEnd);
    };
  }, [startDrawing, draw, stopDrawing]);

  return (
    <div className="bg-gray-800 p-4 w-full max-h-[70vh] overflow-auto">
      <div className="bg-[#1a1a2e] rounded-lg p-3 mb-4">
        <canvas
          ref={canvasRef}
          width={600}
          height={400}
          className="w-full border border-gray-600 rounded cursor-crosshair touch-none"
          style={{ maxHeight: '300px' }}
        />
      </div>

      <div className="space-y-4">
        {/* Color Palette */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Color:
          </label>
          <div className="flex flex-wrap gap-2">
            {colors.map((color) => (
              <button
                key={color}
                onClick={() => setCurrentColor(color)}
                className={`w-8 h-8 rounded-full border-2 transition-all touch-target ${
                  currentColor === color ? 'border-white scale-110' : 'border-gray-500 hover:scale-105'
                }`}
                style={{ backgroundColor: color }}
                aria-label={`Select ${color} color`}
              />
            ))}
          </div>
        </div>

        {/* Brush Size */}
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Brush Size: {brushSize}px
          </label>
          <input
            type="range"
            min="1"
            max="20"
            value={brushSize}
            onChange={(e) => setBrushSize(Number(e.target.value))}
            className="w-full h-2 bg-gray-600 rounded-lg appearance-none cursor-pointer slider"
          />
        </div>

        {/* Controls */}
        <div className="flex gap-2">
          <button
            onClick={clearCanvas}
            className="flex-1 bg-red-600 hover:bg-red-700 active:bg-red-800 text-white font-bold py-3 px-4 rounded-lg transition-all touch-target-comfortable"
          >
            🗑️ Clear Canvas
          </button>
        </div>
      </div>
    </div>
  );
};

export default DrawingCanvas; 