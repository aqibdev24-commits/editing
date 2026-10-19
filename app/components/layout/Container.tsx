import type { ReactNode, ElementType, HTMLAttributes } from 'react';

type ContainerSize = 'sm' | 'md' | 'lg' | 'xl' | 'full';

interface ContainerProps extends HTMLAttributes<HTMLElement> {
  children: ReactNode;
  size?: ContainerSize;
  as?: ElementType;
  className?: string;
  padded?: boolean;
}

const SIZE_MAP: Record<ContainerSize, string> = {
  sm: 'max-w-3xl',
  md: 'max-w-5xl',
  lg: 'max-w-7xl',
  xl: 'max-w-[1400px]',
  full: 'max-w-full',
};

export default function Container({
  children,
  size = 'lg',
  as: Component = 'div',
  className = '',
  padded = true,
  ...rest
}: ContainerProps) {
  const paddingClasses = padded ? 'px-4 sm:px-6 lg:px-8' : '';

  return (
    <Component
      className={`mx-auto w-full ${SIZE_MAP[size]} ${paddingClasses} ${className}`}
      {...rest}
    >
      {children}
    </Component>
  );
}