import React from 'react';
import styled from '@emotion/styled';
import { Head, Props as HeadProps } from '@/components/Head';

const Wrapper = styled.div`
  margin: 1rem;
`;

export const Layout: React.FC<HeadProps> = ({ title, description, children }) => (
  <>
    <Head title={title} description={description} />
    <Wrapper>{children}</Wrapper>
  </>
);
