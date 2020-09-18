import Axios from 'axios';
import React, { useEffect, useState } from 'react';
import { BASE_URL } from '../../utils';
import { RecordsResponse } from './types';
import { formatDate } from './helpers';
import './styles.css'
import Pagination from './Pagination';
import { Link } from 'react-router-dom';

const Records = () => {
    const [recordsResponse, setRecordsResponse] = useState<RecordsResponse>()
    const [activePage, setActivePage] = useState(0)

    useEffect(() => {
        Axios.get(`${BASE_URL}/records?linesPerpage=12&page=${activePage}`)
            .then(res => setRecordsResponse(res.data))
    }, [activePage]);
    return (
        <div className="page-container">
            <div className="filters-container records-actions">
                <Link to="/charts">
                    <button className="action-filters">VER GRÁFICOS</button>
                </Link>
            </div>
            <table className="records-table" cellPadding="0" cellSpacing="0">
                <thead>
                    <tr>
                        <th>INSTANTE</th>
                        <th>NOME</th>
                        <th>IDADE</th>
                        <th>PLATAFORMA</th>
                        <th>GÊNERO</th>
                        <th>TÍTULO DO GAME</th>
                    </tr>
                </thead>
                <tbody>
                    {/* Optional Chainning */}
                    {
                        recordsResponse?.content.map(r => (
                            <tr key={r.id}>
                                <td>{formatDate(r.moment)}</td>
                                <td>{r.name}</td>
                                <td>{r.age}</td>
                                <td className="text-secondary">{r.gamePlatform}</td>
                                <td>{r.genreName}</td>
                                <td className="text-primary">{r.gameTitle}</td>
                            </tr>
                        ))
                    }
                </tbody>
            </table>
            <Pagination
                activePage={activePage}
                goToPage={(index: number) => setActivePage(index)}
                totalPages={recordsResponse?.totalPages}
            />
        </div>
    );
}

export default Records;