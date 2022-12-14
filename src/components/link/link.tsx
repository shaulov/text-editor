import { ReactNode } from 'react';
import { ContentState } from 'draft-js';
import { useEditorApi } from '../../hooks/use-editor-context';

type LinkProps = {
  children: ReactNode;
  contentState: ContentState;
  entityKey: string;
}

function Link ({children, contentState, entityKey}: LinkProps): JSX.Element {
  const { setEntityData } = useEditorApi();
  const entity = contentState.getEntity(entityKey);
  const { url } = entity.getData<ReturnType<string>>();

  const onLinkClick = () => {
    /* eslint-disable no-alert*/
    const newUrl = prompt('URL:', url);
    /* eslint-enable no-alert */
    if (newUrl) {
      setEntityData(entityKey, { url: newUrl });
    }
  };

  return (
    <a
      href={url}
      onClick={onLinkClick}
    >
      {children}
    </a>
  );
}

export default Link;
