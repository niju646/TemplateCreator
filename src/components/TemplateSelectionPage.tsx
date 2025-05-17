


"use client"

import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { FileText, Edit, ChevronRight, Layout, Star, Clock } from "lucide-react"

const TemplateSelectionPage = () => {
  const navigate = useNavigate()
  const [hoveredCard, setHoveredCard] = useState<string | null>(null)

  const handleTemplateClick = () => {
    navigate("/template-list")
  }

  const handleCustomTemplateClick = () => {
    navigate("/custom-view")
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero section with gradient background */}
      <div className="bg-gradient-to-r from-purple-600 to-violet-500 text-white py-20">
        <div className="container mx-auto px-6">
          <h1 className="text-4xl font-bold mb-4">Choose Your Template</h1>
          <p className="text-xl text-purple-100 max-w-2xl">
            Select a template type to get started with your notification quickly and efficiently
          </p>
        </div>
      </div>

      <div className="container mx-auto px-6 py-16 max-w-6xl -mt-8">
        {/* Main template options */}
        <div className="grid md:grid-cols-2 gap-8 mb-16">
          {/* Standard Templates Card */}
          <div
            className={`bg-white rounded-xl shadow-md overflow-hidden transition-all duration-300 border border-gray-100 ${
              hoveredCard === "standard" ? "shadow-xl transform -translate-y-2" : ""
            }`}
            onMouseEnter={() => setHoveredCard("standard")}
            onMouseLeave={() => setHoveredCard(null)}
          >
            <div className="h-2 bg-gradient-to-r from-purple-500 to-violet-500 w-full"></div>
            <div className="p-8">
              <div className="flex flex-col md:flex-row md:items-start">
                <div className="p-4 bg-purple-100 rounded-lg mb-5 md:mb-0">
                  <FileText className="w-8 h-8 text-purple-600" />
                </div>
                <div className="md:ml-6">
                  <h2 className="text-2xl font-bold text-gray-800 mb-3">Standard Templates</h2>
                  <p className="text-gray-600 mb-6">
                    Ready-to-use templates with professional designs and structures for common use cases.
                  </p>
                  <ul className="mb-8 space-y-3">
                    <li className="flex items-center text-gray-600">
                      <div className="mr-3 text-purple-500">
                        <Layout size={18} />
                      </div>
                      <span>Pre-designed templates</span>
                    </li>
                    <li className="flex items-center text-gray-600">
                      <div className="mr-3 text-purple-500">
                        <Star size={18} />
                      </div>
                      <span>Optimized for best practices</span>
                    </li>
                    <li className="flex items-center text-gray-600">
                      <div className="mr-3 text-purple-500">
                        <Clock size={18} />
                      </div>
                      <span>Quick setup - ready in minutes</span>
                    </li>
                  </ul>
                  <button
                    onClick={handleTemplateClick}
                    className="flex items-center text-white bg-gradient-to-r from-purple-600 to-violet-500 px-6 py-3 rounded-lg font-medium hover:opacity-90 transition-all duration-300 shadow-md"
                  >
                    Browse Templates
                    <ChevronRight className="ml-2 w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Custom Templates Card */}
          <div
            className={`bg-white rounded-xl shadow-md overflow-hidden transition-all duration-300 border border-gray-100 ${
              hoveredCard === "custom" ? "shadow-xl transform -translate-y-2" : ""
            }`}
            onMouseEnter={() => setHoveredCard("custom")}
            onMouseLeave={() => setHoveredCard(null)}
          >
            <div className="h-2 bg-gradient-to-r from-purple-500 to-violet-500 w-full"></div>
            <div className="p-8">
              <div className="flex flex-col md:flex-row md:items-start">
                <div className="p-4 bg-purple-100 rounded-lg mb-5 md:mb-0">
                  <Edit className="w-8 h-8 text-purple-600" />
                </div>
                <div className="md:ml-6">
                  <h2 className="text-2xl font-bold text-gray-800 mb-3">Custom Templates</h2>
                  <p className="text-gray-600 mb-6">
                    Build your own templates from scratch with full customization options for any purpose.
                  </p>
                  <ul className="mb-8 space-y-3">
                    <li className="flex items-center text-gray-600">
                      <div className="mr-3 text-purple-500">
                        <Edit size={18} />
                      </div>
                      <span>Full design flexibility</span>
                    </li>
                    <li className="flex items-center text-gray-600">
                      <div className="mr-3 text-purple-500">
                        <Layout size={18} />
                      </div>
                      <span>Advanced layout controls</span>
                    </li>
                    <li className="flex items-center text-gray-600">
                      <div className="mr-3 text-purple-500">
                        <Star size={18} />
                      </div>
                      <span>Save your designs for reuse</span>
                    </li>
                  </ul>
                  <button
                    onClick={handleCustomTemplateClick}
                    className="flex items-center text-white bg-gradient-to-r from-purple-600 to-violet-500 px-6 py-3 rounded-lg font-medium hover:opacity-90 transition-all duration-300 shadow-md"
                  >
                    Create Custom Template
                    <ChevronRight className="ml-2 w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default TemplateSelectionPage
