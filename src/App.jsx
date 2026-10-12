import { BrowserRouter, NavLink, Link, Navigate, Route, Routes, useNavigate } from 'react-router-dom'
import {
  ArrowRight,
  BookOpen,
  Briefcase,
  Calendar,
  CheckCircle2,
  GraduationCap,
  Search,
  Shield,
  Sparkles,
  Users,
  Zap,
} from 'lucide-react'
import { createContext, useCallback, useContext, useEffect, useState } from 'react'
import './App.css'
import api from './api'

const AuthContext = createContext(null)

function useAuth() {
  return useContext(AuthContext)
}

const students = [
  {
    id: 1,
    name: 'Alice Johnson',
    college: 'Northbridge University',
    course: 'Computer Science',
    teaching: ['Java', 'Spring Boot'],
    learning: ['Python', 'Machine Learning'],
    bio: 'Mentors junior developers and enjoys building backend systems.',
    availability: 'Evenings',
  },
  {
    id: 2,
    name: 'Bob Carter',
    college: 'City Tech Campus',
    course: 'Data Science',
    teaching: ['Python', 'Data Structures'],
    learning: ['Java', 'React'],
    bio: 'Passionate about helping peers learn data-first problem solving.',
    availability: 'Weekends',
  },
  {
    id: 3,
    name: 'Carol Lee',
    college: 'Lakeside Institute',
    course: 'HCI',
    teaching: ['UI/UX Design', 'React'],
    learning: ['Public Speaking', 'Spring Boot'],
    bio: 'Design-focused builder who enjoys converting ideas into clear experiences.',
    availability: 'Weekdays',
  },
]

const benefits = [
  { icon: Zap, title: 'Fast matching', text: 'Find students whose skills complement yours in minutes.' },
  { icon: Users, title: 'Peer accountability', text: 'Create a learning rhythm with real mutual goals and support.' },
  { icon: Shield, title: 'Safe exchange', text: 'Review profiles, request matches, and track learning progress transparently.' },
]

const steps = [
  'Create your profile and add teaching and learning goals.',
  'Search for complementary students with shared interests.',
  'Send a structured skill exchange request and schedule sessions.',
  'Track progress, complete exchanges, and leave reviews.',
]

function App() {
  const [user, setUser] = useState(() => {
    try {
      return JSON.parse(sessionStorage.getItem('skillswap-user') || 'null')
    } catch {
      sessionStorage.removeItem('skillswap-user')
      return null
    }
  })

  const login = (authResponse) => {
    sessionStorage.setItem('skillswap-token', authResponse.token)
    setUserProfile(authResponse.user)
  }

  const setUserProfile = (updatedUser) => {
    sessionStorage.setItem('skillswap-user', JSON.stringify(updatedUser))
    setUser(updatedUser)
  }

  const logout = useCallback(() => {
    sessionStorage.removeItem('skillswap-token')
    sessionStorage.removeItem('skillswap-user')
    setUser(null)
  }, [])

  return (
    <BrowserRouter>
      <AuthContext.Provider value={{ user, login, logout, setUserProfile }}>
        <div className="app-shell">
          <Header />
          <main className="main-content">
            <Routes>
              <Route path="/" element={<LandingPage />} />
              <Route path="/about" element={<AboutPage />} />
              <Route path="/browse" element={<BrowsePage />} />
              <Route path="/dashboard" element={<ProtectedRoute><DashboardPage /></ProtectedRoute>} />
              <Route path="/profile" element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />
              <Route path="*" element={<NotFoundPage />} />
            </Routes>
          </main>
          <Footer />
        </div>
      </AuthContext.Provider>
    </BrowserRouter>
  )
}

function ProtectedRoute({ children }) {
  const { user } = useAuth()
  return user ? children : <Navigate to="/login" replace />
}

function Header() {
  const { user, logout } = useAuth()
  const navLink = ({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')

  return (
    <header className="topbar">
      <div className="brand-wrap">
        <div className="brand-mark">S</div>
        <span>SkillSwap</span>
      </div>

      <nav className="nav" aria-label="Main navigation">
        <NavLink to="/" className={navLink}>Home</NavLink>
        <NavLink to="/about" className={navLink}>How it works</NavLink>
        <NavLink to="/browse" className={navLink}>Browse</NavLink>
        <NavLink to="/dashboard" className={navLink}>Dashboard</NavLink>
        {user && <NavLink to="/profile" className={navLink}>My profile</NavLink>}
      </nav>

      <div className="nav-actions">
        {user ? (
          <>
            <span className="signed-in-label">Hi, {user.name.split(' ')[0]}</span>
            <button type="button" className="btn btn-secondary" onClick={logout}>Log out</button>
          </>
        ) : (
          <>
            <Link to="/login" className="btn btn-secondary">Log in</Link>
            <Link to="/register" className="btn btn-primary">Sign up</Link>
          </>
        )}
      </div>
    </header>
  )
}

function LandingPage() {
  return (
    <div className="page page-landing">
      <section className="hero-section">
        <div className="hero-copy">
          <span className="eyebrow">Peer-to-peer learning network</span>
          <h1>Swap skills, grow faster, and build your next learning circle.</h1>
          <p>
            SkillSwap helps students exchange knowledge without money. Find complementary
            learners, schedule sessions, and build confidence through real collaboration.
          </p>
          <div className="cta-row">
            <Link to="/browse" className="btn btn-primary">Discover students <ArrowRight size={16} /></Link>
            <Link to="/about" className="btn btn-secondary">How it works</Link>
          </div>
          <div className="mini-stats">
            <div>
              <strong>4.9/5</strong>
              <span>student rating</span>
            </div>
            <div>
              <strong>2k+</strong>
              <span>peer matches</span>
            </div>
            <div>
              <strong>87%</strong>
              <span>session completion</span>
            </div>
          </div>
        </div>

        <div className="hero-panel">
          <div className="panel-card profile-card">
            <div className="avatar">AJ</div>
            <div>
              <h3>Alice Johnson</h3>
              <p>Java  /  Spring Boot</p>
            </div>
          </div>
          <div className="panel-card match-card">
            <div className="status-pill success">Strong match</div>
            <h3>Mutual exchange</h3>
            <p>Learn Python ? Teach Java</p>
          </div>
          <div className="panel-card session-card">
            <Calendar size={18} />
            <div>
              <strong>Next session</strong>
              <p>Thursday  -  6:30 PM</p>
            </div>
          </div>
        </div>
      </section>

      <section className="section-block">
        <div className="section-header">
          <span className="eyebrow">How SkillSwap works</span>
          <h2>Learn by trading what you know for what you need.</h2>
        </div>
        <div className="steps-grid">
          {steps.map((step, index) => (
            <div className="step-card" key={step}>
              <div className="step-number">0{index + 1}</div>
              <p>{step}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="section-block featured-block">
        <div className="section-header">
          <span className="eyebrow">Featured matches</span>
          <h2>Students already swapping skills</h2>
        </div>
        <div className="student-grid">
          {students.map((student) => (
            <div className="student-card" key={student.id}>
              <div className="student-header">
                <div className="avatar small">{student.name.split(' ').map((n) => n[0]).slice(0, 2).join('')}</div>
                <div>
                  <h3>{student.name}</h3>
                  <p>{student.college}</p>
                </div>
              </div>
              <p className="student-bio">{student.bio}</p>
              <div className="skill-groups">
                <div>
                  <span className="label">Teaches</span>
                  <div className="chip-row">
                    {student.teaching.map((skill) => <span className="chip" key={skill}>{skill}</span>)}
                  </div>
                </div>
                <div>
                  <span className="label">Wants to learn</span>
                  <div className="chip-row">
                    {student.learning.map((skill) => <span className="chip accent" key={skill}>{skill}</span>)}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="section-block benefits-block">
        <div className="section-header">
          <span className="eyebrow">Why students choose us</span>
          <h2>Built for real peer growth.</h2>
        </div>
        <div className="benefits-grid">
          {benefits.map(({ icon: Icon, title, text }) => (
            <div key={title} className="benefit-card">
              <div className="icon-wrap"><Icon size={20} /></div>
              <h3>{title}</h3>
              <p>{text}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="cta-banner">
        <div>
          <span className="eyebrow">Ready to start?</span>
          <h2>Build your next learning exchange today.</h2>
        </div>
        <Link to="/register" className="btn btn-primary">Create account</Link>
      </section>
    </div>
  )
}

function AboutPage() {
  return (
    <section className="page">
      <div className="section-header center">
        <span className="eyebrow">About SkillSwap</span>
        <h1>Skill exchange for students who want practical learning.</h1>
      </div>
      <div className="info-grid">
        <div className="info-card">
          <BookOpen size={20} />
          <h3>How matching works</h3>
          <p>We compare your learning goals with another student's teaching strengths and highlight the best mutual exchange opportunities.</p>
        </div>
        <div className="info-card">
          <GraduationCap size={20} />
          <h3>Focus on outcomes</h3>
          <p>Students schedule learning sessions, collaborate on goals, and track progress from profile completion to exchange reviews.</p>
        </div>
        <div className="info-card">
          <CheckCircle2 size={20} />
          <h3>Transparent process</h3>
          <p>Requests, accepted matches, upcoming sessions, and completed reviews all remain visible and trackable in your dashboard.</p>
        </div>
      </div>
    </section>
  )
}

function BrowsePage() {
  const { user } = useAuth()
  const [query, setQuery] = useState('')
  const [browseStudents, setBrowseStudents] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [requestingId, setRequestingId] = useState(null)
  const [sentRequests, setSentRequests] = useState({})

  useEffect(() => {
    const controller = new AbortController()
    setLoading(true)
    setError('')
    api.get('/users/search', { params: { query }, signal: controller.signal })
      .then((response) => setBrowseStudents(
        user?.id ? response.data.filter((student) => student.id !== user.id) : response.data,
      ))
      .catch((requestError) => {
        if (requestError.code !== 'ERR_CANCELED') {
          setError(requestError.response?.data?.error || 'Could not load students. Please try again.')
        }
      })
      .finally(() => {
        if (!controller.signal.aborted) setLoading(false)
      })
    return () => controller.abort()
  }, [query, user?.id])

  const prepareExchange = (student) => {
    const wantedSkill = (user?.learningSkills || []).find((skill) =>
      student.teachingSkills?.some((theirSkill) => theirSkill.toLowerCase() === skill.toLowerCase()),
    )
    const offeredSkill = (user?.teachingSkills || []).find((skill) =>
      student.learningSkills?.some((theirSkill) => theirSkill.toLowerCase() === skill.toLowerCase()),
    )
    return wantedSkill && offeredSkill ? { wantedSkill, offeredSkill } : null
  }

  const sendRequest = async (student) => {
    const exchange = prepareExchange(student)
    if (!exchange) return
    setError('')
    setRequestingId(student.id)
    try {
      await api.post('/requests', {
        receiverId: student.id,
        ...exchange,
        message: '',
      })
      setSentRequests((existing) => ({ ...existing, [student.id]: true }))
    } catch (requestError) {
      setError(requestError.response?.data?.error || requestError.response?.data?.message || 'Could not send your request.')
    } finally {
      setRequestingId(null)
    }
  }

  return (
    <section className="page">
      <div className="page-header">
        <div>
          <span className="eyebrow">Discover peers</span>
          <h1>Find your next exchange partner.</h1>
        </div>
        <div className="search-box">
          <Search size={16} />
          <input
            type="text"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search by skill, student, college, or course"
            aria-label="Search students"
          />
        </div>
      </div>

      {error && <p className="form-message error" role="alert">{error}</p>}
      {loading && <p className="dashboard-message">Searching real student profiles...</p>}
      <div className="student-grid results-grid">
        {browseStudents.map((student) => {
          const exchange = prepareExchange(student)
          return (
          <div className="student-card" key={student.id}>
            <div className="student-header">
              <div className="avatar small">{student.name.split(' ').map((n) => n[0]).slice(0, 2).join('')}</div>
              <div>
                <h3>{student.name}</h3>
                <p>{[student.course, student.college].filter(Boolean).join(' - ') || 'Student'}</p>
              </div>
            </div>
            <p className="student-bio">{student.bio || 'This student has not added a bio yet.'}</p>
            <div className="skill-groups">
              <div>
                <span className="label">Teaches</span>
                <div className="chip-row">
                  {(student.teachingSkills || []).length > 0
                    ? student.teachingSkills.map((skill) => <span className="chip" key={skill}>{skill}</span>)
                    : <span className="empty-state">No teaching skills listed</span>}
                </div>
              </div>
              <div>
                <span className="label">Needs</span>
                <div className="chip-row">
                  {(student.learningSkills || []).length > 0
                    ? student.learningSkills.map((skill) => <span className="chip accent" key={skill}>{skill}</span>)
                    : <span className="empty-state">No learning goals listed</span>}
                </div>
              </div>
            </div>
            {user && (
              <div className="browse-exchange">
                {exchange
                  ? <p className="exchange-reason">Learn <strong>{exchange.wantedSkill}</strong> and offer <strong>{exchange.offeredSkill}</strong>.</p>
                  : <p className="exchange-reason">This student does not currently teach your learning goals, or you have no teaching skill to offer. <Link to="/profile">Edit your skills</Link></p>}
                <button
                  type="button"
                  className="btn btn-primary btn-full"
                  disabled={!exchange || requestingId === student.id || sentRequests[student.id]}
                  onClick={() => sendRequest(student)}
                >
                  {sentRequests[student.id] ? 'Request sent' : requestingId === student.id ? 'Sending...' : 'Send exchange request'}
                </button>
              </div>
            )}
          </div>
          )
        })}
      </div>
      {!loading && !error && browseStudents.length === 0 && (
        <div className="empty-panel">
          <h2>No students found</h2>
          <p>Try another name, skill, college, or course. New registered students will appear here automatically.</p>
        </div>
      )}
    </section>
  )
}

function DashboardPage() {
  const { user, setUserProfile, logout } = useAuth()
  const navigate = useNavigate()
  const [dashboard, setDashboard] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [requestActionId, setRequestActionId] = useState(null)

  const handleAuthenticationFailure = useCallback(() => {
    logout()
    navigate('/login', { replace: true })
  }, [logout, navigate])

  const loadDashboard = async () => {
    setError('')
    try {
      const [dashboardResponse, profileResponse] = await Promise.all([
        api.get('/dashboard'),
        api.get('/users/me'),
      ])
      setDashboard(dashboardResponse.data)
      setUserProfile(profileResponse.data)
    } catch (requestError) {
      if (requestError.response?.status === 401 || requestError.response?.status === 403) {
        handleAuthenticationFailure()
        return
      }
      setError(requestError.response?.data?.error || requestError.response?.data?.message || 'Could not load your dashboard. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    void loadDashboard()
  }, [handleAuthenticationFailure])

  const respondToRequest = async (requestId, action) => {
    setRequestActionId(requestId)
    setError('')
    try {
      await api.patch(`/requests/${requestId}/respond`, null, { params: { action } })
      await loadDashboard()
    } catch (requestError) {
      setError(requestError.response?.data?.error || requestError.response?.data?.message || `Could not ${action} this request.`)
    } finally {
      setRequestActionId(null)
    }
  }

  const teachingSkills = dashboard?.profile?.teachingSkills || user?.teachingSkills || []
  const learningSkills = dashboard?.profile?.learningSkills || user?.learningSkills || []
  const incomingRequests = dashboard?.incomingRequests || []
  const outgoingRequests = dashboard?.outgoingRequests || []
  const suggestedPartners = dashboard?.suggestedPartners || []
  const upcomingSessions = dashboard?.upcomingSessions || []
  const isCompatibleIncomingRequest = (request) => (
    (user?.teachingSkills || []).some((skill) => skill.toLowerCase() === request.wantedSkill?.name?.toLowerCase())
    && (user?.learningSkills || []).some((skill) => skill.toLowerCase() === request.offeredSkill?.name?.toLowerCase())
    && (request.sender?.teachingSkills || []).some((skill) => skill.name?.toLowerCase() === request.offeredSkill?.name?.toLowerCase())
    && (request.sender?.learningSkills || []).some((skill) => skill.name?.toLowerCase() === request.wantedSkill?.name?.toLowerCase())
  )
  const isCompatibleOutgoingRequest = (request) => (
    (user?.learningSkills || []).some((skill) => skill.toLowerCase() === request.wantedSkill?.name?.toLowerCase())
    && (user?.teachingSkills || []).some((skill) => skill.toLowerCase() === request.offeredSkill?.name?.toLowerCase())
    && (request.receiver?.teachingSkills || []).some((skill) => skill.name?.toLowerCase() === request.wantedSkill?.name?.toLowerCase())
    && (request.receiver?.learningSkills || []).some((skill) => skill.name?.toLowerCase() === request.offeredSkill?.name?.toLowerCase())
  )
  const refreshDashboard = () => loadDashboard()

  return (
    <section className="page dashboard-page">
      <div className="dashboard-head">
        <div>
          <span className="eyebrow">Your dashboard</span>
          <h1>Welcome back, {user?.name?.split(' ')[0] || 'student'}</h1>
        </div>
        <div className="progress-card">
          <span>Profile completion</span>
          <strong>{dashboard?.profile?.profileCompletion ?? user?.profileCompletion ?? 0}%</strong>
        </div>
      </div>

      {loading && <p className="dashboard-message">Loading your dashboard...</p>}
      {error && <p className="form-message error" role="alert">{error}</p>}

      <div className="summary-grid">
        <div className="summary-card">
          <span className="label">Teaching skills</span>
          <div className="chip-row">
            {teachingSkills.length > 0
              ? teachingSkills.map((skill) => <span className="chip" key={skill}>{skill}</span>)
              : <p className="empty-state">No teaching skills yet. <Link to="/profile">Add skills</Link></p>}
          </div>
        </div>
        <div className="summary-card">
          <span className="label">Learning goals</span>
          <div className="chip-row">
            {learningSkills.length > 0
              ? learningSkills.map((skill) => <span className="chip accent" key={skill}>{skill}</span>)
              : <p className="empty-state">No learning goals yet. <Link to="/profile">Add goals</Link></p>}
          </div>
        </div>
      </div>

      <div className="dashboard-grid">
        <div className="panel-stack">
          <div className="mini-panel">
            <h3>Incoming requests</h3>
            {!loading && incomingRequests.length === 0 && <p className="empty-state">No incoming requests yet.</p>}
            {incomingRequests.map((request) => (
              <div key={request.id} className="request-row">
                <strong>{request.sender?.name || 'Student'}</strong>
                <span className="status-pill small">{request.status}</span>
                <p>They want to learn <strong>{request.wantedSkill?.name}</strong> and offer to teach <strong>{request.offeredSkill?.name}</strong>.</p>
                {isCompatibleIncomingRequest(request) && (
                  <p className="request-match-summary">Your side: teach {request.wantedSkill?.name} and learn {request.offeredSkill?.name}.</p>
                )}
                {request.message && <p className="request-message">Message: "{request.message}"</p>}
                {request.status === 'PENDING' && !isCompatibleIncomingRequest(request) && (
                  <p className="form-message error" role="status">This request does not match your current skill goals. You can decline it and the sender can try again.</p>
                )}
                {request.status === 'PENDING' && (
                  <div className="request-actions">
                    <button type="button" className="btn btn-primary" disabled={requestActionId === request.id || !isCompatibleIncomingRequest(request)} onClick={() => respondToRequest(request.id, 'accept')}>Accept</button>
                    <button type="button" className="btn btn-secondary" disabled={requestActionId === request.id} onClick={() => respondToRequest(request.id, 'reject')}>Decline</button>
                  </div>
                )}
                {request.status === 'ACCEPTED' && (
                  <ExchangeTools request={request} partner={request.sender} currentUser={user} onSessionScheduled={refreshDashboard} onAuthenticationFailure={handleAuthenticationFailure} />
                )}
              </div>
            ))}
          </div>
          <div className="mini-panel">
            <h3>Outgoing requests</h3>
            {!loading && outgoingRequests.length === 0 && <p className="empty-state">No outgoing requests yet.</p>}
            {outgoingRequests.map((request) => (
              <div key={request.id} className="request-row">
                <strong>{request.receiver?.name || 'Student'}</strong>
                <span className="status-pill small">{request.status}</span>
                <p>Learn {request.wantedSkill?.name} and offer {request.offeredSkill?.name}.</p>
                {request.status === 'PENDING' && !isCompatibleOutgoingRequest(request) && (
                  <>
                    <p className="form-message error" role="status">This older request does not match both students' current skills. Cancel it, then send a new request from Browse to use the current match.</p>
                    <div className="request-actions">
                      <button type="button" className="btn btn-secondary" disabled={requestActionId === request.id} onClick={() => respondToRequest(request.id, 'cancel')}>
                        {requestActionId === request.id ? 'Cancelling...' : 'Cancel request'}
                      </button>
                    </div>
                  </>
                )}
                {request.status === 'ACCEPTED' && (
                  <ExchangeTools request={request} partner={request.receiver} currentUser={user} onSessionScheduled={refreshDashboard} onAuthenticationFailure={handleAuthenticationFailure} />
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="panel-stack">
          <div className="mini-panel">
            <h3>Suggested partners</h3>
            {!loading && suggestedPartners.length === 0 && (
              <p className="empty-state">
                No strong mutual matches yet. <Link to="/browse">Browse all registered students</Link> or update your skills to find a complementary exchange.
              </p>
            )}
            {suggestedPartners.map((partner) => (
              <div key={partner.userId} className="partner-row">
                <div>
                  <strong>{partner.name}</strong>
                  <p>{partner.matchReason}</p>
                </div>
                <Link to="/browse" className="text-link">Browse</Link>
              </div>
            ))}
          </div>
          <div className="mini-panel">
            <h3>Upcoming sessions</h3>
            {!loading && upcomingSessions.length === 0 && <p className="empty-state">No sessions yet. Schedule one from an accepted exchange to add it here for both students.</p>}
            {upcomingSessions.map((session) => (
              <div key={session.id} className="session-row">
                <strong>{session.skill?.name} session</strong>
                <span>{session.scheduledAt ? new Date(session.scheduledAt).toLocaleString() : ''}</span>
                <em>{session.status}</em>
                <p>With {session.initiator?.id === user?.id ? session.partner?.name : session.initiator?.name}</p>
                <p>{session.durationMinutes} minutes{session.objectives ? ` · ${session.objectives}` : ''}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

function ExchangeTools({ request, partner, currentUser, onSessionScheduled, onAuthenticationFailure }) {
  const [messages, setMessages] = useState([])
  const [messageInput, setMessageInput] = useState('')
  const [chatError, setChatError] = useState('')
  const [scheduleError, setScheduleError] = useState('')
  const [sending, setSending] = useState(false)
  const [scheduling, setScheduling] = useState(false)
  const [sessionTime, setSessionTime] = useState(() => {
    const suggested = new Date(Date.now() + 60 * 60 * 1000)
    suggested.setMinutes(0, 0, 0)
    const localDate = new Date(suggested.getTime() - suggested.getTimezoneOffset() * 60000)
    return localDate.toISOString().slice(0, 16)
  })
  const [durationMinutes, setDurationMinutes] = useState('60')
  const [skillName, setSkillName] = useState(request.wantedSkill?.name || '')
  const [objectives, setObjectives] = useState('')

  const loadMessages = useCallback(async () => {
    try {
      const response = await api.get(`/requests/${request.id}/messages`)
      setMessages(response.data)
      setChatError('')
    } catch (requestError) {
      if (requestError.response?.status === 401 || requestError.response?.status === 403) {
        onAuthenticationFailure()
        return
      }
      setChatError(requestError.response?.data?.error || requestError.response?.data?.message || 'Could not load this chat.')
    }
  }, [request.id, onAuthenticationFailure])

  useEffect(() => {
    const initialLoad = window.setTimeout(() => void loadMessages(), 0)
    const refreshTimer = window.setInterval(() => void loadMessages(), 5000)
    return () => {
      window.clearTimeout(initialLoad)
      window.clearInterval(refreshTimer)
    }
  }, [loadMessages])

  const sendMessage = async (event) => {
    event.preventDefault()
    const content = messageInput.trim()
    if (!content) return
    setSending(true)
    setChatError('')
    try {
      await api.post(`/requests/${request.id}/messages`, { content })
      setMessageInput('')
      await loadMessages()
    } catch (requestError) {
      if (requestError.response?.status === 401 || requestError.response?.status === 403) {
        onAuthenticationFailure()
        return
      }
      setChatError(requestError.response?.data?.error || requestError.response?.data?.message || 'Could not send your message.')
    } finally {
      setSending(false)
    }
  }

  const scheduleSession = async (event) => {
    event.preventDefault()
    setScheduling(true)
    setScheduleError('')
    try {
      await api.post('/sessions', {
        requestId: request.id,
        partnerId: partner.id,
        skillName,
        scheduledAt: sessionTime,
        durationMinutes: Number(durationMinutes),
        objectives: objectives.trim(),
      })
      setObjectives('')
      await onSessionScheduled()
    } catch (requestError) {
      setScheduleError(requestError.response?.data?.error || requestError.response?.data?.message || 'Could not schedule this session.')
    } finally {
      setScheduling(false)
    }
  }

  return (
    <div className="exchange-tools">
      <section className="exchange-chat" aria-label={`Chat with ${partner?.name || 'exchange partner'}`}>
        <h4>Chat with {partner?.name || 'your partner'}</h4>
        {chatError && <p className="form-message error" role="alert">{chatError}</p>}
        <div className="chat-messages" aria-live="polite">
          {messages.length === 0
            ? <p className="empty-state">Start a conversation to plan your skill exchange.</p>
            : messages.map((message) => (
              <div className={`chat-message${message.senderId === currentUser?.id ? ' own-message' : ''}`} key={message.id}>
                <strong>{message.senderName}</strong>
                <p>{message.content}</p>
                <time dateTime={message.createdAt}>{new Date(message.createdAt).toLocaleString()}</time>
              </div>
            ))}
        </div>
        <form className="chat-compose" onSubmit={sendMessage}>
          <textarea
            aria-label="Write a message"
            maxLength={2000}
            value={messageInput}
            onChange={(event) => setMessageInput(event.target.value)}
            placeholder="Discuss what you would like to learn..."
            rows={2}
          />
          <button type="submit" className="btn btn-primary" disabled={sending || !messageInput.trim()}>
            {sending ? 'Sending...' : 'Send'}
          </button>
        </form>
      </section>
      <form className="schedule-form" onSubmit={scheduleSession}>
        <h4>Plan a learning session</h4>
        <label>
          Skill to exchange
          <select value={skillName} onChange={(event) => setSkillName(event.target.value)}>
            {[request.wantedSkill?.name, request.offeredSkill?.name].filter(Boolean).map((skill) => (
              <option value={skill} key={skill}>{skill}</option>
            ))}
          </select>
        </label>
        <label>
          Date and time
          <input type="datetime-local" required value={sessionTime} onChange={(event) => setSessionTime(event.target.value)} />
        </label>
        <label>
          Duration
          <select value={durationMinutes} onChange={(event) => setDurationMinutes(event.target.value)}>
            <option value="30">30 minutes</option>
            <option value="60">1 hour</option>
            <option value="90">1.5 hours</option>
            <option value="120">2 hours</option>
          </select>
        </label>
        <label>
          Plan or notes (optional)
          <input maxLength={500} value={objectives} onChange={(event) => setObjectives(event.target.value)} placeholder="What would you like to cover?" />
        </label>
        {scheduleError && <p className="form-message error" role="alert">{scheduleError}</p>}
        <button type="submit" className="btn btn-secondary" disabled={scheduling || !sessionTime}>
          {scheduling ? 'Scheduling...' : 'Schedule session'}
        </button>
      </form>
    </div>
  )
}

function ProfilePage() {
  const { user, setUserProfile, logout } = useAuth()
  const navigate = useNavigate()
  const teachingSkills = user?.teachingSkills || []
  const learningSkills = user?.learningSkills || []
  const [teachingInput, setTeachingInput] = useState('')
  const [learningInput, setLearningInput] = useState('')
  const [skillError, setSkillError] = useState('')
  const [savingSkill, setSavingSkill] = useState(false)
  const [accountError, setAccountError] = useState('')
  const [accountBusy, setAccountBusy] = useState(false)

  const changeSkill = async (skillName, skillType, action) => {
    setSkillError('')
    setSavingSkill(true)
    try {
      const endpoint = skillType === 'teach' ? '/users/skills/teach' : '/users/skills/learn'
      const response = action === 'add'
        ? await api.post(endpoint, { skillName })
        : await api.delete(`${endpoint}/${encodeURIComponent(skillName)}`)
      setUserProfile(response.data)
      if (skillType === 'teach') setTeachingInput('')
      else setLearningInput('')
    } catch (requestError) {
      setSkillError(requestError.response?.data?.error || requestError.response?.data?.message || 'Could not update skills. Please try again.')
    } finally {
      setSavingSkill(false)
    }
  }

  const addProfileSkill = (event, skillType, value) => {
    event.preventDefault()
    const skillName = value.trim()
    if (skillName) void changeSkill(skillName, skillType, 'add')
  }

  const deactivateProfile = async () => {
    if (!window.confirm('Hide your profile from student search? Your requests and history will be kept, and you can reactivate at any time.')) return
    setAccountError('')
    setAccountBusy(true)
    try {
      const response = await api.patch('/users/me/deactivate')
      setUserProfile(response.data)
    } catch (requestError) {
      setAccountError(requestError.response?.data?.error || requestError.response?.data?.message || 'Could not deactivate your profile.')
    } finally {
      setAccountBusy(false)
    }
  }

  const reactivateProfile = async () => {
    setAccountError('')
    setAccountBusy(true)
    try {
      const response = await api.patch('/users/me/activate')
      setUserProfile(response.data)
    } catch (requestError) {
      setAccountError(requestError.response?.data?.error || requestError.response?.data?.message || 'Could not reactivate your profile.')
    } finally {
      setAccountBusy(false)
    }
  }

  const deleteProfile = async () => {
    if (!window.confirm('Permanently delete your account, profile, requests, chats, sessions, and reviews? This cannot be undone.')) return
    setAccountError('')
    setAccountBusy(true)
    try {
      await api.delete('/users/me')
      logout()
      navigate('/', { replace: true })
    } catch (requestError) {
      setAccountError(requestError.response?.data?.error || requestError.response?.data?.message || 'Could not permanently delete your profile.')
      setAccountBusy(false)
    }
  }

  return (
    <section className="page profile-page">
      <div className="profile-header">
        <div className="avatar large">MJ</div>
        <div>
          <span className="eyebrow">Profile</span>
          <h1>{user?.name}</h1>
          <p>{[user?.course, user?.college].filter(Boolean).join(' - ') || 'Add your course and college to your profile'}</p>
        </div>
      </div>

      <div className="profile-grid">
        <div className="profile-card-block">
          <h3>About</h3>
          <p>{user?.bio || 'Tell other students a little about yourself and what you enjoy learning.'}</p>
        </div>
        <div className="profile-card-block">
          <h3>Availability</h3>
          <p>Evenings and weekends</p>
        </div>
      </div>

      <div className="profile-grid two-columns">
        <div className="profile-card-block">
          <h3>Teaching skills</h3>
          <div className="chip-row">
            {teachingSkills.length > 0
              ? teachingSkills.map((skill) => (
                <span className="editable-skill chip" key={skill}>
                  {skill}
                  <button type="button" disabled={savingSkill} aria-label={`Remove ${skill} from teaching skills`} onClick={() => changeSkill(skill, 'teach', 'remove')}>×</button>
                </span>
              ))
              : <p>No teaching skills added yet.</p>}
          </div>
          <form className="profile-skill-form" onSubmit={(event) => addProfileSkill(event, 'teach', teachingInput)}>
            <input aria-label="Add a teaching skill" maxLength={60} value={teachingInput} onChange={(event) => setTeachingInput(event.target.value)} placeholder="Add a skill you can teach" />
            <button className="btn btn-secondary" type="submit" disabled={savingSkill || !teachingInput.trim()}>Add</button>
          </form>
        </div>
        <div className="profile-card-block">
          <h3>Learning goals</h3>
          <div className="chip-row">
            {learningSkills.length > 0
              ? learningSkills.map((skill) => (
                <span className="editable-skill chip accent" key={skill}>
                  {skill}
                  <button type="button" disabled={savingSkill} aria-label={`Remove ${skill} from learning goals`} onClick={() => changeSkill(skill, 'learn', 'remove')}>×</button>
                </span>
              ))
              : <p>No learning goals added yet.</p>}
          </div>
          <form className="profile-skill-form" onSubmit={(event) => addProfileSkill(event, 'learn', learningInput)}>
            <input aria-label="Add a learning goal" maxLength={60} value={learningInput} onChange={(event) => setLearningInput(event.target.value)} placeholder="Add a skill you want to learn" />
            <button className="btn btn-secondary" type="submit" disabled={savingSkill || !learningInput.trim()}>Add</button>
          </form>
        </div>
      </div>
      {skillError && <p className="form-message error" role="alert">{skillError}</p>}
      <section className="profile-card-block account-actions">
        <h3>Account visibility and deletion</h3>
        <p>{user?.active
          ? 'Hiding your profile keeps your account and exchange history. Your profile will no longer appear in student search.'
          : 'Your profile is hidden from student search. Reactivate it to receive and send exchange requests again.'}</p>
        {accountError && <p className="form-message error" role="alert">{accountError}</p>}
        <div className="request-actions">
          {user?.active
            ? <button type="button" className="btn btn-secondary" disabled={accountBusy} onClick={deactivateProfile}>{accountBusy ? 'Updating...' : 'Hide my profile'}</button>
            : <button type="button" className="btn btn-secondary" disabled={accountBusy} onClick={reactivateProfile}>{accountBusy ? 'Updating...' : 'Reactivate profile'}</button>}
          <button type="button" className="btn btn-secondary" disabled={accountBusy} onClick={deleteProfile}>Permanently delete account</button>
        </div>
      </section>
    </section>
  )
}

function LoginPage() {
  const { login } = useAuth()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)

  const handleSubmit = async (event) => {
    event.preventDefault()
    setError('')
    setSubmitting(true)

    try {
      const response = await api.post('/auth/login', { email: email.trim(), password })
      login(response.data)
      window.location.assign('/dashboard')
    } catch (requestError) {
      setError(requestError.response?.data?.error || requestError.response?.data?.message || 'Could not log in. Check your email and password, then try again.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <section className="page auth-page">
      <div className="auth-card">
        <span className="eyebrow">Welcome back</span>
        <h1>Log in to SkillSwap</h1>
        <form className="auth-form" onSubmit={handleSubmit}>
          <label>
            Email
            <input type="email" autoComplete="email" required value={email} onChange={(event) => setEmail(event.target.value)} placeholder="you@example.com" />
          </label>
          <label>
            Password
            <input type="password" autoComplete="current-password" required value={password} onChange={(event) => setPassword(event.target.value)} placeholder="Enter your password" />
          </label>
          {error && <p className="form-message error" role="alert">{error}</p>}
          <button type="submit" disabled={submitting} className="btn btn-primary btn-full">{submitting ? 'Logging in...' : 'Log in'}</button>
        </form>
        <p className="auth-switch">
          New here? <Link to="/register">Create an account</Link>
        </p>
      </div>
    </section>
  )
}

function RegisterPage() {
  const { login } = useAuth()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [teachingSkills, setTeachingSkills] = useState([])
  const [learningSkills, setLearningSkills] = useState([])
  const [teachingInput, setTeachingInput] = useState('')
  const [learningInput, setLearningInput] = useState('')
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)

  const addSkill = (value, skills, setSkills, setInput) => {
    const skill = value.trim()
    if (skill && !skills.some((existing) => existing.toLowerCase() === skill.toLowerCase())) {
      setSkills([...skills, skill])
    }
    setInput('')
  }

  const handleSkillKeyDown = (event, value, skills, setSkills, setInput) => {
    if (event.key === 'Enter') {
      event.preventDefault()
      addSkill(value, skills, setSkills, setInput)
    }
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    setError('')
    if (teachingSkills.length === 0 || learningSkills.length === 0) {
      setError('Add at least one skill you can teach and one skill you want to learn.')
      return
    }
    setSubmitting(true)

    try {
      const response = await api.post('/auth/register', {
        name: name.trim(),
        email: email.trim(),
        password,
        teachingSkills,
        learningSkills,
      })
      login(response.data)
      window.location.assign('/dashboard')
    } catch (requestError) {
      setError(requestError.response?.data?.error || requestError.response?.data?.message || 'Could not create your account. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <section className="page auth-page">
      <div className="auth-card">
        <span className="eyebrow">Get started</span>
        <h1>Create your student profile</h1>
        <form className="auth-form" onSubmit={handleSubmit}>
          <label>
            Full name
            <input type="text" autoComplete="name" required minLength={2} maxLength={80} value={name} onChange={(event) => setName(event.target.value)} placeholder="Your full name" />
          </label>
          <label>
            Email
            <input type="email" autoComplete="email" required value={email} onChange={(event) => setEmail(event.target.value)} placeholder="you@example.com" />
          </label>
          <label>
            Password
            <input type="password" autoComplete="new-password" required minLength={8} value={password} onChange={(event) => setPassword(event.target.value)} placeholder="At least 8 characters" />
          </label>
          <fieldset className="skill-field">
            <legend>Skills I can teach</legend>
            <p>Add the skills or knowledge you can share with another student.</p>
            <div className="skill-entry">
              <input
                type="text"
                value={teachingInput}
                maxLength={60}
                onChange={(event) => setTeachingInput(event.target.value)}
                onKeyDown={(event) => handleSkillKeyDown(event, teachingInput, teachingSkills, setTeachingSkills, setTeachingInput)}
                placeholder="For example, Java"
                aria-label="Skill you can teach"
              />
              <button type="button" className="btn btn-secondary" onClick={() => addSkill(teachingInput, teachingSkills, setTeachingSkills, setTeachingInput)}>Add</button>
            </div>
            <div className="skill-chip-list">
              {teachingSkills.map((skill) => (
                <span className="skill-chip" key={skill}>
                  {skill}
                  <button type="button" aria-label={`Remove ${skill}`} onClick={() => setTeachingSkills(teachingSkills.filter((item) => item !== skill))}>×</button>
                </span>
              ))}
            </div>
          </fieldset>
          <fieldset className="skill-field">
            <legend>Skills I want to learn</legend>
            <p>Tell us what you want to learn from another student.</p>
            <div className="skill-entry">
              <input
                type="text"
                value={learningInput}
                maxLength={60}
                onChange={(event) => setLearningInput(event.target.value)}
                onKeyDown={(event) => handleSkillKeyDown(event, learningInput, learningSkills, setLearningSkills, setLearningInput)}
                placeholder="For example, Python"
                aria-label="Skill you want to learn"
              />
              <button type="button" className="btn btn-secondary" onClick={() => addSkill(learningInput, learningSkills, setLearningSkills, setLearningInput)}>Add</button>
            </div>
            <div className="skill-chip-list">
              {learningSkills.map((skill) => (
                <span className="skill-chip learning" key={skill}>
                  {skill}
                  <button type="button" aria-label={`Remove ${skill}`} onClick={() => setLearningSkills(learningSkills.filter((item) => item !== skill))}>×</button>
                </span>
              ))}
            </div>
          </fieldset>
          {error && <p className="form-message error" role="alert">{error}</p>}
          <button type="submit" disabled={submitting} className="btn btn-primary btn-full">{submitting ? 'Creating account...' : 'Create account'}</button>
        </form>
        <p className="auth-switch">
          Already have an account? <Link to="/login">Log in</Link>
        </p>
      </div>
    </section>
  )
}

function NotFoundPage() {
  return (
    <section className="page not-found">
      <div className="auth-card">
        <span className="eyebrow">404</span>
        <h1>Page not found</h1>
        <p>The link you followed does not exist or has moved.</p>
        <Link to="/" className="btn btn-primary">Back home</Link>
      </div>
    </section>
  )
}

function Footer() {
  return (
    <footer className="footer">
      <p>(c) 2026 SkillSwap.</p>
      <div className="footer-links">
        <Link to="/about">About</Link>
        <Link to="/browse">Browse</Link>
        <Link to="/login">Login</Link>
      </div>
    </footer>
  )
}

export default App
