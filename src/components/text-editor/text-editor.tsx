import { Editor } from 'draft-js';
import cn from 'classnames';
import { useEditorApi } from '../../hooks/use-editor-context';
import './text-editor.scss';

type TextEditorProps = {
  className?: string;
}

function TextEditor({ className }: TextEditorProps): JSX.Element{
  const { state, onChange } = useEditorApi();

  return (
    <div className={cn('text-editor', className)}>
      <Editor
        placeholder='Введите Ваш текст'
        editorState={state}
        onChange={onChange}
      />
    </div>
  );
}

export default TextEditor;
