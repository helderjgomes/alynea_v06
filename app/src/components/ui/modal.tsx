'use client';

import * as React from 'react';
import * as DialogPrimitive from '@radix-ui/react-dialog';
import { X } from 'lucide-react';
import { cn } from '@/lib/utils';

const Modal = DialogPrimitive.Root;
const ModalTrigger = DialogPrimitive.Trigger;
const ModalPortal = DialogPrimitive.Portal;
const ModalClose = DialogPrimitive.Close;

const ModalOverlay = React.forwardRef<
    React.ElementRef<typeof DialogPrimitive.Overlay>,
    React.ComponentPropsWithoutRef<typeof DialogPrimitive.Overlay>
>(({ className, ...props }, ref) => (
    <DialogPrimitive.Overlay
        ref={ref}
        className={cn(
            'fixed inset-0 z-50 bg-black/20 backdrop-blur-sm',
            'data-[state=open]:animate-in data-[state=closed]:animate-out',
            'data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0',
            className
        )}
        {...props}
    />
));
ModalOverlay.displayName = DialogPrimitive.Overlay.displayName;

const ModalContent = React.forwardRef<
    React.ElementRef<typeof DialogPrimitive.Content>,
    React.ComponentPropsWithoutRef<typeof DialogPrimitive.Content> & {
        size?: 'sm' | 'md' | 'lg' | 'xl';
    }
>(({ className, children, size = 'lg', ...props }, ref) => (
    <ModalPortal>
        <ModalOverlay />
        <DialogPrimitive.Content
            ref={ref}
            className={cn(
                'fixed left-[50%] top-[50%] z-50 translate-x-[-50%] translate-y-[-50%]',
                'bg-white rounded-2xl overflow-hidden',
                'shadow-[0_20px_60px_-15px_rgba(0,0,0,0.25),0_0_1px_rgba(0,0,0,0.1)]',
                'data-[state=open]:animate-in data-[state=closed]:animate-out',
                'data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0',
                'data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95',
                'data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%]',
                'data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%]',
                'duration-200',
                {
                    'w-full max-w-md': size === 'sm',
                    'w-full max-w-lg': size === 'md',
                    'w-full max-w-2xl': size === 'lg',
                    'w-full max-w-4xl': size === 'xl',
                },
                className
            )}
            {...props}
        >
            {children}
        </DialogPrimitive.Content>
    </ModalPortal>
));
ModalContent.displayName = DialogPrimitive.Content.displayName;

const ModalHeader = ({
    className,
    ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
    <div
        className={cn(
            'flex items-center justify-between px-4 py-3 border-b border-black/[0.06]',
            className
        )}
        {...props}
    />
);
ModalHeader.displayName = 'ModalHeader';

const ModalFooter = ({
    className,
    ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
    <div
        className={cn(
            'flex items-center justify-end gap-2 px-4 py-3 border-t border-black/[0.06] bg-[#FAFAF9]',
            className
        )}
        {...props}
    />
);
ModalFooter.displayName = 'ModalFooter';

const ModalTitle = React.forwardRef<
    React.ElementRef<typeof DialogPrimitive.Title>,
    React.ComponentPropsWithoutRef<typeof DialogPrimitive.Title>
>(({ className, ...props }, ref) => (
    <DialogPrimitive.Title
        ref={ref}
        className={cn('text-[15px] font-medium text-[#1D1D1F]', className)}
        {...props}
    />
));
ModalTitle.displayName = DialogPrimitive.Title.displayName;

const ModalDescription = React.forwardRef<
    React.ElementRef<typeof DialogPrimitive.Description>,
    React.ComponentPropsWithoutRef<typeof DialogPrimitive.Description>
>(({ className, ...props }, ref) => (
    <DialogPrimitive.Description
        ref={ref}
        className={cn('text-[13px] text-[#86868B]', className)}
        {...props}
    />
));
ModalDescription.displayName = DialogPrimitive.Description.displayName;

const ModalCloseButton = ({ className }: { className?: string }) => (
    <DialogPrimitive.Close
        className={cn(
            'w-6 h-6 rounded-md hover:bg-black/[0.06] flex items-center justify-center transition-colors',
            className
        )}
    >
        <X size={16} strokeWidth={2} className="text-[#86868B]" />
        <span className="sr-only">Close</span>
    </DialogPrimitive.Close>
);

export {
    Modal,
    ModalPortal,
    ModalOverlay,
    ModalTrigger,
    ModalClose,
    ModalContent,
    ModalHeader,
    ModalFooter,
    ModalTitle,
    ModalDescription,
    ModalCloseButton,
};
