
export function generateInvoiceId(): string {
    const now = new Date();
    const day = String(now.getDate()).padStart(2, '0');
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const year = now.getFullYear();
    const hour = String(now.getHours()).padStart(2, '0');
    const minute = String(now.getMinutes()).padStart(2, '0');
    const second = String(now.getSeconds()).padStart(2, '0');
    const millisecond = String(now.getMilliseconds()).padStart(4, '0');

    return `INV-${year}${month}${day}${hour}${minute}${second}${millisecond}`;
}