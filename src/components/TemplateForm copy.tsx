// import { useState, useEffect } from 'react';
// import { useNavigate, useParams } from 'react-router-dom';
// import { CKEditor } from '@ckeditor/ckeditor5-react';
// import ClassicEditor from '@ckeditor/ckeditor5-build-classic';




// interface Template {
//     id: number; 
//     name: string;
//     description: string;
//     content: string;
//     createddate: string;
//     updateddate: string; 
// }

// const TemplateForm: React.FC = () => {
//     const { id } = useParams<{ id: string }>();
//     const navigate = useNavigate();
//     const [template, setTemplate] = useState<Partial<Template>>({
//         name: '',
//         description: '',
//         content: '',
//     });
//     const [loading, setLoading] = useState(false);
//     const [error, setError] = useState<string | null>(null);

//     useEffect(() => {
//         if (id) {
//             fetchTemplate();
//         }
//     }, [id]);

//     const fetchTemplate = async () => {
//         try {
//             setLoading(true);
//             const response = await fetch(`http://localhost:3001/api/templates/${id}`);
//             if (!response.ok) throw new Error('Failed to fetch template');
//             const data = await response.json();
//             setTemplate(data);
//         } catch (err) {
//             setError('Error fetching template');
//         } finally {
//             setLoading(false);
//         }
//     };

//     const handleSubmit = async (e: React.MouseEvent) => {
//         e.preventDefault();
//         try {
//             setLoading(true);
//             const method = id ? 'PUT' : 'POST';
//             const url = id
//                 ? `http://localhost:3001/api/templates/${id}`
//                 : 'http://localhost:3001/api/templates';

//             const response = await fetch(url, {
//                 method,
//                 headers: {
//                     'Content-Type': 'application/json',
//                 },
//                 body: JSON.stringify({
//                     name: template.name,
//                     description: template.description,
//                     content: template.content,
//                 }),
//             });

//             if (!response.ok) throw new Error('Failed to save template');
//             navigate('/');
//         } catch (err) {
//             setError('Error saving template');
//         } finally {
//             setLoading(false);
//         }
//     };

//     if (loading) {
//         return <div className="container mx-auto p-6 text-center">Loading...</div>;
//     }

//     return (
//         <div className="container mx-auto p-4 max-w-4xl">
//             <h1 className="text-2xl font-bold mb-4">{id ? 'Edit Template' : 'Create Template'}</h1>
//             {error && (
//                 <div className="mb-4 p-4 bg-red-100 text-red-700 rounded-lg">{error}</div>
//             )}
//             <div className="bg-white shadow rounded-lg p-6">
//                 <div className="mb-6">
//                     <label className="block text-gray-700 mb-2" htmlFor="name">
//                         Name
//                     </label>
//                     <input
//                         type="text"
//                         id="name"
//                         value={template.name || ''}
//                         onChange={(e) => setTemplate({ ...template, name: e.target.value })}
//                         className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
//                         required
//                     />
//                 </div>
//                 <div className="mb-6">
//                     <label className="block text-gray-700 mb-2" htmlFor="description">
//                         Description
//                     </label>
//                     <textarea
//                         id="description"
//                         value={template.description || ''}
//                         onChange={(e) => setTemplate({ ...template, description: e.target.value })}
//                         className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
//                         rows={4}
//                     />
//                 </div>
//                 <div className="mb-6">
//           <label className="block text-gray-700 mb-2">Content</label>
//           <div className="border rounded-lg">
//             <CKEditor
//               editor={ClassicEditor as any}
//               data={template.content || ''}
//               onChange={(_event, editor) => {
//                 const data = editor.getData();
//                 setTemplate({ ...template, content: data });
//               }}
//             />


//           </div>
//         </div>

//                 <div className="flex justify-end gap-3">
//                     <button
//                         onClick={() => navigate('/')}
//                         className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600 transition-colors"
//                     >
//                         Cancel
//                     </button>
//                     <button
//                         onClick={handleSubmit}
//                         disabled={loading}
//                         className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors disabled:bg-blue-300"
//                     >
//                         {loading ? 'Saving...' : 'Save'}
//                     </button>
//                 </div>
//             </div>
//         </div>
//     );
// };

// export default TemplateForm;



import React, { useEffect, useState, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { CKEditor } from '@ckeditor/ckeditor5-react';
import * as ClassicEditorBuild from '@ckeditor/ckeditor5-build-classic';

interface Template {
  id: number;
  name: string;
  description: string;
  content: string;
  createddate: string;
  updateddate: string;
}

const TemplateForm: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const suggestionBoxRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const [template, setTemplate] = useState<Partial<Template>>({
    name: '',
    description: '',
    content: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const editorRef = useRef<any>(null);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [cursorPos, setCursorPos] = useState<{ top: number; left: number } | null>(null);

  const autocompleteOptions = ['name', 'email', 'phone'];

  const fetchTemplate = async () => {
    try {
      setLoading(true);
      const response = await fetch(`http://localhost:3001/api/templates/${id}`);
      if (!response.ok) throw new Error('Failed to fetch template');
      const data = await response.json();
      setTemplate(data);
    } catch {
      setError('Error fetching template');
    } finally {
      setLoading(false);
    }
  };

  

  useEffect(() => {
    if (id) fetchTemplate();
  }, [id]);

  const handleEditorReady = (editor: any) => {
    editorRef.current = editor;

    editor.editing.view.document.on('keydown', () => {
      const model = editor.model;
      const position = model.document.selection.getFirstPosition();
      const range = model.createRange(
        model.createPositionAt(position.parent, 0),
        position
      );

      let text = '';
      for (const item of range.getItems()) {
        if (item.is('$text')) text += item.data;
      }

      const match = text.match(/\{(\w*)$/);
      if (match) {
        const keyword = match[1];
        const filtered = autocompleteOptions.filter(opt =>
          opt.toLowerCase().startsWith(keyword.toLowerCase())
        );

        if (filtered.length > 0) {
          const domSelection = window.getSelection();
          const domRange = domSelection?.getRangeAt(0);
          const rect = domRange?.getBoundingClientRect();

          if (rect) {
            setCursorPos({ top: rect.bottom + window.scrollY, left: rect.left + window.scrollX });
            setSuggestions(filtered);
            setShowSuggestions(true);
          }
          return;
        }
      }

      setShowSuggestions(false);
    });
  };

  const handleEditorChange = (_event: any, editor: any) => {
      const data = editor.getData();
      const rawText = data.replace(/<[^>]*>/g, "")
      if(suggestionBoxRef.current){
          if (rawText[rawText.length - 1] === "{"){
              suggestionBoxRef.current.style.display = "flex"
            }
        else {
            suggestionBoxRef.current.style.display = "None"}
        }
    setTemplate((prev) => ({ ...prev, content: data }));
  };

  const handleSuggestionClick = (value: string) => {
    const editor = editorRef.current;
    if (!editor) return;

    const model = editor.model;
    const position = model.document.selection.getFirstPosition();

    model.change((writer: any) => {
      const range = model.createRange(
        model.createPositionAt(position.parent, 0),
        position
      );

      let text = '';
      for (const item of range.getItems()) {
        if (item.is('$text')) text += item.data;
      }

      const match = text.match(/\{(\w*)$/);
      if (match) {
        const startOffset = text.length - match[0].length;
        const keywordStart = model.createPositionAt(position.parent, startOffset);
        const keywordEnd = position;

        const rangeToReplace = model.createRange(keywordStart, keywordEnd);
        writer.remove(rangeToReplace);
      }

      writer.insertText(`${value}}`, editor.model.document.selection.getFirstPosition());
    });

    setShowSuggestions(false);
  };

  const handleSubmit = async (e: React.MouseEvent) => {
    e.preventDefault();
    try {
      setLoading(true);
      const method = id ? 'PUT' : 'POST';
      const url = id
        ? `http://localhost:3001/api/templates/${id}`
        : 'http://localhost:3001/api/templates';

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: template.name,
          description: template.description,
          content: template.content,
        }),
      });

      if (!response.ok) throw new Error('Failed to save template');
      navigate('/');
    } catch {
      setError('Error saving template');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="container mx-auto p-6 text-center">Loading...</div>;

  return (
    <div className="container mx-auto p-4 max-w-4xl">
      <h1 className="text-2xl font-bold mb-4">{id ? 'Edit Template' : 'Create Template'}</h1>
      {error && <div className="mb-4 p-4 bg-red-100 text-red-700 rounded-lg">{error}</div>}

      <div className="bg-white shadow rounded-lg p-6">
        <div className="mb-6">
          <label className="block text-gray-700 mb-2">Name</label>
          <input
            type="text"
            value={template.name || ''}
            onChange={(e) => setTemplate({ ...template, name: e.target.value })}
            className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
            required
          />
        </div>

        <div className="mb-6">
          <label className="block text-gray-700 mb-2">Description</label>
          <textarea
            value={template.description || ''}
            onChange={(e) => setTemplate({ ...template, description: e.target.value })}
            className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
            rows={4}
          />
        </div>

        <div className="mb-6 relative">
          <label className="block text-gray-700 mb-2">Content</label>
          <div className="border rounded-lg relative">
            <CKEditor
              editor={(ClassicEditorBuild as any).default || ClassicEditorBuild}
              data={template.content || ''}
              onReady={handleEditorReady}
              onChange={handleEditorChange}
            />
            <div className='hidden items-center gap-1 absolute flex-col top-0 left-0 bg-white' ref={suggestionBoxRef}>
                {autocompleteOptions.map((item)=>{
                    return <span  className= ' cursor-pointer hover:bg-blue-200' onClick={()=>handleSuggestionClick(item)}> {item}</span>
                })}
            </div>
          </div>

          {showSuggestions && cursorPos && (
            <ul
              className="absolute bg-white border border-gray-300 rounded shadow p-2 z-50"
              style={{ top: cursorPos.top + 5, left: cursorPos.left }}
            >
              {suggestions.map((option) => (
                <li
                  key={option}
                  className="cursor-pointer hover:bg-blue-100 px-2 py-1 rounded"
                  onClick={() => handleSuggestionClick(option)}
                >
                  {option}
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="flex justify-end gap-3">
          <button
            onClick={() => navigate('/')}
            className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={loading}
            className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors disabled:bg-blue-300"
          >
            {loading ? 'Saving...' : 'Save'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default TemplateForm;

