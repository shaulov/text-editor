import { useState, useMemo, useCallback } from 'react';
import { EditorState, RichUtils, CompositeDecorator, DraftEntityMutability, DraftEditorCommand } from 'draft-js';
import { BlockType, InlineStyles, EntityType } from '../const';
import LinkDecorator from '../components/link';

const decorator = new CompositeDecorator([LinkDecorator]);

export type EditorApi = {
  state: EditorState;
  onChange: (state: EditorState) => void;
  toggleBlockType: (blockType: BlockType) => void;
  currentBlockType: BlockType;
  toggleInlineStyle: (inlineStyle: InlineStyles) => void;
  hasInlineStyle: (inlineStyle: InlineStyles) => boolean;
  addLink: (url: string) => void;
  setEntityData: (entityKey: string, data: Record<string, string>) => void;
  handleKeyCommand: (command: DraftEditorCommand, editorState: EditorState) => string;
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

  const addEntity = useCallback((entityType: EntityType, data: Record<string, string>, mutability: DraftEntityMutability) => {
    setState((currentState) => {
      const contentState = currentState.getCurrentContent();
      const contentStateWithEntity = contentState.createEntity(entityType, mutability, data);
      const entityKey = contentStateWithEntity.getLastCreatedEntityKey();
      const newState = EditorState.set(currentState, { currentContent: contentStateWithEntity });

      return RichUtils.toggleLink(newState, newState.getSelection(), entityKey);
    });
  }, []);

  const addLink = useCallback((url: string) => {
    addEntity(EntityType.link, { url }, 'MUTABLE');
  }, [addEntity]);

  const setEntityData = useCallback((entityKey: string, data: Record<string, string>) => {
    setState((currentState) => {
      const content = currentState.getCurrentContent();
      const contentStateUpdated = content.mergeEntityData(entityKey, data);

      return EditorState.push(currentState, contentStateUpdated, 'apply-entity');
    });
  }, []);

  const handleKeyCommand = useCallback((command: DraftEditorCommand, editorState: EditorState) => {
    const newState = RichUtils.handleKeyCommand(editorState, command);

    if (newState) {
      setState(newState);
      return 'handled';
    }

    return 'not-handled';
  }, []);

  return useMemo(() => ({
    state,
    onChange: setState,
    toggleBlockType,
    currentBlockType,
    toggleInlineStyle,
    hasInlineStyle,
    addLink,
    setEntityData,
    handleKeyCommand,
  }), [state, toggleBlockType, currentBlockType, toggleInlineStyle, hasInlineStyle, addLink, setEntityData, handleKeyCommand]);
}
