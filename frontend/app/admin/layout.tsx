export const metadata = { title: "Admin Panel – Capital Headlines" }

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return <div className="min-h-screen bg-gray-100">{children}</div>
}
