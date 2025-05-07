// import React from 'react';
// import { useNavigate } from 'react-router-dom';
// import { FileText, Edit } from 'lucide-react';

// const TemplateSelectionPage: React.FC = () => {
//   const navigate = useNavigate();

//   const handleTemplateClick = () => {
//     navigate('/template-list');
//   };

//   const handleCustomTemplateClick = () => {
//     navigate('/custom-view');
//   };

//   return (
//     <div className="container mx-auto p-6 max-w-4xl">
//       <div className="text-center mb-12">
//         <h1 className="text-3xl font-bold mb-4">Select Template Type</h1>
//         <p className="text-gray-600 text-lg">Choose which type of template you want to work with</p>
//       </div>

//       <div className="grid md:grid-cols-2 gap-8">
//         {/* Regular Templates Button */}
//         <div 
//           className="bg-white shadow-lg rounded-lg p-8 cursor-pointer hover:shadow-xl transition-shadow border-2 border-transparent hover:border-blue-500"
//           onClick={handleTemplateClick}
//         >
//           <div className="flex flex-col items-center">
//             <div className="p-4 bg-blue-100 rounded-full mb-4">
//               <FileText className="w-12 h-12 text-blue-600" />
//             </div>
//             <h2 className="text-2xl font-bold mb-2">Templates</h2>
//             <p className="text-gray-600 text-center">
//               Standard templates with predefined structure and formatting.
//             </p>
//             <button 
//               className="mt-6 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
//             >
//               Select Templates
//             </button>
//           </div>
//         </div>

//         {/* Custom Templates Button */}
//         <div 
//           className="bg-white shadow-lg rounded-lg p-8 cursor-pointer hover:shadow-xl transition-shadow border-2 border-transparent hover:border-purple-500"
//           onClick={handleCustomTemplateClick}
//         >
//           <div className="flex flex-col items-center">
//             <div className="p-4 bg-purple-100 rounded-full mb-4">
//               <Edit className="w-12 h-12 text-purple-600" />
//             </div>
//             <h2 className="text-2xl font-bold mb-2">Custom Templates</h2>
//             <p className="text-gray-600 text-center">
//               Create and customize your own templates with advanced options.
//             </p>
//             <button 
//               className="mt-6 bg-purple-600 text-white px-6 py-3 rounded-lg hover:bg-purple-700 transition-colors"
//             >
//               Select Custom Templates
//             </button>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default TemplateSelectionPage;



import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FileText, Edit, ChevronRight, Layout, Star, Clock } from 'lucide-react';

const TemplateSelectionPage = () => {
  const navigate = useNavigate();
  const [hoveredCard, setHoveredCard] = useState(null);

  const handleTemplateClick = () => {
    navigate('/template-list');
  };

  const handleCustomTemplateClick = () => {
    navigate('/custom-view');
  };

 

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero section with gradient background */}
      <div className="bg-gradient-to-br from-blue-500 to-purple-600 text-white py-16">
        <div className="container mx-auto px-6">
          <h1 className="text-4xl font-bold mb-3">Choose Your Template</h1>
          <p className="text-xl opacity-90 max-w-2xl">
            Select a template type to get started with your notification quickly and efficiently
          </p>
        </div>
      </div>

      <div className="container mx-auto px-6 py-12 max-w-6xl">
        {/* Main template options */}
        <div className="grid md:grid-cols-2 gap-8 mb-16">
          {/* Standard Templates Card */}
          <div 
            className={`bg-white rounded-xl shadow-lg overflow-hidden transition-all duration-300 ${
              hoveredCard === 'standard' ? 'shadow-xl transform -translate-y-1' : ''
            }`}
            // onMouseEnter={() => setHoveredCard('standard')}
            onMouseLeave={() => setHoveredCard(null)}
          >
            <div className="h-2 bg-blue-500 w-full"></div>
            <div className="p-8">
              <div className="flex items-start">
                <div className="p-3 bg-blue-100 rounded-lg">
                  <FileText className="w-8 h-8 text-blue-600" />
                </div>
                <div className="ml-5">
                  <h2 className="text-2xl font-bold text-gray-800 mb-2">Standard Templates</h2>
                  <p className="text-gray-600 mb-6">
                    Ready-to-use templates with professional designs and structures for common use cases.
                  </p>
                  <ul className="mb-6 space-y-2">
                    <li className="flex items-center text-gray-600">
                      <div className="mr-2 text-blue-500"><Layout size={16} /></div>
                      <span> pre-designed templates</span>
                    </li>
                    <li className="flex items-center text-gray-600">
                      <div className="mr-2 text-blue-500"><Star size={16} /></div>
                      <span>Optimized for best practices</span>
                    </li>
                    <li className="flex items-center text-gray-600">
                      <div className="mr-2 text-blue-500"><Clock size={16} /></div>
                      <span>Quick setup - ready in minutes</span>
                    </li>
                  </ul>
                  <button 
                    onClick={handleTemplateClick}
                    className="flex items-center text-white bg-blue-600 px-6 py-3 rounded-lg font-medium hover:bg-blue-700  hover:scale-105 transition-transform duration-300"
                  >
                    Browse Templates
                    <ChevronRight className="ml-1 w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Custom Templates Card */}
          <div 
            className={`bg-white rounded-xl shadow-md overflow-hidden transition-all duration-300 ${
              hoveredCard === 'custom' ? 'shadow-xl transform -translate-y-1' : ''
            }`}
            // onMouseEnter={() => setHoveredCard('custom')}
            onMouseLeave={() => setHoveredCard(null)}
          >
            <div className="h-2 bg-purple-500 w-full"></div>
            <div className="p-8">
              <div className="flex items-start">
                <div className="p-3 bg-purple-100 rounded-lg">
                  <Edit className="w-8 h-8 text-purple-600" />
                </div>
                <div className="ml-5">
                  <h2 className="text-2xl font-bold text-gray-800 mb-2">Custom Templates</h2>
                  <p className="text-gray-600 mb-6">
                    Build your own templates from scratch with full customization options for any purpose.
                  </p>
                  <ul className="mb-6 space-y-2">
                    <li className="flex items-center text-gray-600">
                      <div className="mr-2 text-purple-500"><Edit size={16} /></div>
                      <span>Full design flexibility</span>
                    </li>
                    <li className="flex items-center text-gray-600">
                      <div className="mr-2 text-purple-500"><Layout size={16} /></div>
                      <span>Advanced layout controls</span>
                    </li>
                    <li className="flex items-center text-gray-600">
                      <div className="mr-2 text-purple-500"><Star size={16} /></div>
                      <span>Save your designs for reuse</span>
                    </li>
                  </ul>
                  <button 
                    onClick={handleCustomTemplateClick}
                    className="flex items-center text-white bg-purple-600 px-6 py-3 rounded-lg font-medium hover:bg-purple-700  hover:scale-105 transition-transform duration-300"
                  >
                    Create Custom Template
                    <ChevronRight className="ml-1 w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        
      </div>
    </div>
  );
};

export default TemplateSelectionPage;