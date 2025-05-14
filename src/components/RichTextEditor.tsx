


import { useState, useEffect } from 'react';
import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import { convert } from 'html-to-text';

interface RichTextEditorProps {
  content: string;
  onChange: (content: string, plainContent: string) => void;
  validationError?: string;
}

const RichTextEditor: React.FC<RichTextEditorProps> = ({ content, onChange, validationError }) => {
  const [editorInstance, setEditorInstance] = useState<any>(null);
  const [editorContent, setEditorContent] = useState(content || '');

  useEffect(() => {
    if (editorInstance && content !== editorContent) {
      editorInstance.setData(content);
      setEditorContent(content);
    }
  }, [content, editorInstance]);

  const setupAutocomplete = (editor: any) => {
    setEditorInstance(editor);

    editor.editing.view.document.on('keydown', (evt: any, data: any) => {
      if (data.keyCode === 219 && data.shiftKey) {
        evt.stop();
        data.preventDefault();

        editor.model.change((writer: any) => {
          editor.model.insertContent(writer.createText('{'));
        });

        showAutocompleteDropdown(editor);
      }
    });
  };

  const showAutocompleteDropdown = (editor: any) => {
    const dropdown = document.createElement('div');
    dropdown.className = 'autocomplete-dropdown';
    dropdown.style.position = 'absolute';
    dropdown.style.zIndex = '1000';
    dropdown.style.backgroundColor = 'white';
    dropdown.style.border = '1px solid #ccc';
    dropdown.style.borderRadius = '4px';
    dropdown.style.boxShadow = '0 2px 5px rgba(0,0,0,0.15)';
    dropdown.style.width = '150px';

    const options = ['name', 'email', 'phone', 'webinar_title', 'webinar_date', 'webinar_time'];
    options.forEach(option => {
      const item = document.createElement('div');
      item.className = 'autocomplete-item';
      item.textContent = option;
      item.style.padding = '8px 12px';
      item.style.cursor = 'pointer';
      item.style.transition = 'background-color 0.2s';

      item.addEventListener('mouseover', () => {
        item.style.backgroundColor = '#f0f0f0';
      });
      item.addEventListener('mouseout', () => {
        item.style.backgroundColor = 'transparent';
      });

      item.addEventListener('click', () => {
        insertVariable(editor, option);
        document.body.removeChild(dropdown);
      });

      dropdown.appendChild(item);
    });

    const domSelection = editor.editing.view.domConverter.viewRangeToDom(
      editor.editing.view.document.selection.getFirstRange()
    );
    const rect = domSelection.getBoundingClientRect();

    dropdown.style.top = `${window.scrollY + rect.bottom + 5}px`;
    dropdown.style.left = `${window.scrollX + rect.left}px`;

    document.body.appendChild(dropdown);

    const handleClickOutside = (e: MouseEvent) => {
      if (!dropdown.contains(e.target as Node)) {
        if (document.body.contains(dropdown)) {
          document.body.removeChild(dropdown);
        }
        document.removeEventListener('click', handleClickOutside);
      }
    };

    setTimeout(() => {
      document.addEventListener('click', handleClickOutside);
    }, 100);
  };

  const insertVariable = (editor: any, variable: string) => {
    editor.model.change((writer: any) => {
      const lastPosition = editor.model.document.selection.getLastPosition();
      const rangeToRemove = writer.createRange(
        writer.createPositionAt(lastPosition.parent, lastPosition.offset - 1),
        lastPosition
      );
      writer.remove(rangeToRemove);

      editor.model.insertContent(writer.createText(`{${variable}}`));
    });
  };

  const getEditorConfig = () => {
    return {
      toolbar: {
        items: [
          'heading',
          '|',
          'bold',
          'italic',
          'underline',
          'strikethrough',
          '|',
          'fontColor',
          'fontBackgroundColor',
          '|',
          'bulletedList',
          'numberedList',
          '|',
          'link',
          'blockQuote',
          'insertTable',
          '|',
          'undo',
          'redo'
        ]
      },
      table: {
        contentToolbar: ['tableColumn', 'tableRow', 'mergeTableCells']
      }
    };
  };

  return (
    <div className="mb-6">
      <label className="block text-gray-700 mb-2">Content</label>
      <div className={`border rounded-lg ${validationError ? 'border-red-500' : ''}`}>
        <CKEditor
          editor={ClassicEditor as any}
          data={content || ''}
          config={getEditorConfig()}
          onChange={(_event, editor) => {
            const data = editor.getData();
            setEditorContent(data);
            
            const plainContent = convert(data, { 
              wordwrap: false, 
              preserveNewlines: true,
              selectors: [
                { selector: 'a', options: { ignoreHref: true } },
                { selector: 'img', format: 'skip' }
              ]
            }).trim();
            
            onChange(data, plainContent);
          }}
          onReady={(editor) => {
            setupAutocomplete(editor);
            setEditorInstance(editor);
            console.log('CKEditor initialized with formatting support');
          }}
        />
      </div>
      {validationError && (
        <p className="mt-1 text-red-500 text-sm">{validationError}</p>
      )}
    </div>
  );
};

export default RichTextEditor;