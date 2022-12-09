import { useState, useMemo, useCallback } from 'react';
import { EditorState, RichUtils } from 'draft-js';
import { BlockType } from '../const';

export type EditorApi = {
  state: EditorState;
  onChange: (state: EditorState) => void;
  toggleBlockType: (blockType: BlockType) => void;
  currentBlockType: BlockType;
}

export function useEditor(html?: string): EditorApi {
  const [state, setState] = useState(() => EditorState.createEmpty());
  const toggleBlockType = useCallback((blockType: BlockType) => {
    setState((currentState) => RichUtils.toggleBlockType(currentState, blockType));
  }, []);
  const currentBlockType = useMemo(() => {
    const selection = state.getSelection();
    const content = state.getCurrentContent();
    const block = content.getBlockForKey(selection.getStartKey());

    return block.getType() as BlockType;
  }, [state]);

  return useMemo(() => ({
    state,
    onChange: setState,
    toggleBlockType,
    currentBlockType,
  }), [state, toggleBlockType, currentBlockType]);
}
