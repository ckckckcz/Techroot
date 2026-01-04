// User helpers
export const getInitials = (name?: string): string => {
    if (!name) return 'U';
    const parts = name.split(' ');
    return parts.length >= 2 ? `${parts[0][0]}${parts[1][0]}`.toUpperCase() : name.substring(0, 2).toUpperCase();
};

// Level calculation
export const XP_PER_LEVEL = 200;
export const calculateLevel = (xp: number): number => Math.floor(xp / XP_PER_LEVEL) + 1;

// Date helpers
export const today = () => new Date().toISOString().split('T')[0];
export const toDateString = () => new Date().toDateString();

// Format text with bold markers
export const formatBoldText = (text: string): { isBold: boolean; text: string }[] => {
    return text.split(/(\*\*.*?\*\*)/g).map(part => ({
        isBold: part.startsWith('**') && part.endsWith('**'),
        text: part.startsWith('**') ? part.slice(2, -2) : part
    }));
};
