class ApiError extends Error {
    constructor(message, status) {
        super(message);
        this.name = 'ApiError';
        this.status = status;
    }
}

async function fetchWithErrorHandling(url, options = {}) {
    try {
        const response = await fetch(url, {
            timeout: 10000,
            ...options
        });

        if (!response.ok) {
            throw new ApiError(
                `HTTP Error: ${response.status} ${response.statusText}`,
                response.status
            );
        }

        return await response.json();
    } catch (error) {
        if (error instanceof ApiError) {
            throw error;
        }
        throw new ApiError(`Network Error: ${error.message}`, 0);
    }
}

export async function fetchUsers() {
    return await fetchWithErrorHandling('https://jsonplaceholder.typicode.com/users');
}

export async function fetchUserById(id) {
    try {
        return await fetchWithErrorHandling(`https://jsonplaceholder.typicode.com/users/${id}`);
    } catch (error) {
        if (error.status === 404) {
            return null;
        }
        throw error;
    }
}

export async function fetchPosts() {
    return await fetchWithErrorHandling('https://jsonplaceholder.typicode.com/posts');
}

export async function fetchPostsByUserId(userId) {
    return await fetchWithErrorHandling(`https://jsonplaceholder.typicode.com/posts?userId=${userId}`);
}
