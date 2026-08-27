import { useState, useEffect } from 'react';
import { storage } from '../lib/firebase';
import { ref, uploadBytes, getDownloadURL, listAll, deleteObject } from 'firebase/storage';
import imageCompression from 'browser-image-compression';

export default function ImageManagerModal({ isOpen, onClose, onSelect }) {
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    if (isOpen) {
      fetchImages();
    }
  }, [isOpen]);

  const fetchImages = async () => {
    setLoading(true);
    try {
      const listRef = ref(storage, 'images/');
      const res = await listAll(listRef);
      
      const imagePromises = res.items.map(async (itemRef) => {
        const url = await getDownloadURL(itemRef);
        return {
          name: itemRef.name,
          fullPath: itemRef.fullPath,
          url
        };
      });
      
      const loadedImages = await Promise.all(imagePromises);
      setImages(loadedImages);
    } catch (error) {
      console.error("Failed to list images:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    
    setUploading(true);
    try {
      // Compress the image before uploading to save bandwidth and improve load times
      const options = {
        maxSizeMB: 0.5, // 500KB max
        maxWidthOrHeight: 1920,
        useWebWorker: true,
        fileType: 'image/webp' // Convert to modern webp format
      };
      
      const compressedFile = await imageCompression(file, options);
      
      // Keep original extension or swap to webp based on file type output
      const storageRef = ref(storage, `images/${Date.now()}_optimized.webp`);
      await uploadBytes(storageRef, compressedFile);
      await fetchImages(); // Refresh the list
    } catch (error) {
      console.error("Upload failed", error);
      alert("Failed to upload and compress image. Please try again.");
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (imagePath) => {
    if (!window.confirm("Are you sure you want to delete this image completely from Firebase?")) return;
    
    try {
      const imgRef = ref(storage, imagePath);
      await deleteObject(imgRef);
      setImages(images.filter(img => img.fullPath !== imagePath));
    } catch (error) {
      console.error("Failed to delete image:", error);
      alert("Failed to delete image.");
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-sm">
      <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-4xl max-h-[85vh] flex flex-col shadow-2xl">
        
        <div className="p-6 border-b border-slate-800 flex justify-between items-center">
          <div>
            <h2 className="text-xl font-bold text-slate-100 font-display">Image Library</h2>
            <p className="text-sm text-slate-400">Select an image or manage your uploaded files.</p>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white p-2">
            ✕
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6">
          {loading ? (
            <div className="flex justify-center py-12 text-slate-500">Loading images...</div>
          ) : images.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-slate-500 text-center">
              <p>No images found in your Firebase Storage.</p>
              <p className="text-sm mt-1">Upload one below to get started.</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
              {images.map((img) => (
                <div key={img.fullPath} className="relative group rounded-xl overflow-hidden bg-slate-800 aspect-square border border-slate-700/50 hover:border-sky-aqua-500 transition-colors">
                  <img src={img.url} alt={img.name} className="w-full h-full object-cover" />
                  
                  {/* Hover Overlay */}
                  <div className="absolute inset-0 bg-slate-900/80 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-3 p-4">
                    <button 
                      onClick={() => { onSelect(img.url); onClose(); }}
                      className="w-full bg-sky-aqua-500 hover:bg-sky-aqua-400 text-slate-900 font-bold py-2 rounded-lg text-sm"
                    >
                      Select
                    </button>
                    <button 
                      onClick={() => handleDelete(img.fullPath)}
                      className="text-red-400 hover:text-red-300 text-xs underline"
                    >
                      Delete permanently
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="p-6 border-t border-slate-800 flex justify-between items-center bg-slate-900/50 rounded-b-2xl">
          <label className="bg-slate-800 hover:bg-slate-700 text-slate-200 px-6 py-2 rounded-xl cursor-pointer transition-colors border border-slate-700 flex items-center gap-2">
            {uploading ? 'Uploading...' : 'Upload New Image'}
            <input type="file" className="hidden" accept="image/*" onChange={handleUpload} disabled={uploading} />
          </label>
          <button onClick={onClose} className="text-slate-400 hover:text-white px-4 py-2">
            Cancel
          </button>
        </div>
        
      </div>
    </div>
  );
}
