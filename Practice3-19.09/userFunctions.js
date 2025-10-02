import { fetchUsers, fetchUserById, fetchPostsByUserId } from './api.js';

export async function getActiveUsers() {
    try {
        const users = await fetchUsers();
        
        // Активными считаем пользователей с четным ID
        const activeUsers = users.filter(user => user.id % 2 === 0);
        
        return activeUsers;
    } catch (error) {
        console.error('Error getting active users:', error);
        throw error;
    }
}

export async function getUserWithPosts(userId) {
    try {
        const [user, posts] = await Promise.all([
            fetchUserById(userId),
            fetchPostsByUserId(userId)
        ]);
        
        if (!user) {
            return null;
        }
        
        const { id, name, email, username } = user;
        
        return {
            user: { id, name, email, username },
            posts: posts || []
        };
    } catch (error) {
        console.error(`Error getting user ${userId} with posts:`, error);
        throw error;
    }
}

export async function findUserByEmail(email) {
    try {
        const users = await fetchUsers();
        const normalizedEmail = email.toLowerCase().trim();
        
        const user = users.find(user => 
            user.email.toLowerCase().trim() === normalizedEmail
        );
        
        return user || null;
    } catch (error) {
        console.error(`Error finding user by email ${email}:`, error);
        throw error;
    }
}
