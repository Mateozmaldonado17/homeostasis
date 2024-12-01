function isPascalCase(text: string): boolean {
    const firstPart = text.split('.')[0];
    const pascalCaseRegex = /^[A-Z][a-z]*([A-Z][a-z]*)*$/;
    return pascalCaseRegex.test(firstPart);
}

function toPascalCase(text: string): string {
    if (!text.includes('.')) {
        return text
            .toLowerCase()
            .split(/[^a-zA-Z0-9]+/)
            .map(word => word.charAt(0).toUpperCase() + word.slice(1)) 
            .join('');
    }

    const parts = text.split('.');
    const firstPart = parts[0]; 
    const restPart = parts.slice(1).join('.');

    const pascalCaseName = firstPart
        .toLowerCase()
        .split(/[^a-zA-Z0-9]+/) 
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join('');
    return restPart ? `${pascalCaseName}.${restPart}` : pascalCaseName;
}

export { isPascalCase, toPascalCase };
