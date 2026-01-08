'use client';

import * as React from 'react';
import { LucideIcon } from 'lucide-react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';

interface EmptyStateProps {
    icon: LucideIcon;
    title: string;
    description: string;
    actionLabel?: string;
    onAction?: () => void;
}

export function EmptyState({
    icon: Icon,
    title,
    description,
    actionLabel,
    onAction,
}: EmptyStateProps) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, ease: 'easeOut' }}
            className="flex flex-col items-center justify-center py-20 px-4 text-center"
        >
            <div className="w-16 h-16 rounded-2xl bg-black/[0.03] flex items-center justify-center mb-6">
                <Icon size={32} strokeWidth={1.5} className="text-[#C7C7CC]" />
            </div>
            <h3 className="text-[17px] font-semibold text-[#1D1D1F] mb-2">
                {title}
            </h3>
            <p className="text-[14px] text-[#86868B] max-w-[280px] mb-8 leading-relaxed">
                {description}
            </p>
            {actionLabel && onAction && (
                <Button variant="secondary" onClick={onAction} className="bg-black font-semibold text-white hover:bg-black/80 rounded-full px-6">
                    {actionLabel}
                </Button>
            )}
        </motion.div>
    );
}
