import { users, orders } from './data.js';
import { createUser, findUserById, updateUser } from './userFunctions.js';
import { getUserOrders, addProductToOrder, getOrderSummary } from './orderFunctions.js';
import { calculateTotal, formatUserInfo } from './utils.js';

console.log('\n--- Создание нового пользователя ---');
const newUser = createUser({
  name: "Елена",
  email: "elena@yandex.ru"
});
console.log('Создан пользователь:', newUser);

console.log('\n--- Поиск пользователя по ID ---');
const foundUser = findUserById(1);
console.log('Найден пользователь:', foundUser);

const notFoundUser = findUserById(999);
console.log('Поиск несуществующего пользователя:', notFoundUser);

console.log('\n--- Обновление пользователя ---');
const updatedUser = updateUser(2, { 
  name: "Станислав", 
  isActive: true 
});
console.log('Обновленный пользователь:', updatedUser);

console.log('\nВсе пользователи после изменений:');
users.forEach(user => console.log(formatUserInfo(user)));

console.log('\n--- Заказы пользователя с ID 1 ---');
const userOrders = getUserOrders(1);
console.log('Заказы пользователя:', userOrders);

console.log('\n--- Добавление товара в заказ ---');
const updatedOrder = addProductToOrder(101, "Карандаш");
console.log('Обновленный заказ:', updatedOrder);

console.log('\n--- Сводка по заказу ---');
const orderSummary = getOrderSummary(101);
console.log('Сводка по заказу:', orderSummary);

console.log('\n--- Вычисление общей суммы ---');
const total1 = calculateTotal(10, 20, 30);
const total2 = calculateTotal(5.75, 3.25, 8.50, 2.00);
console.log('Сумма 1 (10, 20, 30):', total1);
console.log('Сумма 2 (5.75, 3.25, 8.50, 2.00):', total2);

console.log('\n--- Форматирование информации о пользователе ---');
users.forEach(user => {
  console.log(formatUserInfo(user));
});

console.log('\n--- Сводки по всем заказам ---');
orders.forEach(order => {
  const summary = getOrderSummary(order.id);
  console.log(`Заказ ${order.id}:`, summary);
});

console.log('\n--- Поиск несуществующего заказа ---');
const nonExistentOrder = getOrderSummary(999);
console.log('Результат поиска несуществующего заказа:', nonExistentOrder);
