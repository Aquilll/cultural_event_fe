import './App.css';
import Card from './card';
import {
  DatesRangeInput
} from 'semantic-ui-calendar-react';
import { useEffect, useState, useRef } from 'react';
import {getEvents, createGorkiEvent, createCoBerlinEvent, searchEvent} from './service-file';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import LoaderIcon from '../src/img/loader.gif'

function App() {
  const [datesRange, setDatesRange] = useState('');
  const [eventsList, setEventsList] = useState([]);
  const [eventsCount, setEventsCount] = useState(0);
  const [websource, setWebsource] = useState('');
  const [inputText, setInputText] = useState('');
  const [loader, setLoader] = useState(false);
  const [checked, setChecked] = useState({ gorki: false, co_berlin: false });
  const start_date = useRef();
  const end_date = useRef();
  
  useEffect(() => {
    getAllEventList();
  },[])

  /** Method to get all the events */
  const getAllEventList = () => {
    getEvents().then(res => res.clone().json()).
    then(json => {
      setEventsList(json);
      setEventsCount(json?.length);
    }).catch(error => console.log(error));
  }
 
  /** Method to convert daterange to date array */
  const formatDate = () => {
    const dateArr = datesRange.split(' - ');
    start_date.current = dateArr[0];
    end_date.current = dateArr[1];
  }

  /** Method to handle onChange event of calendar dates*/
  const handleChange = (event, {name, value}) => {
    setDatesRange( value );
    setTimeout(()=>{debugger},500)
  }

  /** Method to handle input text change */
  const handleInputOnChange = (ev) => {
    setInputText(ev.target.value);
  }

   /** Method to handle radio change */
  const handleChangeRadio = (e) => {
    setChecked(() => {
      return {
        gorki: false,
        co_berlin: false,
        [e.target.value]: true
      };
    });
    e.target.value === 'co_berlin'? setWebsource('0') : setWebsource('1');
  };

  /**Method to call search events api */
  const searchFilterEvent = (startDate, endDate, text, websource) => {
    searchEvent(startDate, endDate, text, websource).then(res => res.clone().json())
    .then(json => {
      setEventsList(json);
      setEventsCount(json?.length);
    })
    .catch((error) => console.log(error))
  }
  
  /**Method to submit search data */
  const handleFilterSubmit = () => {
    formatDate();
    searchFilterEvent(start_date.current, end_date.current, inputText, websource);
  }

  /**Method to clear search filter */
  const clearFilterSubmit = () => {
    setDatesRange('');
    setInputText('');
    setWebsource('');
    setChecked({ co_berlin: false, gorki: false })
  }

  /**Method to create gorki events */
  const handleCreateGorkiEvent = () => {
    setLoader(true);
    createGorkiEvent().then(res => res.clone().json())
      .then(json => {
        if(json.status === "success") {
          setLoader(false);
          notify(json.data);
          getAllEventList();
        }
      }).catch(error => {
        setLoader(false);
        notify("Oops! Something went wrong");
        setEventsList([]);
      });
  }

  /**Method to create co-berlin events */
  const handleCreateCoBerlinEvent = () => {
    setLoader(true);
    createCoBerlinEvent().then(res => res.clone().json())
    .then(json => {
      if(json.status === "success") {
        setLoader(false);
        notify(json.data);
        getAllEventList();
      }
    }).catch(error => console.log(error));
  }

  
  /**Method to render toaster */
  const notify = (msg) => {
    toast(msg,{
      position: "top-right",
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined});
    }

    /**Method to render search box */
    const renderSearch = () => {
      return (
        <div className="search-container">
          <DatesRangeInput
              name="datesRange"
              placeholder="From - To"
              value={datesRange}
              onChange={handleChange}
              dateFormat={'DD/MM/YYYY'}
              autoComplete="off"
            />
          <input type="text" id="search-bar" placeholder="Enter text" value={inputText}
          onChange={(ev) => {handleInputOnChange(ev)}} autoComplete="off"/>
          {renderRadioButton()}
          <div>
            <button className="submit-btn" onClick={handleFilterSubmit}>Submit</button>
            <button className="submit-btn" onClick={clearFilterSubmit}>Clear</button>
          </div>
        </div>
      )
    }

    /**Method to render radio buttons for web source */
    const renderRadioButton = () => {
      return (
        <div className="dropdown">
          <input type="radio" 
          id="co_berlin"  
          name="event_type" 
          value="co_berlin"
          checked={checked.co_berlin}
          onChange={handleChangeRadio} />
          <label>co_berlin </label>
          <input 
          type="radio" 
          id="gorki" 
          name="event_type"  
          value="gorki"
          checked={checked.gorki}
          onChange={handleChangeRadio}/>
          <label>gorki</label>
        </div>
      )
    }
  
    /**Method to render buttons to create gorki and co_berlin event */
    const renderCreateEventButton = () => {
      return (
        <div className="create-event">
          <button className="submit-btn" onClick={()=>handleCreateGorkiEvent()}>Create Gorki Event</button>
          <button className="submit-btn" onClick={() =>handleCreateCoBerlinEvent()}>Create Co_Berlin Event</button>
        </div>
      )
    }

     /**Method to render loader */
    const EventLoader = () => {
      return (
        <div className="loader-wrapper">
            <div className="loader-backdrop"></div>
            <img className="loader" src={LoaderIcon} alt="Loading" />
            <p className="loader-text">Fetching Data...</p>
        </div>
      )
    }

  return (
    <div className="events-app">
      <div className="app-header">EVENTS APP</div>
      {!loader
      ?(
        <>
        {renderSearch()}
        <div className="total-count"><span>Total Count: </span><span>{eventsCount}</span></div>
        {renderCreateEventButton()}
        {eventsList.map((data) => {
        return <Card key={data.id} data={data}></Card>
        })}
        </>
      )
      :<EventLoader/>}
      <ToastContainer
      />
    </div>
  );
}

export default App;