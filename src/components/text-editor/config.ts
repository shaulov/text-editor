import Immutable from 'immutable';
import { DefaultDraftBlockRenderMap } from 'draft-js';
import { BlockType, InlineStyles } from '../../const';

const CUSTOM_BLOCK_RENDER_MAP = Immutable.Map({
  [BlockType.cite]: {
    element: 'cite',
  },
});

export const BLOCK_RENDER_MAP = DefaultDraftBlockRenderMap.merge(CUSTOM_BLOCK_RENDER_MAP);

export const CUSTOM_STYLE_MAP = {
  [InlineStyles.ACCENT]: {
    backgroundColor: '#F7F6F3',
    color: '#A41E68',
  },
};
