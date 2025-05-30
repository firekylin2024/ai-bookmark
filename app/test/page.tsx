import DebugPanel from "@/components/debug-panel"
import StarryBackground from "@/components/starry-background"

export default function TestPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 p-8">
      <StarryBackground />
      <div className="relative z-10">
        <DebugPanel />
      </div>
    </div>
  )
}
