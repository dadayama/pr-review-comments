import React from 'react';
import NextLink from 'next/link';

type Props = {
  href: string;
  blank?: boolean;
};

export const Link: React.FC<Props> = ({ href, blank, children }) => (
  <NextLink href={href}>
    {blank ? (
      <a target="_blank" rel="noopener noreferrer">
        {children}
      </a>
    ) : (
      <a>{children}</a>
    )}
  </NextLink>
);
