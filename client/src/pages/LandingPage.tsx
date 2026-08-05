import bg from "../assets/bg-landing.png";

export default function LandingPage() {
  return (
    <div
      className="w-full h-screen"
      style={{
        backgroundImage: `url(${bg})`,
        backgroundSize: "100% 100%",
        backgroundRepeat: "no-repeat",
      }}
    >
      landing page
    </div>
  );
}
