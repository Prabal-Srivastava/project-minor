import { useNavigate } from "react-router-dom"
import { Shield, CheckCircle, AlertTriangle, Mail, MapPin, ArrowLeft } from "lucide-react"

export default function PrivacyPolicyPage() {
  const navigate = useNavigate()
  
  const sections = [
    {
      title: "1. Introduction",
      icon: <Shield size={24} className="text-red-600" />,
      content: "At propnews24, we take your privacy and the integrity of our content seriously. This policy outlines how we handle your data and the standards we maintain for our news coverage.",
    },
    {
      title: "2. News Guidelines",
      icon: <CheckCircle size={24} className="text-green-600" />,
      list: [
        { label: "Accuracy", text: "We strive to verify all facts before publication." },
        { label: "Fairness", text: "We present multiple viewpoints on controversial issues." },
        { label: "Independence", text: "Our editorial decisions are free from outside influence." },
        { label: "Respect", text: "We avoid sensationalism and respect the dignity of individuals." },
      ],
    },
    {
      title: "3. Data Collection",
      icon: <Shield size={24} className="text-blue-600" />,
      content: "We collect minimal personal information necessary to provide our services, such as when you create an account, subscribe to our newsletter, or contact us. This may include your name, email address, and usage data.",
    },
    {
      title: "4. Content Policy",
      icon: <AlertTriangle size={24} className="text-orange-600" />,
      content: "propnews24 is committed to maintaining a safe environment. We strictly prohibit:",
      list: [
        { text: "Hate speech or harassment." },
        { text: "Adult or sexually explicit content." },
        { text: "Misinformation or fake news." },
        { text: "Content that promotes violence or illegal acts." },
      ],
    },
    {
      title: "5. Contact Us",
      icon: <Mail size={24} className="text-red-600" />,
      content: "If you have any questions about this Privacy Policy or our News Guidelines, please contact us at:",
      contact: true,
    },
  ]

  return (
    <div className="pb-12 fade-in">
      <button 
        onClick={() => navigate(-1)} 
        className="mb-6 flex items-center gap-2 text-gray-500 hover:text-red-600 transition-colors bg-transparent border-0 cursor-pointer text-sm font-medium"
      >
        <ArrowLeft size={16} /> Back
      </button>

      <div className="max-w-4xl mx-auto bg-white rounded-3xl shadow-2xl p-8 md:p-12 border border-gray-100">
        <div className="text-center mb-10">
          <div className="w-16 h-16 bg-gradient-to-br from-red-600 to-orange-500 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
            <Shield size={28} className="text-white" />
          </div>
          <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-3 tracking-tight">
            Privacy Policy & News Guidelines
          </h1>
          <p className="text-gray-500">Your privacy and trust matter to us</p>
        </div>

        <div className="flex flex-col gap-8">
          {sections.map((section, i) => (
            <section 
              key={section.title} 
              className="fade-in-up"
              style={{ animationDelay: `${i * 100}ms` }}
            >
              <div className="flex items-start gap-3 mb-4">
                <div className="shrink-0 mt-1">{section.icon}</div>
                <h2 className="text-2xl font-bold text-gray-900">{section.title}</h2>
              </div>
              {section.content && <p className="text-gray-600 leading-relaxed text-lg ml-11">{section.content}</p>}
              {section.list && (
                <ul className="flex flex-col gap-3 text-gray-600 mt-4 ml-11">
                  {section.list.map((item, i) => (
                    <li key={i} className="flex items-start gap-3">
                      <CheckCircle size={16} className="text-green-500 shrink-0 mt-1" />
                      <span>
                        {item.label && <strong className="text-gray-900">{item.label}: </strong>}
                        {item.text}
                      </span>
                    </li>
                  ))}
                </ul>
              )}
              {section.contact && (
                <div className="mt-4 p-6 bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl flex flex-col gap-3 ml-11 border border-gray-200">
                  <div className="flex items-center gap-3">
                    <Mail size={18} className="text-red-600" />
                    <div>
                      <p className="text-xs text-gray-500 font-semibold uppercase tracking-wide">Email</p>
                      <p className="text-gray-900 font-medium">admin@propnews.com</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <MapPin size={18} className="text-red-600" />
                    <div>
                      <p className="text-xs text-gray-500 font-semibold uppercase tracking-wide">Address</p>
                      <p className="text-gray-900 font-medium">Lucknow, Uttar Pradesh, India</p>
                    </div>
                  </div>
                </div>
              )}
            </section>
          ))}
        </div>

        <div className="pt-8 text-sm text-gray-400 border-t border-gray-200 mt-10 text-center">
          Last updated: {new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}
        </div>
      </div>
    </div>
  )
}
