import Features from "../components/Home/Features";
import HeroComponent from "../components/Home/Hero";

export default function Home() {
	return (
		<div className="mx-auto p-8 w-full">
			<HeroComponent />
			<Features />
		</div>
	);
}
