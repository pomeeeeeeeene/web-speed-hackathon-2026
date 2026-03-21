import { FFmpeg } from "@ffmpeg/ffmpeg";

let ffmpegPromise: Promise<FFmpeg> | null = null;

export async function loadFFmpeg(): Promise<FFmpeg> {
  if (ffmpegPromise != null) {
    return ffmpegPromise;
  }

  const ffmpeg = new FFmpeg();
  ffmpegPromise = (async () => {
    const coreURL = await import("@ffmpeg/core?binary").then(({ default: b }) => {
      return URL.createObjectURL(new Blob([b], { type: "text/javascript" }));
    });
    const wasmURL = await import("@ffmpeg/core/wasm?binary").then(({ default: b }) => {
      return URL.createObjectURL(new Blob([b], { type: "application/wasm" }));
    });

    try {
      await ffmpeg.load({
        coreURL,
        wasmURL,
      });
      return ffmpeg;
    } catch (error) {
      ffmpegPromise = null;
      throw error;
    } finally {
      URL.revokeObjectURL(coreURL);
      URL.revokeObjectURL(wasmURL);
    }
  })();

  return ffmpegPromise;
}
