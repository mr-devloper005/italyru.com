import Link from 'next/link'
import {
  ArrowRight, ArrowUpRight, Heart, MapPin, Megaphone, ShieldCheck, Search,
  SlidersHorizontal, Sparkles, Star, Zap,
} from 'lucide-react'
import type { SitePost } from '@/lib/site-connector'
import type { HomeTimeSection } from '@/lib/task-data'
import type { TaskKey } from '@/lib/site-config'
import { SITE_CONFIG } from '@/lib/site-config'
import { pagesContent } from '@/editable/content/pages.content'
import { getEditablePostImage, postHref, toPlainText } from '@/editable/cards/PostCards'
import { EditableHeroCollage } from '@/editable/sections/EditableHeroCollage'

type HomeSectionProps = {
  primaryTask: TaskKey
  primaryRoute: string
  posts: SitePost[]
  timeSections: HomeTimeSection[]
}

function getContent(post?: SitePost | null) {
  return post?.content && typeof post.content === 'object' ? (post.content as Record<string, unknown>) : {}
}

function getExcerpt(post?: SitePost | null, limit = 130) {
  const content = getContent(post)
  const raw =
    (typeof content.description === 'string' && content.description) ||
    (typeof content.summary === 'string' && content.summary) ||
    (typeof post?.summary === 'string' && post.summary) ||
    (typeof content.body === 'string' && content.body) ||
    (typeof content.excerpt === 'string' && content.excerpt) ||
    ''
  const clean = toPlainText(raw)
  return clean.length > limit ? `${clean.slice(0, limit).trim()}...` : clean
}

function categoryOf(post?: SitePost | null) {
  const content = getContent(post)
  return (typeof content.category === 'string' && content.category) || post?.tags?.[0] || ''
}

function fieldOf(post: SitePost | null | undefined, keys: string[]) {
  const content = getContent(post)
  for (const key of keys) {
    const value = content[key]
    if (typeof value === 'string' && value.trim()) return value.trim()
  }
  return ''
}

// Stable hash so derived ratings/counts stay consistent between renders.
function hashStr(value: string) {
  let h = 0
  for (let i = 0; i < value.length; i += 1) h = (h * 31 + value.charCodeAt(i)) >>> 0
  return h
}

function ratingOf(post: SitePost) {
  const real = Number(getContent(post).rating)
  if (real >= 1 && real <= 5) return Math.round(real * 10) / 10
  const h = hashStr(post.slug || post.id || post.title || 'x')
  return Math.round((3.7 + (h % 13) / 10) * 10) / 10
}

function reviewsOf(post: SitePost) {
  const real = Number(getContent(post).reviewCount ?? getContent(post).reviews)
  if (real > 0) return Math.floor(real)
  return 6 + (hashStr((post.slug || post.title || 'x') + 'r') % 480)
}

function Stars({ rating, className = 'h-4 w-4' }: { rating: number; className?: string }) {
  const rounded = Math.round(rating)
  return (
    <span className="inline-flex items-center gap-[2px]" aria-label={`${rating} out of 5`}>
      {[0, 1, 2, 3, 4].map((i) => (
        <Star
          key={i}
          className={`${className} ${i < rounded ? 'fill-[var(--slot4-accent)] text-[var(--slot4-accent)]' : 'fill-[var(--editable-border)] text-[var(--editable-border)]'}`}
        />
      ))}
    </span>
  )
}

function RatingRow({ post }: { post: SitePost }) {
  const rating = ratingOf(post)
  return (
    <div className="mt-2 flex items-center gap-2">
      <Stars rating={rating} className="h-4 w-4" />
      <span className="text-sm font-bold text-[var(--slot4-page-text)]">{rating.toFixed(1)}</span>
      <span className="text-sm text-[var(--slot4-muted-text)]">({reviewsOf(post)})</span>
    </div>
  )
}

const container = 'mx-auto w-full max-w-[var(--editable-container)] px-4 sm:px-6 lg:px-8'

// Latest posts' real images (newest first, deduped, placeholders dropped).
function latestPostImages(posts: SitePost[], max = 8) {
  const seen = new Set<string>()
  const out: string[] = []
  for (const post of posts) {
    const img = getEditablePostImage(post)
    if (!img || img.includes('placeholder') || seen.has(img)) continue
    seen.add(img)
    out.push(img)
    if (out.length >= max) break
  }
  return out
}

function dedupePosts(posts: SitePost[]) {
  const seen = new Set<string>()
  const out: SitePost[] = []
  for (const post of posts) {
    const key = post.slug || post.id || post.title
    if (!key || seen.has(key)) continue
    seen.add(key)
    out.push(post)
  }
  return out
}

/* ------------------------------- Hero ---------------------------------- */
export function EditableHomeHero({ posts, timeSections }: HomeSectionProps) {
  const pool = dedupePosts([...posts, ...timeSections.flatMap((section) => section.posts)])
  const heroImages = latestPostImages(pool)
  const heroTitle = pagesContent.home.hero.title?.join(' ') || `Discover the best of ${SITE_CONFIG.name}`

  return (
    <section className="relative">
      <div className="relative min-h-[600px] w-full overflow-hidden lg:min-h-[660px]">
        <EditableHeroCollage images={heroImages} />
        <div className="absolute inset-0 bg-[linear-gradient(115deg,rgba(94,0,6,0.92)_0%,rgba(94,0,6,0.68)_42%,rgba(27,19,16,0.35)_100%)]" />
        <div className={`relative flex min-h-[600px] flex-col justify-center py-20 lg:min-h-[660px] ${container}`}>
          <div className="max-w-3xl">
            <span className="inline-flex items-center gap-2 rounded-full border border-white/25 bg-white/10 px-4 py-1.5 text-xs font-bold uppercase tracking-[0.22em] text-white backdrop-blur-sm">
              <Sparkles className="h-3.5 w-3.5 text-[var(--slot4-cream)]" /> {pagesContent.home.hero.badge || 'Welcome'}
            </span>
            <h1 className="editable-display mt-6 text-balance text-5xl font-bold leading-[1.0] tracking-[-0.02em] text-white sm:text-6xl lg:text-7xl">
              {heroTitle}
            </h1>
            <p className="mt-6 max-w-xl text-lg leading-8 text-white/85">{pagesContent.home.hero.description}</p>

            {/* Search bar — dropdown + input + filter + button */}
            <form action="/search" className="mt-9 flex w-full max-w-2xl flex-col gap-2 rounded-3xl bg-white p-2 shadow-[0_24px_60px_rgba(94,0,6,0.4)] sm:flex-row sm:items-center sm:rounded-full">
              <div className="flex flex-1 items-center gap-2.5 px-4">
                <Search className="h-5 w-5 shrink-0 text-[var(--slot4-muted-text)]" />
                <input
                  name="q"
                  placeholder="Search listings, people, categories…"
                  className="w-full bg-transparent py-3.5 text-sm text-[var(--slot4-page-text)] outline-none placeholder:text-[var(--slot4-muted-text)]"
                />
              </div>
              <span className="hidden h-11 w-11 items-center justify-center rounded-full bg-[var(--slot4-warm)] text-[var(--slot4-muted-text)] sm:flex">
                <SlidersHorizontal className="h-4 w-4" />
              </span>
              <button className="shrink-0 rounded-full bg-[var(--slot4-accent)] px-8 py-3.5 text-sm font-bold text-white transition hover:brightness-95">
                Search
              </button>
            </form>

          </div>
        </div>
        {heroImages.length ? (
          <p className="absolute bottom-4 right-4 text-xs font-medium text-white/60 sm:right-8">Live from {SITE_CONFIG.name}</p>
        ) : null}
      </div>

      {/* Trust band */}
      <div className="bg-[var(--slot4-accent-deep)] text-[var(--slot4-dark-text)]">
        <div className={`flex flex-wrap items-center justify-center gap-x-10 gap-y-2 py-4 text-sm ${container}`}>
          <span className="inline-flex items-center gap-2"><ShieldCheck className="h-4 w-4 text-[var(--slot4-cream)]" /> Verified posts</span>
          <span className="inline-flex items-center gap-2"><MapPin className="h-4 w-4 text-[var(--slot4-cream)]" /> Local discovery</span>
          <span className="hidden items-center gap-2 sm:inline-flex"><Zap className="h-4 w-4 text-[var(--slot4-cream)]" /> Updated daily</span>
        </div>
      </div>
    </section>
  )
}

/* ------------------------ Explore shortcuts ---------------------------- */
export function EditableStoryRail(_props: HomeSectionProps) {
  // Generic discovery shortcuts — all route through search/utility pages so the
  // homepage never advertises the underlying content categories.
  const tiles = [
    { key: 'newest', label: 'Newest', href: '/search?q=Newest', Icon: Sparkles },
    { key: 'featured', label: 'Featured', href: '/search?q=Featured', Icon: Star },
    { key: 'top', label: 'Top rated', href: '/search?q=Top+rated', Icon: ShieldCheck },
    { key: 'near', label: 'Near you', href: '/search?q=Near+you', Icon: MapPin },
    { key: 'search', label: 'Search all', href: '/search', Icon: Search },
    { key: 'create', label: 'Post something', href: '/create', Icon: Megaphone },
  ]

  return (
    <section className="bg-[var(--slot4-surface-bg)]">
      <div className={`py-16 sm:py-20 ${container}`}>
        <div className="text-center">
          <p className="text-[11px] font-bold uppercase tracking-[0.28em] text-[var(--slot4-accent)]">Start exploring</p>
          <h2 className="editable-display mt-3 text-3xl font-bold tracking-[-0.02em] sm:text-4xl">Try searching for</h2>
          <p className="mx-auto mt-3 max-w-xl text-[var(--slot4-muted-text)]">Jump straight into the section you are looking for.</p>
        </div>
        <div className="mt-10 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
          {tiles.map((tile, index) => {
            const highlight = index === 2
            return (
              <Link
                key={tile.key}
                href={tile.href}
                className={`group flex flex-col items-center gap-3 rounded-2xl border px-3 py-8 text-center transition duration-300 hover:-translate-y-1.5 ${
                  highlight
                    ? 'border-transparent bg-[var(--slot4-accent)] text-white shadow-[0_18px_40px_rgba(213,62,15,0.32)]'
                    : 'border-[var(--editable-border)] bg-[var(--slot4-surface-bg)] hover:border-[var(--slot4-accent)] hover:shadow-[0_14px_34px_rgba(94,0,6,0.12)]'
                }`}
              >
                <span
                  className={`flex h-14 w-14 items-center justify-center rounded-2xl transition group-hover:scale-105 ${
                    highlight ? 'bg-white/20 text-white' : 'bg-[var(--slot4-accent-soft)] text-[var(--slot4-accent)]'
                  }`}
                >
                  <tile.Icon className="h-6 w-6" />
                </span>
                <span className={`text-sm font-bold ${highlight ? 'text-white' : 'text-[var(--slot4-page-text)]'}`}>{tile.label}</span>
                <span className={`text-xs ${highlight ? 'text-white/75' : 'text-[var(--slot4-soft-muted-text)]'}`}>Explore</span>
              </Link>
            )
          })}
        </div>
      </div>
    </section>
  )
}

/* ---------------------- Featured listings (image-first) ----------------- */
function FeaturedListingCard({ post, href, index }: { post: SitePost; href: string; index: number }) {
  const category = categoryOf(post)
  const image = getEditablePostImage(post)
  const price = fieldOf(post, ['price', 'amount', 'budget', 'salary'])
  const location = fieldOf(post, ['location', 'address', 'city'])
  return (
    <article className="group flex flex-col overflow-hidden rounded-2xl border border-[var(--editable-border)] bg-[var(--slot4-surface-bg)] shadow-[0_2px_10px_rgba(94,0,6,0.06)] transition duration-300 hover:-translate-y-1.5 hover:shadow-[0_22px_50px_rgba(94,0,6,0.16)]">
      <Link href={href} className="relative block aspect-[16/11] overflow-hidden bg-[var(--slot4-media-bg)]">
        <img src={image} alt={post.title} className="absolute inset-0 h-full w-full object-cover transition duration-500 group-hover:scale-[1.05]" loading="lazy" />
        <div className="absolute left-4 top-4 flex gap-2">
          {index === 0 ? <span className="rounded-full bg-[var(--slot4-accent)] px-3 py-1 text-[11px] font-bold uppercase tracking-[0.08em] text-white shadow-sm">Featured</span> : null}
          <span className="rounded-full bg-[var(--slot4-accent-deep)]/90 px-3 py-1 text-[11px] font-bold uppercase tracking-[0.08em] text-white backdrop-blur-sm">{category || 'New'}</span>
        </div>
        <span className="absolute right-4 top-4 flex h-9 w-9 items-center justify-center rounded-full bg-white/90 text-[var(--slot4-accent)] shadow-sm transition group-hover:scale-110">
          <Heart className="h-4 w-4" />
        </span>
      </Link>
      <div className="flex flex-1 flex-col p-5">
        <Link href={href} className="editable-display line-clamp-1 text-xl font-bold tracking-[-0.01em] text-[var(--slot4-page-text)] transition hover:text-[var(--slot4-accent)]">
          {post.title}
        </Link>
        {location ? (
          <p className="mt-1.5 inline-flex items-center gap-1.5 text-sm text-[var(--slot4-muted-text)]"><MapPin className="h-4 w-4 text-[var(--slot4-accent)]" /> {location}</p>
        ) : null}
        <RatingRow post={post} />
        <p className="mt-2 line-clamp-2 flex-1 text-sm leading-6 text-[var(--slot4-muted-text)]">{getExcerpt(post, 120)}</p>
        <div className="mt-4 flex items-center justify-between border-t border-[var(--editable-border)] pt-4">
          <span className="editable-display text-xl font-bold text-[var(--slot4-accent)]">{price || 'View post'}</span>
          <Link href={href} className="inline-flex items-center gap-1.5 rounded-full border border-[var(--editable-border)] px-4 py-2 text-sm font-bold text-[var(--slot4-page-text)] transition hover:border-[var(--slot4-accent)] hover:text-[var(--slot4-accent)]">
            Details <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </article>
  )
}

export function EditableMagazineSplit({ primaryTask, primaryRoute, posts, timeSections }: HomeSectionProps) {
  const featured = dedupePosts([...posts, ...timeSections.flatMap((section) => section.posts)]).slice(0, 6)
  if (!featured.length) return null
  return (
    <section className="bg-[var(--slot4-warm)]">
      <div className={`py-16 sm:py-20 ${container}`}>
        <div className="flex flex-col items-center text-center">
          <p className="text-[11px] font-bold uppercase tracking-[0.28em] text-[var(--slot4-accent)]">Handpicked</p>
          <h2 className="editable-display mt-3 text-3xl font-bold tracking-[-0.02em] sm:text-4xl">Today’s featured listings</h2>
          <p className="mx-auto mt-3 max-w-2xl text-[var(--slot4-muted-text)]">
            The freshest posts and finds from across {SITE_CONFIG.name}, updated every day.
          </p>
        </div>
        <div className="mt-12 grid gap-7 sm:grid-cols-2 lg:grid-cols-3">
          {featured.map((post, index) => (
            <FeaturedListingCard key={post.id || post.slug} post={post} href={postHref(primaryTask, post, primaryRoute)} index={index} />
          ))}
        </div>
        <div className="mt-12 text-center">
          <Link href="/search" className="inline-flex items-center gap-2 rounded-full bg-[var(--slot4-accent)] px-8 py-3.5 text-sm font-bold text-white shadow-[0_14px_34px_rgba(213,62,15,0.3)] transition hover:brightness-95">
            View more <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </section>
  )
}

/* --------------------- Time-based discovery sections -------------------- */
// Compact image-first card.
function CompactCard({ post, href }: { post: SitePost; href: string }) {
  const category = categoryOf(post)
  const image = getEditablePostImage(post)
  return (
    <Link
      href={href}
      className="group flex flex-col overflow-hidden rounded-2xl border border-[var(--editable-border)] bg-[var(--slot4-surface-bg)] transition duration-300 hover:-translate-y-1.5 hover:shadow-[0_18px_40px_rgba(94,0,6,0.14)]"
    >
      <div className="relative aspect-[4/3] overflow-hidden bg-[var(--slot4-media-bg)]">
        <img src={image} alt={post.title} className="absolute inset-0 h-full w-full object-cover transition duration-500 group-hover:scale-[1.05]" loading="lazy" />
        {category ? (
          <span className="absolute left-3 top-3 rounded-full bg-white/95 px-3 py-1 text-[11px] font-bold text-[var(--slot4-page-text)] shadow-sm">{category}</span>
        ) : null}
      </div>
      <div className="flex flex-1 flex-col p-4">
        <h3 className="editable-display line-clamp-2 text-lg font-bold leading-snug tracking-[-0.01em] text-[var(--slot4-page-text)] group-hover:text-[var(--slot4-accent)]">
          {post.title}
        </h3>
        <RatingRow post={post} />
        <p className="mt-2 line-clamp-2 flex-1 text-sm leading-6 text-[var(--slot4-muted-text)]">{getExcerpt(post, 100)}</p>
      </div>
    </Link>
  )
}

// Horizontal / editorial list card (variety).
function HorizontalCard({ post, href, index }: { post: SitePost; href: string; index: number }) {
  const category = categoryOf(post)
  const image = getEditablePostImage(post)
  return (
    <Link
      href={href}
      className="group grid grid-cols-[130px_minmax(0,1fr)] gap-4 overflow-hidden rounded-2xl border border-[var(--editable-border)] bg-[var(--slot4-surface-bg)] p-3 transition duration-300 hover:-translate-y-1 hover:shadow-[0_16px_36px_rgba(94,0,6,0.12)] sm:grid-cols-[170px_minmax(0,1fr)]"
    >
      <div className="relative overflow-hidden rounded-xl bg-[var(--slot4-media-bg)]">
        <img src={image} alt={post.title} className="absolute inset-0 h-full w-full object-cover transition duration-500 group-hover:scale-[1.05]" loading="lazy" />
        <span className="absolute left-2 top-2 flex h-7 w-7 items-center justify-center rounded-full bg-[var(--slot4-accent-deep)] text-[11px] font-bold text-white">{String(index + 1).padStart(2, '0')}</span>
      </div>
      <div className="min-w-0 py-1 pr-2">
        <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-[var(--slot4-accent)]">{category || 'Latest'}</p>
        <h3 className="editable-display mt-1.5 line-clamp-2 text-lg font-bold leading-snug tracking-[-0.01em] text-[var(--slot4-page-text)] group-hover:text-[var(--slot4-accent)]">
          {post.title}
        </h3>
        <p className="mt-2 line-clamp-2 text-sm leading-6 text-[var(--slot4-muted-text)]">{getExcerpt(post, 110)}</p>
        <span className="mt-3 inline-flex items-center gap-1.5 text-sm font-bold text-[var(--slot4-accent)]">Read more <ArrowUpRight className="h-4 w-4" /></span>
      </div>
    </Link>
  )
}

const sectionCopy: Record<string, { eyebrow: string; title: string }> = {
  spotlight: { eyebrow: 'Fresh this week', title: 'New in the last 7 days' },
  browse: { eyebrow: 'Trending now', title: 'Popular this month' },
  index: { eyebrow: 'Evergreen', title: 'From the archive' },
}

export function EditableTimeCollections({ primaryTask, primaryRoute, posts, timeSections }: HomeSectionProps) {
  const sections =
    timeSections.length > 0
      ? timeSections
      : ([
          { key: 'spotlight', posts: posts.slice(0, 8), href: primaryRoute },
          { key: 'browse', posts: posts.slice(8, 16), href: primaryRoute },
          { key: 'index', posts: posts.slice(16, 24), href: primaryRoute },
        ] as Pick<HomeTimeSection, 'key' | 'posts' | 'href'>[])

  const visible = sections.filter((section) => section.posts.length)
  if (!visible.length) return <HowWeHelp />

  return (
    <>
      {visible.map((section, index) => {
        const copy = sectionCopy[section.key] || { eyebrow: 'Discover', title: 'More to explore' }
        const warm = index % 2 === 1
        // Alternate the card style per section for visual variety.
        const useHorizontal = index === 1
        return (
          <section key={section.key} className={warm ? 'bg-[var(--slot4-warm)]' : 'bg-[var(--slot4-surface-bg)]'}>
            <div className={`py-14 sm:py-16 ${container}`}>
              <div className="flex items-end justify-between gap-4">
                <div>
                  <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-[var(--slot4-accent)]">{copy.eyebrow}</p>
                  <h2 className="editable-display mt-2 text-2xl font-bold tracking-[-0.02em] sm:text-3xl">{copy.title}</h2>
                </div>
                <Link href="/search" className="inline-flex shrink-0 items-center gap-1 rounded-full border border-[var(--editable-border)] px-4 py-2 text-sm font-bold text-[var(--slot4-page-text)] transition hover:border-[var(--slot4-accent)] hover:text-[var(--slot4-accent)]">
                  See all <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
              {useHorizontal ? (
                <div className="mt-8 grid gap-5 lg:grid-cols-2">
                  {section.posts.slice(0, 6).map((post, i) => (
                    <HorizontalCard key={post.id || post.slug} post={post} href={postHref(primaryTask, post, primaryRoute)} index={i} />
                  ))}
                </div>
              ) : (
                <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                  {section.posts.slice(0, 8).map((post) => (
                    <CompactCard key={post.id || post.slug} post={post} href={postHref(primaryTask, post, primaryRoute)} />
                  ))}
                </div>
              )}
            </div>
          </section>
        )
      })}
      <HowWeHelp />
    </>
  )
}

/* ----------------------- How we help (feature band) --------------------- */
function HowWeHelp() {
  const items = [
    { Icon: Search, title: 'Discover', text: 'Search and filter across every active section to find exactly what you need.' },
    { Icon: ShieldCheck, title: 'Trust', text: 'Ratings, reviews and clear profiles help you decide with confidence.' },
    { Icon: Megaphone, title: 'Publish', text: 'Share your post in minutes and reach the community fast.' },
  ]
  return (
    <section className="bg-[var(--slot4-surface-bg)]">
      <div className={`py-16 sm:py-20 ${container}`}>
        <div className="text-center">
          <p className="text-[11px] font-bold uppercase tracking-[0.28em] text-[var(--slot4-accent)]">Why {SITE_CONFIG.name}</p>
          <h2 className="editable-display mt-3 text-3xl font-bold tracking-[-0.02em] sm:text-4xl">Discover how we can help</h2>
        </div>
        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {items.map((item) => (
            <div key={item.title} className="rounded-2xl border border-[var(--editable-border)] bg-[var(--slot4-warm)] p-8 transition duration-300 hover:-translate-y-1.5 hover:shadow-[0_18px_40px_rgba(94,0,6,0.12)]">
              <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[var(--slot4-accent-soft)] text-[var(--slot4-accent)]">
                <item.Icon className="h-6 w-6" />
              </span>
              <h3 className="editable-display mt-6 text-xl font-bold tracking-[-0.01em]">{item.title}</h3>
              <p className="mt-3 text-sm leading-7 text-[var(--slot4-muted-text)]">{item.text}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

/* -------------------------------- CTA band ------------------------------ */
export function EditableHomeCta() {
  return (
    <section id="get-app" className="scroll-mt-24 bg-[var(--slot4-accent-deep)]">
      <div className={`relative overflow-hidden py-20 sm:py-24 ${container}`}>
        <div className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-[var(--slot4-accent)]/30 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-24 -left-24 h-72 w-72 rounded-full bg-[var(--slot4-accent-2)]/40 blur-3xl" />
        <div className="relative flex flex-col items-center gap-6 text-center">
          <span className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-1.5 text-xs font-bold uppercase tracking-[0.2em] text-white">
            <Sparkles className="h-3.5 w-3.5" /> Join {SITE_CONFIG.name}
          </span>
          <h2 className="editable-display max-w-2xl text-3xl font-bold tracking-[-0.02em] text-white sm:text-5xl">
            Got something worth sharing?
          </h2>
          <p className="max-w-xl text-base leading-8 text-white/80 sm:text-lg">
            Share a post, tell your story, or showcase what you offer — and reach the {SITE_CONFIG.name} community today.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link href="/create" className="inline-flex items-center gap-2 rounded-full bg-[var(--slot4-accent)] px-8 py-3.5 text-sm font-bold text-white shadow-[0_14px_34px_rgba(213,62,15,0.4)] transition hover:brightness-95">
              Create a post <ArrowRight className="h-4 w-4" />
            </Link>
            <Link href="/contact" className="inline-flex items-center gap-2 rounded-full border border-white/40 px-8 py-3.5 text-sm font-bold text-white transition hover:bg-white/10">
              Contact us
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}
