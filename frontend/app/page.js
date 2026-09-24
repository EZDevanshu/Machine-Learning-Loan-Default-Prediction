import Navbar from './components/Navbar';
import Hero from './components/Hero';
import RiskAssessment from './components/RiskAssessment';
import DatasetInsights from './components/DatasetInsights';
import Analytics from './components/Analytics';
import ModelPerformance from './components/ModelPerformance';
import ModelPipeline from './components/ModelPipeline';
import FeatureExplorer from './components/FeatureExplorer';
import Footer from './components/Footer';

export default function Home() {
  return (
    <main className="min-h-screen bg-slatebg flex flex-col">
      <Navbar />
      <Hero />
      <RiskAssessment />
      <DatasetInsights />
      <Analytics />
      <ModelPerformance />
      <ModelPipeline />
      <FeatureExplorer />
      <Footer />
    </main>
  );
}
