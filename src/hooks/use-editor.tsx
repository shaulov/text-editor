import { useState, useMemo, useCallback, KeyboardEvent } from 'react';
import { EditorState, RichUtils, CompositeDecorator, DraftEntityMutability, DraftHandleValue, KeyBindingUtil, getDefaultKeyBinding } from 'draft-js';
import LinkDecorator from '../components/link';
import { BlockType, InlineStyles, EntityType, Keys } from '../const';
import { KeyCommand } from '../types';

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
  handleKeyCommand: (command: KeyCommand, editorState: EditorState) => DraftHandleValue;
  handleKeyBinding: (evt: KeyboardEvent) => KeyCommand | null;
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

  const handleKeyCommand = useCallback((command: KeyCommand, editorState: EditorState) => {
    if (command === 'accent') {
      toggleInlineStyle(InlineStyles.ACCENT);
      return 'handled';
    }

    const newState = RichUtils.handleKeyCommand(editorState, command);

    if (newState) {
      setState(newState);
      return 'handled';
    }

    return 'not-handled';
  }, [toggleInlineStyle]);

  const handleKeyBinding = useCallback((evt: KeyboardEvent) => {
    if (evt.key === Keys.u && KeyBindingUtil.hasCommandModifier(evt)) {
      return 'accent';
    }

    return getDefaultKeyBinding(evt);
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
    handleKeyBinding,
  }), [state, toggleBlockType, currentBlockType, toggleInlineStyle, hasInlineStyle, addLink, setEntityData, handleKeyCommand, handleKeyBinding]);
}
