export async function extractText(file: File): Promise<string> {
  if (file.type === 'text/plain') return await file.text()
  if (file.name.endsWith('.docx')) {
    const { convertToHtml } = await import('mammoth')
    const { value } = await convertToHtml({ arrayBuffer: await file.arrayBuffer() })
    const text = value.replace(/<[^>]+>/g, ' ')
                      .replace(/\s+/g, ' ')
                      .trim()
    return text.normalize('NFKC')
  }
  throw new Error('Formats acceptés : .txt, .docx (ou collez vos notes).')
}
