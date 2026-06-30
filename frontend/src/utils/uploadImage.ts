import { uploadMedia } from './uploadMedia';

export function uploadImage(file: File) {
  return uploadMedia(file, 'image');
}
