import { useTranslation } from 'react-i18next';

export default function translate<P = {}>(component: React.FunctionComponent<P>) {
  const res = useTranslation();
  return (props: P) => component({ ...res, ...props });
}
