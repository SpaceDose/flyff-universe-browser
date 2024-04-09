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
      className='peer hidden'
      defaultChecked={defaultChecked}
      onChange={onChange}
    />
    <div className="peer relative h-6 w-11 shrink-0 rounded-full after:absolute after:start-[2px] after:top-[2px] after:size-5 after:rounded-full after:border after:bg-white after:transition-all after:content-[''] peer-checked:bg-blue peer-checked:after:translate-x-full peer-checked:after:border-white rtl:peer-checked:after:-translate-x-full dark:bg-gray-light" />
  </label>
);
