import { AUTH_PROVIDER } from "@/constants/commonConstant";

type AuthProvider = (typeof AUTH_PROVIDER)[keyof typeof AUTH_PROVIDER];
