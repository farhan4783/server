const Tesseract = require('tesseract.js');

// Helper function to validate if the string is base64 encoded
function isValidBase64(base64Str) {
    try {
        Buffer.from(base64Str, 'base64').toString('utf-8');  // Try decoding base64
        return true;
    } catch (error) {
        return false;
    }
}

// Controller for the /api/get-text endpoint
async function getText(req, res) {
    const { base64_image } = req.body;  // Extract the base64_image from request

    if (!base64_image || !isValidBase64(base64_image)) {
        return res.status(400).json({
            success: false,
            error: { message: 'Invalid base64_image.' }
        });  // Return error if image is invalid
    }

    try {
        const imageBuffer = Buffer.from(base64_image, 'base64');  // Convert base64 to Buffer
        const { data: { text } } = await Tesseract.recognize(imageBuffer, 'eng');  // OCR processing
        res.json({ success: true, result: { text } });  // Send extracted text as response
    } catch (error) {
        res.status(500).json({
            success: false,
            error: { message: error.message }
        });  // Handle any OCR processing errors
    }
}

// Controller for the /api/get-bboxes endpoint
async function getBoundingBoxes(req, res) {
    const { base64_image, bbox_type } = req.body;  // Extract base64_image and bbox_type
    const validBboxTypes = ['word', 'line', 'paragraph', 'block', 'page'];  // Valid bbox types

    // Validate base64 image
    if (!base64_image || !isValidBase64(base64_image)) {
        return res.status(400).json({
            success: false,
            error: { message: 'Invalid base64_image.' }
        });
    }

    // Validate bounding box type
    if (!bbox_type || !validBboxTypes.includes(bbox_type)) {
        return res.status(400).json({
            success: false,
            error: { message: 'Invalid bbox_type.' }
        });
    }

    try {
        const imageBuffer = Buffer.from(base64_image, 'base64');  // Convert base64 to Buffer
        const { data: { words, lines, paragraphs, blocks, pages } } = await Tesseract.recognize(imageBuffer, 'eng', {
            oem: 1,  // OCR Engine Mode for Tesseract (can adjust based on requirement)
        });

        let bboxes = [];  // To store the bounding boxes
        switch (bbox_type) {
            case 'word':
                bboxes = words.map(word => word.bbox);  // Extract word bounding boxes
                break;
            case 'line':
                bboxes = lines.map(line => line.bbox);  // Extract line bounding boxes
                break;
            case 'paragraph':
                bboxes = paragraphs.map(paragraph => paragraph.bbox);  // Extract paragraph bounding boxes
                break;
            case 'block':
                bboxes = blocks.map(block => block.bbox);  // Extract block bounding boxes
                break;
            case 'page':
                bboxes = pages.map(page => page.bbox);  // Extract page bounding boxes
                break;
        }

        res.json({ success: true, result: { bboxes } });  // Return bounding boxes in response
    } catch (error) {
        res.status(500).json({
            success: false,
            error: { message: error.message }
        });  // Handle any OCR processing errors
    }
}

module.exports = { getText, getBoundingBoxes };  // Export the controller functions
