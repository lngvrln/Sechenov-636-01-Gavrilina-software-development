import { orders } from './data.js';

export function getUserOrders(userId) {
  return orders.filter(order => order.userId === userId);
}

export function addProductToOrder(orderId, newProduct) {
  const orderIndex = orders.findIndex(order => order.id === orderId);
  
  if (orderIndex === -1) {
    return null;
  }
  
  orders[orderIndex] = {
    ...orders[orderIndex],
    products: [...orders[orderIndex].products, newProduct]
  };
  
  return orders[orderIndex];
}

export function getOrderSummary(orderId) {
  const order = orders.find(order => order.id === orderId);
  
  if (!order) {
    return null;
  }
  
  const { products, total, status, userId } = order;
  
  return {
    productsCount: products.length,
    total: `$${total.toFixed(2)}`,
    status: status.toUpperCase(),
    userId
  };
}
