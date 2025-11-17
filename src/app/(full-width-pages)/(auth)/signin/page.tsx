import SignInForm from "@/components/auth/SignInForm";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Solutions | Cell AI Battery Intelligence",
  description:
    "Explore Cell AI's solutions for EV battery management, SOC/SOH estimation, digital twin, and IoT battery analytics.",
};

export default function SignIn() {
  return <SignInForm />;
}
