"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { AnimatePresence, motion } from "framer-motion";
import { Calculator, Clock, Coins, DollarSign, FileText, Hourglass, Sparkles, Timer } from "lucide-react";
import { useCallback, useState } from "react";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { useRouter } from "next/navigation";

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

const CURRENCIES = [
	{ code: "USD", name: "Dólar estadounidense" },
	{ code: "EUR", name: "Euro" },
	{ code: "CLP", name: "Peso chileno" },
	{ code: "BRL", name: "Real brasileño" },
	{ code: "ARS", name: "Peso argentino" },
	{ code: "MXN", name: "Peso mexicano" },
	{ code: "GBP", name: "Libra esterlina" },
	{ code: "CAD", name: "Dólar canadiense" },
	{ code: "JPY", name: "Yen japonés" },
	{ code: "CNY", name: "Yuan chino" }
];

export default function TimeConverter({ exchangeAmount, exchangeFromName, exchangeToName }: ExchangeRate) {
	const router = useRouter();
	const [input, setInput] = useState<string>("");
	const [result, setResult] = useState<ResultType | null>(null);
	const [isCalculating, setIsCalculating] = useState<boolean>(false);
	const [from, setFrom] = useState(exchangeFromName);
	const [to, setTo] = useState(exchangeToName);
	const [exchangeRate, setExchangeRate] = useState<number>(25);

	const parseTimeToHours = (timeString: string): number => {
		const [hoursStr, minutesStr, secondsStr] = timeString.split(":");
		const hours = Number.parseInt(hoursStr, 10) || 0;
		const minutes = Number.parseInt(minutesStr, 10) || 0;
		const seconds = Number.parseInt(secondsStr, 10) || 0;
		return hours + minutes / 60 + seconds / 3600;
	};

	const calculateMoney = useCallback(() => {
		if (input === "") {
			return;
		}
		console.log("exchangeRate", exchangeRate);
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

		const from = totalHours * exchangeRate;
		const to = from * exchangeAmount;

		setResult({
			hours: totalHours,
			from,
			to
		});
		setIsCalculating(false);
	}, [input, exchangeRate, exchangeAmount]);

	const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
		if (e.key === "Enter" && !e.shiftKey && !e.ctrlKey) {
			e.preventDefault();
			calculateMoney();
		}
	};

	const handleCurrencyChange = (type: "from" | "to", value: string) => {
		if (type === "from") setFrom(value);
		if (type === "to") setTo(value);
		document.cookie = `exchange_from=${type === "from" ? value : from}; path=/; max-age=${60 * 60 * 24 * 30}`;
		document.cookie = `exchange_to=${type === "to" ? value : to}; path=/; max-age=${60 * 60 * 24 * 30}`;
		router.refresh();
		calculateMoney();
	};

	const handleExchangeRateChange = (value: number) => {
		setExchangeRate(value);
	};

	return (
		<div className="relative w-full max-w-xl mx-auto">
			{/* Animated background elements */}
			<div className="absolute inset-0 overflow-hidden rounded-3xl">
				<div className="absolute -top-24 -left-24 w-64 h-64 bg-teal-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob" />
				<div className="absolute -bottom-24 -right-24 w-64 h-64 bg-amber-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000" />
				<div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-rose-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000" />
			</div>

			<Card className="relative z-10 border-0 overflow-hidden backdrop-blur-sm bg-gradient-to-br from-slate-900/95 to-slate-800/95 shadow-[0_0_40px_rgba(0,0,0,0.3)] rounded-3xl">
				{/* Header with animated gradient border */}
				<div className="relative">
					<div className="absolute inset-0 bg-gradient-to-r from-teal-500 via-amber-500 to-rose-500 animate-gradient-x" />
					<div className="relative bg-slate-900 m-[2px] pt-8 pb-6 px-6">
						<motion.div
							initial={{ y: -20, opacity: 0 }}
							animate={{ y: 0, opacity: 1 }}
							transition={{ duration: 0.5 }}
							className="flex flex-col items-center"
						>
							<div className="flex items-center gap-3 mb-2">
								<motion.div
									initial={{ rotate: 0 }}
									animate={{ rotate: 360 }}
									transition={{ duration: 20, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
								>
									<Hourglass className="w-8 h-8 text-amber-400" />
								</motion.div>
								<h1 className="text-3xl font-bold bg-gradient-to-r from-teal-400 via-amber-300 to-rose-400 text-transparent bg-clip-text">
									Conversor de Tiempo a Dinero
								</h1>
								<motion.div
									initial={{ rotate: 0 }}
									animate={{ rotate: -360 }}
									transition={{ duration: 20, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
								>
									<Coins className="w-8 h-8 text-teal-400" />
								</motion.div>
							</div>
							<p className="text-center text-slate-400">
								Ingrese los tiempos y obtenga su conversión desde{" "}
								<span className="text-amber-400 font-medium">{exchangeFromName}</span> a{" "}
								<span className="text-teal-400 font-medium">{exchangeToName}</span>
							</p>
						</motion.div>
					</div>
				</div>

				<CardContent className="space-y-6 pt-6 px-6 pb-6">
					<div className="space-y-2">
						<label
							htmlFor="time-input"
							className="text-sm font-medium text-slate-300 flex items-center gap-2"
						>
							<FileText className="w-5 h-5 text-amber-400" />
							Ingrese los tiempos (un tiempo por línea)
						</label>
						<div className="relative group">
							<div className="absolute -inset-0.5 bg-gradient-to-r from-teal-500 via-amber-500 to-rose-500 rounded-xl blur opacity-30 group-hover:opacity-70 transition duration-1000" />
							<Textarea
								id="time-input"
								placeholder="Build Server&#9;01:28:08&#10;Pack by Waypoint&#9;50:07:50"
								value={input}
								onChange={e => setInput(e.target.value)}
								onKeyDown={handleKeyDown}
								className="relative min-h-[160px] text-base font-mono bg-slate-800 border-0 text-slate-200 placeholder:text-slate-500 rounded-xl focus-visible:ring-2 focus-visible:ring-amber-500"
							/>
						</div>
						<p className="text-xs text-slate-500 italic flex items-center gap-1">
							<Timer className="w-3 h-3" />
							Formato: Nombre&#9;HH:MM:SS
						</p>
						<div className="flex items-center space-x-2">
							<label htmlFor="currency-from" className="text-slate-200">
								De:
							</label>
							<Select value={from} onValueChange={val => handleCurrencyChange("from", val)}>
								<SelectTrigger id="currency-from" className="w-56">
									<SelectValue placeholder="Selecciona moneda" />
								</SelectTrigger>
								<SelectContent>
									{CURRENCIES.map(cur => (
										<SelectItem key={cur.code} value={cur.code}>
											{cur.code} - {cur.name}
										</SelectItem>
									))}
								</SelectContent>
							</Select>
							<label htmlFor="currency-to" className="text-slate-200">
								a
							</label>
							<Select value={to} onValueChange={val => handleCurrencyChange("to", val)}>
								<SelectTrigger id="currency-to" className="w-56">
									<SelectValue placeholder="Selecciona moneda" />
								</SelectTrigger>
								<SelectContent>
									{CURRENCIES.map(cur => (
										<SelectItem key={cur.code} value={cur.code}>
											{cur.code} - {cur.name}
										</SelectItem>
									))}
								</SelectContent>
							</Select>
						</div>
						<div className="flex items-center gap-2 mb-2">
							<label
								htmlFor="exchange-rate"
								className="text-sm font-medium text-slate-300 flex items-center gap-2"
							>
								<DollarSign className="w-5 h-5 text-teal-400" /> Valor por hora:
							</label>
							<input
								id="exchange-rate"
								type="number"
								min={0}
								step={1}
								value={exchangeRate}
								onChange={val => handleExchangeRateChange(Number(val.target.value))}
								className="w-28 rounded-md border border-input bg-transparent px-2 py-1 text-sm text-slate-200 shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-amber-500"
							/>
						</div>
					</div>

					<motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} className="relative group">
						<div className="absolute -inset-0.5 bg-gradient-to-r from-teal-500 via-amber-500 to-rose-500 rounded-xl opacity-70 group-hover:opacity-100 transition duration-300" />
						<Button
							onClick={calculateMoney}
							className="relative w-full h-14 bg-slate-800 hover:bg-slate-700 text-white rounded-xl shadow-lg transition-all duration-300 text-lg border-0 group-hover:shadow-[0_0_20px_rgba(245,158,11,0.5)]"
							disabled={isCalculating}
						>
							{isCalculating ? (
								<motion.div
									className="flex items-center justify-center gap-2"
									initial={{ opacity: 0 }}
									animate={{ opacity: 1 }}
									exit={{ opacity: 0 }}
								>
									<Calculator className="w-6 h-6 animate-spin text-amber-400" />
									<span className="bg-gradient-to-r from-teal-400 via-amber-300 to-rose-400 text-transparent bg-clip-text font-bold">
										Calculando...
									</span>
								</motion.div>
							) : (
								<motion.div className="flex items-center justify-center gap-2">
									<Calculator className="w-6 h-6 text-amber-400" />
									<span className="bg-gradient-to-r from-teal-400 via-amber-300 to-rose-400 text-transparent bg-clip-text font-bold">
										Calcular
									</span>
								</motion.div>
							)}
						</Button>
					</motion.div>

					<AnimatePresence>
						{result && (
							<motion.div
								initial={{ opacity: 0, y: 20 }}
								animate={{ opacity: 1, y: 0 }}
								exit={{ opacity: 0, y: -20 }}
								transition={{ duration: 0.5 }}
								className="relative"
							>
								<div className="absolute inset-0 bg-gradient-to-r from-teal-500 via-amber-500 to-rose-500 rounded-xl opacity-30" />
								<div className="relative space-y-4 bg-slate-800/80 backdrop-blur-sm p-6 rounded-xl">
									<div className="flex items-center justify-between">
										<motion.h3
											className="text-xl font-bold bg-gradient-to-r from-teal-400 via-amber-300 to-rose-400 text-transparent bg-clip-text"
											initial={{ x: -10, opacity: 0 }}
											animate={{ x: 0, opacity: 1 }}
											transition={{ delay: 0.1 }}
										>
											Resultados Totales:
										</motion.h3>
										<motion.div
											initial={{ scale: 0, opacity: 0 }}
											animate={{ scale: 1, opacity: 1 }}
											transition={{ delay: 0.2, type: "spring" }}
										>
											<Sparkles className="w-6 h-6 text-amber-400" />
										</motion.div>
									</div>

									<motion.div
										className="grid gap-4"
										initial={{ opacity: 0 }}
										animate={{ opacity: 1 }}
										transition={{ delay: 0.2 }}
									>
										<ResultItem
											icon={<Clock className="w-5 h-5 text-teal-400" />}
											label="Horas totales:"
											value={result.hours.toFixed(2)}
											color="teal"
											delay={0.3}
										/>

										<ResultItem
											icon={<DollarSign className="w-5 h-5 text-amber-400" />}
											label={`Conversión actual desde ${exchangeFromName} a ${exchangeToName}:`}
											value={`$${exchangeAmount.toFixed(2)}`}
											color="amber"
											delay={0.4}
										/>

										<ResultItem
											icon={<DollarSign className="w-5 h-5 text-amber-400" />}
											label={`${exchangeFromName}:`}
											value={`$${result.from.toFixed(2)}`}
											color="amber"
											delay={0.5}
										/>

										<ResultItem
											icon={<Coins className="w-5 h-5 text-rose-400" />}
											label={`${exchangeToName}:`}
											value={`$${result.to.toLocaleString("es-CL")}`}
											highlight={true}
											color="rose"
											delay={0.6}
										/>
									</motion.div>
								</div>
							</motion.div>
						)}
					</AnimatePresence>
				</CardContent>
			</Card>
		</div>
	);
}

interface ResultItemProps {
	icon: React.ReactNode;
	label: string;
	value: string;
	highlight?: boolean;
	color: "teal" | "amber" | "rose";
	delay: number;
}

function ResultItem({ icon, label, value, highlight = false, color, delay }: ResultItemProps) {
	const getColorClasses = () => {
		switch (color) {
			case "teal":
				return "from-teal-500/10 to-teal-600/10 border-teal-500/20 hover:border-teal-500/40";
			case "amber":
				return "from-amber-500/10 to-amber-600/10 border-amber-500/20 hover:border-amber-500/40";
			case "rose":
				return "from-rose-500/10 to-rose-600/10 border-rose-500/20 hover:border-rose-500/40";
		}
	};

	const getTextColor = () => {
		switch (color) {
			case "teal":
				return "text-teal-400";
			case "amber":
				return "text-amber-400";
			case "rose":
				return "text-rose-400";
		}
	};

	return (
		<motion.div
			className={`flex items-center justify-between p-3 rounded-lg bg-gradient-to-r ${getColorClasses()} border transition-all duration-300 ${
				highlight ? "shadow-[0_0_15px_rgba(244,63,94,0.2)]" : ""
			}`}
			initial={{ x: -20, opacity: 0 }}
			animate={{ x: 0, opacity: 1 }}
			transition={{ delay }}
			whileHover={{ scale: 1.02 }}
		>
			<div className="flex items-center gap-3">
				{icon}
				<span className="font-medium text-slate-300">{label}</span>
			</div>
			<motion.span
				className={`font-bold text-lg ${getTextColor()}`}
				initial={{ scale: 0.9 }}
				animate={{ scale: 1 }}
				transition={{ delay: delay + 0.1, type: "spring" }}
			>
				{value}
			</motion.span>
		</motion.div>
	);
}
