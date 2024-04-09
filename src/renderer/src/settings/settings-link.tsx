import {type FC} from 'react';
import {Link, useLocation} from 'react-router-dom';
import {twMerge} from 'tailwind-merge';

type SettingsLinkProps = {
  label: string;
  to: string;
};

export const SettingsLink: FC<SettingsLinkProps> = ({label, to}) => {
  const {pathname} = useLocation();

  return (
    <Link
      to={`/settings/${to}`}
      className={twMerge(
        'flex w-48 select-none rounded bg-gray px-2 py-1 hover:bg-gray-light',
        pathname.endsWith(to) && 'cursor-default bg-blue hover:bg-blue',
      )}
    >
      {label}
    </Link>
  );
};
