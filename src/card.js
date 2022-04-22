import React from 'react';
import './card.css';

const Card = (props) => {
  return (
    <div className="card">
      <h3>{props?.data?.title}</h3>
      <p><span className="label">Description: </span>{props?.data?.description}</p>
      <p><span className="label">Start Date: </span>{props?.data?.event_start_date}</p>
      <p><span className="label">End Date: </span>{props?.data?.event_end_date}</p>
      <p><span className="label">Websource: </span>{props?.data?.web_source}</p>
      <p><span className="label">Weburl: </span>
        <a href={props?.data?.web_url} target="_blank">{props?.data?.web_url}</a>
      </p>
    </div>
  )
}

export default Card;