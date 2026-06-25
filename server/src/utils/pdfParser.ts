import { PDFParse } from 'pdf-parse';


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
