import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Badge } from '@/components/ui/badge';

describe('Badge component', () => {
    it('renders children correctly', () => {
        render(<Badge>Status</Badge>);
        expect(screen.getByText('Status')).toBeInTheDocument();
    });

    it('applies default variant', () => {
        render(<Badge>Default</Badge>);
        const badge = screen.getByText('Default');
        expect(badge).toHaveClass('bg-[#007AFF]/10');
    });

    it('applies success variant', () => {
        render(<Badge variant="success">Success</Badge>);
        const badge = screen.getByText('Success');
        expect(badge).toHaveClass('bg-[#34C759]/10');
    });

    it('applies warning variant', () => {
        render(<Badge variant="warning">Warning</Badge>);
        const badge = screen.getByText('Warning');
        expect(badge).toHaveClass('bg-[#F6BD16]/10');
    });

    it('applies destructive variant', () => {
        render(<Badge variant="destructive">Error</Badge>);
        const badge = screen.getByText('Error');
        expect(badge).toHaveClass('bg-[#FF3B30]/10');
    });

    it('applies size classes', () => {
        const { rerender } = render(<Badge size="sm">Small</Badge>);
        // sm has px-2 py-0.5 text-[11px]
        expect(screen.getByText('Small')).toHaveClass('px-2');

        rerender(<Badge size="md">Medium</Badge>);
        // md has px-2.5 py-0.5 text-[12px]
        expect(screen.getByText('Medium')).toHaveClass('px-2.5');
    });
});
