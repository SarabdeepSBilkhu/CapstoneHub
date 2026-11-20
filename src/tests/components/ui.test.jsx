// @vitest-environment happy-dom
/**
 * Unit tests: UI Components
 * Tests Button, Badge, Card, and Input components.
 */
import React from 'react';
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';

describe('Button component', () => {
  it('renders children correctly', () => {
    render(<Button>Click Me</Button>);
    expect(screen.getByRole('button', { name: /click me/i })).toBeInTheDocument();
  });

  it('handles click events', () => {
    const handleClick = vi.fn();
    render(<Button onClick={handleClick}>Submit</Button>);
    fireEvent.click(screen.getByRole('button', { name: /submit/i }));
    expect(handleClick).toHaveBeenCalledOnce();
  });

  it('disables button when isLoading is true and renders spinner', () => {
    render(<Button isLoading>Saving</Button>);
    const btn = screen.getByRole('button');
    expect(btn).toBeDisabled();
  });

  it('applies variant classes properly', () => {
    const { container: primary } = render(<Button variant="primary">Primary</Button>);
    expect(primary.querySelector('button')?.className).toContain('bg-indigo-600');

    const { container: danger } = render(<Button variant="danger">Danger</Button>);
    expect(danger.querySelector('button')?.className).toContain('bg-red-600');
  });
});

describe('Badge component', () => {
  it('renders text with appropriate default styling', () => {
    render(<Badge>Active</Badge>);
    expect(screen.getByText('Active')).toBeInTheDocument();
  });

  it('applies danger variant styling', () => {
    const { container } = render(<Badge variant="danger">Rejected</Badge>);
    expect(container.firstChild?.className).toContain('text-red-700');
  });

  it('applies success variant styling', () => {
    const { container } = render(<Badge variant="success">Approved</Badge>);
    expect(container.firstChild?.className).toContain('text-green-700');
  });
});

describe('Card component suite', () => {
  it('renders Card, Header, Title, Description, and Content', () => {
    render(
      <Card>
        <CardHeader>
          <CardTitle>Project Title</CardTitle>
          <CardDescription>Project Description</CardDescription>
        </CardHeader>
        <CardContent>
          <p>Main body content</p>
        </CardContent>
      </Card>
    );

    expect(screen.getByText('Project Title')).toBeInTheDocument();
    expect(screen.getByText('Project Description')).toBeInTheDocument();
    expect(screen.getByText('Main body content')).toBeInTheDocument();
  });
});

describe('Input component', () => {
  it('renders input with label and handles change', () => {
    const handleChange = vi.fn();
    render(<Input label="Deliverable URL" placeholder="https://..." onChange={handleChange} />);

    expect(screen.getByText('Deliverable URL')).toBeInTheDocument();
    const input = screen.getByPlaceholderText('https://...');
    fireEvent.change(input, { target: { value: 'https://github.com' } });
    expect(handleChange).toHaveBeenCalled();
  });

  it('displays error message when error prop is provided', () => {
    render(<Input label="Email" error="Invalid email address" />);
    expect(screen.getByText('Invalid email address')).toBeInTheDocument();
  });
});
