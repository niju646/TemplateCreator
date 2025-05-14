


import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import toast from 'react-hot-toast';
import RichTextEditor from './RichTextEditor';
import { 
  ArrowLeftCircle, 
  ChevronDown, 
  Save, 
  X, 
  Loader2, 
  Tag, 
  Globe, 
  FileText, 
  
} from 'lucide-react';

import CustomPopup from '../features/CustomPopup';

interface CustomTemplate {
  id: number;
  name: string;
  description: string;
  content: string;
  createddate: string;
  updateddate: string;
  category?: string;
  isPublic?: boolean;
  userId: number;
}

interface Template {
  id: number;
  name: string;
  description: string;
  content: string;
  createddate: string;
  updateddate: string;
}

const CustomTemplate: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [customTemplate, setCustomTemplate] = useState<Partial<CustomTemplate>>({
    name: '',
    description: '',
    content: '',
    category: '',
    isPublic: false,
  });
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [plainContent, setPlainContent] = useState<string>('');
  const [templates, setTemplates] = useState<Template[]>([]);
  const [selectedTemplateId, setSelectedTemplateId] = useState<number | null>(null);
  const [loadingTemplates, setLoadingTemplates] = useState(false);
  const username = 'testuser'; // Hardcoded for testing; replace with authenticated username

 
  useEffect(() => {
    fetchTemplates();
    if (id) {
      fetchCustomTemplate();
    }
  }, [id]);

  const fetchTemplates = async () => {
    try {
      setLoadingTemplates(true);
      const response = await fetch('http://localhost:3001/api/templates');
      if (!response.ok) throw new Error('Failed to fetch templates');
      const data = await response.json();
      setTemplates(data);
    } catch (err) {
      toast.error('Error loading templates');
    } finally {
      setLoadingTemplates(false);
    }
  };

  const fetchCustomTemplate = async () => {
    try {
      setLoading(true);
      const response = await fetch(`http://localhost:3001/api/custom-templates/${id}`);
      if (!response.ok) throw new Error('Failed to fetch custom template');
      const data = await response.json();
      setCustomTemplate(data);
      setPlainContent(data.content?.replace(/<[^>]*>/g, '') || '');
      if (data.templateId) {
        setSelectedTemplateId(data.templateId);
      }
    } catch (err) {
      setError('Error fetching custom template');
      toast.error('Failed to load custom template');
    } finally {
      setLoading(false);
    }
  };

  const isFormValid = (): boolean => {
    return Boolean(customTemplate.name?.trim() && plainContent?.trim());
  };

  const handleSubmit = async (e: React.MouseEvent) => {
    e.preventDefault();
    
    if (!isFormValid()) {
      toast.error('Please fill in all required fields');
      return;
    }
    
    try {
      setSubmitting(true);
      const method = id ? 'PUT' : 'POST';
      const url = id
        ? `http://localhost:3001/api/custom-templates/${id}`
        : 'http://localhost:3001/api/custom-templates';

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: customTemplate.name,
          description: customTemplate.description,
          content: customTemplate.content,
          category: customTemplate.category,
          isPublic: customTemplate.isPublic,
          username,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to save custom template');
      }
      toast.success(id ? 'Custom template updated successfully' : 'Custom template created successfully');
      setCustomTemplate({
        name: '',
        description: '',
        content: '',
        category: '',
        isPublic: false,
      });
      setPlainContent('');
      setSelectedTemplateId(null);
      navigate('/custom-view');
    } catch (err: any) {
      setError(err.message || 'Error saving custom template');
      toast.error(err.message || 'Failed to save custom template');
    } finally {
      setSubmitting(false);
    }
  };

  const handleContentChange = (htmlContent: string, plainTextContent: string) => {
    setCustomTemplate({ ...customTemplate, content: htmlContent });
    setPlainContent(plainTextContent);
  };

  const handleTemplateSelect = async (templateId: number) => {
    if (!templateId) {
      setSelectedTemplateId(null);
      return;
    }
    
    setSelectedTemplateId(templateId);
    try {
      const selectedTemplate = templates.find((t) => t.id === templateId);
      if (selectedTemplate) {
        setCustomTemplate({
          ...customTemplate,
          content: selectedTemplate.content,
        });
        setPlainContent(selectedTemplate.content.replace(/<[^>]*>/g, ''));
      }
    } catch (err) {
      toast.error('Error loading template content');
    }
  };

  if (loading && !customTemplate.id) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-50">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin text-purple-600 mx-auto" />
          <p className="mt-4 text-lg text-gray-700">Loading template data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-8 bg-gradient-to-br from-gray-100 to-indigo-800">


      <div className="container mx-auto px-4 max-w-5xl">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">
              {id ? 'Edit Custom Template' : 'Create Custom Template'}
            </h1>
            <p className="text-gray-600 mt-1">
              {id ? 'Update your existing custom template' : 'Create a personalized template based on existing templates'}
            </p>
          </div>
          <button
            onClick={() => navigate('/custom-view')}
            className="bg-transparent border border-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-50  flex items-center gap-2 shadow-sm hover:scale-105 transition-transform duration-300"
            type="button"
          >
            <ArrowLeftCircle className="w-5 h-5" />
            Back to List
          </button>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 text-red-700 rounded-lg flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
            {error}
          </div>
        )}

<div className="bg-white/80 shadow-xl rounded-xl p-8 border border-indigo-200">

          <form>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="name">
                  Template Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="name"
                  value={customTemplate.name || ''}
                  onChange={(e) => {
                    setCustomTemplate({ ...customTemplate, name: e.target.value });
                  }}
                  placeholder="Enter a descriptive name"
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none transition-all"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="category">
                  Category
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Tag className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="text"
                    id="category"
                    value={customTemplate.category || ''}
                    onChange={(e) => setCustomTemplate({ ...customTemplate, category: e.target.value })}
                    placeholder="E.g. Marketing, Sales, Support"
                    className="w-full pl-10 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none transition-all"
                  />
                </div>
              </div>
            </div>
            
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="description">
                Description
              </label>
              <textarea
                id="description"
                value={customTemplate.description || ''}
                onChange={(e) => setCustomTemplate({ ...customTemplate, description: e.target.value })}
                placeholder="Add a detailed description of this template's purpose"
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none transition-all"
                rows={3}
              />
            </div>
            
            <div className="mb-8">
              <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="template-select">
                Base Template
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FileText className="h-5 w-5 text-gray-400" />
                </div>
                <select
                  id="template-select"
                  value={selectedTemplateId || ''}
                  onChange={(e) => handleTemplateSelect(Number(e.target.value))}
                  className="w-full pl-10 p-3 border border-gray-300 rounded-lg appearance-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none transition-all"
                  disabled={loadingTemplates}
                >
                  <option value="">Select a template to start with</option>
                  {templates.map((template) => (
                    <option key={template.id} value={template.id}>
                      {template.name}
                    </option>
                  ))}
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3 text-gray-500">
                  <ChevronDown className="h-5 w-5" />
                </div>
              </div>
              {loadingTemplates && (
                <div className="mt-2 flex items-center text-sm text-gray-500">
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" /> 
                  Loading templates...
                </div>
              )}
            </div>

            <div className="mb-6">
              <div className="flex justify-between items-center mb-1">
                <label className="block text-sm font-medium text-gray-700" htmlFor="content">
                  Template Content <span className="text-red-500">*</span>
                </label>
               
              </div>
              
             
              
              <div className="border border-gray-300 rounded-lg overflow-hidden">
                <RichTextEditor
                  content={customTemplate.content || ''}
                  onChange={handleContentChange}
                />
              </div>
              {plainContent.length === 0 && (
                <p className="text-sm text-red-500 mt-1">Template content is required</p>
              )}
            </div>

            <div className="mb-6 flex items-center p-3 bg-gray-50 rounded-lg border border-gray-200">
              <input
                type="checkbox"
                id="isPublic"
                checked={customTemplate.isPublic || false}
                onChange={(e) => setCustomTemplate({ ...customTemplate, isPublic: e.target.checked })}
                className="h-4 w-4 text-purple-600 focus:ring-purple-500"
              />
              <label htmlFor="isPublic" className="ml-2 block text-sm text-gray-700 flex items-center">
                <Globe className="h-4 w-4 mr-1 text-gray-500" />
                Make this template available to everyone
              </label>
            </div>

            <div className="mt-8 flex justify-end gap-3">
              <button
                onClick={() => navigate('/custom-view')}
                className="px-5 py-2.5 rounded-lg border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 transition-colors flex items-center gap-2 font-medium"
                type="button"
              >
                <X className="w-4 h-4" />
                Cancel
              </button>
              <button
                onClick={handleSubmit}
                disabled={!isFormValid() || submitting}
                className="px-5 py-2.5 rounded-lg bg-purple-600 text-white hover:bg-purple-700 transition-colors flex items-center gap-2 font-medium disabled:bg-purple-300 disabled:cursor-not-allowed shadow-sm "
                type="submit"
              >
                {submitting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4" />
                    Save Template
                  </>
                )}
              </button>
            </div>
            {/* <Popup/> */}
            <CustomPopup/>
           
          </form>
        </div>
      </div>
    </div>
  );
};

export default CustomTemplate;