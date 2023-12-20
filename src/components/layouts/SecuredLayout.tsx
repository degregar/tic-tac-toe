import React, { useEffect } from "react";
import { useAuth } from "@/lib/hooks/useAuth";
import { useRouter } from "next/navigation";

export const SecuredLayout = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated, isSettled } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (isSettled && !isAuthenticated) {
      router.push("/auth/login");
    }
  }, [isSettled, isAuthenticated]);

  if (!isSettled) {
    return null;
  }

  if (!isAuthenticated) {
    return null;
  }

  return <>{children}</>;
};
