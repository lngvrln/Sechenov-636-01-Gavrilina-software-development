import { fetchPosts, fetchUsers } from './api.js';

export async function getRecentPosts(limit = 5) {
    try {
        const posts = await fetchPosts();
        
        const sortedPosts = posts.sort((a, b) => b.id - a.id);
        const recentPosts = sortedPosts.slice(0, limit);
        
        return recentPosts;
    } catch (error) {
        console.error('Error getting recent posts:', error);
        throw error;
    }
}

export async function getPostsByTitleSearch(searchTerm) {
    try {
        const posts = await fetchPosts();
        const normalizedSearch = searchTerm.toLowerCase().trim();
        
        const filteredPosts = posts.filter(post =>
            post.title.toLowerCase().includes(normalizedSearch)
        );
        
        return filteredPosts;
    } catch (error) {
        console.error(`Error searching posts by title "${searchTerm}":`, error);
        throw error;
    }
}

export async function getPostsStats() {
    try {
        const [users, posts] = await Promise.all([
            fetchUsers(),
            fetchPosts()
        ]);
        
        const totalPosts = posts.length;
        const totalUsers = users.length;
        const averagePostsPerUser = totalUsers > 0 ? (totalPosts / totalUsers).toFixed(2) : 0;
        
        // Статистика по пользователям с наибольшим количеством постов
        const userPostsCount = users.map(user => {
            const userPosts = posts.filter(post => post.userId === user.id);
            return {
                userId: user.id,
                userName: user.name,
                postsCount: userPosts.length
            };
        }).sort((a, b) => b.postsCount - a.postsCount);
        
        return {
            totalPosts,
            totalUsers,
            averagePostsPerUser: parseFloat(averagePostsPerUser),
            topUsers: userPostsCount.slice(0, 3)
        };
    } catch (error) {
        console.error('Error getting posts stats:', error);
        throw error;
    }
}
