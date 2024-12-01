function isCamelCase(text: string): boolean {
    const firstPart = text.split(/[^a-zA-Z0-9]/)[0];
    const camelCaseRegex = /^[a-z]+([A-Z][a-z]*)*$/;
    return camelCaseRegex.test(firstPart);
}

function toCamelCase(text: string): string {
    if (!text.includes('.')) {
        return text
            .toLowerCase()
            .split(/[^a-zA-Z0-9]+/)
            .map((word, index) => {
                if (index === 0) {
                    return word;
                }
                return word.charAt(0).toUpperCase() + word.slice(1);
            })
            .join('');
    }

    const parts = text.split('.');
    const firstPart = parts[0];
    const restPart = parts.slice(1).join('.');

    const camelCaseName = firstPart
        .toLowerCase()
        .split(/[^a-zA-Z0-9]+/)
        .map((word, index) => {
            if (index === 0) {
                return word;
            }
            return word.charAt(0).toUpperCase() + word.slice(1);
        })
        .join('');
    return restPart ? `${camelCaseName}.${restPart}` : camelCaseName;
}

export {
    isCamelCase,
    toCamelCase
}