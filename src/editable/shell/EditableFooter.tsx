'use client'

import Link from 'next/link'
import { ArrowUpRight } from 'lucide-react'
import { SITE_CONFIG } from '@/lib/site-config'
import { globalContent } from '@/editable/content/global.content'
import { useEditableLocalAuthSession } from '@/editable/components/EditableLocalAuthForms'

export function EditableFooter() {
  const year = new Date().getFullYear()
  const { session, logout } = useEditableLocalAuthSession()

  return (
    <footer className="bg-[var(--editable-footer-bg)] text-[var(--editable-footer-text)]">
      <div className="mx-auto w-full max-w-[var(--editable-container)] px-4 py-16 sm:px-6 lg:px-8">
        {/* Top: brand */}
        <div className="border-b border-white/10 pb-10">
          <Link href="/" className="inline-flex items-center gap-3">
            <img src="/favicon.png?v=20260413" alt={SITE_CONFIG.name} className="h-12 w-12 object-contain" />
            <span className="editable-display text-2xl font-bold tracking-[-0.01em] text-white">{SITE_CONFIG.name}</span>
          </Link>
        </div>

        {/* Columns */}
        <div className="grid gap-10 py-12 sm:grid-cols-2 lg:grid-cols-[1.4fr_1fr_1fr_1.3fr]">
          <div>
            <p className="max-w-sm text-sm leading-7 text-white/70">{globalContent.footer?.description || SITE_CONFIG.description}</p>
          </div>

          <div>
            <h3 className="text-sm font-bold uppercase tracking-[0.14em] text-white">Explore</h3>
            <div className="mt-5 grid gap-3">
              {[
                ['Home', '/'],
                ['Search', '/search'],
                ['About', '/about'],
                ['Contact', '/contact'],
              ].map(([label, href]) => (
                <Link key={href} href={href} className="group inline-flex items-center gap-2 text-sm text-white/70 transition hover:text-white">
                  <ArrowUpRight className="h-3.5 w-3.5 text-[var(--slot4-accent)]" /> {label}
                </Link>
              ))}
            </div>
          </div>

          <div>
            <h3 className="text-sm font-bold uppercase tracking-[0.14em] text-white">Site</h3>
            <div className="mt-5 grid gap-3">
              {[
                ['About', '/about'],
                ['Contact', '/contact'],
                ['Search', '/search'],
                ...(session ? [['Post a listing', '/create']] : [['Login', '/login'], ['Sign up', '/signup']]),
              ].map(([label, href]) => (
                <Link key={href} href={href} className="text-sm text-white/70 transition hover:text-white">{label}</Link>
              ))}
              {session ? <button type="button" onClick={logout} className="text-left text-sm text-white/70 transition hover:text-white">Logout</button> : null}
            </div>
          </div>

          <div>
            <h3 className="text-sm font-bold uppercase tracking-[0.14em] text-white">Stay in the loop</h3>
            <p className="mt-5 text-sm leading-6 text-white/60">Get new listings and profiles in your inbox.</p>
            <form action="/search" className="mt-4 flex overflow-hidden rounded-full border border-white/15 bg-white/5">
              <input
                name="q"
                type="email"
                placeholder="Your email address"
                className="min-w-0 flex-1 bg-transparent px-4 py-3 text-sm text-white outline-none placeholder:text-white/40"
              />
              <button className="shrink-0 bg-[var(--slot4-accent)] px-5 text-sm font-bold text-white transition hover:brightness-95">Join</button>
            </form>
          </div>
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="mx-auto flex w-full max-w-[var(--editable-container)] flex-col items-center justify-between gap-3 px-4 py-6 text-xs text-white/55 sm:flex-row sm:px-6 lg:px-8">
          <span>© {year} {SITE_CONFIG.name}. All rights reserved.</span>
          <span>{globalContent.footer?.bottomNote || 'Built for clean discovery and connected publishing.'}</span>
        </div>
      </div>
    </footer>
  )
}
