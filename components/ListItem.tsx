import * as React from 'react';
import { User } from '../interfaces';
import Link from '../components/Link';

type Props = {
  data: User
};

const ListItem: React.FunctionComponent<Props> = ({ data }) => (
  <Link pageName="detail" params={{ id: data.id.toString() }}>
    <a>
      {data.id}: {data.name}
    </a>
  </Link>
);

export default ListItem;
