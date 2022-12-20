import { convertToHTML, convertFromHTML } from 'draft-convert';
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

export const HTMLtoState = convertFromHTML<DOMStringMap, BlockType>({
  htmlToStyle: (nodeName, node, currentStyle) => {
    if (nodeName === 'strong') {
      return currentStyle.add(InlineStyles.BOLD);
    }

    if (nodeName === 'em') {
      return currentStyle.add(InlineStyles.ITALIC);
    }

    if (nodeName === 'span' && node.classList.contains('underline')) {
      return currentStyle.add(InlineStyles.UNDERLINE);
    }

    if (nodeName === 'span' && node.classList.contains('accent')) {
      return currentStyle.add(InlineStyles.ACCENT);
    }

    return currentStyle;
  },
  /* eslint-disable*/
  /** Типизация пакета не предусматривает параметр last, но он есть */
  // @ts-ignore
  htmlToBlock(nodeName, node, last) {
    switch (nodeName) {
      case 'h1':
        return BlockType.h1;
      case 'h2':
        return BlockType.h2;
      case 'h3':
        return BlockType.h3;
      case 'h4':
        return BlockType.h4;
      case 'li':
        if (last === 'ol') {
          return BlockType.orderList;
        }
        return BlockType.list;
      case 'blockquote':
        return BlockType.blockquote;
      case 'cite':
        return BlockType.cite;
      case 'div':
      case 'p':
        return BlockType.default;
      default:
        return null;
    }
  },
  htmlToEntity: (nodeName, node, createEntity) => {
    if (nodeName === 'a' && node.href) {
      return createEntity(EntityType.link, 'MUTABLE', { url: node.href });
    }

    return undefined;
  },
});
