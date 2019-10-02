import * as React from 'react';
import Link from '../utils/Link';
import { User } from '../interfaces';
import { Router } from '../routes';

type Props = {
  data: User
};

const ListItem: React.FunctionComponent<Props> = ({ data }) => (
  <Link route={Router.getPrettyUrl('detail', { id: data.id })}>
    <a>
      {data.id}: {data.name}
    </a>
  </Link>
);

export default ListItem;
