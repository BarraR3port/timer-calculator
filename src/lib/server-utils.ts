import { kv } from "@vercel/kv";
import { format } from "date-fns";
import { toZonedTime } from "date-fns-tz";
import "server-only";

export async function getExchangeRate(): Promise<number> {
	const timeZone = "America/Santiago";
	const nowUTC = new Date();
	const nowInChile = toZonedTime(nowUTC, timeZone);

	// Obtener la hora actual en Chile
	const currentHour = nowInChile.getHours();

	// Determinar la fecha para la tasa de cambio
	let exchangeRateDate: string;

	if (currentHour >= 12) {
		// Después de las 12 PM, usamos la fecha de hoy
		exchangeRateDate = format(nowInChile, "yyyy-MM-dd");
	} else {
		// Antes de las 12 PM, usamos la fecha de ayer
		const yesterdayInChile = new Date(nowInChile);
		yesterdayInChile.setDate(yesterdayInChile.getDate() - 1);
		exchangeRateDate = format(yesterdayInChile, "yyyy-MM-dd");
	}

	// Obtener la tasa de cambio y la fecha de la última actualización desde el caché
	const cachedRate = await kv.get<number>("exchange-rate");
	const lastUpdateDate = await kv.get<string>("exchange-rate-date");

	if (cachedRate !== null && lastUpdateDate === exchangeRateDate) {
		// Si la tasa en caché está actualizada, la devolvemos
		return cachedRate;
	}

	// Call Wise API to get exchange rate
	const sourceCurrency = process.env.EXCHANGE_CURRENCY_FROM as string;
	const targetCurrency = process.env.EXCHANGE_CURRENCY_TO as string;
	const WISE_API_URL = `https://api.transferwise.com/v1/rates?source=${sourceCurrency}&target=${targetCurrency}`;
	try {
		const response = await fetch(WISE_API_URL, {
			headers: { Authorization: `Bearer ${process.env.WISE_API_KEY}` }
		});
		const data = await response.json();
		if (!Array.isArray(data) || data.length === 0) {
			throw new Error(`Invalid response from Wise API: ${JSON.stringify(data)}`);
		}
		const wiseRate = data[0].rate;

		// Store new rate and date in cache
		await kv.set("exchange-rate", wiseRate);
		await kv.set("exchange-rate-date", exchangeRateDate);

		return wiseRate;
	} catch (error) {
		console.error("Error fetching rate from Wise API:", error);
		throw error;
	}
}
