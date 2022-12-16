import { Editor } from 'draft-js';
import cn from 'classnames';
import { useEditorApi } from '../../hooks/use-editor-context';
import { BLOCK_RENDER_MAP, CUSTOM_STYLE_MAP } from './config';
import './text-editor.scss';

type TextEditorProps = {
  className?: string;
}

function TextEditor({ className }: TextEditorProps): JSX.Element{
  const editorApi = useEditorApi();

  return (
    <div className={cn('text-editor', className)}>
      <Editor
        placeholder='Введите Ваш текст'
        editorState={editorApi.state}
        onChange={editorApi.onChange}
        blockRenderMap={BLOCK_RENDER_MAP}
        customStyleMap={CUSTOM_STYLE_MAP}
        handleKeyCommand={editorApi.handleKeyCommand}
        keyBindingFn={editorApi.handleKeyBinding}
      />
    </div>
  );
}

export default TextEditor;
