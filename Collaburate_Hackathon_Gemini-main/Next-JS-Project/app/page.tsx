import Link from "next/link";

const actions = [
  { label: "Sign In", href: "/auth/signin", primary: true },
  { label: "Sign Up", href: "/auth/signup", primary: false },
  { label: "Student Portal", href: "/student", primary: false },
  { label: "Teacher Portal", href: "/teacher", primary: false },
];

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-blue-50 text-black">
      <div className="max-w-4xl mx-auto px-6 py-16 space-y-10">
        <header className="space-y-4">
          <p className="text-sm font-semibold text-indigo-600 uppercase tracking-wide">
            Collaburate AI
          </p>
          <h1 className="text-4xl sm:text-5xl font-bold leading-tight">
            Lecture AI for Teachers & Students
          </h1>
          <p className="text-lg text-gray-600">
            Upload lectures, auto-generate notes, store in the cloud, and let students
            chat with the material securely through our proxy-backed RAG pipeline.
          </p>
        </header>

        <div className="flex flex-wrap gap-3">
          {actions.map((action) => (
            <Link
              key={action.href}
              href={action.href}
              className={`px-5 py-3 rounded-lg text-sm font-semibold shadow-sm transition hover:-translate-y-0.5 ${
                action.primary
                  ? "bg-indigo-600 text-white hover:bg-indigo-700"
                  : "bg-white text-gray-900 border border-gray-200 hover:border-gray-300"
              }`}
            >
              {action.label}
            </Link>
          ))}
        </div>

        <div className="grid md:grid-cols-3 gap-4">
          <Feature
            title="Secure Flow"
            desc="Next.js proxies all traffic to FastAPI—no browser exposure of backend."
          />
          <Feature
            title="Cloud PDFs"
            desc="Teacher notes published to Cloudinary; links saved in Mongo for reuse."
          />
          <Feature
            title="Student RAG"
            desc="Students browse lectures, download PDFs, and chat with them directly."
          />
        </div>
      </div>
    </main>
  );
}

function Feature({ title, desc }: { title: string; desc: string }) {
  return (
    <div className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm">
      <h3 className="text-lg font-semibold mb-2">{title}</h3>
      <p className="text-sm text-gray-600">{desc}</p>
    </div>
  );
}
