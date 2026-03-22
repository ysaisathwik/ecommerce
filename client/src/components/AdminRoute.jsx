import { useUser } from "@clerk/clerk-react";

function AdminRoute({ children }) {
  const { user, isLoaded } = useUser();

  if (!isLoaded) return <p>Loading...</p>;

  if (user?.unsafeMetadata?.role !== "admin") {
    return <h3 className="text-center mt-5">Access Denied</h3>;
  }

  return children;
}

export default AdminRoute;