import React, { useCallback, useEffect, useState } from 'react';
import { buscarPrevisaoCuritiba } from '../services/weatherService';

function Planejamento() {
  const [clima, setClima] = useState(null);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState('');

  const carregarClima = useCallback(async () => {
    try {
      setCarregando(true);
      setErro('');
      setClima(await buscarPrevisaoCuritiba());
    } catch (erroAtual) {
      setErro(`Nao foi possivel consultar a previsao: ${erroAtual.message}`);
    } finally {
      setCarregando(false);
    }
  }, []);

  useEffect(() => {
    carregarClima();
  }, [carregarClima]);

  return (
    <div>
      <div className="pagina-titulo">
        <div>
          <h1>Planejamento</h1>
          <p className="texto-apoio">
            Previsao de Curitiba para ajudar a organizar estudos em casa ou no campus.
          </p>
        </div>
        <span className="selo-seguranca">API externa 2: Open-Meteo</span>
      </div>

      {carregando && (
        <div className="estado-centralizado" role="status">
          <div className="spinner" aria-hidden="true"></div>
          <p>Consultando previsao externa...</p>
        </div>
      )}

      {erro && (
        <div className="card">
          <p className="erro-geral">{erro}</p>
          <button type="button" onClick={carregarClima}>Tentar novamente</button>
        </div>
      )}

      {!carregando && !erro && clima && (
        <>
          <section className="card clima-atual">
            <div>
              <span className="clima-local">{clima.local}</span>
              <h2>{clima.atual.descricao}</h2>
              <p className="texto-apoio">
                Sensacao de {clima.atual.sensacao} C e vento de {clima.atual.vento} km/h.
              </p>
            </div>
            <strong className="clima-temperatura">{clima.atual.temperatura} C</strong>
          </section>

          <section aria-labelledby="titulo-previsao">
            <div className="secao-cabecalho">
              <h2 id="titulo-previsao" className="secao-titulo">Proximos dias</h2>
              <span className="tag-materia">Fonte: {clima.origem}</span>
            </div>

            <div className="grade-previsao">
              {clima.previsao.map((dia) => (
                <article className="card previsao-item" key={dia.data}>
                  <strong>{dia.dia}</strong>
                  <span>{dia.descricao}</span>
                  <div className="previsao-temperaturas">
                    <span>Max. {dia.maxima} C</span>
                    <span>Min. {dia.minima} C</span>
                  </div>
                  <small>Chance de chuva: {dia.chuva}%</small>
                </article>
              ))}
            </div>
          </section>

          <section className="card dica-planejamento">
            <h2>Sugestao para os estudos</h2>
            <p>
              {clima.previsao[0].chuva >= 50
                ? 'Ha chance relevante de chuva. Considere separar uma sessao de estudo em casa.'
                : 'A chance de chuva esta baixa. Um intervalo ao ar livre pode ajudar na concentracao.'}
            </p>
          </section>
        </>
      )}
    </div>
  );
}

export default Planejamento;
