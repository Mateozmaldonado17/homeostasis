function extractFileFormat(fileName: string): string {
  const lastDotIndex = fileName.lastIndexOf(".");
  if (lastDotIndex === -1 || lastDotIndex === 0) {
    return "";
  }
  return fileName.slice(lastDotIndex);
}
export default extractFileFormat;
