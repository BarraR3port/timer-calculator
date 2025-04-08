import TimeConverter from "@/components/time-converter";
import { getExchangeRate } from "@/lib/server-utils";

export const dynamic = "force-dynamic";

export default async function Home() {
	const response = await getExchangeRate().catch(error => {
		console.error("Error al obtener la tasa de cambio:", error);
		return 928.41;
	});
	const exchangeFromName = String(process.env.EXCHANGE_CURRENCY_FROM);
	const exchangeToName = String(process.env.EXCHANGE_CURRENCY_TO);

	return (
		<main className="min-h-screen flex items-center justify-center p-4 bg-slate-950">
			<TimeConverter
				exchangeAmount={response}
				exchangeFromName={exchangeFromName}
				exchangeToName={exchangeToName}
			/>
		</main>
	);
}
