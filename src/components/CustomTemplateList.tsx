// import { useState, useEffect } from 'react';
// import { useNavigate } from 'react-router-dom';
// import toast from 'react-hot-toast';
// import {  Trash2, Plus,  } from 'lucide-react';

// interface CustomTemplate {
//   id: number;
//   name: string;
//   description: string;
//   content: string;
//   createddate: string;
//   updateddate: string;
//   category?: string;
//   isPublic?: boolean;
//   username?: string;
// }

// const CustomTemplatesList: React.FC = () => {
//   const [templates, setTemplates] = useState<CustomTemplate[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState<string | null>(null);
//   const [searchTerm, setSearchTerm] = useState('');
//   const navigate = useNavigate();

//   useEffect(() => {
//     fetchTemplates();
//   }, []);

//   const fetchTemplates = async () => {
//     try {
//       setLoading(true);
//       const response = await fetch('http://localhost:3001/api/custom-templates');
//       if (!response.ok) throw new Error('Failed to fetch templates');
//       const data = await response.json();
//       setTemplates(data);
//       setError(null);
//     } catch (err) {
//       setError('Error loading templates');
//       toast.error('Failed to load templates');
//     } finally {
//       setLoading(false);
//     }
//   };



//   const handleDelete = async (id:number)=>{
//     try {
//       const response = await fetch(`http://localhost:3001/api/custom-templates/${id}`, {
//         method: 'DELETE',
//       });
      
//       if (!response.ok) throw new Error('Failed to delete template');
      
//       // Remove template from state
//       setTemplates(templates.filter(template => template.id !== id));
//       toast.success('Template deleted successfully');
//     } catch (err) {
//       toast.error('Failed to delete template');
//     }
//   };

  

//   const formatDate = (dateString: string) => {
//     return new Date(dateString).toLocaleDateString('en-GB', {
//       day: '2-digit',
//       month: '2-digit',
//       year: 'numeric'
//     });
//   };

//   const filteredTemplates = templates.filter(template => 
//     template.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
//     template.description.toLowerCase().includes(searchTerm.toLowerCase())
//   );

//   if (loading) {
//     return (
//       <div className="container mx-auto p-6 text-center">
//         <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto"></div>
//         <p className="mt-4 text-gray-600">Loading templates...</p>
//       </div>
//     );
//   }

//   return (
//     <div className="container mx-auto p-4">
//       <div className="flex justify-between items-center mb-6">
//         <h1 className="text-3xl font-bold text-gray-800">Custom Templates</h1>
        
//         <button
//           onClick={() => navigate('/custom-template')}
//           className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
//         >
//           <Plus className="w-5 h-5" /> Custom
//         </button>
//       </div>

//       <div className="mb-6">
//         <div className="relative">
//           <input
//             type="text"
//             placeholder="Search templates..."
//             value={searchTerm}
//             onChange={(e) => setSearchTerm(e.target.value)}
//             className="w-full p-3 pl-10 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
//           />
//           <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
//             <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
//               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
//             </svg>
//           </div>
//         </div>
//       </div>

//       {error && (
//         <div className="mb-6 p-4 bg-red-100 text-red-700 rounded-lg">
//           {error}
//           <button 
//             onClick={fetchTemplates}
//             className="ml-2 underline"
//           >
//             Try again
//           </button>
//         </div>
//       )}

//       {filteredTemplates.length === 0 && !loading && !error && (
//         <div className="text-center p-8 bg-gray-50 rounded-lg">
//           <p className="text-gray-600 mb-4">No templates found{searchTerm ? ' matching your search' : ''}.</p>
//           {searchTerm && (
//             <button
//               onClick={() => setSearchTerm('')}
//               className="text-blue-600 underline"
//             >
//               Clear search
//             </button>
//           )}
//           {!searchTerm && (
//             <button
//               onClick={() => navigate('/custom-template')}
//               className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
//             >
//               Create your first template
//             </button>
//           )}
//         </div>
//       )}

//       {filteredTemplates.length > 0 && (
//         <div className="bg-white rounded-lg shadow overflow-hidden">
//           <table className="min-w-full divide-y divide-gray-200">
//             <thead className="bg-gray-50">
//               <tr>
//                 <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                   Name
//                 </th>
//                 <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                   Description
//                 </th>
//                 <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                   Created
//                 </th>
//                 <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
//                   Actions
//                 </th>
//               </tr>
//             </thead>
//             <tbody className="bg-white divide-y divide-gray-200">
//               {filteredTemplates.map((template) => (
//                 <tr key={template.id} className="hover:bg-gray-50">
//                   <td className="px-6 py-4 whitespace-nowrap">
//                     <div className="font-medium text-gray-900">{template.name}</div>
//                     {template.category && (
//                       <div className="text-sm text-gray-500">{template.category}</div>
//                     )}
//                   </td>
//                   <td className="px-6 py-4">
//                     <div className="text-sm text-gray-500 line-clamp-2">
//                       {template.description || 'No description provided'}
//                     </div>
//                   </td>
//                   <td className="px-6 py-4 whitespace-nowrap">
//                     <div className="text-sm text-gray-500">{formatDate(template.createddate)}</div>
//                   </td>
//                   <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
//                     <div className="flex justify-end space-x-2">
                  
//                       <button
//                         onClick={() => handleDelete(template.id)}
//                         className="text-red-600 hover:text-red-900"
//                         title="Delete"
//                       >
//                         <Trash2 className="w-5 h-5" />
//                       </button>
//                     </div>
//                   </td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         </div>
//       )}
//     </div>
//   );
// };

// export default CustomTemplatesList;






// //customtemplate
// import { useState, useEffect } from 'react';
// import { useNavigate } from 'react-router-dom';
// import toast from 'react-hot-toast';
// import { Trash2, Plus, Eye } from 'lucide-react';

// interface CustomTemplate {
//   id: number;
//   name: string;
//   description: string;
//   content: string;
//   createddate: string;
//   updateddate: string;
//   category?: string;
//   isPublic?: boolean;
//   username?: string;
// }

// const CustomTemplatesList: React.FC = () => {
//   const [templates, setTemplates] = useState<CustomTemplate[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState<string | null>(null);
//   const [searchTerm, setSearchTerm] = useState('');
//   const [selectedTemplate, setSelectedTemplate] = useState<CustomTemplate | null>(null);
//   const [showModal, setShowModal] = useState(false);
//   const navigate = useNavigate();

//   useEffect(() => {
//     fetchTemplates();
//   }, []);

//   const fetchTemplates = async () => {
//     try {
//       setLoading(true);
//       const response = await fetch('http://localhost:3001/api/custom-templates');
//       if (!response.ok) throw new Error('Failed to fetch templates');
//       const data = await response.json();
//       setTemplates(data);
//       setError(null);
//     } catch (err) {
//       setError('Error loading templates');
//       toast.error('Failed to load templates');
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleDelete = async (id: number) => {
//     try {
//       const response = await fetch(`http://localhost:3001/api/custom-templates/${id}`, {
//         method: 'DELETE',
//       });
      
//       if (!response.ok) throw new Error('Failed to delete template');
      
//       // Remove template from state
//       setTemplates(templates.filter(template => template.id !== id));
//       toast.success('Template deleted successfully');
//     } catch (err) {
//       toast.error('Failed to delete template');
//     }
//   };

//   const handleView = (template: CustomTemplate) => {
//     setSelectedTemplate(template);
//     setShowModal(true);
//   };

//   const closeModal = () => {
//     setShowModal(false);
//     setSelectedTemplate(null);
//   };

//   const formatDate = (dateString: string) => {
//     return new Date(dateString).toLocaleDateString('en-GB', {
//       day: '2-digit',
//       month: '2-digit',
//       year: 'numeric'
//     });
//   };

//   const filteredTemplates = templates.filter(template => 
//     template.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
//     template.description.toLowerCase().includes(searchTerm.toLowerCase())
//   );

//   if (loading) {
//     return (
//       <div className="container mx-auto p-6 text-center">
//         <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto"></div>
//         <p className="mt-4 text-gray-600">Loading templates...</p>
//       </div>
//     );
//   }

//   return (
//     <div className="container mx-auto p-4">
//       <div className="flex justify-between items-center mb-6">
//         <h1 className="text-3xl font-bold text-gray-800">Custom Templates</h1>
        
//         <button
//           onClick={() => navigate('/custom-template')}
//           className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
//         >
//           <Plus className="w-5 h-5" /> Custom
//         </button>
//       </div>

//       <div className="mb-6">
//         <div className="relative">
//           <input
//             type="text"
//             placeholder="Search templates..."
//             value={searchTerm}
//             onChange={(e) => setSearchTerm(e.target.value)}
//             className="w-full p-3 pl-10 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
//           />
//           <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
//             <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
//               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
//             </svg>
//           </div>
//         </div>
//       </div>

//       {error && (
//         <div className="mb-6 p-4 bg-red-100 text-red-700 rounded-lg">
//           {error}
//           <button 
//             onClick={fetchTemplates}
//             className="ml-2 underline"
//           >
//             Try again
//           </button>
//         </div>
//       )}

//       {filteredTemplates.length === 0 && !loading && !error && (
//         <div className="text-center p-8 bg-gray-50 rounded-lg">
//           <p className="text-gray-600 mb-4">No templates found{searchTerm ? ' matching your search' : ''}.</p>
//           {searchTerm && (
//             <button
//               onClick={() => setSearchTerm('')}
//               className="text-blue-600 underline"
//             >
//               Clear search
//             </button>
//           )}
//           {!searchTerm && (
//             <button
//               onClick={() => navigate('/custom-template')}
//               className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
//             >
//               Create your first template
//             </button>
//           )}
//         </div>
//       )}

//       {filteredTemplates.length > 0 && (
//         <div className="bg-white rounded-lg shadow overflow-hidden">
//           <table className="min-w-full divide-y divide-gray-200">
//             <thead className="bg-gray-50">
//               <tr>
//                 <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                   Name
//                 </th>
//                 <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                   Description
//                 </th>
//                 <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                   Created
//                 </th>
//                 <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
//                   Actions
//                 </th>
//               </tr>
//             </thead>
//             <tbody className="bg-white divide-y divide-gray-200">
//               {filteredTemplates.map((template) => (
//                 <tr key={template.id} className="hover:bg-gray-50">
//                   <td className="px-6 py-4 whitespace-nowrap">
//                     <div className="font-medium text-gray-900">{template.name}</div>
//                     {template.category && (
//                       <div className="text-sm text-gray-500">{template.category}</div>
//                     )}
//                   </td>
//                   <td className="px-6 py-4">
//                     <div className="text-sm text-gray-500 line-clamp-2">
//                       {template.description || 'No description provided'}
//                     </div>
//                   </td>
//                   <td className="px-6 py-4 whitespace-nowrap">
//                     <div className="text-sm text-gray-500">{formatDate(template.createddate)}</div>
//                   </td>
//                   <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
//                     <div className="flex justify-end space-x-2">
//                       <button
//                         onClick={() => handleView(template)}
//                         className="text-blue-600 hover:text-blue-900"
//                         title="View"
//                       >
//                         <Eye className="w-5 h-5" />
//                       </button>
//                       <button
//                         onClick={() => handleDelete(template.id)}
//                         className="text-red-600 hover:text-red-900"
//                         title="Delete"
//                       >
//                         <Trash2 className="w-5 h-5" />
//                       </button>
//                     </div>
//                   </td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         </div>
//       )}

//       {/* Modal for viewing template content */}
//       {showModal && selectedTemplate && (
//         <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
//           <div className="bg-white rounded-lg shadow-lg max-w-4xl w-full max-h-screen overflow-hidden">
//             <div className="flex justify-between items-center border-b p-4">
//               <h3 className="text-xl font-semibold text-gray-900">
//                 {selectedTemplate.name}
//               </h3>
//               <button
//                 onClick={closeModal}
//                 className="text-gray-400 hover:text-gray-500 focus:outline-none"
//               >
//                 <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
//                 </svg>
//               </button>
//             </div>
//             <div className="p-6 overflow-y-auto" style={{ maxHeight: 'calc(100vh - 10rem)' }}>
//               {selectedTemplate.category && (
//                 <div className="mb-4">
//                   <span className="text-sm font-medium text-gray-500">Category:</span>
//                   <span className="ml-2 text-gray-900">{selectedTemplate.category}</span>
//                 </div>
//               )}
              
//               <div className="mb-4">
//                 <span className="text-sm font-medium text-gray-500">Description:</span>
//                 <p className="mt-1 text-gray-900">{selectedTemplate.description || 'No description provided'}</p>
//               </div>
              
//               <div>
//                 <span className="text-sm font-medium text-gray-500">Content:</span>
//                 <div className="mt-2 p-4 bg-gray-50 rounded-md whitespace-pre-wrap text-gray-800 border border-gray-200">
//                   {selectedTemplate.content || 'No content available'}
//                 </div>
//               </div>
              
//               <div className="mt-4 text-sm text-gray-500">
//                 Created: {formatDate(selectedTemplate.createddate)}
//                 {selectedTemplate.updateddate && selectedTemplate.updateddate !== selectedTemplate.createddate && (
//                   <span className="ml-3">
//                     Last updated: {formatDate(selectedTemplate.updateddate)}
//                   </span>
//                 )}
//               </div>
//             </div>
//             <div className="border-t p-4 flex justify-end">
//               <button
//                 onClick={closeModal}
//                 className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors"
//               >
//                 Close
//               </button>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default CustomTemplatesList;



import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  PlusCircle, 
  Edit, 
  Trash2, 
  Search, 
  AlertCircle, 
  Filter, 
  Clock, 
  Eye, 
  ChevronDown,
  SortAsc,
  SortDesc,
  Calendar,
  List,
  Grid
} from 'lucide-react';
import toast from 'react-hot-toast';

interface CustomTemplate {
  id: number;
  name: string;
  description: string;
  content: string;
  createddate: string;
  updateddate: string;
  category?: string;
  isPublic?: boolean;
  username?: string;
}

const CustomTemplatesList = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [templates, setTemplates] = useState<CustomTemplate[]>([]);
  const [deleteConfirm, setDeleteConfirm] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [view, setView] = useState<'grid' | 'list'>('grid');
  const [sortField, setSortField] = useState<'name' | 'createddate' | 'category'>('createddate');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
  const [filterDropdownOpen, setFilterDropdownOpen] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState<CustomTemplate | null>(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    fetchTemplates();
  }, []);

  const fetchTemplates = async () => {
    try {
      setLoading(true);
      const response = await fetch('http://localhost:3001/api/custom-templates');
      if (!response.ok) throw new Error('Failed to fetch templates');
      const data = await response.json();
      setTemplates(data);
      setError(null);
    } catch (err) {
      setError('Error loading templates');
      toast.error('Failed to load templates');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    try {
      const response = await fetch(`http://localhost:3001/api/custom-templates/${id}`, {
        method: 'DELETE',
      });
      
      if (!response.ok) throw new Error('Failed to delete template');
      
      setTemplates(templates.filter(template => template.id !== id));
      setDeleteConfirm(null);
      toast.success('Template deleted successfully');
    } catch (err) {
      setError('Error deleting template');
      toast.error('Failed to delete template');
    }
  };

  const handleView = (template: CustomTemplate) => {
    setSelectedTemplate(template);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedTemplate(null);
  };

  const toggleSort = (field: 'name' | 'createddate' | 'category') => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const getSortedTemplates = () => {
    let filtered = templates.filter(
      (template) =>
        template.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        template.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (template.category && template.category.toLowerCase().includes(searchTerm.toLowerCase()))
    );

    return filtered.sort((a, b) => {
      if (sortField === 'name') {
        return sortDirection === 'asc'
          ? a.name.localeCompare(b.name)
          : b.name.localeCompare(a.name);
      } else if (sortField === 'category') {
        const categoryA = a.category || '';
        const categoryB = b.category || '';
        return sortDirection === 'asc'
          ? categoryA.localeCompare(categoryB)
          : categoryB.localeCompare(categoryA);
      } else {
        return sortDirection === 'asc'
          ? new Date(a.createddate).getTime() - new Date(b.createddate).getTime()
          : new Date(b.createddate).getTime() - new Date(a.createddate).getTime();
      }
    });
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', { 
      month: 'short', 
      day: 'numeric', 
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  const filteredTemplates = getSortedTemplates();

  const truncateText = (text: string, maxLength: number) => {
    if (!text) return 'No description provided';
    if (text.length <= maxLength) return text;
    return text.slice(0, maxLength) + '...';
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-pulse flex flex-col items-center">
          <div className="w-12 h-12 rounded-full bg-blue-200 mb-3"></div>
          <div className="h-4 w-24 bg-blue-200 rounded"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-12">
      {/* Header with gradient background */}
      <div className="bg-gradient-to-br from-purple-500 to-indigo-600 text-white py-12">
        <div className="container mx-auto px-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold mb-2">Custom Templates</h1>
              <p className="text-purple-100">Edit and manage your standard templates</p>
            </div>
            <button
              onClick={() => navigate('/custom-template')}
              className="flex items-center bg-white text-purple-600 px-5 py-2.5 rounded-lg hover:bg-purple-50  shadow-sm font-medium hover:scale-105 transition-transform duration-300" 
            >
              <PlusCircle className="mr-2 h-5 w-5" />
              Create Custom Template
            </button>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 -mt-6">
        {/* Search and filter bar */}
        <div className="bg-white rounded-xl shadow-md p-4 mb-8">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-grow">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Search templates..."
                className="pl-10 pr-4 py-2.5 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none transition-all"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            
            <div className="flex gap-2">
              <div className="relative">
                <button 
                  className="flex items-center px-4 py-2.5 border border-gray-300 rounded-lg hover:bg-gray-50"
                  onClick={() => setFilterDropdownOpen(!filterDropdownOpen)}
                >
                  <Filter className="h-5 w-5 mr-2 text-gray-500" />
                  <span className="text-gray-700">Sort by</span>
                  <ChevronDown className="h-4 w-4 ml-2 text-gray-500" />
                </button>
                
                {filterDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg z-10 border border-gray-200">
                    <div className="py-1">
                      <button 
                        className={`flex items-center px-4 py-2 w-full text-left hover:bg-gray-100 ${sortField === 'name' ? 'text-purple-600' : 'text-gray-700'}`}
                        onClick={() => {
                          toggleSort('name');
                          setFilterDropdownOpen(false);
                        }}
                      >
                        <span className="flex-grow">Name</span>
                        {sortField === 'name' && (
                          sortDirection === 'asc' ? <SortAsc className="h-4 w-4" /> : <SortDesc className="h-4 w-4" />
                        )}
                      </button>
                      <button 
                        className={`flex items-center px-4 py-2 w-full text-left hover:bg-gray-100 ${sortField === 'category' ? 'text-purple-600' : 'text-gray-700'}`}
                        onClick={() => {
                          toggleSort('category');
                          setFilterDropdownOpen(false);
                        }}
                      >
                        <span className="flex-grow">Category</span>
                        {sortField === 'category' && (
                          sortDirection === 'asc' ? <SortAsc className="h-4 w-4" /> : <SortDesc className="h-4 w-4" />
                        )}
                      </button>
                      <button 
                        className={`flex items-center px-4 py-2 w-full text-left hover:bg-gray-100 ${sortField === 'createddate' ? 'text-purple-600' : 'text-gray-700'}`}
                        onClick={() => {
                          toggleSort('createddate');
                          setFilterDropdownOpen(false);
                        }}
                      >
                        <span className="flex-grow">Date Created</span>
                        {sortField === 'createddate' && (
                          sortDirection === 'asc' ? <SortAsc className="h-4 w-4" /> : <SortDesc className="h-4 w-4" />
                        )}
                      </button>
                    </div>
                  </div>
                )}
              </div>
              
              <div className="flex border border-gray-300 rounded-lg overflow-hidden">
                <button 
                  className={`p-2.5 ${view === 'grid' ? 'bg-purple-50 text-purple-600' : 'bg-white text-gray-500'}`}
                  onClick={() => setView('grid')}
                  title="Grid view"
                >
                  <Grid className="h-5 w-5" />
                </button>
                <button 
                  className={`p-2.5 ${view === 'list' ? 'bg-purple-50 text-purple-600' : 'bg-white text-gray-500'}`}
                  onClick={() => setView('list')}
                  title="List view"
                >
                  <List className="h-5 w-5" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg flex items-center">
            <AlertCircle className="h-5 w-5 mr-2" />
            {error}
            <button 
              onClick={fetchTemplates}
              className="ml-3 text-red-700 underline"
            >
              Try again
            </button>
          </div>
        )}

        {filteredTemplates.length > 0 ? (
          view === 'grid' ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredTemplates.map((template) => (
                <div key={template.id} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow">
                  <div className="h-2 bg-purple-500 w-full"></div>
                  <div className="p-6">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="text-lg font-semibold text-gray-900">{template.name}</h3>
                      {template.category && (
                        <span className="text-xs px-2 py-1 bg-purple-100 text-purple-800 rounded-full">
                          {template.category}
                        </span>
                      )}
                    </div>
                    <p className="text-gray-600 text-sm mb-4 h-12 line-clamp-2">
                      {truncateText(template.description, 100)}
                    </p>
                    <div className="flex items-center text-xs text-gray-500 mb-4">
                      <Calendar className="h-3.5 w-3.5 mr-1.5" />
                      {formatDate(template.createddate)}
                    </div>
                    <div className="flex justify-between items-center">
                      <button 
                        onClick={() => handleView(template)}
                        className="text-purple-600 hover:bg-purple-50 px-3 py-1.5 rounded flex items-center text-sm font-medium"
                      >
                        <Eye className="h-4 w-4 mr-1.5" />
                        View
                      </button>
                      
                      {deleteConfirm === template.id ? (
                        <div className="flex space-x-2">
                          <button
                            onClick={() => handleDelete(template.id)}
                            className="text-red-600 hover:bg-red-50 px-3 py-1.5 rounded text-sm font-medium"
                          >
                            Confirm
                          </button>
                          <button
                            onClick={() => setDeleteConfirm(null)}
                            className="text-gray-600 hover:bg-gray-50 px-3 py-1.5 rounded text-sm"
                          >
                            Cancel
                          </button>
                        </div>
                      ) : (
                        <button 
                          onClick={() => setDeleteConfirm(template.id)}
                          className="text-red-600 hover:bg-red-50 px-3 py-1.5 rounded flex items-center text-sm font-medium"
                        >
                          <Trash2 className="h-4 w-4 mr-1.5" />
                          Delete
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-white shadow-sm rounded-xl border border-gray-100 overflow-hidden">
              <table className="w-full">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-200">
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
                    {sortField === 'category' && (
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                    )}
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Created</th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider pr-8">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {filteredTemplates.map((template) => (
                    <tr key={template.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4">
                        <div className="flex items-center">
                          <div className="h-9 w-9 flex-shrink-0 rounded bg-purple-100 flex items-center justify-center">
                            <span className="font-semibold text-purple-600">{template.name.charAt(0).toUpperCase()}</span>
                          </div>
                          <div className="ml-3">
                            <div className="text-sm font-medium text-gray-900">{template.name}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-600 line-clamp-1 max-w-xs">
                          {template.description || 'No description provided'}
                        </div>
                      </td>
                      {sortField === 'category' && (
                        <td className="px-6 py-4">
                          {template.category ? (
                            <span className="text-xs px-2 py-1 bg-purple-100 text-purple-800 rounded-full">
                              {template.category}
                            </span>
                          ) : (
                            <span className="text-xs text-gray-500">None</span>
                          )}
                        </td>
                      )}
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-600">
                          <div className="flex items-center">
                            <Clock className="h-3.5 w-3.5 mr-1.5 text-gray-400" />
                            {new Date(template.createddate).toLocaleDateString()}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-right text-sm font-medium whitespace-nowrap">
                        {deleteConfirm === template.id ? (
                          <div className="flex justify-end space-x-3">
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
                          <div className="flex justify-end space-x-2">
                            <button
                              onClick={() => handleView(template)}
                              className="text-purple-600 hover:text-purple-800 p-1.5 hover:bg-purple-50 rounded"
                              title="View template"
                            >
                              <Eye className="h-4.5 w-4.5" />
                            </button>
                            <button
                              onClick={() => setDeleteConfirm(template.id)}
                              className="text-red-600 hover:text-red-800 p-1.5 hover:bg-red-50 rounded"
                              title="Delete template"
                            >
                              <Trash2 className="h-4.5 w-4.5" />
                            </button>
                          </div>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )
        ) : (
          <div className="bg-white shadow-sm rounded-xl p-12 text-center border border-gray-100">
            <div className="flex flex-col items-center max-w-md mx-auto">
              <div className="p-4 bg-purple-50 rounded-full mb-4">
                <AlertCircle className="h-10 w-10 text-purple-500" />
              </div>
              <h3 className="text-xl font-medium text-gray-900 mb-2">No templates found</h3>
              <p className="text-gray-600 mb-6">
                {searchTerm 
                  ? `No results for "${searchTerm}". Try adjusting your search term.` 
                  : "You haven't created any custom templates yet. Create your first template to get started."}
              </p>
              {searchTerm ? (
                <button
                  onClick={() => setSearchTerm('')}
                  className="text-purple-600 hover:text-purple-800 font-medium"
                >
                  Clear search
                </button>
              ) : (
                <button
                  onClick={() => navigate('/custom-template')}
                  className="bg-purple-600 text-white px-5 py-2.5 rounded-lg hover:bg-purple-700 transition-colors flex items-center"
                >
                  <PlusCircle className="mr-2 h-5 w-5" />
                  Create your first template
                </button>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Modal for viewing template content */}
      {showModal && selectedTemplate && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-lg max-w-4xl w-full max-h-screen overflow-hidden">
            <div className="flex justify-between items-center border-b px-6 py-4">
              <div>
                <h3 className="text-xl font-semibold text-gray-900">
                  {selectedTemplate.name}
                </h3>
                {selectedTemplate.category && (
                  <span className="text-xs px-2 py-1 bg-purple-100 text-purple-800 rounded-full mt-1 inline-block">
                    {selectedTemplate.category}
                  </span>
                )}
              </div>
              <button
                onClick={closeModal}
                className="text-gray-400 hover:text-gray-500 focus:outline-none"
              >
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="p-6 overflow-y-auto" style={{ maxHeight: 'calc(100vh - 10rem)' }}>
              <div className="mb-6">
                <h4 className="text-sm font-medium text-gray-500 mb-2">Description:</h4>
                <p className="text-gray-800 bg-gray-50 p-3 rounded-lg border border-gray-100">
                  {selectedTemplate.description || 'No description provided'}
                </p>
              </div>
              
              <div>
                <h4 className="text-sm font-medium text-gray-500 mb-2">Content:</h4>
                <div className="p-4 bg-gray-50 rounded-lg whitespace-pre-wrap text-gray-800 border border-gray-200 overflow-x-auto">
                  {selectedTemplate.content || 'No content available'}
                </div>
              </div>
              
              <div className="mt-6 flex items-center text-sm text-gray-500">
                <Calendar className="h-4 w-4 mr-1.5" />
                Created: {formatDate(selectedTemplate.createddate)}
                {selectedTemplate.updateddate && selectedTemplate.updateddate !== selectedTemplate.createddate && (
                  <span className="ml-4 flex items-center">
                    <Clock className="h-4 w-4 mr-1.5" />
                    Updated: {formatDate(selectedTemplate.updateddate)}
                  </span>
                )}
              </div>
            </div>
            <div className="border-t p-4 flex justify-end space-x-3">
              <button
                onClick={() => {
                  closeModal();
                  setDeleteConfirm(selectedTemplate.id);
                }}
                className="px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors flex items-center"
              >
                <Trash2 className="h-4 w-4 mr-1.5" />
                Delete
              </button>
              <button
                onClick={closeModal}
                className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CustomTemplatesList;