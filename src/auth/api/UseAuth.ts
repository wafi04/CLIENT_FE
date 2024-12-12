import { BE_URL } from "@/constant";
import { Register } from "@/types/auth";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { LoginData } from "../components/LoginPage";

export function UseRegister() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: ["register"],
    mutationFn: async (data: Register) => {
      const req = await fetch(`${BE_URL}/auth/register`, {
        method: "POST",
        body: JSON.stringify(data),
        credentials: "include",
        headers: {
          "Content-Type": "Application/json",
        },
      });
      return req.json();
    },
    onError: () => {
      queryClient.cancelQueries({ queryKey: "user" });
      toast.error("Internal Server Error");
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: "user" });
      toast.success("Register Berhasil");
    },
  });
}

export function useLogout() {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  return useMutation({
    mutationKey: ["logout"],
    mutationFn: async () => {
      const req = await fetch(`${BE_URL}/auth/logout`, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "Application/json",
        },
      });
      return req.json();
    },
    onError: () => {
      queryClient.cancelQueries({ queryKey: "user" });
      toast.error("Internal Server Error");
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: "user" });
      localStorage.removeItem("token");
      toast.success("Logout Berhasil");
      window.location.href = "/login";
    },
  });
}

export function UseLogin() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: ["login"],
    mutationFn: async (data: LoginData) => {
      const req = await fetch(`${BE_URL}/auth/login`, {
        method: "POST",
        body: JSON.stringify(data),
        credentials: "include",
        headers: {
          "Content-Type": "Application/json",
        },
      });
      return req.json();
    },
    onError: () => {
      queryClient.cancelQueries({ queryKey: "user" });
      toast.error("Internal Server Error");
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: "user" });
      console.log(data);
      localStorage.setItem("token", data.tokens.accessToken);
      toast.success("Login Berhasil");

      window.location.href = "/";
    },
  });
}

export function useProfileUser() {
  const { data, ...rest } = useQuery({
    queryKey: ["user"],
    queryFn: async () => {
      const req = await fetch(`${BE_URL}/auth/profile`, {
        method: "GET",
        credentials: "include",
        headers: {
          "Content-Type": "Application/json",
        },
      });

      const response = await req.json();
      return response;
    },
    staleTime: 5 * 60 * 10,
    select: (user) => user.data,
  });

  const role = data?.role || null;
  console.log(data);
  return {
    ...rest,
    data,
    role,
    isAdmin: role === "admin",
    isUser: role === "user",
  };
}
