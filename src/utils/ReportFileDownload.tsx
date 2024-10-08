
function b64DecodeUnicode(str: string) {
    const text = atob(str);
    const length = text.length;
    const bytes = new Uint8Array(length);
    for (let i = 0; i < length; i++) {
      bytes[i] = text.charCodeAt(i);
    }
    const decoder = new TextDecoder(); // default is utf-8
    return decoder.decode(bytes);
  }
  
export function downloadReport(data: Blob | string, response: Response) {
const blob = new Blob([data], { type: 'application/pdf' });
const url = window.URL.createObjectURL(blob);
const a = document.createElement('a');
const filename_b64 = response.headers.get('Content-Disposition')?.split('filename=')[1].replace(/['"]/g, '');
let filename = "报告.pdf"
if (!filename_b64) {
    console.log("no filename provided. Using default name");
} else {
    filename = b64DecodeUnicode(filename_b64)
}
a.style.display = 'none';
a.href = url;
a.download = filename
document.body.appendChild(a);
a.click();
window.URL.revokeObjectURL(url);
}
