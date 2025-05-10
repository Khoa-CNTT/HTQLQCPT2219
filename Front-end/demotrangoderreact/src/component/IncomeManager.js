import React, { useState, useEffect } from 'react';
import api from '../config/axiosConfig';
import styles from '../Css/IncomeManager.module.css';
import {
    BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer, Line, LineChart
} from 'recharts';

const IncomeManager = () => {
    const [income, setIncome] = useState(null);
    const [selectedOption, setSelectedOption] = useState('daily'); // hoặc '' nếu bạn muốn không chọn gì ban đầu
    const [loading, setLoading] = useState(false);
    const [fromDate, setFromDate] = useState('');
    const [toDate, setToDate] = useState('');
    const [hourlyIncome, setHourlyIncome] = useState({});
    const [weeklyDailyIncome, setWeeklyDailyIncome] = useState({});
    const [monthlyIncomeData, setMonthlyIncomeData] = useState({});
    const [yearlyMonthlyIncome, setYearlyMonthlyIncome] = useState({});
    const [isCustom, setIsCustom] = useState(false);
    const [customDailyIncome, setCustomDailyIncome] = useState({});

    const fetchIncome = async () => {
        setLoading(true);
        try {
            let response;
            switch (selectedOption) {
                case 'daily':
                    response = await api.get('/income/daily');
                    break;
                case 'weekly':
                    response = await api.get('/income/weekly');
                    break;
                case 'monthly':
                    response = await api.get('/income/monthly');
                    break;
                case 'yearly':
                    response = await api.get('/income/yearly');
                    break;
                default:
                    break;
            }

            if (selectedOption === 'daily') {
                setIncome(response.data.totalIncome || 0);
                setHourlyIncome(response.data.hourlyIncome || {});
            } else if (selectedOption === 'weekly') {
                setIncome(response?.data?.totalIncome ?? 0);
                setWeeklyDailyIncome(response?.data?.dailyIncome ?? {});
                setHourlyIncome({});
            } else if (selectedOption === 'monthly') {
                setIncome(response?.data?.totalIncome ?? 0);

                // Tạo dữ liệu thu nhập theo ngày trong tháng
                const monthlyData = response?.data?.dailyIncome ?? {};
                setMonthlyIncomeData(monthlyData);

                setHourlyIncome({});
                setWeeklyDailyIncome({});
            } else if (selectedOption === 'yearly') {
            setIncome(response?.data?.totalIncome ?? 0);
            setYearlyMonthlyIncome(response?.data?.monthlyIncome ?? {});
            setHourlyIncome({});
            setWeeklyDailyIncome({});
            setMonthlyIncomeData({});
        } else {
                setIncome(response?.data ?? null);
                setHourlyIncome({});
                setWeeklyDailyIncome({});
            }
        } catch (error) {
            console.error("Lỗi khi lấy dữ liệu:", error);
            setIncome(null);
            setHourlyIncome({});
        } finally {
            setLoading(false);
        }
    };
// else if (selectedOption === 'monthly') {
//         setIncome(response?.data.totalIncome ?? 0);
//         setMonthlyIncome(response?.data.dailyIncome ?? {});
//         setHourlyIncome({});
//         setWeeklyDailyIncome({});
//     } else {
//         setIncome(response?.data ?? null);
//         setHourlyIncome({});
//         setWeeklyDailyIncome({});
//     }
// } catch (error) {
//     console.error("Lỗi khi lấy dữ liệu:", error);
//     setIncome(null);
//     setHourlyIncome({});
// } finally {
//     setLoading(false);
// }
// };
    const yearlyChartData = Object.entries(yearlyMonthlyIncome).map(([month, value]) => ({
        month: `Tháng ${month}`,
        income: value
    }));

    const fetchCustomIncome = async () => {
        if (!fromDate || !toDate) {
            alert("Vui lòng chọn đầy đủ ngày bắt đầu và kết thúc.");
            return;
        }

        setLoading(true);

        try {
            const response = await api.get(`/income/custom`, {
                params: {
                    from: fromDate,
                    to: toDate
                }
            });

            console.log("✅ Dữ liệu trả về từ API:", response.data); // 👈 Thêm dòng này để xem rõ

            setIncome(response.data.totalIncome);
            setCustomDailyIncome(response.data.dailyIncome || {});
            setIsCustom(true);
            setSelectedOption(''); // Bỏ chọn radio


        } catch (error) {
            console.error("Lỗi khi lấy thu nhập theo khoảng:", error);
            setIncome(null);
        } finally {
            setLoading(false);
        }
    };
    const displayIncome = typeof income === 'number' && !isNaN(income)
        ? `Tổng thu nhập: ${income.toLocaleString('vi-VN')} VND`
        : 'Tổng thu nhập: Không có dữ liệu';


    const customChartData = Object.entries(customDailyIncome).map(([date, value]) => ({
        date,
        income: value
    }));

    const handleRadioChange = (e) => {
        setSelectedOption(e.target.value);
        setFromDate('');
        setToDate('');
        setIsCustom(false); // 👈 reset lại custom
    };



    const hourlyData = Object.keys(hourlyIncome).map((hour) => ({
        hour: hour,
        income: hourlyIncome[hour] || 0, // Đảm bảo không có giá trị `undefined`
    }));

    <YAxis
        tickFormatter={(v) => v.toLocaleString()}
        domain={[0, 'auto']}
        allowDecimals={false}
    />
    // Hàm tạo danh sách các ngày trong tháng
    const getDaysInMonth = (year, month) => {
        const date = new Date(year, month, 0); // Lấy ngày cuối cùng của tháng
        const daysInMonth = date.getDate(); // Số ngày trong tháng
        const days = [];
        for (let i = 1; i <= daysInMonth; i++) {
            days.push(`${year}-${month.toString().padStart(2, '0')}-${i.toString().padStart(2, '0')}`); // Định dạng ngày là "YYYY-MM-DD"
        }
        return days;
    };

    const generateFullDateRange = (start, end) => {
        const dateArray = [];
        const startDate = parseDate(start); // dùng hàm mới
        const endDate = parseDate(end);

        startDate.setHours(0, 0, 0, 0);
        endDate.setHours(0, 0, 0, 0);

        let currentDate = new Date(startDate);

        while (currentDate <= endDate) {
            dateArray.push(new Date(currentDate));
            currentDate.setDate(currentDate.getDate() + 1);
        }

        return dateArray;
    };
    const parseDate = (dateString) => {
        const [year, month, day] = dateString.split("-");
        return new Date(Number(year), Number(month) - 1, Number(day)); // month: 0-indexed
    };

    const formatDate = (dateObj) => {
        const year = dateObj.getFullYear();
        const month = String(dateObj.getMonth() + 1).padStart(2, '0'); // tháng: 0-indexed
        const day = String(dateObj.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`; // yyyy-mm-dd
    };



    const keys = Object.keys(customDailyIncome).sort(); // 'yyyy-mm-dd'
    const startDate = keys[0];
    const endDate = keys[keys.length - 1];


    useEffect(() => {
        if (isCustom) return; // Không gọi nếu đang ở custom
        fetchIncome();
    }, [selectedOption]);


    return (
        <div className={styles.containerin}>
            <h2 className={styles.subtitlein}>{displayIncome}
                {/*Tổng thu nhập: {typeof income === 'number'*/}
                {/*? income.toLocaleString('vi-VN') + ' VND'*/}
                {/*: 'Không có dữ liệu'}*/}
            </h2>


            <div className={styles.dateRangein}>
                <input
                    type="date"
                    value={fromDate}
                    onChange={(e) => setFromDate(e.target.value)}
                    className={styles.inputin}
                    checked={selectedOption === ''}
                />
                <input
                    type="date"
                    value={toDate}
                    onChange={(e) => setToDate(e.target.value)}
                    className={styles.inputin}
                    checked={selectedOption === ''}
                />
                <button onClick={fetchCustomIncome} className={styles.buttonin}>
                    Tính thu nhập
                </button>
            </div>

            <div className={styles.radioGroupin}>
                <label>
                    <input
                        type="radio"
                        name="incomeOption"
                        value="daily"
                        checked={selectedOption === 'daily'}
                        onChange={handleRadioChange}
                    />
                    Ngày hiện tại
                </label>
                <label>
                    <input
                        type="radio"
                        name="incomeOption"
                        value="weekly"
                        checked={selectedOption === 'weekly'}
                        onChange={handleRadioChange}
                    />
                    Tuần hiện tại
                </label>
                <label>
                    <input
                        type="radio"
                        name="incomeOption"
                        value="monthly"
                        checked={selectedOption === 'monthly'}
                        onChange={handleRadioChange}
                    />
                    Tháng hiện tại
                </label>
                <label>
                    <input
                        type="radio"
                        name="incomeOption"
                        value="yearly"
                        checked={selectedOption === 'yearly'}
                        onChange={handleRadioChange}
                    />
                    Năm hiện tại
                </label>
            </div>


            {/* Tổng thu nhập dòng cuối cùng to hơn */}
            <div className={styles.bigIncomeDisplay}>
                <h1>
                    {displayIncome}
                    {/*Tổng thu nhập: {income !== null ? income.toLocaleString() + ' VND' : 'Không có dữ liệu'}*/}
                </h1>
            </div>
            {selectedOption === 'daily'  && !isCustom  && Object.keys(hourlyIncome).length > 0 && (
                <div className={styles.chartContainer}>
                    <h3 className={styles.chartTitle}>Biểu đồ thu nhập theo giờ</h3>
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart
                            data={Object.keys(hourlyIncome).map((hour) => ({
                                hour: `${hour}h`, // hiển thị theo định dạng 0h, 1h,...
                                income: hourlyIncome[hour] || 0,
                            }))}
                            margin={{top: 20, right: 30, left: 20, bottom: 5}}
                        >
                            <CartesianGrid strokeDasharray="3 3"/>
                            <XAxis dataKey="hour"/>
                            <YAxis
                                tickFormatter={(v) => v.toLocaleString()}
                                domain={[0, 'auto']}
                                allowDecimals={false}
                            />
                            <Tooltip formatter={(value) => `${value.toLocaleString('vi-VN')} VND`}/>
                            <Bar dataKey="income" fill="#82ca9d"/>
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            )}


            {selectedOption === 'weekly' && !isCustom  && Object.keys(weeklyDailyIncome).length > 0 && (
                <div style={{width: '100%', height: 300}}>
                    <h3 style={{textAlign: 'center'}}>Biểu đồ thu nhập theo ngày</h3>
                    <ResponsiveContainer>
                        <BarChart
                            data={Object.entries(weeklyDailyIncome).map(([day, value]) => ({day, income: value}))}
                            margin={{top: 20, right: 30, left: 20, bottom: 5}}
                        >
                            <CartesianGrid strokeDasharray="3 3"/>
                            <XAxis dataKey="day"/>
                            <YAxis tickFormatter={(v) => v.toLocaleString()}/>
                            <Tooltip formatter={(value) => `${value.toLocaleString('vi-VN')} VND`}/>
                            <Bar dataKey="income" fill="#8884d8"/>
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            )}


            {selectedOption === 'monthly' && !isCustom && (
                <>
                    <div style={{width: '100%', height: 400, marginTop: 20}}>
                        <h3 style={{textAlign: 'center'}}>Biểu đồ thu nhập theo ngày</h3>
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart
                                data={Object.keys(monthlyIncomeData).map(dateStr => ({
                                    date: `Ngày ${new Date(dateStr).getDate().toString().padStart(2, '0')}`,
                                    income: monthlyIncomeData[dateStr] || 0,
                                }))}
                                margin={{top: 20, right: 30, left: 20, bottom: 60}}
                                barCategoryGap={1}
                            >
                                <CartesianGrid strokeDasharray="3 3"/>
                                <XAxis
                                    dataKey="date"
                                    angle={-45}
                                    textAnchor="end"
                                    tick={{fontSize: 10}}
                                    interval={0}
                                />
                                <YAxis
                                    tickFormatter={(v) => v.toLocaleString()}
                                    domain={[0, 'auto']}
                                />
                                <Tooltip formatter={(value) => `${value.toLocaleString('vi-VN')} VND`}/>
                                <Bar dataKey="income" fill="#82ca9d"/>
                            </BarChart>
                        </ResponsiveContainer>


                    </div>


                </>
            )}
            {selectedOption === 'yearly' && !isCustom && yearlyChartData.length > 0 && (
                <div style={{width: '100%', height: 400}}>
                    <h3 style={{textAlign: 'center', marginBottom: '1rem'}}>Biểu đồ thu nhập theo tháng</h3>
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={yearlyChartData}>
                            <CartesianGrid strokeDasharray="3 3"/>
                            <XAxis dataKey="month"/>
                            <YAxis/>
                            <Tooltip
                                formatter={(value) =>
                                    `${value.toLocaleString('vi-VN')} VND`
                                }
                            />
                            <Bar dataKey="income" fill="#82ca9d"/>
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            )}

            {isCustom && fromDate && toDate && (
                <div style={{ marginTop: '2rem' }}>
                    <h3 style={{ textAlign: 'center' }}>Biểu đồ thu nhập theo ngày (Tùy chọn)</h3>
                    <ResponsiveContainer width="100%" height={400}>
                        <BarChart
                            data={generateFullDateRange(fromDate, toDate).map(dateObj => {
                                const key = formatDate(dateObj); // dùng formatDate thay vì toISOString
                                return {
                                    date: key, // hoặc format lại nếu bạn muốn đẹp
                                    income: customDailyIncome[key] || 0,
                                };
                            })}

                            margin={{ top: 20, right: 30, left: 20, bottom: 60 }}
                            barCategoryGap={1}
                        >
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis
                                dataKey="date"
                                angle={-45}
                                textAnchor="end"
                                tick={{ fontSize: 10 }}
                                interval={0}
                            />
                            <YAxis
                                tickFormatter={(v) => v.toLocaleString()}
                                domain={[0, 'auto']}
                            />
                            <Tooltip formatter={(value) => `${value.toLocaleString('vi-VN')} VND`} />
                            <Bar dataKey="income" fill="#8884d8" />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            )}




        </div>
    );
};

export default IncomeManager;
