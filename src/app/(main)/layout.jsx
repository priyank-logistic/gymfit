import ProtectedRoute from "@/components/ProtectedRoute";
import Sidebar from "@/components/Sidebar";
import Chatbot from "@/components/Chatbot";

export default function MainLayout({ children }) {
  return (
    <ProtectedRoute>
      <div className="flex min-h-screen bg-black">
        <Sidebar />
        <main className="flex-1 ml-64 bg-black">{children}</main>
        <Chatbot />
      </div>
    </ProtectedRoute>
  );
}
