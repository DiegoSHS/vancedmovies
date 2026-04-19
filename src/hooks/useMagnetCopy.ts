import { useState } from 'react';

export const useMagnetCopy = () => {
    const [copied, setCopied] = useState(false);
    async function CopyToClipboard(
        magnetLink: string,
    ) {
        try {
            const { copyMagnetToClipboard } = await import('../utils/magnetGenerator')
            await copyMagnetToClipboard(magnetLink);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        } catch {
            setCopied(false);
            setTimeout(() => setCopied(false), 2000);
        }
    }
    return { copied, CopyToClipboard }
}