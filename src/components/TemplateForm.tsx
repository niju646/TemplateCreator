


import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import toast from 'react-hot-toast';
import RichTextEditor from './RichTextEditor';
import { ArrowLeftCircle, Save, X, Loader2, } from 'lucide-react';

import Popup from '../features/Popup';

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
  const navigate = useNavigate();
  const [template, setTemplate] = useState<Partial<Template>>({
    name: '',
    description: '',
    content: '',
  });
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [plainContent, setPlainContent] = useState<string>('');
  

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
      setPlainContent(data.content?.replace(/<[^>]*>/g, '') || '');
    } catch (err) {
      setError('Error fetching template');
      toast.error('Failed to load template');
    } finally {
      setLoading(false);
    }
  };

  const isFormValid = (): boolean => {
    return Boolean(template.name?.trim() && plainContent?.trim());
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
      toast.success(id ? 'Template updated successfully' : 'Template created successfully');
      navigate('/template-list',{replace:true});
    } catch (err) {
      setError('Error saving template');
      toast.error('Failed to save template');
    } finally {
      setSubmitting(false);
    }
  };

  const handleContentChange = (htmlContent: string, plainTextContent: string) => {
    setTemplate({ ...template, content: htmlContent });
    setPlainContent(plainTextContent);
  };

  if (loading && !template.id) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-50">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin text-blue-600 mx-auto" />
          <p className="mt-4 text-lg text-gray-700">Loading template data...</p>
        </div>
      </div>
    );
  }


  return (
    <div className="min-h-screen py-8 bg-gradient-to-br from-gray-100 to-indigo-800">

      <div className="container mx-auto px-4 max-w-4xl">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">
              {id ? 'Edit Template' : 'Create Template'}
            </h1>
            <p className="text-gray-600 mt-1">
              {id ? 'Update your existing template' : 'Create a new reusable template'}
            </p>
          </div>
          <button
            onClick={() => navigate('/template-list',{replace:true})}
            className="bg-white border border-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-50  flex items-center gap-2 shadow-sm hover:scale-105 transition-transform duration-300"
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

        <div className="bg-white shadow-lg rounded-xl p-8 border border-gray-100">
          <form>
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="name">
                  Template Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="name"
                  value={template.name || ''}
                  onChange={(e) => {
                    setTemplate({ ...template, name: e.target.value });
                  }}
                  placeholder="Enter a descriptive name"
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="description">
                  Description
                </label>
                <textarea
                  id="description"
                  value={template.description || ''}
                  onChange={(e) => setTemplate({ ...template, description: e.target.value })}
                  placeholder="Add a detailed description of this template's purpose"
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
                  rows={3}
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2" htmlFor="content">
                  Template Content <span className="text-red-500">*</span>
                </label>
                <div className="border border-gray-300 rounded-lg overflow-hidden">
                  <RichTextEditor
                    content={template.content || ''}
                    onChange={handleContentChange}
                  />
                </div>
                {plainContent.length === 0 && (
                  <p className="text-sm text-red-500 mt-1">Template content is required</p>
                )}
              </div>
            </div>

            <div className="mt-8 flex justify-end gap-3">
              <button
                onClick={() => navigate('/template-list')}
                className="px-5 py-2.5 rounded-lg border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 transition-colors flex items-center gap-2 font-medium"
                type="button"
              >
                <X className="w-4 h-4" />
                Cancel
              </button>
              <button
                onClick={handleSubmit}
                disabled={!isFormValid() || submitting}
                className="px-5 py-2.5 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition-colors flex items-center gap-2 font-medium disabled:bg-blue-300 disabled:cursor-not-allowed shadow-sm"
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


{/* popup */}
             < Popup />
            

            
          </form>
        </div>
       
      </div>
    </div>
  );
};

export default TemplateForm;




