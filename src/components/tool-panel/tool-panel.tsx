import { MouseEvent } from 'react';
import cn from 'classnames';
import { useEditorApi } from '../../hooks/use-editor-context';
import { BlockType, INLINE_STYLE_CODES } from '../../const';
import './tool-panel.scss';

type ToolPanelProps = {
  className?: string;
}

function ToolPanel({ className }: ToolPanelProps): JSX.Element {
  const { toggleBlockType, currentBlockType, toggleInlineStyle, hasInlineStyle, addLink, toHtml } = useEditorApi();
  const onAddLinkClickHandle = () => {
    /* eslint-disable no-alert */
    const url = prompt('URL:');
    /* eslint-enable no-alert */

    if (url) {
      addLink(url);
    }
  };

  return (
    <div className={cn('tool-panel', className)}>
      <button
        className={cn(
          'tool-panel__item',
          currentBlockType === BlockType.h1 && 'tool-panel__item_active'
        )}
        onMouseDown={(evt) => {
          evt.preventDefault();
          toggleBlockType(BlockType.h1);
        }}
      >
        Заголовок
      </button>
      <button
        className={cn(
          'tool-panel__item',
          currentBlockType === BlockType.h2 && 'tool-panel__item_active'
        )}
        onMouseDown={(evt) => {
          evt.preventDefault();
          toggleBlockType(BlockType.h2);
        }}
      >
        Подзаголовок
      </button>
      <button
        className={cn(
          'tool-panel__item',
          currentBlockType === BlockType.cite && 'tool-panel__item_active'
        )}
        onMouseDown={(evt) => {
          evt.preventDefault();
          toggleBlockType(BlockType.cite);
        }}
      >
        Сноска
      </button>
      <button
        className={cn(
          'tool-panel__item',
          currentBlockType === BlockType.default && 'tool-panel__item_active'
        )}
        onMouseDown={(evt) => {
          evt.preventDefault();
          toggleBlockType(BlockType.default);
        }}
      >
        Простой
      </button>

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

      <button
        className={cn('tool-panel__item')}
        onClick={onAddLinkClickHandle}
      >
        Link
      </button>

      <button
        className={cn('tool-panel__item')}
        onClick={() => {
          /* eslint-disable-next-line */
          console.log(toHtml());
        }}
      >
        Print
      </button>
    </div>
  );
}

export default ToolPanel;
