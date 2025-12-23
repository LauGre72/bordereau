export async function copyText(s: string) {
  await navigator.clipboard.writeText(s)
}

export async function copyAll(obj: Record<string, string>) {
  const blob = Object.entries(obj).map(([k,v]) => `# ${k}\n${v.trim()}\n`).join('\n')
  await navigator.clipboard.writeText(blob)
}
