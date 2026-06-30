import { ImagePlus } from 'lucide-react';
import { useState } from 'react';
import { uploadImage } from '../utils/uploadImage';

interface ImageUploadFieldProps {
  label: string;
  value?: string;
  onChange: (url: string) => void;
  actionLabel?: string;
  uploadingLabel?: string;
  placeholder?: string;
}

const inputClass = 'w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm font-medium text-slate-800 outline-none transition focus:border-purple-700 focus:ring-4 focus:ring-purple-100';

export function ImageUploadField({
  label,
  value,
  onChange,
  actionLabel = '选择图片',
  uploadingLabel = '上传中...',
  placeholder = '例如：https://example.com/image.jpg，或选择本地图片自动上传'
}: ImageUploadFieldProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  async function handleFile(file?: File) {
    if (!file || isUploading) return;

    const previousValue = value || '';
    const previewUrl = URL.createObjectURL(file);
    setErrorMessage('');
    onChange(previewUrl);
    setIsUploading(true);

    try {
      const result = await uploadImage(file);
      onChange(result.url);
    } catch (error) {
      onChange(previousValue);
      const message = error instanceof Error ? error.message : '图片上传失败。';
      setErrorMessage(message);
      alert(message);
    } finally {
      URL.revokeObjectURL(previewUrl);
      setIsUploading(false);
    }
  }

  return (
    <div className="grid gap-2">
      <div className="flex items-center justify-between gap-3">
        <span className="text-xs font-bold uppercase tracking-wide text-slate-500">{label}</span>
        <label className={`inline-flex items-center gap-1.5 rounded-md px-2.5 py-1.5 text-xs font-bold transition ${isUploading ? 'cursor-wait bg-slate-200 text-slate-400' : 'cursor-pointer bg-slate-100 text-slate-600 hover:bg-slate-200'}`}>
          <ImagePlus className="h-3.5 w-3.5" />
          {isUploading ? uploadingLabel : actionLabel}
          <input
            className="sr-only"
            type="file"
            accept="image/*"
            disabled={isUploading}
            onChange={(event) => {
              void handleFile(event.target.files?.[0]);
              event.currentTarget.value = '';
            }}
          />
        </label>
      </div>
      {value ? <img src={value} alt={label} className="h-28 w-full rounded-lg border border-slate-200 object-cover" /> : null}
      <input className={inputClass} value={value || ''} placeholder={placeholder} onChange={(event) => onChange(event.target.value)} />
      {errorMessage ? <p className="text-xs font-semibold text-red-500">{errorMessage}</p> : null}
    </div>
  );
}
