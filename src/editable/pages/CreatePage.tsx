'use client'

import { FormEvent, useMemo, useState } from 'react'
import Link from 'next/link'
import { ArrowRight, CheckCircle2, Lock, Send, Sparkles } from 'lucide-react'
import { SITE_CONFIG, type TaskKey } from '@/lib/site-config'
import { EditableSiteShell } from '@/editable/shell/EditableSiteShell'
import { useEditableLocalAuthSession } from '@/editable/components/EditableLocalAuthForms'
import { pagesContent } from '@/editable/content/pages.content'

type DraftPost = {
  id: string
  task: TaskKey
  title: string
  category: string
  summary: string
  url: string
  image: string
  body: string
  createdAt: string
}

const STORE_KEY = 'slot4:created-posts'

const fieldClass = 'w-full rounded-xl border border-[var(--editable-border)] bg-[var(--slot4-surface-bg)] px-4 py-3.5 text-sm font-medium text-[var(--slot4-page-text)] outline-none transition placeholder:text-[var(--slot4-soft-muted-text)] focus:border-[var(--slot4-accent)] focus:ring-2 focus:ring-[var(--slot4-accent)]/15'

const fieldLabel = 'mb-1.5 block text-[11px] font-bold uppercase tracking-[0.14em] text-[var(--slot4-muted-text)]'

const saveDraft = (draft: DraftPost) => {
  try {
    const existing = JSON.parse(window.localStorage.getItem(STORE_KEY) || '[]')
    const list = Array.isArray(existing) ? existing : []
    window.localStorage.setItem(STORE_KEY, JSON.stringify([draft, ...list].slice(0, 50)))
  } catch {
    window.localStorage.setItem(STORE_KEY, JSON.stringify([draft]))
  }
}

export default function CreatePage() {
  const { session } = useEditableLocalAuthSession()
  const enabledTasks = useMemo(() => SITE_CONFIG.tasks.filter((task) => task.enabled), [])
  const [task] = useState<TaskKey>((enabledTasks[0]?.key || 'article') as TaskKey)
  const [title, setTitle] = useState('')
  const [category, setCategory] = useState('')
  const [summary, setSummary] = useState('')
  const [url, setUrl] = useState('')
  const [image, setImage] = useState('')
  const [body, setBody] = useState('')
  const [created, setCreated] = useState<DraftPost | null>(null)

  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const draft: DraftPost = {
      id: `draft-${Date.now()}`,
      task,
      title: title.trim(),
      category: category.trim() || 'uncategorized',
      summary: summary.trim(),
      url: url.trim(),
      image: image.trim(),
      body: body.trim(),
      createdAt: new Date().toISOString(),
    }
    saveDraft(draft)
    setCreated(draft)
    setTitle('')
    setCategory('')
    setSummary('')
    setUrl('')
    setImage('')
    setBody('')
  }

  if (!session) {
    return (
      <EditableSiteShell>
        <main className="min-h-screen bg-[var(--slot4-warm)] px-4 py-16 text-[var(--slot4-page-text)] sm:px-6 lg:px-8 lg:py-24">
          <section className="mx-auto grid max-w-5xl overflow-hidden rounded-3xl border border-[var(--editable-border)] bg-[var(--slot4-surface-bg)] shadow-[0_18px_46px_rgba(94,0,6,0.12)] md:grid-cols-[0.9fr_1.1fr]">
            <div className="relative flex min-h-72 items-center justify-center overflow-hidden bg-[var(--slot4-accent-deep)] p-10 text-white">
              <div className="pointer-events-none absolute -right-16 -top-16 h-56 w-56 rounded-full bg-[var(--slot4-accent)]/30 blur-3xl" />
              <div className="pointer-events-none absolute -bottom-16 -left-16 h-56 w-56 rounded-full bg-[var(--slot4-accent-2)]/40 blur-3xl" />
              <span className="relative flex h-24 w-24 items-center justify-center rounded-3xl border border-white/15 bg-white/10">
                <Lock className="h-11 w-11 text-[var(--slot4-cream)]" />
              </span>
            </div>
            <div className="self-center p-8 sm:p-10">
              <p className="text-[11px] font-bold uppercase tracking-[0.28em] text-[var(--slot4-accent)]">{pagesContent.create.locked.badge}</p>
              <h1 className="editable-display mt-5 text-4xl font-bold leading-[1.05] tracking-[-0.02em] sm:text-5xl">{pagesContent.create.locked.title}</h1>
              <p className="mt-5 max-w-xl text-base leading-8 text-[var(--slot4-muted-text)]">{pagesContent.create.locked.description}</p>
              <div className="mt-8 flex flex-wrap gap-3">
                <Link href="/login" className="inline-flex items-center gap-2 rounded-full bg-[var(--slot4-accent)] px-7 py-3 text-sm font-bold text-white shadow-[0_10px_26px_rgba(213,62,15,0.3)] transition hover:brightness-95">Login <ArrowRight className="h-4 w-4" /></Link>
                <Link href="/signup" className="inline-flex items-center gap-2 rounded-full border border-[var(--editable-border)] bg-[var(--slot4-surface-bg)] px-7 py-3 text-sm font-bold text-[var(--slot4-page-text)] transition hover:border-[var(--slot4-accent)] hover:text-[var(--slot4-accent)]">Sign up</Link>
              </div>
            </div>
          </section>
        </main>
      </EditableSiteShell>
    )
  }

  return (
    <EditableSiteShell>
      <main className="min-h-screen bg-[var(--slot4-warm)] text-[var(--slot4-page-text)]">
        <section className="mx-auto max-w-[var(--editable-container)] px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
          <div className="grid gap-8 lg:grid-cols-[0.85fr_1.15fr] lg:items-start">
            {/* Intro panel */}
            <aside className="lg:sticky lg:top-24">
              <span className="inline-flex items-center gap-2 rounded-full border border-[var(--editable-border)] bg-[var(--slot4-surface-bg)] px-4 py-1.5 text-[11px] font-bold uppercase tracking-[0.22em] text-[var(--slot4-accent)]">
                <Sparkles className="h-3.5 w-3.5" /> {pagesContent.create.hero.badge}
              </span>
              <h1 className="editable-display mt-6 text-4xl font-bold leading-[1.04] tracking-[-0.02em] sm:text-5xl">{pagesContent.create.hero.title}</h1>
              <p className="mt-5 max-w-xl text-base leading-8 text-[var(--slot4-muted-text)]">{pagesContent.create.hero.description}</p>

              <div className="mt-8 grid gap-3">
                {['Add a clear title and short summary', 'Include an image and source link', 'Publish and reach the community'].map((tip, i) => (
                  <div key={tip} className="flex items-center gap-3 rounded-2xl border border-[var(--editable-border)] bg-[var(--slot4-surface-bg)] px-4 py-3">
                    <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[var(--slot4-accent-soft)] text-sm font-bold text-[var(--slot4-accent)]">{i + 1}</span>
                    <span className="text-sm font-semibold text-[var(--slot4-page-text)]">{tip}</span>
                  </div>
                ))}
              </div>
            </aside>

            {/* Form card */}
            <form onSubmit={submit} className="rounded-3xl border border-[var(--editable-border)] bg-[var(--slot4-surface-bg)] p-6 shadow-[0_18px_46px_rgba(94,0,6,0.10)] sm:p-8">
              <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[var(--editable-border)] pb-6">
                <div>
                  <p className="text-[11px] font-bold uppercase tracking-[0.22em] text-[var(--slot4-accent)]">Create a post</p>
                  <h2 className="editable-display mt-1.5 text-2xl font-bold tracking-[-0.02em] sm:text-3xl">{pagesContent.create.formTitle}</h2>
                </div>
                <span className="inline-flex items-center gap-2 rounded-full bg-[var(--slot4-warm)] px-4 py-2 text-xs font-bold text-[var(--slot4-page-text)]">
                  <span className="flex h-6 w-6 items-center justify-center rounded-full bg-[var(--slot4-accent)] text-[11px] text-white">{(session.name || 'U').charAt(0).toUpperCase()}</span>
                  {session.name}
                </span>
              </div>

              <div className="mt-6 grid gap-5">
                <div>
                  <label className={fieldLabel}>Title</label>
                  <input className={fieldClass} value={title} onChange={(event) => setTitle(event.target.value)} placeholder="Give your post a clear title" required />
                </div>
                <div className="grid gap-5 sm:grid-cols-2">
                  <div>
                    <label className={fieldLabel}>Category</label>
                    <input className={fieldClass} value={category} onChange={(event) => setCategory(event.target.value)} placeholder="e.g. Services, Events" />
                  </div>
                  <div>
                    <label className={fieldLabel}>Website / source URL</label>
                    <input className={fieldClass} value={url} onChange={(event) => setUrl(event.target.value)} placeholder="https://" />
                  </div>
                </div>
                <div>
                  <label className={fieldLabel}>Featured image URL</label>
                  <input className={fieldClass} value={image} onChange={(event) => setImage(event.target.value)} placeholder="https://…/image.jpg" />
                </div>
                <div>
                  <label className={fieldLabel}>Short summary</label>
                  <textarea className={`${fieldClass} min-h-24 leading-6`} value={summary} onChange={(event) => setSummary(event.target.value)} placeholder="A one or two line summary" required />
                </div>
                <div>
                  <label className={fieldLabel}>Main content</label>
                  <textarea className={`${fieldClass} min-h-48 leading-7`} value={body} onChange={(event) => setBody(event.target.value)} placeholder="Details, notes, or full description" required />
                </div>
              </div>

              {created ? (
                <div className="mt-6 flex items-start gap-3 rounded-2xl border border-[var(--slot4-accent)]/25 bg-[var(--slot4-accent-soft)] p-4">
                  <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-[var(--slot4-accent)]" />
                  <div>
                    <p className="text-sm font-bold text-[var(--slot4-page-text)]">{pagesContent.create.successTitle}</p>
                    <p className="mt-0.5 text-sm text-[var(--slot4-muted-text)]">{created.title}</p>
                  </div>
                </div>
              ) : null}

              <button type="submit" className="mt-6 inline-flex h-12 w-full items-center justify-center gap-2 rounded-full bg-[var(--slot4-accent)] px-6 text-sm font-bold text-white shadow-[0_12px_30px_rgba(213,62,15,0.32)] transition hover:brightness-95 active:scale-[0.99]">
                <Send className="h-4 w-4" /> {pagesContent.create.submitLabel}
              </button>
            </form>
          </div>
        </section>
      </main>
    </EditableSiteShell>
  )
}
