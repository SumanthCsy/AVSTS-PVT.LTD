import React, { useRef } from 'react';
import { Bold, Italic, Underline, List, AlignLeft, AlignCenter, AlignRight } from 'lucide-react';

interface RichEditorProps {
  value: string;
  onChange: (val: string) => void;
  placeholder?: string;
  minHeight?: string;
}

const RichEditor: React.FC<RichEditorProps> = ({ value, onChange, placeholder = 'Write here...', minHeight = '200px' }) => {
  const editorRef = useRef<HTMLDivElement>(null);

  const exec = (cmd: string, val?: string) => {
    document.execCommand(cmd, false, val);
    if (editorRef.current) onChange(editorRef.current.innerHTML);
    editorRef.current?.focus();
  };

  const btnStyle = (active = false): React.CSSProperties => ({
    border: 'none',
    background: active ? 'rgba(0,86,179,0.12)' : 'transparent',
    color: active ? 'var(--primary-color)' : 'var(--text-muted)',
    padding: '6px 10px',
    borderRadius: '6px',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    transition: 'all 0.15s ease',
  });

  return (
    <div style={{ border: '1.5px solid #e2e8f0', borderRadius: '12px', overflow: 'hidden', background: '#fff' }}>
      {/* Toolbar */}
      <div style={{ display: 'flex', gap: '4px', padding: '10px 12px', borderBottom: '1px solid #f1f5f9', background: '#f8fafc', flexWrap: 'wrap' }}>
        <button type="button" style={btnStyle()} onClick={() => exec('bold')} title="Bold">
          <Bold size={16} />
        </button>
        <button type="button" style={btnStyle()} onClick={() => exec('italic')} title="Italic">
          <Italic size={16} />
        </button>
        <button type="button" style={btnStyle()} onClick={() => exec('underline')} title="Underline">
          <Underline size={16} />
        </button>

        <div style={{ width: '1px', background: '#e2e8f0', margin: '0 6px' }} />

        <button type="button" style={btnStyle()} onClick={() => exec('insertUnorderedList')} title="Bullet List">
          <List size={16} />
        </button>
        <button type="button" style={btnStyle()} onClick={() => exec('insertOrderedList')} title="Numbered List">
          <span style={{ fontSize: '13px', fontWeight: 600 }}>1.</span>
        </button>

        <div style={{ width: '1px', background: '#e2e8f0', margin: '0 6px' }} />

        <button type="button" style={btnStyle()} onClick={() => exec('justifyLeft')} title="Align Left">
          <AlignLeft size={16} />
        </button>
        <button type="button" style={btnStyle()} onClick={() => exec('justifyCenter')} title="Align Center">
          <AlignCenter size={16} />
        </button>
        <button type="button" style={btnStyle()} onClick={() => exec('justifyRight')} title="Align Right">
          <AlignRight size={16} />
        </button>

        <div style={{ width: '1px', background: '#e2e8f0', margin: '0 6px' }} />

        <select
          onChange={e => exec('formatBlock', e.target.value)}
          style={{ border: 'none', background: 'transparent', fontSize: '0.8rem', color: 'var(--text-muted)', cursor: 'pointer' }}
        >
          <option value="p">Paragraph</option>
          <option value="h2">Heading 1</option>
          <option value="h3">Heading 2</option>
          <option value="h4">Heading 3</option>
        </select>

        <select
          onChange={e => exec('fontSize', e.target.value)}
          style={{ border: 'none', background: 'transparent', fontSize: '0.8rem', color: 'var(--text-muted)', cursor: 'pointer' }}
        >
          <option value="3">Normal</option>
          <option value="4">Large</option>
          <option value="5">X-Large</option>
          <option value="2">Small</option>
        </select>
      </div>

      {/* Editable Area */}
      <div
        ref={editorRef}
        contentEditable
        suppressContentEditableWarning
        onInput={e => onChange((e.target as HTMLDivElement).innerHTML)}
        onBlur={e => onChange((e.target as HTMLDivElement).innerHTML)}
        data-placeholder={placeholder}
        style={{
          minHeight,
          padding: '16px',
          outline: 'none',
          fontSize: '0.95rem',
          lineHeight: '1.7',
          color: 'var(--text-main)',
        }}
        dangerouslySetInnerHTML={{ __html: value }}
      />
    </div>
  );
};

export default RichEditor;
