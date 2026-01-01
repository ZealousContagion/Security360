"use client"

import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip } from "recharts"

const data = [
    {
        name: "Jan",
        total: 150000,
    },
    {
        name: "Feb",
        total: 230000,
    },
    {
        name: "Mar",
        total: 180000,
    },
    {
        name: "Apr",
        total: 320000,
    },
    {
        name: "May",
        total: 290000,
    },
    {
        name: "Jun",
        total: 450000,
    },
    {
        name: "Jul",
        total: 420000,
    },
]

export function RevenueChart() {
    return (
        <ResponsiveContainer width="100%" height={350}>
            <BarChart data={data}>
                <XAxis
                    dataKey="name"
                    stroke="#888888"
                    fontSize={12}
                    tickLine={false}
                    axisLine={false}
                />
                <YAxis
                    stroke="#888888"
                    fontSize={12}
                    tickLine={false}
                    axisLine={false}
                    tickFormatter={(value) => `KES ${value}`}
                />
                <Tooltip
                    formatter={(value) => [`KES ${value}`, "Revenue"]}
                    contentStyle={{ backgroundColor: 'var(--background)', borderColor: 'var(--border)', borderRadius: '8px' }}
                />
                <Bar
                    dataKey="total"
                    fill="currentColor"
                    radius={[4, 4, 0, 0]}
                    className="fill-primary"
                />
            </BarChart>
        </ResponsiveContainer>
    )
}
