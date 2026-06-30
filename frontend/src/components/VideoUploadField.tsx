import { Video } from 'lucide-react';
import { useState } from 'react';
import { uploadMedia } from '../utils/uploadMedia';

interface VideoUploadFieldProps {
  label: string;
  value?: string;
  onChange: (url: string) => void;
  actionLabel?: string;
  uploadingLabel?: string;
  placeholder?: string;
}

const inputClass = 'w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm font-medium text-slate-800 outline-none transition focus:border-purple-700 focus:ring-4 focus:ring-purple-100';

function looksLikeVideoUrl(value?: string) {
  if (!value) return false;
  return value.startsWith('blob:') || /\.(mp4|webm|ogg|ogv|mov)(\?|#|$)/i.test(value);
}

export function VideoUploadField({
  label,
  value,
  onChange,
  actionLabel = '选择视频',
  uploadingLabel = '上传中...',
  placeholder = '例如：https://example.com/demo.mp4，或选择本地视频自动上传'
}: VideoUploadFieldProps) {
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
      const result = await uploadMedia(file, 'video');
      onChange(result.url);
    } catch (error) {
      onChange(previousValue);
      const message = error instanceof Error ? error.message : '视频上传失败。';
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
          <Video className="h-3.5 w-3.5" />
          {isUploading ? uploadingLabel : actionLabel}
          <input
            className="sr-only"
            type="file"
            accept="video/*"
            disabled={isUploading}
            onChange={(event) => {
              void handleFile(event.target.files?.[0]);
              event.currentTarget.value = '';
            }}
          />
        </label>
      </div>
      {looksLikeVideoUrl(value) ? <video src={value} className="h-32 w-full rounded-lg border border-slate-200 bg-slate-950 object-cover" controls muted /> : null}
      <input className={inputClass} value={value || ''} placeholder={placeholder} onChange={(event) => onChange(event.target.value)} />
      {errorMessage ? <p className="text-xs font-semibold text-red-500">{errorMessage}</p> : null}
    </div>
  );
}
