import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { PlusCircle, Edit, Trash2, Search, AlertCircle } from 'lucide-react';
import toast from 'react-hot-toast';

interface Template {
  id: number; // Changed to number to match SERIAL
  name: string;
  description: string;
  content: string;
  createddate: string; // ISO string from PostgreSQL TIMESTAMP
  updateddate: string; // ISO string from PostgreSQL TIMESTAMP
}

const TemplateList = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [templates, setTemplates] = useState<Template[]>([]);
  const [deleteConfirm, setDeleteConfirm] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchTemplates();
  }, []);

  const fetchTemplates = async () => {
    try {
      setLoading(true);
      const response = await fetch('http://localhost:3001/api/templates');
      if (!response.ok) throw new Error('Failed to fetch templates');
      const data = await response.json();
      setTemplates(data);
    } catch (err) {
      setError('Error fetching templates');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    try {
      const response = await fetch(`http://localhost:3001/api/templates/${id}`, {
        method: 'DELETE',
      });
      if (!response.ok) throw new Error('Failed to delete template');
      setTemplates(templates.filter((template) => template.id !== id));
      setDeleteConfirm(null);
      toast.success("deleted")
    } catch (err) {
      setError('Error deleting template');
    }
  };

  const filteredTemplates = templates.filter(
    (template) =>
      template.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      template.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return <div className="container mx-auto p-6 text-center">Loading...</div>;
  }

  return (
    <div className="container mx-auto p-6 max-w-6xl">
      {error && (
        <div className="mb-4 p-4 bg-red-100 text-red-700 rounded-lg">{error}</div>
      )}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <h1 className="text-3xl font-bold text-gray-800">Templates</h1>
        <button
          onClick={() => navigate('/create')}
          className="flex items-center bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors shadow-sm"
        >
          <PlusCircle className="mr-2 h-5 w-5" />
          Create Template
        </button>
      </div>

      <div className="relative mb-6">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Search className="h-5 w-5 text-gray-400" />
        </div>
        <input
          type="text"
          placeholder="Search templates..."
          className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {filteredTemplates.length > 0 ? (
        <div className="bg-white shadow-md rounded-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-100 border-b border-gray-200">
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-600">Name</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-600">Description</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-600">Created</th>
                  <th className="px-6 py-3 text-left text-sm font-semibold text-gray-600 w-32">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredTemplates.map((template) => (
                  <tr key={template.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap font-medium">{template.name}</td>
                    <td className="px-6 py-4 text-gray-600">{template.description}</td>
                    <td className="px-6 py-4 text-gray-600">
                      {new Date(template.createddate).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {deleteConfirm === template.id ? (
                        <div className="flex space-x-2">
                          <button
                            onClick={() => handleDelete(template.id)}
                            className="text-red-600 hover:text-red-800 font-medium"
                          >
                            Confirm
                          </button>
                          <button
                            onClick={() => setDeleteConfirm(null)}
                            className="text-gray-600 hover:text-gray-800"
                          >
                            Cancel
                          </button>
                        </div>
                      ) : (
                        <div className="flex space-x-3">
                          <button
                            onClick={() => navigate(`/edit/${template.id}`)}
                            className="text-blue-600 hover:text-blue-800 flex items-center"
                            title="Edit template"
                          >
                            <Edit className="h-5 w-5" />
                          </button>
                          <button
                            onClick={() => setDeleteConfirm(template.id)}
                            className="text-red-600 hover:text-red-800 flex items-center"
                            title="Delete template"
                          >
                            <Trash2 className="h-5 w-5" />
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="bg-white shadow-md rounded-lg p-8 text-center">
          <div className="flex flex-col items-center">
            <AlertCircle className="h-12 w-12 text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-1">No templates found</h3>
            <p className="text-gray-500 mb-4">
              {searchTerm ? `No results for "${searchTerm}"` : "You haven't created any templates yet."}
            </p>
            {searchTerm ? (
              <button
                onClick={() => setSearchTerm('')}
                className="text-blue-600 hover:text-blue-800 font-medium"
              >
                Clear search
              </button>
            ) : (
              <button
                onClick={() => navigate('/create')}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center"
              >
                <PlusCircle className="mr-2 h-5 w-5" />
                Create your first template
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default TemplateList;