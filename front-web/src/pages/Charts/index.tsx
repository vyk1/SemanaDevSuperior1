import React, { useEffect, useState } from 'react';
import './styles.css'
import Filters from '../../components/Filters';
import { barOptions, pieOptions } from './chart-options';
import Chart from 'react-apexcharts';
import Axios from 'axios';
import { BASE_URL } from '../../utils';
import { buildBarSeries, getGenderChartData, getPlatformChartData } from './helpers';

type PieChartData = {
    labels: string[],
    series: number[]
}

type BarChartData = {
    x: string,
    y: number
}

const initialPieData = {
    labels: [],
    series: []
}

const Charts = () => {

    const [barChartData, setBarChartData] = useState<BarChartData[]>([]);
    const [platformData, setPlatformData] = useState<PieChartData>(initialPieData);
    const [genreData, setGenre] = useState<PieChartData>(initialPieData);

    useEffect(() => {
        async function getData() {
            const recordsResponse = await Axios.get(`${BASE_URL}/records`)
            const gamesResponse = await Axios.get(`${BASE_URL}/games`)

            const barData = buildBarSeries(gamesResponse.data, recordsResponse.data.content)
            setBarChartData(barData)

            const platformChartData = getPlatformChartData(recordsResponse.data.content)
            setPlatformData(platformChartData)

            const genreChartData = getGenderChartData(recordsResponse.data.content)
            setGenre(genreChartData)
        }
        getData()
    }, []);
    return (
        <div className="page-container">
            <Filters link="/records" linkText="VER TABELA" />
            <div className="chart-container">
                <div className="top-related">
                    <h1 className="top-related-title">Jogos mais votados</h1>
                    <div className="games-container">
                        <Chart
                            options={barOptions}
                            type="bar"
                            width="900"
                            height="650"
                            series={[{ data: barChartData }]}
                        />
                    </div>
                </div>
                <div className="charts">
                    <div className="platform-chart">
                        <h2 className="chart-title">Plataformas</h2>
                        <Chart
                            options={{ ...pieOptions, labels: platformData?.labels }}
                            type="donut"
                            width="350"
                            series={platformData?.series}
                        />

                    </div>

                    <div className="gender-chart">
                        <h2 className="gender-title">Gêneros</h2>
                        <Chart
                            options={{ ...pieOptions, labels: genreData?.labels }}
                            type="donut"
                            width="350"
                            series={genreData?.series}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Charts;