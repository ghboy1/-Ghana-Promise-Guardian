// __tests__/authService.test.js
/**
 * Auth Service Smoke Tests
 * Basic tests to verify AuthService functionality
 */

describe('AuthService Smoke Test', () => {
  it('should import auth service without errors', () => {
    // Just verify the file can be imported
    const authService = require('../src/services/auth').default;
    expect(authService).toBeDefined();
  });

  it('should have required methods', () => {
    const authService = require('../src/services/auth').default;
    expect(typeof authService.loginAnonymously).toBe('function');
    expect(typeof authService.createDemoUser).toBe('function');
  });

  it('should create demo user with correct structure', () => {
    const authService = require('../src/services/auth').default;
    const demoUser = authService.createDemoUser();
    
    expect(demoUser).toHaveProperty('uid');
    expect(demoUser.isDemo).toBe(true);
  });
});

