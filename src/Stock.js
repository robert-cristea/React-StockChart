import React, { useState, useEffect } from 'react'
import Plot from 'react-plotly.js';

export default function Stock() {
    const nTime = new Date();
    
    const getLastYear = () => {
        
        // yyyy-mm-dd format
        return  (nTime.getFullYear() - 1)
                + '-' 
                + ( nTime.getMonth() < 9 
                    ? '0' + ( nTime.getMonth() + 1 ) 
                    : nTime.getMonth() + 1 ) 
                + '-' 
                + ( nTime.getDate() < 10 
                    ? '0'+nTime.getDate() 
                    : nTime.getDate() ) ;
    }

    const getToday = () => {

        // yyyy-mm-dd format
        return  nTime.getFullYear()
                + '-' 
                + ( nTime.getMonth() < 9 
                    ? '0' + ( nTime.getMonth() + 1 ) 
                    : nTime.getMonth() + 1 ) 
                + '-' 
                + ( nTime.getDate() < 10 
                    ? '0'+nTime.getDate() 
                    : nTime.getDate() ) ;
    }


    const stockNames = ["IBM", "MSFT", "GOOGL", "AAPL"];
    const [value_A, setValue_A] = useState('default');
    const [value_B, setValue_B] = useState('default');
    const [value_C, setValue_C] = useState('default');
    const [stockChartXValues_A, setStockChartXValues_A] = useState([]);
    const [stockChartYValues_A, setStockChartYValues_A] = useState([]);
    const [stockChartXValues_B, setStockChartXValues_B] = useState([]);
    const [stockChartYValues_B, setStockChartYValues_B] = useState([]);
    const [stockChartXValues_C, setStockChartXValues_C] = useState([]);
    const [stockChartYValues_C, setStockChartYValues_C] = useState([]);
    const [error, setError] = useState('');
    const [info, setInfo] = useState('');
    const [button_label, setButtonLabel] = useState('Compare');
    const [button_one_label, setButtonOneLabel] = useState('Display One');
    const [button_interval_label, setButtonIntervalLabel] = useState('Weekly');
    const [button_disable, setButtonDisable] = useState(true);
    const [button_one_disable, setButtonOneDisable] = useState(true);
    const [startDate, setStartDate] = useState(getLastYear());
    const [endDate, setEndDate] = useState(getToday());
    const [interval, setInterval] = useState('Monthly');
    const [cond, setCond] = useState(0);

    let xValues = [];
    let yValues = [];

    const handleChange_A = (event) => {
        setValue_A(event.target.value);
        setButtonDisable(false);
        setButtonOneDisable(false);
    }
    
    const handleChange_B = (event) => {
        setValue_B(event.target.value);
        setButtonDisable(false);
        setButtonOneDisable(false);

    }
    
    const handleChange_C = (event) => {
        setValue_C(event.target.value);
        setButtonDisable(false);
        setButtonOneDisable(false);
    }
    
    const handleStartDate = (event) => {
        setStartDate(event.target.value);
        setButtonDisable(false);
        setButtonOneDisable(false);
    }
    
    const handleEndDate = (event) => {
        setEndDate(event.target.value);   
        setButtonDisable(false);
        setButtonOneDisable(false);
    }

    const clearState = () => {
        setValue_A("default");
        setValue_B("default");
        setValue_C("default");
        setStockChartXValues_A([]);
        setStockChartYValues_A([]);
        setStockChartXValues_B([]);
        setStockChartYValues_B([]);
        setStockChartXValues_C([]);
        setStockChartYValues_C([]);
        setError('');
        setInfo('');
        setButtonLabel("Compare");
        setButtonOneLabel("Display One");
        setEndDate(getToday());
        setStartDate(getLastYear());
        setButtonDisable(true);
        setButtonOneDisable(true);
    }

    const changeInterval = () => {
        let updateInterval = interval === "Monthly" ? "Weekly" : "Monthly";
        setButtonIntervalLabel(interval);
        setInterval(updateInterval)
    }

    useEffect(() => {
        if(cond === 1){
            handleOneDisplay();
        } else if(cond === 2){
            handleSubmit();
        }

        return () => {
            
        };
    }, [interval]);

    const handleSubmit = () => {
        //changes the new stock symbol, prevents page from refreshing to default
        if ((value_A !== "default" && value_B !== "default" && value_C !== "default" && value_A !== value_B && value_B !== value_C && value_A !== value_C)) 
        {
            setCond(2);
            setButtonLabel('Waiting ... ');
            setButtonOneLabel("Display One");
            fetchCompareStock(interval);
            setError("");
        } else if ((value_A !== 'default' && value_A === value_B) || (value_B !== 'default' && value_B === value_C) || (value_C !== 'default' && value_C === value_A)) {
            setError("Please select a differant Stock!");
        } else {
            setError("Please select Stock correctly!");
        }
    }

    const handleOneDisplay = () => {
        if((value_A !== "default" && value_B === "default" && value_C === "default") || (value_B !== "default" && value_C ==="default" && value_A === "default") || (value_C !== "default" && value_A ==="default" && value_B === "default")){
            setCond(1);
            setButtonOneLabel("...Waiting")
            setButtonLabel("Compare")
            let value = 
                value_A === 'default' ? ( 
                value_B === 'default'? 
                (value_C === 'default'? "default":value_C):value_B):value_A;
            
            fetchOneStock(interval, value);
            setError("");
        }else{
            setError("Only one symbol should be selected!");
        }

    }

    const fetchOneStock = async (interval='Monthly', value) => {
        const API_KEY = '7VRR35QCQXZYP7C6'; 
        const category = `${interval} Time Series`;
        const count = interval === 'Weekly' ? 60 : 20;
        let A_xValues, A_yValues;
        try {
            let API_Call = `https://www.alphavantage.co/query?function=TIME_SERIES_${interval}&symbol=${value}&apikey=${API_KEY}&datatype=json`;
            let res = await fetch(API_Call);
            let data = await res.json();
            xValues = [];
            yValues = [];
            
            for (var key in data[category]) {
                if(key && key >= startDate && key <= endDate){
                    xValues.push(key);
                    yValues.push(data[category][key]['1. open']);
                }
            }
            
            A_xValues = xValues.slice(0,Math.min(count, xValues.length));
            A_yValues = yValues.slice(0,Math.min(count, yValues.length));
    
            if(A_xValues === null || A_xValues.length === 0) setInfo(`${value_A} is empty.`);
    
            setStockChartXValues_A(A_xValues);
            setStockChartYValues_A(A_yValues);

            setButtonOneLabel('Display One');
            setButtonOneDisable(true);
        }catch(error){
            setError("Can't fetch one stock data");
        }
    }

    //API KEY .......... for ALphaVantage
    const fetchCompareStock = async (interval='Weekly') => {
        
        const API_KEY = '7VRR35QCQXZYP7C6'; 
        const category = `${interval} Time Series`;
        const count = interval === 'Weekly' ? 60 : 20;
        let A_xValues, A_yValues, B_xValues, B_yValues, C_xValues, C_yValues;
        
        try {
            let API_Call = `https://www.alphavantage.co/query?function=TIME_SERIES_${interval}&symbol=${value_A}&apikey=${API_KEY}&datatype=json`;
            let res = await fetch(API_Call);
            let data = await res.json();
    
            xValues = [];
            yValues = [];
            
            for (var key in data[category]) {
                if(key && key >= startDate && key <= endDate){
                    xValues.push(key);
                    yValues.push(data[category][key]['1. open']);
                }
            }
            
            A_xValues = xValues.slice(0,Math.min(count, xValues.length));
            A_yValues = yValues.slice(0,Math.min(count, yValues.length));
    
            if(A_xValues === null || A_xValues.length === 0) setInfo(`${value_A} is empty.`);
    
            setStockChartXValues_A(A_xValues);
            setStockChartYValues_A(A_yValues);

            API_Call = `https://www.alphavantage.co/query?function=TIME_SERIES_${interval}&symbol=${value_B}&apikey=${API_KEY}&datatype=json`;
            res = await fetch(API_Call);
            data = await res.json();

            xValues = [];
            yValues = [];
            
            for (key in data[category]) {
                if(key && key >= startDate && key <= endDate)
                xValues.push(key);
                yValues.push(data[category][key]['1. open']);
            }
            
            B_xValues = xValues.slice(0,Math.min(count, xValues.length));
            B_yValues = yValues.slice(0,Math.min(count, yValues.length));

            if(B_xValues === null || B_xValues.length === 0) setInfo(`${value_B} is empty.`);

            setStockChartXValues_B(B_xValues);
            setStockChartYValues_B(B_yValues);

            API_Call = `https://www.alphavantage.co/query?function=TIME_SERIES_${interval}&symbol=${value_C}&apikey=${API_KEY}&datatype=json`;
            res = await fetch(API_Call);
            data = await res.json();

            xValues = [];
            yValues = [];

            for (key in data[category]) {
                if(key && key >= startDate && key <= endDate)
                xValues.push(key);
                yValues.push(data[category][key]['1. open']);
            }

            C_xValues = xValues.slice(0,Math.min(count, xValues.length));
            C_yValues = yValues.slice(0,Math.min(count, yValues.length));

            if(C_xValues === null || C_xValues.length === 0) setInfo(`${value_C} is empty.`);

            setStockChartXValues_C(C_xValues);
            setStockChartYValues_C(C_yValues);
            
            setButtonLabel('Compare');
            setButtonDisable(true);
            setButtonOneLabel('Display One');
            setButtonOneDisable(true);
        }catch(error){
            setError("Can't fetch data");
        }
    }

    const listItems = stockNames.map((item, i) =>
        <option key={i} value={item}>{item}</option>
    );

    return (


        <div className="App" style={{backgroundColor:'#343EA3'}}>

            <br />

            <h1>COMPARING STOCK PRICE</h1>
            <div className="form-group">
                <input type='date' value={startDate} onChange={handleStartDate} />
                <input type='date' value={endDate} onChange={handleEndDate}/>
            </div>
            <div className="form-group">
                <button onClick={changeInterval} className="form-control btn btn-whatever">{button_interval_label}</button>
                <select value={value_A} onChange={handleChange_A}>
                    <option value="default" disabled hidden>
                        Select Stock
                    </option>
                    {listItems}
                </select>
                <select value={value_B} onChange={handleChange_B}>
                    <option value="default" disabled hidden>
                        Select Stock
                    </option>
                    {listItems}
                </select>
                <select value={value_C} onChange={handleChange_C}>
                    <option value="default" disabled hidden>
                        Select Stock
                    </option>
                    {listItems}
                </select>
                <button onClick={handleSubmit} disabled={button_disable} className="form-control btn btn-whatever">{button_label}</button>
                <button onClick={handleOneDisplay} disabled={button_one_disable} className="form-control btn btn-whatever">{button_one_label}</button>
                <button onClick={clearState} className="form-control btn btn-whatever">Clear</button>
            </div>
            <h4>Stock Symbol: <span id="demo">{value_A} | {value_B} | {value_C}</span></h4>
            <h4 style={{color:'red'}}>{error}</h4>
            <h4 style={{color:'#343EA3'}}>{info}</h4>
            <Plot bsStyle="primary" 
                labels={[
                    'asd',
                    'asdfsdf'
                ]}
                data={[
                    {
                        //labels
                        name : value_A,
                        x: stockChartXValues_A,
                        y: stockChartYValues_A,
                        type: 'scatter',
                        mode: 'lines+markers',
                        marker: { color: '#333444', sizemin: 0 }
                    },
                    {
                        //labels
                        name : value_B,
                        x: stockChartXValues_B,
                        y: stockChartYValues_B,
                        type: 'scatter',
                        mode: 'lines+markers',
                        marker: { color: '#394df2', sizemin: 0 }
                    },
                    {
                        name : value_C,
                        x: stockChartXValues_C,
                        y: stockChartYValues_C,
                        type: 'scatter',
                        mode: 'lines+markers',
                        marker: { color: '#992341', sizemin: 0 }
                    }
                ]}
                config={{
                    scrollZoom:true,
                    // showLink:true
                }}
                // onRelayout={() => {
                    // handleOneDisplay('Weekly')}}
                
                layout={{ width: 950, height: 500, title: 'STOCK CHART ', label:['DATE ','PRICE PER SHARE']}}
            />
        </div>
    )

}

