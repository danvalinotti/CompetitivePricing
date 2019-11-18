import React, {Component} from 'react'
import HeaderComponent from './HeaderComponent'
import * as Sorting from './Sorting'
import '../../assests/sass/dashboardstyles.css'
import Typography from '@material-ui/core/Typography'
import CloudDownloadIcon from '@material-ui/icons/CloudDownload'
import {withRouter} from 'react-router-dom'
import Axios from 'axios'
import {authenticateUser} from '../services/authService';
import Icons from './Icons'

class DashBoardViewComponent extends Component {
    constructor(props) {
        super(props);
        authenticateUser(this);
        this.state = {
            dashBoardDrugsData: [],
            filteredList: [],
            drugSort: 'off',
            insideRxSort: 'off',
            pharmCardSort: 'off',
            wellRxSort: 'off',
            medImpactSort: 'off',
            singleCareSort: 'off',
            blinkHealthSort: 'off',
            goodRxSort: 'off',
            lowestPriceSort: 'off',
            loggedInProfile: {}
        };
        this.getDashboardDrugs();
        this.clickHome = this.clickHome.bind(this);
        this.clickDashboard = this.clickDashboard.bind(this);
        this.clickReports = this.clickReports.bind(this)
    }

    exportDrugs() {
        const exportList = [
            [
                'Drug Name',
                'Drug Type',
                'Dosage Strength',
                'Quantity',
                'Zip Code',
                'Inside Rx Price',
                'U.S Pharmacy Card Price',
                'Well Rx Price',
                'MedImpact Price',
                'Singlecare Price',
                'Blink Price',
                'GoodRx Price',
                'Recommended Price',
                'Difference'
            ]
        ];
        this.state.filteredList.forEach((element) => {
            const row = [
                element.name,
                element.drugType,
                element.dosageStrength + ' ' + element.dosageUOM,
                element.quantity,
                '= "' + element.zipcode + '"',
                element.programs[0].price,
                element.programs[1].price,
                element.programs[2].price,
                element.programs[3].price,
                element.programs[4].price,
                element.programs[5].price,
                element.programs[6].price,
                element.recommendedPrice,
                element.recommendedDiff
            ];
            exportList.push(row)
        });
        let csvContent = 'data:text/csv;charset=utf-8,';
        exportList.forEach(function (rowArray) {
            let row = rowArray.join(',');
            csvContent += row + '\r\n'
        });
        const encodedUri = encodeURI(csvContent);
        const link = document.createElement('a');
        link.setAttribute('href', encodedUri);
        link.setAttribute('download', 'DashboardDrugs.csv');
        document.body.appendChild(link); // Required for FF
        link.click() // This will download the data file named "my_data.csv".
    }

    deleteDrug(drug, index) {
        Axios.post(process.env.API_URL + '/dashboard/drug/delete', drug).then(
            () => {
                this.setState({
                    dashBoardDrugsData: this.state.dashBoardDrugsData.splice(index, 1)
                })
            }
        )
    }

    getDashboardDrugs() {
        const strtoken = window.sessionStorage.getItem('token');
        const token = {};
        token.value = strtoken;
        token.key = strtoken;
        Axios.post(process.env.API_URL + '/dashboard/get', token).then(response => {
            console.log(response.data);
            this.setState({
                dashBoardDrugsData: response.data,
                filteredList: response.data
            })
        })
    }

    round(num) {
        let num2 = Number(num).toFixed(2);
        if (num2 === 'NaN') {
            num2 = 'N/A'
        } else {
            num2 = '' + num2;
            num2 = this.addCommas(num2);
            num2 = '$' + num2
        }

        return num2
    }

    addCommas(x) {
        return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')
    }

    getDiv(program) {
        if (program.price !== 'N/A' && program.diff >= 0) {
            return (
                <div style={{color: '#08ca00'}}>
                    <span>{this.round(program.price)}</span>
                    <div style={{fontWeight: 'normal'}}>{this.round(program.diff)}</div>
                </div>
            )
        } else {
            return (
                <div style={{color: 'red'}}>
                    <span>{this.round(program.price)}</span>
                    <div style={{fontWeight: 'normal'}}>{this.round(program.diff)}</div>
                </div>
            )
        }
    }

    getDiv2(price, diff) {
        if (diff >= 0) {
            return (
                <div style={{color: '#08ca00'}}>
                    <span>{this.round(price)}</span>
                    <div style={{fontWeight: 'normal'}}>{this.round(diff)}</div>
                </div>
            )
        } else {
            return (
                <div style={{color: 'red'}}>
                    <span>{this.round(price)}</span>
                    <div style={{fontWeight: 'normal'}}>{this.round(diff)}</div>
                </div>
            )
        }
    }

    filterList(event) {
        const str = event.target.value.toLowerCase();
        const filteredList = [];
        this.state.dashBoardDrugsData.map(val => {
            const drugName = val.name.toLowerCase();
            if (drugName.includes(str)) {
                filteredList.push(val)
            }
        });
        this.setState({
            filteredList: filteredList
        })
    }

    sortByName() {
        let sort = 'off';
        switch (this.state.drugSort) {
            case 'off':
                sort = 'up';
                break;
            case 'up':
                sort = 'down';
                break;
            case 'down':
                sort = 'off';
                break
        }
        this.setState({
            drugSort: sort,
            insideRxSort: 'off',
            pharmCardSort: 'off',
            wellRxSort: 'off',
            medImpactSort: 'off',
            singleCareSort: 'off',
            lowestPriceSort: 'off',
            filteredList: Sorting.sortByName(this.state.filteredList, sort)
        })
    }

    sortByInsideRx() {
        let sort = 'off';
        switch (this.state.insideRxSort) {
            case 'off':
                sort = 'up';
                break;
            case 'up':
                sort = 'down';
                break;
            case 'down':
                sort = 'off';
                break
        }
        this.setState({
            drugSort: 'off',
            insideRxSort: sort,
            pharmCardSort: 'off',
            wellRxSort: 'off',
            medImpactSort: 'off',
            singleCareSort: 'off',
            lowestPriceSort: 'off',
            filteredList: Sorting.sortByProgramPrice(
                this.state.filteredList,
                0,
                sort
            )
        })
    }

    sortByPharmCard() {
        let sort = 'off';
        switch (this.state.pharmCardSort) {
            case 'off':
                sort = 'up';
                break;
            case 'up':
                sort = 'down';
                break;
            case 'down':
                sort = 'off';
                break
        }
        this.setState({
            drugSort: 'off',
            insideRxSort: 'off',
            wellRxSort: 'off',
            medImpactSort: 'off',
            pharmCardSort: sort,
            singleCareSort: 'off',
            lowestPriceSort: 'off',
            filteredList: Sorting.sortByProgramPrice(
                this.state.filteredList,
                1,
                sort
            )
        })
    }

    sortByBlink() {
        let sort = 'off';
        switch (this.state.blinkHealthSort) {
            case 'off':
                sort = 'up';
                break;
            case 'up':
                sort = 'down';
                break;
            case 'down':
                sort = 'off';
                break
        }
        this.setState({
            drugSort: 'off',
            insideRxSort: 'off',
            wellRxSort: 'off',
            medImpactSort: 'off',
            pharmCardSort: 'off',
            singleCareSort: 'off',
            blinkHealthSort: sort,
            goodRxSort: 'off',
            lowestPriceSort: 'off',
            filteredList: Sorting.sortByProgramPrice(
                this.state.filteredList,
                1,
                sort
            )
        })
    }

    sortByGoodRx() {
        let sort = 'off';
        switch (this.state.goodRxSort) {
            case 'off':
                sort = 'up';
                break;
            case 'up':
                sort = 'down';
                break;
            case 'down':
                sort = 'off';
                break
        }
        this.setState({
            drugSort: 'off',
            insideRxSort: 'off',
            wellRxSort: 'off',
            medImpactSort: 'off',
            pharmCardSort: 'off',
            singleCareSort: 'off',
            blinkHealthSort: 'off',
            goodRxSort: sort,
            lowestPriceSort: 'off',
            filteredList: Sorting.sortByProgramPrice(
                this.state.filteredList,
                1,
                sort
            )
        })
    }

    sortByWellRx() {
        let sort = 'off';
        switch (this.state.wellRxSort) {
            case 'off':
                sort = 'up';
                break;
            case 'up':
                sort = 'down';
                break;
            case 'down':
                sort = 'off';
                break
        }
        this.setState({
            drugSort: 'off',
            insideRxSort: 'off',
            wellRxSort: sort,
            medImpactSort: 'off',
            pharmCardSort: 'off',
            singleCareSort: 'off',
            lowestPriceSort: 'off',
            filteredList: Sorting.sortByProgramPrice(
                this.state.filteredList,
                2,
                sort
            )
        })
    }

    sortByMedImpact() {
        let sort = 'off';
        switch (this.state.medImpactSort) {
            case 'off':
                sort = 'up';
                break;
            case 'up':
                sort = 'down';
                break;
            case 'down':
                sort = 'off';
                break
        }

        this.setState({
            drugSort: 'off',
            insideRxSort: 'off',
            wellRxSort: 'off',
            medImpactSort: sort,
            pharmCardSort: 'off',
            singleCareSort: 'off',
            lowestPriceSort: 'off',
            filteredList: Sorting.sortByProgramPrice(
                this.state.filteredList,
                3,
                sort
            )
        })
    }

    sortBySingleCare() {
        let sort = 'off';
        switch (this.state.singleCareSort) {
            case 'off':
                sort = 'up';
                break;
            case 'up':
                sort = 'down';
                break;
            case 'down':
                sort = 'off';
                break
        }
        this.setState({
            drugSort: 'off',
            insideRxSort: 'off',
            wellRxSort: 'off',
            medImpactSort: 'off',
            pharmCardSort: 'off',
            singleCareSort: sort,
            lowestPriceSort: 'off',
            filteredList: Sorting.sortByProgramPrice(
                this.state.filteredList,
                4,
                sort
            )
        })
    }

    clickHome() {
        this.props.history.push({pathname: '/search'})
    }

    clickDashboard() {
        this.props.history.push({pathname: '/viewDashboard'})
    }

    clickReports() {
        this.props.history.push({pathname: '/reports'})
    }

    sortByLowestPrice() {
        let sort = 'off';
        switch (this.state.lowestPriceSort) {
            case 'off':
                sort = 'up';
                break;
            case 'up':
                sort = 'down';
                break;
            case 'down':
                sort = 'off';
                break
        }
        this.setState({
            drugSort: 'off',
            insideRxSort: 'off',
            pharmCardSort: 'off',
            wellRxSort: 'off',
            medImpactSort: 'off',
            singleCareSort: 'off',
            lowestPriceSort: sort,
            filteredList: Sorting.sortByLowestPrice(this.state.filteredList, sort)
        })
    }

    render() {
        return (
            <div>
                <HeaderComponent
                    profile={this.state.loggedInProfile}
                    value={1}
                    clickHome={this.clickHome}
                    clickDashboard={this.clickDashboard}
                    history={this.props.history}
                    clickReports={this.clickReports}
                />
                <div style={{paddingLeft: '10%', paddingRight: '10%'}}>
                    <div
                        className='row'
                        style={{paddingTop: '3%', marginRight: '0px', marginLeft: '0px'}}
                    >
                        <div
                            style={{fontWeight: 'bold'}}
                            style={{
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'center',
                                width: '100%',
                                paddingLeft: '0px'
                            }}
                        >
                            <Typography
                                style={{
                                    padding: '10px',
                                    paddingLeft: '0px',
                                    fontSize: '2rem'
                                }}
                            >
                                Competitive Pricing
                            </Typography>
                            <div className=' headerZip' style={{padding: '0px'}}>
                                <input
                                    className='form-control search-bar '
                                    onChange={() => {
                                        this.filterList(event)
                                    }}
                                    type='text'
                                    id='myZipCode'
                                    placeholder='Filter Dashboard Drugs'
                                />
                            </div>
                        </div>
                    </div>
                    <div style={{paddingTop: '30px'}}>
                        <table className='dashboardPrices'>
                            <thead className='dashboardRows'>
                            <tr>
                                <th
                                    className='tableHeader dashboardCellHeader'
                                    onClick={() => {
                                        this.sortByName()
                                    }}
                                >
                                    <div style={{display: 'inline-flex'}}>
                                        <label
                                            className='dashboardTableHeader'
                                            style={{float: 'left'}}
                                        >
                                            Drug
                                        </label>
                                        <div style={{float: 'left'}}>
                                            {' '}
                                            <Icons
                                                icon={this.state.drugSort}
                                                height='24'
                                                width='24'
                                            />
                                        </div>
                                    </div>
                                </th>
                                <th
                                    className='tableHeader dashboardCellHeader'
                                    onClick={() => {
                                        this.sortByInsideRx()
                                    }}
                                >
                                    <div style={{display: 'inline-flex'}}>
                                        <label
                                            className='dashboardTableHeader'
                                            style={{float: 'left'}}
                                        >
                                            Current Price
                                        </label>
                                        <div style={{float: 'left'}}>
                                            {' '}
                                            <Icons
                                                icon={this.state.insideRxSort}
                                                height='24'
                                                width='24'
                                            />
                                        </div>
                                    </div>
                                </th>
                                <th
                                    className='tableHeader dashboardCellHeader'
                                    onClick={() => {
                                        this.sortByPharmCard()
                                    }}
                                >
                                    <div style={{display: 'inline-flex'}}>
                                        <label
                                            className='dashboardTableHeader'
                                            style={{float: 'left'}}
                                        >
                                            USPharmacy
                                        </label>
                                        <div style={{float: 'left'}}>
                                            {' '}
                                            <Icons
                                                icon={this.state.pharmCardSort}
                                                height='24'
                                                width='24'
                                            />
                                        </div>
                                    </div>
                                </th>
                                <th
                                    className='tableHeader dashboardCellHeader'
                                    onClick={() => {
                                        this.sortByWellRx()
                                    }}
                                >
                                    <div style={{display: 'inline-flex'}}>
                                        <label
                                            className='dashboardTableHeader'
                                            style={{float: 'left'}}
                                        >
                                            WellRx
                                        </label>
                                        <div style={{float: 'left'}}>
                                            {' '}
                                            <Icons
                                                icon={this.state.wellRxSort}
                                                height='24'
                                                width='24'
                                            />
                                        </div>
                                    </div>
                                </th>
                                <th
                                    className='tableHeader dashboardCellHeader'
                                    onClick={() => {
                                        this.sortByMedImpact()
                                    }}
                                >
                                    <div style={{display: 'inline-flex'}}>
                                        <label
                                            className='dashboardTableHeader'
                                            style={{float: 'left'}}
                                        >
                                            MedImpact
                                        </label>
                                        <div style={{float: 'left'}}>
                                            {' '}
                                            <Icons
                                                icon={this.state.medImpactSort}
                                                height='24'
                                                width='24'
                                            />
                                        </div>
                                    </div>
                                </th>
                                <th
                                    className='tableHeader dashboardCellHeader'
                                    onClick={() => {
                                        this.sortByBlink()
                                    }}
                                >
                                    <div style={{display: 'inline-flex'}}>
                                        <label
                                            className='dashboardTableHeader'
                                            style={{float: 'left'}}
                                        >
                                            BlinkHealth
                                        </label>
                                        <div style={{float: 'left'}}>
                                            {' '}
                                            <Icons
                                                icon={this.state.blinkHealthSort}
                                                height='24'
                                                width='24'
                                            />
                                        </div>
                                    </div>
                                </th>
                                <th
                                    className='tableHeader dashboardCellHeader'
                                    onClick={() => {
                                        this.sortBySingleCare()
                                    }}
                                >
                                    <div style={{display: 'inline-flex'}}>
                                        <label
                                            className='dashboardTableHeader'
                                            style={{float: 'left'}}
                                        >
                                            SingleCare
                                        </label>
                                        <div style={{float: 'left'}}>
                                            {' '}
                                            <Icons
                                                icon={this.state.singleCareSort}
                                                height='24'
                                                width='24'
                                            />
                                        </div>
                                    </div>
                                </th>
                                <th
                                    className='tableHeader dashboardCellHeader'
                                    onClick={() => {
                                        this.sortByGoodRx()
                                    }}
                                >
                                    <div style={{display: 'inline-flex'}}>
                                        <label
                                            className='dashboardTableHeader'
                                            style={{float: 'left'}}
                                        >
                                            GoodRx
                                        </label>
                                        <div style={{float: 'left'}}>
                                            {' '}
                                            <Icons
                                                icon={this.state.goodRxSort}
                                                height='24'
                                                width='24'
                                            />
                                        </div>
                                    </div>
                                </th>
                                <th
                                    onClick={() => {
                                        this.sortByLowestPrice()
                                    }}
                                    className='tableHeader dashboardCellHeader'
                                >
                                    <div style={{display: 'inline-flex'}}>
                                        <label
                                            className='dashboardTableHeader'
                                            style={{float: 'left'}}
                                        >
                                            Lowest Market Price
                                        </label>
                                        <div style={{float: 'left'}}>
                                            {' '}
                                            <Icons
                                                icon={this.state.lowestPriceSort}
                                                height='24'
                                                width='24'
                                            />
                                        </div>
                                    </div>
                                </th>
                                <th className='tableHeader dashboardCellHeader'/>
                            </tr>
                            </thead>
                            <tbody>
                            {this.state.filteredList.map((drug, index) => {
                                return (
                                    <tr
                                        className='dashboardRows'
                                        key={index}
                                        style={
                                            index % 2 === 0 ? {backgroundColor: '#d3d3d338'} : {}
                                        }
                                    >
                                        <td>
                        <span className='nameColor'>
                          <strong
                              style={{fontSize: '0.9rem', color: '#000000bf'}}
                          >
                            {drug.name}
                          </strong>
                          <br/>
                          Type: {drug.drugType}
                            <br/>
                          Dosage: {drug.dosageStrength} {drug.dosageUOM} <br/>
                          Quantity: {drug.quantity}
                            <br/>
                          Zip Code: {drug.zipcode}
                            <br/>
                        </span>
                                        </td>
                                        <td>
                        <span className='programPrice colorBlue'>
                          {this.getDiv(drug.programs[0].prices[0])}{' '}
                        </span>
                                            <br/>
                                        </td>
                                        <td>
                        <span className='programPrice colorBlue'>
                          {this.getDiv(drug.programs[1].prices[0])}{' '}
                        </span>
                                            <br/>
                                        </td>
                                        <td>
                        <span className='programPrice colorBlue'>
                          {this.getDiv(drug.programs[2].prices[0])}
                        </span>
                                            <br/>
                                        </td>
                                        <td>
                        <span className='programPrice colorBlue'>
                          {this.getDiv(drug.programs[3].prices[0])}
                        </span>
                                            <br/>
                                        </td>
                                        <td>
                        <span className='programPrice colorBlue'>
                          {this.getDiv(drug.programs[4].prices[0])}
                        </span>
                                            <br/>
                                        </td>
                                        <td>
                        <span className='programPrice colorBlue'>
                          {this.getDiv(drug.programs[5].prices[0])}
                        </span>
                                            <br/>
                                        </td>
                                        <td>
                        <span className='programPrice colorBlue'>
                          {this.getDiv(drug.programs[6].prices[0])}
                        </span>
                                            <br/>
                                        </td>

                                        <td>
                        <span className='programPrice colorBlue'>
                          {this.getDiv2(
                              drug.recommendedPrice,
                              drug.recommendedDiff
                          )}
                        </span>
                                            <br/>
                                        </td>
                                        <td>
                                            {' '}
                                            <div
                                                style={{color: 'red'}}
                                                onClick={() => this.deleteDrug(drug, index)}
                                            >
                                                <div>
                                                    <svg
                                                        xmlns='http://www.w3.org/2000/svg'
                                                        width='24'
                                                        height='24'
                                                        fill='red'
                                                        viewBox='0 0 24 24'
                                                    >
                                                        <path
                                                            d='M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z'/>
                                                        <path d='M0 0h24v24H0z' fill='none'/>
                                                    </svg>
                                                </div>
                                            </div>
                                        </td>
                                    </tr>
                                )
                            })}
                            </tbody>
                        </table>
                        {this.state.filteredList.length === 0 ? (
                            <div style={{textAlign: 'center'}} className='highlightedCell'>
                                No Drugs Added To Dashboard
                            </div>
                        ) : (
                            <div/>
                        )}
                    </div>
                    <div style={{paddingRight: '0px', paddingTop: '15px'}}>
                        <div className='float-sm-right'>
                            <button
                                type='button'
                                style={{marginRight: '10px', display: 'flex'}}
                                onClick={() => {
                                    this.exportDrugs()
                                }}
                                className='btn btn-outline-primary'
                            >
                                <CloudDownloadIcon style={{paddingRight: 5}}/>
                                Export
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

export default withRouter(DashBoardViewComponent)
