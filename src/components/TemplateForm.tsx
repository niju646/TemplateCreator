

"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useNavigate, useParams } from "react-router-dom"
import toast from "react-hot-toast"
import RichTextEditor from "./RichTextEditor"
import { ArrowLeftCircle, Save, X, Loader2, AlertCircle } from "lucide-react"

import Popup from "../features/Popup"

interface Template {
  id: number
  name: string
  description: string
  content: string
  createddate: string
  updateddate: string
}

const TemplateForm: React.FC = () => {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const [template, setTemplate] = useState<Partial<Template>>({
    name: "",
    description: "",
    content: "",
  })
  const [loading, setLoading] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [plainContent, setPlainContent] = useState<string>("")

  useEffect(() => {
    if (id) {
      fetchTemplate()
    }
  }, [id])

  const fetchTemplate = async () => {
    try {
      setLoading(true)
      const response = await fetch(`http://localhost:3001/api/templates/${id}`)
      if (!response.ok) throw new Error("Failed to fetch template")
      const data = await response.json()
      setTemplate(data)
      setPlainContent(data.content?.replace(/<[^>]*>/g, "") || "")
    } catch (err) {
      setError("Error fetching template")
      toast.error("Failed to load template")
    } finally {
      setLoading(false)
    }
  }

  const isFormValid = (): boolean => {
    return Boolean(template.name?.trim() && plainContent?.trim())
  }

  const handleSubmit = async (e: React.MouseEvent) => {
    e.preventDefault()

    if (!isFormValid()) {
      toast.error("Please fill in all required fields")
      return
    }

    try {
      setSubmitting(true)
      const method = id ? "PUT" : "POST"
      const url = id ? `http://localhost:3001/api/templates/${id}` : "http://localhost:3001/api/templates"

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: template.name,
          description: template.description,
          content: template.content,
        }),
      })

      if (!response.ok) throw new Error("Failed to save template")
      toast.success(id ? "Template updated successfully" : "Template created successfully")
      navigate("/template-list", { replace: true })
    } catch (err) {
      setError("Error saving template")
      toast.error("Failed to save template")
    } finally {
      setSubmitting(false)
    }
  }

  const handleContentChange = (htmlContent: string, plainTextContent: string) => {
    setTemplate({ ...template, content: htmlContent })
    setPlainContent(plainTextContent)
  }

  if (loading && !template.id) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-50">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin text-purple-600 mx-auto" />
          <p className="mt-4 text-lg text-gray-700">Loading template data...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-12">
      {/* Header with gradient background */}
      <div className="bg-gradient-to-r from-purple-600 to-violet-500 text-white py-14">
        <div className="container mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <h1 className="text-3xl font-bold mb-2">{id ? "Edit Template" : "Create Template"}</h1>
              <p className="text-purple-100">
                {id ? "Update your existing template" : "Create a new reusable template"}
              </p>
            </div>
            <button
              onClick={() => navigate("/template-list", { replace: true })}
              className="flex items-center bg-white/20 backdrop-blur-sm text-white border border-white/30 px-5 py-3 rounded-lg hover:bg-white/30 transition-colors shadow-md"
              type="button"
            >
              <ArrowLeftCircle className="mr-2 h-5 w-5" />
              Back to List
            </button>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6 max-w-4xl -mt-8">
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg flex items-center">
            <AlertCircle className="h-5 w-5 mr-2" />
            {error}
          </div>
        )}

        <div className="bg-white rounded-xl shadow-lg p-8 border border-gray-100">
          <form>
            <div className="space-y-8">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2" htmlFor="name">
                  Template Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="name"
                  value={template.name || ""}
                  onChange={(e) => {
                    setTemplate({ ...template, name: e.target.value })
                  }}
                  placeholder="Enter a descriptive name"
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none transition-all"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2" htmlFor="description">
                  Description
                </label>
                <textarea
                  id="description"
                  value={template.description || ""}
                  onChange={(e) => setTemplate({ ...template, description: e.target.value })}
                  placeholder="Add a detailed description of this template's purpose"
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 outline-none transition-all"
                  rows={3}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2" htmlFor="content">
                  Template Content <span className="text-red-500">*</span>
                </label>
                <div className="border border-gray-300 rounded-lg overflow-hidden shadow-sm">
                  <RichTextEditor content={template.content || ""} onChange={handleContentChange} />
                </div>
                {plainContent.length === 0 && <p className="text-sm text-red-500 mt-2">Template content is required</p>}
              </div>
            </div>

            <div className="mt-10 flex justify-end gap-4">
              <button
                onClick={() => navigate("/template-list")}
                className="px-6 py-3 rounded-lg border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 transition-colors flex items-center gap-2 font-medium"
                type="button"
              >
                <X className="w-4 h-4" />
                Cancel
              </button>
              <button
                onClick={handleSubmit}
                disabled={!isFormValid() || submitting}
                className={`px-6 py-3 rounded-lg bg-gradient-to-r from-purple-600 to-violet-500 text-white hover:opacity-90 transition-colors flex items-center gap-2 font-medium shadow-md ${
                  !isFormValid() || submitting ? "opacity-70 cursor-not-allowed" : ""
                }`}
                type="submit"
              >
                {submitting ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="w-5 h-5" />
                    Save Template
                  </>
                )}
              </button>
            </div>

            {/* popup */}
            <Popup />
          </form>
        </div>
      </div>
    </div>
  )
}

export default TemplateForm


