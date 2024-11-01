import { Auth } from "../components/Auth";
import { Quote } from "../components/Quote";
import logo from "../assets/medium.png";

export const Signin = () => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2">
      <div>
        <div className="flex gap-2 items-center">
          <img className="w-8 h-8 mt-2 ml-2" src={logo} alt="" />
          <span className="text-2xl font-bold font-mono mt-2">StorySpace</span>
        </div>
        <Auth type="signin" />
      </div>
      <div>
        <Quote />
      </div>
    </div>
  );
};
