import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/api";
import { setAuthToken, setAuthUser } from "@/lib/auth";

type LoginResponse = {
  data: {
    token: string;
    user: {
      id: string;
      email: string;
      role: string;
    };
  };
};

export function useLogin() {
  return useMutation({
    mutationFn: async (input: { email: string; password: string }) => {
      const response = await apiRequest<LoginResponse>("/auth/login", {
        method: "POST",
        skipAuth: true,
        body: input,
      });

      setAuthToken(response.data.token);
      setAuthUser(response.data.user);

      return response.data.user;
    },
  });
}
