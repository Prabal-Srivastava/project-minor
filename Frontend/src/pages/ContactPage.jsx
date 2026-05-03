import { useState } from "react"
import { Mail, MapPin, Phone, Send, ArrowLeft, MessageSquare } from "lucide-react"
import { useNavigate } from "react-router-dom"

export default function ContactPage() {
  const navigate = useNavigate()
  const [formData, setFormData] = useState({ name: "", email: "", subject: "", message: "" })
  const [loading, setLoading] = useState(false)

  const handleSubmit = (e) => {
    e.preventDefault()
    setLoading(true)
    setTimeout(() => {
      alert("Thank you for your message! We will get back to you soon.")
      setFormData({ name: "", email: "", subject: "", message: "" })
      setLoading(false)
    }, 1000)
  }

  const handleChange = (e) => setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }))

  return (
    <div className="pb-12 fade-in">
      <button 
        onClick={() => navigate(-1)} 
        className="mb-6 flex items-center gap-2 text-gray-500 hover:text-red-600 transition-colors bg-transparent border-0 cursor-pointer text-sm font-medium"
      >
        <ArrowLeft size={16} /> Back
      </button>

      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-12">
          <div className="w-16 h-16 bg-gradient-to-br from-red-600 to-orange-500 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
            <MessageSquare size={28} className="text-white" />
          </div>
          <h1 className="text-4xl font-extrabold text-gray-900 mb-4 tracking-tight">Contact Us</h1>
          <p className="text-lg text-gray-500">Have questions? We'd love to hear from you.</p>
        </div>

        <div className="bg-white rounded-3xl shadow-2xl overflow-hidden border border-gray-100">
          <div className="grid grid-cols-1 md:grid-cols-2">
            {/* Info panel */}
            <div className="p-10 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white relative overflow-hidden">
              <div className="absolute top-0 right-0 w-64 h-64 bg-red-600/10 rounded-full blur-3xl" />
              <div className="relative z-10">
                <h3 className="text-2xl font-bold mb-8">Contact Information</h3>
                <div className="flex flex-col gap-8">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-red-600/20 rounded-xl flex items-center justify-center shrink-0">
                      <Mail size={20} className="text-red-400" />
                    </div>
                    <div>
                      <p className="font-semibold mb-1 text-lg">Email</p>
                      <a href="mailto:admin@propnews.com" className="text-gray-300 no-underline hover:text-white transition-colors">
                        admin@propnews.com
                      </a>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-red-600/20 rounded-xl flex items-center justify-center shrink-0">
                      <MapPin size={20} className="text-red-400" />
                    </div>
                    <div>
                      <p className="font-semibold mb-1 text-lg">Location</p>
                      <p className="text-gray-300">Lucknow, Uttar Pradesh,<br />India</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-red-600/20 rounded-xl flex items-center justify-center shrink-0">
                      <Phone size={20} className="text-red-400" />
                    </div>
                    <div>
                      <p className="font-semibold mb-1 text-lg">Phone</p>
                      <p className="text-gray-300">+91 (XXX) XXX-XXXX</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Form panel */}
            <div className="p-10">
              <form onSubmit={handleSubmit} className="flex flex-col gap-6">
                {[
                  { id: "name", label: "Name", type: "text", placeholder: "Your name" },
                  { id: "email", label: "Email", type: "email", placeholder: "your@email.com" },
                  { id: "subject", label: "Subject", type: "text", placeholder: "How can we help?" },
                ].map(({ id, label, type, placeholder }) => (
                  <div key={id} className="flex flex-col gap-2">
                    <label htmlFor={id} className="text-sm font-bold text-gray-900">{label}</label>
                    <input
                      id={id}
                      type={type}
                      name={id}
                      value={formData[id]}
                      onChange={handleChange}
                      required
                      placeholder={placeholder}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl text-base outline-none transition-all focus:ring-4 focus:ring-red-500/10 focus:border-red-500 hover:border-gray-400"
                    />
                  </div>
                ))}
                <div className="flex flex-col gap-2">
                  <label htmlFor="message" className="text-sm font-bold text-gray-900">Message</label>
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    required
                    rows={5}
                    placeholder="Write your message here..."
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl text-base outline-none resize-none transition-all focus:ring-4 focus:ring-red-500/10 focus:border-red-500 hover:border-gray-400"
                  />
                </div>
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-gradient-to-r from-red-600 to-red-500 text-white font-bold py-3.5 rounded-xl border-0 cursor-pointer transition-all hover:from-red-700 hover:to-red-600 hover:shadow-xl hover:-translate-y-0.5 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Sending...
                    </>
                  ) : (
                    <>
                      <Send size={16} />
                      Send Message
                    </>
                  )}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
