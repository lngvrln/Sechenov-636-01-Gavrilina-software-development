export function calculateTotal(...prices) {
  return prices.reduce((sum, price) => sum + price, 0);
}

export function formatUserInfo(user) {
  const { name, email, isActive } = user;
  const statusText = isActive ? 'Active' : 'Inactive';
  
  return `Пользователь: ${name} (${email}). Status: ${statusText}`;
}
