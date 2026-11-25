import type {FC} from 'react';
import {Link, useLocation} from 'react-router';
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
        'bg-gray hover:bg-gray-light flex w-32 rounded-sm px-2 py-1 select-none',
        pathname.endsWith(to) && 'bg-blue hover:bg-blue cursor-default',
      )}
    >
      {label}
    </Link>
  );
};
