'use client';

import * as React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';

interface AnimatedListProps {
    children: React.ReactNode;
    className?: string;
}

export function AnimatedList({ children, className }: AnimatedListProps) {
    return (
        <div className={cn('space-y-1', className)}>
            <AnimatePresence initial={false}>
                {children}
            </AnimatePresence>
        </div>
    );
}

interface AnimatedListItemProps {
    children: React.ReactNode;
    className?: string;
    layoutId?: string;
}

export function AnimatedListItem({ children, className, layoutId }: AnimatedListItemProps) {
    return (
        <motion.div
            layout
            layoutId={layoutId}
            initial={{ opacity: 0, height: 0, y: -10 }}
            animate={{ opacity: 1, height: 'auto', y: 0 }}
            exit={{ opacity: 0, height: 0, y: -10 }}
            transition={{
                opacity: { duration: 0.2 },
                height: { duration: 0.2 },
                y: { duration: 0.2 },
                layout: { duration: 0.2 },
            }}
            className={className}
        >
            {children}
        </motion.div>
    );
}
