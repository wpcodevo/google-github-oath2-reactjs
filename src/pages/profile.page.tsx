import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import useStore from "../store";
import { IUser } from "../store/types";

const ProfilePage = () => {
  const navigate = useNavigate();
  const store = useStore();

  const fetchUser = async () => {
    try {
      store.setRequestLoading(true);
      const VITE_SERVER_ENDPOINT = import.meta.env.VITE_SERVER_ENDPOINT;
      const response = await fetch(`${VITE_SERVER_ENDPOINT}/api/users/me`, {
        credentials: "include",
      });
      if (!response.ok) {
        throw await response.json();
      }

      const data = await response.json();
      const user = data.data.user as IUser;
      store.setRequestLoading(false);
      console.log(user);

      store.setAuthUser(user);
    } catch (error: any) {
      store.setRequestLoading(false);
      if (error.error) {
        error.error.forEach((err: any) => {
          toast.error(err.message, {
            position: "top-right",
          });
        });
        return;
      }
      const resMessage =
        (error.response &&
          error.response.data &&
          error.response.data.message) ||
        error.message ||
        error.toString();

      if (error?.message === "You are not logged in") {
        navigate("/login");
      }

      toast.error(resMessage, {
        position: "top-right",
      });
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);

  const user = store.authUser;

  return (
    <section className="bg-ct-blue-600  min-h-screen pt-20">
      <div className="max-w-4xl mx-auto bg-ct-dark-100 rounded-md h-[20rem] flex justify-center items-center">
        <div>
          <p className="text-5xl text-center font-semibold">Profile Page</p>
          {!user ? (
            <p>Loading...</p>
          ) : (
            <div className="flex items-center gap-8">
              <div>
                <img
                  src={
                    user.photo.includes("default.png")
                      ? `http://localhost:8000/api/images/${user.photo}`
                      : user.photo
                  }
                  className="max-h-36"
                  alt={`profile photo of ${user.name}`}
                />
              </div>
              <div className="mt-8">
                <p className="mb-3">ID: {user.id}</p>
                <p className="mb-3">Name: {user.name}</p>
                <p className="mb-3">Email: {user.email}</p>
                <p className="mb-3">Role: {user.role}</p>
                <p className="mb-3">Provider: {user.provider}</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default ProfilePage;
