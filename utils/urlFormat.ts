export function dietFormat(labels?: string[]): string {
    return labels && labels.length > 0 
        ? labels.map(label => `&diet=${encodeURIComponent(label)}`).join("") 
        : "";
}

export function healthFormat(labels?: string[]): string {
    return labels && labels.length > 0 
        ? labels.map(label => `&health=${encodeURIComponent(label)}`).join("") 
        : "";
}