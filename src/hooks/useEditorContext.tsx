import { useContext, createContext, ReactNode } from 'react';
import { EditorApi, useEditor } from './useEditor';

const TextEditorContext = createContext<EditorApi | undefined>(undefined);

export function useEditorApi() {
  const context = useContext(TextEditorContext);
  if (context === undefined) {
    throw new Error('useEditorApi must be used within TextEditorProvider');
  }

  return context;
}

type TextEditorProviderProps = {
  children: ReactNode;
}

export function TextEditorProvider ({ children }: TextEditorProviderProps): JSX.Element {
  const editorApi = useEditor();

  return (
    <TextEditorContext.Provider value={editorApi}>
      {children}
    </TextEditorContext.Provider>
  );
}
