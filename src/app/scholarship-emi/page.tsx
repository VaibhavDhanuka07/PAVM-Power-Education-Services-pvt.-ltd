"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Calculator, IndianRupee, Percent, WalletCards } from "lucide-react";

function calcEmi(principal: number, annualRate: number, months: number) {
  const monthlyRate = annualRate / 12 / 100;
  if (monthlyRate <= 0) return principal / months;
  const emi = (principal * monthlyRate * Math.pow(1 + monthlyRate, months)) / (Math.pow(1 + monthlyRate, months) - 1);
  return emi;
}

export default function ScholarshipEmiPage() {
  const [familyIncome, setFamilyIncome] = useState(450000);
  const [percentage, setPercentage] = useState(72);
  const [category, setCategory] = useState("General");

  const [courseFee, setCourseFee] = useState(120000);
  const [downPayment, setDownPayment] = useState(20000);
  const [rate, setRate] = useState(12);
  const [months, setMonths] = useState(12);

  const scholarship = useMemo(() => {
    let discount = 0;
    if (familyIncome <= 300000) discount += 20;
    else if (familyIncome <= 600000) discount += 10;
    if (percentage >= 85) discount += 15;
    else if (percentage >= 70) discount += 8;
    if (category !== "General") discount += 5;
    discount = Math.min(35, discount);
    return {
      discount,
      amount: Math.round((courseFee * discount) / 100),
      finalFee: Math.max(0, courseFee - Math.round((courseFee * discount) / 100)),
    };
  }, [familyIncome, percentage, category, courseFee]);

  const loanAmount = Math.max(0, scholarship.finalFee - downPayment);
  const emi = useMemo(() => calcEmi(loanAmount, rate, months), [loanAmount, rate, months]);
  const totalPayable = Math.round(emi * months);

  return (
    <section className="mx-auto max-w-7xl space-y-6 px-4 py-12 lg:px-8">
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <h1 className="text-3xl font-extrabold tracking-tight">Scholarship + EMI Engine</h1>
        <p className="mt-2 text-slate-600">Check scholarship eligibility and calculate monthly EMI with a direct counselling CTA.</p>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <article className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <p className="inline-flex items-center gap-2 rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700">
            <Percent className="h-3.5 w-3.5" />
            Scholarship Checker
          </p>
          <div className="mt-4 grid gap-4">
            <label className="text-sm font-semibold text-slate-700">Family Income (Annual)</label>
            <input type="number" value={familyIncome} onChange={(e) => setFamilyIncome(Number(e.target.value))} className="h-11 rounded-xl border border-slate-300 px-3" />
            <label className="text-sm font-semibold text-slate-700">Academic Percentage</label>
            <input type="number" value={percentage} onChange={(e) => setPercentage(Number(e.target.value))} className="h-11 rounded-xl border border-slate-300 px-3" />
            <label className="text-sm font-semibold text-slate-700">Category</label>
            <select value={category} onChange={(e) => setCategory(e.target.value)} className="h-11 rounded-xl border border-slate-300 px-3">
              <option>General</option>
              <option>OBC</option>
              <option>SC</option>
              <option>ST</option>
              <option>EWS</option>
            </select>
          </div>

          <div className="mt-5 rounded-xl border border-blue-100 bg-blue-50 p-4">
            <p className="text-sm text-slate-700">Estimated Scholarship</p>
            <p className="text-2xl font-extrabold text-blue-700">{scholarship.discount}%</p>
            <p className="text-sm text-slate-700">Discount: Rs {scholarship.amount.toLocaleString("en-IN")}</p>
            <p className="text-sm font-semibold text-slate-900">Fee after scholarship: Rs {scholarship.finalFee.toLocaleString("en-IN")}</p>
          </div>
        </article>

        <article className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <p className="inline-flex items-center gap-2 rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700">
            <Calculator className="h-3.5 w-3.5" />
            EMI Calculator
          </p>
          <div className="mt-4 grid gap-4">
            <label className="text-sm font-semibold text-slate-700">Course Fee</label>
            <input type="number" value={courseFee} onChange={(e) => setCourseFee(Number(e.target.value))} className="h-11 rounded-xl border border-slate-300 px-3" />
            <label className="text-sm font-semibold text-slate-700">Down Payment</label>
            <input type="number" value={downPayment} onChange={(e) => setDownPayment(Number(e.target.value))} className="h-11 rounded-xl border border-slate-300 px-3" />
            <label className="text-sm font-semibold text-slate-700">Interest Rate (Annual %)</label>
            <input type="number" value={rate} onChange={(e) => setRate(Number(e.target.value))} className="h-11 rounded-xl border border-slate-300 px-3" />
            <label className="text-sm font-semibold text-slate-700">Tenure (Months)</label>
            <select value={months} onChange={(e) => setMonths(Number(e.target.value))} className="h-11 rounded-xl border border-slate-300 px-3">
              {[6, 9, 12, 18, 24, 30, 36].map((m) => <option key={m} value={m}>{m} months</option>)}
            </select>
          </div>

          <div className="mt-5 rounded-xl border border-emerald-100 bg-emerald-50 p-4">
            <p className="inline-flex items-center gap-2 text-sm text-slate-700"><WalletCards className="h-4 w-4 text-emerald-600" />Loan amount: Rs {loanAmount.toLocaleString("en-IN")}</p>
            <p className="mt-1 inline-flex items-center gap-2 text-2xl font-extrabold text-emerald-700"><IndianRupee className="h-5 w-5" />{Math.round(emi).toLocaleString("en-IN")} / month</p>
            <p className="text-sm text-slate-700">Total payable: Rs {totalPayable.toLocaleString("en-IN")}</p>
          </div>

          <Link href="/consultation" className="mt-5 inline-flex h-11 w-full items-center justify-center rounded-xl bg-blue-600 font-semibold text-white transition hover:bg-blue-700">
            Apply for Counselling
          </Link>
        </article>
      </div>
    </section>
  );
}

