import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Input } from '@/components/ui/input';

describe('Input component', () => {
    it('renders with default variant', () => {
        render(<Input placeholder="Enter text" />);
        const input = screen.getByPlaceholderText('Enter text');
        expect(input).toBeInTheDocument();
        expect(input).toHaveClass('border');
    });

    it('applies ghost variant correctly', () => {
        render(<Input variant="ghost" placeholder="Ghost" />);
        const input = screen.getByPlaceholderText('Ghost');
        // ghost variant uses border-none
        expect(input).toHaveClass('border-none');
    });

    it('applies title variant correctly', () => {
        render(<Input variant="title" placeholder="Title" />);
        const input = screen.getByPlaceholderText('Title');
        // title variant uses text-[20px]
        expect(input).toHaveClass('text-[20px]');
        expect(input).toHaveClass('font-medium');
    });

    it('handles user input', async () => {
        const user = userEvent.setup();
        render(<Input placeholder="Type here" />);
        const input = screen.getByPlaceholderText('Type here');

        await user.type(input, 'Hello World');
        expect(input).toHaveValue('Hello World');
    });

    it('can be disabled', () => {
        render(<Input disabled placeholder="Disabled" />);
        expect(screen.getByPlaceholderText('Disabled')).toBeDisabled();
    });

    it('accepts type prop', () => {
        render(<Input type="password" placeholder="Password" />);
        expect(screen.getByPlaceholderText('Password')).toHaveAttribute('type', 'password');
    });
});
