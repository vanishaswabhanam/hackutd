/**
 * OCR Space API Integration
 * Free tier API for document text extraction
 */

const OCR_API_KEY = 'K82135188788957';
const OCR_API_ENDPOINT = 'https://api.ocr.space/parse/image';

/**
 * Upload document to OCR.space and extract text
 * @param {File} file - The document file to process
 * @returns {Promise<Object>} Extracted text and metadata
 */
export async function extractTextFromDocument(file) {
  try {
    // Create form data for OCR API
    const formData = new FormData();
    formData.append('file', file);
    formData.append('apikey', OCR_API_KEY);
    formData.append('language', 'eng');
    formData.append('isOverlayRequired', 'false');
    formData.append('detectOrientation', 'true');
    formData.append('scale', 'true');
    formData.append('OCREngine', '2'); // Use engine 2 for better accuracy

    // Call OCR API
    const response = await fetch(OCR_API_ENDPOINT, {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      throw new Error(`OCR API error: ${response.statusText}`);
    }

    const result = await response.json();

    // Check for API errors
    if (result.OCRExitCode !== 1) {
      throw new Error(result.ErrorMessage || 'OCR processing failed');
    }

    // Extract text from all pages
    const extractedText = result.ParsedResults
      .map(page => page.ParsedText)
      .join('\n\n');

    return {
      success: true,
      text: extractedText,
      confidence: result.ParsedResults[0]?.TextOrientation || 'N/A',
      processingTime: result.ProcessingTimeInMilliseconds,
      pages: result.ParsedResults.length,
    };
  } catch (error) {
    console.error('OCR extraction error:', error);
    return {
      success: false,
      error: error.message,
      text: '',
    };
  }
}

/**
 * Validate file type for OCR processing
 * @param {File} file - The file to validate
 * @returns {boolean} True if file type is supported
 */
export function isValidFileType(file) {
  const validTypes = [
    'image/jpeg',
    'image/jpg',
    'image/png',
    'image/gif',
    'image/bmp',
    'application/pdf',
  ];
  return validTypes.includes(file.type);
}

/**
 * Validate file size (max 1MB for free tier)
 * @param {File} file - The file to validate
 * @returns {boolean} True if file size is acceptable
 */
export function isValidFileSize(file) {
  const maxSize = 1024 * 1024; // 1MB
  return file.size <= maxSize;
}

