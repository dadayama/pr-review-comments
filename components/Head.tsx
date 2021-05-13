import NextHead from 'next/head';
import React from 'react';

const defaultDescription = 'GitHubのPRレビューコメントを一覧化して閲覧できるサービス';
const baseTitle = 'PR Review Comments';

export type Props = {
  title?: string;
  description?: string;
};

export const Head: React.FC<Props> = ({ title, description }) => (
  <NextHead>
    <title>{title ? `${baseTitle} - ${title}` : baseTitle}</title>
    <link rel="icon" href="/favicon.ico" />
    <meta name="viewport" content="initial-scale=1.0, width=device-width" />
    <meta name="description" content={description || defaultDescription} />
  </NextHead>
);
