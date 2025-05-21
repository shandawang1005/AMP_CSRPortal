import { useState } from 'react';

export default function useValidator(value, validators = []) {
  const [error, setError] = useState(null);

  function validate() {
    for (const validator of validators) {
      const validationError = validator(value);
      if (validationError) {
        setError(validationError);
        return false;
      }
    }
    setError(null);
    return true;
  }

  return { error, validate, setError };
}
