import '@testing-library/jest-dom';
import { vi } from 'vitest';

// Mock de l'environnement
vi.mock('import.meta.env', () => ({
  VITE_API_URL: 'http://api-test-url'
}));

// Nettoyage global
beforeEach(() => {
  vi.clearAllMocks();
  localStorage.clear();
});