import logo from "../assets/logo.svg";

export const Loading = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 to-purple-50 flex items-center justify-center">
      <img src={logo} alt="Loading" className="w-24 h-24 animate-pulse" />
    </div>
  );
};
