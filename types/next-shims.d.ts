declare module 'next/link' {
  import type { AnchorHTMLAttributes, ReactNode } from 'react';

  export type LinkProps = AnchorHTMLAttributes<HTMLAnchorElement> & {
    href: string;
    children?: ReactNode;
  };

  export default function Link(props: LinkProps): JSX.Element;
}

declare module 'next/navigation' {
  export function redirect(path: string): never;
  export function notFound(): never;
  export function usePathname(): string;
}

declare module 'next/server' {
  export class NextResponse {
    static json(body: unknown, init?: { status?: number }): Response;
  }
}

declare module 'openai' {
  export default class OpenAI {
    constructor(config: { apiKey?: string });
    responses: {
      create(input: { model: string; input: string }): Promise<{ output_text?: string }>;
    };
  }
}

declare module 'firebase-admin/app' {
  export function cert(value: unknown): unknown;
  export function getApps(): unknown[];
  export function getApp(): unknown;
  export function initializeApp(config?: unknown): unknown;
}

declare module 'firebase-admin/firestore' {
  export function getFirestore(app?: unknown): unknown;
}
