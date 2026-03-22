import { useUser } from "@clerk/clerk-react";
import { useNavigate } from "react-router-dom";

function RoleSelection() {
  const { user } = useUser();
  const navigate = useNavigate();

 const setRole = async (role) => {
  try {
    await user.update({
      unsafeMetadata: { role },
    });

    // ✅ FORCE REFRESH USER DATA
    await user.reload();

    if (role === "admin") {
      navigate("/admin");
    } else {
      navigate("/products");
    }

  } catch (err) {
    console.error("Error setting role:", err);
  }
};

  return (
    <div className="container text-center mt-5">
      <h2>Select Your Role</h2>

      <button
        className="btn btn-primary m-2"
        onClick={() => setRole("user")}
      >
        Continue as User
      </button>

      <button
        className="btn btn-danger m-2"
        onClick={() => setRole("admin")}
      >
        Continue as Admin
      </button>
    </div>
  );
}

export default RoleSelection;