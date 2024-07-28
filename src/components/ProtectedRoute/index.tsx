import React, { useEffect } from "react";
import { useUserStore } from "../../stores/userStore";
import { useNavigate } from "react-router-dom";
import { Spin } from "antd";

const ProtectedRoute = ({ children }: { children: React.ReactNode }): any => {
  const navigate = useNavigate();

  const loading = useUserStore((state) => state.loading);
  const init = useUserStore((state) => state.init);

  const checkToken = async () => {
    try {
      const { redirect } = await init();
      if (redirect) {
        navigate("/landing");
        return;
      }
    } catch (e) {
      console.error("checkToken", e);
    }
  };

  useEffect(() => {
    void checkToken();
  }, []);

  return loading ? <Spin size={"large"} /> : children;
};

export default ProtectedRoute;
