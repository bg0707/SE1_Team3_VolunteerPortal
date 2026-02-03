export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="mt-12 border-t border-slate-200 bg-gradient-to-b from-slate-50 to-white">
      <div className="max-w-screen-xl mx-auto px-4 py-10">
        <div className="grid gap-8 md:grid-cols-4 text-left">
          <div className="md:col-span-2">
            <div className="text-xl font-semibold text-slate-900">
              Volunteer Portal
            </div>
            <p className="mt-3 text-sm text-slate-600 leading-relaxed">
              Connecting volunteers with organizations that need them most. Find
              meaningful opportunities and track your impact in one place.
            </p>
          </div>

          <div>
            <div className="text-sm font-semibold text-slate-900 tracking-wide">
              Explore
            </div>
            <ul className="mt-3 space-y-2 text-sm text-slate-600">
              <li>
                <a href="/opportunities" className="hover:text-slate-900">
                  Browse opportunities
                </a>
              </li>
              <li>
                <a href="/dashboard" className="hover:text-slate-900">
                  My dashboard
                </a>
              </li>
              <li>
                <a href="/my-applications" className="hover:text-slate-900">
                  My applications
                </a>
              </li>
            </ul>
          </div>

          <div>
            <div className="text-sm font-semibold text-slate-900 tracking-wide">
              Support
            </div>
            <ul className="mt-3 space-y-2 text-sm text-slate-600">
              <li>
                <a href="/authentication" className="hover:text-slate-900">
                  Login / Register
                </a>
              </li>
              <li>
                <a href="/manage-opportunities" className="hover:text-slate-900">
                  Manage opportunities
                </a>
              </li>
              <li>
                <a href="/admin" className="hover:text-slate-900">
                  Admin panel
                </a>
              </li>
              <li className="pt-1">
                <span className="text-slate-500">Support: </span>
                <a
                  href="mailto:support@volunteer-portal.org"
                  className="hover:text-slate-900"
                >
                  support@volunteer-portal.org
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-10 flex flex-col gap-2 border-t border-slate-200 pt-6 text-sm text-slate-500 md:flex-row md:items-center md:justify-between">
          <span>© {year} Volunteer Portal. All rights reserved.</span>
          <span>Built for community impact.</span>
        </div>
      </div>
    </footer>
  );
}
