import { useState, useMemo } from 'react';
import { EditorState } from 'draft-js';

export type EditorApi = {
  state: EditorState;
  onChange: (state: EditorState) => void;
}

export function useEditor(): EditorApi {
  const [state, setstate] = useState(() => EditorState.createEmpty());

  return useMemo(() => ({
    state,
    onChange: setstate,
  }), [state]);
}
