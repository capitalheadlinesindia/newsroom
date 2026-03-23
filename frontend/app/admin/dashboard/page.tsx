"use client"

import { useEffect, useState, useCallback } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"

// ── Types ────────────────────────────────────────────────────────────────────

interface SanityArticle {
  _id: string
  title: string
  titleHindi?: string
  slug: string
  excerpt: string
  image: string
  category: string
  publishedAt: string
}

interface Placement {
  _id?: string
  section: string
  order: number
  articleId: string
  articleTitle: string
  articleSlug: string
  articleImage: string
  articleExcerpt: string
  articleCategory: string
}

interface CategorySetting {
  slug: string
  title: string
  visible: boolean
  order: number
  showInNavbar?: boolean
  showInFooter?: boolean
  showInSidebar?: boolean
}

interface HomepageSection {
  _id: string
  label: string
  categorySlug: string
  maxArticles: number
  visible: boolean
  order: number
}

interface NewsTickerConfig {
  enabled: boolean
  items: string[]
}

type PlacementsMap = Record<string, Placement[]>

// ── Section config ───────────────────────────────────────────────────────────

const SECTIONS = [
  { key: "hero", label: "Hero", description: "Center spotlight — 1 article", maxSlots: 1 },
  { key: "featured", label: "Featured", description: "Left column — up to 12 articles", maxSlots: 12 },
  { key: "sidebar", label: "Sidebar", description: "Right column — up to 12 articles", maxSlots: 12 },
  { key: "newsroom", label: "From the Newsroom", description: "Section carousel — up to 12 articles", maxSlots: 12 },
  { key: "winterOlympics", label: "Winter Olympics", description: "Section carousel — up to 12 articles", maxSlots: 12 },
  { key: "technology", label: "Technology", description: "Section carousel — up to 12 articles", maxSlots: 12 },
  { key: "moreNews_left", label: "More News – Left", description: "Section carousel — up to 12 articles", maxSlots: 12 },
  { key: "moreNews_center", label: "More News – Center", description: "Section carousel — up to 12 articles", maxSlots: 12 },
  { key: "moreNews_right", label: "More News – Right", description: "Section carousel — up to 12 articles", maxSlots: 12 },
  { key: "mustWatch", label: "Must Watch", description: "Section carousel — up to 12 articles", maxSlots: 12 },
]

const BACKEND = process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:5000"

// ── Helpers ───────────────────────────────────────────────────────────────────

function getToken(): string {
  if (typeof window === "undefined") return ""
  return localStorage.getItem("admin_token") || ""
}

// ── Component ─────────────────────────────────────────────────────────────────

export default function AdminDashboard() {
  const router = useRouter()

  const [articles, setArticles] = useState<SanityArticle[]>([])
  const [placements, setPlacements] = useState<PlacementsMap>({})
  const [activeSection, setActiveSection] = useState(SECTIONS[0].key)
  const [activeTab, setActiveTab] = useState<
    "placements" | "categories" | "homepage" | "navbar" | "footer" | "ticker"
  >("placements")
  const [catSettings, setCatSettings] = useState<CategorySetting[]>([])
  const [catSaving, setCatSaving] = useState<string | null>(null)
  const [homepageSections, setHomepageSections] = useState<HomepageSection[]>([])
  const [newSectionLabel, setNewSectionLabel] = useState("")
  const [newSectionSlug, setNewSectionSlug] = useState("")
  const [newSectionMax, setNewSectionMax] = useState(12)
  const [hpSaving, setHpSaving] = useState(false)
  // Inline edit state for homepage sections
  const [editingHpId, setEditingHpId] = useState<string | null>(null)
  const [editHpLabel, setEditHpLabel] = useState("")
  const [editHpSlug, setEditHpSlug] = useState("")
  const [editHpCustomSlug, setEditHpCustomSlug] = useState(false)
  const [editHpMax, setEditHpMax] = useState(12)
  const [editHpSaving, setEditHpSaving] = useState(false)
  // Inline edit state for category titles
  const [editingCatSlug, setEditingCatSlug] = useState<string | null>(null)
  const [editCatTitle, setEditCatTitle] = useState("")
  const [editCatSaving, setEditCatSaving] = useState(false)
  // Section labels — stored in DB only, no localStorage
  const [sectionLabels, setSectionLabels] = useState<Record<string, string>>({})
  const [editingSectionKey, setEditingSectionKey] = useState<string | null>(null)
  const [editSectionName, setEditSectionName] = useState("")

  function getLabel(key: string, fallback: string) {
    return sectionLabels[key] || fallback
  }

  function saveSectionLabel(key: string) {
    if (!editSectionName.trim()) return
    const newLabel = editSectionName.trim()
    setSectionLabels((prev) => ({ ...prev, [key]: newLabel }))
    setEditingSectionKey(null)
    // Persist to backend — DB is the single source of truth
    fetch(`${BACKEND}/api/section-labels/${key}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${getToken()}` },
      body: JSON.stringify({ label: newLabel }),
    }).catch(() => {})
    showToast("Section renamed!")
  }

  const [search, setSearch] = useState("")
  const [tickerEnabled, setTickerEnabled] = useState(false)
  const [tickerItems, setTickerItems] = useState<string[]>([])
  const [tickerInput, setTickerInput] = useState("")
  const [tickerSaving, setTickerSaving] = useState(false)
  const [saving, setSaving] = useState<string | null>(null) // "section:order"
  const [removing, setRemoving] = useState<string | null>(null)
  const [toast, setToast] = useState<{ msg: string; ok: boolean } | null>(null)
  const [loadingInit, setLoadingInit] = useState(true)

  // ── Init: verify token + load data ──────────────────────────────────────────
  useEffect(() => {
    const token = getToken()
    if (!token) {
      router.replace("/admin/login")
      return
    }

    // Verify token with backend
    fetch(`${BACKEND}/api/auth/verify`, {
      headers: { Authorization: `Bearer ${token}` },
    }).then((res) => {
      if (!res.ok) {
        localStorage.removeItem("admin_token")
        document.cookie = "admin_token=; path=/; Max-Age=0"
        router.replace("/admin/login")
      }
    })

    Promise.all([
      fetch("/api/admin/articles").then((r) => r.json()),
      fetch(`${BACKEND}/api/placements`).then((r) => r.json()),
      fetch("/api/admin/categories").then((r) => r.json()),
      fetch(`${BACKEND}/api/homepage-sections/all`, {
        headers: { Authorization: `Bearer ${getToken()}` },
      }).then((r) => r.json()),
      fetch(`${BACKEND}/api/section-labels`).then((r) => r.json()).catch(() => ({})),
      fetch(`${BACKEND}/api/news-ticker`).then((r) => r.json()).catch(() => ({ enabled: false, items: [] })),
    ])
      .then(([arts, plac, sanityCategories, hpSecs, backendLabels, ticker]) => {
        setArticles(Array.isArray(arts) ? arts : [])
        setPlacements(plac || {})
        setHomepageSections(Array.isArray(hpSecs) ? hpSecs : [])
        setTickerEnabled(Boolean((ticker as NewsTickerConfig)?.enabled))
        setTickerItems(Array.isArray((ticker as NewsTickerConfig)?.items) ? (ticker as NewsTickerConfig).items : [])

        // Load labels from DB into state
        const dbLabels: Record<string, string> =
          backendLabels && typeof backendLabels === "object" && !Array.isArray(backendLabels)
            ? backendLabels
            : {}

        // One-time migration: push any old localStorage labels that aren't in DB yet
        try {
          const stored = JSON.parse(localStorage.getItem("sectionLabels") || "{}")
          const missing = Object.entries(stored).filter(([k]) => !dbLabels[k])
          if (missing.length > 0) {
            const tok = getToken()
            missing.forEach(([k, v]) =>
              fetch(`${BACKEND}/api/section-labels/${k}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json", Authorization: `Bearer ${tok}` },
                body: JSON.stringify({ label: v }),
              }).catch(() => {})
            )
            // Merge migrated values into dbLabels for this session
            missing.forEach(([k, v]) => { dbLabels[k] = v as string })
          }
          // Clear localStorage — DB is now the only store
          localStorage.removeItem("sectionLabels")
        } catch { /**/ }

        setSectionLabels(dbLabels)
        // Sync Sanity categories into backend then load settings
        const token = getToken()
        return fetch(`${BACKEND}/api/categories/sync`, {
          method: "POST",
          headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
          body: JSON.stringify(Array.isArray(sanityCategories) ? sanityCategories : []),
        })
          .then((r) => r.json())
          .then((settings) => {
            setCatSettings(Array.isArray(settings) ? settings : [])
          })
          .catch(() => {})
      })
      .finally(() => setLoadingInit(false))
  }, [router])

  // ── Toast helper ────────────────────────────────────────────────────────────
  const showToast = useCallback((msg: string, ok = true) => {
    setToast({ msg, ok })
    setTimeout(() => setToast(null), 3000)
  }, [])

  async function saveTickerConfig() {
    setTickerSaving(true)
    try {
      const res = await fetch(`${BACKEND}/api/news-ticker`, {
        method: "PUT",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${getToken()}` },
        body: JSON.stringify({ enabled: tickerEnabled, items: tickerItems }),
      })
      if (!res.ok) throw new Error()
      const updated = await res.json()
      setTickerEnabled(Boolean(updated?.enabled))
      setTickerItems(Array.isArray(updated?.items) ? updated.items : [])
      showToast("Latest ticker updated!")
    } catch {
      showToast("Ticker save failed.", false)
    } finally {
      setTickerSaving(false)
    }
  }

  // ── Save a slot ─────────────────────────────────────────────────────────────
  async function saveSlot(section: string, order: number, article: SanityArticle) {
    const key = `${section}:${order}`
    setSaving(key)
    try {
        // validate article has required fields (fall back to Hindi title when needed)
        const articleTitleToSend = article.title || (article as any).titleHindi || ""
        const articleSlugToSend = article.slug || (article as any).slug || ""
        if (!article._id || !articleTitleToSend || !articleSlugToSend) {
          throw new Error("articleId, articleTitle, and articleSlug are required.")
        }

        const res = await fetch(`${BACKEND}/api/placements/${section}/${order}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${getToken()}`,
        },
        body: JSON.stringify({
            articleId: article._id,
            articleTitle: articleTitleToSend,
            articleSlug: articleSlugToSend,
            articleImage: article.image,
            articleExcerpt: article.excerpt,
            articleCategory: article.category,
        }),
      })
      if (!res.ok) throw new Error((await res.json()).message)
      const updated = await res.json()

      setPlacements((prev) => {
        const sectionList = [...(prev[section] || [])]
        const idx = sectionList.findIndex((p) => p.order === order)
        if (idx >= 0) sectionList[idx] = updated
        else sectionList.push(updated)
        sectionList.sort((a, b) => a.order - b.order)
        return { ...prev, [section]: sectionList }
      })
      showToast("Placement saved!")
    } catch (err: any) {
      showToast(err.message || "Save failed.", false)
    } finally {
      setSaving(null)
    }
  }

  // ── Remove a slot ───────────────────────────────────────────────────────────
  async function removeSlot(section: string, order: number) {
    const key = `${section}:${order}`
    setRemoving(key)
    try {
      const res = await fetch(`${BACKEND}/api/placements/${section}/${order}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${getToken()}` },
      })
      if (!res.ok) throw new Error((await res.json()).message)

      setPlacements((prev) => ({
        ...prev,
        [section]: (prev[section] || []).filter((p) => p.order !== order),
      }))
      showToast("Placement removed.")
    } catch (err: any) {
      showToast(err.message || "Remove failed.", false)
    } finally {
      setRemoving(null)
    }
  }

  // ── Save edited category title ────────────────────────────────────────────
  async function saveCatTitle(slug: string) {
    if (!editCatTitle.trim()) return
    setEditCatSaving(true)
    try {
      const res = await fetch(`${BACKEND}/api/categories/${slug}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${getToken()}` },
        body: JSON.stringify({ title: editCatTitle.trim() }),
      })
      if (!res.ok) throw new Error()
      const updated = await res.json()
      setCatSettings((prev) => prev.map((c) => (c.slug === slug ? updated : c)))
      setEditingCatSlug(null)
      showToast("Name updated!")
    } catch {
      showToast("Save failed.", false)
    } finally {
      setEditCatSaving(false)
    }
  }

  async function updateCatField(slug: string, payload: any) {
    try {
      const res = await fetch(`${BACKEND}/api/categories/${slug}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${getToken()}` },
        body: JSON.stringify(payload),
      })
      if (!res.ok) throw new Error()
      const updated = await res.json()
      setCatSettings((prev) => prev.map((c) => (c.slug === slug ? updated : c)))
    } catch {
      showToast("Update failed.", false)
    }
  }

  // ── Toggle a category's visibility ──────────────────────────────────────────
  async function toggleCatVisible(slug: string, current: boolean) {
    setCatSaving(slug)
    try {
      const res = await fetch(`${BACKEND}/api/categories/${slug}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${getToken()}` },
        body: JSON.stringify({ visible: !current }),
      })
      if (!res.ok) throw new Error()
      const updated = await res.json()
      setCatSettings((prev) => prev.map((c) => (c.slug === slug ? updated : c)))
      showToast("Category updated!")
    } catch {
      showToast("Update failed.", false)
    } finally {
      setCatSaving(null)
    }
  }

  // ── Homepage sections CRUD ────────────────────────────────────────────────────
  async function createHpSection() {
    if (!newSectionLabel.trim() || !newSectionSlug.trim()) return
    setHpSaving(true)
    try {
      const res = await fetch(`${BACKEND}/api/homepage-sections`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${getToken()}` },
        body: JSON.stringify({ label: newSectionLabel.trim(), categorySlug: newSectionSlug.trim(), maxArticles: newSectionMax }),
      })
      if (!res.ok) throw new Error((await res.json()).message)
      const created = await res.json()
      setHomepageSections((prev) => [...prev, created])
      setNewSectionLabel("")
      setNewSectionSlug("")
      setNewSectionMax(12)
      showToast("Section created!")
    } catch (err: any) {
      showToast(err.message || "Create failed.", false)
    } finally {
      setHpSaving(false)
    }
  }

  async function deleteHpSection(id: string) {
    try {
      const res = await fetch(`${BACKEND}/api/homepage-sections/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${getToken()}` },
      })
      if (!res.ok) throw new Error()
      setHomepageSections((prev) => prev.filter((s) => s._id !== id))
      showToast("Section deleted.")
    } catch {
      showToast("Delete failed.", false)
    }
  }

  async function moveHpSection(id: string, direction: "up" | "down") {
    const sorted = [...homepageSections].sort((a, b) => a.order - b.order)
    const idx = sorted.findIndex((s) => s._id === id)
    if (idx < 0) return
    const swapIdx = direction === "up" ? idx - 1 : idx + 1
    if (swapIdx < 0 || swapIdx >= sorted.length) return
    const reordered = sorted.map((s, i) => {
      if (i === idx) return { id: s._id, order: sorted[swapIdx].order }
      if (i === swapIdx) return { id: s._id, order: sorted[idx].order }
      return { id: s._id, order: s.order }
    })
    try {
      const res = await fetch(`${BACKEND}/api/homepage-sections/bulk/reorder`, {
        method: "PUT",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${getToken()}` },
        body: JSON.stringify(reordered),
      })
      if (!res.ok) throw new Error()
      const all = await res.json()
      setHomepageSections(Array.isArray(all) ? all : [])
      showToast("Order saved!")
    } catch {
      showToast("Reorder failed.", false)
    }
  }

  async function toggleHpVisible(sec: HomepageSection) {
    try {
      const res = await fetch(`${BACKEND}/api/homepage-sections/${sec._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${getToken()}` },
        body: JSON.stringify({ visible: !sec.visible }),
      })
      if (!res.ok) throw new Error()
      const updated = await res.json()
      setHomepageSections((prev) => prev.map((s) => (s._id === sec._id ? updated : s)))
    } catch {
      showToast("Update failed.", false)
    }
  }

  function startEditHp(sec: HomepageSection) {
    setEditingHpId(sec._id)
    setEditHpLabel(sec.label)
    setEditHpSlug(sec.categorySlug)
    setEditHpCustomSlug(!catSettings.some((c) => c.slug === sec.categorySlug))
    setEditHpMax(sec.maxArticles)
  }

  async function saveHpSection(id: string) {
    if (!editHpLabel.trim() || !editHpSlug.trim()) return
    setEditHpSaving(true)
    try {
      const res = await fetch(`${BACKEND}/api/homepage-sections/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${getToken()}` },
        body: JSON.stringify({ label: editHpLabel.trim(), categorySlug: editHpSlug.trim(), maxArticles: editHpMax }),
      })
      if (!res.ok) throw new Error((await res.json()).message)
      const updated = await res.json()
      setHomepageSections((prev) => prev.map((s) => (s._id === id ? updated : s)))
      setEditingHpId(null)
      showToast("Section updated!")
    } catch (err: any) {
      showToast(err.message || "Save failed.", false)
    } finally {
      setEditHpSaving(false)
    }
  }

  // ── Move a category up or down ───────────────────────────────────────────────
  async function moveCat(slug: string, direction: "up" | "down") {
    const sorted = [...catSettings].sort((a, b) => a.order - b.order)
    const idx = sorted.findIndex((c) => c.slug === slug)
    if (idx < 0) return
    const swapIdx = direction === "up" ? idx - 1 : idx + 1
    if (swapIdx < 0 || swapIdx >= sorted.length) return

    const newOrder = sorted.map((c, i) => {
      if (i === idx) return { slug: c.slug, order: sorted[swapIdx].order }
      if (i === swapIdx) return { slug: c.slug, order: sorted[idx].order }
      return { slug: c.slug, order: c.order }
    })

    setCatSaving(slug)
    try {
      const res = await fetch(`${BACKEND}/api/categories/bulk/reorder`, {
        method: "PUT",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${getToken()}` },
        body: JSON.stringify(newOrder),
      })
      if (!res.ok) throw new Error()
      const updated = await res.json()
      setCatSettings(Array.isArray(updated) ? updated : [])
      showToast("Order saved!")
    } catch {
      showToast("Reorder failed.", false)
    } finally {
      setCatSaving(null)
    }
  }

  // ── Logout ──────────────────────────────────────────────────────────────────
  function logout() {
    localStorage.removeItem("admin_token")
    document.cookie = "admin_token=; path=/; Max-Age=0"
    router.push("/admin/login")
  }

  // ── Render ──────────────────────────────────────────────────────────────────
  const activeSectionConfig = SECTIONS.find((s) => s.key === activeSection)!
  const activePlacements = placements[activeSection] || []

  const filteredArticles = articles.filter((a) => {
    const title = (a.title || a.titleHindi || "").toLowerCase()
    const category = (a.category || "").toLowerCase()
    const q = search.toLowerCase()
    return title.includes(q) || category.includes(q)
  })

  if (loadingInit) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <p className="text-gray-500 text-sm">Loading admin panel…</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex flex-col" style={{ fontFamily: "system-ui, sans-serif" }}>
      {/* ── TOP BAR ─────────────────────────────────────────────────────────── */}
      <header className="bg-white border-b border-gray-200 px-6 py-3 flex items-center justify-between shadow-sm">
        <div className="flex items-center gap-3">
          <span className="w-2.5 h-2.5 rounded-full bg-[#bb1919] inline-block" />
          <span className="font-serif font-bold text-gray-900 text-lg">Capital Headlines</span>
          <span className="text-gray-300 text-lg mx-1">|</span>
          <span className="text-sm font-semibold text-gray-500 uppercase tracking-widest">
            Admin Panel
          </span>
        </div>
        <div className="flex items-center gap-4">
          <span className="text-xs text-gray-400">{/* could show logged-in email */}</span>
          <button
            onClick={logout}
            className="text-xs font-semibold text-gray-500 hover:text-[#bb1919] transition"
          >
            Sign out
          </button>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        {/* ── LEFT SIDEBAR ─────────────────────────────────────────────────── */}
        <nav className="w-64 bg-white border-r border-gray-200 shrink-0 overflow-y-auto">
          <p className="px-4 pt-5 pb-2 text-[11px] font-bold uppercase tracking-widest text-gray-400">
            Homepage Sections
          </p>
          {SECTIONS.map((s) => {
            const count = (placements[s.key] || []).length
            const isActive = s.key === activeSection && activeTab === "placements"
            const label = getLabel(s.key, s.label)
            const isEditing = editingSectionKey === s.key
            return (
              <div key={s.key} className={`group flex items-center transition ${
                isActive ? "bg-[#bb1919]" : "hover:bg-gray-50"
              }`}>
                {isEditing ? (
                  /* ── Inline rename input ── */
                  <div className="flex-1 flex items-center gap-1 px-3 py-2">
                    <input
                      autoFocus
                      value={editSectionName}
                      onChange={(e) => setEditSectionName(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") saveSectionLabel(s.key)
                        if (e.key === "Escape") setEditingSectionKey(null)
                      }}
                      className="flex-1 min-w-0 text-sm border border-[#bb1919] rounded px-2 py-0.5 outline-none text-gray-900"
                    />
                    <button onClick={() => saveSectionLabel(s.key)}
                      className="text-xs bg-[#bb1919] text-white font-bold px-2 py-0.5 rounded hover:bg-[#9a1414] shrink-0">
                      ✓
                    </button>
                    <button onClick={() => setEditingSectionKey(null)}
                      className="text-xs text-gray-400 hover:text-gray-700 font-bold shrink-0">
                      ✕
                    </button>
                  </div>
                ) : (
                  <>
                    <button
                      onClick={() => { setActiveSection(s.key); setActiveTab("placements"); setSearch("") }}
                      className={`flex-1 text-left px-4 py-3 flex items-center justify-between text-sm ${
                        isActive ? "text-white" : "text-gray-700"
                      }`}
                    >
                      <span className="font-medium truncate">{label}</span>
                      <span className={`text-xs font-bold rounded-full px-2 py-0.5 shrink-0 ml-1 ${
                        isActive ? "bg-white/20 text-white" : "bg-gray-100 text-gray-500"
                      }`}>
                        {count}/{s.maxSlots}
                      </span>
                    </button>
                    {/* Pencil icon — visible on hover */}
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        setEditingSectionKey(s.key)
                        setEditSectionName(label)
                        setActiveSection(s.key)
                        setActiveTab("placements")
                      }}
                      title="Rename section"
                      className={`shrink-0 pr-2 opacity-0 group-hover:opacity-100 transition ${
                        isActive ? "text-white/70 hover:text-white" : "text-gray-400 hover:text-gray-700"
                      }`}
                    >
                      ✏️
                    </button>
                  </>
                )}
              </div>
            )
          })}

          {/* Site Settings tabs */}
          <p className="px-4 pt-5 pb-2 text-[11px] font-bold uppercase tracking-widest text-gray-400">
            Site Settings
          </p>
          <button
            onClick={() => setActiveTab("categories")}
            className={`w-full text-left px-4 py-3 flex items-center gap-2 transition text-sm ${
              activeTab === "categories"
                ? "bg-[#bb1919] text-white"
                : "text-gray-700 hover:bg-gray-50"
            }`}
          >
            <span className="font-medium">Manage Categories</span>
          </button>
          <button
            onClick={() => setActiveTab("navbar")}
            className={`w-full text-left px-4 py-3 flex items-center gap-2 transition text-sm ${
              activeTab === "navbar"
                ? "bg-[#bb1919] text-white"
                : "text-gray-700 hover:bg-gray-50"
            }`}
          >
            <span className="font-medium">Navbar Links</span>
          </button>
          <button
            onClick={() => setActiveTab("footer")}
            className={`w-full text-left px-4 py-3 flex items-center gap-2 transition text-sm ${
              activeTab === "footer"
                ? "bg-[#bb1919] text-white"
                : "text-gray-700 hover:bg-gray-50"
            }`}
          >
            <span className="font-medium">Footer Links</span>
          </button>
          <button
            onClick={() => setActiveTab("homepage")}
            className={`w-full text-left px-4 py-3 flex items-center justify-between transition text-sm ${
              activeTab === "homepage"
                ? "bg-[#bb1919] text-white"
                : "text-gray-700 hover:bg-gray-50"
            }`}
          >
            <span className="font-medium">Homepage Layout</span>
            <span className={`text-xs font-bold rounded-full px-2 py-0.5 ${
              activeTab === "homepage" ? "bg-white/20 text-white" : "bg-gray-100 text-gray-500"
            }`}>
              {homepageSections.length}
            </span>
          </button>
          <button
            onClick={() => setActiveTab("ticker")}
            className={`w-full text-left px-4 py-3 flex items-center gap-2 transition text-sm ${
              activeTab === "ticker"
                ? "bg-[#bb1919] text-white"
                : "text-gray-700 hover:bg-gray-50"
            }`}
          >
            <span className="font-medium">Latest Ticker</span>
          </button>
        </nav>

        {/* ── MAIN CONTENT ─────────────────────────────────────────────────── */}
        <main className="flex-1 overflow-y-auto p-6 flex gap-6">
          {activeTab === "ticker" ? (
            <div className="flex-1 min-w-0 max-w-2xl">
              <div className="mb-5">
                <h2 className="text-xl font-serif font-bold text-gray-900">Latest News Ticker</h2>
                <p className="text-sm text-gray-500 mt-0.5">
                  Add short text items to show as moving news between Navbar and Top News.
                </p>
              </div>

              <div className="bg-white rounded-xl border border-gray-200 p-4 mb-5">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <p className="text-sm font-semibold text-gray-800">Show ticker on homepage</p>
                    <p className="text-xs text-gray-500">Turn this section on or off anytime.</p>
                  </div>
                  <button
                    onClick={() => setTickerEnabled((v) => !v)}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                      tickerEnabled ? "bg-green-500" : "bg-gray-200"
                    }`}
                  >
                    <span className={`inline-block h-4.5 w-4.5 transform rounded-full bg-white transition-transform ${
                      tickerEnabled ? "translate-x-6" : "translate-x-1"
                    }`} />
                  </button>
                </div>

                <div className="flex gap-2 mb-3">
                  <input
                    type="text"
                    value={tickerInput}
                    onChange={(e) => setTickerInput(e.target.value)}
                    placeholder="Type latest news text..."
                    className="flex-1 border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-[#bb1919]"
                  />
                  <button
                    onClick={() => {
                      const text = tickerInput.trim()
                      if (!text) return
                      setTickerItems((prev) => (prev.length >= 30 ? prev : [...prev, text]))
                      setTickerInput("")
                    }}
                    className="shrink-0 bg-gray-900 text-white text-sm font-bold px-4 py-2 rounded-lg hover:bg-black transition"
                  >
                    Add
                  </button>
                </div>

                <div className="space-y-2">
                  {tickerItems.map((item, idx) => (
                    <div key={`${item}-${idx}`} className="flex items-center gap-2 border border-gray-100 rounded-lg px-3 py-2">
                      <span className="text-xs text-gray-400 font-bold">{idx + 1}.</span>
                      <p className="flex-1 text-sm text-gray-800">{item}</p>
                      <button
                        onClick={() => setTickerItems((prev) => prev.filter((_, i) => i !== idx))}
                        className="text-xs text-red-600 hover:text-red-800 font-semibold"
                      >
                        Remove
                      </button>
                    </div>
                  ))}
                  {tickerItems.length === 0 && (
                    <p className="text-sm text-gray-400 italic">No ticker items yet. Add a few short lines.</p>
                  )}
                </div>

                <div className="mt-4 flex justify-end">
                  <button
                    onClick={saveTickerConfig}
                    disabled={tickerSaving}
                    className="bg-[#bb1919] text-white text-sm font-bold px-4 py-2 rounded-lg hover:bg-[#9a1414] transition disabled:opacity-50"
                  >
                    {tickerSaving ? "Saving…" : "Save ticker"}
                  </button>
                </div>
              </div>
            </div>
          ) : activeTab === "homepage" ? (
            /* ── HOMEPAGE LAYOUT PANEL ────────────────────────────────────── */
            <div className="flex-1 min-w-0 max-w-2xl">
              <div className="mb-5">
                <h2 className="text-xl font-serif font-bold text-gray-900">Homepage Layout</h2>
                <p className="text-sm text-gray-500 mt-0.5">
                  Create category-based sections. Articles are auto-fetched from Sanity.
                </p>
              </div>

              {/* Add section form */}
              <div className="bg-white rounded-xl border border-gray-200 p-4 mb-5">
                <h3 className="text-sm font-bold text-gray-800 mb-3">Add New Section</h3>
                <div className="flex flex-col sm:flex-row gap-2">
                  <input
                    type="text"
                    placeholder="Section label (e.g. Sports)"
                    value={newSectionLabel}
                    onChange={(e) => setNewSectionLabel(e.target.value)}
                    className="flex-1 border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-[#bb1919]"
                  />
                  <select
                    value={newSectionSlug}
                    onChange={(e) => setNewSectionSlug(e.target.value)}
                    className="flex-1 border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-[#bb1919] bg-white"
                  >
                    <option value="">— Pick category —</option>
                    {[...catSettings].sort((a, b) => a.order - b.order).map((c) => (
                      <option key={c.slug} value={c.slug}>{c.title} ({c.slug})</option>
                    ))}
                  </select>
                  <select
                    value={newSectionMax}
                    onChange={(e) => setNewSectionMax(Number(e.target.value))}
                    className="w-28 border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-[#bb1919] bg-white"
                  >
                    <option value={2}>2 articles</option>
                    <option value={4}>4 articles</option>
                    <option value={6}>6 articles</option>
                    <option value={8}>8 articles</option>
                    <option value={10}>10 articles</option>
                    <option value={12}>12 articles</option>
                  </select>
                  <button
                    onClick={createHpSection}
                    disabled={hpSaving || !newSectionLabel.trim() || !newSectionSlug.trim()}
                    className="shrink-0 bg-[#bb1919] text-white text-sm font-bold px-4 py-2 rounded-lg hover:bg-[#9a1414] transition disabled:opacity-50"
                  >
                    {hpSaving ? "Adding…" : "Add"}
                  </button>
                </div>
              </div>

              {/* Section list */}
              <div className="space-y-2">
                {[...homepageSections].sort((a, b) => a.order - b.order).map((sec, idx, arr) => (
                  <div
                    key={sec._id}
                    className="bg-white rounded-xl border border-gray-200 px-4 py-3 flex flex-col gap-2"
                  >
                    {/* Top row: reorder / label / actions */}
                    <div className="flex items-center gap-3">
                      {/* Up / Down */}
                      <div className="flex flex-col gap-0.5 shrink-0">
                        <button onClick={() => moveHpSection(sec._id, "up")} disabled={idx === 0}
                          className="text-gray-400 hover:text-gray-700 disabled:opacity-20 text-xs leading-none">▲</button>
                        <button onClick={() => moveHpSection(sec._id, "down")} disabled={idx === arr.length - 1}
                          className="text-gray-400 hover:text-gray-700 disabled:opacity-20 text-xs leading-none">▼</button>
                      </div>

                      {/* Label + slug (display) */}
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-gray-800">{sec.label}</p>
                        <p className="text-xs text-gray-400 font-mono">{sec.categorySlug} · {sec.maxArticles} articles</p>
                      </div>

                      {/* Visibility toggle */}
                      <button onClick={() => toggleHpVisible(sec)}
                        className={`relative inline-flex h-5 w-9 shrink-0 items-center rounded-full transition-colors ${
                          sec.visible ? "bg-green-500" : "bg-gray-200"}`}>
                        <span className={`inline-block h-3.5 w-3.5 transform rounded-full bg-white transition-transform ${
                          sec.visible ? "translate-x-4" : "translate-x-1"}`} />
                      </button>
                      <span className={`text-xs font-semibold w-14 shrink-0 ${
                        sec.visible ? "text-green-600" : "text-gray-400"}`}>
                        {sec.visible ? "Visible" : "Hidden"}
                      </span>

                      {/* Edit / Delete */}
                      {editingHpId === sec._id ? (
                        <button onClick={() => setEditingHpId(null)}
                          className="text-xs text-gray-400 hover:text-gray-600 font-semibold transition shrink-0">
                          Cancel
                        </button>
                      ) : (
                        <button onClick={() => startEditHp(sec)}
                          className="text-xs text-blue-600 hover:text-blue-800 font-semibold transition shrink-0">
                          Edit
                        </button>
                      )}
                      <button onClick={() => deleteHpSection(sec._id)}
                        className="text-xs text-red-500 hover:text-red-700 font-semibold transition shrink-0">
                        Delete
                      </button>
                    </div>

                    {/* Inline edit form */}
                    {editingHpId === sec._id && (
                      <div className="border-t border-gray-100 pt-3 flex flex-col gap-2">
                        {/* Label */}
                        <div className="flex gap-2 items-center">
                          <label className="text-xs text-gray-500 w-24 shrink-0">Section name</label>
                          <input
                            type="text"
                            value={editHpLabel}
                            onChange={(e) => setEditHpLabel(e.target.value)}
                            className="flex-1 border border-gray-200 rounded-lg px-3 py-1.5 text-sm outline-none focus:ring-2 focus:ring-[#bb1919]"
                          />
                        </div>
                        {/* Category slug */}
                        <div className="flex gap-2 items-center">
                          <label className="text-xs text-gray-500 w-24 shrink-0">Category</label>
                          <div className="flex-1 flex gap-2">
                            {!editHpCustomSlug ? (
                              <select
                                value={editHpSlug}
                                onChange={(e) => setEditHpSlug(e.target.value)}
                                className="flex-1 border border-gray-200 rounded-lg px-3 py-1.5 text-sm outline-none focus:ring-2 focus:ring-[#bb1919] bg-white"
                              >
                                <option value="">— Pick category —</option>
                                {[...catSettings].sort((a, b) => a.order - b.order).map((c) => (
                                  <option key={c.slug} value={c.slug}>{c.title} ({c.slug})</option>
                                ))}
                              </select>
                            ) : (
                              <input
                                type="text"
                                value={editHpSlug}
                                onChange={(e) => setEditHpSlug(e.target.value)}
                                placeholder="custom-slug"
                                className="flex-1 border border-gray-200 rounded-lg px-3 py-1.5 text-sm outline-none focus:ring-2 focus:ring-[#bb1919]"
                              />
                            )}
                            <button
                              onClick={() => { setEditHpCustomSlug((v) => !v); setEditHpSlug("") }}
                              className="text-xs text-blue-500 hover:text-blue-700 font-semibold shrink-0"
                            >
                              {editHpCustomSlug ? "Pick from list" : "Custom slug"}
                            </button>
                          </div>
                        </div>
                        {/* Max articles */}
                        <div className="flex gap-2 items-center">
                          <label className="text-xs text-gray-500 w-24 shrink-0">Articles shown</label>
                          <select
                            value={editHpMax}
                            onChange={(e) => setEditHpMax(Number(e.target.value))}
                            className="border border-gray-200 rounded-lg px-3 py-1.5 text-sm outline-none focus:ring-2 focus:ring-[#bb1919] bg-white"
                          >
                            <option value={2}>2</option>
                            <option value={4}>4</option>
                            <option value={6}>6</option>
                            <option value={8}>8</option>
                            <option value={10}>10</option>
                            <option value={12}>12</option>
                          </select>
                        </div>
                        {/* Save */}
                        <div className="flex justify-end">
                          <button
                            onClick={() => saveHpSection(sec._id)}
                            disabled={editHpSaving || !editHpLabel.trim() || !editHpSlug.trim()}
                            className="bg-[#bb1919] text-white text-xs font-bold px-4 py-1.5 rounded-lg hover:bg-[#9a1414] transition disabled:opacity-50"
                          >
                            {editHpSaving ? "Saving…" : "Save changes"}
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
                {homepageSections.length === 0 && (
                  <p className="text-sm text-gray-400 italic">
                    No sections yet. Add one above &mdash; categories are synced from the &ldquo;Manage Categories&rdquo; tab.
                  </p>
                )}
              </div>
            </div>
          ) : activeTab === "categories" ? (
            /* ── CATEGORIES PANEL ──────────────────────────────────────────── */
            <div className="flex-1 min-w-0 max-w-lg">
              <div className="mb-5">
                <h2 className="text-xl font-serif font-bold text-gray-900">Manage Categories</h2>
                <p className="text-sm text-gray-500 mt-0.5">
                  Control which categories appear in the Navbar and Footer, and in what order.
                </p>
              </div>
              <div className="space-y-2">
                {[...catSettings].sort((a, b) => a.order - b.order).map((cat, idx, arr) => (
                  <div
                    key={cat.slug}
                    className="bg-white rounded-xl border border-gray-200 px-4 py-3 flex items-center gap-3"
                  >
                    {/* Up / Down */}
                    <div className="flex flex-col gap-0.5">
                      <button
                        onClick={() => moveCat(cat.slug, "up")}
                        disabled={idx === 0 || catSaving === cat.slug}
                        className="text-gray-400 hover:text-gray-700 disabled:opacity-20 text-xs leading-none"
                        title="Move up"
                      >
                        ▲
                      </button>
                      <button
                        onClick={() => moveCat(cat.slug, "down")}
                        disabled={idx === arr.length - 1 || catSaving === cat.slug}
                        className="text-gray-400 hover:text-gray-700 disabled:opacity-20 text-xs leading-none"
                        title="Move down"
                      >
                        ▼
                      </button>
                    </div>

                    {/* Title — editable inline */}
                    <div className="flex-1 min-w-0">
                      {editingCatSlug === cat.slug ? (
                        <div className="flex gap-1 items-center">
                          <input
                            type="text"
                            value={editCatTitle}
                            onChange={(e) => setEditCatTitle(e.target.value)}
                            onKeyDown={(e) => { if (e.key === "Enter") saveCatTitle(cat.slug); if (e.key === "Escape") setEditingCatSlug(null) }}
                            autoFocus
                            className="flex-1 min-w-0 border border-[#bb1919] rounded px-2 py-1 text-sm outline-none"
                          />
                          <button onClick={() => saveCatTitle(cat.slug)} disabled={editCatSaving}
                            className="text-xs bg-[#bb1919] text-white font-bold px-2 py-1 rounded hover:bg-[#9a1414] disabled:opacity-50 transition shrink-0">
                            {editCatSaving ? "…" : "Save"}
                          </button>
                          <button onClick={() => setEditingCatSlug(null)}
                            className="text-xs text-gray-400 hover:text-gray-700 font-semibold shrink-0">✕</button>
                        </div>
                      ) : (
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-semibold text-gray-800">{cat.title}</span>
                          <button
                            onClick={() => { setEditingCatSlug(cat.slug); setEditCatTitle(cat.title) }}
                            className="text-[10px] text-blue-500 hover:text-blue-700 font-semibold transition"
                          >
                            Edit name
                          </button>
                        </div>
                      )}
                      <span className="text-xs text-gray-400 font-mono">{cat.slug}</span>
                    </div>

                    {/* Location toggles */}
                    <div className="flex items-center gap-2">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => updateCatField(cat.slug, { showInNavbar: !cat.showInNavbar })}
                          className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors ${
                            cat.showInNavbar ? "bg-green-500" : "bg-gray-200"
                          }`}
                          title="Show in Navbar"
                        >
                          <span className={`inline-block h-3.5 w-3.5 transform rounded-full bg-white transition-transform ${
                            cat.showInNavbar ? "translate-x-4" : "translate-x-1"
                          }`} />
                        </button>
                        <span className="text-[10px] text-gray-500">Nav</span>
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => updateCatField(cat.slug, { showInFooter: !cat.showInFooter })}
                          className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors ${
                            cat.showInFooter ? "bg-green-500" : "bg-gray-200"
                          }`}
                          title="Show in Footer"
                        >
                          <span className={`inline-block h-3.5 w-3.5 transform rounded-full bg-white transition-transform ${
                            cat.showInFooter ? "translate-x-4" : "translate-x-1"
                          }`} />
                        </button>
                        <span className="text-[10px] text-gray-500">Footer</span>
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => updateCatField(cat.slug, { showInSidebar: !cat.showInSidebar })}
                          className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors ${
                            cat.showInSidebar ? "bg-green-500" : "bg-gray-200"
                          }`}
                          title="Show in Sidebar"
                        >
                          <span className={`inline-block h-3.5 w-3.5 transform rounded-full bg-white transition-transform ${
                            cat.showInSidebar ? "translate-x-4" : "translate-x-1"
                          }`} />
                        </button>
                        <span className="text-[10px] text-gray-500">Sidebar</span>
                      </div>
                    </div>
                  </div>
                ))}
                {catSettings.length === 0 && (
                  <p className="text-sm text-gray-400 italic">No categories synced yet. They sync automatically on load.</p>
                )}
              </div>
            </div>
          ) : activeTab === "navbar" ? (
            /* ── NAVBAR LINKS PANEL ───────────────────────────────────────── */
            <div className="flex-1 min-w-0 max-w-lg">
              <div className="mb-5">
                <h2 className="text-xl font-serif font-bold text-gray-900">Navbar Links</h2>
                <p className="text-sm text-gray-500 mt-0.5">Toggle which categories appear in the site navbar.</p>
              </div>
              <div className="space-y-2">
                {[...catSettings].sort((a, b) => a.order - b.order).map((cat) => (
                  <div key={cat.slug} className="bg-white rounded-xl border border-gray-200 px-4 py-3 flex items-center gap-3">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-semibold text-gray-800">{cat.title}</span>
                      </div>
                      <span className="text-xs text-gray-400 font-mono">{cat.slug}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => updateCatField(cat.slug, { showInNavbar: !cat.showInNavbar })}
                        className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors ${
                          cat.showInNavbar ? "bg-green-500" : "bg-gray-200"
                        }`}
                        title="Show in Navbar"
                      >
                        <span className={`inline-block h-3.5 w-3.5 transform rounded-full bg-white transition-transform ${
                          cat.showInNavbar ? "translate-x-4" : "translate-x-1"
                        }`} />
                      </button>
                      <span className="text-[10px] text-gray-500">Included</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : activeTab === "footer" ? (
            /* ── FOOTER LINKS PANEL ───────────────────────────────────────── */
            <div className="flex-1 min-w-0 max-w-lg">
              <div className="mb-5">
                <h2 className="text-xl font-serif font-bold text-gray-900">Footer Links</h2>
                <p className="text-sm text-gray-500 mt-0.5">Toggle which categories appear in the site footer.</p>
              </div>
              <div className="space-y-2">
                {[...catSettings].sort((a, b) => a.order - b.order).map((cat) => (
                  <div key={cat.slug} className="bg-white rounded-xl border border-gray-200 px-4 py-3 flex items-center gap-3">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-semibold text-gray-800">{cat.title}</span>
                      </div>
                      <span className="text-xs text-gray-400 font-mono">{cat.slug}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => updateCatField(cat.slug, { showInFooter: !cat.showInFooter })}
                        className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors ${
                          cat.showInFooter ? "bg-green-500" : "bg-gray-200"
                        }`}
                        title="Show in Footer"
                      >
                        <span className={`inline-block h-3.5 w-3.5 transform rounded-full bg-white transition-transform ${
                          cat.showInFooter ? "translate-x-4" : "translate-x-1"
                        }`} />
                      </button>
                      <span className="text-[10px] text-gray-500">Included</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <>
              {/* LEFT PANE – Current slots ─────────────────────────────────── */}
          <div className="flex-1 min-w-0">
            <div className="mb-5">
              <h2 className="text-xl font-serif font-bold text-gray-900">
                {getLabel(activeSectionConfig.key, activeSectionConfig.label)}
              </h2>
              <p className="text-sm text-gray-500 mt-0.5">{activeSectionConfig.description}</p>
            </div>

            <div className="space-y-3">
              {Array.from({ length: activeSectionConfig.maxSlots }, (_, i) => {
                const placed = activePlacements.find((p) => p.order === i)
                const key = `${activeSection}:${i}`
                const isSaving = saving === key
                const isRemoving = removing === key

                return (
                  <div
                    key={i}
                    className="bg-white rounded-xl border border-gray-200 p-4 flex gap-4 items-start"
                  >
                    {/* Slot number badge */}
                    <span className="shrink-0 w-7 h-7 rounded-full bg-gray-100 text-gray-500 text-xs font-bold flex items-center justify-center mt-0.5">
                      {i + 1}
                    </span>

                    {placed ? (
                      <>
                        {/* Thumbnail */}
                        {placed.articleImage ? (
                          <div className="shrink-0 w-16 h-12 relative overflow-hidden rounded">
                            <Image
                              src={placed.articleImage}
                              alt={placed.articleTitle}
                              fill
                              className="object-cover"
                            />
                          </div>
                        ) : (
                          <div className="shrink-0 w-16 h-12 bg-gray-100 rounded" />
                        )}

                        {/* Info */}
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-semibold text-gray-900 leading-snug line-clamp-2">
                            {placed.articleTitle}
                          </p>
                          {placed.articleCategory && (
                            <p className="text-xs text-[#bb1919] font-bold uppercase mt-1 tracking-wide">
                              {placed.articleCategory}
                            </p>
                          )}
                        </div>

                        {/* Remove btn */}
                        <button
                          onClick={() => removeSlot(activeSection, i)}
                          disabled={!!isRemoving}
                          className="shrink-0 text-xs text-red-500 hover:text-red-700 font-semibold transition disabled:opacity-50"
                        >
                          {isRemoving ? "…" : "Remove"}
                        </button>
                      </>
                    ) : (
                      <p className="text-sm text-gray-400 italic mt-0.5">Empty slot</p>
                    )}
                    {isSaving && (
                      <span className="shrink-0 text-xs text-gray-400 mt-0.5">Saving…</span>
                    )}
                  </div>
                )
              })}
            </div>
          </div>

          {/* RIGHT PANE – Article picker ─────────────────────────────────── */}
          <div className="w-80 shrink-0">
            <div className="bg-white rounded-xl border border-gray-200 sticky top-0 overflow-hidden">
              <div className="px-4 pt-4 pb-3 border-b border-gray-100">
                <h3 className="text-sm font-bold text-gray-800 mb-2">Pick an Article</h3>
                <input
                  type="text"
                  placeholder="Search title or category…"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-[#bb1919] focus:border-transparent"
                />
              </div>

              {/* Slot selector */}
              <div className="px-4 py-2 border-b border-gray-100 bg-gray-50">
                <p className="text-[11px] text-gray-400 font-semibold uppercase tracking-widest mb-1">
                  Place into slot
                </p>
                <div className="flex flex-wrap gap-1">
                  {Array.from({ length: activeSectionConfig.maxSlots }, (_, i) => (
                    <SlotButton
                      key={i}
                      index={i}
                      section={activeSection}
                      placements={activePlacements}
                      activeSection={activeSection}
                      filteredArticles={filteredArticles}
                      saving={saving}
                      saveSlot={saveSlot}
                    />
                  ))}
                </div>
              </div>

              {/* Article list */}
              <div className="overflow-y-auto" style={{ maxHeight: "calc(100vh - 270px)" }}>
                {filteredArticles.length === 0 ? (
                  <p className="text-sm text-gray-400 italic px-4 py-6 text-center">
                    {articles.length === 0 ? "Loading articles…" : "No articles match."}
                  </p>
                ) : (
                  filteredArticles.map((article) => (
                    <ArticleRow
                      key={article._id}
                      article={article}
                      section={activeSection}
                      maxSlots={activeSectionConfig.maxSlots}
                      activePlacements={activePlacements}
                      saving={saving}
                      saveSlot={saveSlot}
                    />
                  ))
                )}
              </div>
            </div>
          </div>
            </>
          )}
        </main>
      </div>

      {/* ── TOAST ─────────────────────────────────────────────────────────── */}
      {toast && (
        <div
          className={`fixed bottom-5 right-5 px-4 py-3 rounded-xl shadow-lg text-sm font-semibold text-white transition-all ${
            toast.ok ? "bg-green-600" : "bg-red-600"
          }`}
        >
          {toast.msg}
        </div>
      )}
    </div>
  )
}

// ── Sub-components ────────────────────────────────────────────────────────────

function SlotButton({
  index,
  section,
  placements,
  filteredArticles,
  saving,
  saveSlot,
}: {
  index: number
  section: string
  placements: Placement[]
  activeSection: string
  filteredArticles: SanityArticle[]
  saving: string | null
  saveSlot: (section: string, order: number, article: SanityArticle) => void
}) {
  const filled = placements.some((p) => p.order === index)
  return (
    <span
      className={`text-xs px-2 py-1 rounded font-bold border ${
        filled
          ? "bg-green-50 border-green-300 text-green-700"
          : "bg-gray-50 border-gray-200 text-gray-500"
      }`}
    >
      Slot {index + 1}
    </span>
  )
}

function ArticleRow({
  article,
  section,
  maxSlots,
  activePlacements,
  saving,
  saveSlot,
}: {
  article: SanityArticle
  section: string
  maxSlots: number
  activePlacements: Placement[]
  saving: string | null
  saveSlot: (section: string, order: number, article: SanityArticle) => void
}) {
  const [chosenSlot, setChosenSlot] = useState(0)

  return (
    <div className="px-4 py-3 border-b border-gray-50 hover:bg-gray-50 transition group">
      <div className="flex gap-2 items-start">
        {article.image ? (
          <div className="relative w-12 h-9 shrink-0 overflow-hidden rounded">
            <Image src={article.image} alt={article.title} fill className="object-cover" />
          </div>
        ) : (
          <div className="w-12 h-9 shrink-0 bg-gray-100 rounded" />
        )}
        <div className="flex-1 min-w-0">
          <p className="text-xs font-semibold text-gray-800 leading-snug line-clamp-2">
            {article.title}
          </p>
          {article.category && (
            <p className="text-[10px] text-[#bb1919] font-bold uppercase tracking-wide mt-0.5">
              {article.category}
            </p>
          )}
        </div>
      </div>

      {/* Slot selector + assign button */}
      <div className="flex items-center gap-2 mt-2">
        <select
          value={chosenSlot}
          onChange={(e) => setChosenSlot(Number(e.target.value))}
          className="text-xs border border-gray-200 rounded px-2 py-1 bg-white outline-none"
        >
          {Array.from({ length: maxSlots }, (_, i) => (
            <option key={i} value={i}>
              Slot {i + 1}{activePlacements.find((p) => p.order === i) ? " ●" : ""}
            </option>
          ))}
        </select>
        <button
          onClick={() => saveSlot(section, chosenSlot, article)}
          disabled={saving === `${section}:${chosenSlot}`}
          className="text-xs bg-[#bb1919] text-white font-bold px-3 py-1 rounded hover:bg-[#9a1414] transition disabled:opacity-50"
        >
          {saving === `${section}:${chosenSlot}` ? "…" : "Assign"}
        </button>
      </div>
    </div>
  )
}
