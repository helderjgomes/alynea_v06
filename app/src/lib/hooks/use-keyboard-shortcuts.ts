'use client';

import * as React from 'react';

interface KeyboardShortcut {
    key: string;
    ctrlKey?: boolean;
    metaKey?: boolean;
    shiftKey?: boolean;
    altKey?: boolean;
    action: () => void;
    description?: string;
}

interface UseKeyboardShortcutsOptions {
    enabled?: boolean;
}

export function useKeyboardShortcuts(
    shortcuts: KeyboardShortcut[],
    options: UseKeyboardShortcutsOptions = {}
) {
    const { enabled = true } = options;

    React.useEffect(() => {
        if (!enabled) return;

        const handleKeyDown = (event: KeyboardEvent) => {
            // Ignore if user is typing in an input/textarea
            const target = event.target as HTMLElement;
            if (
                target.tagName === 'INPUT' ||
                target.tagName === 'TEXTAREA' ||
                target.isContentEditable
            ) {
                // Allow Escape in inputs
                if (event.key !== 'Escape') return;
            }

            for (const shortcut of shortcuts) {
                const keyMatch = event.key.toLowerCase() === shortcut.key.toLowerCase();
                const ctrlMatch = shortcut.ctrlKey ? event.ctrlKey : !event.ctrlKey;
                const metaMatch = shortcut.metaKey ? event.metaKey : !event.metaKey;
                const shiftMatch = shortcut.shiftKey ? event.shiftKey : !event.shiftKey;
                const altMatch = shortcut.altKey ? event.altKey : !event.altKey;

                // Support Cmd on Mac, Ctrl on Windows
                const cmdOrCtrl = shortcut.metaKey || shortcut.ctrlKey;
                const cmdOrCtrlMatch = cmdOrCtrl
                    ? event.metaKey || event.ctrlKey
                    : !event.metaKey && !event.ctrlKey;

                if (keyMatch && (cmdOrCtrl ? cmdOrCtrlMatch : ctrlMatch && metaMatch) && shiftMatch && altMatch) {
                    event.preventDefault();
                    shortcut.action();
                    break;
                }
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [shortcuts, enabled]);
}

// Predefined shortcut helpers
export const SHORTCUTS = {
    newTask: (action: () => void): KeyboardShortcut => ({
        key: 'n',
        metaKey: true,
        action,
        description: 'New Task',
    }),
    escape: (action: () => void): KeyboardShortcut => ({
        key: 'Escape',
        action,
        description: 'Close / Cancel',
    }),
    save: (action: () => void): KeyboardShortcut => ({
        key: 'Enter',
        metaKey: true,
        action,
        description: 'Save',
    }),
    search: (action: () => void): KeyboardShortcut => ({
        key: 'k',
        metaKey: true,
        action,
        description: 'Search',
    }),
};
