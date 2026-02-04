import { emailValidation, passwordValidation } from "@/util/validation";

describe('emailValidation logic', () => {
  
  test('should return true for a valid email', () => {
    expect(emailValidation('maestro@example.com')).toBe(true);
  });

  test('should return false for email without @', () => {
    expect(emailValidation('maestroexample.com')).toBe(false);
  });

  test('should return false for email without domain', () => {
    expect(emailValidation('maestro@')).toBe(false);
  });

  test('should return false for empty string', () => {
    expect(emailValidation('')).toBe(false);
  });
    test('should return false for @.', () => {
    expect(emailValidation('@.')).toBe(false);
  });

});

describe('passwordValidation logic', () => {
  
  test('should return true for a valid password', () => {
    expect(passwordValidation('Password123456789')).toBe(true);
  });

  test('should return false for password without digits', () => {
    expect(passwordValidation('PasswordPassword')).toBe(false);
  });

  test('should return false for password without letters', () => {
    expect(passwordValidation('12345678901')).toBe(false);
  });

  test('should return false for empty string', () => {
    expect(passwordValidation('')).toBe(false);
  });
    test('should return false for special characters', () => {
    expect(passwordValidation('@·‚äö~‘‘ä·‚–·‚·')).toBe(false);
  });

});
