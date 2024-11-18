function isKebabCase(text: string): boolean {
    const firstPart = text.includes('.') ? text.split('.')[0] : text;
    const kebabCaseRegex = /^[a-z0-9]+(-[a-z0-9]+)*$/;
    return kebabCaseRegex.test(firstPart);
}

function toKebabCase(text: string): string {
    if (!text.includes('.')) {
        return text
            .replace(/([a-z])([A-Z])/g, '$1-$2')
            .replace(/[^a-zA-Z0-9]+/g, '-')
            .toLowerCase();
    }

    const parts = text.split('.');
    const firstPart = parts[0];
    const restPart = parts.slice(1).join('.');

    const kebabCaseName = firstPart
        .replace(/([a-z])([A-Z])/g, '$1-$2')
        .replace(/[^a-zA-Z0-9]+/g, '-')
        .toLowerCase();

    return restPart ? `${kebabCaseName}.${restPart}` : kebabCaseName;
}

export {
    isKebabCase,
    toKebabCase
}