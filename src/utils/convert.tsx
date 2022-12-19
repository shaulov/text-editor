import { convertToHTML } from 'draft-convert';
import { CUSTOM_STYLE_MAP } from '../components/text-editor/config';
import { BlockType, EntityType, InlineStyles } from '../const';

export const stateToHTML = convertToHTML<InlineStyles, BlockType>({
  styleToHTML: (style) => {
    switch (style) {
      case InlineStyles.BOLD:
        return <strong />;
      case InlineStyles.ITALIC:
        return <em />;
      case InlineStyles.UNDERLINE:
        return (
          <span className="underline" style={{ 'textDecoration': 'underline' }} />
        );
      case InlineStyles.ACCENT:
        return (
          <span className="accent" style={CUSTOM_STYLE_MAP[InlineStyles.ACCENT]} />
        );
      default:
        return null;
    }
  },
  blockToHTML: (block) => {
    switch (block.type) {
      case BlockType.cite:
        return <cite />;
      case BlockType.h1:
        return <h1 />;
      case BlockType.h2:
        return <h2 />;
      case BlockType.h3:
        return <h3 />;
      case BlockType.h4:
        return <h4 />;
      case BlockType.h5:
        return <h5 />;
      case BlockType.h6:
        return <h6 />;
      case BlockType.orderList:
        return {
          element: <li />,
          nest: <ol />,
        };
      case BlockType.list:
        return {
          element: <li />,
          nest: <ul />,
        };
      case BlockType.blockquote:
        return <blockquote />;
      case BlockType.default:
        return <p />;
      default:
        return null;
    }
  },
  entityToHTML: (entity, originalText) => {
    if (entity.type === EntityType.link) {
      /* eslint-disable*/
      return <a href={entity.data.url}>{originalText}</a>;
      /* eslint-enable*/
    }
    return originalText;
  },
});
