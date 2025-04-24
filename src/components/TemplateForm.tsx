


import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import toast from 'react-hot-toast';

interface Template {
    id: number; 
    name: string;
    description: string;
    content: string;
    createddate: string;
    updateddate: string; 
}

interface ValidationErrors {
    name?: string;
    content?: string;
}

const TemplateForm: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [template, setTemplate] = useState<Partial<Template>>({
        name: '',
        description: '',
        content: '',
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [editorInstance, setEditorInstance] = useState<any>(null);
    const [validationErrors, setValidationErrors] = useState<ValidationErrors>({});

    useEffect(() => {
        if (id) {
            fetchTemplate();
        }
    }, [id]);

    const fetchTemplate = async () => {
        try {
            setLoading(true);
            const response = await fetch(`http://localhost:3001/api/templates/${id}`);
            if (!response.ok) throw new Error('Failed to fetch template');
            const data = await response.json();
            setTemplate(data);
        } catch (err) {
            setError('Error fetching template');
        } finally {
            setLoading(false);
        }
    };

    // Validate the form inputs
    const validateForm = (): boolean => {
        const errors: ValidationErrors = {};
        let isValid = true;
        
        // Check if name is empty
        if (!template.name?.trim()) {
            errors.name = 'Template name is required';
            isValid = false;
        }
        
        // Check if content is empty or just contains HTML tags with no actual content
        const contentWithoutTags = template.content?.replace(/<[^>]*>/g, '').trim();
        if (!contentWithoutTags) {
            errors.content = 'Template content is required';
            isValid = false;
            toast.error('Empty feilds');
        }
        
        setValidationErrors(errors);
        
        return isValid;
        
    };

    const handleSubmit = async (e: React.MouseEvent) => {
        e.preventDefault();
        
        // First validate the form
        if (!validateForm()) {
            return;
        }
        
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
            toast.success('Saved');
            navigate('/');
        } catch (err) {
            setError('Error saving template');
            toast.error('Saved failed');
        } finally {
            setLoading(false);
        }
    };

    // Custom autocomplete function to handle curly bracket typing
    const setupAutocomplete = (editor: any) => {
        // Save the editor instance for later use
        setEditorInstance(editor);

        // Add keyboard listener for curly brackets
        editor.editing.view.document.on('keydown', (evt: any, data: any) => {
            if (data.keyCode === 219 && data.shiftKey) { // '{' key (shift + [)
                // Prevent default behavior
                evt.stop();
                data.preventDefault();
                
                // Insert the curly bracket
                editor.model.change((writer: any) => {
                    editor.model.insertContent(writer.createText('{'));
                });
                
                // Show autocomplete dropdown
                showAutocompleteDropdown(editor);
            }
        });
    };

    // Function to show autocomplete dropdown
    const showAutocompleteDropdown = (editor: any) => {
        // Create a dropdown element
        const dropdown = document.createElement('div');
        dropdown.className = 'autocomplete-dropdown';
        dropdown.style.position = 'absolute';
        dropdown.style.zIndex = '1000';
        dropdown.style.backgroundColor = 'white';
        dropdown.style.border = '1px solid #ccc';
        dropdown.style.borderRadius = '4px';
        dropdown.style.boxShadow = '0 2px 5px rgba(0,0,0,0.15)';
        dropdown.style.width = '150px';
        
        // Add options
        const options = ['name', 'email', 'phone'];
        options.forEach(option => {
            const item = document.createElement('div');
            item.className = 'autocomplete-item';
            item.textContent = option;
            item.style.padding = '8px 12px';
            item.style.cursor = 'pointer';
            item.style.transition = 'background-color 0.2s';
            
            // Hover effect
            item.addEventListener('mouseover', () => {
                item.style.backgroundColor = '#f0f0f0';
            });
            item.addEventListener('mouseout', () => {
                item.style.backgroundColor = 'transparent';
            });
            
            // Click event
            item.addEventListener('click', () => {
                insertVariable(editor, option);
                document.body.removeChild(dropdown);
            });
            
            dropdown.appendChild(item);
        });
        
        // Position the dropdown near the cursor
        const domSelection = editor.editing.view.domConverter.viewRangeToDom(
            editor.editing.view.document.selection.getFirstRange()
        );
        const rect = domSelection.getBoundingClientRect();
        
        dropdown.style.top = `${window.scrollY + rect.bottom + 5}px`;
        dropdown.style.left = `${window.scrollX + rect.left}px`;
        
        // Add the dropdown to the document
        document.body.appendChild(dropdown);
        
        // Remove the dropdown when clicking outside
        const handleClickOutside = (e: MouseEvent) => {
            if (!dropdown.contains(e.target as Node)) {
                document.body.removeChild(dropdown);
                document.removeEventListener('click', handleClickOutside);
            }
        };
        
        // Wait a bit before adding the click event to prevent immediate closing
        setTimeout(() => {
            document.addEventListener('click', handleClickOutside);
        }, 100);
    };

    // Function to insert the selected variable
    const insertVariable = (editor: any, variable: string) => {
        editor.model.change((writer: any) => {
            // Remove the opening curly brace we added earlier
            const lastPosition = editor.model.document.selection.getLastPosition();
            const rangeToRemove = writer.createRange(
                writer.createPositionAt(lastPosition.parent, lastPosition.offset - 1),
                lastPosition
            );
            writer.remove(rangeToRemove);
            
            // Insert the complete variable with curly braces
            editor.model.insertContent(writer.createText(`{${variable}}`));
        });
    };

    if (loading) {
        return <div className="container mx-auto p-6 text-center">Loading...</div>;
    }

    return (
        <div className="container mx-auto p-4 max-w-4xl">
            <h1 className="text-2xl font-bold mb-4">{id ? 'Edit Template' : 'Create Template'}</h1>
            {error && (
                <div className="mb-4 p-4 bg-red-100 text-red-700 rounded-lg">{error}</div>
            )}
            <div className="bg-white shadow rounded-lg p-6">
                <div className="mb-6">
                    <label className="block text-gray-700 mb-2" htmlFor="name">
                        Name
                    </label>
                    <input
                        type="text"
                        id="name"
                        value={template.name || ''}
                        onChange={(e) => setTemplate({ ...template, name: e.target.value })}
                        className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none ${
                            validationErrors.name ? 'border-red-500' : ''
                        }`}
                        required
                    />
                    {validationErrors.name && (
                        <p className="mt-1 text-red-500 text-sm">{validationErrors.name}</p>
                    )}
                </div>
                <div className="mb-6">
                    <label className="block text-gray-700 mb-2" htmlFor="description">
                        Description
                    </label>
                    <textarea
                        id="description"
                        value={template.description || ''}
                        onChange={(e) => setTemplate({ ...template, description: e.target.value })}
                        className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                        rows={4}
                    />
                </div>
                <div className="mb-6">
                    <label className="block text-gray-700 mb-2">Content</label>
                    <div className={`border rounded-lg ${validationErrors.content ? 'border-red-500' : ''}`}>
                        <CKEditor
                            editor={ClassicEditor as any}
                            data={template.content || ''}
                            onChange={(_event, editor) => {
                                const data = editor.getData();
                                setTemplate({ ...template, content: data });
                                // Clear validation error if content is added
                                if (data.replace(/<[^>]*>/g, '').trim() && validationErrors.content) {
                                    setValidationErrors({ ...validationErrors, content: undefined });
                                }
                            }}
                            onReady={(editor) => {
                                // Set up the autocomplete feature when the editor is ready
                                setupAutocomplete(editor);
                            }}
                        />
                    </div>
                    {validationErrors.content && (
                        <p className="mt-1 text-red-500 text-sm">{validationErrors.content}</p>
                    )}
                    <div className="mt-2 text-sm text-gray-600">
                       
                    </div>
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
