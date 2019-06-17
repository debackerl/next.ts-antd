import * as React from 'react';
import { Card } from 'antd';
import { User } from '../interfaces';

type ListDetailProps = {
  item: User
};

const ListDetail: React.FunctionComponent<ListDetailProps> = ({
  item: user,
}) => (
  <Card title={user.name}>
    <p>ID: {user.id}</p>
  </Card>
);

export default ListDetail;
