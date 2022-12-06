// import { EditorApi } from '../../hooks/use-editor';
import cn from 'classnames';
import './tool-panel.scss';

type ToolPanelProps = {
  className?: string;
}

function ToolPanel({ className }: ToolPanelProps): JSX.Element {
  return (
    <div className={cn('tool-panel', className)}></div>
  );
}

export default ToolPanel;
