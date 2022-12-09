import { useState, useMemo, useCallback } from 'react';
import { EditorState, RichUtils } from 'draft-js';
import { BlockType } from '../const';

export type EditorApi = {
  state: EditorState;
  onChange: (state: EditorState) => void;
  toggleBlockType: (blockType: BlockType) => void;
}

export function useEditor(html?: string): EditorApi {
  const [state, setState] = useState(() => EditorState.createEmpty());
  const toggleBlockType = useCallback((blockType: BlockType) => {
    setState((currentState) => RichUtils.toggleBlockType(currentState, blockType));
  }, []);

  return useMemo(() => ({
    state,
    onChange: setState,
    toggleBlockType,
  }), [state, toggleBlockType]);
}
