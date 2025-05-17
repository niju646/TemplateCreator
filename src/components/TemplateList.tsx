

"use client"

import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import {
  PlusCircle,
  Edit,
  Trash2,
  Search,
  AlertCircle,
  Filter,
  Clock,
  ChevronDown,
  SortAsc,
  SortDesc,
  Calendar,
  List,
  Grid,
} from "lucide-react"
import toast from "react-hot-toast"

interface Template {
  id: number
  name: string
  description: string
  content: string
  createddate: string
  updateddate: string
}

const TemplateList = () => {
  const navigate = useNavigate()
  const [searchTerm, setSearchTerm] = useState("")
  const [templates, setTemplates] = useState<Template[]>([])
  const [deleteConfirm, setDeleteConfirm] = useState<number | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [view, setView] = useState<"grid" | "list">("grid")
  const [sortField, setSortField] = useState<"name" | "createddate">("createddate")
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc")
  const [filterDropdownOpen, setFilterDropdownOpen] = useState(false)

  useEffect(() => {
    fetchTemplates()
  }, [])

  const fetchTemplates = async () => {
    try {
      setLoading(true)
      const response = await fetch("http://localhost:3001/api/templates")
      if (!response.ok) throw new Error("Failed to fetch templates")
      const data = await response.json()
      setTemplates(data)
    } catch (err) {
      setError("Error fetching templates")
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id: number) => {
    try {
      const response = await fetch(`http://localhost:3001/api/templates/${id}`, {
        method: "DELETE",
      })
      if (!response.ok) throw new Error("Failed to delete template")
      setTemplates(templates.filter((template) => template.id !== id))
      setDeleteConfirm(null)
      toast.success("Template deleted successfully")
    } catch (err) {
      setError("Error deleting template")
      toast.error("Failed to delete template")
    }
  }

  const toggleSort = (field: "name" | "createddate") => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc")
    } else {
      setSortField(field)
      setSortDirection("asc")
    }
  }

  const getSortedTemplates = () => {
    const filtered = templates.filter(
      (template) =>
        template.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        template.description.toLowerCase().includes(searchTerm.toLowerCase()),
    )

    return filtered.sort((a, b) => {
      if (sortField === "name") {
        return sortDirection === "asc" ? a.name.localeCompare(b.name) : b.name.localeCompare(a.name)
      } else {
        return sortDirection === "asc"
          ? new Date(a.createddate).getTime() - new Date(b.createddate).getTime()
          : new Date(b.createddate).getTime() - new Date(a.createddate).getTime()
      }
    })
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return new Intl.DateTimeFormat("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    }).format(date)
  }

  const filteredTemplates = getSortedTemplates()

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-pulse flex flex-col items-center">
          <div className="w-12 h-12 rounded-full bg-purple-200 mb-3"></div>
          <div className="h-4 w-24 bg-purple-200 rounded"></div>
        </div>
      </div>
    )
  }

  const truncateText = (text: string, maxLength: number) => {
    if (text.length <= maxLength) return text
    return text.slice(0, maxLength) + "..."
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-12">
      {/* Header with gradient background */}
      <div className="bg-gradient-to-r from-purple-600 to-violet-500 text-white py-14">
        <div className="container mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <h1 className="text-3xl font-bold mb-2">My Templates</h1>
              <p className="text-purple-100">Manage and organize all your templates</p>
            </div>
            <button
              onClick={() => navigate("/create")}
              className="flex items-center bg-white text-purple-600 px-5 py-3 rounded-lg hover:bg-purple-50 shadow-md font-medium transition-all duration-300 hover:translate-y-[-2px]"
            >
              <PlusCircle className="mr-2 h-5 w-5" />
              Create Template
            </button>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 -mt-8">
        {/* Search and filter bar */}
        <div className="bg-white rounded-xl shadow-lg p-5 mb-8 border border-gray-100">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-grow">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Search templates..."
                className="pl-10 pr-4 py-3 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none transition-all"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            <div className="flex gap-3">
              <div className="relative">
                <button
                  className="flex items-center px-4 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                  onClick={() => setFilterDropdownOpen(!filterDropdownOpen)}
                >
                  <Filter className="h-5 w-5 mr-2 text-gray-500" />
                  <span className="text-gray-700">Sort by</span>
                  <ChevronDown className="h-4 w-4 ml-2 text-gray-500" />
                </button>

                {filterDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-xl z-10 border border-gray-200 overflow-hidden">
                    <div className="py-1">
                      <button
                        className={`flex items-center px-4 py-3 w-full text-left hover:bg-gray-100 ${sortField === "name" ? "text-purple-600 bg-purple-50" : "text-gray-700"}`}
                        onClick={() => {
                          toggleSort("name")
                          setFilterDropdownOpen(false)
                        }}
                      >
                        <span className="flex-grow">Name</span>
                        {sortField === "name" &&
                          (sortDirection === "asc" ? (
                            <SortAsc className="h-4 w-4" />
                          ) : (
                            <SortDesc className="h-4 w-4" />
                          ))}
                      </button>
                      <button
                        className={`flex items-center px-4 py-3 w-full text-left hover:bg-gray-100 ${sortField === "createddate" ? "text-purple-600 bg-purple-50" : "text-gray-700"}`}
                        onClick={() => {
                          toggleSort("createddate")
                          setFilterDropdownOpen(false)
                        }}
                      >
                        <span className="flex-grow">Date Created</span>
                        {sortField === "createddate" &&
                          (sortDirection === "asc" ? (
                            <SortAsc className="h-4 w-4" />
                          ) : (
                            <SortDesc className="h-4 w-4" />
                          ))}
                      </button>
                    </div>
                  </div>
                )}
              </div>

              <div className="flex border border-gray-300 rounded-lg overflow-hidden">
                <button
                  className={`p-3 ${view === "grid" ? "bg-purple-50 text-purple-600" : "bg-white text-gray-500"} transition-colors`}
                  onClick={() => setView("grid")}
                  title="Grid view"
                >
                  <Grid className="h-5 w-5" />
                </button>
                <button
                  className={`p-3 ${view === "list" ? "bg-purple-50 text-purple-600" : "bg-white text-gray-500"} transition-colors`}
                  onClick={() => setView("list")}
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
          </div>
        )}

        {filteredTemplates.length > 0 ? (
          view === "grid" ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredTemplates.map((template) => (
                <div
                  key={template.id}
                  className="bg-white rounded-xl shadow-md border border-gray-100 overflow-hidden hover:shadow-lg transition-all duration-300 hover:translate-y-[-2px]"
                >
                  <div className="h-2 bg-gradient-to-r from-purple-500 to-violet-500 w-full"></div>
                  <div className="p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">{template.name}</h3>
                    <p className="text-gray-600 text-sm mb-4 h-12 line-clamp-2">
                      {truncateText(template.description, 100)}
                    </p>
                    <div className="flex items-center text-xs text-gray-500 mb-4">
                      <Calendar className="h-3.5 w-3.5 mr-1.5" />
                      {formatDate(template.createddate)}
                    </div>
                    <div className="flex justify-between items-center">
                      <button
                        onClick={() => navigate(`/edit/${template.id}`)}
                        className="text-purple-600 hover:bg-purple-50 px-3 py-2 rounded-md flex items-center text-sm font-medium transition-colors"
                      >
                        <Edit className="h-4 w-4 mr-1.5" />
                        Edit
                      </button>

                      {deleteConfirm === template.id ? (
                        <div className="flex space-x-2">
                          <button
                            onClick={() => handleDelete(template.id)}
                            className="text-red-600 hover:bg-red-50 px-3 py-2 rounded-md text-sm font-medium transition-colors"
                          >
                            Confirm
                          </button>
                          <button
                            onClick={() => setDeleteConfirm(null)}
                            className="text-gray-600 hover:bg-gray-50 px-3 py-2 rounded-md text-sm transition-colors"
                          >
                            Cancel
                          </button>
                        </div>
                      ) : (
                        <button
                          onClick={() => setDeleteConfirm(template.id)}
                          className="text-red-600 hover:bg-red-50 px-3 py-2 rounded-md flex items-center text-sm font-medium transition-colors"
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
            <div className="bg-white shadow-md rounded-xl border border-gray-100 overflow-hidden">
              <table className="w-full">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-200">
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Name
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Description
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Created
                    </th>
                    <th className="px-6 py-4 text-right text-xs font-medium text-gray-500 uppercase tracking-wider pr-8">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {filteredTemplates.map((template) => (
                    <tr key={template.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-5">
                        <div className="flex items-center">
                          <div className="h-10 w-10 flex-shrink-0 rounded-full bg-purple-100 flex items-center justify-center">
                            <span className="font-semibold text-purple-600">
                              {template.name.charAt(0).toUpperCase()}
                            </span>
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">{template.name}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-5">
                        <div className="text-sm text-gray-600 line-clamp-1 max-w-xs">{template.description}</div>
                      </td>
                      <td className="px-6 py-5">
                        <div className="text-sm text-gray-600">
                          <div className="flex items-center">
                            <Clock className="h-3.5 w-3.5 mr-1.5 text-gray-400" />
                            {new Date(template.createddate).toLocaleDateString()}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-5 text-right text-sm font-medium whitespace-nowrap">
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
                          <div className="flex justify-end space-x-3">
                            <button
                              onClick={() => navigate(`/edit/${template.id}`)}
                              className="text-purple-600 hover:text-purple-800 p-2 hover:bg-purple-50 rounded-full transition-colors"
                              title="Edit template"
                            >
                              <Edit className="h-5 w-5" />
                            </button>

                            <button
                              onClick={() => setDeleteConfirm(template.id)}
                              className="text-red-600 hover:text-red-800 p-2 hover:bg-red-50 rounded-full transition-colors"
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
          )
        ) : (
          <div className="bg-white shadow-md rounded-xl p-12 text-center border border-gray-100">
            <div className="flex flex-col items-center max-w-md mx-auto">
              <div className="p-5 bg-purple-50 rounded-full mb-5">
                <AlertCircle className="h-12 w-12 text-purple-500" />
              </div>
              <h3 className="text-xl font-medium text-gray-900 mb-3">No templates found</h3>
              <p className="text-gray-600 mb-6">
                {searchTerm
                  ? `No results for "${searchTerm}". Try adjusting your search term.`
                  : "You haven't created any templates yet. Create your first template to get started."}
              </p>
              {searchTerm ? (
                <button onClick={() => setSearchTerm("")} className="text-purple-600 hover:text-purple-800 font-medium">
                  Clear search
                </button>
              ) : (
                <button
                  onClick={() => navigate("/create")}
                  className="bg-gradient-to-r from-purple-600 to-violet-500 text-white px-6 py-3 rounded-lg hover:opacity-90 transition-opacity flex items-center shadow-md"
                >
                  <PlusCircle className="mr-2 h-5 w-5" />
                  Create your first template
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default TemplateList
