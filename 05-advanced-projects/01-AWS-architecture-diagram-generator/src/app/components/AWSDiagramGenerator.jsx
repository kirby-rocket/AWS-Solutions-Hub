'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Button } from './ui/button';
import { Textarea } from "./ui/textarea";
import { Card, CardContent } from "./ui/card";
import { Alert, AlertDescription } from "./ui/alert";
import { Download, Loader2, Cloud, ZoomIn, ZoomOut, Maximize, LightbulbIcon, ChevronDown, ChevronUp } from 'lucide-react';
import mermaid from 'mermaid';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

const AWSDiagramGenerator = () => {
  const [prompt, setPrompt] = useState('');
  const [mermaidCode, setMermaidCode] = useState('');
  const [diagramTitle, setDiagramTitle] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [zoom, setZoom] = useState(1);
  const [bestPractices, setBestPractices] = useState('');
  const [showBestPractices, setShowBestPractices] = useState(false);
  const mermaidRef = useRef(null);
  const containerRef = useRef(null);

  useEffect(() => {
    mermaid.initialize({ 
      startOnLoad: true, 
      theme: 'neutral',
      flowchart: {
        curve: 'basis',
        padding: 20
      }
    });
  }, []);

  useEffect(() => {
    if (mermaidCode && mermaidRef.current) {
      mermaid.render('mermaid-diagram', mermaidCode).then((result) => {
        mermaidRef.current.innerHTML = result.svg;
        applyZoom();
      });
    }
  }, [mermaidCode]);

  const applyZoom = () => {
    if (mermaidRef.current) {
      mermaidRef.current.style.transform = `translate(-50%, -50%) scale(${zoom})`;
    }
  };

  const handleZoomIn = () => {
    setZoom(prevZoom => Math.min(prevZoom + 0.1, 2));
  };

  const handleZoomOut = () => {
    setZoom(prevZoom => Math.max(prevZoom - 0.1, 0.5));
  };

  const handleResetZoom = () => {
    setZoom(1);
  };

  useEffect(() => {
    applyZoom();
  }, [zoom]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setShowBestPractices(false);
    try {
      const response = await fetch('/api/generate-diagram', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ prompt }),
      });
      if (!response.ok) {
        throw new Error('Failed to generate diagram');
      }
      const data = await response.json();
      setMermaidCode(data.mermaidCode);
      setDiagramTitle(data.diagramTitle);
      setBestPractices(data.bestPractices);
    } catch (error) {
      console.error('Error generating diagram:', error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadSVG = () => {
    if (mermaidRef.current) {
      const svgData = mermaidRef.current.innerHTML;
      const blob = new Blob([svgData], { type: 'image/svg+xml' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `${diagramTitle}.svg`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    }
  };

  const handleDownloadJPEG = () => {
    if (mermaidRef.current) {
      html2canvas(mermaidRef.current).then(canvas => {
        const link = document.createElement('a');
        link.download = `${diagramTitle}.jpeg`;
        link.href = canvas.toDataURL('image/jpeg');
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      });
    }
  };

  const handleDownloadPDF = () => {
    if (mermaidRef.current) {
      html2canvas(mermaidRef.current).then(canvas => {
        const imgData = canvas.toDataURL('image/png');
        const pdf = new jsPDF({
          orientation: 'landscape',
          unit: 'px',
          format: [canvas.width, canvas.height]
        });
        pdf.addImage(imgData, 'PNG', 0, 0, canvas.width, canvas.height);
        pdf.save(`${diagramTitle}.pdf`);
      });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-extrabold text-gray-900 sm:text-5xl md:text-6xl">
            AWS Architecture <span className="text-blue-600">Visualizer</span>
          </h1>
          <p className="mt-3 text-xl text-gray-500">Transform your ideas into clear, insightful AWS diagrams</p>
        </div>
        
        <div className="max-w-4xl mx-auto">
          <Card className="bg-white shadow-xl rounded-2xl overflow-hidden mb-8">
            <CardContent className="p-6">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="relative">
                  <Textarea
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    placeholder="Describe your AWS architecture..."
                    className="w-full p-4 text-gray-700 border-2 border-blue-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent min-h-[150px] placeholder-gray-400"
                  />
                  <Cloud className="absolute top-3 right-3 text-blue-400" />
                </div>
                <Button 
                  type="submit" 
                  disabled={loading}
                  className="w-full bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white font-bold py-3 px-4 rounded-xl transition duration-300 flex items-center justify-center"
                >
                  {loading ? (
                    <>
                      <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                      Generating...
                    </>
                  ) : (
                    'Generate Diagram'
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>
          
          {error && (
            <Alert variant="destructive" className="mb-8 bg-red-50 border-l-4 border-red-500 text-red-700 p-4 rounded-xl">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          
          {mermaidCode && (
            <div className="space-y-8">
              <Card className="bg-white shadow-xl rounded-2xl overflow-hidden">
                <CardContent className="p-6">
                  <h2 className="text-2xl font-bold text-gray-800 mb-4 text-center">{diagramTitle}</h2>
                  <div className="flex justify-center mb-4">
                    <Button onClick={handleZoomIn} className="mr-2">
                      <ZoomIn size={20} />
                    </Button>
                    <Button onClick={handleZoomOut} className="mr-2">
                      <ZoomOut size={20} />
                    </Button>
                    <Button onClick={handleResetZoom}>
                      <Maximize size={20} />
                    </Button>
                  </div>
                  <div className="flex justify-center">
                    <div 
                      ref={containerRef} 
                      className="overflow-auto border border-gray-200 rounded-lg"
                      style={{ 
                        height: '70vh', 
                        width: '100%', 
                        maxWidth: '1200px',
                        margin: '0 auto',
                        position: 'relative'
                      }}
                    >
                      <div 
                        ref={mermaidRef} 
                        className="mermaid-diagram absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
                        style={{
                          minWidth: '100%',
                          minHeight: '100%',
                          transform: `translate(-50%, -50%) scale(${zoom})`,
                          transformOrigin: 'center center'
                        }}
                      ></div>
                    </div>
                  </div>
                  <div className="flex justify-center mt-6 space-x-4">
                    <Button 
                      onClick={handleDownloadSVG} 
                      className="bg-gradient-to-r from-green-400 to-blue-500 hover:from-green-500 hover:to-blue-600 text-white font-bold py-2 px-4 rounded-xl transition duration-300 flex items-center justify-center"
                    >
                      <Download className="mr-2 h-4 w-4" />
                      SVG
                    </Button>
                    <Button 
                      onClick={handleDownloadJPEG} 
                      className="bg-gradient-to-r from-yellow-400 to-orange-500 hover:from-yellow-500 hover:to-orange-600 text-white font-bold py-2 px-4 rounded-xl transition duration-300 flex items-center justify-center"
                    >
                      <Download className="mr-2 h-4 w-4" />
                      JPEG
                    </Button>
                    <Button 
                      onClick={handleDownloadPDF} 
                      className="bg-gradient-to-r from-red-400 to-pink-500 hover:from-red-500 hover:to-pink-600 text-white font-bold py-2 px-4 rounded-xl transition duration-300 flex items-center justify-center"
                    >
                      <Download className="mr-2 h-4 w-4" />
                      PDF
                    </Button>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-white shadow-xl rounded-2xl overflow-hidden w-full">
                <CardContent className="p-6">
                  <button
                    onClick={() => setShowBestPractices(!showBestPractices)}
                    className="w-full flex items-center justify-between text-left"
                  >
                    <h2 className="text-2xl font-bold text-gray-800 flex items-center">
                      <LightbulbIcon className="mr-2 h-6 w-6 text-yellow-500" />
                      AWS Best Practices and Suggestions
                    </h2>
                    {showBestPractices ? <ChevronUp size={24} /> : <ChevronDown size={24} />}
                  </button>
                  {showBestPractices && (
                    <div className="mt-4 space-y-6 max-h-[40vh] overflow-y-auto pr-2">
                      {bestPractices.split(/\n(?=\d+\.\s)/).map((section, index) => {
                        const lines = section.split('\n').filter(line => line.trim() !== '');
                        const sectionTitle = lines[0].replace(/^\d+\.\s/, '');
                        return (
                          <div key={index} className="bg-blue-50 p-4 rounded-lg">
                            <h3 className="font-semibold text-lg text-blue-700 mb-2">
                              {sectionTitle}
                            </h3>
                            <ul className="list-disc ml-6 text-gray-700 space-y-2">
                              {lines.slice(1).map((item, itemIndex) => (
                                <li key={itemIndex} className="leading-relaxed">
                                  {item.replace(/^-\s/, '')}
                                </li>
                              ))}
                            </ul>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AWSDiagramGenerator;