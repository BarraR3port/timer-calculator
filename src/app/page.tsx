import TimeConverter from "@/components/time-converter";
import { getExchangeRate } from "@/lib/server-utils";

export default async function Home() {
	// const response = await getExchangeRate().catch(error => {
	// 	console.error("Error al obtener la tasa de cambio:", error);
	// 	return 0;
	// });
	// console.log("Response:", response);
	const response = 920;
	return <TimeConverter usdToCLP={response} />;
}
