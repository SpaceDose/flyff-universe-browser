import {type FC, useEffect, useState} from 'react';
import Markdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import {SettingsPage} from './settings-page';

export const Changelog: FC = () => {
  const [changelog, setChangelog] = useState<string[]>([]);

  useEffect(() => {
    import('../../../../changelog.md?raw').then(
      ({default: changelogString}) => {
        setChangelog(changelogString.split(/^---$/m));
      },
    );
  }, []);

  return (
    <SettingsPage
      title='Changelog'
      description='Take a look through the latest changes of the app.'
      options={changelog.map((changes, index) => (
        // biome-ignore lint/suspicious/noArrayIndexKey: static list, never reordered
        <div key={index} className='prose prose-neutral prose-invert'>
          <Markdown remarkPlugins={[remarkGfm]}>{changes}</Markdown>
        </div>
      ))}
    />
  );
};
