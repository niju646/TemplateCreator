

// //RichTextEditor.tsx
// import { useState, useEffect } from 'react';
// import { CKEditor } from '@ckeditor/ckeditor5-react';
// import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
// import { convert } from 'html-to-text';

// interface RichTextEditorProps {
//   content: string;
//   onChange: (content: string, plainContent: string) => void;
//   validationError?: string;
// }

// const RichTextEditor: React.FC<RichTextEditorProps> = ({ content, onChange, validationError }) => {
//   const [editorInstance, setEditorInstance] = useState<any>(null);
//   const [editorContent, setEditorContent] = useState(content || '');

//   useEffect(() => {
//     if (editorInstance && content !== editorContent) {
//       editorInstance.setData(content);
//       setEditorContent(content);
//     }
//   }, [content, editorInstance]);

//   const setupAutocomplete = (editor: any) => {
//     setEditorInstance(editor);

//     editor.editing.view.document.on('keydown', (evt: any, data: any) => {
//       if (data.keyCode === 219 && data.shiftKey) {
//         evt.stop();
//         data.preventDefault();

//         editor.model.change((writer: any) => {
//           editor.model.insertContent(writer.createText('{'));
//         });

//         showAutocompleteDropdown(editor);
//       }
//     });
//   };

//   const showAutocompleteDropdown = (editor: any) => {
//     const dropdown = document.createElement('div');
//     dropdown.className = 'autocomplete-dropdown';
//     dropdown.style.position = 'absolute';
//     dropdown.style.zIndex = '1000';
//     dropdown.style.backgroundColor = 'white';
//     dropdown.style.border = '1px solid #ccc';
//     dropdown.style.borderRadius = '4px';
//     dropdown.style.boxShadow = '0 2px 5px rgba(0,0,0,0.15)';
//     dropdown.style.width = '150px';

//     const options = ['name', 'email', 'phone', 'webinar_title', 'webinar_date', 'webinar_time'];
//     options.forEach(option => {
//       const item = document.createElement('div');
//       item.className = 'autocomplete-item';
//       item.textContent = option;
//       item.style.padding = '8px 12px';
//       item.style.cursor = 'pointer';
//       item.style.transition = 'background-color 0.2s';

//       item.addEventListener('mouseover', () => {
//         item.style.backgroundColor = '#f0f0f0';
//       });
//       item.addEventListener('mouseout', () => {
//         item.style.backgroundColor = 'transparent';
//       });

//       item.addEventListener('click', () => {
//         insertVariable(editor, option);
//         document.body.removeChild(dropdown);
//       });

//       dropdown.appendChild(item);
//     });

//     const domSelection = editor.editing.view.domConverter.viewRangeToDom(
//       editor.editing.view.document.selection.getFirstRange()
//     );
//     const rect = domSelection.getBoundingClientRect();

//     dropdown.style.top = `${window.scrollY + rect.bottom + 5}px`;
//     dropdown.style.left = `${window.scrollX + rect.left}px`;

//     document.body.appendChild(dropdown);

//     const handleClickOutside = (e: MouseEvent) => {
//       if (!dropdown.contains(e.target as Node)) {
//         if (document.body.contains(dropdown)) {
//           document.body.removeChild(dropdown);
//         }
//         document.removeEventListener('click', handleClickOutside);
//       }
//     };

//     setTimeout(() => {
//       document.addEventListener('click', handleClickOutside);
//     }, 100);
//   };

//   const insertVariable = (editor: any, variable: string) => {
//     editor.model.change((writer: any) => {
//       const lastPosition = editor.model.document.selection.getLastPosition();
//       const rangeToRemove = writer.createRange(
//         writer.createPositionAt(lastPosition.parent, lastPosition.offset - 1),
//         lastPosition
//       );
//       writer.remove(rangeToRemove);

//       editor.model.insertContent(writer.createText(`{${variable}}`));
//     });
//   };

//   const getEditorConfig = () => {
//     return {
//       toolbar: {
//         items: [
//           'heading',
//           '|',
//           'bold',
//           'italic',
//           'underline',
//           'strikethrough',
//           '|',
//           'fontColor',
//           'fontBackgroundColor',
//           '|',
//           'bulletedList',
//           'numberedList',
//           '|',
//           'link',
//           'blockQuote',
//           'insertTable',
//           '|',
//           'undo',
//           'redo'
//         ]
//       },
//       table: {
//         contentToolbar: ['tableColumn', 'tableRow', 'mergeTableCells']
//       }
//     };
//   };

//   return (
//     <div className="mb-6">
//       <label className="block text-gray-700 mb-2">Content</label>
//       <div className={`border rounded-lg ${validationError ? 'border-red-500' : ''}`}>
//         <CKEditor
//           editor={ClassicEditor as any}
//           data={content || ''}
//           config={getEditorConfig()}
//           onChange={(_event, editor) => {
//             const data = editor.getData();
//             setEditorContent(data);
            
//             const plainContent = convert(data, { 
//               wordwrap: false, 
//               preserveNewlines: true,
//               selectors: [
//                 { selector: 'a', options: { ignoreHref: true } },
//                 { selector: 'img', format: 'skip' }
//               ]
//             }).trim();
            
//             onChange(data, plainContent);
//           }}
//           onReady={(editor) => {
//             setupAutocomplete(editor);
//             setEditorInstance(editor);
//             console.log('CKEditor initialized with formatting support');
//           }}
//         />
//       </div>
//       {validationError && (
//         <p className="mt-1 text-red-500 text-sm">{validationError}</p>
//       )}
//     </div>
//   );
// };

// export default RichTextEditor;



import { useState, useEffect } from 'react';
import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import { convert } from 'html-to-text';


// const apiUrl = import.meta.env.BASE_URL;

// MODIFIED: Updated interface to match the actual onChange parameters
interface RichTextEditorProps {
  content: string;
  onChange: (content: string, plainContent: string, imageUrl?: string) => void; // Changed to expect imageUrl as a string
  validationError?: string;
  setImage?:React.Dispatch<React.SetStateAction<null>>
}

class MyUploadAdapter {
  loader: any;
  setImage:any;
  constructor(loader: any, setImage:any) {
    this.loader = loader;
    this.setImage = setImage;
  }

  upload() {
    return this.loader.file.then((file: File) =>
      new Promise((resolve, reject) => {
        const formData = new FormData();
        formData.append('image', file);

        fetch('http://localhost:3001/api/upload', {
          method: 'POST',
          body: formData
        })
          .then(response => {
            if (!response.ok) {
              throw new Error(`Upload failed with status ${response.status}`);
            }
            return response.json();
          })
          .then(data => {
            if (data.url) {
              this.setImage(data.url)
              resolve({ default:`${import.meta.env.VITE_API_URL}`+ data.url });
            } else {
              reject(new Error('Image upload failed: No URL returned'));
            }
          })
          .catch(error => {
            console.error('Image upload error:', error);
            reject(error);
          });
      })
    );
  }

  abort() {
    // Implement abort logic if needed
  }
}

const RichTextEditor: React.FC<RichTextEditorProps> = ({ content,setImage, onChange, validationError }) => {
  const [editorInstance, setEditorInstance] = useState<any>(null);
  const [editorContent, setEditorContent] = useState(content || '');
  const [uploadedImageUrl, setUploadedImageUrl] = useState<string | undefined>(undefined);
  const [uploadError, setUploadError] = useState<string | null>(null);

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

    editor.plugins.get('FileRepository').createUploadAdapter = (loader: any) => {
      return new MyUploadAdapter(loader, setImage);
    };
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
          'imageUpload',
          '|',
          'undo',
          'redo'
        ]
      },
      table: {
        contentToolbar: ['tableColumn', 'tableRow', 'mergeTableCells']
      },
      image: {
        toolbar: [
          'imageStyle:inline',
          'imageStyle:block',
          'imageStyle:side',
          '|',
          'imageTextAlternative'
        ]
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
            
            // MODIFIED: Pass uploadedImageUrl as the third parameter
            onChange(data, plainContent, uploadedImageUrl);
          }}
          onReady={(editor) => {
            setupAutocomplete(editor);
            setEditorInstance(editor);
            editor.plugins.get('FileRepository').on('fileUploadResponse', ( data: any) => {
              const response = data.xhr?.response ? JSON.parse(data.xhr.response) : null;
              if (response && response.url) {
                setUploadedImageUrl(response.url);
              }
            });
            editor.plugins.get('FileRepository').on('error', () => {
              setUploadError('Failed to upload image. Please try again.');
              setTimeout(() => setUploadError(null), 5000);
            });
            console.log('CKEditor initialized with formatting and image upload support');
          }}
        />
      </div>
      {validationError && (
        <p className="mt-1 text-red-500 text-sm">{validationError}</p>
      )}
      {uploadError && (
        <p className="mt-1 text-red-500 text-sm">{uploadError}</p>
      )}
    </div>
  );
};

export default RichTextEditor;






// import { useState, useEffect } from 'react';
// import { CKEditor } from '@ckeditor/ckeditor5-react';
// import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
// import { convert } from 'html-to-text';

// interface RichTextEditorProps {
//   content: string;
//   onChange: (content: string, plainContent: string, image?: string) => void;
//   validationError?: string;
// }

// class MyUploadAdapter {
//   loader: any;
//   constructor(loader: any) {
//     this.loader = loader;
//   }

//   upload() {
//     return this.loader.file.then(
//       (file: File) =>
//         new Promise((resolve, reject) => {
//           const reader = new FileReader();
//           reader.onload = () => {
//             resolve({ default: reader.result });
//           };
//           reader.onerror = (error) => reject(error);
//           reader.readAsDataURL(file);
//         })
//     );
//   }

//   abort() {
//     // Implement abort logic if needed
//   }
// }

// const RichTextEditor: React.FC<RichTextEditorProps> = ({ content, onChange, validationError }) => {
//   const [editorInstance, setEditorInstance] = useState<any>(null);
//   const [editorContent, setEditorContent] = useState(content || '');

//   useEffect(() => {
//     if (editorInstance && content !== editorContent) {
//       editorInstance.setData(content);
//       setEditorContent(content);
//     }
//   }, [content, editorInstance]);

//   const setupAutocomplete = (editor: any) => {
//     setEditorInstance(editor);

//     editor.editing.view.document.on('keydown', (evt: any, data: any) => {
//       if (data.keyCode === 219 && data.shiftKey) {
//         evt.stop();
//         data.preventDefault();

//         editor.model.change((writer: any) => {
//           editor.model.insertContent(writer.createText('{'));
//         });

//         showAutocompleteDropdown(editor);
//       }
//     });

//     editor.plugins.get('FileRepository').createUploadAdapter = (loader: any) => {
//       return new MyUploadAdapter(loader);
//     };
//   };

//   const showAutocompleteDropdown = (editor: any) => {
//     const dropdown = document.createElement('div');
//     dropdown.className = 'autocomplete-dropdown';
//     dropdown.style.position = 'absolute';
//     dropdown.style.zIndex = '1000';
//     dropdown.style.backgroundColor = 'white';
//     dropdown.style.border = '1px solid #ccc';
//     dropdown.style.borderRadius = '4px';
//     dropdown.style.boxShadow = '0 2px 5px rgba(0,0,0,0.15)';
//     dropdown.style.width = '150px';

//     const options = ['name', 'email', 'phone', 'webinar_title', 'webinar_date', 'webinar_time'];
//     options.forEach(option => {
//       const item = document.createElement('div');
//       item.className = 'autocomplete-item';
//       item.textContent = option;
//       item.style.padding = '8px 12px';
//       item.style.cursor = 'pointer';
//       item.style.transition = 'background-color 0.2s';

//       item.addEventListener('mouseover', () => {
//         item.style.backgroundColor = '#f0f0f0';
//       });
//       item.addEventListener('mouseout', () => {
//         item.style.backgroundColor = 'transparent';
//       });

//       item.addEventListener('click', () => {
//         insertVariable(editor, option);
//         document.body.removeChild(dropdown);
//       });

//       dropdown.appendChild(item);
//     });

//     const domSelection = editor.editing.view.domConverter.viewRangeToDom(
//       editor.editing.view.document.selection.getFirstRange()
//     );
//     const rect = domSelection.getBoundingClientRect();

//     dropdown.style.top = `${window.scrollY + rect.bottom + 5}px`;
//     dropdown.style.left = `${window.scrollX + rect.left}px`;

//     document.body.appendChild(dropdown);

//     const handleClickOutside = (e: MouseEvent) => {
//       if (!dropdown.contains(e.target as Node)) {
//         if (document.body.contains(dropdown)) {
//           document.body.removeChild(dropdown);
//         }
//         document.removeEventListener('click', handleClickOutside);
//       }
//     };

//     setTimeout(() => {
//       document.addEventListener('click', handleClickOutside);
//     }, 100);
//   };

//   const insertVariable = (editor: any, variable: string) => {
//     editor.model.change((writer: any) => {
//       const lastPosition = editor.model.document.selection.getLastPosition();
//       const rangeToRemove = writer.createRange(
//         writer.createPositionAt(lastPosition.parent, lastPosition.offset - 1),
//         lastPosition
//       );
//       writer.remove(rangeToRemove);

//       editor.model.insertContent(writer.createText(`{${variable}}`));
//     });
//   };

//   const getEditorConfig = () => {
//     return {
//       toolbar: {
//         items: [
//           'heading',
//           '|',
//           'bold',
//           'italic',
//           'underline',
//           'strikethrough',
//           '|',
//           'fontColor',
//           'fontBackgroundColor',
//           '|',
//           'bulletedList',
//           'numberedList',
//           '|',
//           'link',
//           'blockQuote',
//           'insertTable',
//           'imageUpload',
//           '|',
//           'undo',
//           'redo'
//         ]
//       },
//       table: {
//         contentToolbar: ['tableColumn', 'tableRow', 'mergeTableCells']
//       },
//       image: {
//         toolbar: [
//           'imageStyle:inline',
//           'imageStyle:block',
//           'imageStyle:side',
//           '|',
//           'imageTextAlternative'
//         ]
//       }
//     };
//   };

//   return (
//     <div className="mb-6">
//       <label className="block text-gray-700 mb-2">Content</label>
//       <div className={`border rounded-lg ${validationError ? 'border-red-500' : ''}`}>
//         <CKEditor
//           editor={ClassicEditor as any}
//           data={content || ''}
//           config={getEditorConfig()}
//           onChange={(_event, editor) => {
//             const data = editor.getData();
//             setEditorContent(data);
            
//             const plainContent = convert(data, { 
//               wordwrap: false, 
//               preserveNewlines: true,
//               selectors: [
//                 { selector: 'a', options: { ignoreHref: true } },
//                 { selector: 'img', format: 'skip' }
//               ]
//             }).trim();

//             // Extract the first image's base64 data from the content
//             const parser = new DOMParser();
//             const doc = parser.parseFromString(data, 'text/html');
//             const imgElement = doc.querySelector('img');
//             const imageSrc = imgElement ? imgElement.src : undefined; // Changed null to undefined

//             onChange(data, plainContent, imageSrc);
//           }}
//           onReady={(editor) => {
//             setupAutocomplete(editor);
//             setEditorInstance(editor);
//             console.log('CKEditor initialized with formatting and image upload support');
//           }}
//         />
//       </div>
//       {validationError && (
//         <p className="mt-1 text-red-500 text-sm">{validationError}</p>
//       )}
//     </div>
//   );
// };

// export default RichTextEditor;