import React, { useState, useRef, useCallback } from 'react';
import { FFmpeg } from '@ffmpeg/ffmpeg';
import { fetchFile, toBlobURL } from '@ffmpeg/util';
import { Upload, Download, Music, FileAudio, Loader2, CheckCircle, XCircle, X } from 'lucide-react';

const outputFormats = [
  { value: 'mp3', label: 'MP3', mimeType: 'audio/mpeg', codec: 'libmp3lame' },
  { value: 'wav', label: 'WAV', mimeType: 'audio/wav', codec: 'pcm_s16le' },
  { value: 'm4a', label: 'M4A', mimeType: 'audio/mp4', codec: 'aac' },
  { value: 'flac', label: 'FLAC', mimeType: 'audio/flac', codec: 'flac' },
  { value: 'ogg', label: 'OGG', mimeType: 'audio/ogg', codec: 'libvorbis' },
  { value: 'amr', label: 'AMR', mimeType: 'audio/amr', codec: 'amrnb' },
  { value: 'mp2', label: 'MP2', mimeType: 'audio/mpeg', codec: 'mp2' },
  { value: 'm4r', label: 'M4R', mimeType: 'audio/mp4', codec: 'aac' },
];

export const AudioConverter = () => {
  const [conversionStates, setConversionStates] = useState([]);
  const [isDragOver, setIsDragOver] = useState(false);
  const [ffmpegLoaded, setFFmpegLoaded] = useState(false);
  const [outputFormat, setOutputFormat] = useState('mp3');
  const [isLoading, setIsLoading] = useState(false);
  const fileInputRef = useRef(null);
  const ffmpegRef = useRef(null);

  const showToast = (title, description, type = 'success') => {
    // Simple toast implementation - can be replaced with a proper toast library
    const toast = document.createElement('div');
    toast.className = `fixed top-4 right-4 p-4 rounded-lg shadow-lg z-50 ${
      type === 'error' ? 'bg-red-500 text-white' : 'bg-green-500 text-white'
    }`;
    toast.innerHTML = `<strong>${title}</strong><br/>${description}`;
    document.body.appendChild(toast);
    setTimeout(() => {
      document.body.removeChild(toast);
    }, 3000);
  };

  const loadFFmpeg = useCallback(async () => {
    if (ffmpegLoaded || isLoading) return;
    
    setIsLoading(true);
    try {
      const ffmpeg = new FFmpeg();
      ffmpegRef.current = ffmpeg;
      
      ffmpeg.on('progress', ({ progress }) => {
        setConversionStates(prevStates => 
          prevStates.map(state => 
            state.status === 'converting' && state.progress < 100 
              ? { ...state, progress: Math.round(progress * 100) } 
              : state
          )
        );
      });

      const baseURL = 'https://unpkg.com/@ffmpeg/core@0.12.6/dist/umd';
      await ffmpeg.load({
        coreURL: await toBlobURL(`${baseURL}/ffmpeg-core.js`, 'text/javascript'),
        wasmURL: await toBlobURL(`${baseURL}/ffmpeg-core.wasm`, 'application/wasm'),
      });
      
      setFFmpegLoaded(true);
      showToast("Ready!", "Audio converter loaded successfully.");
    } catch (error) {
      console.error('Error loading FFmpeg:', error);
      showToast("Error", "Failed to load audio converter. Please refresh and try again.", 'error');
    } finally {
      setIsLoading(false);
    }
  }, [ffmpegLoaded, isLoading]);

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const convertFile = async (file, id) => {
    setConversionStates(prevStates => 
      prevStates.map(state => 
        state.id === id ? { ...state, status: 'uploading', progress: 0 } : state
      )
    );

    await loadFFmpeg();
    
    if (!ffmpegRef.current) {
      setConversionStates(prevStates => 
        prevStates.map(state => 
          state.id === id ? { ...state, status: 'error' } : state
        )
      );
      return;
    }

    try {
      setConversionStates(prevStates => 
        prevStates.map(state => 
          state.id === id ? { ...state, status: 'converting', progress: 0 } : state
        )
      );
      
      const ffmpeg = ffmpegRef.current;
      const inputFileName = `input_${id}.${file.name.split('.').pop()}`;
      const outputFileName = file.name.replace(/\.[^.]+$/, `.${outputFormat}`);
      const outputFilePath = `output_${id}.${outputFormat}`;
      
      await ffmpeg.writeFile(inputFileName, await fetchFile(file));
      
      const selectedFormat = outputFormats.find(f => f.value === outputFormat);
      const ffmpegArgs = ['-i', inputFileName];
      
      if (selectedFormat?.codec) {
        ffmpegArgs.push('-codec:a', selectedFormat.codec);
      }
      
      if (['mp3', 'ogg', 'm4a', 'm4r'].includes(outputFormat)) {
        ffmpegArgs.push('-b:a', '192k');
      }
      
      ffmpegArgs.push(outputFilePath);
      
      await ffmpeg.exec(ffmpegArgs);
      
      const data = await ffmpeg.readFile(outputFilePath);
      const blob = new Blob([data], { type: selectedFormat?.mimeType || 'audio/mpeg' });
      const url = URL.createObjectURL(blob);
      
      setConversionStates(prevStates => 
        prevStates.map(state => 
          state.id === id 
            ? { 
                ...state, 
                status: 'completed', 
                progress: 100, 
                downloadUrl: url, 
                outputFileName, 
                inputFilePath: inputFileName, 
                outputFilePath: outputFilePath 
              } 
            : state
        )
      );

      showToast("Conversion completed!", `${file.name} has been converted to ${outputFormat.toUpperCase()}.`);
      
    } catch (error) {
      console.error(`Conversion error for ${file.name}:`, error);
      setConversionStates(prevStates => 
        prevStates.map(state => 
          state.id === id ? { ...state, status: 'error' } : state
        )
      );
      showToast("Conversion failed", `There was an error converting ${file.name}. Please try again.`, 'error');
    }
  };

  const handleFilesSelect = async (files) => {
    if (!files || files.length === 0) return;

    const newFiles = Array.from(files).filter(file => {
      const audioExtensions = ['.mp3', '.wav', '.m4a', '.flac', '.ogg', '.amr', '.mp2', '.m4r', '.aac', '.wma'];
      const isAudioFile = audioExtensions.some(ext => file.name.toLowerCase().endsWith(ext));
      if (!isAudioFile) {
        showToast("Invalid file format", `File ${file.name} is not an audio file and will be skipped.`, 'error');
      }
      return isAudioFile;
    });

    if (newFiles.length + conversionStates.length > 15) {
      showToast("Too many files", `You can convert up to 15 files at a time. ${newFiles.length + conversionStates.length - 15} files were not added.`, 'error');
      newFiles.splice(15 - conversionStates.length);
    }

    const conversionsToAdd = newFiles.map((file, index) => ({
      id: `${file.name}-${Date.now()}-${index}`,
      status: 'idle',
      progress: 0,
      fileName: file.name,
      fileSize: formatFileSize(file.size),
    }));

    setConversionStates(prevStates => [...prevStates, ...conversionsToAdd]);

    // Start conversions for newly added files
    conversionsToAdd.forEach((conversion, index) => {
      const file = newFiles[index];
      if (file) {
        convertFile(file, conversion.id);
      }
    });
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragOver(false);
    handleFilesSelect(e.dataTransfer.files);
  };

  const handleFileInputChange = (e) => {
    handleFilesSelect(e.target.files);
  };

  const handleReset = (id) => {
    setConversionStates(prevStates => prevStates.filter(state => state.id !== id));
  };

  const handleResetAll = () => {
    setConversionStates([]);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const renderUploadArea = () => {
    if (conversionStates.length === 0) {
      return (
        <div
          className={`relative p-12 border-2 border-dashed rounded-lg transition-all duration-300 cursor-pointer hover:border-blue-500 ${
            isDragOver ? 'border-blue-500 bg-blue-50' : 'border-gray-300'
          }`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
        >
          <div className="flex flex-col items-center space-y-4 text-center">
            <div className="p-4 rounded-full bg-blue-100">
              <Upload className="w-8 h-8 text-blue-600" />
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-2">Upload Audio Files</h3>
              <p className="text-gray-600 mb-4">
                Drag and drop your audio files here, or click to browse (up to 15 files)
              </p>
              <div className="space-y-3">
                <select 
                  value={outputFormat} 
                  onChange={(e) => setOutputFormat(e.target.value)}
                  className="w-48 mx-auto p-2 border border-gray-300 rounded-md"
                >
                  {outputFormats.map((format) => (
                    <option key={format.value} value={format.value}>
                      {format.label}
                    </option>
                  ))}
                </select>
                <br />
                <button className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors">
                  <FileAudio className="w-4 h-4 mr-2 inline" />
                  Choose Files
                </button>
              </div>
            </div>
          </div>
          <input
            ref={fileInputRef}
            type="file"
            accept="audio/*"
            onChange={handleFileInputChange}
            className="hidden"
            multiple
          />
        </div>
      );
    }

    return (
      <div className="space-y-4">
        {conversionStates.map((state) => (
          <div key={state.id} className="p-4 border border-gray-200 rounded-lg">
            <div className="flex items-center space-x-4 mb-3">
              <div className="p-2 rounded-full bg-blue-100">
                <Music className="w-5 h-5 text-blue-600" />
              </div>
              <div className="flex-1">
                <h4 className="font-semibold text-base">{state.fileName}</h4>
                <p className="text-xs text-gray-500">{state.fileSize}</p>
              </div>
              {state.status === 'completed' && (
                <CheckCircle className="w-5 h-5 text-green-500" />
              )}
              {state.status === 'error' && (
                <XCircle className="w-5 h-5 text-red-500" />
              )}
              <button 
                onClick={() => handleReset(state.id)}
                className="p-1 hover:bg-gray-100 rounded"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {(state.status === 'converting' || state.status === 'uploading') && (
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <Loader2 className="w-4 h-4 animate-spin text-blue-600" />
                  <span className="text-sm">
                    {state.status === 'uploading' ? 'Preparing...' : `Converting to ${outputFormat.toUpperCase()}...`}
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-blue-600 h-2 rounded-full transition-all duration-300" 
                    style={{ width: `${state.progress}%` }}
                  ></div>
                </div>
                <p className="text-xs text-gray-500 text-center">
                  {state.progress}% complete
                </p>
              </div>
            )}

            {state.status === 'completed' && (
              <div className="space-y-2">
                <div className="p-3 rounded-lg bg-green-50 border border-green-200">
                  <div className="flex items-center space-x-2 text-green-600 mb-1">
                    <CheckCircle className="w-4 h-4" />
                    <span className="text-sm font-medium">Conversion Complete!</span>
                  </div>
                  <p className="text-xs text-gray-600">
                    Ready to download: {state.outputFileName}
                  </p>
                </div>
                <button 
                  className="w-full px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
                  onClick={() => {
                    if (state.downloadUrl && state.outputFileName) {
                      const link = document.createElement('a');
                      link.href = state.downloadUrl;
                      link.download = state.outputFileName;
                      link.click();
                    }
                  }}
                >
                  <Download className="w-4 h-4 mr-2 inline" />
                  Download {outputFormat.toUpperCase()}
                </button>
              </div>
            )}

            {state.status === 'error' && (
              <div className="space-y-2">
                <div className="p-3 rounded-lg bg-red-50 border border-red-200">
                  <p className="text-sm text-red-600">
                    Conversion failed for {state.fileName}. Please try again.
                  </p>
                </div>
                <button 
                  onClick={() => handleReset(state.id)} 
                  className="w-full px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
                >
                  Remove
                </button>
              </div>
            )}
          </div>
        ))}
        {conversionStates.length > 0 && (
          <div className="flex justify-center mt-4">
            <button 
              onClick={handleResetAll}
              className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
            >
              Convert More Files
            </button>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="w-full max-w-2xl mx-auto p-4">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Audio Converter</h1>
        <p className="text-gray-600">Convert your audio files to different formats</p>
        {isLoading && (
          <div className="mt-4 flex items-center justify-center space-x-2">
            <Loader2 className="w-4 h-4 animate-spin" />
            <span className="text-sm">Loading converter...</span>
          </div>
        )}
      </div>
      {renderUploadArea()}
    </div>
  );
};

export default AudioConverter;

