export const generateUniqueId = () => {
    const timestamp = Date.now().toString(); // Convert current time to a string
    const randomNum = Math.floor(Math.random() * 1000000000000).toString().padStart(12, '0'); // Generate a random number and pad to 12 digits
    const uniqueId = (timestamp + randomNum).slice(0, 13); // Combine and slice to ensure 13 digits
    
    return uniqueId;
};