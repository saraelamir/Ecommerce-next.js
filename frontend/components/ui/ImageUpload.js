'use client';
import { useState } from 'react';

const CLOUD_NAME = 'dzkn4rj36';
const UPLOAD_PRESET = 'products_upload';

export default function ImageUpload({ images, onChange }) {
  const [uploading, setUploading] = useState(false);

  const handleFileChange = async (e) => {
    const files = Array.from(e.target.files);
    if (!files.length) return;
    setUploading(true);
    try {
      const uploadedUrls = await Promise.all(files.map(async (file) => {
        const formData = new FormData();
        formData.append('file', file);
        formData.append('upload_preset', UPLOAD_PRESET);
        const res = await fetch(`https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`, {
          method: 'POST',
          body: formData,
        });
        const data = await res.json();
        if (!data.secure_url) throw new Error('Upload failed');
        return data.secure_url;
      }));
      onChange([...images, ...uploadedUrls]);
    } catch {
      alert('Failed to upload image. Please try again.');
    }
    setUploading(false);
  };

  const removeImage = (index) => {
    onChange(images.filter((_, i) => i !== index));
  };

  return (
    <div>
      {/* Image Previews */}
      {images.length > 0 && (
        <div className="d-flex gap-2 flex-wrap mb-3">
          {images.map((url, i) => (
            <div key={i} style={{ position: 'relative' }}>
              <img src={url} alt="product"
                style={{ width: 90, height: 90, borderRadius: 10, objectFit: 'cover', border: '2px solid #e0e0e0' }}
                onError={e => e.target.src = 'https://picsum.photos/90/90'} />
              <button type="button" onClick={() => removeImage(i)}
                style={{ position: 'absolute', top: -6, right: -6, width: 22, height: 22, borderRadius: '50%', background: '#ef4444', color: '#fff', border: 'none', cursor: 'pointer', fontSize: 10, lineHeight: 1, padding: 0, display:'flex', alignItems:'center', justifyContent:'center' }}>
                <i className="fas fa-times" />
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Upload Area */}
      <label style={{
        display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10,
        border: `2px dashed ${uploading ? '#0d9488' : '#d0d0d0'}`,
        borderRadius: 10, padding: '16px 20px',
        cursor: uploading ? 'not-allowed' : 'pointer',
        background: uploading ? '#f0effe' : '#f8f9fc',
        color: uploading ? '#0d9488' : '#888',
        transition: 'all 0.2s',
      }}>
        <input type="file" accept="image/*" multiple
          onChange={handleFileChange} disabled={uploading}
          style={{ display: 'none' }} />
        <i className={`fas ${uploading ? 'fa-spinner fa-spin' : 'fa-cloud-upload-alt'}`}
          style={{ fontSize: '1.3rem', color: '#0d9488' }}></i>
        <span style={{ fontWeight: 500 }}>
          {uploading ? 'Uploading...' : 'Click to upload images'}
        </span>
      </label>
      <div className="form-text">Supports JPG, PNG, WEBP — multiple files allowed</div>
    </div>
  );
}
