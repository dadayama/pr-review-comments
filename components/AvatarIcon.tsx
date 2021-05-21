import React from 'react';
import Image from 'next/image';
import styled from '@emotion/styled';

type Props = {
  src: string;
  alt: string;
};

const StyledImage = styled(Image)`
  border: 10px solid #000;
`;

export const AvatarIcon: React.FC<Props> = ({ src, alt }) => <StyledImage src={src} alt={alt} width={30} height={30} />;
