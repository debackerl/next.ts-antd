import * as React from 'react'
import Link from 'next/link'
import Layout from '../components/Layout'
import { NextPage } from 'next'
import { style } from 'typestyle';

const className = style({ color: 'red' });

type RedTextProps = {
  text: string
}

const RedText: React.FunctionComponent<RedTextProps> = ({ text }) => <div className={className}>{text}</div>;

const IndexPage: NextPage = () => {
  return (
    <Layout title="Home | Next.js + TypeScript Example">
      <h1><RedText text="Hello Next.js 👋" /></h1>
      <p>
        <Link href="/about">
          <a>About</a>
        </Link>
      </p>
    </Layout>
  )
}

export default IndexPage
