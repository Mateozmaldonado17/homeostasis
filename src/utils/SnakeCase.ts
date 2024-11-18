function isSnakeCase(text: string): boolean {
    const firstPart = text.includes('.') ? text.split('.')[0] : text;
    const snakeCaseRegex = /^[a-z0-9]+(_[a-z0-9]+)*$/;
    return snakeCaseRegex.test(firstPart);
}

function toSnakeCase(text: string): string {
    if (!text.includes('.')) {
        return text
            .replace(/([a-z])([A-Z])/g, '$1_$2')
            .replace(/[^a-zA-Z0-9]+/g, '_')
            .toLowerCase();
    }

    const parts = text.split('.');
    const firstPart = parts[0];
    const restPart = parts.slice(1).join('.');

    const snakeCaseName = firstPart
        .replace(/([a-z])([A-Z])/g, '$1_$2')
        .replace(/[^a-zA-Z0-9]+/g, '_')
        .toLowerCase();

    return restPart ? `${snakeCaseName}.${restPart}` : snakeCaseName;
}

export {
    isSnakeCase,
    toSnakeCase
}