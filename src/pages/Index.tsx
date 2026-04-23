import { Navigate } from "react-router-dom";
import { isAuthenticated } from "@/lib/auth";

const Index = () => <Navigate to={isAuthenticated() ? "/dashboard" : "/login"} replace />;

export default Index;
