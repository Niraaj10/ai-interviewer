import { PDFParse } from 'pdf-parse';

/**
 * Extracts text content from a PDF buffer.
 * @param buffer - The PDF file buffer from req.file.buffer
 * @returns Promise<string> - Extracted text
 * @throws Error if PDF parsing fails
 */
export async function extractTextFromPdf(buffer: Buffer): Promise<string> {
    const parser = new PDFParse({ data: buffer });

    try {
        const { text } = await parser.getText();
        return text;
    } catch (error) {
        console.error("PDF Parsing Error: ", error);
        throw new Error("Failed to parse the uploaded resume PDF.");
    } finally {
        await parser.destroy();
    }
}
