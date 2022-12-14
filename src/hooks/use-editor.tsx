import { useState, useMemo, useCallback } from 'react';
import { EditorState, RichUtils, CompositeDecorator } from 'draft-js';
import { BlockType, InlineStyles } from '../const';
import LinkDecorator from '../components/link';

const decorator = new CompositeDecorator([LinkDecorator]);

export type EditorApi = {
  state: EditorState;
  onChange: (state: EditorState) => void;
  toggleBlockType: (blockType: BlockType) => void;
  currentBlockType: BlockType;
  toggleInlineStyle: (inlineStyle: InlineStyles) => void;
  hasInlineStyle: (inlineStyle: InlineStyles) => boolean;
}

export function useEditor(html?: string): EditorApi {
  const [state, setState] = useState(() => EditorState.createEmpty(decorator));
  const toggleBlockType = useCallback((blockType: BlockType) => {
    setState((currentState) => RichUtils.toggleBlockType(currentState, blockType));
  }, []);
  const currentBlockType = useMemo(() => {
    const selection = state.getSelection();
    const content = state.getCurrentContent();
    const block = content.getBlockForKey(selection.getStartKey());

    return block.getType() as BlockType;
  }, [state]);

  const toggleInlineStyle = useCallback((inlineStyle: InlineStyles) => {
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
    toggleInlineStyle,
    hasInlineStyle,
  }), [state, toggleBlockType, currentBlockType, toggleInlineStyle, hasInlineStyle]);
}
