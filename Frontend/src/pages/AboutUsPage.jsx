import { useNavigate } from "react-router-dom"
import { Target, Lightbulb, Users, Heart, ArrowLeft, Newspaper } from "lucide-react"

const values = [
  { title: "Integrity", description: "We are committed to truth and transparency in every story we tell.", icon: <Target size={32} className="text-red-600" /> },
  { title: "Innovation", description: "Leveraging technology to deliver news faster and more effectively.", icon: <Lightbulb size={32} className="text-red-600" /> },
  { title: "Community", description: "Building a platform that respects and engages with our diverse audience.", icon: <Users size={32} className="text-red-600" /> },
]

export default function AboutUsPage() {
  const navigate = useNavigate()
  
  return (
    <div className="pb-12 fade-in">
      <button 
        onClick={() => navigate(-1)} 
        className="mb-6 flex items-center gap-2 text-gray-500 hover:text-red-600 transition-colors bg-transparent border-0 cursor-pointer text-sm font-medium"
      >
        <ArrowLeft size={16} /> Back
      </button>

      <div className="max-w-4xl mx-auto flex flex-col gap-12">
        {/* Hero */}
        <div className="text-center flex flex-col gap-4">
          <div className="w-20 h-20 bg-gradient-to-br from-red-600 to-orange-500 rounded-3xl flex items-center justify-center mx-auto mb-2 shadow-xl">
            <Newspaper size={36} className="text-white" />
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 tracking-tight">
            About <span className="text-red-600">propnews24</span>
          </h1>
          <p className="text-xl text-gray-500 max-w-2xl mx-auto">Delivering the truth, empowering the informed.</p>
        </div>

        {/* Mission */}
        <div className="bg-white rounded-3xl shadow-xl p-8 md:p-12 border border-gray-100">
          <p className="text-gray-600 leading-relaxed mb-6 text-lg">
            Welcome to <strong className="text-red-600">propnews24</strong>, your premier destination for reliable, real-time news coverage. Founded with a vision to bring clarity to a complex world, we are dedicated to providing accurate, unbiased, and comprehensive reporting on the stories that matter most.
          </p>
          <p className="text-gray-600 leading-relaxed mb-6 text-lg">
            Headquartered in the historic city of <strong className="text-red-600">Lucknow</strong>, we bridge the gap between local insights and global perspectives. Our team of dedicated journalists and analysts work around the clock to ensure you stay ahead of the curve.
          </p>
          <div className="bg-red-50 border-l-4 border-red-600 p-6 rounded-r-xl mt-8">
            <h3 className="text-2xl font-bold text-gray-900 mb-3 flex items-center gap-2">
              <Heart size={24} className="text-red-600" />
              Our Mission
            </h3>
            <p className="text-gray-700 leading-relaxed text-lg">
              To empower our readers with factual information, foster meaningful dialogue, and uphold the highest standards of journalistic integrity. We believe in the power of information to drive positive change.
            </p>
          </div>
        </div>

        {/* Values */}
        <div>
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-8">Our Core Values</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {values.map((v, i) => (
              <div 
                key={v.title} 
                className="bg-white p-8 rounded-2xl shadow-lg border border-gray-100 hover:shadow-xl hover:-translate-y-1 transition-all fade-in-up"
                style={{ animationDelay: `${i * 100}ms` }}
              >
                <div className="mb-4">{v.icon}</div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">{v.title}</h3>
                <p className="text-gray-600 leading-relaxed">{v.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className="text-center pt-8 bg-gradient-to-br from-gray-900 to-gray-800 rounded-3xl p-12 text-white relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-red-600/20 rounded-full blur-3xl" />
          <div className="relative z-10">
            <h2 className="text-3xl font-bold mb-4">Join Our Journey</h2>
            <p className="text-gray-300 mb-8 max-w-xl mx-auto">We are always looking for passionate individuals to join our growing team in Lucknow.</p>
            <a
              href="/contact"
              className="inline-flex items-center gap-2 px-8 py-4 bg-red-600 text-white font-bold rounded-xl no-underline shadow-xl hover:bg-red-700 hover:shadow-2xl hover:-translate-y-0.5 transition-all"
            >
              <Heart size={18} />
              Get in Touch
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}
