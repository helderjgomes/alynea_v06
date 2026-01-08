import { describe, it, expect } from 'vitest';
import { cn, formatDate, formatTime, isToday, generateId } from '@/lib/utils';

describe('cn utility', () => {
    it('merges class names', () => {
        expect(cn('foo', 'bar')).toBe('foo bar');
    });

    it('removes duplicate tailwind classes', () => {
        expect(cn('px-2', 'px-4')).toBe('px-4');
    });

    it('handles conditional classes', () => {
        expect(cn('base', true && 'active', false && 'hidden')).toBe('base active');
    });

    it('handles undefined and null', () => {
        expect(cn('base', undefined, null, 'end')).toBe('base end');
    });
});

describe('formatDate utility', () => {
    it('formats date correctly', () => {
        const date = new Date('2026-01-08');
        const result = formatDate(date);
        expect(result).toContain('Jan');
        expect(result).toContain('8');
    });

    it('handles string dates', () => {
        const result = formatDate('2026-01-08');
        expect(result).toBeDefined();
    });
});

describe('formatTime utility', () => {
    it('formats time correctly', () => {
        const date = new Date('2026-01-08T14:30:00');
        const result = formatTime(date);
        expect(result).toMatch(/\d{1,2}:\d{2}/);
    });
});

describe('isToday utility', () => {
    it('returns true for today', () => {
        const today = new Date();
        expect(isToday(today)).toBe(true);
    });

    it('returns false for yesterday', () => {
        const yesterday = new Date(Date.now() - 86400000);
        expect(isToday(yesterday)).toBe(false);
    });

    it('returns false for tomorrow', () => {
        const tomorrow = new Date(Date.now() + 86400000);
        expect(isToday(tomorrow)).toBe(false);
    });
});

describe('generateId utility', () => {
    it('generates a valid UUID', () => {
        const id = generateId();
        expect(id).toMatch(/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i);
    });

    it('generates unique IDs', () => {
        const id1 = generateId();
        const id2 = generateId();
        expect(id1).not.toBe(id2);
    });
});
