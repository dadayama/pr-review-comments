import NextDocument, { Html, Head, Main, NextScript, DocumentContext } from 'next/document';
import { Global, css } from '@emotion/react';

class Document extends NextDocument {
  static async getInitialProps(ctx: DocumentContext) {
    const initialProps = await NextDocument.getInitialProps(ctx);
    return { ...initialProps };
  }

  render() {
    return (
      <Html lang="ja">
        <Head />
        <body>
          <Main />
          <NextScript />
        </body>
        <Global
          styles={css`
            * {
              font-size: 14px;
              font-family: sans-serif;
            }
          `}
        />
      </Html>
    );
  }
}

export default Document;
