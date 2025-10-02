import { getActiveUsers, getUserWithPosts, findUserByEmail } from './userFunctions.js';
import { getRecentPosts, getPostsByTitleSearch, getPostsStats } from './orderFunctions.js';
import { simulateLoading, withTimeout, retryOperation } from './utils.js';
import { fetchUserById } from './api.js';

async function demonstrateSequentialOperations() {
    
    await simulateLoading(1000);
    
    console.log('\n1. Получение активных пользователей...');
    try {
        const activeUsers = await getActiveUsers();
        console.log(`Найдено активных пользователей: ${activeUsers.length}`);
        activeUsers.forEach(user => {
            console.log(`   ${user.name} (${user.email})`);
        });
    } catch (error) {
        console.log('Ошибка при получении активных пользователей:', error.message);
    }
    
    await simulateLoading(500);
}

async function demonstrateParallelOperations() {

    console.log('2. Получение детальной информации о пользователе...');
    try {
        const userWithPosts = await getUserWithPosts(1);
        if (userWithPosts) {
            console.log(`Пользователь: ${userWithPosts.user.name}`);
            console.log(`   Email: ${userWithPosts.user.email}`);
            console.log(`   Количество постов: ${userWithPosts.posts.length}`);
            if (userWithPosts.posts.length > 0) {
                console.log(`   Последний пост: "${userWithPosts.posts[0].title}"`);
            }
        }
    } catch (error) {
        console.log('Ошибка при получении информации о пользователе:', error.message);
    }
    
    await simulateLoading(500);
}

async function demonstrateSearchOperations() {

    console.log('3. Получение последних постов...');
    try {
        const recentPosts = await getRecentPosts(3);
        console.log(`Последние ${recentPosts.length} постов:`);
        recentPosts.forEach(post => {
            console.log(`   [${post.id}] ${post.title}`);
        });
    } catch (error) {
        console.log('Ошибка при получении последних постов:', error.message);
    }
    
    await simulateLoading(500);
    
    console.log('\n4. Поиск постов по заголовку...');
    try {
        const searchResults = await getPostsByTitleSearch('qui');
        console.log(`Найдено постов: ${searchResults.length}`);
        searchResults.slice(0, 2).forEach(post => {
            console.log(`   "${post.title}"`);
        });
        if (searchResults.length > 2) {
            console.log(`   ... и еще ${searchResults.length - 2} постов`);
        }
    } catch (error) {
        console.log('Ошибка при поиске постов:', error.message);
    }
}

async function demonstrateStatistics() {

    console.log('5. Получение статистики по постам и пользователям...');
    try {
        const stats = await getPostsStats();
        console.log('Статистика системы:');
        console.log(`   Всего пользователей: ${stats.totalUsers}`);
        console.log(`   Всего постов: ${stats.totalPosts}`);
        console.log(`   Среднее постов на пользователя: ${stats.averagePostsPerUser}`);
        console.log('   Топ пользователей по количеству постов:');
        stats.topUsers.forEach(user => {
            console.log(`      ${user.userName}: ${user.postsCount} постов`);
        });
    } catch (error) {
        console.log('Ошибка при получении статистики:', error.message);
    }
}

async function demonstrateErrorHandling() {

    console.log('6. Поиск пользователя по email...');
    try {
        const user = await findUserByEmail('Sincere@april.biz');
        if (user) {
            console.log(`Найден пользователь: ${user.name}`);
        } else {
            console.log('Пользователь не найден');
        }
    } catch (error) {
        console.log('Ошибка при поиске по email:', error.message);
    }
    
    await simulateLoading(500);
    
    console.log('\n7. Демонстрация работы с таймаутом...');
    try {
        const result = await withTimeout(fetchUserById(1), 5000);
        console.log('Операция завершена в срок');
    } catch (error) {
        console.log(`Таймаут: ${error.message}`);
    }
    
    await simulateLoading(500);
    
    console.log('\n8. Демонстрация повторных попыток...');
    try {
        // Создаем операцию, которая иногда падает
        const unstableOperation = () => {
            return new Promise((resolve, reject) => {
                const shouldFail = Math.random() > 0.5;
                if (shouldFail) {
                    reject(new Error('Случайная ошибка'));
                } else {
                    resolve('Успешное выполнение!');
                }
            });
        };
        
        const result = await retryOperation(unstableOperation, 3);
        console.log(`Результат после повторных попыток: ${result}`);
    } catch (error) {
        console.log(`Все попытки завершились ошибкой: ${error.message}`);
    }
}

async function main() {
    
    try {
        await demonstrateSequentialOperations();
        await demonstrateParallelOperations();
        await demonstrateSearchOperations();
        await demonstrateStatistics();
        await demonstrateErrorHandling();
        
    } catch (error) {
        console.error('\nКРИТИЧЕСКАЯ ОШИБКА:', error);
    } finally {
        console.log('\nРабота программы завершена');
    }
}

main().catch(error => {
    console.error('Необработанная ошибка:', error);
    process.exit(1);
});
