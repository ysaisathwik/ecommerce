import { useUser } from "@clerk/clerk-react";

function UserRoute({ children }) {
  const { user, isLoaded } = useUser();

  if (!isLoaded) return <p className="text-center mt-5">Loading...</p>;

  if (user?.unsafeMetadata?.role !== "user") {
    return <h3 className="text-center mt-5">Only Users Allowed</h3>;
  }

  return children;
}

export default UserRoute;