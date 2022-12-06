import { TextEditorProvider } from '../../hooks/use-editor-context';
import TextEditor from '../text-editor';

function App(): JSX.Element {
  return (
    <TextEditorProvider>
      <TextEditor />
    </TextEditorProvider>
  );
}

export default App;
