import { useNavigate } from 'react-router-dom'

const categories = [
  {
    id: 1,
    name: 'Elementary',
    icon: '📖',
    description: 'Fun and easy Bible lessons for young learners.',
    image: '/images/elementary.jpg',
    btnColor: 'bg-blue-600 hover:bg-blue-700',
    iconBg: 'bg-blue-100',
  },
  {
    id: 2,
    name: 'High School',
    icon: '🎒',
    description: 'Bible teachings and discussions for teenagers and young believers.',
    image: '/images/highschool.jpg',
    btnColor: 'bg-green-700 hover:bg-green-800',
    iconBg: 'bg-green-100',
  },
  {
    id: 3,
    name: 'Adult / College',
    icon: '🎓',
    description: 'In-depth scripture study, reflection, and faith application.',
    image: '/images/college.jpg',
    btnColor: 'bg-purple-600 hover:bg-purple-700',
    iconBg: 'bg-purple-100',
  },
]

export default function Home() {
  const navigate = useNavigate()

  return (
    <div className="min-h-screen bg-gray-100">

      {/* Hero */}
      <div
        className="relative flex flex-col items-center justify-center text-center py-24 px-6 bg-cover bg-center"
        style={{ backgroundImage: "url('/images/header-background.png')" }}
      >
        <div className="relative z-10">
          <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-3">
            Grow in Faith. Learn the Word.
          </h1>
          <p className="text-blue-200 text-lg mb-8">
            Bible study for every stage of life. Choose your category and start your journey today.
          </p>
          <a
            href="#categories"
            className="bg-yellow-400 hover:bg-yellow-500 text-gray-900 font-semibold px-8 py-3 rounded-full transition"
          >
            Explore Categories
          </a>
        </div>
      </div>

      {/* Categories */}
      <div id="categories" className="max-w-5xl mx-auto px-6 py-16">
        <p className="text-center text-blue-600 font-semibold uppercase tracking-widest text-sm mb-2">
          Choose Your Study Level
        </p>
        <h2 className="text-center text-3xl font-bold text-gray-800 mb-2">
          Find Lessons Made for You
        </h2>
        <p className="text-center text-gray-500 mb-12">
          Bible study that fits your age, your journey, and your growth.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {categories.map((cat) => (
            <div key={cat.id} className="bg-white rounded-2xl shadow-md overflow-hidden flex flex-col">
              <img
                src={cat.image}
                alt={cat.name}
                className="w-full h-48 object-cover"
              />
              <div className="flex flex-col items-center text-center p-6 flex-1">
                <div className={`${cat.iconBg} text-2xl rounded-full w-12 h-12 flex items-center justify-center mb-3`}>
                  {cat.icon}
                </div>
                <h3 className="text-xl font-bold text-gray-800 mb-2">{cat.name}</h3>
                <p className="text-gray-500 text-sm mb-6 flex-1">{cat.description}</p>
                <button
                  onClick={() => navigate(`/lessons/${cat.id}`)}
                  className={`${cat.btnColor} text-white font-semibold px-6 py-2 rounded-lg w-full transition`}
                >
                  Start Learning
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  )
}
