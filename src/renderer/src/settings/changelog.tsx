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
      options={changelog.map((changes, index) => (
        <Markdown
          key={index}
          remarkPlugins={[remarkGfm]}
          className='prose prose-neutral prose-invert'
        >
          {changes}
        </Markdown>
      ))}
    />
  );
};
