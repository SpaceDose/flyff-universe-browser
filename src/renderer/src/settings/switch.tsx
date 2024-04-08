import {type FC} from 'react';

type SwitchProps = {
  label: string;
  description: string;
  defaultChecked: boolean;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
};

export const Switch: FC<SwitchProps> = ({
  label,
  description,
  defaultChecked,
  onChange,
}) => (
  <label className='flex cursor-pointer justify-between gap-6'>
    <div>
      <p className='select-none'>{label}</p>
      <p className='select-none text-sm text-white/50'>{description}</p>
    </div>
    <input
      type='checkbox'
      className='hidden peer'
      defaultChecked={defaultChecked}
      onChange={onChange}
    />
    <div className="relative shrink-0 w-11 h-6 rounded-full peer dark:bg-gray-light peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue" />
  </label>
);
