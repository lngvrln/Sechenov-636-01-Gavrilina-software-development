export function simulateLoading(delay) {
    return new Promise((resolve) => {
        console.log(`Simulating loading for ${delay}ms...`);
        setTimeout(() => {
            console.log('Loading complete!');
            resolve();
        }, delay);
    });
}

export function withTimeout(promise, timeoutMs) {
    return Promise.race([
        promise,
        new Promise((_, reject) => {
            setTimeout(() => {
                reject(new Error(`Operation timed out after ${timeoutMs}ms`));
            }, timeoutMs);
        })
    ]);
}

export async function retryOperation(operation, maxRetries = 3) {
    let lastError;
    
    for (let attempt = 1; attempt <= maxRetries; attempt++) {
        try {
            console.log(`Attempt ${attempt} of ${maxRetries}`);
            return await operation();
        } catch (error) {
            lastError = error;
            
            if (attempt < maxRetries) {
                const delay = Math.pow(2, attempt - 1) * 1000; // Экспоненциальная задержка
                console.log(`Attempt ${attempt} failed. Retrying in ${delay}ms...`);
                await new Promise(resolve => setTimeout(resolve, delay));
            }
        }
    }
    
    throw lastError;
}
