import { TextEditorProvider } from '../../hooks/use-editor-context';
import ToolPanel from '../tool-panel';
import TextEditor from '../text-editor';

function App(): JSX.Element {
  return (
    <TextEditorProvider>
      <ToolPanel />
      <TextEditor />
    </TextEditorProvider>
  );
}

export default App;
