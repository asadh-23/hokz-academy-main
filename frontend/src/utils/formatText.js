
export const formatText = (text, limit = 20) => {
    if (!text || typeof text !== 'string') return "";
    
    const trimmedText = text.trim();
    if (trimmedText.length <= limit) return trimmedText;

    const words = trimmedText.split(/\s+/);
    let result = "";

    for (let word of words) {
       
        const nextLength = result.length + (result === "" ? 0 : 1) + word.length;

        if (nextLength <= limit) {
            result += (result === "" ? "" : " ") + word;
        } else {
            break;
        }
    }

    if (result === "") {
        return trimmedText.substring(0, limit - 3) + "...";
    }

    return result + "...";
};