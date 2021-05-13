import React from 'react';
import { Head, Props as HeadProps } from '@/components/Head';

export const Layout: React.FC<HeadProps> = ({ title, description, children }) => (
  <>
    <Head title={title} description={description} />
    <main>{children}</main>
  </>
);
