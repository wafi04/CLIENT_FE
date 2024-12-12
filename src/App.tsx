import { ProtectedLayout } from "./components/layouts/AuthLayout";
import BannerPage from "./components/styling/Banner";
import { SectionGedung } from "./components/styling/SectionGedung";

function App() {
  return (
    <ProtectedLayout title="Home">
      <BannerPage />
      <SectionGedung />
    </ProtectedLayout>
  );
}

export default App;
