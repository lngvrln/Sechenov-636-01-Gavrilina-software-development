// 1. validateUsername
const validateUsername = (username) => {
  if (typeof username !== "string") {
    return "Имя пользователя должно быть строкой";
  }
  if (username.length < 5 || username.length > 15) {
    return "Имя пользователя должно содержать от 5 до 15 символов";
  }
  return null;
};

// 2. validateEmail
const validateEmail = (email) => {
  if (typeof email !== "string") {
    return "Email должен быть строкой";
  }
  if (!email.includes("@") || !email.includes(".")) {
    return "Email должен содержать @ и точку";
  }
  return null;
};

// 3. validateAge
const validateAge = (age) => {
  if (typeof age !== "number" || !Number.isInteger(age)) {
    return "Возраст должен быть целым числом";
  }
  if (age < 18 || age > 120) {
    return "Возраст должен быть в диапазоне от 18 до 120";
  }
  return null;
};

// 4. validateAgreement
const validateAgreement = (isAgreed) => {
  if (typeof isAgreed !== "boolean" || isAgreed !== true) {
    return "Необходимо согласие";
  }
  return null;
};

// 5. validatePhone
const validatePhone = (phone) => {
  if (phone === undefined) {
    return null; 
  }
  if (typeof phone !== "string") {
    return "Телефон должен быть строкой";
  }
  if (!phone.startsWith("+7") || phone.length !== 12) {
    return "Телефон должен начинаться с +7 и содержать 12 символов";
  }
  return null;
};

console.log(validateUsername("Test"));          
console.log(validateEmail("test@mail.com"));   
console.log(validateAge(7));                   
console.log(validateAgreement(true));           
console.log(validatePhone("+71234567890"));     
console.log(validatePhone());                  
