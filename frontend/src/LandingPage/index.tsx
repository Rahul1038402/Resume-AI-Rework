import Layout from "@/components/common/Layout";
import NumberedFeatureCards from "./components/CardComponents";
import PainPointsSection from "./components/PainPointsSection";
import HeroSection from "@/LandingPage/components/HeroSection";
import StatsSection from "@/LandingPage/components/StatsSection";

const Index = () => {
  return (
    <Layout>
      {/* Hero Section */}
      <section className="pb-36 overflow-hidden">
        <HeroSection/>

      </section>

      <PainPointsSection/>

      <NumberedFeatureCards />

      <StatsSection />

    </Layout >
  );
};

export default Index;
