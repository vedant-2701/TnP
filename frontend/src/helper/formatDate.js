export function formatDateAndTime(dateInput) {
    const date = typeof dateInput === 'string' ? new Date(dateInput) : dateInput;

    return new Intl.DateTimeFormat('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
    }).format(date);
}

export function formatDate(dateInput) {
    const date = typeof dateInput === 'string' ? new Date(dateInput) : dateInput;

    return new Intl.DateTimeFormat('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
    }).format(date);
}
