import { cn } from "@/lib/utils";
import { useNavigate } from "react-router-dom";

type LogoHeaderProps = {
  size?: "medium" | "large";
  hiddenText?: boolean;
};

const LogoHeader = ({ size = "medium", hiddenText = false }: LogoHeaderProps) => {
  const navigate = useNavigate();

  return (
    <div className="cursor-pointer" onClick={() => navigate("/")}>
      <div className="flex items-center gap-2">
        <img src="/favicon.ico" alt="logo" height={size === "large" ? 43 : 24} width={size === "large" ? 43 : 24} />
        <div hidden={hiddenText} className={cn("font-bold", size === "large" ? "text-2xl" : "text-lg")}>
          EvaliaX
        </div>
      </div>
    </div>
  );
};

export default LogoHeader;
