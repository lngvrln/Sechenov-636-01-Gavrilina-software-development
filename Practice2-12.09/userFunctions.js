import { users } from './data.js';

export function createUser({ name, email, isActive = true }) {
  const maxId = users.reduce((max, user) => Math.max(max, user.id), 0);
  const newUser = {
    id: maxId + 1,
    name,
    email,
    isActive
  };
  
  users.push(newUser);
  return newUser;
}

export function findUserById(id) {
  const user = users.find(user => user.id === id);
  
  if (!user) {
    return null;
  }
  
  const { name, email } = user;
  return { name, email };
}

export function updateUser(id, updatedFields) {
  const userIndex = users.findIndex(user => user.id === id);
  
  if (userIndex === -1) {
    return null;
  }
  
  users[userIndex] = {
    ...users[userIndex],
    ...updatedFields
  };
  
  return users[userIndex];
}
