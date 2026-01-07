export function detectFallback() {
  const xr = (navigator as any).xr;
  if (xr && xr.isSessionSupported) {
    return "ar";
  }
  const canvas = document.createElement("canvas");
  const gl =
    canvas.getContext("webgl") || canvas.getContext("experimental-webgl");
  if (gl) return "3d";
  return "audio";
}
