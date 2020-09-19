import Axios from 'axios';
import React, { useEffect, useState } from 'react';
import { BASE_URL } from '../../utils';
import { RecordsResponse } from './types';
import { formatDate } from './helpers';
import './styles.css'
import Pagination from './Pagination';

import Filters from '../../components/Filters';

const Records = () => {
    const [recordsResponse, setRecordsResponse] = useState<RecordsResponse>()
    const [activePage, setActivePage] = useState(0)
    const [loaded, setLoaded] = useState(false);

    useEffect(() => {
        Axios.get(`${BASE_URL}/records?linesPerpage=12&page=${activePage}`)
            .then(res => setRecordsResponse(res.data))
            .catch(e => {
                console.log("Falhou.", e)
                alert("Ocorreu um erro ao carregar os dados")
            }).finally(() => {
                setLoaded(true)
            })

    }, [activePage]);

    if (!loaded) {
        return (
            <div className="filters-container records-actions">
                <h1 className="text-center">Aguarde . . .</h1>
            </div>
        )
    }

    return (
        <div className="page-container">
            <Filters link="/charts" linkText="VER GRÁFICO" />
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