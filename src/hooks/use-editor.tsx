import { useState, useMemo, useCallback } from 'react';
import { EditorState, RichUtils } from 'draft-js';
import { BlockType, InlineStyles } from '../const';

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

  const toggleInlineStyles = useCallback((inlineStyle: InlineStyles) => {
    setState((currentState) => RichUtils.toggleInlineStyle(currentState, inlineStyle));
  }, []);

  const hasInlineStyle = useCallback((inlineStyle: InlineStyles) => {
    const currentStyle = state.getCurrentInlineStyle();
    return currentStyle.has(inlineStyle);
  }, [state]);

  return useMemo(() => ({
    state,
    onChange: setState,
    toggleBlockType,
    currentBlockType,
    toggleInlineStyles,
    hasInlineStyle,
  }), [state, toggleBlockType, currentBlockType, toggleInlineStyles, hasInlineStyle]);
}
