import * as React from 'react';
import Image from 'next/image';
import { cn } from '@/lib/utils';

export interface AvatarProps extends React.HTMLAttributes<HTMLDivElement> {
    initials?: string;
    src?: string;
    alt?: string;
    size?: 'xs' | 'sm' | 'md' | 'lg';
    color?: string;
}

const sizeMap = {
    xs: 16,
    sm: 24,
    md: 32,
    lg: 40,
};

const Avatar = React.forwardRef<HTMLDivElement, AvatarProps>(
    ({ className, initials, src, alt, size = 'md', color, ...props }, ref) => {
        const sizeClasses = {
            xs: 'w-4 h-4 text-[9px]',
            sm: 'w-6 h-6 text-[11px]',
            md: 'w-8 h-8 text-[13px]',
            lg: 'w-10 h-10 text-[15px]',
        };

        return (
            <div
                ref={ref}
                className={cn(
                    'relative flex shrink-0 overflow-hidden rounded-full',
                    'bg-gradient-to-br from-[#007AFF] to-[#5B8FF9]',
                    'items-center justify-center text-white font-medium',
                    sizeClasses[size],
                    className
                )}
                style={color ? { background: color } : undefined}
                {...props}
            >
                {src ? (
                    <Image
                        src={src}
                        alt={alt || initials || 'Avatar'}
                        width={sizeMap[size]}
                        height={sizeMap[size]}
                        className="aspect-square h-full w-full object-cover"
                    />
                ) : (
                    <span>{initials?.slice(0, 2).toUpperCase()}</span>
                )}
            </div>
        );
    }
);

Avatar.displayName = 'Avatar';

export { Avatar };
