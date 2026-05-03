import AdminSidebar from "./AdminSidebar"

export default function AdminPageLayout({ children, title }) {
  return (
    <div className="flex flex-col md:flex-row -mx-6 md:-mx-10 -mt-12 -mb-24 min-h-[calc(100vh-60px)] bg-gray-50">
      <AdminSidebar />
      <div className="flex-1 min-w-0 p-6 md:p-10">
        {title && (
          <div className="mb-8 pb-5 border-b border-gray-200">
            <h1 className="text-2xl font-bold tracking-tight text-gray-900">{title}</h1>
          </div>
        )}
        {children}
      </div>
    </div>
  )
}
