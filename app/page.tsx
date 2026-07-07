import { getLandingData } from "./cms";
import MilkTeaPage from "./MilkTeaPage";

export default async function Home() {
  const data = await getLandingData();
  return <MilkTeaPage data={data} />;
}
