import { AUTH_PROVIDER } from "@/constants/common";

type AuthProvider = (typeof AUTH_PROVIDER)[keyof typeof AUTH_PROVIDER];
