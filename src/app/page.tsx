import TimeConverter from "@/components/time-converter";
import { getExchangeRate } from "@/lib/server-utils";
import { cookies } from "next/headers";

export const dynamic = "force-dynamic";

function getCookieValue(name: string, defaultValue: string) {
	const value = cookies().get(name)?.value;
	return value || defaultValue;
}

export default async function Home() {
	const defaultFrom = "USD";
	const defaultTo = "CLP";
	const exchangeFromName = getCookieValue("exchange_from", defaultFrom);
	const exchangeToName = getCookieValue("exchange_to", defaultTo);

	const response = await getExchangeRate(exchangeFromName, exchangeToName).catch(error => {
		console.error("Error al obtener la tasa de cambio:", error);
		return 928.41;
	});

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
