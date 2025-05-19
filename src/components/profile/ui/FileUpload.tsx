import React, { useState, useRef } from 'react';
import { Upload, X, Image as ImageIcon, Star } from 'lucide-react';

interface FileUploadProps {
  onFileSelect: (file: File, isMain?: boolean) => void;
  onMultipleFilesSelect?: (files: File[]) => void;
  currentImageUrl?: string;
  additionalImages?: string[];
  onClearImage?: (imageUrl?: string) => void;
  onSetMainImage?: (imageUrl: string) => void;
  multiple?: boolean;
}

const FileUpload: React.FC<FileUploadProps> = ({ 
  onFileSelect, 
  onMultipleFilesSelect,
  currentImageUrl,
  additionalImages = [],
  onClearImage,
  onSetMainImage,
  multiple = false
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const [preview, setPreview] = useState<string | null>(currentImageUrl || null);
  const [secondaryPreviews, setSecondaryPreviews] = useState<string[]>(additionalImages || []);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      if (multiple) {
        handleMultipleFiles(Array.from(e.dataTransfer.files));
      } else {
        handleFile(e.dataTransfer.files[0], true);
      }
    }
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      // If we already have a main preview and we're adding more images
      if (preview && multiple) {
        // Handle all files as additional images
        const files = Array.from(e.target.files);
        files.forEach(file => handleFile(file, false));
      } else if (multiple && e.target.files.length > 1) {
        // Multiple files selected and no main preview yet
        handleMultipleFiles(Array.from(e.target.files));
      } else {
        // Single file selected and no main preview yet
        handleFile(e.target.files[0], !preview);
      }
    }
    
    // Reset the file input value to allow selecting the same file again
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleMultipleFiles = (files: File[]) => {
    const imageFiles = files.filter(file => file.type.match('image.*'));
    
    if (imageFiles.length === 0) {
      alert('Please select image files');
      return;
    }
    
    // Process each file
    const newFiles: File[] = [];
    
    imageFiles.forEach((file, index) => {
      newFiles.push(file);
      
      // Create preview for each file
      const reader = new FileReader();
      reader.onload = (e) => {
        if (e.target?.result) {
          const imageUrl = e.target.result as string;
          
          // If this is the first image and we don't have a main preview yet, set it as main
          if (index === 0 && !preview) {
            setPreview(imageUrl);
            onFileSelect(file, true);
          } else {
            setSecondaryPreviews(prev => [...prev, imageUrl]);
            onFileSelect(file, false);
          }
        }
      };
      reader.readAsDataURL(file);
    });
    
    if (onMultipleFilesSelect) {
      onMultipleFilesSelect(newFiles);
    }
  };

  const handleFile = (file: File, isMain: boolean = false) => {
    // Check if file is an image
    if (!file.type.match('image.*')) {
      alert('Please select an image file');
      return;
    }
    
    // Create preview
    const reader = new FileReader();
    reader.onload = (e) => {
      if (e.target?.result) {
        const imageUrl = e.target.result as string;
        
        if (isMain) {
          setPreview(imageUrl);
        } else {
          setSecondaryPreviews(prev => [...prev, imageUrl]);
        }
      }
    };
    reader.readAsDataURL(file);
    
    onFileSelect(file, isMain);
  };

  const handleClearMainImage = () => {
    setPreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
    if (onClearImage) {
      onClearImage();
    }
  };

  const handleClearSecondaryImage = (imageUrl: string, index: number) => {
    setSecondaryPreviews(prev => prev.filter((_, i) => i !== index));
    if (onClearImage) {
      onClearImage(imageUrl);
    }
  };

  const handleSetAsMain = (imageUrl: string, index: number) => {
    // If there's already a main image, move it to secondary
    if (preview) {
      setSecondaryPreviews(prev => [...prev, preview]);
    }
    
    // Set the selected image as main
    setPreview(imageUrl);
    
    // Remove from secondary previews
    setSecondaryPreviews(prev => prev.filter((_, i) => i !== index));
    
    if (onSetMainImage) {
      onSetMainImage(imageUrl);
    }
  };

  // Function to explicitly trigger file input click
  const triggerFileInput = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  return (
    <div className="w-full space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1.5">
          Project Images
        </label>
        <p className="text-xs text-gray-500 mb-3">
          Upload multiple images for your project. The first image will be used as the main preview.
        </p>
      </div>
      
      {/* Main preview image */}
      {!preview ? (
        <div
          className={`border-2 border-dashed rounded-lg p-8 transition-all duration-200 ${
            isDragging 
              ? 'border-indigo-500 bg-indigo-50' 
              : 'border-gray-300 hover:border-indigo-400 hover:bg-gray-50'
          }`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
        >
          <div className="flex flex-col items-center justify-center space-y-4 cursor-pointer">
            <div className="p-4 bg-indigo-50 rounded-full">
              <Upload size={28} className="text-indigo-600" />
            </div>
            <div className="text-center">
              <p className="text-sm font-medium text-indigo-600">
                Click to upload or drag and drop
              </p>
              <p className="text-xs text-gray-500 mt-1">
                PNG, JPG or GIF (max. 5MB)
              </p>
              {multiple && (
                <p className="text-xs text-indigo-500 mt-2">
                  You can select multiple images at once
                </p>
              )}
            </div>
          </div>
          <input
            ref={fileInputRef}
            type="file"
            className="hidden"
            accept="image/*"
            multiple={multiple}
            onChange={handleFileInput}
          />
        </div>
      ) : (
        <div className="space-y-4">
          {/* Main preview image with badge */}
          <div className="relative rounded-lg overflow-hidden border border-gray-200 shadow-sm">
            <div className="absolute top-3 left-3 z-10 bg-indigo-600 text-white px-3 py-1 rounded-full text-xs font-medium flex items-center">
              <Star size={12} className="mr-1" />
              Main Preview
            </div>
            <img 
              src={preview} 
              alt="Main Preview" 
              className="w-full h-72 object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-200">
              <button
                type="button"
                onClick={handleClearMainImage}
                className="absolute top-3 right-3 p-2 bg-white rounded-full shadow-md hover:bg-gray-100 transition-colors duration-200"
                aria-label="Remove image"
              >
                <X size={18} className="text-gray-700" />
              </button>
            </div>
          </div>
          
          {/* Add more images button */}
          {multiple && (
            <button
              type="button"
              onClick={triggerFileInput}
              className="w-full py-3 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center text-sm font-medium text-indigo-600 hover:border-indigo-400 hover:bg-gray-50 transition-all duration-200"
            >
              <Upload size={18} className="mr-2" />
              Add More Images
            </button>
          )}
        </div>
      )}
      
      {/* Secondary images gallery */}
      {multiple && secondaryPreviews.length > 0 && (
        <div className="mt-6">
          <h4 className="text-sm font-medium text-gray-700 mb-3">Additional Images</h4>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            {secondaryPreviews.map((imageUrl, index) => (
              <div key={index} className="relative group rounded-lg overflow-hidden border border-gray-200 shadow-sm">
                <img 
                  src={imageUrl} 
                  alt={`Project image ${index + 1}`} 
                  className="w-full h-40 object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex flex-col justify-between p-3">
                  <div className="self-end">
                    <button
                      type="button"
                      onClick={() => handleClearSecondaryImage(imageUrl, index)}
                      className="p-1.5 bg-white rounded-full shadow-md hover:bg-gray-100 transition-colors duration-200"
                      aria-label="Remove image"
                    >
                      <X size={16} className="text-gray-700" />
                    </button>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleSetAsMain(imageUrl, index)}
                    className="mt-auto w-full bg-white/90 text-indigo-700 py-1.5 px-2 rounded text-xs font-medium hover:bg-white transition-colors duration-200 flex items-center justify-center"
                  >
                    <Star size={12} className="mr-1" />
                    Set as Main
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
      
      {/* Hidden file input that will be triggered by the Add More Images button */}
      <input
        ref={fileInputRef}
        type="file"
        className="hidden"
        accept="image/*"
        multiple={multiple}
        onChange={handleFileInput}
      />
    </div>
  );
};

export default FileUpload;
