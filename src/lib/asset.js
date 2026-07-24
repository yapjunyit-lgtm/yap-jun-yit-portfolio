const BASE = import.meta.env.BASE_URL

export function assetPath(path) {
  return BASE + path.replace(/^\//, '')
}
