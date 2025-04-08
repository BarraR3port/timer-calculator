"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { AnimatePresence, motion } from "framer-motion";
import { Calculator, Clock, Coins, DollarSign, List } from "lucide-react";
import { useState } from "react";

type ResultType = {
	hours: number;
	from: number;
	to: number;
};

interface ExchangeRate {
	exchangeAmount: number;
	exchangeFromName: string;
	exchangeToName: string;
}

export default function TimeConverter({ exchangeAmount, exchangeFromName, exchangeToName }: ExchangeRate) {
	const [input, setInput] = useState<string>("");
	const [result, setResult] = useState<ResultType | null>(null);
	const [isCalculating, setIsCalculating] = useState<boolean>(false);

	const parseTimeToHours = (timeString: string): number => {
		const [hoursStr, minutesStr, secondsStr] = timeString.split(":");
		const hours = Number.parseInt(hoursStr, 10) || 0;
		const minutes = Number.parseInt(minutesStr, 10) || 0;
		const seconds = Number.parseInt(secondsStr, 10) || 0;
		return hours + minutes / 60 + seconds / 3600;
	};

	const calculateMoney = () => {
		if (exchangeAmount === null) {
			alert("La tasa de cambio aún no está disponible. Por favor, espera unos segundos e intenta de nuevo.");
			return;
		}

		setIsCalculating(true);
		const lines = input.split("\n").filter(line => line.trim() !== "");
		const totalHours = lines.reduce((sum, line) => {
			const timePart = line.split("\t").pop() || "";
			return sum + parseTimeToHours(timePart);
		}, 0);

		const exchangeFromPerHour = Number(process.env.EXCHANGE_RATE) || 16;

		const from = totalHours * exchangeFromPerHour;
		const to = from * exchangeAmount;

		setResult({
			hours: totalHours,
			from,
			to
		});
		setIsCalculating(false);
	};

	return (
		<Card className="w-full max-w-md mx-auto bg-gradient-to-br from-purple-50 to-blue-50 shadow-lg">
			<CardHeader className="space-y-1">
				<CardTitle className="text-2xl font-bold text-center text-purple-700">
					Conversor de Tiempo a Dinero
				</CardTitle>
				<p className="text-center text-gray-600">Ingrese los tiempos y obtenga su conversion desde {exchangeFromName} a {exchangeToName}</p>
			</CardHeader>
			<CardContent className="space-y-4">
				<div className="space-y-2">
					<label htmlFor="time-input" className="text-sm font-medium text-gray-700 flex items-center gap-2">
						<List className="w-4 h-4 text-purple-600" />
						Ingrese los tiempos (un tiempo por línea)
					</label>
					<Textarea
						id="time-input"
						placeholder={
							"Build Server\t01:28:08\nPack by Waypoint\t50:07:50\nDivine Server\t02:53:50\nFarming (Forge)\t03:47:33"
						}
						value={input}
						onChange={e => setInput(e.target.value)}
						className="w-full h-40 transition-all duration-300 focus:ring-2 focus:ring-purple-500"
					/>
				</div>
				<Button
					onClick={calculateMoney}
					className="w-full bg-purple-600 hover:bg-purple-700 transition-colors duration-300"
					disabled={isCalculating}
				>
					{isCalculating ? (
						<motion.div
							className="flex items-center justify-center"
							initial={{ opacity: 0 }}
							animate={{ opacity: 1 }}
							exit={{ opacity: 0 }}
						>
							<Calculator className="w-5 h-5 mr-2 animate-spin" />
							Calculando...
						</motion.div>
					) : (
						<>
							<Calculator className="w-5 h-5 mr-2" />
							Calcular
						</>
					)}
				</Button>
				<AnimatePresence>
					{result && (
						<motion.div
							initial={{ opacity: 0, y: 20 }}
							animate={{ opacity: 1, y: 0 }}
							exit={{ opacity: 0, y: -20 }}
							transition={{ duration: 0.5 }}
							className="mt-4 space-y-3 bg-white p-4 rounded-lg shadow"
						>
							<p className="text-lg font-semibold text-purple-700">Resultados Totales:</p>
							<div className="flex items-center gap-2 text-gray-700">
								<Clock className="w-5 h-5 text-purple-600" />
								<p>
									Horas totales: <span className="font-medium">{result.hours.toFixed(2)}</span>
								</p>
							</div>
							<div className="flex items-center gap-2 text-gray-700">
								<DollarSign className="w-5 h-5 text-green-600" />
								<p>
									{exchangeFromName}: <span className="font-medium">${result.from.toFixed(2)}</span>
								</p>
							</div>
							<div className="flex items-center gap-2 text-gray-700">
								<DollarSign className="w-5 h-5 text-green-600" />
								<p>
									{exchangeFromName} {"->"} {exchangeToName}:{" "}
									<span className="font-medium">${exchangeAmount?.toFixed(2) || "N/A"}</span>
								</p>
							</div>
							<div className="flex items-center gap-2 text-gray-700">
								<Coins className="w-5 h-5 text-yellow-600" />
								<p>
									{exchangeToName}: <span className="font-medium">${result.to.toLocaleString("es-CL")}</span>
								</p>
							</div>
						</motion.div>
					)}
				</AnimatePresence>
			</CardContent>
		</Card>
	);
}
