import { useState, useEffect } from "react"
import { BarChart3, CheckCircle, TrendingUp } from "lucide-react"
import api from "../config/axios"

export default function PollOfTheDay() {
  const [poll, setPoll] = useState(null)
  const [loading, setLoading] = useState(true)
  const [voting, setVoting] = useState(false)
  const [selectedOption, setSelectedOption] = useState(null)
  const [hasVoted, setHasVoted] = useState(false)
  const [showResults, setShowResults] = useState(false)
  const isAuthenticated = !!localStorage.getItem("token")

  useEffect(() => {
    api.get("/api/v1/user/polls/today")
      .then((r) => {
        if (r.data.success) {
          setPoll(r.data.data)
          setHasVoted(r.data.data.hasVoted || false)
          setShowResults(r.data.data.hasVoted || false)
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  const handleVote = async () => {
    if (!isAuthenticated) { alert("Please login to vote"); return }
    if (selectedOption === null) { alert("Please select an option"); return }
    setVoting(true)
    try {
      const r = await api.post(`/api/v1/user/polls/${poll._id}/vote`, { optionIndex: selectedOption })
      if (r.data.success) {
        setPoll(r.data.data)
        setHasVoted(true)
        setShowResults(true)
      }
    } catch (err) {
      alert(err.response?.data?.message || "Failed to vote")
    } finally {
      setVoting(false)
    }
  }

  const getPercentage = (votes) => {
    if (!poll || poll.totalVotes === 0) return 0
    return ((votes / poll.totalVotes) * 100).toFixed(1)
  }

  const getWinningOption = () => {
    if (!poll?.options?.length) return null
    return poll.options.reduce((max, opt) => (opt.votes > max.votes ? opt : max), poll.options[0])
  }

  if (loading) {
    return (
      <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
        <div className="skeleton h-6 w-32 mb-4 rounded" />
        <div className="skeleton h-4 w-full mb-3 rounded" />
        {[1, 2, 3].map((i) => <div key={i} className="skeleton h-10 w-full mb-2 rounded-xl" />)}
      </div>
    )
  }

  if (!poll) return null

  const winningOption = getWinningOption()

  return (
    <div className="bg-gradient-to-br from-white to-gray-50 rounded-2xl p-6 border border-gray-200 shadow-lg fade-in">
      <div className="flex items-center gap-2 mb-4">
        <div className="w-10 h-10 bg-gradient-to-br from-purple-600 to-purple-500 rounded-xl flex items-center justify-center">
          <BarChart3 size={20} className="text-white" />
        </div>
        <div>
          <p className="text-xs font-bold uppercase tracking-widest text-purple-600">Poll of the Day</p>
          <p className="text-xs text-gray-500">{poll.totalVotes} vote{poll.totalVotes !== 1 ? "s" : ""}</p>
        </div>
      </div>

      <h3 className="text-lg font-bold text-gray-900 mb-4 leading-snug">{poll.question}</h3>

      <div className="flex flex-col gap-2 mb-4">
        {poll.options.map((option, index) => {
          const percentage = getPercentage(option.votes)
          const isWinning = showResults && winningOption && option.text === winningOption.text && poll.totalVotes > 0
          const isSelected = selectedOption === index

          return (
            <div key={index} className="relative">
              {showResults ? (
                <div className="relative overflow-hidden rounded-xl border border-gray-200 bg-white">
                  <div
                    className={`absolute inset-0 transition-all duration-500 ${isWinning ? "bg-gradient-to-r from-purple-100 to-purple-50" : "bg-gray-50"}`}
                    style={{ width: `${percentage}%` }}
                  />
                  <div className="relative px-4 py-3 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      {isWinning && <TrendingUp size={14} className="text-purple-600" />}
                      <span className={`text-sm font-medium ${isWinning ? "text-purple-900" : "text-gray-700"}`}>{option.text}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className={`text-sm font-bold ${isWinning ? "text-purple-600" : "text-gray-600"}`}>{percentage}%</span>
                      <span className="text-xs text-gray-400">({option.votes})</span>
                    </div>
                  </div>
                </div>
              ) : (
                <button
                  onClick={() => setSelectedOption(index)}
                  disabled={hasVoted}
                  className={`w-full px-4 py-3 rounded-xl border-2 text-left text-sm font-medium transition-all cursor-pointer ${
                    isSelected ? "border-purple-600 bg-purple-50 text-purple-900" : "border-gray-200 bg-white text-gray-700 hover:border-purple-300 hover:bg-purple-50/50"
                  } ${hasVoted ? "opacity-50 cursor-not-allowed" : ""}`}
                >
                  <div className="flex items-center justify-between">
                    <span>{option.text}</span>
                    {isSelected && <CheckCircle size={16} className="text-purple-600" />}
                  </div>
                </button>
              )}
            </div>
          )
        })}
      </div>

      {!showResults && (
        <button
          onClick={handleVote}
          disabled={voting || hasVoted || selectedOption === null}
          className="w-full px-4 py-3 bg-gradient-to-r from-purple-600 to-purple-500 text-white font-bold rounded-xl border-0 cursor-pointer transition-all hover:from-purple-700 hover:to-purple-600 hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          {voting ? (
            <><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Voting...</>
          ) : (
            <><CheckCircle size={16} /> {hasVoted ? "Already Voted" : "Submit Vote"}</>
          )}
        </button>
      )}

      {showResults && (
        <button
          onClick={() => setShowResults(false)}
          className="w-full px-4 py-2 text-sm text-purple-600 font-semibold bg-purple-50 border border-purple-200 rounded-xl hover:bg-purple-100 transition-colors cursor-pointer"
        >
          Hide Results
        </button>
      )}
    </div>
  )
}
