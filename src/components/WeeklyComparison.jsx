import { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import './WeeklyComparison.css'

// Chart configurations with colors matching pie charts
const chartConfig = {
    mood: {
        title: "Weekly trend for Average Team Mood",
        yAxisDomain: [1, 4],
        yAxisTicks: [1, 2, 3, 4],
        tickFormatter: {
            1: "Angry",
            2: "Anxious",
            3: "Calm",
            4: "Empowered",
        },
        lineColor: "#d69f7e",      // Second darkest peach
        currentWeekColor: "#b07d62" // Darkest peach
    },
    workload: {
        title: "Weekly trend for Average Team Workload",
        yAxisDomain: [1, 4],
        yAxisTicks: [1, 2, 3, 4],
        tickFormatter: {
            1: "Overwhelmed",
            2: "Pressured",
            3: "Manageable",
            4: "Light",
        },
        lineColor: "#8fb996",      // Second darkest blue
        currentWeekColor: "#709775" // Darkest blue
    }
};

const WeeklyComparison = ({ isAnimationActive = true, logs = [], chartType = "mood", isLoading = false }) => {
    const [chartData, setChartData] = useState(null);
    const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
    const config = chartConfig[chartType];
    const labels = config.tickFormatter;
    
    const getTooltipText = (value) => {
        return labels[value];
    };

    const CustomYAxisTick = ({ x, y, payload }) => {
        const value = payload.value;
        const label = labels[value];
        
        let color = '#333';
        if (value === 3 || value === 4) {
            color = '#8fb996'; // Desaturated green
        } else if (value === 1 || value === 2) {
            color = '#b07d62'; // Desaturated red
        }
        
        return (
            <g transform={`translate(${x},${y})`}>
                <text 
                    x={0} 
                    y={0} 
                    dy={4}
                    textAnchor="end" 
                    fontSize={isMobile ? 13 : 15}
                    fill={color}
                    style={{ fontWeight: '500' }}
                >
                    {label}
                </text>
            </g>
        );
    };
    
    useEffect(() => {
        const handleResize = () => {
            setIsMobile(window.innerWidth <= 768);
        };
        
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);
    
    useEffect(() => {
        if (!logs || logs.length === 0) {
            // Don't show any data if no logs
            setChartData(null);
            return;
        }

        // Calculate weekly averages from logs for 4 week period
        const valueKey = chartType === "mood" ? "mood_value" : "workload_value";
        
        // Group logs by week_index
        const weeklyData = {};
        let maxWeek = 0;
        
        logs.forEach(log => {
            const weekIndex = log.week_index;
            const timestamp = log.timestamp_local;
            maxWeek = Math.max(maxWeek, parseInt(weekIndex));
            
            if (!weeklyData[weekIndex]) {
                weeklyData[weekIndex] = {
                    values: [],
                    timestamp: timestamp
                };
            }
            weeklyData[weekIndex].values.push(log[valueKey]);
        });

        // Create array of last 4 weeks (including weeks with no data)
        const last4WeekIndices = [];
        for (let i = 3; i >= 0; i--) {
            last4WeekIndices.push(maxWeek - i);
        }

        // Create data for all 4 weeks, with 0 for weeks that have no logs
        const processedData = last4WeekIndices.map((weekIndex) => {
            const weekLabel = `W${weekIndex}`;
            if (weeklyData[weekIndex]) {
                return {
                    week: weekLabel,
                    currentPeriod: parseFloat((weeklyData[weekIndex].values.reduce((a, b) => a + b, 0) / weeklyData[weekIndex].values.length).toFixed(2))
                };
            } else {
                return {
                    week: weekLabel,
                    currentPeriod: 0
                };
            }
        });

        setChartData(processedData.length > 0 ? processedData : null);
    }, [logs, chartType]);

    if (!chartData) {
        if (isLoading) {
            // Don't show anything while loading
            return (
        <div className={`weeklyComparisonContainer weeklyComparisonContainer--${chartType}`}>
            <div className='weekly-header'>
                <h2 className='headline'>
                    {chartType === "mood" ? "Mood Weekly Trend" : "Workload Trend"}
                </h2>
            </div>
                </div>
            );
        }
        
        // Only show error message if we have logs but no data (after loading)
        if (logs && logs.length > 0) {
            return (
                <div className={`weeklyComparisonContainer weeklyComparisonContainer--${chartType}`}>
                    <p style={{ textAlign: 'center', padding: '20px', color: '#999' }}>No data available. Waiting for team check-ins...</p>
                </div>
            );
        }
        
        // Show empty state if still loading or no logs yet
        return (
            <div className={`weeklyComparisonContainer weeklyComparisonContainer--${chartType}`}>
                <div className='weekly-header'>
                    <h2 className='headline'>
                        {chartType === "mood" ? "Mood Weekly Trend" : "Workload Trend"}
                    </h2>
                </div>
            </div>
        );
    }

    const titleText = chartType === "mood" 
        ? "Mood Pattern - four week comparison"
        : "Workload Pattern - four week comparison";
    
    return (
        <div className={`weeklyComparisonContainer weeklyComparisonContainer--${chartType}`}>
            <div className='weekly-header'>
                <h2 className='headline'>
                    {titleText}
                </h2>
            </div>

            <div className='weekly-chart-wrapper'>
            <LineChart
                style={{
                    width: isMobile ? '100%' : '75%',
                    maxWidth: '6000px',
                    maxHeight: '50vh',
                    aspectRatio: 1.2,
                }}
                margin={{ top: 6, right: 12, left: isMobile ? 14 : 24, bottom: 0 }}
                data={chartData}
            >
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.08)" vertical={false} />

                <XAxis
                    dataKey="week"
                    axisLine={false}
                    tickLine={false}
                    tick={{ fontSize: isMobile ? 14 : 16, fontFamily: 'var(--font-body)' }}
                    tickMargin={4}
                />

                <YAxis
                    width={isMobile ? 45 : 80}
                    domain={[1, 4]}
                    ticks={[1, 2, 3, 4]}
                    tickLine={false}
                    axisLine={false}
                    tick={<CustomYAxisTick />}
                    padding={{ bottom: 35 }}
                />

                <Tooltip 
                    content={({ active, payload }) => {
                        if (active && payload && payload[0]) {
                            const value = payload[0].value;
                            return (
                                <div style={{ 
                                    backgroundColor: '#fff', 
                                    padding: '8px 12px', 
                                    borderRadius: '12px', 
                                    border: 'none',
                                    boxShadow: '0 10px 30px rgba(0,0,0,0.12)',
                                    fontSize: '12px',
                                    fontFamily: 'var(--font-body)'
                                }}>
                                    <p style={{ margin: '0 0 4px 0', fontWeight: '600' }}>{payload[0].payload.week}</p>
                                    <p style={{ margin: '0', color: '#666' }}>Average: {payload[0].value}</p>
                                </div>
                            );
                        }
                        return null;
                    }}
                />

                <Line
                    type="monotone"
                    name="Average"
                    dataKey="currentPeriod"
                    stroke={config.lineColor}
                    strokeWidth={5}
                    dot={(props) => {
                        const { cx, cy, payload, index } = props;
                        const isCurrentWeek = index === 3;
                        const color = isCurrentWeek ? config.currentWeekColor : config.lineColor;
                        return (
                            <circle 
                                cx={cx} 
                                cy={cy} 
                                r={isCurrentWeek ? 7 : 5} 
                                fill={color}
                                stroke="#fff"
                                strokeWidth={2}
                            />
                        );
                    }}
                    isAnimationActive={isAnimationActive}
                />
            </LineChart>
            </div>
        </div>
    );
}

export default WeeklyComparison;
