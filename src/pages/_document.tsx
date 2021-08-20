import Document, { Html, Head, Main, NextScript } from 'next/document';

export default class MyDocument extends Document {
  // static async getInitialProps(ctx: DocumentContext): any {
  //   const initialProps = await Document.getInitialProps(ctx);
  //   return initialProps;
  // }

  render(): any {
    return (
      <Html>
        <Head />
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}
