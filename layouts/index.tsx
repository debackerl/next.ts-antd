import * as React from 'react';
import { MdxLayout } from 'next-mdx-enhanced';
import Layout from '../components/Layout';
import { Link } from '../routing';

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
