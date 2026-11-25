import type {FC} from 'react';

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
      <p className='text-sm text-white/50 select-none'>{description}</p>
    </div>
    <input
      type='checkbox'
      className='peer hidden'
      defaultChecked={defaultChecked}
      onChange={onChange}
    />
    <div className="peer peer-checked:bg-blue dark:bg-gray-light relative h-6 w-11 shrink-0 rounded-full after:absolute after:inset-s-[2px] after:top-[2px] after:size-5 after:rounded-full after:border after:bg-white after:transition-all after:content-[''] peer-checked:after:translate-x-full peer-checked:after:border-white peer-checked:rtl:after:-translate-x-full" />
  </label>
);
