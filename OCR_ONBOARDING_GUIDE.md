# Smart Document Upload Onboarding - Usage Guide

## Overview
The vendor onboarding system now uses OCR Space API to automatically extract information from uploaded documents and auto-fill the form.

## How to Use

### 1. Start the Development Server
```bash
npm run dev
```
Navigate to `http://localhost:5173`

### 2. Test the OCR Feature

#### Option A: Use Sample Document
1. On the onboarding page, click "Download sample vendor form" link
2. Save the `sample-vendor-info.txt` file
3. Drag and drop it into the upload zone (or click "Browse Files")
4. Watch the magic happen:
   - Document uploads
   - OCR extracts text
   - Parser identifies fields
   - Form auto-fills with color-coded confidence levels

#### Option B: Create Your Own Test Document
Create a text file with this format:

```
Company Name: Your Company LLC
Tax ID: 12-3456789
Email: contact@yourcompany.com
Phone: (555) 123-4567
Address: 123 Main St, City, State ZIP
Business Type: Your Industry
Services: Description of what you do
Years in Business: 5
Annual Revenue: $5M
Insurance: Policy #12345
Certifications: SOC2, ISO 27001
```

### 3. Understand the Color Coding

After OCR processing, fields are highlighted:
- **Green background** = High confidence (>80%) - Likely correct
- **Yellow background** = Medium confidence (40-80%) - Please review
- **White/Gray** = Low confidence or not found - Manual entry needed

### 4. Review and Edit
- All fields are editable even after auto-fill
- Edit any incorrect values
- Fill in fields that weren't auto-populated

### 5. Submit
- Click "Submit for Review"
- Agents immediately start background investigation
- Watch agent status update in real-time

## Technical Details

### API Integration
- **Service**: OCR Space Free API
- **API Key**: K82135188788957 (already configured)
- **Rate Limit**: 500 calls/day on free tier
- **File Size Limit**: 1MB max
- **Supported Formats**: PDF, JPG, PNG, GIF, BMP

### Architecture

```
Upload Document
    ↓
OCR Service (ocrService.js)
    ↓ extracts text
Document Parser (documentParser.js)
    ↓ parses structured data
VendorOnboarding Component
    ↓ auto-fills form
User Reviews & Submits
    ↓
Agents Activate
```

### Files Created
- `src/services/ocrService.js` - OCR Space API integration
- `src/services/documentParser.js` - Intelligent field extraction
- `public/sample-vendor-info.txt` - Test document
- `src/pages/VendorOnboarding.jsx` - Redesigned onboarding page

## Features Demonstrated

✅ **Smart OCR Processing** - Extracts text from any document format
✅ **Intelligent Parsing** - Uses regex and pattern matching to identify fields
✅ **Confidence Scoring** - Visual feedback on extraction quality
✅ **Real-time Agent Activation** - Background investigation starts immediately
✅ **Professional UI** - Maintains Goldman Sachs design aesthetic
✅ **Error Handling** - Graceful fallback if OCR fails
✅ **User Control** - Can edit any auto-filled field

## Hackathon Demo Tips

1. **Show the upload**: Drag-and-drop is more impressive than clicking
2. **Point out the colors**: Green/yellow highlighting shows AI confidence
3. **Watch agents activate**: They start working as soon as data is extracted
4. **Edit a field**: Show it's not just dumb OCR, user has control
5. **Mention the practical value**: Saves vendors 5-10 minutes of typing

## Troubleshooting

**"File size must be less than 1MB"**
- The free OCR API has a 1MB limit
- Compress images or use the sample text file

**"OCR processing failed"**
- Check internet connection (API requires network)
- Verify file is a supported format
- Try the sample document first

**Fields not auto-filling**
- Some documents may not have recognizable patterns
- Parser looks for keywords like "Company Name:", "Tax ID:", etc.
- Manually fill any missing fields

## Next Steps for Production

To make this production-ready:
1. Upgrade to paid OCR API for higher limits
2. Add AI/ML model for better field extraction (use NVIDIA Nemotron)
3. Store extracted data securely
4. Add document verification (compare multiple uploaded docs)
5. Integrate with actual agent backend APIs
6. Add user authentication and session management

