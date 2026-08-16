import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Chrome, Github, Mail } from "lucide-react";
import { startLogin } from "@/const";

export default function SignUpConnectors() {
  const handleGoogleSignUp = startLogin;
  const handleGitHubSignUp = startLogin;
  const handleEmailSignUp = startLogin;

  return (
    <Card className="bg-[#1a1f2e] border border-[#2a2f3e] p-8 max-w-md mx-auto">
      <h3 className="text-2xl font-bold text-[#ff00cc] mb-6 text-center">Join Anom Artsy</h3>
      
      <div className="space-y-3">
        <Button
          className="w-full bg-white text-black hover:bg-gray-100 font-bold flex items-center justify-center gap-2"
          onClick={handleGoogleSignUp}
        >
          <Chrome className="w-5 h-5" />
          Sign up with Google
        </Button>

        <Button
          className="w-full bg-[#1a1a1a] text-white hover:bg-[#2a2a2a] border border-[#3a3a3a] font-bold flex items-center justify-center gap-2"
          onClick={handleGitHubSignUp}
        >
          <Github className="w-5 h-5" />
          Sign up with GitHub
        </Button>

        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-[#2a2f3e]"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-2 bg-[#1a1f2e] text-[#7a7f8e]">or</span>
          </div>
        </div>

        <Button
          className="w-full btn-neon-magenta font-bold flex items-center justify-center gap-2"
          onClick={handleEmailSignUp}
        >
          <Mail className="w-5 h-5" />
          Sign up with Email
        </Button>
      </div>

      <p className="text-xs text-[#7a7f8e] text-center mt-6">
        By signing up, you agree to our Terms of Service and Privacy Policy
      </p>
    </Card>
  );
}
