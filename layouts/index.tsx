import * as React from 'react';
import Link from 'next/link';
import Layout from '../components/Layout';
import { MdxLayout } from 'next-mdx-enhanced';

const DefaultLayout: MdxLayout = (frontMatter): React.FunctionComponent => (({ children }) => (
  <Layout title={frontMatter.title}>
    <h1>{frontMatter.title}</h1>
    {children}
    <p>
      <Link href="/">
        <a>Go home</a>
      </Link>
    </p>
  </Layout>
));

export default DefaultLayout;
