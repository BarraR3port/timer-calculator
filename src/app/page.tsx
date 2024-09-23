import TimeConverter from "@/components/time-converter";
import { getExchangeRate } from "@/lib/server-utils";

export const dynamic = "force-dynamic";

export default async function Home() {
	const response = await getExchangeRate().catch(error => {
		console.error("Error al obtener la tasa de cambio:", error);
		return 928.4029951543705;
	});
	return <TimeConverter usdToCLP={response} />;
}
