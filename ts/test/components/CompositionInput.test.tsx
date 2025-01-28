import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import { CompositionInput } from '../../components/CompositionInput';

describe('CompositionInput Unicode handling', () => {
  it('should activate Unicode input mode on Ctrl+Shift+U', () => {
    const { container } = render(<CompositionInput />);
    const input = container.querySelector('div[contenteditable]');
    if (input) {
      fireEvent.keyDown(input, { key: 'u', ctrlKey: true, shiftKey: true });
      expect(container.textContent).toContain('Unicode: u');
    }
  });

  it('should handle valid Unicode input', () => {
    const { container } = render(<CompositionInput />);
    const input = container.querySelector('div[contenteditable]');
    if (input) {
      fireEvent.keyDown(input, { key: 'u', ctrlKey: true, shiftKey: true });
      fireEvent.keyDown(input, { key: '2' });
      fireEvent.keyDown(input, { key: '6' });
      fireEvent.keyDown(input, { key: '6' });
      fireEvent.keyDown(input, { key: '5' });
      fireEvent.keyDown(input, { key: 'Enter' });
      expect(container.textContent).not.toContain('Unicode: u2665');
      expect(container.textContent).toContain('♥');
    }
  });

  it('should handle Escape key to cancel Unicode input', () => {
    const { container } = render(<CompositionInput />);
    const input = container.querySelector('div[contenteditable]');
    if (input) {
      fireEvent.keyDown(input, { key: 'u', ctrlKey: true, shiftKey: true });
      fireEvent.keyDown(input, { key: '2' });
      fireEvent.keyDown(input, { key: 'Escape' });
      expect(container.textContent).not.toContain('Unicode: u2');
    }
  });

  it('should handle invalid Unicode input', () => {
    const { container } = render(<CompositionInput />);
    const input = container.querySelector('div[contenteditable]');
    if (input) {
      fireEvent.keyDown(input, { key: 'u', ctrlKey: true, shiftKey: true });
      fireEvent.keyDown(input, { key: 'G' });
      fireEvent.keyDown(input, { key: 'Enter' });
      expect(container.textContent).not.toContain('Unicode: uG');
      expect(container.textContent).not.toContain('�');
    }
  });

  it('should handle Unicode input between emoji and text', () => {
    const { container } = render(<CompositionInput />);
    const input = container.querySelector('div[contenteditable]');
    if (input) {
      input.textContent = '😊';
      fireEvent.keyDown(input, { key: 'u', ctrlKey: true, shiftKey: true });
      fireEvent.keyDown(input, { key: '2' });
      fireEvent.keyDown(input, { key: '6' });
      fireEvent.keyDown(input, { key: '6' });
      fireEvent.keyDown(input, { key: '5' });
      fireEvent.keyDown(input, { key: 'Enter' });
      input.textContent += 'text';
      expect(container.textContent).toBe('😊♥text');
    }
  });

  it('should handle multiple Unicode inputs', () => {
    const { container } = render(<CompositionInput />);
    const input = container.querySelector('div[contenteditable]');
    if (input) {
      fireEvent.keyDown(input, { key: 'u', ctrlKey: true, shiftKey: true });
      fireEvent.keyDown(input, { key: '2' });
      fireEvent.keyDown(input, { key: '6' });
      fireEvent.keyDown(input, { key: '6' });
      fireEvent.keyDown(input, { key: '5' });
      fireEvent.keyDown(input, { key: 'Enter' });
      fireEvent.keyDown(input, { key: 'u', ctrlKey: true, shiftKey: true });
      fireEvent.keyDown(input, { key: '2' });
      fireEvent.keyDown(input, { key: '6' });
      fireEvent.keyDown(input, { key: '6' });
      fireEvent.keyDown(input, { key: '4' });
      fireEvent.keyDown(input, { key: 'Enter' });
      expect(container.textContent).toBe('♥♦');
    }
  });
});
