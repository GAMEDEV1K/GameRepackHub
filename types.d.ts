// Type declarations for modules without type definitions
declare module 'next/server' {
  import { NextRequest } from 'next';
  export class NextResponse {
    static json(body: any, init?: ResponseInit): NextResponse;
    static next(init?: ResponseInit): NextResponse;
    static redirect(url: string, init?: ResponseInit): NextResponse;
  }
}

// Ensure JSX types are available
declare namespace JSX {
  interface IntrinsicElements {
    [elemName: string]: any;
  }
}

// React types
declare module 'react' {
  export type FC<P = {}> = React.FunctionComponent<P>;
  export type ReactNode = React.ReactNode;
  export function useState<T>(initialState: T | (() => T)): [T, (newState: T | ((prevState: T) => T)) => void];
  export function useEffect(effect: () => void | (() => void), deps?: readonly any[]): void;
}

// Lucide React types
declare module 'lucide-react' {
  import React from 'react';
  
  export const Search: React.FC<React.SVGProps<SVGSVGElement>>;
  export const Download: React.FC<React.SVGProps<SVGSVGElement>>;
  export const Heart: React.FC<React.SVGProps<SVGSVGElement>>;
  export const User: React.FC<React.SVGProps<SVGSVGElement>>;
  export const Settings: React.FC<React.SVGProps<SVGSVGElement>>;
  export const LogOut: React.FC<React.SVGProps<SVGSVGElement>>;
  export const Mail: React.FC<React.SVGProps<SVGSVGElement>>;
  export const MessageSquare: React.FC<React.SVGProps<SVGSVGElement>>;
  export const Send: React.FC<React.SVGProps<SVGSVGElement>>;
  export const HelpCircle: React.FC<React.SVGProps<SVGSVGElement>>;
  export const ChevronDown: React.FC<React.SVGProps<SVGSVGElement>>;
  export const Clock: React.FC<React.SVGProps<SVGSVGElement>>;
  export const Calendar: React.FC<React.SVGProps<SVGSVGElement>>;
  export const ArrowUpRight: React.FC<React.SVGProps<SVGSVGElement>>;
  export const Trophy: React.FC<React.SVGProps<SVGSVGElement>>;
  export const Star: React.FC<React.SVGProps<SVGSVGElement>>;
  export const Filter: React.FC<React.SVGProps<SVGSVGElement>>;
  export const SortDesc: React.FC<React.SVGProps<SVGSVGElement>>;
  export const ArrowRight: React.FC<React.SVGProps<SVGSVGElement>>;
  export const HardDrive: React.FC<React.SVGProps<SVGSVGElement>>;
  export const Monitor: React.FC<React.SVGProps<SVGSVGElement>>;
  export const Cpu: React.FC<React.SVGProps<SVGSVGElement>>;
}

// Next.js link types
declare module 'next/link' {
  import React from 'react';
  
  export interface LinkProps extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
    href: string;
    as?: string;
    replace?: boolean;
    scroll?: boolean;
    shallow?: boolean;
    passHref?: boolean;
    prefetch?: boolean;
    children?: React.ReactNode;
    className?: string;
    legacyBehavior?: boolean;
    key?: number | string;
  }
  
  const Link: React.FC<LinkProps>;
  export default Link;
}

// Next.js image types
declare module 'next/image' {
  import React from 'react';
  
  export interface ImageProps {
    src: string;
    alt: string;
    width?: number;
    height?: number;
    fill?: boolean;
    quality?: number;
    priority?: boolean;
    loading?: 'lazy' | 'eager';
    className?: string;
  }
  
  const Image: React.FC<ImageProps>;
  export default Image;
}
