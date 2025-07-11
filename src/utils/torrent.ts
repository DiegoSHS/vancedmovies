
const VIDEO_EXTENSIONS = [
    ".mp4",
    ".webm",
    ".ogg",
    ".avi",
    ".mov",
    ".mkv",
    ".m4v",
];

const isVideoFile = (filename: string): boolean => {
    const lowerName = filename.toLowerCase();
    return VIDEO_EXTENSIONS.some((ext) => lowerName.endsWith(ext));
};