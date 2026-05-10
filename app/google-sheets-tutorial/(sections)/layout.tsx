import { getTutorialMeta } from '@/lib/tutorial'
import TutorialSidebar from '@/components/TutorialSidebar'

export default function SectionsLayout({ children }: { children: React.ReactNode }) {
  const meta = getTutorialMeta()
  return (
    <div className="flex">
      <TutorialSidebar chapters={meta.chapters} />
      <main className="flex-1 min-w-0">
        {children}
      </main>
    </div>
  )
}
