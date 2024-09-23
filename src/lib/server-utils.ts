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

	// Realizar la solicitud a la API
	const API_URL = `https://api.exchangeratesapi.io/v1/latest?access_key=${process.env.EXCHANGE_API_KEY}&symbols=USD,CLP`;

	try {
		const response = await fetch(API_URL);
		const data = await response.json();

		if (data.error) {
			console.error("Error al obtener la tasa de cambio:", data.error);
			throw new Error("Error al obtener la tasa de cambio");
		}

		const rates = data.rates;
		const rateUSD = rates.USD;
		const rateCLP = rates.CLP;

		// Calcular la tasa de USD a CLP
		const usdToClpRate = rateCLP / rateUSD;

		// Almacenar la nueva tasa y la fecha en el caché
		await kv.set("exchange-rate", usdToClpRate);
		await kv.set("exchange-rate-date", exchangeRateDate);

		return usdToClpRate;
	} catch (error) {
		console.error("Error al obtener la tasa de cambio:", error);
		throw error;
	}
}
