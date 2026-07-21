const MEDIA_EXTENSIONS = /\.(mp4|webm|mov)$/i

export function isVideo(path) {
  return MEDIA_EXTENSIONS.test(path)
}
