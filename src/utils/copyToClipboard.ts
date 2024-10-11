/**
 * Copies the given text to the clipboard.
 * @param text The text to copy to the clipboard
 * @returns A promise that resolves when the text has been copied successfully, or rejects if there was an error
 */
export const copyToClipboard = async (text: string): Promise<void> => {
  try {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      // Use the Clipboard API if available
      await navigator.clipboard.writeText(text);
    } else {
      // Fallback for older browsers
      const textArea = document.createElement('textarea');
      textArea.value = text;
      textArea.style.position = 'fixed';  // Avoid scrolling to bottom
      document.body.appendChild(textArea);
      textArea.focus();
      textArea.select();

      try {
        const successful = document.execCommand('copy');
        if (!successful) {
          throw new Error('Unable to copy text');
        }
      } catch (err) {
        throw new Error('Unable to copy text');
      } finally {
        document.body.removeChild(textArea);
      }
    }
  } catch (err) {
    console.error('Failed to copy text: ', err);
    throw err;
  }
};