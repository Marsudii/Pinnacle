import {
  Ellipsis,
  Info,
  Search,
  Settings,
  Sun,
} from 'lucide-react'
import { useRef, useState } from 'react'
import { NavLink, Outlet } from 'react-router-dom'

const dropdownItems = [
  { to: '/settings', label: 'Settings', icon: Settings },
  { label: 'About', icon: Info },
]

export function AppShell() {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  const handleDropdownClick = () => {
    setIsDropdownOpen(!isDropdownOpen)
  }

  return (
    <div className="min-h-screen bg-slate-100 text-slate-900">
      <div className="flex h-screen w-full flex-col border border-slate-200 bg-white shadow-[0_24px_80px_rgba(15,23,42,0.06)]">
        <header className="relative flex h-16 items-center border-b border-slate-200/80 bg-gradient-to-r from-white via-slate-50/50 to-white px-6 backdrop-blur-sm">
          {/* Logo & Brand */}
          <div className="flex items-center gap-3">
            <div className="group relative">
              <div className="absolute -inset-1 rounded-2xl bg-linear-to-br from-blue-500/20 to-indigo-500/20 opacity-0 blur-sm transition-opacity group-hover:opacity-100" />
              <img
                src="/logo.png"
                alt="Pinnacle logo"
                className="relative h-9 w-9 rounded-xl object-contain transition-transform group-hover:scale-105"
              />
            </div>
            <div className="flex flex-col">
              <span className="text-[15px] font-bold tracking-tight text-slate-900">
                Pinnacle
              </span>
              <span className="text-[10px] font-medium uppercase tracking-widest text-blue-500/80">
                Data Explorer
              </span>
            </div>
          </div>

          {/* Right actions */}
          <div className="ml-auto flex items-center gap-1.5">
            <button
              type="button"
              className="flex items-center gap-2 rounded-lg border border-slate-200/80 bg-slate-50/80 px-3 py-1.5 text-xs text-slate-400 transition hover:border-slate-300 hover:bg-slate-100 hover:text-slate-500"
              aria-label="Search"
            >
              <Search size={14} />
              <span className="hidden sm:inline">Search...</span>
              <kbd className="ml-2 hidden rounded border border-slate-200 bg-white px-1.5 py-0.5 text-[10px] font-medium text-slate-400 sm:inline">⌘K</kbd>
            </button>

            <div className="mx-1 h-5 w-px bg-slate-200/80" />

            <button
              type="button"
              className="rounded-lg p-1.5 text-slate-400 transition hover:bg-slate-100 hover:text-amber-500"
              aria-label="Theme"
            >
              <Sun size={16} />
            </button>

            <div className="relative" ref={dropdownRef}>
              <button
                type="button"
                onClick={handleDropdownClick}
                className="rounded-lg p-1.5 text-slate-400 transition hover:bg-slate-100 hover:text-slate-600"
                aria-label="More options"
              >
                <Ellipsis size={16} />
              </button>
              {isDropdownOpen && (
                <div className="absolute right-0 mt-1 w-44 overflow-hidden rounded-xl border border-slate-200/80 bg-white shadow-lg shadow-slate-200/50">
                  {dropdownItems.map((item, idx) => {
                    const Icon = item.icon
                    if (item.to) {
                      return (
                        <NavLink
                          key={item.to}
                          to={item.to}
                          onClick={() => setIsDropdownOpen(false)}
                          className={({ isActive }) =>
                            [
                              'flex items-center gap-3 px-4 py-2.5 text-sm transition',
                              idx !== dropdownItems.length - 1 ? 'border-b border-slate-100/80' : '',
                              isActive ? 'bg-blue-50/80 text-blue-600' : 'text-slate-600 hover:bg-slate-50',
                            ].join(' ')
                          }
                        >
                          <Icon size={15} />
                          <span>{item.label}</span>
                        </NavLink>
                      )
                    }
                    return (
                      <button
                        key={item.label}
                        type="button"
                        className={[
                          'flex w-full items-center gap-3 px-4 py-2.5 text-left text-sm transition',
                          idx !== dropdownItems.length - 1 ? 'border-b border-slate-100/80' : '',
                          'text-slate-600 hover:bg-slate-50',
                        ].join(' ')}
                      >
                        <Icon size={15} />
                        <span>{item.label}</span>
                      </button>
                    )
                  })}
                </div>
              )}
            </div>
          </div>
        </header>

        <main className="flex-1 overflow-hidden">
          <Outlet />
        </main>
      </div>
    </div>
  )
}