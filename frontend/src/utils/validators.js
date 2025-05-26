

export function isRequired(value) {
  return value ? null : 'This field is required.';
}

export function isEmail(value) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(value) ? null : 'Invalid email address.';
}

export function minLength(length) {
  return function (value) {
    return value.length >= length ? null : `Must be at least ${length} characters.`;
  };
}
export const isPhone = (value) => {
  const phoneRegex = /^\d{10}$/;
  return phoneRegex.test(value) ? null : 'Invalid phone number';
};
export const composeValidators =
  (...validators) =>
    (value) => {
      for (let validator of validators) {
        const error = validator(value);
        if (error) return error;
      }
      return null;
    };