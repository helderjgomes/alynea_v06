import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Button } from '@/components/ui/button';

describe('Button component', () => {
    it('renders children correctly', () => {
        render(<Button>Click me</Button>);
        expect(screen.getByRole('button')).toHaveTextContent('Click me');
    });

    it('applies primary variant by default', () => {
        render(<Button>Primary</Button>);
        const button = screen.getByRole('button');
        expect(button).toHaveClass('bg-[#007AFF]');
    });

    it('applies secondary variant correctly', () => {
        render(<Button variant="secondary">Secondary</Button>);
        const button = screen.getByRole('button');
        // actual class is bg-[#F5F5F4]
        expect(button).toHaveClass('bg-[#F5F5F4]');
    });

    it('applies ghost variant correctly', () => {
        render(<Button variant="ghost">Ghost</Button>);
        const button = screen.getByRole('button');
        expect(button).toHaveClass('hover:bg-black/[0.04]');
    });

    it('applies different sizes', () => {
        const { rerender } = render(<Button size="sm">Small</Button>);
        // sm = h-8 px-3 text-[13px]
        expect(screen.getByRole('button')).toHaveClass('h-8');

        rerender(<Button size="md">Medium</Button>);
        // md = h-10 px-4 text-[14px]
        expect(screen.getByRole('button')).toHaveClass('h-10');

        rerender(<Button size="lg">Large</Button>);
        // lg = h-12 px-6 text-[15px]
        expect(screen.getByRole('button')).toHaveClass('h-12');
    });

    it('handles click events', async () => {
        const user = userEvent.setup();
        let clicked = false;
        render(<Button onClick={() => { clicked = true; }}>Click</Button>);

        await user.click(screen.getByRole('button'));
        expect(clicked).toBe(true);
    });

    it('can be disabled', () => {
        render(<Button disabled>Disabled</Button>);
        expect(screen.getByRole('button')).toBeDisabled();
    });

    it('renders as different element with asChild', () => {
        render(
            <Button asChild>
                <a href="/test">Link Button</a>
            </Button>
        );
        expect(screen.getByRole('link')).toBeInTheDocument();
    });
});
