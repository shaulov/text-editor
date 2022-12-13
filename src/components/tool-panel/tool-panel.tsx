// import { EditorApi } from '../../hooks/use-editor';
import { MouseEvent } from 'react';
import cn from 'classnames';
import { useEditorApi } from '../../hooks/use-editor-context';
import { INLINE_STYLE_CODES } from '../../const';
import './tool-panel.scss';

type ToolPanelProps = {
  className?: string;
}

function ToolPanel({ className }: ToolPanelProps): JSX.Element {
  const { toggleInlineStyle, hasInlineStyle } = useEditorApi();
  return (
    <div className={cn('tool-panel', className)}>
      {INLINE_STYLE_CODES.map((code) => {
        const onMouseDown = (evt: MouseEvent<HTMLButtonElement>): void => {
          evt.preventDefault();
          toggleInlineStyle(code);
        };
        return (
          <button
            key={code}
            className={cn(
              'tool-panel__item',
              hasInlineStyle(code) && 'tool-panel__item_active'
            )}
            onMouseDown={onMouseDown}
          >
            {code}
          </button>
        );
      })}
    </div>
  );
}

export default ToolPanel;
