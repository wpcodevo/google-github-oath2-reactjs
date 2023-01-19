import { useLocation, useNavigate } from "react-router-dom";
import GitHubLogo from "../assets/github.svg";
import GoogleLogo from "../assets/google.svg";
import { getGitHubUrl } from "../utils/getGithubUrl";
import { getGoogleUrl } from "../utils/getGoogleUrl";
import { object, string, TypeOf } from "zod";
import { useForm, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import useStore from "../store";
import { toast } from "react-toastify";
import { useEffect } from "react";

const loginSchema = object({
  email: string()
    .min(1, "Email address is required")
    .email("Email Address is invalid"),
  password: string()
    .min(1, "Password is required")
    .min(8, "Password must be more than 8 characters")
    .max(32, "Password must be less than 32 characters"),
});

export type LoginInput = TypeOf<typeof loginSchema>;

const LoginPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const store = useStore();
  const from = ((location.state as any)?.from.pathname as string) || "/profile";

  const loginUser = async (data: LoginInput) => {
    try {
      store.setRequestLoading(true);
      const VITE_SERVER_ENDPOINT = import.meta.env.VITE_SERVER_ENDPOINT;
      const response = await fetch(`${VITE_SERVER_ENDPOINT}/api/auth/login`, {
        method: "POST",
        credentials: "include",
        body: JSON.stringify(data),
        headers: {
          "Content-Type": "application/json",
        },
      });
      if (!response.ok) {
        throw await response.json();
      }

      store.setRequestLoading(false);
      navigate("/profile");
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

      toast.error(resMessage, {
        position: "top-right",
      });
    }
  };

  const methods = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
  });

  const {
    reset,
    handleSubmit,
    register,
    formState: { isSubmitSuccessful, errors },
  } = methods;

  useEffect(() => {
    if (isSubmitSuccessful) {
      reset();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isSubmitSuccessful]);

  const onSubmitHandler: SubmitHandler<LoginInput> = (values) => {
    loginUser(values);
  };

  return (
    <section className="bg-ct-blue-600 min-h-screen pt-20">
      <div className="container mx-auto px-6 py-12 h-full flex justify-center items-center">
        <div className="md:w-8/12 lg:w-5/12 bg-white px-8 py-10">
          <form onSubmit={handleSubmit(onSubmitHandler)}>
            <div className="mb-6">
              <input
                type="email"
                className="form-control block w-full px-4 py-5 text-sm font-normal text-gray-700 bg-white bg-clip-padding border border-solid border-gray-300 rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none"
                placeholder="Email address"
                {...register("email")}
              />
              {errors.email && (
                <p className="text-red-700 text-sm mt-1">
                  {errors.email?.message}
                </p>
              )}
            </div>

            <div className="mb-6">
              <input
                type="password"
                className="form-control block w-full px-4 py-5 text-sm font-normal text-gray-700 bg-white bg-clip-padding border border-solid border-gray-300 rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none"
                placeholder="Password"
                {...register("password")}
              />

              {errors.password && (
                <p className="text-red-700 text-sm mt-1">
                  {errors.password?.message}
                </p>
              )}
            </div>

            <div className="flex justify-between items-center mb-6">
              <div className="form-group form-check">
                <input
                  type="checkbox"
                  className="form-check-input appearance-none h-4 w-4 border border-gray-300 rounded-sm bg-white checked:bg-blue-600 checked:border-blue-600 focus:outline-none transition duration-200 mt-1 align-top bg-no-repeat bg-center bg-contain float-left mr-2 cursor-pointer"
                  id="exampleCheck3"
                />
                <label
                  className="form-check-label inline-block text-gray-800"
                  htmlFor="exampleCheck2"
                >
                  Remember me
                </label>
              </div>
              <a
                href="#!"
                className="text-blue-600 hover:text-blue-700 focus:text-blue-700 active:text-blue-800 duration-200 transition ease-in-out"
              >
                Forgot password?
              </a>
            </div>

            <button
              type="submit"
              className="inline-block px-7 py-4 bg-blue-600 text-white font-medium text-sm leading-snug uppercase rounded shadow-md hover:bg-blue-700 hover:shadow-lg focus:bg-blue-700 focus:shadow-lg focus:outline-none focus:ring-0 active:bg-blue-800 active:shadow-lg transition duration-150 ease-in-out w-full"
              data-mdb-ripple="true"
              data-mdb-ripple-color="light"
            >
              Sign in
            </button>

            <div className="flex items-center my-4 before:flex-1 before:border-t before:border-gray-300 before:mt-0.5 after:flex-1 after:border-t after:border-gray-300 after:mt-0.5">
              <p className="text-center font-semibold mx-4 mb-0">OR</p>
            </div>

            <a
              className="px-7 py-2 text-white font-medium text-sm leading-snug uppercase rounded shadow-md hover:shadow-lg focus:shadow-lg focus:outline-none focus:ring-0 active:shadow-lg transition duration-150 ease-in-out w-full flex justify-center items-center mb-3"
              style={{ backgroundColor: "#3b5998" }}
              href={getGoogleUrl(from)}
              role="button"
              data-mdb-ripple="true"
              data-mdb-ripple-color="light"
            >
              <img
                className="pr-2"
                src={GoogleLogo}
                alt=""
                style={{ height: "2rem" }}
              />
              Continue with Google
            </a>
            <a
              className="px-7 py-2 text-white font-medium text-sm leading-snug uppercase rounded shadow-md hover:shadow-lg focus:shadow-lg focus:outline-none focus:ring-0 active:shadow-lg transition duration-150 ease-in-out w-full flex justify-center items-center"
              style={{ backgroundColor: "#55acee" }}
              href={getGitHubUrl(from)}
              role="button"
              data-mdb-ripple="true"
              data-mdb-ripple-color="light"
            >
              <img
                className="pr-2"
                src={GitHubLogo}
                alt=""
                style={{ height: "2.2rem" }}
              />
              Continue with GitHub
            </a>
          </form>
        </div>
      </div>
    </section>
  );
};

export default LoginPage;
