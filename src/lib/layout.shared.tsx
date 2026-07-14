import Image from 'next/image';
import type { BaseLayoutProps } from 'fumadocs-ui/layouts/shared';
import { gitConfig } from './shared';
import { AuthControls } from '@/components/auth/auth-controls';

export function baseOptions(): BaseLayoutProps {
  return {
    nav: {
      title: (
        <>
          <Image
            src="/hermes-icon.png"
            alt="Hermes Agent"
            width={24}
            height={24}
            className="dark:invert"
            priority
          />
          <Image
            src="/logo.png"
            alt="David Tung"
            width={104}
            height={26}
            style={{ height: 'auto' }}
            className="dark:invert"
            priority
          />
        </>
      ),
      children: <AuthControls />,
    },
    githubUrl: `https://github.com/${gitConfig.user}/${gitConfig.repo}`,
  };
}