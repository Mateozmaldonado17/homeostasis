function isCamelCase(text: string): boolean {
    const firstPart = text.split(/[^a-zA-Z0-9]/)[0];
    const camelCaseRegex = /^[a-z]+([A-Z][a-z]*)*$/;
    return camelCaseRegex.test(firstPart);
}

function toCamelCase(text: string): string {
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

export {
    isCamelCase,
    toCamelCase
}